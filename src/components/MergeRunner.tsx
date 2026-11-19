import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, GitMerge, Heart, RotateCcw, Trophy, X } from 'lucide-react';
import { snappy, spring } from './motion';

/* ------------------------------------------------------------------ */
/* Levels: original repo-style mazes.                                  */
/* # wall  . commit  T tests passed  D debugger  P you                 */
/* r Race Condition  n Null Pointer  l Memory Leak (bug spawns)        */
/* ------------------------------------------------------------------ */

const LEVELS: string[][] = [
  [
    '###################',
    '#P......#....T...r#',
    '#.#####.#.#####.#.#',
    '#.#.....#.....#.#.#',
    '#.#.###.###.#.#...#',
    '#D#...#.....#.#.###',
    '#.###.#.###.#.#...#',
    '#.....#...#.#...#.#',
    '#.#######.#.#####.#',
    '#.#.....#.#.....#.#',
    '#.#.###.#.#####.#.#',
    '#...#n#.......#...#',
    '#.#.#.#.#####.#.#D#',
    '#T#.....#l........#',
    '###################',
  ],
  [
    '###################',
    '#r..T#.......#...D#',
    '#.##.#.#####.#.#..#',
    '#.#..#.#...#...#.##',
    '#.#.##.#.#.#####..#',
    '#...#....#.....#..#',
    '###.#.######.#.#.##',
    '#...#......#.#....#',
    '#.######.#.#.####.#',
    '#.....#..#P#....#.#',
    '#.###.#.##.####.#.#',
    '#D#.....#.....#...#',
    '#.#.###.#.###.#.#.#',
    '#n..#.....#l..T.#.#',
    '###################',
  ],
];

const COLS = 19;
const ROWS = 15;
const LIVES = 3;
const BEST_KEY = 'merge-runner-best';
const FREEZE_MS = 5500;

type Dir = { dx: number; dy: number };
const NONE: Dir = { dx: 0, dy: 0 };
const DIRS: Dir[] = [
  { dx: 1, dy: 0 },
  { dx: -1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: 0, dy: -1 },
];
const same = (a: Dir, b: Dir) => a.dx === b.dx && a.dy === b.dy;
const isNone = (d: Dir) => d.dx === 0 && d.dy === 0;
const reverse = (d: Dir): Dir => ({ dx: -d.dx, dy: -d.dy });

type BugKind = 'race' | 'null' | 'leak';
const BUG_INFO: Record<BugKind, { name: string; color: string; speed: number }> = {
  race: { name: 'Race Condition', color: '255,69,58', speed: 3.4 },
  null: { name: 'Null Pointer', color: '191,90,242', speed: 3.2 },
  leak: { name: 'Memory Leak', color: '255,159,10', speed: 2.5 },
};

interface Mover {
  tx: number; // tile we're leaving
  ty: number;
  dir: Dir;
  t: number; // progress 0..1 toward the next tile
}
interface Bug extends Mover {
  kind: BugKind;
  spawn: { x: number; y: number };
  deadUntil: number;
  nextTeleport: number;
  flashAt: number;
}
interface World {
  walls: boolean[][];
  items: Map<string, 'commit' | 'test' | 'debugger'>;
  player: Mover & { queued: Dir; spawn: { x: number; y: number } };
  bugs: Bug[];
  trail: Map<string, number>; // tile -> expiry
  frozenUntil: number;
  combo: number;
}

const key = (x: number, y: number) => `${x},${y}`;

function buildWorld(levelIndex: number, now: number): World {
  const map = LEVELS[levelIndex % LEVELS.length];
  const walls: boolean[][] = [];
  const items = new Map<string, 'commit' | 'test' | 'debugger'>();
  let player = { x: 1, y: 1 };
  const bugs: Bug[] = [];
  map.forEach((row, y) => {
    walls.push([]);
    [...row].forEach((c, x) => {
      walls[y].push(c === '#');
      if (c === '.') items.set(key(x, y), 'commit');
      if (c === 'T') items.set(key(x, y), 'test');
      if (c === 'D') items.set(key(x, y), 'debugger');
      if (c === 'P') player = { x, y };
      const kind = c === 'r' ? 'race' : c === 'n' ? 'null' : c === 'l' ? 'leak' : null;
      if (kind)
        bugs.push({ kind, tx: x, ty: y, dir: NONE, t: 0, spawn: { x, y }, deadUntil: 0, nextTeleport: now + 7000, flashAt: 0 });
    });
  });
  return {
    walls,
    items,
    player: { tx: player.x, ty: player.y, dir: NONE, t: 0, queued: NONE, spawn: player },
    bugs,
    trail: new Map(),
    frozenUntil: 0,
    combo: 1,
  };
}

const openAt = (w: World, x: number, y: number) => y >= 0 && y < ROWS && x >= 0 && x < COLS && !w.walls[y][x];
const posOf = (m: Mover) => ({ x: m.tx + m.dir.dx * m.t, y: m.ty + m.dir.dy * m.t });

/** Next step toward a target using breadth-first search through the maze. */
function bfsStep(w: World, from: { x: number; y: number }, to: { x: number; y: number }): Dir | null {
  const prev = new Map<string, string>();
  const q = [from];
  prev.set(key(from.x, from.y), '');
  while (q.length) {
    const c = q.shift()!;
    if (c.x === to.x && c.y === to.y) break;
    for (const d of DIRS) {
      const nx = c.x + d.dx;
      const ny = c.y + d.dy;
      if (openAt(w, nx, ny) && !prev.has(key(nx, ny))) {
        prev.set(key(nx, ny), key(c.x, c.y));
        q.push({ x: nx, y: ny });
      }
    }
  }
  let cur = key(to.x, to.y);
  if (!prev.has(cur)) return null;
  const start = key(from.x, from.y);
  while (prev.get(cur) && prev.get(cur) !== start) cur = prev.get(cur)!;
  const [x, y] = cur.split(',').map(Number);
  return { dx: x - from.x, dy: y - from.y };
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

type Phase = 'intro' | 'playing' | 'caught' | 'shipped' | 'over';
interface Hud {
  phase: Phase;
  score: number;
  lives: number;
  level: number;
  message: string;
}

export default function MergeRunner({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLButtonElement>(null);
  const [hud, setHud] = useState<Hud>({ phase: 'intro', score: 0, lives: LIVES, level: 0, message: '' });
  const best = Number(localStorage.getItem(BEST_KEY) || 0);

  // Mutable game state lives in a ref; React only renders the HUD.
  const game = useRef({
    world: buildWorld(0, 0),
    phase: 'intro' as Phase,
    phaseUntil: 0,
    score: 0,
    lives: LIVES,
    level: 0,
    message: '',
    queued: NONE as Dir,
  });

  const syncHud = useCallback(() => {
    const g = game.current;
    setHud((h) =>
      h.phase === g.phase && h.score === g.score && h.lives === g.lives && h.level === g.level && h.message === g.message
        ? h
        : { phase: g.phase, score: g.score, lives: g.lives, level: g.level, message: g.message },
    );
  }, []);

  const start = useCallback(() => {
    const now = performance.now();
    game.current = {
      world: buildWorld(0, now),
      phase: 'playing',
      phaseUntil: 0,
      score: 0,
      lives: LIVES,
      level: 0,
      message: '',
      queued: NONE,
    };
    syncHud();
    wrapRef.current?.focus();
  }, [syncHud]);

  const steer = useCallback((d: Dir) => {
    game.current.queued = d;
    game.current.world.player.queued = d;
  }, []);

  // Keyboard
  useEffect(() => {
    const map: Record<string, Dir> = {
      ArrowRight: DIRS[0], d: DIRS[0], D: DIRS[0],
      ArrowLeft: DIRS[1], a: DIRS[1], A: DIRS[1],
      ArrowDown: DIRS[2], s: DIRS[2], S: DIRS[2],
      ArrowUp: DIRS[3], w: DIRS[3], W: DIRS[3],
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose();
      const d = map[e.key];
      if (d && game.current.phase !== 'intro' && game.current.phase !== 'over') {
        e.preventDefault();
        steer(d);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, steer]);

  // Lock page scroll; restore focus on close
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
      previous?.focus?.();
    };
  }, []);

  useEffect(() => {
    if (hud.phase === 'intro' || hud.phase === 'over') primaryRef.current?.focus();
    if (hud.phase === 'over' && hud.score > best) localStorage.setItem(BEST_KEY, String(hud.score));
  }, [hud.phase, hud.score, best]);

  // Game loop + rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let tile = 20;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const maxH = Math.min(window.innerHeight * 0.55, 520);
      tile = Math.floor(Math.min(wrap.clientWidth / COLS, maxH / ROWS));
      canvas.style.width = `${tile * COLS}px`;
      canvas.style.height = `${tile * ROWS}px`;
      canvas.width = tile * COLS * dpr;
      canvas.height = tile * ROWS * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    const css = (name: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim().split(/\s+/).join(',');

    const levelSpeed = () => 1 + game.current.level * 0.12;

    /** Advance a mover; `decide` picks a direction whenever it reaches a tile centre. */
    const advance = (w: World, m: Mover, distance: number, decide: (m: Mover) => Dir) => {
      let left = distance;
      let guard = 0;
      while (left > 0 && guard++ < 8) {
        if (isNone(m.dir)) {
          m.dir = decide(m);
          if (isNone(m.dir)) return;
        }
        const need = 1 - m.t;
        if (left < need) {
          m.t += left;
          return;
        }
        left -= need;
        m.tx += m.dir.dx;
        m.ty += m.dir.dy;
        m.t = 0;
        onArrive(w, m);
        m.dir = decide(m);
        if (isNone(m.dir)) return;
      }
    };

    const onArrive = (w: World, m: Mover) => {
      const g = game.current;
      if (m === w.player) {
        const k = key(m.tx, m.ty);
        const item = w.items.get(k);
        if (item) {
          w.items.delete(k);
          if (item === 'commit') g.score += 10;
          if (item === 'test') g.score += 50;
          if (item === 'debugger') {
            w.frozenUntil = performance.now() + FREEZE_MS;
            w.combo = 1;
            g.message = 'Debugger attached. Bugs frozen!';
          }
        }
      } else {
        const bug = m as Bug;
        if (bug.kind === 'leak') w.trail.set(key(m.tx, m.ty), performance.now() + 5000);
      }
    };

    const playerDecide = (w: World) => (m: Mover) => {
      const p = w.player;
      if (!isNone(p.queued) && openAt(w, m.tx + p.queued.dx, m.ty + p.queued.dy)) return p.queued;
      if (!isNone(m.dir) && openAt(w, m.tx + m.dir.dx, m.ty + m.dir.dy)) return m.dir;
      return NONE;
    };

    const bugDecide = (w: World, bug: Bug) => (m: Mover) => {
      const options = DIRS.filter((d) => openAt(w, m.tx + d.dx, m.ty + d.dy));
      const forward = options.filter((d) => isNone(m.dir) || !same(d, reverse(m.dir)));
      const choices = forward.length ? forward : options;
      if (!choices.length) return NONE;
      const target = { x: w.player.tx, y: w.player.ty };
      if (bug.kind === 'leak') {
        return bfsStep(w, { x: m.tx, y: m.ty }, target) ?? choices[0];
      }
      if (bug.kind === 'race' && Math.random() > 0.15) {
        return choices.reduce((a, b) =>
          Math.hypot(m.tx + a.dx - target.x, m.ty + a.dy - target.y) <=
          Math.hypot(m.tx + b.dx - target.x, m.ty + b.dy - target.y)
            ? a
            : b,
        );
      }
      return choices[Math.floor(Math.random() * choices.length)];
    };

    const resetPositions = (w: World) => {
      Object.assign(w.player, { tx: w.player.spawn.x, ty: w.player.spawn.y, dir: NONE, t: 0, queued: NONE });
      for (const b of w.bugs) Object.assign(b, { tx: b.spawn.x, ty: b.spawn.y, dir: NONE, t: 0, deadUntil: 0 });
      w.frozenUntil = 0;
      w.trail.clear();
    };

    const update = (dt: number, now: number) => {
      const g = game.current;
      const w = g.world;

      if (g.phase === 'caught' && now >= g.phaseUntil) {
        if (g.lives <= 0) g.phase = 'over';
        else {
          resetPositions(w);
          g.phase = 'playing';
          g.message = '';
        }
      }
      if (g.phase === 'shipped' && now >= g.phaseUntil) {
        g.level += 1;
        g.world = buildWorld(g.level, now);
        g.phase = 'playing';
        g.message = '';
      }
      if (g.phase !== 'playing') return;

      const sp = levelSpeed();
      const onTrail = w.trail.has(key(Math.round(posOf(w.player).x), Math.round(posOf(w.player).y)));
      // Reversing mid-corridor is always allowed and immediate.
      const p = w.player;
      if (!isNone(p.dir) && !isNone(p.queued) && same(p.queued, reverse(p.dir))) {
        p.tx += p.dir.dx;
        p.ty += p.dir.dy;
        p.dir = p.queued;
        p.t = 1 - p.t;
      }
      advance(w, p, 5.2 * sp * (onTrail ? 0.55 : 1) * dt, playerDecide(w));

      const frozen = now < w.frozenUntil;
      for (const b of w.bugs) {
        if (b.deadUntil) {
          if (now < b.deadUntil) continue;
          Object.assign(b, { tx: b.spawn.x, ty: b.spawn.y, dir: NONE, t: 0, deadUntil: 0 });
        }
        if (frozen) continue;
        // Null Pointer: every few seconds it dereferences somewhere else entirely.
        if (b.kind === 'null' && now >= b.nextTeleport && b.t === 0) {
          const pp = posOf(p);
          const spots: Array<{ x: number; y: number }> = [];
          for (let y = 0; y < ROWS; y++)
            for (let x = 0; x < COLS; x++)
              if (openAt(w, x, y) && Math.abs(x - pp.x) + Math.abs(y - pp.y) > 8) spots.push({ x, y });
          const s = spots[Math.floor(Math.random() * spots.length)];
          if (s) Object.assign(b, { tx: s.x, ty: s.y, dir: NONE, t: 0, flashAt: now });
          b.nextTeleport = now + 6000 + Math.random() * 3000;
        }
        let speed = BUG_INFO[b.kind].speed * sp;
        if (b.kind === 'race') {
          const straight = !isNone(b.dir) && openAt(w, b.tx + b.dir.dx, b.ty + b.dir.dy);
          speed *= straight ? 1.35 : 0.85;
        }
        advance(w, b, speed * dt, bugDecide(w, b));
      }

      // Expire leak trail
      for (const [k, exp] of w.trail) if (exp < now) w.trail.delete(k);

      // Collisions
      const pp = posOf(p);
      for (const b of w.bugs) {
        if (b.deadUntil) continue;
        const bp = posOf(b);
        if (Math.hypot(bp.x - pp.x, bp.y - pp.y) < 0.6) {
          if (frozen) {
            g.score += 200 * w.combo;
            g.message = `Squashed ${BUG_INFO[b.kind].name}! +${200 * w.combo}`;
            w.combo *= 2;
            b.deadUntil = now + 4000;
          } else {
            g.lives -= 1;
            g.phase = 'caught';
            g.phaseUntil = now + 1300;
            g.message = `${BUG_INFO[b.kind].name} got you`;
            return;
          }
        }
      }

      if (w.items.size === 0) {
        g.score += 500;
        g.phase = 'shipped';
        g.phaseUntil = now + 1700;
        g.message = `v1.${g.level + 1}.0 shipped! +500`;
      }
    };

    const draw = (now: number) => {
      const g = game.current;
      const w = g.world;
      const W = tile * COLS;
      const H = tile * ROWS;
      const ink = css('--ink');
      const ink3 = css('--ink-3');
      const accent = css('--accent');
      const surface2 = css('--surface-2');
      const success = css('--success');
      ctx.clearRect(0, 0, W, H);

      // Walls: rounded "folder" blocks
      ctx.fillStyle = `rgb(${surface2})`;
      for (let y = 0; y < ROWS; y++)
        for (let x = 0; x < COLS; x++)
          if (w.walls[y][x]) {
            ctx.beginPath();
            ctx.roundRect(x * tile + 1, y * tile + 1, tile - 2, tile - 2, tile * 0.22);
            ctx.fill();
          }

      // Leak trail
      for (const [k] of w.trail) {
        const [x, y] = k.split(',').map(Number);
        ctx.fillStyle = 'rgba(255,159,10,0.16)';
        ctx.fillRect(x * tile + 2, y * tile + 2, tile - 4, tile - 4);
      }

      // Items
      for (const [k, item] of w.items) {
        const [x, y] = k.split(',').map(Number);
        const cx = x * tile + tile / 2;
        const cy = y * tile + tile / 2;
        if (item === 'commit') {
          ctx.fillStyle = `rgba(${ink3},0.9)`;
          ctx.beginPath();
          ctx.arc(cx, cy, Math.max(1.6, tile * 0.09), 0, Math.PI * 2);
          ctx.fill();
        } else if (item === 'test') {
          ctx.strokeStyle = `rgb(${success})`;
          ctx.lineWidth = Math.max(2, tile * 0.12);
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(cx - tile * 0.22, cy);
          ctx.lineTo(cx - tile * 0.05, cy + tile * 0.17);
          ctx.lineTo(cx + tile * 0.25, cy - tile * 0.18);
          ctx.stroke();
        } else {
          const pulse = 0.75 + 0.25 * Math.sin(now / 180);
          ctx.strokeStyle = `rgba(${accent},${pulse})`;
          ctx.lineWidth = Math.max(1.5, tile * 0.08);
          ctx.beginPath();
          ctx.arc(cx, cy, tile * 0.36, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = `rgb(${accent})`;
          ctx.font = `800 ${tile * 0.42}px ui-monospace, SF Mono, Menlo, monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('{}', cx, cy + 1);
        }
      }

      // Bugs
      const frozen = now < w.frozenUntil;
      const blink = frozen && w.frozenUntil - now < 1500 && Math.floor(now / 150) % 2 === 0;
      for (const b of w.bugs) {
        if (b.deadUntil) continue;
        const bp = posOf(b);
        const cx = bp.x * tile + tile / 2;
        const cy = bp.y * tile + tile / 2;
        const color = frozen && !blink ? '100,210,255' : BUG_INFO[b.kind].color;
        const angle = isNone(b.dir) ? -Math.PI / 2 : Math.atan2(b.dir.dy, b.dir.dx);
        const wiggle = frozen ? 0 : Math.sin(now / 60 + b.spawn.x) * 0.25;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle + Math.PI / 2);
        // legs
        ctx.strokeStyle = `rgba(${color},0.9)`;
        ctx.lineWidth = Math.max(1, tile * 0.06);
        for (const side of [-1, 1])
          for (const ly of [-0.12, 0.04, 0.2]) {
            ctx.beginPath();
            ctx.moveTo(side * tile * 0.16, ly * tile);
            ctx.lineTo(side * tile * 0.36, (ly + (side > 0 ? wiggle : -wiggle) * 0.3) * tile);
            ctx.stroke();
          }
        // body + head
        ctx.fillStyle = `rgb(${color})`;
        ctx.beginPath();
        ctx.ellipse(0, tile * 0.06, tile * 0.2, tile * 0.27, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, -tile * 0.24, tile * 0.11, 0, Math.PI * 2);
        ctx.fill();
        // shell seam
        ctx.strokeStyle = 'rgba(0,0,0,0.35)';
        ctx.beginPath();
        ctx.moveTo(0, -tile * 0.18);
        ctx.lineTo(0, tile * 0.32);
        ctx.stroke();
        ctx.restore();
        // teleport flash
        if (now - b.flashAt < 400) {
          ctx.strokeStyle = `rgba(${color},${1 - (now - b.flashAt) / 400})`;
          ctx.beginPath();
          ctx.arc(cx, cy, tile * (0.4 + (now - b.flashAt) / 400), 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Player: a glowing cursor pointing where it's heading
      const p = w.player;
      const pp = posOf(p);
      const cx = pp.x * tile + tile / 2;
      const cy = pp.y * tile + tile / 2;
      const facing = !isNone(p.dir) ? p.dir : !isNone(p.queued) ? p.queued : DIRS[0];
      const hit = g.phase === 'caught' && Math.floor(now / 120) % 2 === 0;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(Math.atan2(facing.dy, facing.dx));
      ctx.shadowColor = `rgba(${accent},0.8)`;
      ctx.shadowBlur = tile * 0.6;
      ctx.fillStyle = hit ? `rgba(${ink},0.3)` : `rgb(${accent})`;
      ctx.beginPath();
      ctx.moveTo(tile * 0.34, 0);
      ctx.lineTo(-tile * 0.24, -tile * 0.28);
      ctx.lineTo(-tile * 0.1, 0);
      ctx.lineTo(-tile * 0.24, tile * 0.28);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    let raf = 0;
    let last = performance.now();
    let paused = false;
    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!paused) {
        update(dt, now);
        draw(now);
        syncHud();
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onVis = () => {
      paused = document.hidden;
      last = performance.now();
    };
    document.addEventListener('visibilitychange', onVis);

    // Swipe to steer
    let sx = 0;
    let sy = 0;
    const down = (e: PointerEvent) => {
      sx = e.clientX;
      sy = e.clientY;
    };
    const up = (e: PointerEvent) => {
      const dx = e.clientX - sx;
      const dy = e.clientY - sy;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return;
      steer(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? DIRS[0] : DIRS[1]) : dy > 0 ? DIRS[2] : DIRS[3]);
    };
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointerup', up);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointerup', up);
    };
  }, [steer, syncHud]);

  const playing = hud.phase === 'playing' || hud.phase === 'caught' || hud.phase === 'shipped';

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={onClose} aria-hidden />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="merge-title"
        initial={{ y: 40, scale: 0.97, opacity: 0, filter: 'blur(10px)' }}
        animate={{ y: 0, scale: 1, opacity: 1, filter: 'blur(0px)' }}
        exit={{ y: 40, scale: 0.97, opacity: 0, filter: 'blur(10px)' }}
        transition={spring}
        className="relative flex max-h-[94dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[1.75rem] bg-surface shadow-float ring-1 ring-line/10 sm:rounded-[1.75rem]"
      >
        <div className="flex items-center gap-3 border-b border-line/[0.07] px-5 py-4">
          <GitMerge size={20} className="text-accent" />
          <h2 id="merge-title" className="font-semibold tracking-tight">
            Merge Runner
          </h2>
          {playing && (
            <div className="ml-auto flex items-center gap-4 font-mono text-sm tabular-nums">
              <span>v1.{hud.level}</span>
              <span className="flex gap-0.5" aria-label={`${hud.lives} lives left`}>
                {Array.from({ length: LIVES }).map((_, i) => (
                  <Heart key={i} size={15} className={i < hud.lives ? 'fill-[#ff3b30] text-[#ff3b30]' : 'text-ink-3'} />
                ))}
              </span>
              <span aria-label={`Score ${hud.score}`}>{hud.score}</span>
            </div>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close game"
            className={`grid h-8 w-8 place-items-center rounded-full text-ink-2 hover:bg-line/[0.07] hover:text-ink ${
              playing ? '' : 'ml-auto'
            }`}
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
          {/* Board stays mounted so the loop keeps its canvas; overlays sit on top. */}
          <div
            ref={wrapRef}
            tabIndex={-1}
            className="relative flex justify-center outline-none focus-visible:outline-none"
            aria-label="Merge Runner board. Use arrow keys or swipe to move."
          >
            <canvas ref={canvasRef} className="touch-none rounded-xl" />

            {(hud.phase === 'intro' || hud.phase === 'over') && (
              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-surface/85 p-5 backdrop-blur-sm">
                {hud.phase === 'intro' ? (
                  <div className="max-w-sm text-center">
                    <p className="text-lg leading-snug">
                      Collect every commit to ship the release. Dodge the bugs.
                    </p>
                    <ul className="mt-4 space-y-1.5 text-left text-sm text-ink-2">
                      <li>
                        <span className="font-semibold text-[#ff453a]">Race Condition</span> is fastest on straights.
                      </li>
                      <li>
                        <span className="font-semibold text-[#bf5af2]">Null Pointer</span> teleports without warning.
                      </li>
                      <li>
                        <span className="font-semibold text-[#ff9f0a]">Memory Leak</span> is slow, but its trail slows you
                        down.
                      </li>
                      <li>
                        Grab a <span className="font-mono text-accent">{'{}'}</span> debugger to freeze bugs and squash them.
                      </li>
                    </ul>
                    <motion.button
                      ref={primaryRef}
                      type="button"
                      onClick={start}
                      whileTap={{ scale: 0.97 }}
                      transition={snappy}
                      className="btn-primary mt-5"
                    >
                      Start
                    </motion.button>
                    <p className="caption mt-3">
                      <span className="pointer-coarse:hidden">Arrow keys or WASD</span>
                      <span className="hidden pointer-coarse:inline">Swipe or use the pad below</span>
                      {best > 0 && (
                        <span className="ml-2 inline-flex items-center gap-1">
                          · <Trophy size={12} /> Best {best}
                        </span>
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="eyebrow">Build failed</p>
                    <p className="mt-2 text-[3.25rem] font-bold leading-none tracking-tighter tabular-nums">{hud.score}</p>
                    <p className="mt-1 text-ink-2">
                      {hud.score > best ? 'New best score!' : `Best: ${Math.max(best, hud.score)}`} · reached v1.{hud.level}
                    </p>
                    <div className="mt-5 flex justify-center gap-3">
                      <motion.button
                        ref={primaryRef}
                        type="button"
                        onClick={start}
                        whileTap={{ scale: 0.97 }}
                        transition={snappy}
                        className="btn-primary"
                      >
                        <RotateCcw size={16} /> Play again
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={onClose}
                        whileTap={{ scale: 0.97 }}
                        transition={snappy}
                        className="btn-secondary"
                      >
                        Back
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <p
            aria-live="polite"
            className={`mt-3 h-5 text-center text-sm ${
              hud.phase === 'caught' ? 'text-[#ff3b30]' : hud.phase === 'shipped' ? 'text-success' : 'text-ink-2'
            }`}
          >
            {playing ? hud.message : ''}
          </p>

          {/* On-screen pad for touch devices */}
          <div className="mx-auto mt-2 hidden w-40 grid-cols-3 gap-1.5 pointer-coarse:grid">
            {[
              [null, DIRS[3], null],
              [DIRS[1], null, DIRS[0]],
              [null, DIRS[2], null],
            ]
              .flat()
              .map((d, i) =>
                d ? (
                  <motion.button
                    key={i}
                    type="button"
                    aria-label={d.dx === 1 ? 'Right' : d.dx === -1 ? 'Left' : d.dy === 1 ? 'Down' : 'Up'}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      steer(d);
                    }}
                    whileTap={{ scale: 0.9 }}
                    transition={snappy}
                    className="grid aspect-square place-items-center rounded-2xl bg-surface-2 text-ink-2 active:text-accent"
                  >
                    {d.dx === 1 ? <ArrowRight size={18} /> : d.dx === -1 ? <ArrowLeft size={18} /> : d.dy === 1 ? <ArrowDown size={18} /> : <ArrowUp size={18} />}
                  </motion.button>
                ) : (
                  <span key={i} />
                ),
              )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

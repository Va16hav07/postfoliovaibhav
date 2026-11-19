import { useEffect, useRef } from 'react';
import { getSkill, onSkillChange } from './skillFilter';

/**
 * A 3D graph of my work: me in the centre, companies and projects in the middle shell,
 * skills on the outer shell. Drawn on a 2D canvas with a hand-rolled perspective projection.
 *
 * Interaction follows Apple's fluid-interface rules:
 *  - 1:1 drag that respects where you grabbed,
 *  - release velocity is handed off as momentum that decays smoothly,
 *  - tilt past the limit meets progressive (rubber-band) resistance and springs back,
 *  - motion is always interruptible: grabbing mid-spin stops it where it is.
 */

type Kind = 'me' | 'work' | 'project' | 'skill';
interface GNode {
  id: string;
  label: string;
  kind: Kind;
  target?: string; // section id to scroll to
  project?: string; // case study slug to open
  info?: string; // shown in the hover preview
  x: number;
  y: number;
  z: number;
}

const middle: Array<Omit<GNode, 'x' | 'y' | 'z'>> = [
  { id: 'valzy', label: 'Valzy', kind: 'work', target: 'experience', info: 'SWE Intern · May 2026 – now' },
  { id: 'zuvees', label: 'ZUVEES', kind: 'work', target: 'experience', info: 'SWE Intern · Jul – Dec 2025' },
  { id: 'kubestellar', label: 'KubeStellar', kind: 'work', target: 'experience', info: 'Open Source Intern · 21 merged PRs' },
  { id: 'hf', label: 'Hugging Face', kind: 'work', target: 'open-source', info: 'Merged into Diffusers' },
  { id: 'travel', label: 'Travel Planner', kind: 'project', target: 'work', project: 'travel-planner', info: 'Four LangGraph agents plan a trip' },
  { id: 'peak', label: 'PEAK', kind: 'project', target: 'work', project: 'peak', info: 'AI incident response agent' },
  { id: 'aria', label: 'Aria', kind: 'project', target: 'work', project: 'aria', info: 'Voice agent with memory' },
  { id: 'ojt', label: 'OJT Maker', kind: 'project', target: 'work', project: 'ojt-maker', info: 'Gemini fills your journal PDF · 14★' },
];

const outer: Array<Omit<GNode, 'x' | 'y' | 'z'>> = [
  'TypeScript', 'Python', 'Go', 'React Native', 'React', 'LangGraph', 'MCP', 'Kubernetes',
  'OpenTelemetry', 'Firebase', 'FastAPI', 'Node.js', 'Gemini', 'Groq', 'Docker', 'Rust',
].map((s) => ({ id: s, label: s, kind: 'skill' as const, target: 'about' }));

const edges: Array<[string, string]> = [
  ...middle.map((n) => ['me', n.id] as [string, string]),
  ['valzy', 'React Native'], ['valzy', 'TypeScript'], ['valzy', 'Firebase'],
  ['zuvees', 'Python'], ['zuvees', 'React Native'],
  ['kubestellar', 'OpenTelemetry'], ['kubestellar', 'Kubernetes'], ['kubestellar', 'React'], ['kubestellar', 'Go'],
  ['hf', 'Python'],
  ['travel', 'LangGraph'], ['travel', 'Groq'], ['travel', 'Python'],
  ['peak', 'MCP'], ['peak', 'Node.js'], ['peak', 'React'],
  ['aria', 'Groq'], ['aria', 'Python'],
  ['ojt', 'FastAPI'], ['ojt', 'Gemini'],
  ['me', 'Docker'], ['me', 'Rust'],
];

/** Evenly spread n points on a sphere (Fibonacci lattice). */
function sphere(n: number, r: number, offset = 0) {
  const pts: Array<[number, number, number]> = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - ((i + 0.5) / n) * 2;
    const rad = Math.sqrt(1 - y * y);
    const t = golden * i + offset;
    pts.push([Math.cos(t) * rad * r, y * r * 0.85, Math.sin(t) * rad * r]);
  }
  return pts;
}

function buildNodes(): GNode[] {
  const nodes: GNode[] = [
    { id: 'me', label: 'Vaibhav', kind: 'me', target: 'about', info: 'Software Engineer · Bengaluru', x: 0, y: 0, z: 0 },
  ];
  sphere(middle.length, 0.55, 0.4).forEach(([x, y, z], i) => nodes.push({ ...middle[i], x, y, z }));
  sphere(outer.length, 1, 1.3).forEach(([x, y, z], i) => nodes.push({ ...outer[i], x, y, z }));
  return nodes;
}

function readColor(name: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v.split(/\s+/).join(',');
}

const PITCH_LIMIT = 0.55;
const IDLE_SPEED = 0.00011; // rad per ms
const FOCAL = 2.8;

export default function WorkGraph({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nodes = buildNodes();
    const byId = new Map(nodes.map((n) => [n.id, n]));
    const links = edges
      .map(([a, b]) => [byId.get(a), byId.get(b)] as const)
      .filter((e): e is readonly [GNode, GNode] => Boolean(e[0] && e[1]));
    const neighbours = new Map<string, Set<string>>();
    for (const [a, b] of links) {
      if (!neighbours.has(a.id)) neighbours.set(a.id, new Set());
      if (!neighbours.has(b.id)) neighbours.set(b.id, new Set());
      neighbours.get(a.id)!.add(b.id);
      neighbours.get(b.id)!.add(a.id);
    }

    let colors = { ink: readColor('--ink'), ink2: readColor('--ink-2'), accent: readColor('--accent') };
    const themeObserver = new MutationObserver(() => {
      colors = { ink: readColor('--ink'), ink2: readColor('--ink-2'), accent: readColor('--accent') };
      dirty = true;
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-accent'] });

    // Rotation state
    let yaw = 0.6;
    let pitch = -0.18;
    let vYaw = reduceMotion ? 0 : IDLE_SPEED;
    let vPitch = 0;
    let dragging = false;
    let pointerId = -1;
    let lastX = 0;
    let lastY = 0;
    let downX = 0;
    let downY = 0;
    let samples: Array<{ t: number; dx: number; dy: number }> = [];
    let hovered: GNode | null = null;
    // A skill picked in the skill filter lights up like a hover when nothing is hovered.
    let skillNode: GNode | null = byId.get(getSkill() ?? '') ?? null;
    const offSkill = onSkillChange((skill) => {
      skillNode = skill ? byId.get(skill) ?? null : null;
      dirty = true;
    });
    let dirty = true;

    // Layout
    let width = 0;
    let height = 0;
    let radius = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      radius = Math.min(width, height) * (width < 480 ? 0.33 : 0.37);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dirty = true;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    type P = { n: GNode; sx: number; sy: number; z: number; s: number };
    let projected: P[] = [];

    const project = () => {
      const cy = Math.cos(yaw), sy = Math.sin(yaw);
      const cp = Math.cos(pitch), sp = Math.sin(pitch);
      projected = nodes.map((n) => {
        const x1 = n.x * cy - n.z * sy;
        const z1 = n.x * sy + n.z * cy;
        const y2 = n.y * cp - z1 * sp;
        const z2 = n.y * sp + z1 * cp;
        const s = FOCAL / (FOCAL - z2);
        return { n, sx: width / 2 + x1 * radius * s, sy: height / 2 + y2 * radius * s, z: z2, s };
      });
    };

    const draw = () => {
      project();
      ctx.clearRect(0, 0, width, height);
      const pos = new Map(projected.map((p) => [p.n.id, p]));
      const lead = hovered ?? skillNode;
      const focus = lead ? neighbours.get(lead.id) : undefined;

      // Edges first, faded with depth
      ctx.lineWidth = 1;
      for (const [a, b] of links) {
        const pa = pos.get(a.id)!, pb = pos.get(b.id)!;
        const depth = ((pa.z + pb.z) / 2 + 1) / 2; // 0 back .. 1 front
        const lit = lead && (a.id === lead.id || b.id === lead.id);
        ctx.strokeStyle = lit
          ? `rgba(${colors.accent},0.75)`
          : `rgba(${colors.ink2},${(lead ? 0.05 : 0.1) + depth * 0.18})`;
        ctx.beginPath();
        ctx.moveTo(pa.sx, pa.sy);
        ctx.lineTo(pb.sx, pb.sy);
        ctx.stroke();
      }

      // Nodes back to front
      const ordered = [...projected].sort((a, b) => a.z - b.z);
      for (const p of ordered) {
        const depth = (p.z + 1) / 2;
        const isHover = lead?.id === p.n.id;
        const isNeighbour = focus?.has(p.n.id);
        const dim = lead && !isHover && !isNeighbour;
        const alpha = dim ? 0.18 : 0.3 + depth * 0.7;
        const base = p.n.kind === 'me' ? 7 : p.n.kind === 'skill' ? 3 : 4.5;
        const r = base * p.s;
        const color = p.n.kind === 'skill' ? colors.ink2 : p.n.kind === 'me' ? colors.accent : colors.ink;

        ctx.fillStyle = `rgba(${isHover || isNeighbour ? colors.accent : color},${alpha})`;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, isHover ? r * 1.5 : r, 0, Math.PI * 2);
        ctx.fill();

        const size = (p.n.kind === 'me' ? 15 : p.n.kind === 'skill' ? 11 : 13) * p.s;
        ctx.font = `${p.n.kind === 'skill' ? 500 : 600} ${size}px -apple-system, BlinkMacSystemFont, system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = `rgba(${isHover ? colors.accent : p.n.kind === 'skill' ? colors.ink2 : colors.ink},${alpha})`;
        // Keep labels inside the canvas so edge nodes never get clipped.
        const half = ctx.measureText(p.n.label).width / 2 + 4;
        const lx = Math.min(Math.max(p.sx, half), width - half);
        ctx.fillText(p.n.label, lx, p.sy + r + 4);
      }
    };

    // Hover preview: a small card that follows the hovered node as the graph turns.
    let tipFor: string | null = null;
    const placeTip = () => {
      const tip = tipRef.current;
      if (!tip) return;
      const p = hovered && !dragging ? projected.find((q) => q.n.id === hovered!.id) : undefined;
      if (!p) {
        tip.style.opacity = '0';
        tipFor = null;
        return;
      }
      if (tipFor !== p.n.id) {
        tipFor = p.n.id;
        const linked = neighbours.get(p.n.id)?.size ?? 0;
        const info = p.n.info ?? `Used in ${linked} ${linked === 1 ? 'place' : 'places'}`;
        const action = p.n.project ? 'Click to open case study' : p.n.target ? 'Click to jump there' : '';
        tip.querySelector('[data-title]')!.textContent = p.n.label;
        tip.querySelector('[data-info]')!.textContent = info;
        tip.querySelector('[data-action]')!.textContent = action;
      }
      const above = p.sy > 70;
      tip.style.transform = `translate(${Math.round(p.sx)}px, ${Math.round(p.sy)}px) translate(-50%, ${above ? 'calc(-100% - 14px)' : '18px'})`;
      tip.style.opacity = '1';
    };

    // Animation loop
    let raf = 0;
    let last = performance.now();
    let visible = true;
    const tick = (now: number) => {
      const dt = Math.min(now - last, 48);
      last = now;
      if (!dragging) {
        // Momentum decays toward a gentle idle spin (or to rest with reduced motion).
        const idle = reduceMotion ? 0 : IDLE_SPEED;
        vYaw = idle + (vYaw - idle) * Math.pow(0.996, dt);
        vPitch *= Math.pow(0.994, dt);
        yaw += vYaw * dt;
        pitch += vPitch * dt;
        // Soft boundary: spring back inside the tilt limit.
        const clamped = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, pitch));
        if (clamped !== pitch) {
          pitch += (clamped - pitch) * (1 - Math.pow(0.985, dt));
          vPitch *= 0.8;
        }
        if (Math.abs(vYaw) > 1e-6 || Math.abs(vPitch) > 1e-6 || clamped !== pitch) dirty = true;
      }
      if (dirty) {
        draw();
        placeTip();
        dirty = false;
      }
      raf = visible ? requestAnimationFrame(tick) : 0;
    };
    raf = requestAnimationFrame(tick);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && !document.hidden;
      if (visible && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(canvas);

    // Pointer interaction
    const hit = (x: number, y: number) => {
      const near = projected
        .map((p) => ({ p, d: Math.hypot(p.sx - x, p.sy - y) }))
        .filter((c) => c.d < 22);
      if (!near.length) return null;
      const min = Math.min(...near.map((c) => c.d));
      // Among the closest candidates, prefer the one nearest the viewer.
      return near.filter((c) => c.d < min + 6).sort((a, b) => b.p.z - a.p.z)[0].p.n;
    };
    const local = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      dragging = true;
      pointerId = e.pointerId;
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        /* capture is best-effort */
      }
      lastX = downX = e.clientX;
      lastY = downY = e.clientY;
      vYaw = 0; // grab stops the spin exactly where it is
      vPitch = 0;
      samples = [];
      canvas.style.cursor = 'grabbing';
    };

    const onMove = (e: PointerEvent) => {
      if (dragging && e.pointerId === pointerId) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        const k = Math.PI / Math.max(width, 1);
        yaw += dx * k;
        // Rubber band past the tilt limit: the further out, the more resistance.
        const over = Math.max(0, Math.abs(pitch) - PITCH_LIMIT);
        pitch += (dy * k) / (1 + over * 12);
        const now = performance.now();
        samples.push({ t: now, dx: dx * k, dy: dy * k });
        samples = samples.filter((s) => now - s.t < 100);
        dirty = true;
        return;
      }
      const { x, y } = local(e);
      const n = hit(x, y);
      if (n !== hovered) {
        hovered = n;
        dirty = true;
      }
      canvas.style.cursor = n?.target ? 'pointer' : 'grab';
    };

    const onUp = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== pointerId) return;
      dragging = false;
      canvas.style.cursor = 'grab';
      const moved = Math.hypot(e.clientX - downX, e.clientY - downY);
      if (moved < 5) {
        const { x, y } = local(e);
        const n = hit(x, y);
        if (n?.project) {
          onNavigate?.('work');
          window.dispatchEvent(new CustomEvent('open-project', { detail: n.project }));
        } else if (n?.target) onNavigate?.(n.target);
        vYaw = reduceMotion ? 0 : IDLE_SPEED;
        return;
      }
      // Velocity handoff: keep the speed the finger had at release.
      if (samples.length > 1 && !reduceMotion) {
        const span = Math.max(performance.now() - samples[0].t, 16);
        vYaw = samples.reduce((a, s) => a + s.dx, 0) / span;
        vPitch = samples.reduce((a, s) => a + s.dy, 0) / span;
      }
    };

    const onLeave = () => {
      if (!dragging && hovered) {
        hovered = null;
        dirty = true;
      }
    };

    const onKey = (e: KeyboardEvent) => {
      const step = 0.0016;
      if (e.key === 'ArrowLeft') vYaw -= step;
      else if (e.key === 'ArrowRight') vYaw += step;
      else if (e.key === 'ArrowUp') vPitch -= step / 2;
      else if (e.key === 'ArrowDown') vPitch += step / 2;
      else return;
      e.preventDefault();
    };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('keydown', onKey);
    const onVisibility = () => {
      visible = !document.hidden;
      if (visible && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      themeObserver.disconnect();
      offSkill();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('keydown', onKey);
    };
  }, [onNavigate]);

  return (
    <>
    <canvas
      ref={canvasRef}
      tabIndex={0}
      role="img"
      aria-label="Interactive 3D graph connecting Vaibhav to Valzy, ZUVEES, KubeStellar and Hugging Face, his projects, and skills such as TypeScript, Python, React Native, LangGraph and Kubernetes. Drag or use arrow keys to rotate; click a node to jump to its section."
      className="h-full w-full cursor-grab touch-pan-y select-none outline-none"
    />
      <div
        ref={tipRef}
        aria-hidden
        style={{ opacity: 0 }}
        className="material pointer-events-none absolute left-0 top-0 z-20 w-max max-w-[15rem] rounded-2xl px-3.5 py-2.5 transition-opacity duration-200"
      >
        <p data-title className="text-sm font-semibold tracking-tight" />
        <p data-info className="mt-0.5 text-xs text-ink-2" />
        <p data-action className="mt-1.5 text-[0.6875rem] font-medium text-accent empty:hidden" />
      </div>
    </>
  );
}

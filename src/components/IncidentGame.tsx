import { useCallback, useEffect, useReducer, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, GitCommitHorizontal, Heart, RotateCcw, Trophy, X } from 'lucide-react';
import { snappy, spring } from './motion';

/* ------------------------------------------------------------------ */
/* Game data                                                           */
/* ------------------------------------------------------------------ */

interface Service {
  id: string;
  name: string;
  file: string;
  errors: string[];
}

const SERVICES: Service[] = [
  { id: 'api', name: 'api-gateway', file: 'api/router.go', errors: ['panic: nil map entry in route table', '502 upstream timed out after 30s'] },
  { id: 'auth', name: 'auth', file: 'auth/session.go', errors: ['jwt: token signature is invalid', 'session store: connection refused'] },
  { id: 'checkout', name: 'checkout', file: 'checkout/cart.ts', errors: ["TypeError: cannot read 'total' of undefined", 'RangeError: invalid currency code'] },
  { id: 'search', name: 'search', file: 'search/index.py', errors: ["KeyError: 'embedding'", 'IndexError: list index out of range'] },
  { id: 'payments', name: 'payments', file: 'payments/charge.ts', errors: ['Error: idempotency key reused', 'UnhandledPromiseRejection: card_declined'] },
  { id: 'notify', name: 'notify', file: 'notify/push.ts', errors: ['FCM: registration token not registered', 'TypeError: tokens.map is not a function'] },
];

const CULPRIT_MESSAGES = [
  'refactor: simplify {f}',
  'perf: cache results in {f}',
  'fix: handle empty input in {f}',
  'chore: bump deps, update {f}',
  'feat: new retry logic in {f}',
];
const DECOY_MESSAGES = [
  'docs: update README',
  'style: format {f}',
  'test: add cases for {f}',
  'ci: speed up lint step',
  'chore: rename variables in {f}',
];

const ROUND_MS = 60_000;
const LIVES = 3;
const BEST_KEY = 'incident-commander-best';

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */

interface Commit {
  sha: string;
  message: string;
  file: string;
}
interface Incident {
  id: number;
  service: Service;
  error: string;
  commits: Commit[];
  culprit: string;
  tried: string[];
  spawnedAt: number;
  ttl: number;
}
interface State {
  phase: 'intro' | 'playing' | 'over';
  startedAt: number;
  now: number;
  nextSpawnAt: number;
  nextId: number;
  incidents: Incident[];
  lives: number;
  resolved: number;
  wrong: number;
  missed: number;
  score: number;
  responseTimes: number[];
  flash: { kind: 'good' | 'bad'; text: string; at: number } | null;
}

type Action =
  | { type: 'start'; now: number }
  | { type: 'tick'; now: number }
  | { type: 'pick'; incidentId: number; sha: string; now: number }
  | { type: 'reset' };

const initial: State = {
  phase: 'intro',
  startedAt: 0,
  now: 0,
  nextSpawnAt: 0,
  nextId: 1,
  incidents: [],
  lives: LIVES,
  resolved: 0,
  wrong: 0,
  missed: 0,
  score: 0,
  responseTimes: [],
  flash: null,
};

const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];
const sha = () => Math.random().toString(16).slice(2, 9);
const shuffle = <T,>(xs: T[]) => [...xs].sort(() => Math.random() - 0.5);

/** Difficulty ramps with progress p (0 → 1) through the round. */
const difficulty = (p: number) => ({
  interval: 3200 - 1900 * p,
  ttl: 9500 - 4000 * p,
  maxConcurrent: 1 + Math.min(2, Math.floor(p * 3)),
});

function makeIncident(id: number, now: number, busy: Set<string>, ttl: number): Incident | null {
  const free = SERVICES.filter((s) => !busy.has(s.id));
  if (!free.length) return null;
  const service = pick(free);
  const others = shuffle(SERVICES.filter((s) => s.id !== service.id));
  const culprit: Commit = {
    sha: sha(),
    message: pick(CULPRIT_MESSAGES).replace('{f}', service.file.split('/')[1]),
    file: service.file,
  };
  const decoys: Commit[] = others.slice(0, 2).map((s) => ({
    sha: sha(),
    message: pick(DECOY_MESSAGES).replace('{f}', s.file.split('/')[1]),
    file: s.file,
  }));
  return {
    id,
    service,
    error: pick(service.errors),
    commits: shuffle([culprit, ...decoys]),
    culprit: culprit.sha,
    tried: [],
    spawnedAt: now,
    ttl,
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'reset':
      return initial;

    case 'start':
      return { ...initial, phase: 'playing', startedAt: action.now, now: action.now, nextSpawnAt: action.now + 700 };

    case 'tick': {
      if (state.phase !== 'playing') return state;
      const now = action.now;
      const elapsed = now - state.startedAt;
      let { lives, missed, nextSpawnAt, nextId, flash } = state;

      // Incidents whose timer ran out become outages.
      const live: Incident[] = [];
      for (const inc of state.incidents) {
        if (now - inc.spawnedAt >= inc.ttl) {
          lives -= 1;
          missed += 1;
          flash = { kind: 'bad', text: `${inc.service.name} went down`, at: now };
        } else live.push(inc);
      }

      if (lives <= 0 || elapsed >= ROUND_MS) {
        return { ...state, now, lives: Math.max(lives, 0), missed, incidents: live, flash, phase: 'over' };
      }

      const d = difficulty(elapsed / ROUND_MS);
      if (now >= nextSpawnAt && live.length < d.maxConcurrent) {
        const inc = makeIncident(nextId, now, new Set(live.map((i) => i.service.id)), d.ttl);
        if (inc) {
          live.push(inc);
          nextId += 1;
        }
        nextSpawnAt = now + d.interval;
      }

      return { ...state, now, lives, missed, nextSpawnAt, nextId, flash, incidents: live };
    }

    case 'pick': {
      if (state.phase !== 'playing') return state;
      const inc = state.incidents.find((i) => i.id === action.incidentId);
      if (!inc || inc.tried.includes(action.sha)) return state;

      if (action.sha === inc.culprit) {
        const rt = action.now - inc.spawnedAt;
        const bonus = Math.max(0, Math.round((1 - rt / inc.ttl) * 50));
        return {
          ...state,
          incidents: state.incidents.filter((i) => i.id !== inc.id),
          resolved: state.resolved + 1,
          score: state.score + 100 + bonus,
          responseTimes: [...state.responseTimes, rt],
          flash: { kind: 'good', text: `Reverted ${action.sha}. ${inc.service.name} recovered`, at: action.now },
        };
      }
      // Wrong revert: costs points and burns time on that incident.
      return {
        ...state,
        wrong: state.wrong + 1,
        score: Math.max(0, state.score - 25),
        incidents: state.incidents.map((i) =>
          i.id === inc.id ? { ...i, tried: [...i.tried, action.sha], ttl: i.ttl - 1500 } : i,
        ),
        flash: { kind: 'bad', text: `${action.sha} wasn't it`, at: action.now },
      };
    }
  }
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function IncidentGame({ onClose }: { onClose: () => void }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const dialogRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLButtonElement>(null);
  const best = Number(localStorage.getItem(BEST_KEY) || 0);

  // Game clock
  useEffect(() => {
    if (state.phase !== 'playing') return;
    const id = window.setInterval(() => dispatch({ type: 'tick', now: performance.now() }), 100);
    return () => window.clearInterval(id);
  }, [state.phase]);

  // Save best score
  useEffect(() => {
    if (state.phase === 'over' && state.score > best) localStorage.setItem(BEST_KEY, String(state.score));
  }, [state.phase, state.score, best]);

  // Focus management: focus the main action when the screen changes, restore focus on close.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    return () => previous?.focus?.();
  }, []);
  useEffect(() => {
    primaryRef.current?.focus();
  }, [state.phase]);

  // Lock page scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const start = useCallback(() => dispatch({ type: 'start', now: performance.now() }), []);

  // Keyboard: Esc closes, 1-3 revert a commit on the oldest incident.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (state.phase === 'playing' && ['1', '2', '3'].includes(e.key) && state.incidents[0]) {
        const inc = state.incidents[0];
        const commit = inc.commits[Number(e.key) - 1];
        if (commit) dispatch({ type: 'pick', incidentId: inc.id, sha: commit.sha, now: performance.now() });
      }
      // Simple focus trap
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]');
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state.phase, state.incidents, onClose]);

  const timeLeft = state.phase === 'playing' ? Math.max(0, ROUND_MS - (state.now - state.startedAt)) : ROUND_MS;
  const down = new Set(state.incidents.map((i) => i.service.id));
  const flashVisible = state.flash && state.now - state.flash.at < 1600;

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Scrim: a modal task dims what's behind it */}
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={onClose} aria-hidden />

      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-title"
        initial={{ y: 40, scale: 0.97, opacity: 0, filter: 'blur(10px)' }}
        animate={{ y: 0, scale: 1, opacity: 1, filter: 'blur(0px)' }}
        exit={{ y: 40, scale: 0.97, opacity: 0, filter: 'blur(10px)' }}
        transition={spring}
        className="relative flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[1.75rem] bg-surface shadow-float ring-1 ring-line/10 sm:rounded-[1.75rem]"
      >
        {/* Header / HUD */}
        <div className="flex items-center gap-3 border-b border-line/[0.07] px-5 py-4">
          <Activity size={20} className="text-accent" />
          <h2 id="game-title" className="font-semibold tracking-tight">
            Incident Commander
          </h2>
          {state.phase === 'playing' && (
            <div className="ml-auto flex items-center gap-4 font-mono text-sm tabular-nums">
              <span aria-label={`${Math.ceil(timeLeft / 1000)} seconds left`}>{Math.ceil(timeLeft / 1000)}s</span>
              <span className="flex gap-0.5" aria-label={`${state.lives} lives left`}>
                {Array.from({ length: LIVES }).map((_, i) => (
                  <Heart
                    key={i}
                    size={15}
                    className={i < state.lives ? 'fill-[#ff3b30] text-[#ff3b30]' : 'text-ink-3'}
                  />
                ))}
              </span>
              <span aria-label={`Score ${state.score}`}>{state.score}</span>
            </div>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close game"
            className={`grid h-8 w-8 place-items-center rounded-full text-ink-2 hover:bg-line/[0.07] hover:text-ink ${
              state.phase === 'playing' ? '' : 'ml-auto'
            }`}
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5">
          {state.phase === 'intro' && (
            <div>
              <p className="text-lg leading-snug">
                You're on call. Services are breaking. Find the commit that broke each one and revert it before it
                goes down.
              </p>
              <ul className="mt-4 space-y-2 text-[0.9375rem] text-ink-2">
                <li>• Read the error, then revert the commit that touched that service's file.</li>
                <li>• A wrong revert costs points and burns time on that incident.</li>
                <li>• Three outages and your shift is over. The round lasts 60 seconds.</li>
                <li className="hidden sm:list-item">• Keys 1, 2 and 3 revert a commit on the oldest incident.</li>
              </ul>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <motion.button
                  ref={primaryRef}
                  type="button"
                  onClick={start}
                  whileTap={{ scale: 0.97 }}
                  transition={snappy}
                  className="btn-primary"
                >
                  Start shift
                </motion.button>
                {best > 0 && (
                  <span className="caption inline-flex items-center gap-1.5">
                    <Trophy size={14} /> Best: {best}
                  </span>
                )}
              </div>
            </div>
          )}

          {state.phase === 'playing' && (
            <div>
              {/* Service status board */}
              <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6" aria-label="Service status">
                {SERVICES.map((s) => {
                  const isDown = down.has(s.id);
                  return (
                    <li
                      key={s.id}
                      className={`flex items-center gap-1.5 rounded-xl px-2.5 py-2 font-mono text-[0.6875rem] transition-colors ${
                        isDown ? 'bg-[#ff3b30]/[0.12] text-[#ff3b30]' : 'bg-surface-2 text-ink-2'
                      }`}
                    >
                      <span className="relative flex h-2 w-2 shrink-0">
                        {isDown && (
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff3b30] opacity-70 motion-reduce:hidden" />
                        )}
                        <span className={`relative inline-flex h-2 w-2 rounded-full ${isDown ? 'bg-[#ff3b30]' : 'bg-success'}`} />
                      </span>
                      <span className="truncate">{s.name}</span>
                    </li>
                  );
                })}
              </ul>

              {/* Feedback line */}
              <p
                aria-live="polite"
                className={`mt-3 h-5 text-sm transition-opacity ${flashVisible ? 'opacity-100' : 'opacity-0'} ${
                  state.flash?.kind === 'good' ? 'text-success' : 'text-[#ff3b30]'
                }`}
              >
                {state.flash?.text}
              </p>

              {/* Incidents */}
              <div className="mt-2 min-h-[18rem] space-y-3">
                <AnimatePresence initial={false}>
                  {state.incidents.length === 0 && (
                    <motion.p
                      key="calm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-16 text-center text-ink-3"
                    >
                      All systems operational. Stay sharp.
                    </motion.p>
                  )}
                  {state.incidents.map((inc, idx) => {
                    const left = Math.max(0, 1 - (state.now - inc.spawnedAt) / inc.ttl);
                    return (
                      <motion.section
                        key={inc.id}
                        layout
                        initial={{ opacity: 0, y: 16, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
                        transition={spring}
                        className="rounded-2xl bg-surface-2 p-4 ring-1 ring-line/[0.06]"
                        aria-label={`Incident on ${inc.service.name}`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold tracking-tight">
                            <span className="text-[#ff3b30]">●</span> {inc.service.name}
                            <span className="caption ml-2 font-normal">{inc.service.file}</span>
                          </p>
                          {idx === 0 && <span className="caption hidden sm:inline">keys 1–3</span>}
                        </div>
                        <p className="mt-2 break-words font-mono text-[0.8125rem] text-ink-2">{inc.error}</p>

                        <div className="mt-3 h-1 overflow-hidden rounded-full bg-line/[0.08]">
                          <div
                            className={`h-full rounded-full transition-[width] duration-100 ease-linear ${
                              left < 0.3 ? 'bg-[#ff3b30]' : 'bg-accent'
                            }`}
                            style={{ width: `${left * 100}%` }}
                          />
                        </div>

                        <div className="mt-3 grid gap-2">
                          {inc.commits.map((c, i) => {
                            const tried = inc.tried.includes(c.sha);
                            return (
                              <motion.button
                                key={c.sha}
                                type="button"
                                disabled={tried}
                                onClick={() =>
                                  dispatch({ type: 'pick', incidentId: inc.id, sha: c.sha, now: performance.now() })
                                }
                                whileTap={{ scale: 0.98 }}
                                transition={snappy}
                                className="flex items-center gap-3 rounded-xl bg-surface px-3 py-2.5 text-left ring-1 ring-line/[0.06] transition-colors hover:ring-accent/50 disabled:opacity-40 disabled:line-through"
                              >
                                <span className="hidden font-mono text-xs text-ink-3 sm:inline">{i + 1}</span>
                                <GitCommitHorizontal size={16} className="shrink-0 text-ink-3" />
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate text-sm">{c.message}</span>
                                  <span className="block truncate font-mono text-[0.6875rem] text-ink-3">
                                    {c.sha} · {c.file}
                                  </span>
                                </span>
                                <span className="shrink-0 text-xs font-medium text-accent">Revert</span>
                              </motion.button>
                            );
                          })}
                        </div>
                      </motion.section>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          )}

          {state.phase === 'over' && (
            <GameOver state={state} best={Math.max(best, state.score)} onAgain={start} onClose={onClose} primaryRef={primaryRef} />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function GameOver({
  state,
  best,
  onAgain,
  onClose,
  primaryRef,
}: {
  state: State;
  best: number;
  onAgain: () => void;
  onClose: () => void;
  primaryRef: React.RefObject<HTMLButtonElement>;
}) {
  const attempts = state.resolved + state.wrong;
  const accuracy = attempts ? Math.round((state.resolved / attempts) * 100) : 0;
  const avg = state.responseTimes.length
    ? (state.responseTimes.reduce((a, b) => a + b, 0) / state.responseTimes.length / 1000).toFixed(1)
    : '–';
  const survived = state.lives > 0;
  const newBest = state.score > 0 && state.score >= best;

  return (
    <div>
      <p className="eyebrow">{survived ? 'Shift complete' : 'Paged out'}</p>
      <p className="mt-2 text-[3.5rem] font-bold leading-none tracking-tighter tabular-nums">{state.score}</p>
      <p className="mt-1 text-ink-2">{newBest ? 'New best score!' : `Best: ${best}`}</p>

      <dl className="mt-6 grid grid-cols-3 gap-3">
        {[
          ['Resolved', String(state.resolved)],
          ['Accuracy', `${accuracy}%`],
          ['Avg response', `${avg}s`],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl bg-surface-2 p-4">
            <dt className="caption">{k}</dt>
            <dd className="mt-1 text-xl font-semibold tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-6 text-[0.9375rem] leading-relaxed text-ink-2">
        This is the loop behind <span className="text-ink">PEAK</span>, an AI agent I helped build that reads the
        errors, finds the culprit commit and reverts it after a human approves. It just doesn't need 60 seconds.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <motion.button
          ref={primaryRef}
          type="button"
          onClick={onAgain}
          whileTap={{ scale: 0.97 }}
          transition={snappy}
          className="btn-primary"
        >
          <RotateCcw size={16} /> Play again
        </motion.button>
        <motion.button type="button" onClick={onClose} whileTap={{ scale: 0.97 }} transition={snappy} className="btn-secondary">
          Back to portfolio
        </motion.button>
      </div>
    </div>
  );
}

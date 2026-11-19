import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowUp, ArrowUpRight, Check, Copy } from 'lucide-react';
import { profile } from '../data';
import { snappy } from './motion';
import { Magnetic } from './effects';

const sections = [
  { label: 'Work', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'Open Source', href: '#open-source' },
  { label: 'Now', href: '#now' },
  { label: 'Terminal', href: '#terminal' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

const elsewhere = [
  { label: 'GitHub', href: profile.links.github },
  { label: 'LinkedIn', href: profile.links.linkedin },
  { label: 'X', href: profile.links.x },
  { label: 'Resume', href: profile.resume },
];

const games = [
  { label: 'Incident Commander', id: 'incident' },
  { label: 'Merge Runner', id: 'merge' },
];

const IST_OFFSET = 330; // minutes ahead of UTC

const fmtTime = (timeZone?: string) =>
  new Intl.DateTimeFormat('en-IN', { timeZone, hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date());

function readClocks() {
  const visitorOffset = -new Date().getTimezoneOffset();
  const diff = visitorOffset - IST_OFFSET; // minutes the visitor is ahead of me
  let relation = '';
  if (diff !== 0) {
    const h = Math.floor(Math.abs(diff) / 60);
    const m = Math.abs(diff) % 60;
    const span = [h ? `${h}h` : '', m ? `${m}m` : ''].filter(Boolean).join(' ');
    relation = diff < 0 ? `${span} behind me` : `${span} ahead of me`;
  }
  return { mine: fmtTime('Asia/Kolkata'), theirs: diff !== 0 ? fmtTime() : null, relation };
}

function useClocks() {
  const [clocks, setClocks] = useState(readClocks);
  useEffect(() => {
    const id = window.setInterval(() => setClocks(readClocks()), 15_000);
    return () => window.clearInterval(id);
  }, []);
  return clocks;
}

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };
  return (
    <motion.button
      type="button"
      onClick={copy}
      whileTap={{ scale: 0.97 }}
      transition={snappy}
      className="group inline-flex max-w-full items-center gap-3 rounded-full bg-surface-2 py-2 pl-5 pr-2 text-left ring-1 ring-line/[0.06] transition-colors hover:bg-line/[0.07]"
      aria-label={copied ? 'Email copied' : `Copy email address ${profile.email}`}
    >
      <span className="truncate font-medium tracking-tight">{profile.email}</span>
      <span
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors ${
          copied ? 'bg-success text-white' : 'bg-accent text-accent-ink'
        }`}
      >
        {copied ? <Check size={15} /> : <Copy size={14} />}
      </span>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Copied to clipboard' : ''}
      </span>
    </motion.button>
  );
}

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const clocks = useClocks();
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  // The wordmark rises into place as the footer scrolls into view.
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['45%', '0%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], reduce ? [1, 1, 1] : [0, 0.6, 1]);

  return (
    <footer ref={ref} className="relative mt-10 overflow-hidden border-t border-line/[0.08] pt-16 sm:pt-20">
      <div className="page">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          {/* Left: status + contact */}
          <div>
            <p className="text-[1.75rem] font-semibold leading-tight tracking-tight sm:text-[2rem]">
              Open to interesting problems.
            </p>
            <p className="mt-3 text-ink-2">The quickest way to reach me:</p>
            <div className="mt-5">
              <Magnetic strength={0.15} max={6}>
                <CopyEmail />
              </Magnetic>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-ink-2">
              <span className="inline-flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60 motion-reduce:hidden" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                </span>
                {profile.status}
              </span>
              <span className="tabular-nums">
                It's {clocks.mine} in {profile.location.split(',')[0]}
                {clocks.theirs && (
                  <span className="text-ink-3">
                    {' '}
                    · {clocks.theirs} for you ({clocks.relation})
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Right: link columns */}
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h2 className="caption mb-4 font-medium uppercase tracking-wider">Navigate</h2>
              <ul className="space-y-2.5">
                {sections.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} className="text-ink-2 transition-colors hover:text-ink">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="caption mb-4 font-medium uppercase tracking-wider">Elsewhere</h2>
              <ul className="space-y-2.5">
                {elsewhere.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1 text-ink-2 transition-colors hover:text-ink"
                    >
                      {s.label}
                      <ArrowUpRight
                        size={14}
                        className="opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="caption mb-4 font-medium uppercase tracking-wider">Play</h2>
              <ul className="space-y-2.5">
                {games.map((g) => (
                  <li key={g.id}>
                    <button
                      type="button"
                      onClick={() => window.dispatchEvent(new CustomEvent('open-game', { detail: g.id }))}
                      className="text-left text-ink-2 transition-colors hover:text-ink"
                    >
                      {g.label}
                    </button>
                  </li>
                ))}
                <li>
                  <a href="#terminal" className="font-mono text-sm text-ink-2 transition-colors hover:text-ink">
                    $ help
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col-reverse items-start justify-between gap-4 border-t border-line/[0.08] py-6 text-sm text-ink-3 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {profile.name}. Designed and built by me.
          </p>
          <motion.a
            href="#top"
            whileTap={{ scale: 0.95 }}
            transition={snappy}
            className="group inline-flex items-center gap-2 rounded-full px-1 text-ink-2 transition-colors hover:text-ink"
          >
            Back to top
            <span className="grid h-8 w-8 place-items-center rounded-full bg-surface-2 ring-1 ring-line/[0.06] transition-transform group-hover:-translate-y-0.5">
              <ArrowUp size={15} />
            </span>
          </motion.a>
        </div>
      </div>

      {/* Oversized wordmark, sized to the exact page width */}
      <motion.div aria-hidden style={{ y, opacity }} className="page pointer-events-none select-none">
        <svg viewBox="0 0 1000 205" className="-mb-[2%] block w-full text-ink" role="presentation">
          <defs>
            <linearGradient id="wordmark-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.16" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <text
            x="0"
            y="190"
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            fill="url(#wordmark-fade)"
            style={{ font: '800 232px -apple-system, BlinkMacSystemFont, system-ui, sans-serif', letterSpacing: '-0.04em' }}
          >
            VAIBHAV
          </text>
        </svg>
      </motion.div>
    </footer>
  );
}

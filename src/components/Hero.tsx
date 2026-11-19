import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Download, Github, Linkedin, Mail, Play } from 'lucide-react';
import { profile, stats } from '../data';
import WorkGraph from './WorkGraph';
import { press, spring } from './motion';
import { Magnetic } from './effects';

const XLogo = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const socials = [
  { href: profile.links.github, label: 'GitHub', icon: <Github size={18} /> },
  { href: profile.links.linkedin, label: 'LinkedIn', icon: <Linkedin size={18} /> },
  { href: profile.links.x, label: 'X', icon: <XLogo size={16} /> },
  { href: `mailto:${profile.email}`, label: 'Email', icon: <Mail size={18} /> },
];

const rise = (i: number) => ({
  initial: { opacity: 0, y: 20, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { ...spring, delay: 0.08 * i },
});

export default function Hero() {
  const goTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <section id="top" className="relative overflow-hidden pt-24 sm:pt-36">
      <div className="page grid items-center gap-4 sm:gap-10 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <motion.div {...rise(0)} className="chip mb-6 gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            {profile.status}
          </motion.div>

          <motion.h1 {...rise(1)} className="display">
            {profile.name}
          </motion.h1>

          <motion.p {...rise(2)} className="mt-5 max-w-xl text-[1.3125rem] leading-snug text-ink-2 sm:text-2xl">
            Software engineer building <span className="text-ink">AI agents</span> and the{' '}
            <span className="text-ink">apps around them</span>. Shipped to the App Store, merged into Hugging Face.
          </motion.p>

          <motion.div {...rise(3)} className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic>
              <motion.a href="#work" className="btn-primary" {...press}>
                See my work
                <ArrowDown size={16} />
              </motion.a>
            </Magnetic>
            <Magnetic>
              <motion.a href={profile.resume} target="_blank" rel="noopener noreferrer" className="btn-secondary" {...press}>
                <Download size={16} />
                Resume
              </motion.a>
            </Magnetic>
            <div className="ml-1 flex items-center gap-1">
              {socials.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-full text-ink-2 transition-colors hover:bg-line/[0.07] hover:text-ink"
                  {...press}
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div {...rise(4)} className="mt-6 flex flex-wrap gap-2">
            {[
              { id: 'incident', name: 'Incident Commander', hint: '60-second on-call' },
              { id: 'merge', name: 'Merge Runner', hint: 'maze chase' },
            ].map((g) => (
              <motion.button
                key={g.id}
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-game', { detail: g.id }))}
                className="inline-flex items-center gap-2.5 rounded-full bg-surface-2 py-1.5 pl-1.5 pr-4 text-sm text-ink-2 ring-1 ring-line/[0.06] transition-colors hover:text-ink"
                {...press}
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-accent text-accent-ink">
                  <Play size={13} className="translate-x-px fill-current" />
                </span>
                <span>
                  <span className="font-medium text-ink">{g.name}</span>
                  <span className="text-ink-3"> · {g.hint}</span>
                </span>
              </motion.button>
            ))}
          </motion.div>

          <motion.dl {...rise(5)} className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-line/[0.08] pt-6 sm:mt-12 sm:gap-6">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-[1.75rem] font-semibold leading-none tracking-tight sm:text-[2rem]">{s.value}</dd>
                <dd className="caption mt-2">{s.label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.figure
          initial={{ opacity: 0, scale: 0.94, filter: 'blur(12px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ ...spring, duration: 0.9, delay: 0.2 }}
          className="relative"
        >
          <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-[12%] rounded-full bg-accent/10 blur-3xl dark:bg-accent/15"
            />
            <div className="relative z-10 h-full w-full">
              <WorkGraph onNavigate={goTo} />
            </div>
          </div>
          <figcaption className="caption text-center">
            <span className="pointer-coarse:hidden">Drag to spin my work graph. Click a node to jump there.</span>
            <span className="hidden pointer-coarse:inline">Swipe sideways to spin. Tap a node to jump there.</span>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}

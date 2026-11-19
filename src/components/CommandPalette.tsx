import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Copy,
  FileText,
  FolderGit2,
  Gamepad2,
  Github,
  Hash,
  Linkedin,
  Mail,
  Moon,
  Search,
  Terminal as TerminalIcon,
} from 'lucide-react';
import { profile, projects } from '../data';
import { spring } from './motion';
import { ACCENTS, getAccent, setAccent } from './accent';

interface Command {
  id: string;
  group: 'Navigate' | 'Projects' | 'Play' | 'Actions' | 'Links';
  label: string;
  hint?: string;
  keywords?: string;
  icon: ReactNode;
  run: () => void | string; // may return a toast message
}

const XLogo = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent);

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
const openUrl = (url: string): void => {
  window.open(url, '_blank', 'noopener');
};

function buildCommands(): Command[] {
  const nav: Command[] = [
    ['top', 'Home'],
    ['work', 'Work'],
    ['experience', 'Experience'],
    ['open-source', 'Open Source'],
    ['now', 'Now'],
    ['terminal', 'Terminal'],
    ['about', 'About'],
    ['contact', 'Contact'],
  ].map(([id, label]) => ({
    id: `nav-${id}`,
    group: 'Navigate',
    label,
    icon: <Hash size={16} />,
    run: () => scrollTo(id),
  }));

  const work: Command[] = projects.map((p) => ({
    id: `project-${p.slug}`,
    group: 'Projects',
    label: p.title,
    hint: 'Case study',
    keywords: p.tags.join(' '),
    icon: <FolderGit2 size={16} />,
    run: () => {
      scrollTo('work');
      window.dispatchEvent(new CustomEvent('open-project', { detail: p.slug }));
    },
  }));

  const play: Command[] = [
    { id: 'game-incident', label: 'Incident Commander', hint: '60-second on-call game', detail: 'incident' },
    { id: 'game-merge', label: 'Merge Runner', hint: 'Maze chase', detail: 'merge' },
  ].map((g) => ({
    id: g.id,
    group: 'Play',
    label: g.label,
    hint: g.hint,
    keywords: 'game play fun',
    icon: <Gamepad2 size={16} />,
    run: () => {
      window.dispatchEvent(new CustomEvent('open-game', { detail: g.detail }));
    },
  }));

  const actions: Command[] = [
    {
      id: 'copy-email',
      group: 'Actions',
      label: 'Copy email address',
      hint: profile.email,
      keywords: 'contact mail',
      icon: <Copy size={16} />,
      run: () => {
        navigator.clipboard?.writeText(profile.email).catch(() => undefined);
        return 'Email copied to clipboard';
      },
    },
    {
      id: 'email',
      group: 'Actions',
      label: 'Send an email',
      keywords: 'contact mail hire',
      icon: <Mail size={16} />,
      run: () => {
        window.location.href = `mailto:${profile.email}`;
      },
    },
    {
      id: 'resume',
      group: 'Actions',
      label: 'Open resume',
      hint: 'PDF',
      keywords: 'cv',
      icon: <FileText size={16} />,
      run: () => openUrl(profile.resume),
    },
    {
      id: 'theme',
      group: 'Actions',
      label: 'Toggle light / dark theme',
      keywords: 'appearance mode',
      icon: <Moon size={16} />,
      run: () => {
        const dark = !document.documentElement.classList.contains('dark');
        document.documentElement.classList.toggle('dark', dark);
        localStorage.setItem('theme', dark ? 'dark' : 'light');
        window.dispatchEvent(new Event('themechange'));
      },
    },
    {
      id: 'accent',
      group: 'Actions',
      label: 'Change accent colour',
      keywords: 'color theme blue green purple orange pink',
      icon: <span className="block h-4 w-4 rounded-full bg-accent ring-2 ring-white/30" />,
      run: () => {
        const i = ACCENTS.findIndex((a) => a.id === getAccent());
        const next = ACCENTS[(i + 1) % ACCENTS.length];
        setAccent(next.id);
        return `Accent: ${next.label}`;
      },
    },
    {
      id: 'trail',
      group: 'Actions',
      label: 'Toggle binary cursor trail',
      keywords: 'cursor mouse 0 1 effect',
      icon: <span className="font-mono text-[11px] font-bold leading-none">01</span>,
      run: () => {
        const off = localStorage.getItem('cursor-trail') === 'off';
        localStorage.setItem('cursor-trail', off ? 'on' : 'off');
        window.dispatchEvent(new Event('trailchange'));
        return off ? 'Cursor trail on' : 'Cursor trail off';
      },
    },
    {
      id: 'terminal',
      group: 'Actions',
      label: 'Open the terminal',
      keywords: 'cli shell command',
      icon: <TerminalIcon size={16} />,
      run: () => {
        scrollTo('terminal');
        window.setTimeout(() => document.querySelector<HTMLInputElement>('#terminal input')?.focus({ preventScroll: true }), 600);
      },
    },
  ];

  const links: Command[] = [
    { id: 'github', label: 'GitHub', icon: <Github size={16} />, url: profile.links.github },
    { id: 'linkedin', label: 'LinkedIn', icon: <Linkedin size={16} />, url: profile.links.linkedin },
    { id: 'x', label: 'X', icon: <XLogo />, url: profile.links.x },
  ].map((l) => ({ id: l.id, group: 'Links', label: l.label, hint: 'Opens in a new tab', icon: l.icon, run: () => openUrl(l.url) }));

  return [...nav, ...work, ...play, ...actions, ...links];
}

/** Subsequence match with a bonus for word starts; returns -1 when it doesn't match. */
function score(query: string, text: string) {
  if (!query) return 0;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (t.includes(q)) return 100 - t.indexOf(q);
  let ti = 0;
  let s = 0;
  for (const ch of q) {
    const found = t.indexOf(ch, ti);
    if (found === -1) return -1;
    s += found === 0 || t[found - 1] === ' ' ? 3 : 1;
    ti = found + 1;
  }
  return s;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const [toast, setToast] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const commands = useMemo(buildCommands, []);

  const results = useMemo(() => {
    if (!query.trim()) return commands;
    return commands
      .map((c) => ({ c, s: Math.max(score(query, c.label), score(query, `${c.keywords ?? ''} ${c.group}`) - 20) }))
      .filter((r) => r.s >= 0)
      .sort((a, b) => b.s - a.s)
      .map((r) => r.c);
  }, [query, commands]);

  // Global shortcuts: ⌘K / Ctrl+K anywhere, "/" when not typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest?.('input, textarea, [contenteditable]');
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === '/' && !typing && !open) {
        e.preventDefault();
        setOpen(true);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('open-palette', onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('open-palette', onOpen);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setIndex(0);
    const prev = document.activeElement as HTMLElement | null;
    window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => prev?.focus?.({ preventScroll: true });
  }, [open]);

  useEffect(() => setIndex(0), [query]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${index}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [index]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(''), 1800);
    return () => window.clearTimeout(id);
  }, [toast]);

  const run = (c: Command | undefined) => {
    if (!c) return;
    setOpen(false);
    const message = c.run();
    if (message) setToast(message);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      run(results[index]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    }
  };

  // Group results while keeping one flat index for keyboard movement.
  let flat = -1;
  const groups = results.reduce<Record<string, Command[]>>((acc, c) => {
    (acc[c.group] ??= []).push(c);
    return acc;
  }, {});

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[80] flex items-start justify-center px-3 pt-[12vh] sm:pt-[16vh]">
            <motion.div
              className="absolute inset-0 bg-black/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command menu"
              initial={{ opacity: 0, scale: 0.96, y: -8, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.97, y: -4, filter: 'blur(6px)', transition: { duration: 0.15 } }}
              transition={{ ...spring, duration: 0.35 }}
              className="material relative w-full max-w-xl overflow-hidden rounded-3xl"
              onKeyDown={onKeyDown}
            >
              <div className="flex items-center gap-3 border-b border-line/[0.08] px-4">
                <Search size={18} className="shrink-0 text-ink-3" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search sections, projects, actions…"
                  aria-label="Search commands"
                  aria-controls="palette-list"
                  aria-activedescendant={results[index] ? `cmd-${results[index].id}` : undefined}
                  role="combobox"
                  aria-expanded="true"
                  autoComplete="off"
                  spellCheck={false}
                  className="h-14 flex-1 bg-transparent text-base text-ink placeholder:text-ink-3 outline-none focus-visible:outline-none"
                />
                <kbd className="hidden rounded-md bg-line/[0.07] px-1.5 py-0.5 font-mono text-[0.6875rem] text-ink-3 sm:inline">
                  esc
                </kbd>
              </div>

              <ul id="palette-list" ref={listRef} role="listbox" className="max-h-[min(60vh,26rem)] overflow-y-auto p-2">
                {results.length === 0 && <li className="px-3 py-10 text-center text-ink-3">No matches for “{query}”</li>}
                {Object.entries(groups).map(([group, items]) => (
                  <li key={group} role="presentation">
                    <p className="caption px-3 pb-1 pt-3 font-medium">{group}</p>
                    <ul role="presentation">
                      {items.map((c) => {
                        flat += 1;
                        const i = flat;
                        const selected = i === index;
                        return (
                          <li
                            key={c.id}
                            id={`cmd-${c.id}`}
                            role="option"
                            aria-selected={selected}
                            data-index={i}
                            onMouseMove={() => setIndex(i)}
                            onClick={() => run(c)}
                            className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 ${
                              selected ? 'bg-accent text-accent-ink' : 'text-ink'
                            }`}
                          >
                            <span className={selected ? 'text-accent-ink' : 'text-ink-3'}>{c.icon}</span>
                            <span className="flex-1 truncate text-[0.9375rem]">{c.label}</span>
                            {c.hint && (
                              <span className={`hidden truncate text-xs sm:inline ${selected ? 'text-accent-ink/80' : 'text-ink-3'}`}>
                                {c.hint}
                              </span>
                            )}
                            {selected && <ArrowRight size={14} />}
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                ))}
              </ul>

              <div className="hidden items-center gap-4 border-t border-line/[0.08] px-4 py-2.5 text-xs text-ink-3 sm:flex">
                <span>
                  <kbd className="font-mono">↑↓</kbd> move
                </span>
                <span>
                  <kbd className="font-mono">↵</kbd> open
                </span>
                <span className="ml-auto">
                  <kbd className="font-mono">{isMac ? '⌘K' : 'Ctrl K'}</kbd> or <kbd className="font-mono">/</kbd> anytime
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <div className="pointer-events-none fixed inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-[90] flex justify-center">
            <motion.div
              role="status"
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8 }}
              transition={spring}
              className="material rounded-full px-4 py-2 text-sm font-medium"
            >
              {toast}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

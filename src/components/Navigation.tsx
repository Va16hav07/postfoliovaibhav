import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Moon, Search, Sun, X } from 'lucide-react';
import { snappy, spring } from './motion';
import AccentPicker from './AccentPicker';

const links = [
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'open-source', label: 'Open Source' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent);

function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    // Follow the system setting until the visitor picks one themselves.
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem('theme')) return;
      document.documentElement.classList.toggle('dark', e.matches);
      setDark(e.matches);
    };
    // The terminal's `theme` command changes the theme too; stay in sync.
    const onExternal = () => setDark(document.documentElement.classList.contains('dark'));
    media.addEventListener('change', onChange);
    window.addEventListener('themechange', onExternal);
    return () => {
      media.removeEventListener('change', onChange);
      window.removeEventListener('themechange', onExternal);
    };
  }, []);

  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    setDark(next);
  };

  return { dark, toggle };
}

function useActiveSection() {
  const [active, setActive] = useState('');
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    for (const { id } of links) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    const hero = document.getElementById('top');
    if (hero) observer.observe(hero);
    return () => observer.disconnect();
  }, []);
  return active;
}

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection();
  const { dark, toggle } = useTheme();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:pt-4">
      <nav
        aria-label="Main"
        className="material mx-auto flex max-w-page items-center justify-between rounded-full py-1.5 pl-5 pr-1.5"
      >
        <a href="#top" className="text-[0.9375rem] font-semibold tracking-tight">
          Vaibhav Kumawat
        </a>

        <ul className="hidden items-center gap-0.5 md:flex">
          {links.map((link) => (
            <li key={link.id} className="relative">
              {active === link.id && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-line/[0.07]"
                  transition={spring}
                />
              )}
              <a
                href={`#${link.id}`}
                aria-current={active === link.id ? 'true' : undefined}
                className={`relative block rounded-full px-3.5 py-1.5 text-[0.875rem] transition-colors ${
                  active === link.id ? 'text-ink' : 'text-ink-2 hover:text-ink'
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <motion.button
            type="button"
            onClick={() => window.dispatchEvent(new Event('open-palette'))}
            whileTap={{ scale: 0.94 }}
            transition={snappy}
            aria-label="Open command menu"
            aria-keyshortcuts="Meta+K Control+K /"
            className="flex h-9 items-center gap-2 rounded-full px-2.5 text-ink-2 hover:bg-line/[0.07] hover:text-ink lg:bg-line/[0.05] lg:pl-3 lg:pr-2"
          >
            <Search size={16} />
            <span className="hidden text-[0.8125rem] lg:inline">Search</span>
            <kbd className="hidden rounded-md bg-line/[0.08] px-1.5 py-0.5 font-mono text-[0.6875rem] lg:inline">
              {isMac ? '⌘K' : 'Ctrl K'}
            </kbd>
          </motion.button>
          <AccentPicker />
          <motion.button
            type="button"
            onClick={toggle}
            whileTap={{ scale: 0.9 }}
            transition={snappy}
            aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
            className="grid h-9 w-9 place-items-center rounded-full text-ink-2 hover:bg-line/[0.07] hover:text-ink"
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </motion.button>
          <motion.button
            type="button"
            onClick={() => setOpen((o) => !o)}
            whileTap={{ scale: 0.9 }}
            transition={snappy}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="grid h-9 w-9 place-items-center rounded-full text-ink-2 hover:bg-line/[0.07] hover:text-ink md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </motion.button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, scale: 0.96, y: -8, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.96, y: -8, filter: 'blur(8px)' }}
            transition={spring}
            style={{ transformOrigin: 'top right' }}
            className="material mx-auto mt-2 max-w-page rounded-3xl p-2 md:hidden"
          >
            <ul>
              {links.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={() => setOpen(false)}
                    className={`block rounded-2xl px-4 py-3 text-[1.0625rem] ${
                      active === link.id ? 'bg-line/[0.07] text-ink' : 'text-ink-2'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="mt-1 border-t border-line/[0.08] pt-1">
                <a
                  href="/Vaibhav_Kumawat_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-[1.0625rem] text-accent"
                >
                  Resume
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

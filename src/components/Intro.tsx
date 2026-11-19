import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const KEY = 'intro-seen';
const TEXT = 'vaibhav.sh';

/** Decide synchronously so returning visitors never see a flash. */
function shouldShow() {
  try {
    if (localStorage.getItem(KEY)) return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    // Deep links (a case study, a game) should land straight on their content.
    if (window.location.hash.length > 1 || window.location.search.includes('play=')) return false;
    return true;
  } catch {
    return false;
  }
}

/** A sub-second boot line shown once, on the very first visit. */
export default function Intro() {
  const [show, setShow] = useState(shouldShow);
  const [typed, setTyped] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!show) return;
    localStorage.setItem(KEY, '1');
    const timers: number[] = [];
    for (let i = 1; i <= TEXT.length; i++) timers.push(window.setTimeout(() => setTyped(i), 40 * i));
    timers.push(window.setTimeout(() => setReady(true), 40 * TEXT.length + 120));
    timers.push(window.setTimeout(() => setShow(false), 40 * TEXT.length + 650));
    // Any key or click skips it.
    const skip = () => setShow(false);
    window.addEventListener('keydown', skip);
    window.addEventListener('pointerdown', skip);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          aria-hidden
          className="fixed inset-0 z-[100] grid place-items-center bg-canvas"
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
          transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
        >
          <p className="font-mono text-lg sm:text-xl">
            <span className="text-success">➜</span> <span className="text-ink">{TEXT.slice(0, typed)}</span>
            {ready ? (
              <motion.span
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                className="ml-2 text-ink-2"
              >
                ready <span className="text-success">✓</span>
              </motion.span>
            ) : (
              <span className="ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] animate-pulse bg-accent" />
            )}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

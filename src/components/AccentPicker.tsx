import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { ACCENTS, getAccent, setAccent, type AccentId } from './accent';
import { snappy, spring } from './motion';

export default function AccentPicker() {
  const [open, setOpen] = useState(false);
  const [accent, setLocal] = useState<AccentId>(getAccent);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = () => setLocal(getAccent());
    window.addEventListener('accentchange', sync);
    return () => window.removeEventListener('accentchange', sync);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const current = ACCENTS.find((a) => a.id === accent) ?? ACCENTS[0];

  return (
    <div ref={ref} className="relative">
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        whileTap={{ scale: 0.9 }}
        transition={snappy}
        aria-label={`Accent colour: ${current.label}. Change accent colour`}
        aria-expanded={open}
        aria-haspopup="true"
        className="grid h-9 w-9 place-items-center rounded-full hover:bg-line/[0.07]"
      >
        <span className="h-4 w-4 rounded-full bg-accent ring-2 ring-line/10 ring-offset-2 ring-offset-surface" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="group"
            aria-label="Accent colour"
            initial={{ opacity: 0, scale: 0.9, y: -6, filter: 'blur(6px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, y: -4, filter: 'blur(4px)' }}
            transition={spring}
            style={{ transformOrigin: 'top right' }}
            className="material absolute right-0 top-11 z-10 flex gap-2 rounded-2xl p-2.5"
          >
            {ACCENTS.map((a) => (
              <motion.button
                key={a.id}
                type="button"
                onClick={() => {
                  setAccent(a.id);
                  setOpen(false);
                }}
                whileTap={{ scale: 0.85 }}
                transition={snappy}
                aria-label={a.label}
                aria-pressed={accent === a.id}
                title={a.label}
                className="grid h-8 w-8 place-items-center rounded-full ring-1 ring-black/10"
                style={{ background: a.swatch }}
              >
                {accent === a.id && <Check size={15} className="text-white drop-shadow" strokeWidth={3} />}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useRef, type ReactNode } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';

const canHover = () =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const SPRING = { stiffness: 260, damping: 26, mass: 0.6 };

/**
 * Tilts its child toward the cursor with a soft light reflection, then springs flat on leave.
 * Pressing resets it immediately so click-through animations start from a flat card.
 */
export function Tilt({ children, max = 6, className = '' }: { children: ReactNode; max?: number; className?: string }) {
  const rx = useSpring(0, SPRING);
  const ry = useSpring(0, SPRING);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glare = useMotionValue(0);
  const glareOpacity = useSpring(glare, SPRING);
  const background = useMotionTemplate`radial-gradient(420px circle at ${gx}% ${gy}%, rgb(255 255 255 / 0.12), transparent 55%)`;

  const reset = () => {
    rx.set(0);
    ry.set(0);
    glare.set(0);
  };

  return (
    <motion.div
      className={`relative h-full ${className}`}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse' || !canHover()) return;
        const r = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * 2 * max);
        rx.set(-(py - 0.5) * 2 * max);
        gx.set(px * 100);
        gy.set(py * 100);
        glare.set(1);
      }}
      onPointerLeave={reset}
      onPointerDownCapture={() => {
        rx.jump(0);
        ry.jump(0);
        glare.jump(0);
      }}
    >
      {children}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 rounded-[28px] mix-blend-soft-light dark:mix-blend-overlay"
        style={{ background, opacity: glareOpacity }}
      />
    </motion.div>
  );
}

/** Pulls its child a few pixels toward the cursor while hovered, then springs back. */
export function Magnetic({
  children,
  strength = 0.25,
  max = 8,
  className = 'inline-block',
}: {
  children: ReactNode;
  strength?: number;
  max?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);
  const clamp = (v: number) => Math.max(-max, Math.min(max, v));

  return (
    <motion.span
      ref={ref}
      className={className}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse' || !canHover()) return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set(clamp((e.clientX - (r.left + r.width / 2)) * strength));
        y.set(clamp((e.clientY - (r.top + r.height / 2)) * strength));
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

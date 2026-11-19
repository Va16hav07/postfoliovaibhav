import type { Transition } from 'framer-motion';

/** Critically damped spring: no overshoot, settles smoothly. The house default. */
export const spring: Transition = { type: 'spring', bounce: 0, duration: 0.5 };
/** Quicker spring for direct feedback (press, hover). */
export const snappy: Transition = { type: 'spring', bounce: 0, duration: 0.3 };

/** Press feedback starts on pointer-down, not on release. */
export const press = {
  whileTap: { scale: 0.97 },
  transition: snappy,
};

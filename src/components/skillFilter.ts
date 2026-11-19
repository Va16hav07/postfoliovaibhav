import { useSyncExternalStore } from 'react';

/** One skill can be "active" site-wide; projects, roles, contributions and the graph react to it. */
let active: string | null = null;
const listeners = new Set<() => void>();

export function setSkill(skill: string | null) {
  active = active === skill ? null : skill;
  listeners.forEach((l) => l());
}

export function getSkill() {
  return active;
}

export function useSkill() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => active,
  );
}

/** Subscribe outside React (used by the canvas graph). */
export function onSkillChange(cb: (skill: string | null) => void) {
  const l = () => cb(active);
  listeners.add(l);
  return () => listeners.delete(l);
}

/** Dim/highlight classes for an item given the active skill. */
export function matchClass(skills: string[], skill: string | null) {
  if (!skill) return '';
  return skills.includes(skill) ? 'ring-2 ring-accent/70' : 'opacity-35 saturate-50';
}

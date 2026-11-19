import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { experience, openSource, projects, skills } from '../data';
import { setSkill, useSkill } from './skillFilter';
import { snappy, spring } from './motion';

/** How many projects, roles and contributions use each skill. */
const usage = new Map<string, number>();
for (const item of [...projects, ...experience, ...openSource.contributions]) {
  for (const s of item.skills) usage.set(s, (usage.get(s) ?? 0) + 1);
}
const allSkills = skills.flatMap((g) => g.items);
/** Skills that actually appear somewhere, most used first. */
const filterableSkills = allSkills
  .filter((s) => (usage.get(s) ?? 0) > 0)
  .sort((a, b) => (usage.get(b) ?? 0) - (usage.get(a) ?? 0));

export function SkillChip({ skill, className = '' }: { skill: string; className?: string }) {
  const active = useSkill();
  const count = usage.get(skill) ?? 0;
  const on = active === skill;
  if (!count) {
    return <span className={`chip cursor-default ${className}`}>{skill}</span>;
  }
  return (
    <motion.button
      type="button"
      onClick={() => setSkill(skill)}
      whileTap={{ scale: 0.94 }}
      transition={snappy}
      aria-pressed={on}
      title={`Highlight everything that used ${skill}`}
      className={`chip gap-1.5 transition-colors ${on ? 'bg-accent text-accent-ink' : 'hover:text-ink'} ${className}`}
    >
      {skill}
      <span className={`text-[0.6875rem] tabular-nums ${on ? 'text-accent-ink/80' : 'text-ink-3'}`}>{count}</span>
    </motion.button>
  );
}

/** Chip row shown above the project grid. */
export function SkillFilterBar() {
  return (
    <div className="-mx-5 mb-6 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0" role="group" aria-label="Filter by skill">
      <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
        <span className="caption self-center pr-1">Filter by skill</span>
        {filterableSkills.slice(0, 12).map((s) => (
          <SkillChip key={s} skill={s} />
        ))}
      </div>
    </div>
  );
}

/** Floating status pill while a skill is active. */
export function SkillStatus() {
  const active = useSkill();
  const n = active ? usage.get(active) ?? 0 : 0;
  return (
    <AnimatePresence>
      {active && (
        <div className="pointer-events-none fixed inset-x-0 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-[60] flex justify-center px-4">
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={spring}
            className="material pointer-events-auto flex items-center gap-3 rounded-full py-1.5 pl-4 pr-1.5 text-sm"
          >
            <span>
              Highlighting <span className="font-semibold text-accent">{active}</span>
              <span className="text-ink-3"> · {n} {n === 1 ? 'match' : 'matches'}</span>
            </span>
            <motion.button
              type="button"
              onClick={() => setSkill(null)}
              whileTap={{ scale: 0.9 }}
              transition={snappy}
              aria-label="Clear skill filter"
              className="grid h-7 w-7 place-items-center rounded-full bg-line/[0.08] text-ink-2 hover:text-ink"
            >
              <X size={14} />
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

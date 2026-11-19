import { useRef } from 'react';
import { motion, useInView, useScroll } from 'framer-motion';
import { experience } from '../data';
import { Reveal, Section } from './ui';
import { useSkill } from './skillFilter';

/**
 * Scroll-linked timeline: the rail fills up to a line at 55% of the viewport,
 * and each role's dot lights up as that line passes it (and dims again on the way back).
 */
const LINE = '55%';

function Dot({ current }: { current?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  // Matches LINE: the viewport's bottom 45% doesn't count as "reached".
  const reached = useInView(ref, { margin: '0px 0px -45% 0px' });
  return (
    <span
      ref={ref}
      aria-hidden
      className={`absolute left-6 top-[1.85rem] z-10 grid h-4 w-4 -translate-x-1/2 place-items-center rounded-full transition-colors duration-500 sm:left-8 sm:top-[2.55rem] ${
        reached ? 'bg-accent' : 'bg-surface ring-2 ring-line/[0.14]'
      }`}
    >
      {reached && current && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-50 motion-reduce:hidden" />
      )}
      <span className={`h-1.5 w-1.5 rounded-full ${reached ? 'bg-accent-ink' : 'bg-transparent'}`} />
    </span>
  );
}

export default function Experience() {
  const listRef = useRef<HTMLOListElement>(null);
  const skill = useSkill();
  const { scrollYProgress } = useScroll({ target: listRef, offset: [`start ${LINE}`, `end ${LINE}`] });

  return (
    <Section
      id="experience"
      eyebrow="Experience"
      title="Three internships, three very different teams."
      intro="A mobile startup, an AI-first e-commerce brand and a CNCF open source project."
    >
      <ol ref={listRef} className="card relative divide-y divide-line/[0.06]">
        {/* Rail and its scroll-driven fill */}
        <span aria-hidden className="absolute bottom-10 left-6 top-10 w-[2px] -translate-x-1/2 rounded-full bg-line/[0.08] sm:left-8" />
        <motion.span
          aria-hidden
          style={{ scaleY: scrollYProgress, x: '-50%' }}
          className="absolute bottom-10 left-6 top-10 w-[2px] origin-top rounded-full bg-accent sm:left-8"
        />

        {experience.map((role, i) => (
          <Reveal
            as="li"
            key={role.company}
            delay={i * 0.06}
            className="relative grid gap-4 p-5 pl-12 sm:grid-cols-[11rem_1fr] sm:gap-8 sm:p-8 sm:pl-16"
          >
            <Dot current={role.current} />
            <div className={`hidden transition-opacity duration-300 sm:block ${skill && !role.skills.includes(skill) ? 'opacity-35' : ''}`}>
              <p className="text-[0.9375rem] font-medium">{role.period}</p>
              <p className="caption mt-1">{role.place}</p>
              {role.current && (
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  Now
                </span>
              )}
            </div>
            <div className={`transition-opacity duration-300 ${skill && !role.skills.includes(skill) ? 'opacity-35' : ''}`}>
              <h3 className="title">
                {role.company}
                <span className="block text-[1rem] font-normal text-ink-2 sm:inline sm:text-[1.3125rem] sm:font-semibold sm:text-ink">
                  <span className="hidden text-ink-3 sm:inline"> · </span>
                  {role.title}
                </span>
              </h3>
              <p className="caption mt-1 flex flex-wrap items-center gap-x-2 sm:hidden">
                {role.period} · {role.place}
                {role.current && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[0.6875rem] font-semibold text-success">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    Now
                  </span>
                )}
              </p>
              <ul className="mt-3 space-y-2 text-ink-2">
                {role.points.map((p) => (
                  <li
                    key={p}
                    className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:h-1 before:w-1 before:rounded-full before:bg-ink-3"
                  >
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                {role.tags.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

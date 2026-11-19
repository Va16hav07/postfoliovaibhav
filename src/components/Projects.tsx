import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { projects } from '../data';
import ProjectSheet from './ProjectSheet';
import ProjectVisual from './ProjectVisual';
import { Reveal, Section } from './ui';
import { SkillFilterBar } from './SkillFilter';
import { useSkill } from './skillFilter';
import { Tilt } from './effects';
import { snappy, spring } from './motion';

const slugFromHash = () => {
  const m = window.location.hash.match(/^#work\/([\w-]+)$/);
  return m && projects.some((p) => p.slug === m[1]) ? m[1] : null;
};

export default function Projects() {
  const [open, setOpen] = useState<string | null>(slugFromHash);
  const [hovered, setHovered] = useState<string | null>(null);
  const skill = useSkill();

  const show = useCallback((slug: string | null) => {
    setOpen(slug);
    // Shareable deep links (/#work/peak) without making the page jump.
    history.replaceState(null, '', slug ? `#work/${slug}` : '#work');
  }, []);

  useEffect(() => {
    const onOpen = (e: Event) => show((e as CustomEvent<string>).detail);
    const onHash = () => setOpen(slugFromHash());
    window.addEventListener('open-project', onOpen);
    window.addEventListener('hashchange', onHash);
    return () => {
      window.removeEventListener('open-project', onOpen);
      window.removeEventListener('hashchange', onHash);
    };
  }, [show]);

  const active = projects.find((p) => p.slug === open);

  return (
    <Section
      id="work"
      eyebrow="Selected work"
      title="Agents, tools and apps."
      intro="Things I've designed and built, from multi-agent systems to a media CLI. Open any project for the full story."
    >
      <SkillFilterBar />
      <LayoutGroup>
        <div className="grid gap-4 sm:gap-5 md:grid-cols-6">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 0.06} className={p.wide ? 'md:col-span-6' : p.featured ? 'md:col-span-3' : 'md:col-span-2'}>
              <Tilt
                className={`transition-[opacity,filter] duration-300 ${
                  skill && !p.skills.includes(skill) ? 'opacity-35 saturate-50' : ''
                }`}
              >
              <motion.button
                type="button"
                layoutId={`project-${p.slug}`}
                onClick={() => show(p.slug)}
                onHoverStart={() => setHovered(p.slug)}
                onHoverEnd={() => setHovered((h) => (h === p.slug ? null : h))}
                whileTap={{ scale: 0.98 }}
                transition={{ ...spring, scale: snappy }}
                style={{ borderRadius: 28 }}
                aria-haspopup="dialog"
                aria-label={`${p.title}: read the case study`}
                className={`card group flex h-full w-full flex-col overflow-hidden text-left transition-[box-shadow,opacity,filter] duration-300 hover:shadow-card-hover ${p.wide ? 'md:flex-row' : ''} ${skill && p.skills.includes(skill) ? 'ring-2 ring-accent/70' : ''}`}
              >
                {(p.featured || p.media) && (
                  <div className={`relative hidden aspect-[2/1] overflow-hidden bg-surface-2 sm:block ${p.wide ? 'md:w-1/2 md:shrink-0' : ''}`}>
                    <ProjectVisual
                      project={p}
                      playing={hovered === p.slug}
                      className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                    {p.media?.video && (
                      <span className="material absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-ink">
                        <Play size={11} className="fill-current" /> Demo
                      </span>
                    )}
                  </div>
                )}
                <div className={`flex flex-1 flex-col p-5 sm:p-6 ${p.wide ? 'md:justify-center md:p-8' : ''}`}>
                  <h3 className="title">{p.title}</h3>
                  {p.label && <p className="caption mt-1">{p.label}</p>}
                  <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-ink-2">{p.summary}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span key={t} className="chip">
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1 text-[0.9375rem] font-medium text-accent">
                    Case study
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </motion.button>
              </Tilt>
            </Reveal>
          ))}
        </div>

        <AnimatePresence>
          {active && <ProjectSheet key={active.slug} project={active} onClose={() => show(null)} />}
        </AnimatePresence>
      </LayoutGroup>
    </Section>
  );
}

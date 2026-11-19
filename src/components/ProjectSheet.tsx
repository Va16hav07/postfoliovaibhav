import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Github, X } from 'lucide-react';
import type { Project } from '../data';
import ProjectVisual from './ProjectVisual';
import { snappy, spring } from './motion';

/** A case study that grows out of its project card (shared layoutId). */
export default function ProjectSheet({ project, onClose }: { project: Project; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const cs = project.caseStudy;
  const repoUrl = `https://github.com/${project.repo}`;

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && dialogRef.current) {
        const items = dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      previous?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[65] flex items-end justify-center sm:items-center sm:p-6">
      {/* Dimming scrim: this is a focused, modal read */}
      <motion.div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        aria-hidden
      />

      <motion.div
        ref={dialogRef}
        layoutId={`project-${project.slug}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`sheet-${project.slug}`}
        transition={spring}
        style={{ borderRadius: 28 }}
        className="relative flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden bg-surface shadow-float ring-1 ring-line/10"
      >
        <div className="overflow-y-auto overscroll-contain">
          <div className="relative aspect-[2/1] bg-surface-2">
            <ProjectVisual project={project} playing />
            <motion.button
              ref={closeRef}
              type="button"
              onClick={onClose}
              whileTap={{ scale: 0.9 }}
              transition={snappy}
              aria-label="Close case study"
              className="material absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full text-ink"
            >
              <X size={18} />
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            transition={{ ...spring, delay: 0.12 }}
            className="p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:p-10"
          >
            {project.label && <p className="eyebrow mb-2">{project.label}</p>}
            <h2 id={`sheet-${project.slug}`} className="headline">
              {project.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-2">{project.summary}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Live demo <ArrowUpRight size={16} />
                </a>
              )}
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={project.liveUrl ? 'btn-secondary' : 'btn-primary'}
              >
                <Github size={16} /> Source on GitHub
              </a>
            </div>

            <section className="mt-10">
              <h3 className="eyebrow">The problem</h3>
              <p className="mt-2 text-[1.0625rem] leading-relaxed">{cs.problem}</p>
            </section>

            <section className="mt-8">
              <h3 className="eyebrow">How it works</h3>
              <ol className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-2">
                {cs.flow.map((step, i) => (
                  <li key={step} className="flex items-center gap-1.5">
                    <span className="rounded-xl bg-surface-2 px-3 py-1.5 text-sm font-medium ring-1 ring-line/[0.06]">
                      {step}
                    </span>
                    {i < cs.flow.length - 1 && <ArrowRight size={14} className="text-ink-3" aria-hidden />}
                  </li>
                ))}
              </ol>
            </section>

            <section className="mt-8">
              <h3 className="eyebrow">What was built</h3>
              <ul className="mt-3 space-y-2.5">
                {cs.built.map((b) => (
                  <li
                    key={b}
                    className="relative pl-4 leading-relaxed text-ink-2 before:absolute before:left-0 before:top-[0.7em] before:h-1 before:w-1 before:rounded-full before:bg-ink-3"
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </section>

            <div className="mt-8 grid gap-6 rounded-2xl bg-surface-2 p-5 sm:grid-cols-2">
              <div>
                <h3 className="caption font-medium uppercase tracking-wider">My role</h3>
                <p className="mt-1.5">{cs.role}</p>
              </div>
              <div>
                <h3 className="caption font-medium uppercase tracking-wider">Stack</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {project.tags.map((t) => (
                    <span key={t} className="chip bg-surface">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

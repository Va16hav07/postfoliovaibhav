import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { spring } from './motion';

/** Content rises into place once as it scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  className,
  as = 'div',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'li';
}) {
  const Tag = as === 'li' ? motion.li : motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
      transition={{ ...spring, delay }}
    >
      {children}
    </Tag>
  );
}

export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="py-14 sm:py-28" aria-labelledby={`${id}-title`}>
      <div className="page">
        <Reveal className="mb-8 sm:mb-14 max-w-2xl">
          <p className="eyebrow mb-3">{eyebrow}</p>
          <h2 id={`${id}-title`} className="headline">
            {title}
          </h2>
          {intro && <p className="mt-3 text-ink-2 sm:mt-4 sm:text-lg leading-relaxed">{intro}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  );
}

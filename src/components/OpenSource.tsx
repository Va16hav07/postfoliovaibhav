import { motion } from 'framer-motion';
import { ArrowUpRight, GitMerge } from 'lucide-react';
import { openSource } from '../data';
import GitHubActivity from './GitHubActivity';
import { Reveal, Section } from './ui';
import { useSkill } from './skillFilter';
import { snappy } from './motion';

const total = openSource.contributions.reduce((n, c) => n + c.prs, 0);

export default function OpenSource() {
  const skill = useSkill();
  return (
    <Section
      id="open-source"
      eyebrow="Open source"
      title={`${total} merged pull requests.`}
      intro="Contributions to projects other developers depend on, including Hugging Face Diffusers and the CNCF sandbox project KubeStellar."
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_2fr]">
        <Reveal className="hidden lg:block">
          <div className="card flex h-full flex-col justify-between gap-10 p-8">
            <div>
              <GitMerge className="text-accent" size={28} />
              <p className="mt-6 text-[4rem] font-bold leading-none tracking-tighter">{total}</p>
              <p className="mt-2 text-ink-2">merged PRs across 4 organizations</p>
            </div>
            <a href={openSource.allPrs} target="_blank" rel="noopener noreferrer" className="link">
              See them all on GitHub
              <ArrowUpRight size={16} />
            </a>
          </div>
        </Reveal>

        <ul className="card divide-y divide-line/[0.06] overflow-hidden">
          {openSource.contributions.map((c, i) => (
            <Reveal as="li" key={c.project} delay={i * 0.05}>
                <motion.a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileTap={{ scale: 0.99 }}
                  transition={snappy}
                  className={`group flex items-start gap-4 p-5 transition-[background-color,opacity] duration-300 hover:bg-surface-2/60 sm:gap-5 sm:p-6 ${skill ? (c.skills.includes(skill) ? 'bg-accent/[0.06]' : 'opacity-35') : ''}`}
                >
                  <div className="min-w-[3rem] text-right">
                    <span className="text-2xl font-semibold tracking-tight">{c.prs}</span>
                    <p className="caption">PR{c.prs > 1 ? 's' : ''}</p>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold tracking-tight">
                      {c.project} <span className="caption font-normal">· {c.org}</span>
                    </h3>
                    <p className="mt-1 text-[0.9375rem] text-ink-2">{c.note}</p>
                  </div>
                  <ArrowUpRight
                    size={18}
                    className="mt-1 shrink-0 text-ink-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                  />
                </motion.a>
            </Reveal>
          ))}
        </ul>
        <a href={openSource.allPrs} target="_blank" rel="noopener noreferrer" className="link px-1 lg:hidden">
          See all merged PRs on GitHub
          <ArrowUpRight size={16} />
        </a>
      </div>
      <Reveal>
        <GitHubActivity />
      </Reveal>
    </Section>
  );
}

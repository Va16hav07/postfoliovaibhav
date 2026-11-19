import { useEffect, useRef } from 'react';
import { ArrowUpRight, GitPullRequest } from 'lucide-react';
import github from '../generated/github.json';

interface Day {
  date: string;
  level: number;
  count: number;
}

const levelClass = ['bg-line/[0.07]', 'bg-accent/30', 'bg-accent/55', 'bg-accent/80', 'bg-accent'];
const fmtDay = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const fmtMonth = new Intl.DateTimeFormat('en-IN', { month: 'short', timeZone: 'UTC' });

/** Contribution calendar and latest merged PR, fetched at build time by scripts/fetch-github.mjs. */
export default function GitHubActivity() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const days = github.days as Day[];

  // Start scrolled to the most recent weeks on narrow screens.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  if (!days.length) return null;

  const weeks: Day[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  const months = weeks.map((w, i) => {
    const first = w[0].date.slice(0, 7);
    const prev = i > 0 ? weeks[i - 1][0].date.slice(0, 7) : '';
    return first !== prev && i < weeks.length - 2 ? fmtMonth.format(new Date(w[0].date)) : '';
  });
  const pr = github.latestPr;
  const updated = github.updatedAt ? fmtDay.format(new Date(github.updatedAt)) : null;

  return (
    <div className="card mt-5 grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_17rem]">
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="title">{github.total.toLocaleString('en-IN')} contributions in the last year</h3>
          {updated && <p className="caption">Updated {updated}</p>}
        </div>

        <div ref={scrollRef} className="-mx-1 mt-5 overflow-x-auto px-1 pb-2">
          <div className="inline-flex flex-col gap-1.5">
            <div className="flex gap-[2px] pl-0 text-[0.625rem] text-ink-3" aria-hidden>
              {months.map((m, i) => (
                <span key={i} className="w-[10px] shrink-0 overflow-visible whitespace-nowrap">
                  {m}
                </span>
              ))}
            </div>
            <div className="flex gap-[2px]" role="img" aria-label={`GitHub contribution calendar: ${github.total} contributions in the last year`}>
              {weeks.map((w, i) => (
                <div key={i} className="flex flex-col gap-[2px]">
                  {w.map((d) => (
                    <span
                      key={d.date}
                      title={`${d.count} contribution${d.count === 1 ? '' : 's'} on ${fmtDay.format(new Date(d.date))}`}
                      className={`h-[10px] w-[10px] rounded-[3px] ${levelClass[d.level] ?? levelClass[0]}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="caption mt-2 flex items-center justify-end gap-1.5" aria-hidden>
          Less
          {levelClass.map((c) => (
            <span key={c} className={`h-[10px] w-[10px] rounded-[3px] ${c}`} />
          ))}
          More
        </div>
      </div>

      {pr && (
        <a
          href={pr.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col justify-between gap-6 rounded-2xl bg-surface-2 p-5 ring-1 ring-line/[0.06] transition-colors hover:ring-accent/40"
        >
          <div>
            <p className="caption inline-flex items-center gap-1.5 font-medium">
              <GitPullRequest size={14} className="text-success" /> Latest merged PR
            </p>
            <p className="mt-3 font-semibold leading-snug tracking-tight first-letter:uppercase">{pr.title}</p>
            <p className="mt-1 font-mono text-xs text-ink-3">{pr.repo}</p>
          </div>
          <p className="flex items-center justify-between text-sm text-ink-2">
            Merged {fmtDay.format(new Date(pr.mergedAt))}
            <ArrowUpRight
              size={16}
              className="text-ink-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
            />
          </p>
        </a>
      )}
    </div>
  );
}

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { achievements, education, experience, openSource, profile, projects, skills } from '../data';
import { getAccent } from './accent';

type Line = { id: number; kind: 'in' | 'out'; content: ReactNode };

const A = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent underline-offset-4 hover:underline">
    {children}
  </a>
);
const Dim = ({ children }: { children: ReactNode }) => <span className="text-ink-3">{children}</span>;
const Hi = ({ children }: { children: ReactNode }) => <span className="font-semibold text-ink">{children}</span>;

const commandHelp: Array<[string, string]> = [
  ['whoami', 'who I am'],
  ['experience', 'where I have worked'],
  ['projects', 'things I have built'],
  ['open <name>', 'read a case study'],
  ['oss', 'open source contributions'],
  ['skills', 'what I work with'],
  ['education', 'where I study'],
  ['contact', 'how to reach me'],
  ['resume', 'open my resume'],
  ['play', 'Incident Commander, a 60-second on-call game'],
  ['merge-runner', 'a maze chase: ship commits, dodge bugs'],
  ['theme', 'switch light / dark'],
  ['clear', 'clear the screen'],
];

const files = ['about.txt', 'experience.md', 'projects/', 'resume.pdf', 'contact.txt'];

function setTheme(mode: 'light' | 'dark') {
  document.documentElement.classList.toggle('dark', mode === 'dark');
  localStorage.setItem('theme', mode);
  window.dispatchEvent(new Event('themechange'));
}

/** Short, stable fake hashes so the log looks like git. */
const hash = (s: string) => {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7);
};

const gitLog: Array<{ date: string; msg: string; head?: boolean }> = [
  { date: 'May 2026', msg: "feat(valzy): build both mobile apps and their backend from scratch", head: true },
  { date: 'Jul 2025', msg: 'feat(zuvees): AI support agents, CV quality checks, app shipped to both stores' },
  { date: 'Jun 2025', msg: 'feat(kubestellar): OpenTelemetry + Jaeger tracing as an IFoS intern (21 PRs merged)' },
  { date: 'Apr 2025', msg: 'fix(diffusers): make LANCZOS the default interpolation mode' },
  { date: 'Mar 2025', msg: 'chore: first open source PRs merged (RUXAILAB, CCExtractor)' },
  { date: 'Aug 2024', msg: 'init: start B.Tech in Computer Science (AI/ML) at Polaris' },
];

const logo = [
  '██╗   ██╗',
  '██║   ██║',
  '╚██╗ ██╔╝',
  ' ╚████╔╝ ',
  '  ╚██╔╝  ',
  '   ╚═╝   ',
];

function caseStudyText(slug: string): ReactNode {
  const p = projects.find((x) => x.slug === slug);
  if (!p) return `cat: projects/${slug}.md: No such file`;
  return (
    <div className="space-y-2">
      <div>
        <Hi># {p.title}</Hi> {p.label && <Dim>({p.label})</Dim>}
      </div>
      <div>{p.caseStudy.problem}</div>
      <div>
        <Dim>flow:</Dim> {p.caseStudy.flow.join(' → ')}
      </div>
      <div>
        <Dim>role:</Dim> {p.caseStudy.role}
      </div>
      <div>
        <Dim>stack:</Dim> {p.tags.join(', ')} · <A href={`https://github.com/${p.repo}`}>source</A>
      </div>
    </div>
  );
}

interface Ctx {
  history: string[];
}

function run(raw: string, ctx: Ctx = { history: [] }): ReactNode | 'clear' {
  const [cmd = '', ...args] = raw.trim().split(/\s+/);
  const arg = args.join(' ');

  switch (cmd.toLowerCase()) {
    case '':
      return null;
    case 'help':
    case '?':
      return (
        <div className="grid grid-cols-[7.75rem_1fr] gap-x-3 sm:grid-cols-[8.5rem_1fr] sm:gap-x-4">
          {commandHelp.map(([c, d]) => (
            <div key={c} className="contents">
              <Hi>{c}</Hi>
              <Dim>{d}</Dim>
            </div>
          ))}
          <div className="col-span-2 mt-2">
            <Dim>…plus a few hidden ones. Developers might start with </Dim>
            <Hi>git log</Hi>
            <Dim>.</Dim>
          </div>
        </div>
      );
    case 'whoami':
    case 'about':
    case 'cat':
      if (cmd === 'cat' && arg && arg !== 'about.txt') {
        if (arg === 'contact.txt') return run('contact');
        if (arg === 'experience.md') return run('experience');
        if (arg === 'resume.pdf') return run('resume');
        const m = arg.match(/^projects\/([\w-]+)(\.md)?$/);
        if (m) return caseStudyText(m[1]);
        return `cat: ${arg}: No such file`;
      }
      return (
        <div>
          <Hi>{profile.name}</Hi> · {profile.role} · {profile.location}
          <br />
          Currently {profile.status}. I build AI agents, mobile apps and developer tools, and I contribute to open
          source.
        </div>
      );
    case 'ls':
      if (arg.replace(/\/$/, '') === 'projects') {
        return (
          <div className="flex flex-wrap gap-x-6">
            {projects.map((p) => (
              <span key={p.slug}>{p.slug}.md</span>
            ))}
          </div>
        );
      }
      return (
        <div className="flex flex-wrap gap-x-6">
          {files.map((f) => (
            <span key={f} className={f.endsWith('/') ? 'text-accent' : ''}>
              {f}
            </span>
          ))}
        </div>
      );
    case 'experience':
    case 'work':
      return (
        <div className="space-y-1">
          {experience.map((r) => (
            <div key={r.company}>
              <Hi>{r.company}</Hi> · {r.title} <Dim>({r.period})</Dim>
            </div>
          ))}
        </div>
      );
    case 'projects':
    case 'cd':
      return (
        <div className="space-y-1">
          {projects.map((p) => (
            <div key={p.repo}>
              <A href={`https://github.com/${p.repo}`}>{p.title}</A> <Dim>· {p.tags.join(', ')}</Dim>
            </div>
          ))}
        </div>
      );
    case 'oss':
    case 'opensource':
    case 'open-source':
      return (
        <div className="space-y-1">
          {openSource.contributions.map((c) => (
            <div key={c.project}>
              <A href={c.url}>{c.project}</A> <Dim>· {c.prs} merged</Dim>
            </div>
          ))}
        </div>
      );
    case 'skills':
    case 'stack':
      return (
        <div className="space-y-1">
          {skills.map((g) => (
            <div key={g.group}>
              <Hi>{g.group}:</Hi> {g.items.join(', ')}
            </div>
          ))}
        </div>
      );
    case 'education':
      return (
        <div>
          {education.degree}
          <br />
          <Dim>
            {education.school} · {education.period}
          </Dim>
          {achievements.map((a) => (
            <div key={a}>★ {a}</div>
          ))}
        </div>
      );
    case 'contact':
    case 'email':
      return (
        <div className="space-y-1">
          <div>
            email <A href={`mailto:${profile.email}`}>{profile.email}</A>
          </div>
          <div>
            github <A href={profile.links.github}>Va16hav07</A>
          </div>
          <div>
            linkedin <A href={profile.links.linkedin}>va16hav</A>
          </div>
          <div>
            x <A href={profile.links.x}>@Va16hav</A>
          </div>
        </div>
      );
    case 'resume':
      window.open(profile.resume, '_blank', 'noopener');
      return 'Opening resume.pdf in a new tab…';
    case 'github':
      window.open(profile.links.github, '_blank', 'noopener');
      return 'Opening GitHub…';
    case 'linkedin':
      window.open(profile.links.linkedin, '_blank', 'noopener');
      return 'Opening LinkedIn…';
    case 'theme': {
      const next =
        arg === 'light' || arg === 'dark'
          ? arg
          : document.documentElement.classList.contains('dark')
            ? 'light'
            : 'dark';
      setTheme(next);
      return `Theme set to ${next}.`;
    }
    case 'sudo':
      return arg.toLowerCase().replace(/\s+/g, ' ') === 'hire vaibhav' ? (
        <div>
          Permission granted. ✅ Next step: <A href={`mailto:${profile.email}`}>{profile.email}</A>
        </div>
      ) : (
        <div>
          sudo: nice try. Try <Hi>sudo hire vaibhav</Hi>
        </div>
      );
    case 'play':
    case 'game':
      if (arg === 'merge-runner' || arg === 'merge') return run('merge-runner');
      window.dispatchEvent(new CustomEvent('open-game', { detail: 'incident' }));
      return 'Paging you in… good luck on call.';
    case 'merge-runner':
    case 'merge':
      window.dispatchEvent(new CustomEvent('open-game', { detail: 'merge' }));
      return 'Checking out main… watch out for bugs.';
    case 'open': {
      const p = projects.find((x) => x.slug === arg || x.title.toLowerCase().startsWith(arg.toLowerCase()));
      if (!arg || !p) return `usage: open <project>  (try: ${projects.map((x) => x.slug).join(', ')})`;
      document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
      window.dispatchEvent(new CustomEvent('open-project', { detail: p.slug }));
      return `Opening ${p.title}…`;
    }
    case 'git':
      if (!arg.startsWith('log')) return `git: '${arg || ''}' is not a command here. Try "git log".`;
      return (
        <div className="space-y-2">
          {gitLog.map((c) => (
            <div key={c.msg}>
              <span className="text-[#febc2e]">commit {hash(c.msg)}</span>
              {c.head && <span className="text-accent"> (HEAD → main)</span>}
              <div>
                <Dim>Date: {c.date}</Dim>
              </div>
              <div className="pl-4">{c.msg}</div>
            </div>
          ))}
        </div>
      );
    case 'neofetch': {
      const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      const prs = openSource.contributions.reduce((n, c) => n + c.prs, 0);
      const info: Array<[string, string]> = [
        ['OS', 'Vaibhav (Bengaluru, India)'],
        ['Host', profile.status],
        ['Kernel', 'B.Tech CSE (AI/ML), year 3'],
        ['Shell', 'vaibhav.sh'],
        ['Languages', skills[0].items.slice(0, 4).join(', ')],
        ['Packages', `${projects.length} projects, ${prs} merged PRs`],
        ['Theme', `${theme}, ${getAccent()} accent`],
      ];
      return (
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
          <pre className="font-mono leading-tight text-accent">{logo.join('\n')}</pre>
          <div>
            <div>
              <Hi>vaibhav</Hi>@<Hi>portfolio</Hi>
            </div>
            <Dim>─────────────────</Dim>
            {info.map(([k, v]) => (
              <div key={k}>
                <span className="text-accent">{k}</span>: {v}
              </div>
            ))}
          </div>
        </div>
      );
    }
    case 'history':
      return ctx.history.length ? (
        <div>
          {[...ctx.history].reverse().map((h, i) => (
            <div key={i}>
              <Dim>{String(i + 1).padStart(3, ' ')}</Dim> {h}
            </div>
          ))}
        </div>
      ) : (
        'No history yet. Type a few commands first.'
      );
    case 'date':
      return new Date().toString();
    case 'echo':
      return arg;
    case 'pwd':
      return '/home/vaibhav/portfolio';
    case 'clear':
      return 'clear';
    case 'exit':
      return 'There is no escape. Try "contact" instead.';
    default:
      return (
        <div>
          command not found: {cmd}. Type <Hi>help</Hi> to see what I can do.
        </div>
      );
  }
}

const completions = [
  ...commandHelp.map(([c]) => c),
  'help', 'ls', 'ls projects/', 'cat projects/', 'git log', 'neofetch', 'history', 'cat', 'merge-runner', 'github', 'linkedin', 'sudo hire vaibhav', 'date', 'echo', 'pwd',
];

const intro: ReactNode = (
  <div>
    Welcome to <Hi>vaibhav.sh</Hi>. Type <Hi>help</Hi> to see commands, or try <Hi>sudo hire vaibhav</Hi>.
  </div>
);

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([{ id: 0, kind: 'out', content: intro }]);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const submit = (cmd: string) => {
    const result = run(cmd, { history });
    if (result === 'clear') {
      setLines([]);
    } else {
      setLines((prev) => [
        ...prev,
        { id: nextId.current++, kind: 'in', content: cmd },
        ...(result !== null && result !== undefined ? [{ id: nextId.current++, kind: 'out' as const, content: result }] : []),
      ]);
    }
    if (cmd.trim()) setHistory((h) => [cmd, ...h].slice(0, 50));
    setCursor(-1);
    setValue('');
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submit(value);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(cursor + 1, history.length - 1);
      if (history[next] !== undefined) {
        setCursor(next);
        setValue(history[next]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = cursor - 1;
      setCursor(Math.max(next, -1));
      setValue(next >= 0 ? history[next] : '');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const match = completions.filter((c) => c.startsWith(value.toLowerCase()));
      if (value && match.length === 1) setValue(match[0]);
      else if (value && match.length > 1) {
        setLines((prev) => [
          ...prev,
          { id: nextId.current++, kind: 'in', content: value },
          { id: nextId.current++, kind: 'out', content: match.join('   ') },
        ]);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  const suggestions = ['help', 'projects', 'play', 'merge-runner', 'sudo hire vaibhav'];

  return (
    <div className="card overflow-hidden" onClick={() => inputRef.current?.focus()}>
      <div className="flex items-center gap-2 border-b border-line/[0.06] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" aria-hidden />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" aria-hidden />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" aria-hidden />
        <span className="ml-3 font-mono text-xs text-ink-3">vaibhav@portfolio: ~</span>
      </div>

      <div
        ref={scrollRef}
        className="h-72 overflow-y-auto px-4 py-4 font-mono text-[0.8125rem] leading-relaxed sm:h-96 sm:px-5"
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
      >
        {lines.map((l) =>
          l.kind === 'in' ? (
            <div key={l.id} className="mt-3 first:mt-0">
              <span className="text-success">➜</span> <span className="text-accent">~</span> {l.content}
            </div>
          ) : (
            <div key={l.id} className="mt-1 text-ink-2">
              {l.content}
            </div>
          ),
        )}
        <label className="mt-3 flex items-center gap-2">
          <span className="text-success">➜</span>
          <span className="text-accent">~</span>
          <span className="sr-only">Terminal command</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent text-base text-ink caret-accent outline-none focus-visible:outline-none sm:text-[0.8125rem]"
            placeholder="type a command…"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-line/[0.06] px-4 py-3">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              submit(s);
            }}
            className="rounded-full bg-surface-2 px-3 py-1 font-mono text-xs text-ink-2 transition-colors hover:text-ink"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

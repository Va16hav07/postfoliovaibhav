// All site content lives here. Components only handle layout.

export const profile = {
  name: 'Vaibhav Kumawat',
  role: 'Software Engineer',
  location: 'Bengaluru, India',
  email: 'vaibhavkumawat7605@gmail.com',
  resume: '/Vaibhav_Kumawat_Resume.pdf',
  status: 'SWE Intern at Valzy',
  links: {
    github: 'https://github.com/Va16hav07',
    linkedin: 'https://www.linkedin.com/in/va16hav/',
    x: 'https://x.com/Va1_6hav',
  },
};

export const stats = [
  { value: '3', label: 'internships' },
  { value: '28', label: 'merged open source PRs' },
  { value: '2', label: 'app stores shipped to' },
];

export interface Role {
  title: string;
  company: string;
  place: string;
  period: string;
  current?: boolean;
  points: string[];
  tags: string[];
  skills: string[]; // canonical names from `skills` below, used by the skill filter
}

export const experience: Role[] = [
  {
    title: 'Software Engineer Intern',
    company: 'Valzy',
    place: 'Remote',
    period: 'May 2026 – Present',
    current: true,
    points: [
      "Built both of Valzy's mobile apps from scratch in React Native (Expo) and TypeScript, along with their backend.",
      'Added push notifications with Firebase Cloud Messaging, EAS build pipelines and over-the-air updates.',
      'Added Hindi/English localization and a customer feedback module with dashboard metrics.',
    ],
    tags: ['React Native', 'Expo', 'TypeScript', 'Backend', 'Firebase'],
    skills: ['React Native', 'Expo', 'TypeScript', 'Firebase'],
  },
  {
    title: 'Software Engineer Intern',
    company: 'ZUVEES',
    place: 'Bengaluru',
    period: 'Jul 2025 – Dec 2025',
    points: [
      'Built AI agents that handle customer support queries, reducing manual work and response time.',
      'Implemented computer vision and ML pipelines for automated product quality inspection.',
      'Designed and built the ZUVEES mobile app from scratch and launched it on the App Store and Google Play.',
    ],
    tags: ['AI Agents', 'Computer Vision', 'Mobile'],
    skills: ['LLM agents', 'React Native'],
  },
  {
    title: 'Open Source Intern (IFoS)',
    company: 'KubeStellar',
    place: 'Remote',
    period: 'Jun 2025 – Aug 2025',
    points: [
      'Added OpenTelemetry tracing, performance metrics and error reporting to the KubeStellar UI.',
      'Linked frontend actions to backend traces in Jaeger, making issues faster to debug.',
      'Replaced a hardcoded pod health metric with a live Kubernetes API.',
    ],
    tags: ['OpenTelemetry', 'Jaeger', 'Kubernetes', 'React'],
    skills: ['OpenTelemetry', 'Kubernetes', 'React', 'TypeScript', 'Go'],
  },
];

export interface Project {
  slug: string; // used in URLs: /#work/<slug>
  title: string;
  summary: string;
  repo: string; // owner/name on GitHub
  tags: string[];
  label?: string;
  liveUrl?: string;
  featured?: boolean;
  skills: string[]; // canonical names from `skills`, used by the skill filter
  wide?: boolean; // full-width row with the visual beside the text
  /** Real visuals. Drop files in public/projects/ and point to them here. */
  media?: { video?: string; image?: string };
  caseStudy: {
    problem: string;
    flow: string[]; // "how it works", left to right
    built: string[];
    role: string;
  };
}

export const projects: Project[] = [
  {
    slug: 'travel-planner',
    title: 'Multi-Agent Travel Planner',
    summary:
      'Four LangGraph agents (planner, researcher, itinerary builder and budget estimator) share state to turn a free-text request into a day-by-day trip plan with a cost breakdown.',
    repo: 'Va16hav07/Multi-Agent-Travel-Planner',
    tags: ['LangGraph', 'LangChain', 'Groq', 'Streamlit'],
    skills: ['Python', 'LLM agents', 'LangGraph', 'LangChain', 'Groq'],
    featured: true,
    caseStudy: {
      problem:
        'Planning a trip means juggling research, a schedule and a budget at the same time. Asking one model to do all of it in a single prompt tends to blur the three together.',
      flow: ['Free-text request', 'Planner agent', 'Research agent', 'Itinerary builder', 'Budget estimator', 'Trip plan'],
      built: [
        'A LangGraph workflow where four specialised agents share one state object, and each agent only updates its own fields.',
        'The planner turns free text into structured JSON (destination, dates, budget, preferences), with error handling for messy input.',
        'The itinerary builder combines research notes, dates and preferences into a day-by-day plan.',
        'The budget estimator breaks costs into stay, transport, food and activities and checks them against the budget.',
        'A Streamlit interface on top, running LLaMA 3.3 70B on Groq.',
      ],
      role: 'Solo project. Designed and built end to end.',
    },
  },
  {
    slug: 'peak',
    title: 'PEAK: AI Incident Response',
    summary:
      'Watches production services. When one breaks, an agent reads Sentry errors and recent commits, finds the cause, posts it to Slack, and reverts it after a human approves.',
    repo: 'Arvind-kumar2006/Peak',
    tags: ['AI Agents', 'MCP', 'Node.js', 'Postgres'],
    skills: ['LLM agents', 'Tool calling', 'MCP', 'JavaScript', 'Node.js', 'React', 'PostgreSQL'],
    label: 'Team project',
    featured: true,
    caseStudy: {
      problem:
        'When production breaks, someone has to read the errors, dig through recent commits and work out which change caused it, usually under pressure.',
      flow: ['Health checks + Sentry', 'Incident opens', 'Agent investigates', 'Root cause to Slack', 'Human approves', 'Revert or fix PR', 'Verify recovery'],
      built: [
        "Monitors each service's health URL and Sentry error rate, and opens an incident when a threshold is crossed.",
        'An agent reads stack traces, lists recent commits and diffs, and ties the error to a single commit through MCP tools.',
        'Nothing changes without a human: the revert tool refuses to run unless someone approved that exact commit.',
        'Code fixes are tightly limited (at most 3 files and 60 lines, never CI, lockfiles or secrets) and verified against health checks after deploy.',
      ],
      role: 'Team project. I contributed 4 merged pull requests.',
    },
  },
  {
    slug: 'aria',
    title: 'Aria',
    summary: 'A voice assistant that manages your to-do list through tool calls and remembers what you tell it.',
    repo: 'Va16hav07/Voice-Agent-Aria',
    tags: ['Python', 'Flask', 'Groq'],
    skills: ['Python', 'LLM agents', 'Tool calling', 'Flask', 'Groq'],
    caseStudy: {
      problem:
        'Most voice assistants either chat or act. The interesting part is getting one to decide which to do, and to remember you between conversations.',
      flow: ['Your voice', 'Speech-to-text', 'LLaMA 3.3 70B', 'Reply or tool call', 'To-dos and memory', 'Spoken answer'],
      built: [
        "Speech in and out through the browser's Web Speech API, so it needs no extra services.",
        'The model decides when to reply and when to call tools that create, list, update and delete to-dos.',
        'It notices when you share personal facts, stores them in long-term memory, and recalls them into later conversations.',
        'A lightweight Flask backend with JSON persistence, running on Groq for fast responses.',
      ],
      role: 'Solo project. Designed and built end to end.',
    },
  },
  {
    slug: 'ojt-maker',
    title: 'OJT Journal Maker',
    summary: 'Gemini writes daily internship journal entries from a work summary and fills them into your PDF template.',
    repo: 'Va16hav07/OJT-maker',
    tags: ['FastAPI', 'Gemini', 'PDF'],
    skills: ['Python', 'FastAPI', 'Gemini'],
    caseStudy: {
      problem:
        'Internship journals need an entry for every working day, typed into a fixed PDF template. Doing that by hand for months of work is slow and repetitive.',
      flow: ['PDF template', 'Work summary + dates', 'Gemini splits the work', 'Review and edit', 'Filled PDF'],
      built: [
        'Splits your work across every day in the date range, skipping holidays and leave you choose.',
        'Gemini Flash-Lite writes a professional entry for each day, which you can edit before generating.',
        'Overlays the text onto your existing template using coordinate detection and label scanning (ReportLab and pypdf).',
        'A three-step wizard with live progress, served by FastAPI and deployable on Vercel. My most-starred repo.',
      ],
      role: 'Solo project. Designed and built end to end.',
    },
  },
  {
    slug: 'terminal-devtool',
    title: 'Terminal DevTool',
    summary: 'Convert, resize, compress and compare media from the terminal. Go backend, Rust CLI, FFmpeg underneath.',
    repo: 'Va16hav07/terminal-devtool',
    tags: ['Go', 'Rust', 'FFmpeg'],
    skills: ['Go'],
    caseStudy: {
      problem: "FFmpeg can do almost anything with media, but its flags are hard to remember and easy to get wrong.",
      flow: ['Rust CLI', 'Go backend', 'FFmpeg', 'Processed media'],
      built: [
        'Convert between formats, resize to a resolution, and compress video by bitrate with simple flags.',
        'Compare two files to see how much an optimisation actually saved.',
        'Works online through the Go backend or offline with local processing.',
        'A Rust CLI built with clap, with coloured output and tables.',
      ],
      role: 'Solo project. Designed and built end to end.',
    },
  },
  {
    slug: 'equiply',
    title: 'Equiply',
    summary: 'A rental marketplace with authentication, roles, listings, search, filtering and booking.',
    repo: 'nitish-002/Equiply',
    tags: ['MERN'],
    skills: ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB'],
    label: 'Team project',
    liveUrl: 'https://equiply-sage.vercel.app',
    media: { image: '/projects/equiply.jpg' },
    wide: true,
    caseStudy: {
      problem: 'Lots of things are needed only once in a while. Equiply lets people rent them from each other instead of buying.',
      flow: ['List an item', 'Search and filter', 'Book', 'Manage rentals'],
      built: [
        'Secure authentication with separate roles for owners and renters.',
        'Listing management for owners, plus search, filtering and booking for renters.',
        'REST APIs with MongoDB schemas designed for the marketplace.',
      ],
      role: 'Team project. I contributed 22 merged pull requests.',
    },
  },
];

const merged = (repo: string) =>
  `https://github.com/${repo}/pulls?q=is%3Apr+is%3Amerged+author%3AVa16hav07`;

export const openSource = {
  allPrs: 'https://github.com/search?q=author%3AVa16hav07+is%3Apr+is%3Amerged&type=pullrequests',
  contributions: [
    {
      project: 'KubeStellar UI',
      skills: ['TypeScript', 'React', 'Go', 'OpenTelemetry', 'Kubernetes'],
      org: 'CNCF Sandbox',
      prs: 21,
      url: merged('kubestellar/ui'),
      note: 'OpenTelemetry tracing, Vite code splitting, live pod health metrics, Hindi translations and workload view fixes.',
    },
    {
      project: 'Hugging Face Diffusers',
      skills: ['Python'],
      org: 'Hugging Face',
      prs: 1,
      url: 'https://github.com/huggingface/diffusers/pull/11463',
      note: 'Made LANCZOS the default interpolation mode for image resizing.',
    },
    {
      project: 'KubeStellar A2A',
      skills: ['Python', 'Gemini', 'LLM agents'],
      org: 'CNCF Sandbox',
      prs: 1,
      url: 'https://github.com/kubestellar/a2a/pull/36',
      note: 'Added Google Gemini as an AI provider for the agent-to-agent CLI.',
    },
    {
      project: 'RUXAILAB',
      skills: ['JavaScript'],
      org: 'RUXAILAB',
      prs: 3,
      url: merged('ruxailab/RUXAILAB'),
      note: 'Responsive layout and accessibility fixes in the usability testing platform.',
    },
    {
      project: 'Ultimate Alarm Clock',
      skills: [],
      org: 'CCExtractor',
      prs: 2,
      url: merged('CCExtractor/ultimate_alarm_clock'),
      note: 'Fixed alarm preview and Guardian Angel flows in the Flutter app.',
    },
  ],
};

export const skills = [
  { group: 'Languages', items: ['TypeScript', 'JavaScript', 'Python', 'Go', 'Java', 'SQL'] },
  { group: 'AI', items: ['LLM agents', 'Tool calling', 'MCP', 'LangGraph', 'LangChain', 'Gemini', 'Groq'] },
  { group: 'Web & Mobile', items: ['React', 'React Native', 'Expo', 'Tailwind CSS', 'Node.js', 'Express', 'FastAPI', 'Flask'] },
  { group: 'Data & DevOps', items: ['MongoDB', 'PostgreSQL', 'Firebase', 'Docker', 'Kubernetes', 'OpenTelemetry', 'Git'] },
];

export const photos = [
  { src: '/photo-smile', alt: 'Vaibhav smiling in a black Constellation 2026 t-shirt', caption: "Hi, I'm Vaibhav." },
  { src: '/photo-setup', alt: 'Vaibhav at his desk under red light, wearing a headset', caption: 'Where most of the code happens.' },
  { src: '/photo-desert', alt: 'Vaibhav shrugging in the desert, dressed in black', caption: 'Occasionally I touch grass. Or sand.' },
  { src: '/photo-bengaluru', alt: 'Vaibhav in front of Vidhana Soudha, Bengaluru, at dusk', caption: 'Bengaluru, my home base.' },
];

/** What I'm up to right now. Update the date when you change it. */
export const now = {
  updated: 'November 2026',
  items: [
    { label: 'Working', text: "Software Engineer Intern at Valzy, building both of its mobile apps and their backend." },
    { label: 'Studying', text: 'Third year of an Integrated B.Tech in Computer Science (AI/ML) at Polaris School of Technology.' },
    { label: 'Exploring', text: 'AI agents, voice interfaces, MCP and multi-agent systems.' },
    { label: 'Open to', text: 'Work on AI and developer tools, and things that leave the screen.' },
  ],
};

export const education = {
  degree: 'Integrated B.Tech, Computer Science (AI/ML)',
  school: 'Polaris School of Technology, Bengaluru',
  period: '2024 – 2028',
};

export const achievements = [
  'Graduated from KubeStellar Interns for Open Source (IFoS), Summer 2025.',
  'Led Sweat Smart to the zonals of Eureka IIT Bombay, among the top 500 startups selected across Asia.',
];

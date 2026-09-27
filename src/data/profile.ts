// Single source of truth for the site's content.
// Update this file when roles/projects/links change.

export const profile = {
  name: 'Adi Prabs',
  fullName: 'Aditya Prabakaran',
  tagline: 'Computing @ Imperial · SRE @ Apple',
  location: 'London, UK',
  emailPublic: 'adiprabs19@gmail.com',
  emailPersonal: 'aditya.prabakaran@gmail.com',
  github: 'TheDarkEyezor',
  githubUrl: 'https://github.com/TheDarkEyezor',
  linkedinUrl: 'https://www.linkedin.com/in/adiprabs/',
  instagramUrl: 'https://www.instagram.com/adiprabs/',
  resumeUrl: '/AdiPrabs_SWE.pdf',

  bio: [
    "I'm Adi, a Computing student at Imperial College London, currently SRE on the ML Platforms team at Apple.",
    "On the side, I ship production AI systems for early-stage startups. Past lives: real-time voice infrastructure (Canopy Labs), healthcare admin automation (Vani), LLM cost-reduction at Trajex, video saliency ML at Altus Reach.",
    "I like systems that hold up outside the demo: compilers, infra, agents, and the unglamorous work of turning something that runs once into something someone else can depend on.",
  ],

  now: [
    'Apple, SRE on ML Platforms.',
    'Side work with funded startups (ARR-stage).',
    'Exploring next venture: physical AI / edge AI / hardware-software plays.',
    'Project Nine: a quadruped robot on a PPO policy. Terrain first, climbing next.',
    'Kit: one assistant that remembers, runs on its own schedule, and reaches from my server to my screen and kitchen.',
  ],
};

export type Role = {
  company: string;
  role: string;
  period: string;
  location?: string;
  bullets: string[];
  tech: string[];
  live?: boolean;
  tag: 'Placement' | 'Founder' | 'Contract';
};

export const roles: Role[] = [
  {
    company: 'Apple',
    role: 'Site Reliability Engineer, ML Platforms',
    period: '2026–present',
    location: 'London, UK',
    tag: 'Placement',
    bullets: [
      'Built a Kubernetes capacity forensics platform end-to-end (collectors, scanners, delta-query UI) used by **30+** SREs to diagnose EC2 capacity exhaustion, saving up to **$3M** per AWS availability zone annually.',
      'Built a cloud-agnostic capacity request and reservation management system that replaced ad-hoc Slack coordination with an auditable workflow handling hundreds of requests monthly.',
      'Created a Kubernetes manifest validation framework detecting misconfigurations at deploy time; retrospective analysis shows it would have caught **72%** of deployment-related incidents over the prior year.',
    ],
    tech: ['Kubernetes', 'Go', 'AWS', 'SRE', 'Distributed systems', 'Observability', 'Linux'],
    live: true,
  },
  {
    company: '8x',
    role: 'Full-stack & AI/ML Developer',
    period: 'Apr 2026–May 2026',
    tag: 'Contract',
    bullets: [
      'Optimized production analytics from **24s to sub-second** via SQL-side aggregation and indexed Postgres RPC rewrites; cut /posts payloads **90%+** (22MB → ~1–2MB).',
      'Simplified messaging architecture, deleting ~400 lines of legacy API code while enabling a new admin reply UX.',
      'Resolved **3 critical** production vulnerabilities: org takeover, exposed financial Server Actions, and DB search-path injection across **49 functions**.',
    ],
    tech: ['PostgreSQL', 'Next.js', 'TypeScript', 'Node.js', 'Security'],
  },
  {
    company: 'Canopy Labs',
    role: 'General Engineer',
    period: 'Mar 2026–Apr 2026',
    tag: 'Contract',
    bullets: [
      'Consolidated a **5-VM** voice-routing architecture into a single gateway service, eliminating 2 dedicated sync VMs.',
      'Replaced 3s polling-based cache sync with Redis pub/sub, cutting cache-update latency to **sub-10ms**.',
      'Built atomic quota enforcement in Redis, closing a client-SDK tampering hole in the API.',
      'Added per-key rate limiting (60s sliding window, configurable RPM) directly in the gateway\'s WebSocket hot path.',
    ],
    tech: ['Redis', 'WebSockets', 'Gateway architecture', 'Rate limiting', 'Distributed systems'],
  },
  {
    company: 'Vani',
    role: 'Full-stack & AI/ML Developer',
    period: '2025–2026',
    tag: 'Founder',
    bullets: [
      'Architected, shipped, and deployed the flagship multi-tenant web app on AWS with Docker + Kubernetes.',
      'Cut p95 backend latency **500ms → 120ms**; scaled to **100+** concurrent users.',
      'Stood up CI/CD: release cadence **2 days → 6 hours**, production bugs **−76%**.',
      'Integrated LLM workflows via Model Context Protocol for clinical-admin automation.',
      'Held **99.9%** uptime through staged rollouts and load-balanced workers.',
    ],
    tech: ['React', 'TypeScript', 'Next.js', 'FastAPI', 'Redis', 'AWS', 'Kubernetes', 'Docker'],
  },
  {
    company: 'Trajex',
    role: 'Machine Learning Developer',
    period: '2024–2025',
    tag: 'Contract',
    bullets: [
      'Deployed LLama 3.2-7B-Instruct in production for a **20%** cost reduction vs OpenAI and **12%** lower inference latency.',
      'Led product design and built the inference backend.',
      'Pitched investors and onboarded K3 Capital Group as a paying client.',
    ],
    tech: ['LLama 3.2', 'Python', 'Inference optimization', 'Product'],
  },
  {
    company: 'Altus Reach',
    role: 'ML Engineer (Contract)',
    period: '2024',
    tag: 'Contract',
    bullets: [
      'Built a video saliency model in a team of 3, improving prediction accuracy by **19%**.',
      'Shipped Azure-hosted inference pipeline for production traffic.',
      'Full-stack work on company web app (TypeScript / Next.js / React).',
    ],
    tech: ['Azure AI', 'Python', 'TypeScript', 'Next.js', 'Computer Vision'],
  },
];

/**
 * A small demo attached to a project card.
 *
 * - `interactive` mounts a hand-built React sandbox from
 *   `src/app/components/demos/`. Add a new one by dropping a component there
 *   and registering it in `ProjectDemoPanel`'s INTERACTIVE map.
 * - `video` points at a file in `public/` (an mp4 screen capture works best;
 *   supply a `poster` so the collapsed card costs nothing to render).
 * - `embed` iframes an external sandbox or a hosted deploy.
 *
 * Everything is lazy: nothing loads until the card is expanded.
 */
export type ProjectDemo =
  | {
      kind: 'interactive';
      component:
        | 'slopfilter' | 'istoria' | 'swyftgesture' | 'wacc'
        | 'llama' | 'stocksentiment' | 'graphrag' | 'kagschema';
      /** One line on the card, before the demo is opened. */
      blurb: string;
    }
  | {
      kind: 'video';
      title: string;
      src: string;
      poster?: string;
      note?: string;
      caption?: string;
      blurb: string;
    }
  | {
      kind: 'embed';
      title: string;
      src: string;
      /** CSS aspect-ratio for the frame, e.g. '16 / 9'. */
      aspect?: string;
      note?: string;
      caption?: string;
      blurb: string;
    };

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  year: string;
  category: 'AI/ML' | 'Systems' | 'Tools' | 'Web' | 'Hardware';
  tech: string[];
  link?: string;
  github?: string;
  award?: string;
  featured?: boolean;
  status?: 'shipped' | 'wip' | 'archived';
  demo?: ProjectDemo;
  /** For projects made of several pieces: one line per component. */
  parts?: { name: string; repo?: string; role: string }[];
  /** Still images shown on the card, e.g. CAD renders. Local files in public/. */
  gallery?: { src: string; alt: string; caption: string; width: number; height: number }[];
  /** Blog posts about the project, by slug under /blog. */
  writeups?: { title: string; slug: string }[];
};

export const projects: Project[] = [
  {
    slug: 'nine',
    title: 'Project Nine',
    tagline: 'A 12-DOF quadruped, trained in simulation before it is built',
    description:
      'A four-legged robot whose MuJoCo model is generated straight from its Fusion 360 assembly, driven by a PPO policy. Rebuilding the sim from the CAD (12 DOF, down from a 32-DOF biomimetic cat) cut training to **8M** steps, **12x** fewer than the cat\u2019s best walking policy. Walks at **0.65 m/s** on flat ground with zero falls and handles mild terrain. The hardware build is sized at 0.7x scale for bus servos on a \u00a3500 budget; bench tests come first.',
    year: '2026',
    category: 'Hardware',
    tech: ['PyTorch', 'MuJoCo', 'PPO', 'RL', 'Fusion 360', 'AWS', 'Robotics'],
    featured: true,
    status: 'wip',
    demo: {
      kind: 'video',
      title: 'nine · flat-ground baseline',
      src: '/blog/nine/hw-flat-ctrl.mp4',
      poster: '/blog/nine/hw-flat-ctrl.jpg',
      note: 'simulation, nothing validated on hardware yet',
      blurb: 'The CAD-derived model walking under the current PPO policy, on all four legs.',
      caption:
        'Commanded to 1.2 m/s, it reaches about 0.65. The sim was rebuilt from the CAD assembly\u2019s own joint origins, dropping 32 DOF of biomimetic cat for the 12 DOF the physical robot actually has. Still simulation only: nothing here has run on hardware.',
    },
    gallery: [
      {
        src: '/blog/nine/cad-bearings-aligned.jpg',
        alt: 'Fusion 360 assembly of the Nine quadruped, with joint markers on each shoulder, hip and knee',
        caption: 'The Fusion 360 assembly. The knee motors sit inside the upper legs, so twelve joints show as eight motor cans.',
        width: 1400,
        height: 900,
      },
      {
        src: '/blog/nine/nine-hw-views.jpg',
        alt: 'Four views of the MuJoCo model generated from the CAD',
        caption: 'The MuJoCo model generated from it: 231 mm legs, 266 mm standing height, 4.6 kg.',
        width: 1400,
        height: 900,
      },
    ],
    writeups: [
      { title: 'Three months in: I threw out the cat', slug: 'nine-progress-sep-2026' },
      { title: 'My fastest robot was walking on three legs', slug: 'nine-three-legged-record' },
      { title: 'Sizing twelve servos for a robot that only exists in simulation', slug: 'nine-sizing-servos' },
    ],
  },
  {
    slug: 'istoria',
    title: 'Istoria',
    tagline: 'Turns a month of photos, texts and calendar events into the moments worth keeping',
    description:
      'Pipeline that scores personal-photo novelty and merges near-duplicates. Started from a CLIP-centroid baseline, rebuilt around distance-from-home and message-volume signals after CLIP turned out to measure visual novelty, not situational novelty.',
    year: '2026',
    category: 'AI/ML',
    tech: ['Python', 'CLIP', 'Computer Vision', 'ML'],
    github: 'https://github.com/TheDarkEyezor/istoria',
    featured: true,
    status: 'shipped',
    demo: {
      kind: 'interactive',
      component: 'istoria',
      blurb: 'Re-weight the ranking signals and watch a coffee mug outrank Iceland.',
    },
  },
  {
    slug: 'sandbox-orchestrator',
    title: 'Sandbox Orchestrator',
    tagline: 'FastAPI producer + async workers for ephemeral sandboxes',
    description:
      'A lightweight orchestration platform for spinning up isolated execution sandboxes, with producer/consumer queues, async lifecycle and blast-radius isolation.',
    year: '2026',
    category: 'Systems',
    tech: ['FastAPI', 'Python', 'AsyncIO', 'Containers'],
    github: 'https://github.com/TheDarkEyezor/sandbox-orchestrator',
    featured: true,
    status: 'wip',
  },
  {
    slug: 'kit',
    title: 'Kit',
    tagline: 'One assistant across my server, laptop, screen and kitchen, built to run without me',
    description:
      'A personal assistant built as one system rather than a pile of bots. Kit lives on my home server as an agent with its own long-term memory, skills and scheduled jobs: it works in the background, writes down what it learns, pings my phone when something actually needs me, and once a month audits its own conversations and rewrites its instructions. Around that brain, separate local services give it ears, eyes, a screen and a kitchen, all on one Tailscale network, so the same Kit answers whether I speak, gesture, look at something or hold up a tin. Anything that changes the outside world still waits for a yes.',
    year: '2026',
    category: 'AI/ML',
    tech: ['Python', 'Swift', 'OpenClaw', 'faster-whisper', 'Kokoro TTS', 'MediaPipe', 'YOLO', 'Apple Vision', 'Mealie', 'Tailscale'],
    featured: true,
    status: 'wip',
    parts: [
      {
        name: 'Brain',
        repo: 'kit-workspace',
        role: 'OpenClaw agent on the home server. Daily and long-term memory kept as files, skills for the kitchen and job applications, cron jobs that reach me through iCloud Reminders, and a monthly self-review that edits its own operating instructions.',
      },
      {
        name: 'Voice',
        repo: 'kit-voice',
        role: 'Wake word, Silero VAD end-of-speech, faster-whisper, then Kokoro-82M speech streamed back gaplessly. Interrupt it mid-sentence and it stops; keep talking after it finishes and it keeps listening. A conversation, not a command line.',
      },
      {
        name: 'Hands and eyes',
        repo: 'kit-control',
        role: 'MediaPipe gestures, webcam gaze tracking and YOLO scene context, sharing one action library with voice so a gesture and a spoken command call the same function. Asking about a CAD model sends the live Fusion 360 viewport instead of a screenshot.',
      },
      {
        name: 'Screen',
        repo: 'kit-overlay',
        role: 'Native Swift overlay on every display with an API to see what I\u2019m doing, guide me through it with cards and spotlights, and act. Actions are proposals: Kit shows what it will click and why, then waits for a keypress, a spoken yes or a gesture. Silence expires the request, and a remote caller can never skip the yes.',
      },
      {
        name: 'Kitchen',
        repo: 'kit-pantry',
        role: 'Turn a product in front of the phone camera and it lands in the pantry as a standardised Mealie ingredient with size and brand. Apple Vision reads net weight at arm\u2019s length **55%** of the time against Tesseract\u2019s **1%**; a local Llama 3.2 3B names and files foods Mealie has never seen.',
      },
    ],
  },
  {
    slug: 'llama-distillation',
    title: 'Llama Distillation',
    tagline: 'Fine-tuning Llama 3.2 on my own messages to sound like me',
    description:
      'QLoRA fine-tune of Llama 3.2 3B on years of my WhatsApp history, targeting my speech patterns and conversational style for a voice assistant. **64%** of assessed outputs matched ground-truth tone and style.',
    year: '2026',
    category: 'AI/ML',
    tech: ['PyTorch', 'Llama 3.2', 'QLoRA', 'Fine-tuning', 'Python'],
    status: 'shipped',
    demo: {
      kind: 'interactive',
      component: 'llama',
      blurb: 'Set the rank and targets, and see exactly how little of a 3.2B model QLoRA trains.',
    },
  },
  {
    slug: 'graphrag',
    title: 'GraphRAG Implementations',
    tagline: 'Retrieval-augmented generation pipelines, built from the parts up',
    description:
      'Notebook implementations of graph-based RAG, composing document retrieval with LLM generation for factual grounding and domain adaptation. Written to understand where retrieval actually helps and where it just adds latency.',
    year: '2025',
    category: 'AI/ML',
    tech: ['Python', 'Jupyter', 'GraphRAG', 'LLMs', 'Retrieval'],
    github: 'https://github.com/TheDarkEyezor/RAG',
    status: 'shipped',
    demo: {
      kind: 'interactive',
      component: 'graphrag',
      blurb: 'Real MiniLM vectors: retrieve, grade, and watch the grounding check fall over.',
    },
  },
  {
    slug: 'kag-schema',
    title: 'KAG Schema Diagnostics',
    tagline: 'Upstream error reporting for OpenSPG\u2019s schema DSL',
    description:
      'KAG is OpenSPG\u2019s knowledge-augmented generation framework, and the reasoning layer Kit runs on. My contributions are to its tooling: source-context error reporting for the SPG schema markup language, plus the missing- and duplicate-identifier checks that used to fail downstream with an unrelated message. Also fixed the Ollama client\u2019s JSON response handling for local models.',
    year: '2025',
    category: 'Tools',
    tech: ['Python', 'OpenSPG', 'KAG', 'Parsers', 'Ollama'],
    github: 'https://github.com/TheDarkEyezor/KAG',
    status: 'shipped',
    demo: {
      kind: 'interactive',
      component: 'kagschema',
      blurb: 'Break a schema and see the diagnostics point at the token that broke it.',
    },
  },
  {
    slug: 'stock-sentiment-dashboard',
    title: 'Stock Sentiment Dashboard',
    tagline: 'Equity movement forecasting from price and NLP sentiment signals',
    description:
      'An ML pipeline for forecasting equity movement, with feature engineering across price data and NLP sentiment drawn from news, political events and company disclosures.',
    year: '2025',
    category: 'AI/ML',
    tech: ['Python', 'NLP', 'Feature engineering', 'Time series', 'ML'],
    status: 'shipped',
    demo: {
      kind: 'interactive',
      component: 'stocksentiment',
      blurb: 'The indicator and sentiment feature stage, running on a synthetic series.',
    },
  },
  {
    slug: 'wacc-compiler',
    title: 'WACC Compiler',
    tagline: 'Front-to-back compiler with LLVM backend',
    description:
      'Scala compiler for the WACC language with full LLVM codegen, GitLab CI/CD, Docker-packaged toolchain, and a hosted PaaS deployment. Production-grade student project.',
    year: '2025',
    category: 'Systems',
    tech: ['Scala', 'LLVM', 'Docker', 'CI/CD'],
    github: 'https://github.com/TheDarkEyezor/WACC06',
    featured: true,
    status: 'shipped',
    demo: {
      kind: 'interactive',
      component: 'wacc',
      blurb: 'Type WACC source and watch it tokenise and parse into the real AST.',
    },
  },
  {
    slug: 'swyftgesture',
    title: 'SwyftGesture',
    tagline: 'Hands-free computer control via webcam',
    description:
      'Control mouse, scroll, and volume with hand gestures. Built with MediaPipe + OpenCV. Won 1st place at a hackathon.',
    year: '2022',
    category: 'AI/ML',
    tech: ['Python', 'MediaPipe', 'OpenCV'],
    github: 'https://github.com/TheDarkEyezor/Electro-Vision',
    award: '1ST · HACKATHON',
    status: 'shipped',
    demo: {
      kind: 'interactive',
      component: 'swyftgesture',
      blurb: 'Runs in the browser on your own camera. Same gestures, same thresholds.',
    },
  },
  {
    slug: 'slopfilter',
    title: 'SlopFilter',
    tagline: 'Browser extension that filters AI slop on Twitter',
    description:
      'A lightweight browser extension that real-time filters gen-AI content and misinformation from Twitter/X feeds. Pure JS, no dependencies.',
    year: '2025',
    category: 'Tools',
    tech: ['JavaScript', 'Browser Extension'],
    github: 'https://github.com/TheDarkEyezor/SlopFilter',
    featured: true,
    status: 'shipped',
    demo: {
      kind: 'interactive',
      component: 'slopfilter',
      blurb: 'Run the three detectors over a sample feed and move the threshold.',
    },
  },
  {
    slug: 'task-manager',
    title: 'Task Manager (C)',
    tagline: 'GUI task manager, hand-rolled in C',
    description:
      'A native task manager for the Imperial C lab project. Process listing, kill, sort and refresh, written from the ground up in C.',
    year: '2024',
    category: 'Systems',
    tech: ['C', 'GUI'],
    github: 'https://github.com/TheDarkEyezor/task_manager',
    status: 'shipped',
  },
  {
    slug: 'true-concurrency',
    title: 'TrueConcurrency',
    tagline: 'Concurrency primitives in C',
    description: 'Low-level concurrency primitives in C: locks, channels, schedulers.',
    year: '2025',
    category: 'Systems',
    tech: ['C', 'Concurrency'],
    github: 'https://github.com/TheDarkEyezor/TrueConcurrency',
    status: 'shipped',
  },
  {
    slug: 'fidicialens',
    title: 'FiduciaLens',
    tagline: 'Investor-facing portfolio lens',
    description:
      'Explorations in fiduciary tooling. Read between an investor and a fund, surface the trades that actually matter.',
    year: '2025',
    category: 'Tools',
    tech: ['Python'],
    github: 'https://github.com/TheDarkEyezor/FiduciaLens',
    status: 'wip',
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

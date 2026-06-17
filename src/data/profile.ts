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
    "I'm Adi — Computing student at Imperial College London, currently on an SRE placement at Apple.",
    "On the side, I ship production AI systems for early-stage startups. Past lives: healthcare admin automation (Vani), LLM cost-reduction at Trajex, video saliency ML at Altus Reach.",
    "I like systems that work at small scale and don't fall over at large scale — compilers, infra, agents, and the boring glue that turns demos into products.",
  ],

  now: [
    'Apple — SRE placement.',
    'Side work with funded startups (ARR-stage).',
    'Exploring next venture: physical AI / edge AI / hardware-software plays.',
    'Project Nine: a climbing quadruped robot, MuJoCo-first.',
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
};

export const roles: Role[] = [
  {
    company: 'Apple',
    role: 'Site Reliability Engineer (Placement)',
    period: '2026 — present',
    location: 'London, UK',
    bullets: [
      'Production reliability for internal services at Apple scale.',
      'Observability, on-call rotation, incident response, infra automation.',
    ],
    tech: ['SRE', 'Distributed systems', 'Observability', 'Linux'],
    live: true,
  },
  {
    company: 'VaNI MedTech',
    role: 'Full-stack & AI/ML Developer',
    period: '2025 — 2026',
    bullets: [
      'Architected, shipped, and deployed the flagship multi-tenant web app on AWS with Docker + Kubernetes.',
      'Cut p95 backend latency 500 ms → 120 ms; scaled to 100+ concurrent users.',
      'Stood up CI/CD: release cadence 2 days → 6 hours, production bugs −76%.',
      'Integrated LLM workflows via Model Context Protocol for clinical-admin automation.',
      'Held 99.9% uptime through staged rollouts and load-balanced workers.',
    ],
    tech: ['React', 'TypeScript', 'Next.js', 'FastAPI', 'Redis', 'AWS', 'Kubernetes', 'Docker'],
  },
  {
    company: 'Trajex',
    role: 'Machine Learning Developer',
    period: '2024 — 2025',
    bullets: [
      'Deployed LLama 3.2-7B-Instruct in production — 20% cost reduction vs OpenAI, 12% lower inference latency.',
      'Led product design and built the inference backend.',
      'Pitched investors and onboarded K3 Capital Group as a paying client.',
    ],
    tech: ['LLama 3.2', 'Python', 'Inference optimization', 'Product'],
  },
  {
    company: 'Altus Reach',
    role: 'ML Engineer (Contract)',
    period: '2024',
    bullets: [
      'Team of 3 — built a video saliency model improving prediction accuracy by 19%.',
      'Shipped Azure-hosted inference pipeline for production traffic.',
      'Full-stack work on company web app (TypeScript / Next.js / React).',
    ],
    tech: ['Azure AI', 'Python', 'TypeScript', 'Next.js', 'Computer Vision'],
  },
];

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
};

export const projects: Project[] = [
  {
    slug: 'nine',
    title: 'Project Nine',
    tagline: 'Climbing quadruped robot, MuJoCo-first',
    description:
      'Designing a four-legged climbing robot in simulation before metal. Policy learning in MuJoCo, then sim-to-real on off-the-shelf actuators. Hardware-software play targeting indie verticals.',
    year: '2026',
    category: 'Hardware',
    tech: ['MuJoCo', 'Python', 'RL', 'Robotics'],
    featured: true,
    status: 'wip',
  },
  {
    slug: 'sandbox-orchestrator',
    title: 'Sandbox Orchestrator',
    tagline: 'FastAPI producer + async workers for ephemeral sandboxes',
    description:
      'A lightweight orchestration platform for spinning up isolated execution sandboxes — producer/consumer queues, async lifecycle, blast-radius isolation.',
    year: '2026',
    category: 'Systems',
    tech: ['FastAPI', 'Python', 'AsyncIO', 'Containers'],
    github: 'https://github.com/TheDarkEyezor/sandbox-orchestrator',
    featured: true,
    status: 'wip',
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
    github: 'https://github.com/TheDarkEyezor/SwyftGesture',
    award: '🥇 1st place hackathon',
    featured: true,
    status: 'shipped',
  },
  {
    slug: 'dosa',
    title: 'D.O.S.A.',
    tagline: 'Local AI assistant with KAG-style reasoning',
    description:
      'A personal assistant written in C++ that runs a local LLM for note-taking, timers, and search. Built on KAG (knowledge-augmented generation) principles. OOP-first, no cloud.',
    year: '2025',
    category: 'AI/ML',
    tech: ['C++', 'Local LLM', 'KAG'],
    github: 'https://github.com/TheDarkEyezor/DOSA',
    featured: true,
    status: 'wip',
  },
  {
    slug: 'auto-trade',
    title: 'Auto-Trade',
    tagline: 'Quantitative trading sandbox',
    description:
      'C++ trading strategies on QuantConnect — RSI, momentum, volatility, evaluated by Sharpe and Sortino. Long-running personal R&D into algo trading.',
    year: '2024',
    category: 'AI/ML',
    tech: ['C++', 'QuantConnect', 'Quant'],
    github: 'https://github.com/TheDarkEyezor/AlgoTrading',
    status: 'wip',
  },
  {
    slug: 'task-manager',
    title: 'Task Manager (C)',
    tagline: 'GUI task manager, hand-rolled in C',
    description:
      'A native task manager for the Imperial C lab project — process listing, kill, sort, refresh, written from the ground up in C.',
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
    description: 'Low-level concurrency primitives in C — locks, channels, schedulers.',
    year: '2025',
    category: 'Systems',
    tech: ['C', 'Concurrency'],
    github: 'https://github.com/TheDarkEyezor/TrueConcurrency',
    status: 'shipped',
  },
  {
    slug: 'calculus-diff',
    title: 'Symbolic Differentiation',
    tagline: 'Functional differentiator in Haskell',
    description:
      'Symbolic differentiation engine in Haskell — algebraic simplification, ADT-driven expression trees.',
    year: '2024',
    category: 'Tools',
    tech: ['Haskell', 'Functional'],
    status: 'shipped',
  },
  {
    slug: 'fidicialens',
    title: 'FiduciaLens',
    tagline: 'Investor-facing portfolio lens',
    description:
      'Explorations in fiduciary tooling — read between an investor and a fund, surface the trades that actually matter.',
    year: '2025',
    category: 'Tools',
    tech: ['Python'],
    github: 'https://github.com/TheDarkEyezor/FiduciaLens',
    status: 'wip',
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

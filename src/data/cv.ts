// CV-only content: education, skills, languages, and the condensed project
// list the PDF uses. Shared by /resume and /cv-print so the page and the PDF
// cannot drift apart.

export const education = {
  institution: 'Imperial College London',
  degree: 'MEng in Computing (AI & ML)',
  period: '2023–2027 (expected)',
  notes: [
    'On track for First Class · GPA 3.8',
    'Coursework: compilers, OS, ML, distributed systems',
    'Hackathons: 1st place, SwyftGesture (hands-free input)',
  ],
};

export const skills: Record<string, string[]> = {
  Languages: ['TypeScript', 'Python', 'C', 'C++', 'Rust', 'Scala', 'Haskell', 'Kotlin', 'JavaScript'],
  Systems: ['Linux', 'Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Azure', 'Vercel', 'Redis', 'WebSockets'],
  'AI / ML': ['PyTorch', 'LLama 3.2', 'QLoRA', 'PPO / RL', 'Isaac Lab', 'MuJoCo', 'YOLO11n', 'faster-whisper', 'MediaPipe', 'OpenCV', 'GraphRAG', 'MCP', 'Local LLMs'],
  Web: ['Next.js', 'React', 'FastAPI', 'Node.js', 'Tailwind', 'MDX'],
  Reliability: ['Observability', 'Incident response', 'Load testing', 'Distributed tracing'],
  'AI Tools': ['Claude Code', 'Codex CLI', 'Ollama', 'CLIP', 'OpenAI API', 'MCP'],
};

export const languages = [
  { lang: 'English', level: 'Native' },
  { lang: 'French',  level: 'Native' },
  { lang: 'Tamil',   level: 'Native' },
  { lang: 'Spanish', level: 'Reading & speaking' },
  { lang: 'Hindi',   level: 'Reading & speaking' },
];

/** Condensed one-liners for the PDF, which has less room than /projects. */
export const cvProjects = [
  {
    title: 'Project Nine',
    tech: 'PyTorch, Isaac Lab, MuJoCo, PPO',
    blurb:
      'Quadruped robot trained in simulation. Rebuilt the sim from the CAD assembly as a 12-DOF hardware model, cutting the steps needed for a stable walking policy by roughly an order of magnitude. 0.62 m/s sustained, 17.8s standing.',
  },
  {
    title: 'Kit',
    tech: 'Python, Swift, OpenClaw, faster-whisper, MediaPipe, YOLO',
    blurb:
      'Unified personal assistant: an always-on agent with persistent memory and scheduled jobs, plus voice, gesture, gaze, a native screen overlay and a pantry scanner. Real-world actions are proposed on screen and wait for a spoken, typed or gestured yes.',
  },
  {
    title: 'Istoria',
    tech: 'Python, CLIP',
    blurb:
      'Scores personal-photo novelty and merges near-duplicates. Rebuilt around distance-from-home and message-volume signals after CLIP turned out to measure visual, not situational, novelty.',
  },
  {
    title: 'WACC Compiler',
    tech: 'Scala, LLVM, Docker',
    blurb:
      'Front-to-back compiler with full LLVM codegen, GitLab CI/CD and a hosted PaaS deployment.',
  },
  {
    title: 'Sandbox Orchestrator',
    tech: 'FastAPI, AsyncIO',
    blurb:
      'Orchestration platform for ephemeral execution sandboxes, with producer/consumer queues and blast-radius isolation.',
  },
  {
    title: 'Llama Distillation',
    tech: 'PyTorch, QLoRA',
    blurb:
      'QLoRA fine-tune of Llama 3.2 3B on years of personal message history; 64% of assessed outputs matched ground-truth tone and style.',
  },
  {
    title: 'SlopFilter',
    tech: 'JavaScript',
    blurb:
      'Browser extension filtering AI-generated content from social feeds, using on-device Naive Bayes over a hand-curated vocabulary.',
  },
  {
    title: 'SwyftGesture',
    tech: 'Python, MediaPipe, OpenCV',
    blurb:
      'Hands-free mouse and volume control from webcam hand tracking. First place at a hackathon.',
  },
];

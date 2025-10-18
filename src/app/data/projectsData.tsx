export interface Project {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  categories: string[];
  techStack?: string[];
  link: string;
  date: string;
  demoUrl?: string;
  longDescription: string;
}

export const projectsData: Project[] = [
  {
    slug: "vani-medtech-ai-platform",
    title: "VaNI MedTech AI Healthcare Platform",
    description: "Built a full-stack AI-powered healthcare platform with 120ms latency, 99.9% uptime, and 76% bug reduction through comprehensive testing.",
    categories: ["AI/ML", "Frontend", "Backend", "Cloud Services"],
    tags: ["React", "TypeScript", "Next.js", "FastAPI", "Redis", "AWS", "Kubernetes"],
    techStack: ["React", "TypeScript", "Next.js", "FastAPI", "Redis", "AWS", "Kubernetes"],
    link: "#",
    date: "June 2025 - Present",
    longDescription: "Led development of an AI-powered healthcare platform at VaNI MedTech, achieving exceptional performance metrics with 120ms latency and 99.9% uptime."
  },
  {
    slug: "trajex-llama-deployment",
    title: "Trajex LLama3.2 Enterprise LLM Platform",
    description: "Deployed LLama3.2-7b-Instruct model achieving 20% cost reduction vs OpenAI and 12% faster processing.",
    categories: ["AI/ML", "Backend"],
    tags: ["LLama3.2", "Python", "ML Optimization"],
    techStack: ["LLama3.2", "Python"],
    link: "#",
    date: "Oct 2024 - Present",
    longDescription: "Deployed production LLama3.2-7b-Instruct model achieving 20% cost reduction and 12% faster processing."
  },
  {
    slug: "altus-reach-saliency",
    title: "Altus Reach Video Saliency Detection System",
    description: "Improved video saliency detection accuracy by 19% and processing speed by 8%.",
    categories: ["AI/ML", "Frontend", "Backend", "Cloud Services"],
    tags: ["Azure AI", "TypeScript", "Python", "React", "Next.js", "Computer Vision"],
    techStack: ["Azure AI", "TypeScript", "Python", "React", "Next.js"],
    link: "#",
    date: "Jan 2024 - Oct 2024",
    longDescription: "Achieved 19% accuracy improvement in video saliency detection through algorithm optimization."
  },
  {
    slug: "auto-trade",
    title: "Auto-trade: An automatic stock and fund recommender",
    description: "Individual project in quantitative analysis and algorithmic trading.",
    categories: ["AI/ML", "Frontend", "Backend"],
    tags: ["React", "Node.js", "MongoDB", "Express", "Quantitative Analysis"],
    techStack: ["React", "Node.js", "MongoDB", "Express"],
    link: "https://github.com/TheDarkEyezor/Auto-trade",
    date: "In Progress",
    longDescription: "Passion-driven initiative exploring the intersection of finance, mathematics, and technology."
  },
  {
    slug: "task-manager",
    title: "Task Manager",
    description: "GUI task manager developed at Imperial College London.",
    categories: ["Backend", "Systems"],
    tags: ["C", "C++", "GUI Development"],
    techStack: ["C", "C++"],
    link: "https://github.com/TheDarkEyezor/Task-Manager",
    date: "Apr 2024 - May 2024",
    longDescription: "Introduction to C programming through collaborative development."
  },
  {
    slug: "swyft-gesture",
    title: "SwyftGesture: A visual way to interact with your computer",
    description: "Control computer mouse and volume using hand gestures.",
    categories: ["AI/ML"],
    tags: ["Python", "OpenCV", "Computer Vision", "Mediapipe"],
    techStack: ["Python", "OpenCV", "Mediapipe"],
    link: "https://github.com/TheDarkEyezor/SwyftGesture",
    date: "April 2022",
    demoUrl: "https://www.youtube.com/embed/RZGuFNcqBjs",
    longDescription: "Pushing the boundaries of interactive technology with computer vision."
  },
  {
    slug: "finance-assistant",
    title: "Finance Assistant",
    description: "Multi-agent LLM application for financial advice.",
    categories: ["AI/ML", "Frontend", "Backend"],
    tags: ["NextJS", "TypeScript", "Python", "LLM"],
    techStack: ["NextJS", "TypeScript", "Python"],
    link: "https://github.com/TheDarkEyezor/Finance-Assistant",
    date: "2024",
    longDescription: "Sophisticated financial assistant leveraging multi-agent LLM technology."
  },
  {
    slug: "movie-recommendation",
    title: "Movie Recommendation bot",
    description: "Machine learning project using LightFM for personalized recommendations.",
    categories: ["AI/ML"],
    tags: ["Python", "LightFM", "Machine Learning"],
    techStack: ["Python", "LightFM"],
    link: "https://github.com/TheDarkEyezor/Movie-Recommendation",
    date: "March 2022",
    longDescription: "Introduction to machine learning through recommendation systems."
  },
  {
    slug: "reddit-news-scraper",
    title: "Reddit News Scraper",
    description: "Bot to deliver top news headlines from r/News.",
    categories: ["Backend"],
    tags: ["Python", "Reddit API", "Automation"],
    techStack: ["Python", "Reddit API"],
    link: "https://github.com/TheDarkEyezor/Reddit-News-Scraper",
    date: "April 2021",
    longDescription: "Early exploration of API integration and automation."
  },
  {
    slug: "adipeda-discord-bot",
    title: "AdiPedia: A Javascript Discord Bot",
    description: "Custom Discord bot for community engagement.",
    categories: ["Backend"],
    tags: ["Javascript", "Node.js", "Discord API"],
    techStack: ["Javascript", "Node.js"],
    link: "https://github.com/TheDarkEyezor/AdiPedia",
    date: "May 2020",
    longDescription: "Creating unique community experiences through bot development."
  },
  {
    slug: "day-trading-algorithm",
    title: "Day Trading Algorithm",
    description: "Quantitative analysis and risk assessment for day trading.",
    categories: ["AI/ML"],
    tags: ["Python", "QuantConnect", "Quantitative Finance"],
    techStack: ["Python", "QuantConnect"],
    link: "https://github.com/TheDarkEyezor/Day-Trading-Algorithm",
    date: "Ongoing",
    longDescription: "Focusing on quantitative analysis and financial modeling."
  },
  {
    slug: "calculus-differentiation",
    title: "Calculus Differentiation Program",
    description: "Functional programming project in Haskell for symbolic differentiation.",
    categories: ["Backend"],
    tags: ["Haskell", "Functional Programming"],
    techStack: ["Haskell"],
    link: "https://github.com/TheDarkEyezor/Calculus-Differentiation",
    date: "Completed",
    longDescription: "Symbolic differentiation using functional programming principles."
  },
  {
    slug: "music-file-sorter",
    title: "Music File Sorter",
    description: "Kotlin and Java-based program for organizing music files.",
    categories: ["Backend"],
    tags: ["Kotlin", "Java", "OOP"],
    techStack: ["Kotlin", "Java"],
    link: "https://github.com/TheDarkEyezor/Music-File-Sorter",
    date: "Completed",
    longDescription: "Efficient music file organization using OOP principles."
  },
  {
    slug: "wacc-compiler",
    title: "WACC Language Compiler",
    description: "Compiler using Scala, Docker, and LLVM.",
    categories: ["Backend", "Cloud Services", "Systems"],
    tags: ["Scala", "Docker", "LLVM", "GitLab CI/CD"],
    techStack: ["Scala", "Docker", "LLVM"],
    link: "https://github.com/TheDarkEyezor/WACC-Compiler",
    date: "Completed",
    longDescription: "Production-level compiler development experience."
  },
  {
    slug: "adipedia-discord-bot",
    title: "AdiPedia Discord Bot",
    description: "Discord bot with custom replies and virtual currency games.",
    categories: ["Backend"],
    tags: ["JavaScript", "DiscordJS", "Bot Development"],
    techStack: ["JavaScript", "DiscordJS"],
    link: "https://github.com/TheDarkEyezor/AdiPedia-Discord-Bot",
    date: "Completed",
    longDescription: "Enhanced community engagement through custom bot features."
  },
  {
    slug: "swyftgesture-dup",
    title: "SwyftGesture",
    description: "Control computer using hand gestures with Mediapipe.",
    categories: ["AI/ML"],
    tags: ["Python", "Mediapipe", "Computer Vision"],
    techStack: ["Python", "Mediapipe"],
    link: "https://github.com/TheDarkEyezor/SwyftGesture",
    date: "Completed",
    longDescription: "Hands-free control using computer vision."
  },
  {
    slug: "movie-recommendation-system",
    title: "Movie Recommendation System",
    description: "Recommendation system using PyTorch and LightFM dataset.",
    categories: ["AI/ML"],
    tags: ["Python", "PyTorch", "NumPy", "Pandas"],
    techStack: ["Python", "PyTorch", "NumPy", "Pandas"],
    link: "https://github.com/TheDarkEyezor/Movie-Recommendation-System",
    date: "Completed",
    longDescription: "Collaborative filtering and machine learning techniques."
  },
  {
    slug: "my-webpage",
    title: "My Webpage",
    description: "Personal portfolio website hosted on Vercel.",
    categories: ["Frontend"],
    tags: ["TypeScript", "React", "NextJS"],
    techStack: ["TypeScript", "React", "NextJS"],
    link: "https://github.com/TheDarkEyezor/My-Webpage",
    date: "Completed",
    longDescription: "Showcasing projects and career achievements."
  },
  {
    slug: "dosa-assistant",
    title: "D.O.S.A.",
    description: "Local LLM and C++-based assistant for productivity.",
    categories: ["AI/ML", "Systems"],
    tags: ["C++", "OOP", "Local LLM"],
    techStack: ["C++"],
    link: "https://github.com/TheDarkEyezor/DOSA-Assistant",
    date: "Completed",
    longDescription: "Productivity enhancement using C++ and OOP."
  }
];

export const getAllUniqueCategories = (projects: Project[]): string[] => {
  const allCategories = projects.flatMap(p => p.categories);
  return Array.from(new Set(allCategories)).sort();
};

export const uniqueCategories = getAllUniqueCategories(projectsData);
export const uniqueTags = uniqueCategories;

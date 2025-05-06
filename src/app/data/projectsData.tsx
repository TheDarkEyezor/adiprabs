export interface Project {
  slug: string; // Unique identifier for URL linking
  title: string;
  description: string;
  tags: string[]; // Detailed tags for the main Projects component
  techStack?: string[]; // Concise tech stack for the resume grid
  link: string;
  date: string;
  demoUrl?: string; // Optional demo URL
  longDescription: string;
}

// Consolidate data from both components here
export const projectsData: Project[] = [
  {
    slug: "auto-trade",
    title: "Auto-trade: An automatic stock and fund recommender",
    description: "Currently pursuing an individual project in quantitative analysis and algorithmic trading...",
    tags: ["React", "Node.js", "MongoDB", "Express", "Quantitative Analysis", "Algorithmic Trading"],
    techStack: ["React", "Node.js", "MongoDB", "Express"],
    link: "https://github.com/TheDarkEyezor/Auto-trade", // Use your actual GitHub link
    date: "In Progress",
    longDescription: "This project represents a passion-driven initiative to explore the intersection of finance, mathematics, and technology..."
  },
  {
    slug: "task-manager",
    title: "Task Manager",
    description: "Collaborated with a team at Imperial College London to develop a GUI task manager...",
    tags: ["C", "C++", "Product development", "GUI"],
    techStack: ["C", "C++"],
    link: "https://github.com/TheDarkEyezor/Task-Manager", // Use your actual GitHub link
    date: "Apr 2024 - May 2024",
    longDescription: "This project was an invaluable introduction to the world of C programming..."
  },
  {
    slug: "swyft-gesture",
    title: "SwyftGesture: A visual way to interact with your computer",
    description: "Built a unique app, SwyftGesture, that enabled users to control their computer's mouse and volume...",
    tags: ["Python", "OpenCV", "Computer Vision", "Accessibility", "Mediapipe"],
    techStack: ["Python", "OpenCV", "Computer Vision", "Mediapipe"],
    link: "https://github.com/TheDarkEyezor/SwyftGesture", // Use your actual GitHub link
    date: "April 2022 - April 2022",
    demoUrl: "https://www.youtube.com/embed/RZGuFNcqBjs", // Use embed URL for iframe
    longDescription: "This project allowed me to push the boundaries of interactive technology..."
  },
  {
    slug: "finance-assistant", // Added from resume grid
    title: "Finance Assistant",
    description: "Multi-agent LLM application for financial advice.",
    tags: ["NextJS", "TypeScript", "Python", "LLM", "Multi-agent Systems"],
    techStack: ["NextJS", "TypeScript", "Python"],
    link: "https://github.com/TheDarkEyezor/Finance-Assistant", // Use your actual GitHub link
    date: "Date TBD", // Add appropriate date
    longDescription: "Developing a sophisticated financial assistant leveraging multi-agent LLM technology to provide personalized advice and insights." // Add long description
  },
  // Add other projects from Projects.tsx here, ensuring unique slugs
  {
    slug: "movie-recommendation",
    title: "Movie Recommendation bot",
    description: "Launched into machine learning with a basic neural network project using LightFM.",
    tags: ["Python", "LightFM Library", "Machine Learning", "Recommendation Systems"],
    techStack: ["Python", "LightFM"],
    link: "https://github.com/TheDarkEyezor/Movie-Recommendation", // Use your actual GitHub link
    date: "March 2022 - April 2022",
    longDescription: "This project sparked my interest in the potential of machine learning..."
  },
  {
    slug: "reddit-news-scraper",
    title: "Reddit News Scraper",
    description: "Created a simple bot to deliver top news headlines from r/News...",
    tags: ["Python", "Reddit API", "Automation"],
    techStack: ["Python", "Reddit API"],
    link: "https://github.com/TheDarkEyezor/Reddit-News-Scraper", // Use your actual GitHub link
    date: "April 2021",
    longDescription: "This project marked an early foray into working with APIs..."
  },
  {
    slug: "adipeda-discord-bot",
    title: "AdiPedia: A Javascript Discord Bot",
    description: "Designed and developed a custom Discord bot using JavaScript...",
    tags: ["Javascript", "Node.js", "Discord API", "Community Building"],
    techStack: ["Javascript", "Node.js"],
    link: "https://github.com/TheDarkEyezor/AdiPedia", // Use your actual GitHub link
    date: "May 2020 - June 2020",
    longDescription: "This project not only showcased my coding skills but also allowed me to create a unique and engaging experience..."
  },
  {
    slug: "day-trading-algorithm",
    title: "Day Trading Algorithm",
    description: "Quantitative analysis techniques, risk assessment using volatility indicators, and references to quantitative finance resources.",
    tags: ["Python", "QuantConnect", "Finance"],
    techStack: ["Python", "QuantConnect"],
    link: "https://github.com/TheDarkEyezor/Day-Trading-Algorithm",
    date: "Ongoing",
    longDescription: "Actively learning and upskilling through online courses and resources, focusing on quantitative analysis, risk assessment, and financial modeling."
  },
  {
    slug: "calculus-differentiation",
    title: "Calculus Differentiation Program",
    description: "A functional programming project in Haskell for symbolic differentiation.",
    tags: ["Haskell", "Functional Programming"],
    techStack: ["Haskell"],
    link: "https://github.com/TheDarkEyezor/Calculus-Differentiation",
    date: "Completed",
    longDescription: "Developed a program to perform symbolic differentiation using functional programming principles in Haskell."
  },
  {
    slug: "music-file-sorter",
    title: "Music File Sorter",
    description: "A Kotlin and Java-based program for organizing music files using OOP principles.",
    tags: ["Kotlin", "Java", "OOP"],
    techStack: ["Kotlin", "Java"],
    link: "https://github.com/TheDarkEyezor/Music-File-Sorter",
    date: "Completed",
    longDescription: "Created a program to sort and organize music files efficiently using object-oriented programming."
  },
  {
    slug: "wacc-compiler",
    title: "WACC Language Compiler",
    description: "A compiler project using Scala, GitLab runners, Docker, and LLVM for production-level applications.",
    tags: ["Scala", "Docker", "LLVM", "Compiler"],
    techStack: ["Scala", "Docker", "LLVM"],
    link: "https://github.com/TheDarkEyezor/WACC-Compiler",
    date: "Completed",
    longDescription: "Built a compiler for the WACC language, gaining experience in abstraction, technical concepts, and production-level tools."
  },
  {
    slug: "adipedia-discord-bot",
    title: "AdiPedia Discord Bot",
    description: "A Discord bot with custom replies, virtual currency-based games, and embeds using DiscordJS API.",
    tags: ["JavaScript", "DiscordJS", "Bot Development"],
    techStack: ["JavaScript", "DiscordJS"],
    link: "https://github.com/TheDarkEyezor/AdiPedia-Discord-Bot",
    date: "Completed",
    longDescription: "Designed and developed a custom Discord bot to enhance community engagement with unique features."
  },
  {
    slug: "swyftgesture",
    title: "SwyftGesture",
    description: "A Python app to control the computer’s mouse and volume using hand gestures with Mediapipe.",
    tags: ["Python", "Mediapipe", "Computer Vision"],
    techStack: ["Python", "Mediapipe"],
    link: "https://github.com/TheDarkEyezor/SwyftGesture",
    date: "Completed",
    longDescription: "Developed an innovative app to enable hands-free control of computer functions using hand gestures."
  },
  {
    slug: "movie-recommendation-system",
    title: "Movie Recommendation System",
    description: "A recommendation system using PyTorch, NumPy, and Pandas with the LightFM dataset.",
    tags: ["Python", "PyTorch", "Recommendation Systems"],
    techStack: ["Python", "PyTorch", "NumPy", "Pandas"],
    link: "https://github.com/TheDarkEyezor/Movie-Recommendation-System",
    date: "Completed",
    longDescription: "Built a movie recommendation system leveraging machine learning techniques and collaborative filtering."
  },
  {
    slug: "my-webpage",
    title: "My Webpage",
    description: "A personal and career profile hosted on Vercel, written in TypeScript using React and NextJS.",
    tags: ["TypeScript", "React", "NextJS", "Web Development"],
    techStack: ["TypeScript", "React", "NextJS"],
    link: "https://github.com/TheDarkEyezor/My-Webpage",
    date: "Completed",
    longDescription: "Developed a personal portfolio website to showcase projects and career achievements."
  },
  {
    slug: "dosa-assistant",
    title: "D.O.S.A.",
    description: "A local LLM and C++-based assistant for note-taking, timer setting, and online search.",
    tags: ["C++", "OOP", "Assistant"],
    techStack: ["C++"],
    link: "https://github.com/TheDarkEyezor/DOSA-Assistant",
    date: "Completed",
    longDescription: "Created a local assistant application to enhance productivity using C++ and object-oriented programming."
  }
];

export const getAllUniqueTags = (projects: Project[]): string[] => {
  const allTags = projects.flatMap(p => p.tags);
  return Array.from(new Set(allTags)).sort();
};

export const uniqueTags = getAllUniqueTags(projectsData);
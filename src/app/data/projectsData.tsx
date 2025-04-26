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
];

export const getAllUniqueTags = (projects: Project[]): string[] => {
  const allTags = projects.flatMap(p => p.tags);
  return Array.from(new Set(allTags)).sort();
};

export const uniqueTags = getAllUniqueTags(projectsData);
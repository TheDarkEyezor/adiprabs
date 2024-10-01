import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';

interface Project {
  title: string;
  description: string;
  tags: string[];
  link: string;
  date: string;
  demoUrl: string;
  longDescription: string;
}

interface ProjectsProps {
  onClose: () => void;
}

const projectsData = [
  {
    title: "Auto-trade: An automatic stock and fund recommender",
    description: "Currently pursuing an individual project in quantitative analysis and algorithmic trading, aiming to develop a system that can autonomously analyze trades, assess risks, and execute trades on behalf of the trader.",
    tags: ["React", "Node.js", "MongoDB", "Express"],
    link: "https://github.com/yourusername/ecommerce-platform",
    date: "In Progress",
    demoUrl: "",
    longDescription: "This project represents a passion-driven initiative to explore the intersection of finance, mathematics, and technology. By merging these disciplines, I aim to create an autonomous trading system that can learn from market data, adapt to changing conditions, and execute trades with precision and efficiency."
  },
  {
    title: "Task Manager",
    description: "Collaborated with a team at Imperial College London to develop a GUI task manager, applying theoretical knowledge of C to create a functional application.",
    tags: ["C", "C++", "Product development"],
    link: "https://github.com/yourusername/ecommerce-platform",
    date: "Apr 2024 - May 2024",
    demoUrl: "",
    longDescription: "This project was an invaluable introduction to the world of C programming, providing a tangible example of theoretical concepts in action. The skills and knowledge gained from this project will be highly beneficial in further endeavors."
  },
  {
    title: "SwyftGesture: A visual way to interact with your computer",
    description: "Built a unique app, SwyftGesture, that enabled users to control their computer's mouse and volume using hand gestures, leveraging the Mediapipe library for seamless integration.",
    tags: ["Python", "OpenCV", "Computer Vision", "Accesibility"],
    link: "https://github.com/yourusername/ecommerce-platform",
    date: "April 2022 - April 2022",
    demoUrl: "https://www.youtube.com/watch?v=RZGuFNcqBjs", 
    longDescription: "This project allowed me to push the boundaries of interactive technology, merging human-computer interaction with machine learning capabilities. By harnessing the power of Mediapipe and OS APIs, I created an engaging experience that redefined the way users interact with their devices. The recognition from Codeflix serves as a testament to the innovative potential of this project!"
  },
  {
    title: "Movie Recommendation bot",
    description: "Launched into machine learning with a basic neural network project using LightFM.",
    tags: ["Python", "LightFM Library", "Machine Learning"],
    link: "https://github.com/yourusername/ecommerce-platform",
    date: "March 2022 - April 2022",
    demoUrl: "",
    longDescription: "This project sparked my interest in the potential of machine learning to drive personalized experiences and inform decision-making. Excited to build upon this foundation and explore more complex applications in future projects!"
  },
  {
    title: "Reddit News Scraper",
    description: "Created a simple bot to deliver top news headlines from r/News to my desktop every morning at 10am.",
    tags: ["Python", "Reddit API"],
    link: "https://github.com/yourusername/ecommerce-platform",
    date: "April 2021",
    demoUrl: "",
    longDescription: "This project marked an early foray into working with APIs, marking a stepping stone towards more complex projects that would leverage multiple application APIs."
  },
  {
    title: "AdiPedia: A Javascript Discord Bot",
    description: "Designed and developed a custom Discord bot using JavaScript to enhance engagement and entertainment in a private server with friends.",
    tags: ["Javascript", "Node.js", "Discord API"],
    link: "",
    date: "May 2020 - June 2020",
    demoUrl: "",
    longDescription: "This project not only showcased my coding skills but also allowed me to create a unique and engaging experience for friends and community members. The bot's success is a testament to the power of custom software solutions in enhancing online interactions and fostering meaningful connections. Can be found on my Github."
  },
];

const Projects: React.FC<ProjectsProps> = ({ onClose }) => {
  const [loadedProjects, setLoadedProjects] = useState<Project[]>([]);
  const [expandedProject, setExpandedProject] = useState<Project | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadedProjects(projectsData);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleExpandProject = (project: Project) => {
    setExpandedProject(project);
  };

  const handleCloseExpandedProject = () => {
    setExpandedProject(null);
  };

  return (
    <div className="min-h-screen bg-[#FF6B6B] text-white p-8 overflow-auto">
      <motion.button
        className="mb-6 flex items-center text-xl font-bold"
        onClick={onClose}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft className="mr-2" /> Back to Home
      </motion.button>

      <h1 className="text-4xl font-bold mb-8">My Projects</h1>

      {loadedProjects.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-2xl">Loading projects...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadedProjects.map((project, index) => (
            <motion.div
              key={index}
              className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleExpandProject(project)}
            >
              <h2 className="text-2xl font-bold mb-3">{project.title}</h2>
              <p className="mb-4">{project.description}</p>
              <div className="flex flex-wrap mb-4">
                {project.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="bg-[#52B788] text-white px-2 py-1 rounded-full text-sm mr-2 mb-2">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {expandedProject && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseExpandedProject}
          >
            <motion.div
              className="bg-white text-gray-800 p-8 rounded-lg shadow-xl w-11/12 h-5/6 overflow-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={handleCloseExpandedProject}
              >
                <X size={24} />
              </button>
              <h2 className="text-3xl font-bold mb-4">{expandedProject.title}</h2>
              <p className="text-gray-600 mb-4">Completed: {expandedProject.date}</p>
              <p className="mb-6">{expandedProject.longDescription}</p>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Technologies Used:</h3>
                <div className="flex flex-wrap">
                  {expandedProject.tags.map((tag, index) => (
                    <span key={index} className="bg-[#52B788] text-white px-2 py-1 rounded-full text-sm mr-2 mb-2">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Project Demo:</h3>
                { expandedProject.demoUrl &&
                  (<div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src={expandedProject.demoUrl}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>)
                }
              </div>
              <a
                href={expandedProject.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#FF6B6B] text-white font-bold py-2 px-4 rounded hover:bg-opacity-90 transition-colors"
              >
                View Project on GitHub
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
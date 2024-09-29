// Projects page
"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const projectsData = [
  {
    title: "E-commerce Platform",
    description: "A full-stack e-commerce solution built with React, Node.js, and MongoDB.",
    tags: ["React", "Node.js", "MongoDB", "Express"],
    link: "https://github.com/yourusername/ecommerce-platform"
  },
  {
    title: "Weather App",
    description: "A responsive weather application using OpenWeatherMap API and React.",
    tags: ["React", "API Integration", "Responsive Design"],
    link: "https://github.com/yourusername/weather-app"
  },
  {
    title: "Task Manager",
    description: "A productivity app built with React and Firebase for real-time updates.",
    tags: ["React", "Firebase", "Real-time Database"],
    link: "https://github.com/yourusername/task-manager"
  },
  // Add more projects as needed
];

const Projects = () => {
  interface Project {
    title: string;
    description: string;
    tags: string[];
    link: string;
  }
  
  const [loadedProjects, setLoadedProjects] = useState<Project[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadedProjects(projectsData);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const pageVariants = {
    initial: { opacity: 0, scale: 0.8 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 1.2 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  };

  return (
    <AnimatePresence>
      <motion.div
        className="min-h-screen bg-[#FF6B6B] text-white p-8 overflow-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Link href="/" passHref>
          <motion.button
            className="mb-6 flex items-center text-xl font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="mr-2" /> Back to Home
          </motion.button>
        </Link>

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
                className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
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
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-white text-[#FF6B6B] font-bold py-2 px-4 rounded hover:bg-opacity-90 transition-colors"
                >
                  View Project
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Projects;
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';

const projectsData = [
  {
    title: "E-commerce Platform",
    description: "A full-stack e-commerce solution built with React, Node.js, and MongoDB.",
    tags: ["React", "Node.js", "MongoDB", "Express"],
    link: "https://github.com/yourusername/ecommerce-platform",
    date: "June 2023",
    demoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with your actual demo video URL
    longDescription: "This e-commerce platform provides a seamless shopping experience with features like user authentication, product catalog, shopping cart, and secure checkout. The frontend is built with React for a responsive UI, while the backend uses Node.js and Express for robust API endpoints. MongoDB is used for efficient data storage and retrieval."
  },
  // ... (add more projects with similar structure)
];

const Projects = ({ onClose }) => {
  const [loadedProjects, setLoadedProjects] = useState([]);
  const [expandedProject, setExpandedProject] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadedProjects(projectsData);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleExpandProject = (project) => {
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
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={expandedProject.demoUrl}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
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
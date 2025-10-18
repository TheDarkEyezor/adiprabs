"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';
// Import uniqueTags as well
import { projectsData, Project, uniqueTags } from '../data/projectsData';

interface ProjectsProps {
  onClose: () => void;
  initialProjectSlug?: string | null;
}

const Projects: React.FC<ProjectsProps> = ({ onClose, initialProjectSlug }) => {
  const [expandedProject, setExpandedProject] = useState<Project | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>("All"); // State for filter

  // Effect to handle initial project expansion (keep existing)
  useEffect(() => {
    // ... existing useEffect code ...
  }, [initialProjectSlug]);

  const handleExpandProject = (project: Project) => {
    setExpandedProject(project);
  };

  const handleCloseExpandedProject = () => {
    setExpandedProject(null);
  };

  const handleTagChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTag(event.target.value);
  };

  // Filter projects based on the selected tag
  const filteredProjects = selectedTag === "All"
    ? projectsData
    : projectsData.filter(project => project.tags.includes(selectedTag));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF6B6B] via-[#FE8C8C] to-[#FF6B6B] text-white p-8 overflow-auto relative">
      {/* Animated background particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.button
        className="mb-6 flex items-center text-xl font-bold sticky top-8 z-10 glass-card p-3 rounded-lg border border-white/20 hover:bg-white/20 transition-all"
        onClick={onClose}
        whileHover={{ scale: 1.05, x: -5 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <ArrowLeft className="mr-2" /> Back to Home
      </motion.button>

      <div className="flex justify-between items-center mb-8 mt-4 relative z-10">
        <motion.h1 
          className="text-5xl font-bold bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          My Projects
        </motion.h1>
        {/* Filter Dropdown */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <select
            value={selectedTag}
            onChange={handleTagChange}
            className="glass-card text-white rounded-lg px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-300 cursor-pointer border border-white/20 pr-10"
          >
            <option value="All" className="bg-[#FF6B6B] text-white">All Tags</option>
            {uniqueTags.map(tag => (
              <option key={tag} value={tag} className="bg-[#FF6B6B] text-white">{tag}</option>
            ))}
          </select>
           <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </motion.div>
      </div>

      {/* Grid of project cards - Wrap map in AnimatePresence */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        <AnimatePresence>
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.slug}
              layout
              className="glass-card p-6 rounded-2xl shadow-2xl cursor-pointer border-2 border-white/20 hover:border-white/40 relative overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100, transition: { duration: 0.3 } }}
              transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 20,
                delay: index * 0.05 
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 40px rgba(255, 255, 255, 0.3), 0 20px 60px rgba(0, 0, 0, 0.4)"
              }}
              onClick={() => handleExpandProject(project)}
            >
              {/* Gradient overlay on hover */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              
              {/* Animated corner accent */}
              <motion.div 
                className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-3">{project.title}</h2>
                <p className="mb-4 line-clamp-3 text-white/90">{project.description}</p>
                <div className="flex flex-wrap mb-4">
                  {project.tags.slice(0, 5).map((tag, tagIndex) => (
                    <span key={tagIndex} className="glass-card border border-[#52B788]/50 bg-[#52B788]/30 text-white px-3 py-1 rounded-full text-sm mr-2 mb-2 hover:bg-[#52B788]/50 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Expanded Project Modal (keep existing) */}
      <AnimatePresence>
        {expandedProject && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseExpandedProject}
          >
            <motion.div
              className="glass-card text-white p-6 md:p-8 rounded-2xl shadow-2xl w-11/12 md:w-3/4 lg:w-2/3 max-h-[90vh] overflow-y-auto relative border-2 border-white/20"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gradient background overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl pointer-events-none" />
              
              {/* Animated accent */}
              <motion.div 
                className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              <motion.button
                className="absolute top-4 right-4 glass-card text-white hover:bg-white/20 z-10 p-2 rounded-full border border-white/30"
                onClick={handleCloseExpandedProject}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </motion.button>
              
              {/* Modal Content */}
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 pr-10 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">{expandedProject.title}</h2>
                <p className="text-white/70 mb-4 text-sm">Completed: {expandedProject.date}</p>
                <p className="mb-6 whitespace-pre-wrap text-white/90">{expandedProject.longDescription}</p>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Technologies Used:</h3>
                  <div className="flex flex-wrap">
                    {expandedProject.tags.map((tag, index) => (
                      <motion.span 
                        key={index} 
                        className="glass-card border border-[#52B788]/50 bg-[#52B788]/30 text-white px-3 py-1 rounded-full text-sm mr-2 mb-2"
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(82, 183, 136, 0.5)' }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </div>
                {/* Demo Video Section */}
                {expandedProject.demoUrl && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Project Demo:</h3>
                    <div className="aspect-w-16 aspect-h-9 glass-card rounded-lg overflow-hidden border-2 border-white/20">
                      <iframe
                        src={expandedProject.demoUrl}
                        title={`${expandedProject.title} Demo`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    </div>
                  </div>
                )}
                {/* GitHub Link */}
                {expandedProject.link && (
                  <motion.a
                    href={expandedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block glass-card bg-gradient-to-r from-[#FF6B6B]/50 to-[#FE8C8C]/50 text-white font-bold py-3 px-6 rounded-lg hover:from-[#FF6B6B]/70 hover:to-[#FE8C8C]/70 transition-all border border-white/20"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Project on GitHub
                  </motion.a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { projectsData, Project, uniqueTags } from '../data/projectsData';
import { TransitionLink } from '../components/TransitionLink';

export default function ProjectsClientContent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}

function ProjectsContent() {
  const searchParams = useSearchParams();
  const initialProjectSlug = searchParams.get('project');
  
  const [expandedProject, setExpandedProject] = useState<Project | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>("All");

  // ...rest of your component implementation remains the same
  useEffect(() => {
    if (initialProjectSlug) {
      const project = projectsData.find(p => p.slug === initialProjectSlug);
      if (project) {
        setExpandedProject(project);
      }
    }
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
    <div className="min-h-screen bg-[#FF6B6B] text-white p-8 overflow-auto relative">
      {/* Your existing JSX remains the same */}
      <TransitionLink href='/'>
        <motion.button
          className="mb-6 flex items-center text-xl font-bold sticky top-8 z-10 bg-[#FF6B6B] p-2 rounded-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="mr-2" /> Back to Home
        </motion.button>
      </TransitionLink>

      <div className="flex justify-between items-center mb-8 mt-4">
        <h1 className="text-4xl font-bold">My Projects</h1>
        {/* Filter Dropdown */}
        <div className="relative">
          <select
            value={selectedTag}
            onChange={handleTagChange}
            className="bg-white bg-opacity-20 text-white rounded px-3 py-1 appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-300 cursor-pointer"
          >
            <option value="All">All Tags</option>
            {uniqueTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
           <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      {/* Grid of project cards - Wrap map in AnimatePresence */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredProjects.map((project) => (
            <motion.div
              key={project.slug}
              layout // Enable smooth layout changes
              className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg cursor-pointer"
              initial={{ opacity: 0, y: 20 }} // Entry animation
              animate={{ opacity: 1, y: 0 }} // Normal state
              exit={{ opacity: 0, y: 100, transition: { duration: 0.3 } }} // Exit animation (fall off)
              whileHover={{ scale: 1.05, backgroundColor: "#FF6B6B" }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }} // Spring for layout and hover
              onClick={() => handleExpandProject(project)}
            >
              <h2 className="text-2xl font-bold mb-3">{project.title}</h2>
              <p className="mb-4 line-clamp-3">{project.description}</p>
              <div className="flex flex-wrap mb-4">
                {project.tags.slice(0, 5).map((tag, tagIndex) => (
                  <span key={tagIndex} className="bg-[#52B788] text-white px-2 py-1 rounded-full text-sm mr-2 mb-2">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Expanded Project Modal (keep existing) */}
      <AnimatePresence>
        {expandedProject && (
          // ... existing expanded project modal code ...
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseExpandedProject}
          >
            <motion.div
              className="bg-white text-gray-800 p-6 md:p-8 rounded-lg shadow-xl w-11/12 md:w-3/4 lg:w-2/3 max-h-[90vh] overflow-y-auto relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* ... existing modal content ... */}
               <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
                onClick={handleCloseExpandedProject}
              >
                <X size={24} />
              </button>
              {/* Modal Content */}
              <h2 className="text-2xl md:text-3xl font-bold mb-4 pr-10">{expandedProject.title}</h2>
              <p className="text-gray-600 mb-4 text-sm">Completed: {expandedProject.date}</p>
              <p className="mb-6 whitespace-pre-wrap">{expandedProject.longDescription}</p>
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
              {/* Demo Video Section */}
              {expandedProject.demoUrl && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Project Demo:</h3>
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded overflow-hidden">
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
                <a
                  href={expandedProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#FF6B6B] text-white font-bold py-2 px-4 rounded hover:bg-opacity-90 transition-colors"
                >
                  View Project on GitHub
                </a>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
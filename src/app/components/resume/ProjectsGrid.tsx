"use client";
import React, { useState } from 'react'; // Import useState
import { motion, AnimatePresence } from 'framer-motion'; // Import AnimatePresence
import { projectsData, uniqueTags } from '../../data/projectsData'; // Import shared data and uniqueTags
import Link from 'next/link';

const ProjectsGrid: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string>("All");

  // Filter projects based on the selected tag
  const filteredProjects = selectedTag === "All"
    ? projectsData.slice(0, 4) // Show first 4 if "All" or adjust as needed
    : projectsData.filter(project => project.tags.includes(selectedTag)).slice(0, 4); // Filter and take first 4

  const handleTagChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTag(event.target.value);
  };

  return (
    <section className="mb-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-yellow-300">Projects</h2>
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

      {/* Use AnimatePresence to handle enter/exit animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {filteredProjects.map((project) => (
            <motion.div
              key={project.slug} // Use unique slug
              layout // Enable smooth layout changes
              className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-filter backdrop-blur-sm flex flex-col"
              initial={{ opacity: 0, y: 20 }} // Entry animation
              animate={{ opacity: 1, y: 0 }} // Normal state
              exit={{ opacity: 0, y: 100, transition: { duration: 0.3 } }} // Exit animation (fall off)
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }} // Keep spring for hover
            >
              <div className="flex-grow">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-300 mb-4 line-clamp-3">{project.description}</p> {/* Limit description */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {(project.techStack || project.tags).slice(0, 4).map((tech, idx) => (
                    <span
                      key={idx}
                      className="bg-purple-900 bg-opacity-50 text-xs px-2 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <Link
                href={`/?expandProject=${project.slug}`}
                className="mt-auto text-blue-300 hover:text-blue-200 transition-colors self-start"
              >
                View Details →
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ProjectsGrid;
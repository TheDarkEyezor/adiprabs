'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, ExternalLink, Github } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { projectsData, Project, uniqueTags } from '../data/projectsData';
import { TransitionLink } from '../components/transitions/TransitionLink';
import Navbar from '../components/Navbar';
import ParticleField from '../components/effects/ParticleField';
import SectionHeading from '../components/common/SectionHeading';
import GlassCard from '../components/common/GlassCard';
import { staggerContainer, staggerItem } from '@/utils/animations';

export default function ProjectsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    }>
      <ProjectsContent />
    </Suspense>
  );
}

function ProjectsContent() {
  const searchParams = useSearchParams();
  const initialProjectSlug = searchParams.get('project');
  
  const [expandedProject, setExpandedProject] = useState<Project | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>("All");

  useEffect(() => {
    if (initialProjectSlug) {
      const project = projectsData.find(p => p.slug === initialProjectSlug);
      if (project) {
        setExpandedProject(project);
      }
    }
  }, [initialProjectSlug]);

  useEffect(() => {
    if (expandedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [expandedProject]);

  const filteredProjects = selectedTag === "All"
    ? projectsData
    : projectsData.filter(project => project.categories.includes(selectedTag));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white overflow-x-hidden">
      <ParticleField count={40} />
      
      {/* Fixed gradient orbs */}
      <motion.div
        className="fixed top-20 -left-40 w-96 h-96 bg-gradient-to-br from-[#FF6B6B]/30 to-[#FEC601]/30 rounded-full blur-3xl pointer-events-none"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
      />
      <motion.div
        className="fixed bottom-20 -right-40 w-96 h-96 bg-gradient-to-br from-[#4A90E2]/30 to-[#8B5CF6]/30 rounded-full blur-3xl pointer-events-none"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          delay: 4,
        }}
      />

      <Navbar />

      <div className="relative z-10 px-8 py-12 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <TransitionLink href="/">
            <motion.button
              className="mb-8 flex items-center text-white/80 hover:text-white transition-colors glass-card px-4 py-2 rounded-lg"
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="mr-2" size={20} /> Back to Home
            </motion.button>
          </TransitionLink>

          <SectionHeading 
            align="left" 
            gradient
            subtitle={`Showcasing ${filteredProjects.length} innovative projects across web development, AI/ML, and systems programming`}
          >
            My Projects
          </SectionHeading>

          {/* Filter */}
          <div className="mt-8 flex flex-wrap gap-3">
            <motion.button
              onClick={() => setSelectedTag("All")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedTag === "All"
                  ? 'bg-gradient-to-r from-[#FF6B6B] to-[#FEC601] text-white'
                  : 'glass-card text-white/80 hover:text-white hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              All Projects
            </motion.button>
            {uniqueTags.map(tag => (
              <motion.button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTag === tag
                    ? 'bg-gradient-to-r from-[#4A90E2] to-[#8B5CF6] text-white'
                    : 'glass-card text-white/80 hover:text-white hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <AnimatePresence mode="wait">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={`${selectedTag}-${project.slug}`}
                variants={staggerItem}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard
                  variant="interactive"
                  hoverEffect
                  className="h-full cursor-pointer group overflow-hidden"
                  onClick={() => setExpandedProject(project)}
                >
                  {/* Gradient accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF6B6B] via-[#FEC601] to-[#52B788] rounded-t-2xl" />
                  
                  {/* Content with padding to avoid gradient bar */}
                  <div className="relative p-6 pt-8">
                    <h2 className="text-2xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#FF6B6B] group-hover:to-[#FEC601] transition-all">
                      {project.title}
                    </h2>
                    <p className="mb-4 text-white/80 line-clamp-3">{project.description}</p>
                    
                    {/* Tech Stack Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map(tag => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/20 text-white/90"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* View More indicator */}
                    <div className="flex items-center text-sm text-white/60 group-hover:text-white transition-colors">
                      View Details
                      <motion.span
                        className="ml-2"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-2xl text-white/60">No projects found with this tag</p>
            <motion.button
              onClick={() => setSelectedTag("All")}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-[#FF6B6B] to-[#FEC601] rounded-lg font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Projects
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {expandedProject && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpandedProject(null)}
            />

            {/* Modal Content */}
            <motion.div
              className="relative glass-card p-8 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              {/* Close button */}
              <motion.button
                onClick={() => setExpandedProject(null)}
                className="absolute top-4 right-4 p-2 rounded-full glass-card hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} className="text-white" />
              </motion.button>

              {/* Content */}
              <div className="pr-8">
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#FF6B6B] to-[#FEC601] bg-clip-text text-transparent">
                  {expandedProject.title}
                </h2>
                
                <p className="text-lg text-white/90 mb-6 leading-relaxed">
                  {expandedProject.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {expandedProject.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-gradient-to-r from-white/10 to-white/5 border border-white/20 text-white text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-4">
                  {expandedProject.link && (
                    <motion.a
                      href={expandedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF6B6B] to-[#FEC601] rounded-lg font-semibold text-white"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Github size={20} />
                      View on GitHub
                    </motion.a>
                  )}
                  {expandedProject.demoUrl && (
                    <motion.a
                      href={expandedProject.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 glass-card border border-white/20 rounded-lg font-semibold text-white hover:bg-white/10"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ExternalLink size={20} />
                      Live Demo
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

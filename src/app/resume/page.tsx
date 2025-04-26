"use client";
import { motion } from 'framer-motion';
// Remove useState and X if no longer needed
// import { useState } from 'react';
// import { X } from 'lucide-react';
import ResumeHeader from '../components/resume/ResumeHeader';
import ExperienceCard from '../components/resume/ExperienceCard';
import EducationSection from '../components/resume/EducationSection';
import ProjectsGrid from '../components/resume/ProjectsGrid';
import SkillsSection from '../components/resume/SkillsSection';

// Remove props interface if no props are needed
// interface ResumeProps {
//   onClose?: () => void;
// }

// Update function signature - no props needed now
export default function Resume() {
  return (
    // This outer div provides the background and structure for the standalone page
    <div className="bg-gradient-to-b from-indigo-900 via-purple-800 to-pink-700 min-h-screen text-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        // Simple fade-in transition for the page content
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12 relative"
        // Add layoutId="resume-card" here ONLY if you implement shared layout animations across pages
        // layoutId="resume-card"
      >
        {/* Remove Close button */}
        {/* {onClose && ( ... )} */}

        <ResumeHeader />

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-yellow-300">Work Experience</h2>
          <div className="space-y-8">
            <ExperienceCard
              title="CTO"
              company="StealthAI"
              period="December 2024 – Present"
              details={[
                "Created web-application to chat with LLM agents to collate data for lawyers easily to assist with consultation",
                "Full-stack development of website and backend using React and Python",
                "Utilised latest research papers to build system",
                "Used Knowledge Augmented Generation"
              ]}
              // link="https://company-website.com" // Uncomment if you have a link
            />
            {/* Add other experience cards similarly */}
          </div>
        </section>
        
        <EducationSection />
        <ProjectsGrid />
        <SkillsSection />
      </motion.div>
    </div>
  );
}
"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';
import ResumeHeader from '../components/resume/ResumeHeader';
import ExperienceCard from '../components/resume/ExperienceCard';
import EducationSection from '../components/resume/EducationSection';
import ProjectsGrid from '../components/resume/ProjectsGrid';
import SkillsSection from '../components/resume/SkillsSection';

export default function Resume() {
  return (
    <div className="bg-gradient-to-b from-indigo-900 via-purple-800 to-pink-700 min-h-screen text-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12 relative"
      >
        <Link href="/" className="text-blue-500 hover:underline mb-6 inline-block">
          &larr; Back to Home
        </Link>

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
            />
          </div>
        </section>
        
        <EducationSection />
        <ProjectsGrid />
        <SkillsSection />
      </motion.div>
    </div>
  );
}
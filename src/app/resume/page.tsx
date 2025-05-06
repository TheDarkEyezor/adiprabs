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
                "Created web-application to chat with LLM agents to collate data for lawyers easily to assist with consultation. Solved a major problem that 68% of surveyed paralegals encountered.",
                "Full-stack development of website and backend using React and Python respectively.",
                "Utilised latest research papers to build system, resulting in reduced hallucination and more accurate questions asked to users, grounded in proven knowledge.",
                "Used Knowledge Augmented Generation, a newer generation of Retrieval Augmented Generation."
              ]}
            />
            <ExperienceCard
              title="Machine Learning Developer"
              company="Trajex"
              period="October 2024 – Present"
              details={[
                "Successful deployment of LLama3.2-7b-Instruct resulting in a 12% reduction in latency and 20% in cost for OpenAI API calls.",
                "Leadership in core development of flagship product, ensuring they meet user needs and expectations.",
                "Strong product design and iteration skills, informed by feedback from stakeholders.",
                "Experience in effective pitching and communication towards investors, resulting in onboarding of K3 Capital Group as a client."
              ]}
            />
            <ExperienceCard
              title="Machine Learning Engineer (Contractor)"
              company="Altus Reach"
              period="Jan 2024 – October 2024"
              details={[
                "Developed a machine learning algorithm with a team of 3 that improved predictive accuracy by 19% in video saliency detection.",
                "Worked with team to deploy a cloud-based infrastructure that supports our flagship product. (Microsoft Azure)",
                "Engaged in full-stack development to improve the appearance of company website and its functionality. (JavaScript, TypeScript, React, NextJS)"
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
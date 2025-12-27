'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import ParticleField from '../../components/effects/ParticleField';
import BlogPost from '../components/BlogPost';
import type { BlogPost as BlogPostType } from '@/lib/blog';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

interface BlogPostClientProps {
  post: BlogPostType;
  mdxSource: MDXRemoteSerializeResult;
}

export default function BlogPostClient({ post, mdxSource }: BlogPostClientProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white">
      <ParticleField count={20} />
      <Navbar />

      {/* Gradient orbs */}
      <motion.div
        className="fixed top-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#4A90E2]/20 to-[#8B5CF6]/20 rounded-full blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="fixed bottom-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#FF6B6B]/20 to-[#FEC601]/20 rounded-full blur-3xl pointer-events-none"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, delay: 4 }}
      />

      <main className="px-6 py-12 relative z-10">
        <BlogPost post={post} mdxSource={mdxSource} />
      </main>
    </div>
  );
}

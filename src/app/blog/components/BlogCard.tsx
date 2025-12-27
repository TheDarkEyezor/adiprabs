'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Tag } from 'lucide-react';
import Link from 'next/link';
import type { BlogPostMeta } from '@/lib/blog';

interface BlogCardProps {
  post: BlogPostMeta;
  index: number;
}

export default function BlogCard({ post, index }: BlogCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/blog/${post.slug}`}>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -5, scale: 1.02 }}
        className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
      >
        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs rounded-full bg-[#4A90E2]/20 text-[#4A90E2] border border-[#4A90E2]/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h2 className="text-xl font-bold text-white mb-2 group-hover:text-[#4A90E2] transition-colors line-clamp-2">
            {post.title}
          </h2>

          {/* Description */}
          <p className="text-white/60 text-sm mb-4 line-clamp-2">
            {post.description}
          </p>

          {/* Meta info */}
          <div className="flex items-center gap-4 text-white/40 text-xs">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{post.readingTime}</span>
            </div>
          </div>
        </div>

        {/* Hover gradient effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#4A90E2]/0 via-[#4A90E2]/5 to-[#8B5CF6]/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        />
      </motion.article>
    </Link>
  );
}

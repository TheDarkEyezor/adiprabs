'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-react';
import Link from 'next/link';
import { mdxComponents } from './MDXComponents';
import type { BlogPost as BlogPostType } from '@/lib/blog';

interface BlogPostProps {
  post: BlogPostType;
  mdxSource: MDXRemoteSerializeResult;
}

// Error boundary component for MDX rendering
class MDXErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('MDX Render Error:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default function BlogPost({ post, mdxSource }: BlogPostProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Ensure mdxSource has required properties
  if (!mdxSource || typeof mdxSource !== 'object') {
    return (
      <article className="max-w-3xl mx-auto">
        <div className="text-red-400 p-4 border border-red-500/50 rounded">
          Error rendering post: Invalid MDX source
        </div>
      </article>
    );
  }

  return (
    <article className="max-w-3xl mx-auto">
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>
      </motion.div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map(tag => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="px-3 py-1 text-sm rounded-full bg-[#4A90E2]/20 text-[#4A90E2] border border-[#4A90E2]/30 hover:bg-[#4A90E2]/30 transition-colors"
              >
                <span className="flex items-center gap-1">
                  <Tag size={12} />
                  {tag}
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent mb-4">
          {post.title}
        </h1>

        {/* Description */}
        {post.description && (
          <p className="text-xl text-white/60 mb-6">
            {post.description}
          </p>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-white/50 text-sm pb-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <time dateTime={post.date}>{formattedDate}</time>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>{post.readingTime}</span>
          </div>
          {post.author && (
            <div className="flex items-center gap-2">
              <span>by</span>
              <span className="text-white/70">{post.author}</span>
            </div>
          )}
        </div>
      </motion.header>

      {/* Cover Image */}
      {post.coverImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10 rounded-2xl overflow-hidden border border-white/10"
        >
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-auto"
          />
        </motion.div>
      )}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="prose prose-invert prose-lg max-w-none"
      >
        <MDXErrorBoundary
          fallback={
            <div className="p-4 border border-yellow-500/50 rounded bg-yellow-500/10 text-yellow-200">
              <p className="mb-2">Error rendering post content.</p>
              <p className="text-sm text-yellow-200/70">{post.description}</p>
            </div>
          }
        >
          <MDXRemote {...mdxSource} components={mdxComponents} />
        </MDXErrorBoundary>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 pt-8 border-t border-white/10"
      >
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            <ArrowLeft size={18} />
            More Articles
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="text-white/40 text-sm">Share:</span>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://adiprabs.com/blog/${post.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-[#1DA1F2] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://adiprabs.com/blog/${post.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-[#0A66C2] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </motion.footer>
    </article>
  );
}

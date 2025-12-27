'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Tag, X } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import ParticleField from '../components/effects/ParticleField';
import SectionHeading from '../components/common/SectionHeading';
import BlogCard from './components/BlogCard';
import type { BlogPostMeta } from '@/lib/blog';

interface BlogListClientProps {
  initialPosts: BlogPostMeta[];
  allTags: string[];
}

export default function BlogListClient({ initialPosts, allTags }: BlogListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tagFromUrl = searchParams.get('tag');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(tagFromUrl);

  const filteredPosts = useMemo(() => {
    let posts = initialPosts;

    // Filter by tag
    if (selectedTag) {
      posts = posts.filter(post => post.tags.includes(selectedTag));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      posts = posts.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return posts;
  }, [initialPosts, selectedTag, searchQuery]);

  const handleTagClick = (tag: string | null) => {
    setSelectedTag(tag);
    if (tag) {
      router.push(`/blog?tag=${encodeURIComponent(tag)}`, { scroll: false });
    } else {
      router.push('/blog', { scroll: false });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white">
      <ParticleField count={30} />
      <Navbar />

      {/* Gradient orbs */}
      <motion.div
        className="fixed top-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#4A90E2]/20 to-[#8B5CF6]/20 rounded-full blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="fixed bottom-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#FF6B6B]/20 to-[#FEC601]/20 rounded-full blur-3xl pointer-events-none"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, delay: 4 }}
      />

      <main className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <SectionHeading subtitle="Thoughts, tutorials, and insights on technology, AI, and more." gradient>
            Blog
          </SectionHeading>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#4A90E2]/50 focus:outline-none focus:ring-2 focus:ring-[#4A90E2]/20 text-white placeholder-white/40 transition-all"
            />
          </div>

          {/* Tags */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleTagClick(null)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                  !selectedTag
                    ? 'bg-[#4A90E2] border-[#4A90E2] text-white'
                    : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
                }`}
              >
                All
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-all flex items-center gap-1 ${
                    selectedTag === tag
                      ? 'bg-[#4A90E2] border-[#4A90E2] text-white'
                      : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
                  }`}
                >
                  <Tag size={12} />
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* Active filter indicator */}
          {(selectedTag || searchQuery) && (
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <span>Showing {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}</span>
              {(selectedTag || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedTag(null);
                    setSearchQuery('');
                    router.push('/blog', { scroll: false });
                  }}
                  className="flex items-center gap-1 text-[#FF6B6B] hover:text-[#FF6B6B]/80 transition-colors"
                >
                  <X size={14} />
                  Clear filters
                </button>
              )}
            </div>
          )}
        </motion.div>

        {/* Posts Grid */}
        <AnimatePresence mode="wait">
          {filteredPosts.length > 0 ? (
            <motion.div
              key="posts"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredPosts.map((post, index) => (
                <BlogCard key={post.slug} post={post} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {initialPosts.length === 0 ? 'No posts yet' : 'No matching posts'}
              </h3>
              <p className="text-white/60">
                {initialPosts.length === 0
                  ? 'Check back soon for new content!'
                  : 'Try adjusting your search or filter criteria.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

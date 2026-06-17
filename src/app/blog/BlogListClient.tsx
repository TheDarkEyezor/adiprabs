'use client';

import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Label, Tag } from '../components/ui/primitives';
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
    if (selectedTag) {
      posts = posts.filter((post) => post.tags.includes(selectedTag));
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
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

  const clearFilters = () => {
    setSelectedTag(null);
    setSearchQuery('');
    router.push('/blog', { scroll: false });
  };

  return (
    <>
      <Navbar />
      <main className="relative z-10">
        {/* Header */}
        <section className="relative">
          <Container className="pt-16 md:pt-24 pb-10">
            <Label number="03">writing</Label>
            <h1 className="mt-6 text-5xl md:text-7xl tracking-tightest font-medium text-ink-fg">
              Writing
            </h1>
            <p className="mt-4 max-w-reading text-xl text-ink-fg2 leading-snug">
              Notes on building systems, AI, and whatever I'm thinking about.
            </p>

            {/* Search */}
            <div className="mt-10 relative max-w-sm">
              <Search
                className="absolute left-0 top-1/2 -translate-y-1/2 text-ink-muted"
                size={16}
              />
              <input
                type="text"
                placeholder="search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-4 py-2 bg-transparent border-b border-ink-line focus:border-teal-dim focus:outline-none font-mono text-mono-sm text-ink-fg placeholder:text-ink-muted transition-colors"
              />
            </div>

            {/* Tag filters */}
            {allTags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                <button
                  onClick={() => handleTagClick(null)}
                  className={`px-3 py-1.5 border rounded-sm font-mono text-mono-sm transition-colors ${
                    !selectedTag
                      ? 'border-teal-dim text-teal'
                      : 'border-ink-line text-ink-fg2 hover:text-ink-fg hover:border-ink-line2'
                  }`}
                >
                  all
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`px-3 py-1.5 border rounded-sm font-mono text-mono-sm transition-colors ${
                      selectedTag === tag
                        ? 'border-teal-dim text-teal'
                        : 'border-ink-line text-ink-fg2 hover:text-ink-fg hover:border-ink-line2'
                    }`}
                  >
                    {tag.toLowerCase()}
                  </button>
                ))}
              </div>
            )}

            {/* Active filter count */}
            {(selectedTag || searchQuery) && (
              <div className="mt-4 flex items-center gap-3">
                <span className="font-mono text-mono-sm text-ink-muted">
                  {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''}
                </span>
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 font-mono text-mono-sm text-ink-fg2 hover:text-teal transition-colors"
                >
                  <X size={12} />
                  clear
                </button>
              </div>
            )}
          </Container>
        </section>

        {/* Post list */}
        <section className="relative">
          <div className="rule" />
          <Container className="py-8">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block border-t border-ink-line py-7 grid grid-cols-12 gap-6 group first:border-t-0"
                >
                  {/* Date + reading time */}
                  <div className="col-span-12 md:col-span-3 font-mono text-mono-sm text-ink-muted leading-loose">
                    <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    <br />
                    <span>{post.readingTime}</span>
                  </div>

                  {/* Title, description, tags */}
                  <div className="col-span-12 md:col-span-9">
                    <h2 className="text-2xl text-ink-fg tracking-snug group-hover:text-teal transition-colors">
                      {post.title}
                    </h2>
                    {post.description && (
                      <p className="mt-2 text-ink-fg2 max-w-reading leading-relaxed">
                        {post.description}
                      </p>
                    )}
                    {post.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <Tag key={tag}>{tag}</Tag>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className="py-20">
                <p className="text-ink-fg2 mb-4">
                  {initialPosts.length === 0
                    ? 'No posts yet. Check back soon.'
                    : 'No matching posts.'}
                </p>
                {initialPosts.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="px-3 py-1.5 border border-ink-line rounded-sm font-mono text-mono-sm text-ink-fg2 hover:border-teal-dim hover:text-teal transition-colors"
                  >
                    clear filters
                  </button>
                )}
              </div>
            )}
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}

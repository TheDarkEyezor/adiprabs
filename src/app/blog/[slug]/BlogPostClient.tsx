'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Container, Tag } from '../../components/ui/primitives';
import BlogPost from '../components/BlogPost';
import type { BlogPost as BlogPostType } from '@/lib/blog';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

interface BlogPostClientProps {
  post: BlogPostType;
  mdxSource: MDXRemoteSerializeResult;
}

export default function BlogPostClient({ post, mdxSource }: BlogPostClientProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <>
      <Navbar />
      <main className="relative z-10">
        <Container className="pt-12 md:pt-20 pb-24">
          {/* Back link */}
          <Link
            href="/blog"
            className="font-mono text-mono-sm text-ink-muted hover:text-teal transition-colors inline-block mb-10"
          >
            ← writing
          </Link>

          {/* Post header */}
          <header className="mb-10">
            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-4 font-mono text-mono-sm text-ink-muted">
              <time dateTime={post.date}>{formattedDate}</time>
              <span className="text-ink-line">·</span>
              <span>{post.readingTime}</span>
              {post.tags.length > 0 && (
                <>
                  <span className="text-ink-line">·</span>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog?tag=${encodeURIComponent(tag)}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Tag>{tag}</Tag>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-medium tracking-snug text-ink-fg leading-tight">
              {post.title}
            </h1>

            {post.description && (
              <p className="mt-4 text-xl text-ink-fg2 max-w-reading leading-relaxed">
                {post.description}
              </p>
            )}
          </header>

          <div className="rule" />

          {/* Content */}
          <div className="mt-10">
            <BlogPost post={post} mdxSource={mdxSource} />
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

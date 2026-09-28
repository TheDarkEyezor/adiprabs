'use client';

import React from 'react';
import type { BlogPost as BlogPostType } from '@/lib/blog';

interface BlogPostProps {
  post: BlogPostType;
  /** Post body, rendered on the server by next-mdx-remote/rsc. */
  children: React.ReactNode;
}

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

export default function BlogPost({ post, children }: BlogPostProps) {
  return (
    <>
      {post.coverImage && (
        <div className="mb-10 border border-ink-line overflow-hidden">
          {/* Covers are frontmatter paths or URLs with no known size. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.coverImage} alt={post.title} className="w-full h-auto" />
        </div>
      )}

      <article className="prose prose-invert max-w-reading">
        <MDXErrorBoundary
          fallback={
            <div className="border border-ink-line p-4 font-mono text-mono-sm text-ink-muted">
              <p>Error rendering post content.</p>
              {post.description && (
                <p className="mt-2 text-ink-muted">{post.description}</p>
              )}
            </div>
          }
        >
          {children}
        </MDXErrorBoundary>
      </article>
    </>
  );
}

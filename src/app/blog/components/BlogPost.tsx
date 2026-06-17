'use client';

import React from 'react';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { mdxComponents } from './MDXComponents';
import type { BlogPost as BlogPostType } from '@/lib/blog';

interface BlogPostProps {
  post: BlogPostType;
  mdxSource: MDXRemoteSerializeResult;
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

export default function BlogPost({ post, mdxSource }: BlogPostProps) {
  if (!mdxSource || typeof mdxSource !== 'object') {
    return (
      <article className="prose prose-invert max-w-reading">
        <div className="border border-ink-line p-4 font-mono text-mono-sm text-ink-muted">
          Error rendering post: Invalid MDX source
        </div>
      </article>
    );
  }

  return (
    <>
      {post.coverImage && (
        <div className="mb-10 border border-ink-line overflow-hidden">
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
          <MDXRemote {...mdxSource} components={mdxComponents} />
        </MDXErrorBoundary>
      </article>
    </>
  );
}

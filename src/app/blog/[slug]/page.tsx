import { Suspense } from 'react';
import React from 'react';
import { notFound } from 'next/navigation';
import { serialize } from 'next-mdx-remote/serialize';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import BlogPostClient from './BlogPostClient';

export const revalidate = 60;
export const dynamic = 'force-dynamic';  // Disable static generation for now

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static paths for all posts
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}

// Generate metadata for each post
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  
  if (!post) {
    return { title: 'Post Not Found | AdiPrabs' };
  }

  return {
    title: `${post.title} | AdiPrabs`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.coverImage ? [post.coverImage] : [],
      type: 'article',
      publishedTime: post.date,
      authors: [post.author || 'AdiPrabs'],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

async function BlogPostContent({ slug }: { slug: string }) {
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Serialize MDX content with error recovery
  let mdxSource;
  try {
    mdxSource = await serialize(post.content, {
      mdxOptions: {
        rehypePlugins: [rehypeHighlight, rehypeSlug],
        remarkPlugins: [],
      },
      parseFrontmatter: false,
    });
  } catch (error) {
    console.error(`Error serializing MDX for post "${slug}":`, error);
    
    // Return a fallback with a simple string output
    // This avoids component reference issues during SSR
    mdxSource = {
      compiledSource: `export default function MDXContent() { 
        return 'Content unavailable'; 
      }`,
      frontmatter: {},
      scope: {},
    } as any;
  }

  return <BlogPostClient post={post} mdxSource={mdxSource} />;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  
  return (
    <Suspense fallback={<BlogPostSkeleton />}>
      <BlogPostContent slug={slug} />
    </Suspense>
  );
}

function BlogPostSkeleton() {
  return (
    <div className="min-h-screen bg-ink-bg animate-pulse">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="h-4 bg-ink-surface2 rounded-sm w-24 mb-10" />
        <div className="h-4 bg-ink-surface2 rounded-sm w-48 mb-6" />
        <div className="h-10 bg-ink-surface2 rounded-sm w-3/4 mb-4" />
        <div className="h-5 bg-ink-surface rounded-sm w-1/2 mb-10" />
        <div className="h-px bg-ink-line mb-10" />
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 bg-ink-surface rounded-sm" style={{ width: `${70 + (i % 3) * 10}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

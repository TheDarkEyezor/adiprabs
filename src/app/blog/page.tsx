import { Suspense } from 'react';
import { getAllPosts, getAllTags } from '@/lib/blog';
import BlogListClient from './BlogListClient';

export const revalidate = 60; // Revalidate every 60 seconds

export const metadata = {
  title: 'Blog | AdiPrabs',
  description: 'Thoughts, tutorials, and insights on technology, AI, and more.',
};

async function BlogContent() {
  const [posts, tags] = await Promise.all([
    getAllPosts(),
    getAllTags(),
  ]);

  return <BlogListClient initialPosts={posts} allTags={tags} />;
}

export default function BlogPage() {
  return (
    <Suspense fallback={<BlogLoadingSkeleton />}>
      <BlogContent />
    </Suspense>
  );
}

function BlogLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="animate-pulse">
          <div className="h-12 bg-white/10 rounded w-48 mb-4" />
          <div className="h-6 bg-white/5 rounded w-96 mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white/5 h-80" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

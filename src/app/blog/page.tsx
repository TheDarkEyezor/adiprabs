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
    <div className="min-h-screen bg-ink-bg">
      <div className="max-w-6xl mx-auto px-6 py-20 animate-pulse">
        <div className="h-4 bg-ink-surface2 rounded-sm w-28 mb-6" />
        <div className="h-12 bg-ink-surface2 rounded-sm w-48 mb-4" />
        <div className="h-5 bg-ink-surface rounded-sm w-80 mb-12" />
        <div className="space-y-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border-t border-ink-line pt-7 grid grid-cols-12 gap-6">
              <div className="col-span-3 h-4 bg-ink-surface2 rounded-sm" />
              <div className="col-span-9 space-y-3">
                <div className="h-6 bg-ink-surface2 rounded-sm w-3/4" />
                <div className="h-4 bg-ink-surface rounded-sm w-full" />
                <div className="h-4 bg-ink-surface rounded-sm w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

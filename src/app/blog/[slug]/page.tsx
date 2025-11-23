'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import ReactMarkdown from 'react-markdown';
import { Calendar, ArrowLeft } from 'lucide-react';
import { TransitionLink } from '../../components/transitions/TransitionLink';

interface BlogPost {
  slug: string;
  title: string;
  content: string;
  date: string;
  coverImage?: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetch(`/api/blog/${slug}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setPost(null);
          } else {
            setPost(data);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching blog post:', error);
          setLoading(false);
        });
    }
  }, [slug]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
        <Navbar />
        <div className="text-center text-white/60 py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="mt-4">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
        <Navbar />
        <div className="text-center text-white/60 py-20">
          <p className="text-xl">Post not found</p>
          <TransitionLink href="/blog">
            <button className="mt-4 px-6 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#5AA3F0] transition-colors">
              Back to Blog
            </button>
          </TransitionLink>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-16">
        <TransitionLink href="/blog">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Blog
          </motion.button>
        </TransitionLink>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card rounded-lg overflow-hidden p-8 md:p-12"
        >
          {post.coverImage && (
            <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {post.title}
            </h1>
            
            <div className="flex items-center text-white/60">
              <Calendar className="w-5 h-5 mr-2" />
              <time>{formatDate(post.date)}</time>
            </div>
          </header>

          <div className="prose prose-invert prose-lg max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-white mt-8 mb-4">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold text-white mt-6 mb-3">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-bold text-white mt-4 mb-2">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="text-white/90 mb-4 leading-relaxed">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside text-white/90 mb-4 space-y-2">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside text-white/90 mb-4 space-y-2">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="text-white/90">{children}</li>
                ),
                code: ({ children }) => (
                  <code className="bg-white/10 text-[#4A90E2] px-2 py-1 rounded text-sm font-mono">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto mb-4">
                    {children}
                  </pre>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#4A90E2] hover:text-[#5AA3F0] underline"
                  >
                    {children}
                  </a>
                ),
                img: ({ src, alt }) => (
                  <img
                    src={src}
                    alt={alt}
                    className="rounded-lg my-6 w-full"
                  />
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-[#4A90E2] pl-4 italic text-white/80 my-4">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </motion.article>
      </main>
    </div>
  );
}



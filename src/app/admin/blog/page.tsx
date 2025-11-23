'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, LogOut, Upload, X, Save, Eye } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  published: boolean;
  coverImage?: string;
}

export default function AdminBlogPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [published, setPublished] = useState(true);
  const [slug, setSlug] = useState('');

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/check');
      const data = await response.json();
      
      if (data.authenticated) {
        setAuthenticated(true);
        loadPosts();
      } else {
        router.push('/admin/login');
      }
    } catch {
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async () => {
    try {
      const response = await fetch('/api/blog');
      const data = await response.json();
      setPosts(data);
    } catch {
      // Error loading posts
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const handleNewPost = () => {
    setEditingPost(null);
    setTitle('');
    setContent('');
    setExcerpt('');
    setCoverImage('');
    setPublished(true);
    setSlug('');
    setShowEditor(true);
    setShowPreview(false);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content);
    setExcerpt(post.excerpt || '');
    setCoverImage(post.coverImage || '');
    setPublished(post.published);
    setSlug(post.slug);
    setShowEditor(true);
    setShowPreview(false);
  };

  const handleDeletePost = async (postSlug: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/blog/${postSlug}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadPosts();
      } else {
        alert('Failed to delete post');
      }
    } catch {
      alert('Error deleting post');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/blog/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setCoverImage(data.url);
        alert('Image uploaded successfully!');
      } else {
        alert('Failed to upload image');
      }
    } catch {
      alert('Error uploading image');
    }
  };

  const handleSave = async () => {
    if (!title || !content) {
      alert('Title and content are required');
      return;
    }

    try {
      const url = editingPost ? `/api/blog/${editingPost.slug}` : '/api/blog';
      const method = editingPost ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          excerpt,
          coverImage,
          published,
          slug: slug || undefined,
        }),
      });

      if (response.ok) {
        setShowEditor(false);
        loadPosts();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to save post');
      }
    } catch {
      alert('Error saving post');
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center">
        <div className="text-white/60">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass-card rounded-lg p-6 mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Blog Admin</h1>
          <div className="flex gap-4">
            <button
              onClick={handleNewPost}
              className="px-4 py-2 bg-gradient-to-r from-[#4A90E2] to-[#8B5CF6] text-white rounded-lg hover:from-[#5AA3F0] hover:to-[#9D6DFF] transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Post
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>

        {/* Posts List */}
        {!showEditor && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-lg p-6"
              >
                <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
                <p className="text-white/60 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded ${post.published ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditPost(post)}
                      className="p-2 bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/30 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.slug)}
                      className="p-2 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Editor */}
        <AnimatePresence>
          {showEditor && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card rounded-lg p-6 mt-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingPost ? 'Edit Post' : 'New Post'}
                </h2>
                <button
                  onClick={() => setShowEditor(false)}
                  className="p-2 text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 mb-2">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!editingPost && !slug) {
                        setSlug(generateSlug(e.target.value));
                      }
                    }}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                    placeholder="Post title"
                  />
                </div>

                <div>
                  <label className="block text-white/80 mb-2">Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                    placeholder="post-slug"
                  />
                </div>

                <div>
                  <label className="block text-white/80 mb-2">Excerpt</label>
                  <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                    placeholder="Brief description"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-white/80 mb-2">Cover Image URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                      placeholder="/blog-images/image.jpg"
                    />
                    <label className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white cursor-pointer hover:bg-white/20 transition-colors flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-white/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="w-4 h-4"
                    />
                    Published
                  </label>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-white/80">Content (Markdown)</label>
                    <button
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      className="px-3 py-1 bg-white/10 text-white/80 rounded hover:bg-white/20 transition-colors flex items-center gap-2 text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      {showPreview ? 'Edit' : 'Preview'}
                    </button>
                  </div>
                  
                  {showPreview ? (
                    <div className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg min-h-[400px] prose prose-invert max-w-none">
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => <h1 className="text-3xl font-bold text-white mt-4 mb-2">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-2xl font-bold text-white mt-4 mb-2">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-xl font-bold text-white mt-3 mb-2">{children}</h3>,
                          p: ({ children }) => <p className="text-white/90 mb-3">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc list-inside text-white/90 mb-3">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside text-white/90 mb-3">{children}</ol>,
                          code: ({ children }) => <code className="bg-white/10 text-[#4A90E2] px-1 rounded">{children}</code>,
                          pre: ({ children }) => <pre className="bg-black/30 p-3 rounded mb-3 overflow-x-auto">{children}</pre>,
                          a: ({ href, children }) => <a href={href} className="text-[#4A90E2] underline">{children}</a>,
                          img: ({ src, alt }) => <img src={src} alt={alt} className="rounded my-3 max-w-full" />,
                        }}
                      >
                        {content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4A90E2] font-mono text-sm"
                      placeholder="Write your markdown content here..."
                      rows={20}
                    />
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-gradient-to-r from-[#4A90E2] to-[#8B5CF6] text-white rounded-lg hover:from-[#5AA3F0] hover:to-[#9D6DFF] transition-all flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Save
                  </button>
                  <button
                    onClick={() => setShowEditor(false)}
                    className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


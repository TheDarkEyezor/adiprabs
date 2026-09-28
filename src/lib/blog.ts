import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

// Every post is an .mdx (or .md) file here; the filename is the slug.
const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');
const POST_EXTENSIONS = ['.mdx', '.md'];
const SLUG_PATTERN = /^[\w-]+$/;

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  coverImage?: string;
  tags: string[];
  author?: string;
  readingTime: string;
  content: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  coverImage?: string;
  tags: string[];
  author?: string;
  readingTime: string;
}

/**
 * Read every post file as [slug, raw] pairs
 */
async function readPostFiles(): Promise<[string, string][]> {
  try {
    const names = await fs.readdir(POSTS_DIR);
    return await Promise.all(
      names
        .filter(name => POST_EXTENSIONS.some(ext => name.endsWith(ext)))
        .map(async (name): Promise<[string, string]> => [
          name.replace(/\.mdx?$/, ''),
          await fs.readFile(path.join(POSTS_DIR, name), 'utf8'),
        ])
    );
  } catch (error) {
    console.error('Error reading posts:', error);
    return [];
  }
}

/**
 * Parse MDX content and extract frontmatter
 */
function parsePost(content: string, slug: string): BlogPost {
  const { data, content: mdxContent } = matter(content);
  const stats = readingTime(mdxContent);

  return {
    slug,
    title: data.title || 'Untitled',
    date: data.date || new Date().toISOString(),
    description: data.description || '',
    coverImage: data.coverImage || data.cover_image || null,
    tags: data.tags || [],
    author: data.author || 'AdiPrabs',
    readingTime: stats.text,
    content: mdxContent,
  };
}

/**
 * Get all blog posts (metadata only, for listing)
 */
export async function getAllPosts(): Promise<BlogPostMeta[]> {
  const files = await readPostFiles();

  // Strip content and sort by date (newest first)
  return files
    .map(([slug, raw]) => parsePost(raw, slug))
    .map(({ content: _, ...meta }) => meta)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get a single blog post by slug (includes full content)
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  // The slug comes from the URL, so keep it from reaching outside POSTS_DIR.
  if (!SLUG_PATTERN.test(slug)) return null;

  // Try .mdx first, then .md
  for (const ext of POST_EXTENSIONS) {
    try {
      const raw = await fs.readFile(path.join(POSTS_DIR, `${slug}${ext}`), 'utf8');
      return parsePost(raw, slug);
    } catch {
      // Try the next extension.
    }
  }

  return null;
}

/**
 * Get all unique tags from all posts
 */
export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tagSet = new Set<string>();
  
  posts.forEach(post => {
    post.tags.forEach(tag => tagSet.add(tag));
  });
  
  return Array.from(tagSet).sort();
}

/**
 * Get posts by tag
 */
export async function getPostsByTag(tag: string): Promise<BlogPostMeta[]> {
  const posts = await getAllPosts();
  return posts.filter(post => post.tags.includes(tag));
}

/**
 * Get related posts (by shared tags)
 */
export async function getRelatedPosts(currentSlug: string, limit: number = 3): Promise<BlogPostMeta[]> {
  const posts = await getAllPosts();
  const currentPost = posts.find(p => p.slug === currentSlug);
  
  if (!currentPost) return [];
  
  const otherPosts = posts.filter(p => p.slug !== currentSlug);
  
  // Score posts by number of shared tags
  const scored = otherPosts.map(post => ({
    post,
    score: post.tags.filter(tag => currentPost.tags.includes(tag)).length,
  }));
  
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.post);
}

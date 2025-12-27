import matter from 'gray-matter';
import readingTime from 'reading-time';

// Configuration - Update this when you create your blog content repo
export const BLOG_CONFIG = {
  // GitHub repo containing your blog posts
  // Format: 'username/repo-name'
  // You'll create this repo to store your MDX files
  GITHUB_REPO: 'TheDarkEyezor/blog-content',
  
  // Branch to fetch from
  BRANCH: 'main',
  
  // Folder in the repo where posts are stored
  POSTS_FOLDER: 'posts',
  
  // GitHub API base URL
  API_BASE: 'https://api.github.com',
  
  // Raw content base URL
  RAW_BASE: 'https://raw.githubusercontent.com',
};

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

interface GitHubFile {
  name: string;
  path: string;
  type: string;
  download_url: string;
}

/**
 * Fetch the list of all blog post files from GitHub
 */
async function fetchPostFiles(): Promise<GitHubFile[]> {
  const { GITHUB_REPO, BRANCH, POSTS_FOLDER, API_BASE } = BLOG_CONFIG;
  const url = `${API_BASE}/repos/${GITHUB_REPO}/contents/${POSTS_FOLDER}?ref=${BRANCH}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        // Add token for private repos or higher rate limits
        // 'Authorization': `token ${process.env.GITHUB_TOKEN}`,
      },
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      console.error(`GitHub API error: ${response.status}`);
      return [];
    }

    const files: GitHubFile[] = await response.json();
    return files.filter(file => file.name.endsWith('.mdx') || file.name.endsWith('.md'));
  } catch (error) {
    console.error('Error fetching post files:', error);
    return [];
  }
}

/**
 * Fetch the raw content of a single post
 */
async function fetchPostContent(filePath: string): Promise<string | null> {
  const { GITHUB_REPO, BRANCH, RAW_BASE } = BLOG_CONFIG;
  const url = `${RAW_BASE}/${GITHUB_REPO}/${BRANCH}/${filePath}`;
  
  try {
    const response = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error(`Error fetching post content: ${response.status}`);
      return null;
    }

    return await response.text();
  } catch (error) {
    console.error('Error fetching post content:', error);
    return null;
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
  const files = await fetchPostFiles();
  
  const posts = await Promise.all(
    files.map(async (file) => {
      const content = await fetchPostContent(file.path);
      if (!content) return null;
      
      const slug = file.name.replace(/\.mdx?$/, '');
      const post = parsePost(content, slug);
      
      // Return metadata only (no content)
      const { content: _, ...meta } = post;
      return meta;
    })
  );

  // Filter out nulls and sort by date (newest first)
  return posts
    .filter((post): post is BlogPostMeta => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get a single blog post by slug (includes full content)
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const { POSTS_FOLDER } = BLOG_CONFIG;
  
  // Try .mdx first, then .md
  const extensions = ['.mdx', '.md'];
  
  for (const ext of extensions) {
    const content = await fetchPostContent(`${POSTS_FOLDER}/${slug}${ext}`);
    if (content) {
      return parsePost(content, slug);
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

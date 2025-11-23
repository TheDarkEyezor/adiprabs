import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  published: boolean;
  coverImage?: string;
}

const contentDirectory = path.join(process.cwd(), 'content', 'blog');

export function getAllBlogPosts(): BlogPost[] {
  try {
    if (!fs.existsSync(contentDirectory)) {
      return [];
    }

    const fileNames = fs.readdirSync(contentDirectory);
    const allPosts = fileNames
      .filter((name) => name.endsWith('.md'))
      .map((fileName) => {
        const fullPath = path.join(contentDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
          slug: fileName.replace(/\.md$/, ''),
          title: data.title || 'Untitled',
          excerpt: data.excerpt || content.substring(0, 150) + '...',
          content,
          date: data.date || new Date().toISOString(),
          published: data.published !== false,
          coverImage: data.coverImage,
        } as BlogPost;
      })
      .filter((post) => post.published)
      .sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

    return allPosts;
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return [];
  }
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(contentDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || 'Untitled',
      excerpt: data.excerpt || content.substring(0, 150) + '...',
      content,
      date: data.date || new Date().toISOString(),
      published: data.published !== false,
      coverImage: data.coverImage,
    } as BlogPost;
  } catch (error) {
    console.error('Error reading blog post:', error);
    return null;
  }
}

export function createBlogPost(slug: string, title: string, content: string, excerpt?: string, coverImage?: string): boolean {
  try {
    if (!fs.existsSync(contentDirectory)) {
      fs.mkdirSync(contentDirectory, { recursive: true });
    }

    const frontMatter = {
      title,
      date: new Date().toISOString(),
      published: true,
      ...(excerpt && { excerpt }),
      ...(coverImage && { coverImage }),
    };

    const fileContent = matter.stringify(content, frontMatter);
    const fullPath = path.join(contentDirectory, `${slug}.md`);
    
    fs.writeFileSync(fullPath, fileContent, 'utf8');
    return true;
  } catch (error) {
    console.error('Error creating blog post:', error);
    return false;
  }
}

export function updateBlogPost(slug: string, title: string, content: string, excerpt?: string, coverImage?: string, published?: boolean): boolean {
  try {
    const fullPath = path.join(contentDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return false;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    const frontMatter = {
      title,
      date: data.date || new Date().toISOString(),
      published: published !== undefined ? published : data.published !== false,
      ...(excerpt && { excerpt }),
      ...(coverImage && { coverImage }),
    };

    const fileContent = matter.stringify(content, frontMatter);
    fs.writeFileSync(fullPath, fileContent, 'utf8');
    return true;
  } catch (error) {
    console.error('Error updating blog post:', error);
    return false;
  }
}

export function deleteBlogPost(slug: string): boolean {
  try {
    const fullPath = path.join(contentDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return false;
    }

    fs.unlinkSync(fullPath);
    return true;
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return false;
  }
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}



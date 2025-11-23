import { NextRequest, NextResponse } from 'next/server';
import { getSession, isAuthenticated } from '@/utils/auth';
import { getAllBlogPosts, createBlogPost, slugify } from '@/utils/blog';

export async function GET() {
  const posts = getAllBlogPosts();
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  
  if (!isAuthenticated(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, content, excerpt, coverImage, slug } = await request.json();
    
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const postSlug = slug || slugify(title);
    const success = createBlogPost(postSlug, title, content, excerpt, coverImage);

    if (!success) {
      return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
    }

    return NextResponse.json({ success: true, slug: postSlug });
  } catch {
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}


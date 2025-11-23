import { NextRequest, NextResponse } from 'next/server';
import { getSession, isAuthenticated } from '@/utils/auth';
import { getBlogPostBySlug, updateBlogPost, deleteBlogPost } from '@/utils/blog';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const post = getBlogPostBySlug(params.slug);
  
  if (!post || !post.published) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await getSession();
  
  if (!isAuthenticated(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, content, excerpt, coverImage, published } = await request.json();
    
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const success = updateBlogPost(params.slug, title, content, excerpt, coverImage, published);

    if (!success) {
      return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await getSession();
  
  if (!isAuthenticated(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const success = deleteBlogPost(params.slug);

    if (!success) {
      return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}


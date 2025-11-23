# Blog Setup Instructions

## Environment Setup

1. Create a `.env.local` file in the root directory:
```bash
BLOG_ADMIN_PASSWORD=your-secure-password-here
```

Replace `your-secure-password-here` with a strong password you'll use to log into the admin panel.

## Directory Structure

The blog system uses the following structure:
- `/content/blog/` - Markdown files for blog posts
- `/public/blog-images/` - Images uploaded for blog posts

## Using the Blog

### Public Access
- Visit `/blog` to see all published blog posts
- Click on any post to read it

### Admin Access
1. Navigate to `/admin/login`
2. Enter your password (from `.env.local`)
3. You'll be redirected to `/admin/blog` dashboard

### Creating a New Post
1. Click "New Post" button
2. Fill in:
   - **Title**: The post title
   - **Slug**: URL-friendly version (auto-generated from title)
   - **Excerpt**: Brief description (shown in listing)
   - **Cover Image**: URL or upload an image
   - **Content**: Markdown content
   - **Published**: Checkbox to publish/unpublish
3. Click "Save"

### Editing a Post
1. Click the edit icon on any post card
2. Make your changes
3. Click "Save"

### Deleting a Post
1. Click the delete icon on any post card
2. Confirm deletion

### Uploading Images
1. In the editor, click "Upload" next to Cover Image
2. Select an image file (max 5MB, formats: jpg, png, gif, webp)
3. The image URL will be automatically filled in
4. You can also manually enter an image URL

## Markdown Support

The blog supports standard Markdown syntax:
- Headers (# ## ###)
- **Bold** and *italic* text
- Lists (ordered and unordered)
- Links and images
- Code blocks
- Blockquotes

## Notes

- Only published posts appear on the public blog page
- Unpublished posts are saved as drafts
- Session expires after 24 hours
- Images are stored locally in `/public/blog-images/`
- Blog posts are stored as Markdown files with frontmatter



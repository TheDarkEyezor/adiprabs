# Blog Content Repository

This repository stores all blog content for [adiprabs.com](https://adiprabs.com).

## Structure

```
blog-content/
├── posts/              # Your MDX blog posts
│   ├── my-first-post.mdx
│   └── another-post.mdx
└── README.md
```

## Creating a New Post

1. Create a new `.mdx` file in the `posts/` folder
2. The filename becomes the URL slug (e.g., `my-post.mdx` → `/blog/my-post`)
3. Add frontmatter at the top of the file
4. Write your content in Markdown/MDX

## Post Template

```mdx
---
title: "Your Post Title"
date: "2025-12-08"
description: "A brief description for previews and SEO"
coverImage: "https://your-cdn.com/cover-image.jpg"
tags: ["tag1", "tag2"]
author: "AdiPrabs"
---

Your content here...
```

## Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | The post title |
| `date` | Yes | Publication date (YYYY-MM-DD) |
| `description` | Yes | Brief description for cards/SEO |
| `coverImage` | No | URL to cover image |
| `tags` | No | Array of tags for filtering |
| `author` | No | Author name (defaults to "AdiPrabs") |

## Available Components

You can use these custom components in your MDX:

### YouTube Embed
```mdx
<YouTube id="dQw4w9WgXcQ" title="Video title" />
```

### Callouts
```mdx
<Callout type="info">This is an info callout</Callout>
<Callout type="warning">This is a warning</Callout>
<Callout type="error">This is an error</Callout>
<Callout type="success">This is a success message</Callout>
```

### Images with Captions
```mdx
<BlogImage 
  src="https://your-cdn.com/image.jpg" 
  alt="Description" 
  caption="Optional caption text" 
/>
```

### Tweet Embed
```mdx
<Tweet id="1234567890" />
```

### Divider
```mdx
<Divider />
```

## Markdown Features

- **Bold** with `**text**`
- *Italic* with `*text*`
- `inline code` with backticks
- [Links](url) with `[text](url)`
- Code blocks with syntax highlighting
- Lists, blockquotes, headings, etc.

## Image Hosting

For images, you can use:
- **GitHub raw URLs** (for images in this repo)
- **Cloudinary** (recommended for optimization)
- **Imgur** (simple, free)
- Any CDN that provides direct image URLs

Example with GitHub raw URL:
```
https://raw.githubusercontent.com/TheDarkEyezor/blog-content/main/images/my-image.jpg
```

## Editing Posts

Simply edit the `.mdx` file and push to main. Your site will rebuild automatically (revalidates every 60 seconds).

## Local Preview

To preview locally, run your main website repo's dev server:
```bash
npm run dev
```

Then visit `http://localhost:3000/blog`

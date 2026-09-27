/** @type {import('next').NextConfig} */
const nextConfig = {
  // Local blog posts are read with fs at request time, so they have to be
  // traced into the serverless bundles explicitly.
  outputFileTracingIncludes: {
    '/blog': ['./content/posts/**/*'],
    '/blog/[slug]': ['./content/posts/**/*'],
  },
};

export default nextConfig;

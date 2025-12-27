'use client';

import React from 'react';

// YouTube embed component
function YouTube({ id, title }: { id: string; title?: string }) {
  return (
    <div className="my-8 relative aspect-video rounded-xl overflow-hidden border border-white/20">
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        title={title || 'YouTube video'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}

// Callout/Note component
function Callout({ 
  type = 'info', 
  children 
}: { 
  type?: 'info' | 'warning' | 'error' | 'success'; 
  children: React.ReactNode;
}) {
  const styles = {
    info: 'bg-blue-500/20 border-blue-500/50 text-blue-200',
    warning: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-200',
    error: 'bg-red-500/20 border-red-500/50 text-red-200',
    success: 'bg-green-500/20 border-green-500/50 text-green-200',
  };

  const icons = {
    info: '💡',
    warning: '⚠️',
    error: '❌',
    success: '✅',
  };

  return (
    <div className={`my-6 p-4 rounded-xl border ${styles[type]}`}>
      <span className="mr-2">{icons[type]}</span>
      {children}
    </div>
  );
}

// Custom link component
function CustomLink({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isExternal = href?.startsWith('http');
  
  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="text-[#4A90E2] hover:text-[#5AA3F0] underline underline-offset-2 transition-colors"
      {...props}
    >
      {children}
      {isExternal && <span className="ml-1 text-xs">↗</span>}
    </a>
  );
}

// Custom image component
function BlogImage({ 
  src, 
  alt, 
  caption 
}: { 
  src: string; 
  alt: string; 
  caption?: string;
}) {
  return (
    <figure className="my-8">
      <div className="rounded-xl overflow-hidden border border-white/20">
        <img
          src={src}
          alt={alt}
          className="w-full h-auto"
          loading="lazy"
        />
      </div>
      {caption && (
        <figcaption className="text-center text-sm text-white/60 mt-3 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// Code block wrapper
function CodeBlock({ children, className }: { children: React.ReactNode; className?: string }) {
  const [copied, setCopied] = React.useState(false);
  const codeRef = React.useRef<HTMLPreElement>(null);

  const handleCopy = () => {
    if (codeRef.current) {
      const code = codeRef.current.textContent || '';
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative group my-6">
      <pre
        ref={codeRef}
        className={`${className} rounded-xl p-4 overflow-x-auto bg-[#1a1a2e] border border-white/10`}
      >
        {children}
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 px-2 py-1 text-xs rounded bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all opacity-0 group-hover:opacity-100"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
}

// Tweet embed component
function Tweet({ id }: { id: string }) {
  return (
    <div className="my-8 flex justify-center">
      <blockquote className="twitter-tweet" data-theme="dark">
        <a href={`https://twitter.com/x/status/${id}`}>Loading tweet...</a>
      </blockquote>
      <script async src="https://platform.twitter.com/widgets.js" />
    </div>
  );
}

// Divider component
function Divider() {
  return (
    <div className="my-12 flex items-center justify-center gap-2">
      <div className="h-px w-16 bg-gradient-to-r from-transparent to-white/30" />
      <div className="w-2 h-2 rounded-full bg-white/30" />
      <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/30" />
    </div>
  );
}

// Export MDX components object
export const mdxComponents = {
  YouTube,
  Callout,
  BlogImage,
  Tweet,
  Divider,
  a: CustomLink,
  h1: ({ children, ...props }: any) => (
    <h1 className="text-4xl font-bold mt-12 mb-6 bg-gradient-to-r from-[#FF6B6B] to-[#FEC601] bg-clip-text text-transparent" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: any) => (
    <h2 className="text-3xl font-bold mt-10 mb-4 text-white" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3 className="text-2xl font-semibold mt-8 mb-3 text-white/90" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: any) => (
    <h4 className="text-xl font-semibold mt-6 mb-2 text-white/80" {...props}>
      {children}
    </h4>
  ),
  h5: ({ children, ...props }: any) => (
    <h5 className="text-lg font-semibold mt-4 mb-2 text-white/70" {...props}>
      {children}
    </h5>
  ),
  h6: ({ children, ...props }: any) => (
    <h6 className="font-semibold mt-3 mb-2 text-white/60" {...props}>
      {children}
    </h6>
  ),
  p: ({ children, ...props }: any) => (
    <p className="text-white/80 leading-relaxed mb-4" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: any) => (
    <ul className="list-disc list-inside text-white/80 mb-4 space-y-2 ml-4" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="list-decimal list-inside text-white/80 mb-4 space-y-2 ml-4" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li className="text-white/80" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: any) => (
    <blockquote className="border-l-4 border-[#4A90E2] pl-4 my-6 italic text-white/70" {...props}>
      {children}
    </blockquote>
  ),
  code: ({ children, className, ...props }: any) => {
    if (!className) {
      return (
        <code className="px-1.5 py-0.5 rounded bg-white/10 text-[#FF6B6B] text-sm font-mono" {...props}>
          {children}
        </code>
      );
    }
    return <code className={className} {...props}>{children}</code>;
  },
  pre: ({ children, ...props }: any) => (
    <CodeBlock {...props}>{children}</CodeBlock>
  ),
  img: ({ src, alt, ...props }: any) => (
    <BlogImage src={src || ''} alt={alt || ''} />
  ),
  hr: () => <Divider />,
  table: ({ children, ...props }: any) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: any) => (
    <thead className="bg-white/5 border-b border-white/10" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }: any) => (
    <tbody className="divide-y divide-white/5" {...props}>
      {children}
    </tbody>
  ),
  tr: ({ children, ...props }: any) => (
    <tr className="border-b border-white/5" {...props}>
      {children}
    </tr>
  ),
  th: ({ children, ...props }: any) => (
    <th className="text-left px-4 py-2 font-semibold text-white" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: any) => (
    <td className="px-4 py-2 text-white/70" {...props}>
      {children}
    </td>
  ),
  strong: ({ children, ...props }: any) => (
    <strong className="font-semibold text-white" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: any) => (
    <em className="italic text-white/90" {...props}>
      {children}
    </em>
  ),
};

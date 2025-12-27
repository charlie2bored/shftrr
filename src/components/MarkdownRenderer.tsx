"use client";

import { Suspense, lazy } from 'react';
import { SkeletonText } from './Skeleton';

// Lazy load ReactMarkdown and plugins for better bundle splitting
const ReactMarkdown = lazy(() => import('react-markdown'));
const remarkGfm = lazy(() => import('remark-gfm'));

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <Suspense fallback={<SkeletonText lines={3} />}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        className={className}
        components={{
          h1: ({ children }) => <p className="text-[14px] font-normal text-white leading-relaxed mb-5">{children}</p>,
          h2: ({ children }) => <p className="text-[14px] font-normal text-white leading-relaxed mb-5">{children}</p>,
          h3: ({ children }) => <p className="text-[14px] font-normal text-white leading-relaxed mb-5">{children}</p>,
          p: ({ children }) => <p className="text-[14px] font-normal text-white leading-relaxed mb-5">{children}</p>,
          ul: ({ children }) => <ul className="text-white mb-4 space-y-2 ml-6 list-disc">{children}</ul>,
          ol: ({ children }) => <ol className="text-white mb-4 space-y-2 ml-6 list-decimal">{children}</ol>,
          li: ({ children }) => <li className="text-[14px] font-normal leading-relaxed mb-2">{children}</li>,
          strong: ({ children }) => <span className="text-white font-normal">{children}</span>,
          em: ({ children }) => <em className="text-white italic">{children}</em>,
          blockquote: ({ children }) => (
            <div className="border-l-4 border-blue-500 pl-6 my-6 text-white italic bg-slate-800/30 py-4 px-6 rounded-r-lg">
              {children}
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </Suspense>
  );
}

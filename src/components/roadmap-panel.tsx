"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MapPin, Target, DollarSign, BookOpen, Clock, TrendingUp } from 'lucide-react';

interface RoadmapPanelProps {
  response: string;
  isLoading: boolean;
  isStreaming?: boolean;
}

export function RoadmapPanel({ response, isLoading, isStreaming = false }: RoadmapPanelProps) {
  if (!response && !isLoading) {
    return (
      <div className="w-96 bg-slate-900 border-l border-slate-700 p-6">
        <div className="text-center text-white py-12">
          <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-white mb-2">
            Your Career Roadmap
          </h3>
          <p className="text-sm text-white">
            Share your resume and frustrations to get your personalized escape plan
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-96 bg-slate-900 border-l border-slate-700 flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-400" />
          Career Roadmap
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Your personalized pivot strategy
        </p>
        {isStreaming && (
          <Badge variant="secondary" className="mt-2 bg-gray-800/50 text-gray-400 border-gray-700">
            <div className="w-2 h-2 bg-gray-400 rounded-full mr-2 animate-pulse"></div>
            Generating...
          </Badge>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6">
          {isLoading && !response && (
            <div className="space-y-4">
              <div className="h-4 bg-slate-700 rounded animate-pulse"></div>
              <div className="h-4 bg-slate-700 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-slate-700 rounded animate-pulse w-1/2"></div>
              <div className="h-8 bg-slate-700 rounded animate-pulse mt-6"></div>
              <div className="h-4 bg-slate-700 rounded animate-pulse"></div>
              <div className="h-4 bg-slate-700 rounded animate-pulse w-5/6"></div>
            </div>
          )}

          {response && (
            <div className="max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-lg font-bold text-white mb-4 mt-6 first:mt-0">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-base font-semibold text-white mb-3 mt-6">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-sm font-medium text-white mb-2 mt-4">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-[14px] font-normal text-white leading-relaxed mb-5">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="text-white mb-4 space-y-2 ml-6">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="text-white mb-4 space-y-2 ml-6 list-decimal">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-[14px] font-normal leading-relaxed mb-2">
                      {children}
                    </li>
                  ),
                  strong: ({ children }) => (
                    <strong className="text-white font-semibold">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="text-white italic">
                      {children}
                    </em>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-500 pl-6 my-6 text-white italic bg-slate-800/50 py-4 px-6 rounded-r-lg">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {response}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

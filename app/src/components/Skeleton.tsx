import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-700/50",
        className
      )}
    />
  );
};

interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({ lines = 3, className }) => {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 && lines > 1 ? "w-3/4" : "w-full" // Last line shorter
          )}
        />
      ))}
    </div>
  );
};

interface SkeletonCardProps {
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ className }) => {
  return (
    <div className={cn("p-4 rounded-lg bg-gray-900 border border-gray-700", className)}>
      <div className="flex items-start gap-3">
        <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <SkeletonText lines={2} />
        </div>
      </div>
    </div>
  );
};

interface SkeletonMessageProps {
  isUser?: boolean;
  className?: string;
}

export const SkeletonMessage: React.FC<SkeletonMessageProps> = ({ isUser = false, className }) => {
  return (
    <div className={cn(
      "flex",
      isUser ? "justify-end" : "justify-start",
      className
    )}>
      <div className={cn(
        "p-4 rounded-lg max-w-sm",
        isUser ? "bg-gray-800" : "bg-gray-900"
      )}>
        <SkeletonText lines={2} />
      </div>
    </div>
  );
};

// Typing indicator component
export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-gray-900 p-4 rounded-lg max-w-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">AI is thinking</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};


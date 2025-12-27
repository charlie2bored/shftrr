"use client";

import { Skeleton } from './Skeleton';

interface LoadingLayoutProps {
  children?: React.ReactNode;
  showSidebar?: boolean;
  className?: string;
}

export function LoadingLayout({ children, showSidebar = true, className }: LoadingLayoutProps) {
  if (children) {
    return <>{children}</>;
  }

  return (
    <div className={`min-h-screen bg-black flex flex-col ${className || ''}`}>
      {showSidebar && (
        <div className="flex flex-1">
          {/* Loading Sidebar */}
          <aside className="w-[250px] bg-black text-white flex flex-col border-r border-gray-600">
            <div className="p-6 border-b border-gray-600">
              <Skeleton className="h-8 w-24" />
            </div>
            <nav className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2">
                    <Skeleton className="w-4 h-4 rounded" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            </nav>
            <div className="border-t border-gray-600 p-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-900 border border-gray-700 mb-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-8 w-full" />
            </div>
          </aside>

          {/* Loading Main Content */}
          <main className="flex-1 bg-black flex flex-col">
            <div className="flex-1 flex flex-col px-12 py-8 max-w-4xl mx-auto w-full">
              <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                <div className="text-center space-y-4">
                  <Skeleton className="h-16 w-64 mx-auto" />
                  <Skeleton className="h-6 w-48 mx-auto" />
                </div>
                <Skeleton className="h-12 w-32" />
              </div>

              {/* Loading Messages Area */}
              <div className="mt-auto py-8">
                <div className="max-w-2xl mx-auto w-full space-y-4">
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
              </div>
            </div>
          </main>
        </div>
      )}

      {!showSidebar && (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md space-y-4">
            <Skeleton className="h-12 w-48 mx-auto" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <div className="space-y-3 pt-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

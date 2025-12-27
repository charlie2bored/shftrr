"use client";

import { Suspense } from 'react';
import { LoadingLayout } from './LoadingLayout';

interface SuspenseWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showSidebar?: boolean;
  className?: string;
}

export function SuspenseWrapper({
  children,
  fallback,
  showSidebar = true,
  className
}: SuspenseWrapperProps) {
  const defaultFallback = (
    <LoadingLayout showSidebar={showSidebar} className={className} />
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
}

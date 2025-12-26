"use client";

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<{ error?: Error; resetError: () => void }> = ({
  error,
  resetError
}) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-gray-900 rounded-lg border border-red-700 p-6 text-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="w-12 h-12 text-red-400" />
        </div>

        <h2 className="text-xl font-semibold text-white mb-2">
          Something went wrong
        </h2>

        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          We encountered an unexpected error. This has been reported and we're working to fix it.
        </p>

        {error && (
          <details className="mb-4 text-left">
            <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-400">
              Technical details
            </summary>
            <pre className="mt-2 p-2 bg-gray-800 rounded text-xs text-red-300 overflow-auto max-h-32">
              {error.message}
            </pre>
          </details>
        )}

        <button
          onClick={resetError}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      </div>
    </div>
  );
};

export default ErrorBoundary;


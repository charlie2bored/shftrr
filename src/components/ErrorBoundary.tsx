"use client";

import React from 'react';
import { AlertTriangle, RefreshCw, Bug, Wifi, Shield } from 'lucide-react';
import { ErrorReporter, ErrorHandler } from '@/lib/error-reporting';

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
    // Report error to error tracking service
    ErrorReporter.report(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
      severity: ErrorHandler.getSeverity(error),
    });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
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
  const userMessage = error ? ErrorHandler.getUserFriendlyMessage(error) : 'An unexpected error occurred';
  const severity = error ? ErrorHandler.getSeverity(error) : 'low';

  // Choose icon based on error type
  const getErrorIcon = () => {
    if (error?.message.includes('network') || error?.message.includes('connect')) {
      return <Wifi className="w-12 h-12 text-orange-400" />;
    }
    if (error?.message.includes('unauthorized') || error?.message.includes('forbidden')) {
      return <Shield className="w-12 h-12 text-yellow-400" />;
    }
    return <Bug className="w-12 h-12 text-red-400" />;
  };

  const getBorderColor = () => {
    switch (severity) {
      case 'critical': return 'border-red-600';
      case 'high': return 'border-red-500';
      case 'medium': return 'border-orange-500';
      default: return 'border-red-700';
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className={`max-w-md w-full bg-gray-900 rounded-lg border ${getBorderColor()} p-6 text-center`}>
        <div className="flex justify-center mb-4">
          {getErrorIcon()}
        </div>

        <h2 className="text-xl font-semibold text-white mb-2">
          {severity === 'critical' ? 'Service Unavailable' :
           severity === 'high' ? 'Something went wrong' :
           'Oops! An error occurred'}
        </h2>

        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          {userMessage}
        </p>

        {severity === 'critical' && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 mb-4">
            <p className="text-red-300 text-xs">
              This appears to be a critical issue. Our team has been notified and is working to resolve it.
            </p>
          </div>
        )}

        {error && process.env.NODE_ENV === 'development' && (
          <details className="mb-4 text-left">
            <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-400">
              Technical details (dev only)
            </summary>
            <pre className="mt-2 p-2 bg-gray-800 rounded text-xs text-red-300 overflow-auto max-h-32">
              {error.message}
              {error.stack && (
                <>
                  {'\n\n'}
                  {error.stack}
                </>
              )}
            </pre>
          </details>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={resetError}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>

          {severity !== 'critical' && (
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
            >
              Reload page
            </button>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-4">
          If this problem persists, please contact support.
        </p>
      </div>
    </div>
  );
};

export default ErrorBoundary;


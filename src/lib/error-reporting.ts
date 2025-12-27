/**
 * Error reporting and handling utilities
 * Centralizes error logging, reporting, and user-friendly error messages
 */

import { ZodError } from 'zod';

export interface AppError {
  code: string;
  message: string;
  statusCode: number;
  details?: any;
  timestamp: Date;
}

export class ErrorReporter {
  /**
   * Report an error to logging service (in production)
   */
  static report(error: Error | AppError, context?: Record<string, any>) {
    const errorData = {
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
      context,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    };

    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.error('Error reported:', errorData);
    }

    // In production, send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrate with error reporting service like Sentry, LogRocket, etc.
      // Example: Sentry.captureException(error, { contexts: { custom: context } });
    }
  }

  /**
   * Create a standardized app error
   */
  static createAppError(
    code: string,
    message: string,
    statusCode: number = 500,
    details?: any
  ): AppError {
    return {
      code,
      message,
      statusCode,
      details,
      timestamp: new Date(),
    };
  }
}

/**
 * Convert various error types to user-friendly messages
 */
export class ErrorHandler {
  static getUserFriendlyMessage(error: unknown): string {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      const firstError = error.errors[0];
      return firstError?.message || 'Invalid input data';
    }

    // Handle standard Error objects
    if (error instanceof Error) {
      // Database connection errors
      if (error.message.includes('connect') || error.message.includes('ECONNREFUSED')) {
        return 'Unable to connect to the service. Please check your connection and try again.';
      }

      // Authentication errors
      if (error.message.includes('Unauthorized') || error.message.includes('unauthorized')) {
        return 'You are not authorized to perform this action. Please sign in again.';
      }

      // Network errors
      if (error.message.includes('fetch') || error.message.includes('network')) {
        return 'Network error. Please check your internet connection and try again.';
      }

      // Rate limiting
      if (error.message.includes('rate limit') || error.message.includes('429')) {
        return 'Too many requests. Please wait a moment before trying again.';
      }

      // Generic error
      return 'An unexpected error occurred. Please try again.';
    }

    // Handle string errors
    if (typeof error === 'string') {
      return error;
    }

    // Handle API response errors
    if (typeof error === 'object' && error !== null && 'message' in error) {
      return (error as any).message;
    }

    return 'An unexpected error occurred. Please try again.';
  }

  /**
   * Get error severity level
   */
  static getSeverity(error: unknown): 'low' | 'medium' | 'high' | 'critical' {
    if (error instanceof Error) {
      // Critical errors that affect core functionality
      if (error.message.includes('database') && error.message.includes('connect')) {
        return 'critical';
      }

      // High severity errors
      if (error.message.includes('authentication') || error.message.includes('authorization')) {
        return 'high';
      }

      // Medium severity errors
      if (error.message.includes('validation') || error.message.includes('network')) {
        return 'medium';
      }
    }

    return 'low';
  }

  /**
   * Determine if error should trigger error boundary
   */
  static shouldTriggerBoundary(error: unknown): boolean {
    const severity = this.getSeverity(error);
    return severity === 'high' || severity === 'critical';
  }
}

/**
 * React Error Boundary hook for functional components
 */
export function useErrorHandler() {
  return {
    handleError: (error: unknown, context?: Record<string, any>) => {
      ErrorReporter.report(error as Error, context);
      return ErrorHandler.getUserFriendlyMessage(error);
    },
    getUserMessage: ErrorHandler.getUserFriendlyMessage,
    shouldTriggerBoundary: ErrorHandler.shouldTriggerBoundary,
  };
}

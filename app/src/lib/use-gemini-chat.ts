"use client";

import { useState, useCallback } from 'react';

export interface GeminiChatRequest {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  resumeText?: string;
  ventText?: string;
  temperature?: number;
}

export interface GeminiChatResponse {
  response: string;
  toolCalls?: any[];
  toolResults?: any[];
}

export function useGeminiChat(apiUrl: string = '/api/gemini-career-coach', onQuotaExceeded?: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (
    request: GeminiChatRequest,
    onChunk?: (chunk: string) => void,
    onComplete?: (fullResponse: GeminiChatResponse) => void
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;

        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
          if (errorData.details) {
            errorMessage += ` - ${errorData.details}`;
          }
        } catch (parseError) {
          // If we can't parse the error response, use the status text
          errorMessage = `${response.status}: ${response.statusText}`;
        }

        throw new Error(errorMessage);
      }

      const result: GeminiChatResponse = await response.json();

      // Call onChunk for compatibility (though Gemini returns complete response)
      if (onChunk && result.response) {
        onChunk(result.response);
      }

      if (onComplete) {
        onComplete(result);
      }

    } catch (err) {
      let errorMessage = err instanceof Error ? err.message : 'Unknown error';
      let errorDescription = '';

      // Handle specific error types
      if (errorMessage.includes('QUOTA_EXCEEDED')) {
        // Trigger upgrade prompt
        onQuotaExceeded?.();
        return; // Don't set error, let the upgrade prompt handle it
      } else if (errorMessage.includes('500')) {
        errorMessage = 'Server Error';
        errorDescription = 'The AI service is temporarily unavailable. Please try again in a moment.';
      } else if (errorMessage.includes('429') || errorMessage.includes('quota')) {
        errorMessage = 'Rate Limit Exceeded';
        errorDescription = 'Too many requests. Please wait a moment before trying again.';
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        errorMessage = 'Connection Error';
        errorDescription = 'Please check your internet connection and try again.';
      }

      // Combine message and description for display
      const fullErrorMessage = errorDescription ? `${errorMessage}: ${errorDescription}` : errorMessage;

      setError(fullErrorMessage);
      console.error('Gemini chat error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl]);

  return {
    sendMessage,
    isLoading,
    error,
  };
}

"use client";

import { useState, useCallback } from 'react';
import { ChatRequest, ChatResponse } from './types';

export function useChat(apiUrl: string = '/api/chat') {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (
    request: ChatRequest,
    onChunk: (chunk: string) => void,
    onComplete: (fullResponse: string) => void
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // For now, handle as simple text response
      const responseText = await response.text();
      let fullResponse = '';

      // Parse the streaming response format
      const lines = responseText.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data: ChatResponse = JSON.parse(line.slice(6));
            if (data.text) {
              fullResponse += data.text;
              onChunk(data.text);
            }
            if (data.done) {
              onComplete(fullResponse);
              return;
            }
          } catch (e) {
            // Skip malformed JSON
            continue;
          }
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Chat error:', err);
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

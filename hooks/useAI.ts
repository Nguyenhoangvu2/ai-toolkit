'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface UseAIOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function useAI(endpoint: string, options?: UseAIOptions) {
  const [result, setResult] = useState<any>(null);

  const mutation = useMutation({
    mutationFn: async (input: any) => {
      const response = await fetch(`/api/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `API call failed with status ${response.status}`);
      }

      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setResult(data);
        toast.success('Processing completed successfully!');
        options?.onSuccess?.(data);
      } else {
        toast.error(data.error || 'Processing failed');
        options?.onError?.(data.error || 'Processing failed');
      }
    },
    onError: (error: Error) => {
      const errorMessage = error.message || 'An unexpected error occurred';
      toast.error(errorMessage);
      setResult(null);
      options?.onError?.(errorMessage);
    },
  });

  return {
    process: mutation.mutate,
    isLoading: mutation.isPending,
    result,
    error: mutation.error?.message || null,
    reset: () => {
      setResult(null);
      mutation.reset();
    },
  };
}
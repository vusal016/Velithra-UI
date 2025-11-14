/**
 * Velithra - TanStack Query Configuration
 * React Query setup with optimized cache & refetch strategies
 */

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';

// Query Client Configuration
const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // Cache for 5 minutes
        staleTime: 1000 * 60 * 5,
        // Keep unused data in cache for 10 minutes
        gcTime: 1000 * 60 * 10,
        // Retry failed requests 3 times
        retry: 3,
        // Retry delay (exponential backoff)
        retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Refetch on window focus (only if stale)
        refetchOnWindowFocus: true,
        // Refetch on reconnect (only if stale)
        refetchOnReconnect: true,
        // Don't refetch on mount if data is fresh
        refetchOnMount: true,
      },
      mutations: {
        // Retry mutations once on failure
        retry: 1,
        // Retry delay
        retryDelay: 1000,
      },
    },
  });

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Create client once per app lifecycle
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      )}
    </QueryClientProvider>
  );
}

// Export for direct use if needed
export const queryClient = createQueryClient();

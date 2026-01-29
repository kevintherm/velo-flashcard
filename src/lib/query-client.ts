import { QueryClient, MutationCache } from '@tanstack/react-query';
import { toast } from 'sonner';

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error: any) => {
      if (!error._handled) {
        toast.error(error.message || 'An unexpected error occurred');
      }
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

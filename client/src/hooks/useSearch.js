/**
 * TanStack Query Hook for Global Search
 */
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export function useGlobalSearch(query, options = {}) {
  return useQuery({
    queryKey: ['search', query, options.category, options.folderId, options.tag],
    queryFn: async () => {
      if (!query || query.trim() === '') {
        return { files: [], folders: [], totalFiles: 0 };
      }
      const res = await api.get('/search', {
        params: {
          q: query,
          ...options
        }
      });
      return res.data;
    },
    enabled: Boolean(query && query.trim().length > 0),
    staleTime: 30000
  });
}

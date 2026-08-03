/**
 * TanStack Query Hooks for Folders & Breadcrumbs (MZ-CLOUD)
 * Zero unicode emojis in toast notifications (react-icons/fi only)
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { useUploadStore } from '../store/useUploadStore';

export function useFoldersList({ tree = false, includeHidden = false } = {}) {
  return useQuery({
    queryKey: ['folders', tree, includeHidden],
    queryFn: async () => {
      const res = await api.get('/folders', { params: { tree, includeHidden } });
      return res.data.folders;
    }
  });
}

export function useFolderBreadcrumbs(folderId) {
  return useQuery({
    queryKey: ['breadcrumbs', folderId],
    queryFn: async () => {
      if (!folderId || folderId === 'ROOT' || folderId === 'ALL') {
        return [];
      }
      const res = await api.get(`/folders/${folderId}/breadcrumbs`);
      return res.data.breadcrumbs;
    },
    enabled: Boolean(folderId && folderId !== 'ROOT' && folderId !== 'ALL')
  });
}

export function useCreateFolder() {
  const queryClient = useQueryClient();
  const uploadStore = useUploadStore();

  return useMutation({
    mutationFn: async (data) => {
      const res = await api.post('/folders', data);
      return res.data.folder;
    },
    onSuccess: () => {
      uploadStore.addNotification('New Folder Created!', 'success');
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    }
  });
}

export function useUpdateFolder() {
  const queryClient = useQueryClient();
  const uploadStore = useUploadStore();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await api.patch(`/folders/${id}`, data);
      return res.data.folder;
    },
    onSuccess: () => {
      uploadStore.addNotification('Folder Updated', 'success');
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    }
  });
}

export function useDeleteFolder() {
  const queryClient = useQueryClient();
  const uploadStore = useUploadStore();

  return useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/folders/${id}`);
      return res.data;
    },
    onSuccess: () => {
      uploadStore.addNotification('Folder Deleted', 'success');
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['files'] });
    }
  });
}

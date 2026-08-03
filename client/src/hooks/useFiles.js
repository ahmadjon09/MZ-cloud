/**
 * TanStack Query Hooks for Files & Saved Messages items
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { useUploadStore } from '../store/useUploadStore';

export function useFilesList(options = {}) {
  return useQuery({
    queryKey: [
      'files',
      options.category || 'ALL',
      options.folderId || 'ALL',
      options.isFavorite || false,
      options.isPinned || false,
      options.isDeleted || false,
      options.search || '',
      options.tag || '',
      options.sortBy || 'createdAt',
      options.sortOrder || 'desc',
      options.limit || 50,
      options.offset || 0
    ],
    queryFn: async () => {
      const res = await api.get('/files', { params: options });
      return res.data;
    },
    keepPreviousData: true
  });
}

export function useGenerateDemoFiles() {
  const queryClient = useQueryClient();
  const uploadStore = useUploadStore();

  return useMutation({
    mutationFn: async () => {
      const res = await api.post('/files/demo-generator');
      return res.data;
    },
    onSuccess: (data) => {
      uploadStore.addNotification(`🎉 ${data.count} Demo Files Generated & Indexed!`, 'success');
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['authMe'] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    }
  });
}

export function useParallelUpload() {
  const queryClient = useQueryClient();
  const uploadStore = useUploadStore();

  return useMutation({
    mutationFn: async (filesArray) => {
      const res = await api.post('/files/parallel-upload', { files: filesArray });
      return res.data;
    },
    onMutate: (filesArray) => {
      uploadStore.addJob({
        id: `job_${Date.now()}`,
        count: filesArray.length,
        status: 'uploading'
      });
    },
    onSuccess: (data) => {
      uploadStore.addNotification(
        `✅ Upload processed (${data.count || 'batch'} files)`,
        'success'
      );
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['authMe'] });
    }
  });
}

export function useUpdateFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await api.patch(`/files/${id}`, data);
      return res.data.file;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    }
  });
}

export function useMoveFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, folderId }) => {
      const res = await api.post(`/files/${id}/move`, { folderId });
      return res.data.file;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    }
  });
}

export function useShareFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await api.post(`/files/${id}/share`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    }
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();
  const uploadStore = useUploadStore();

  return useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/files/${id}`);
      return res.data;
    },
    onSuccess: () => {
      uploadStore.addNotification('🗑️ Moved to Recycle Bin', 'success');
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['authMe'] });
    }
  });
}

export function useRestoreFile() {
  const queryClient = useQueryClient();
  const uploadStore = useUploadStore();

  return useMutation({
    mutationFn: async (id) => {
      const res = await api.post(`/files/${id}/restore`);
      return res.data;
    },
    onSuccess: () => {
      uploadStore.addNotification('↩️ File Restored!', 'success');
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['authMe'] });
    }
  });
}

export function usePermanentDeleteFile() {
  const queryClient = useQueryClient();
  const uploadStore = useUploadStore();

  return useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/files/${id}/permanent`);
      return res.data;
    },
    onSuccess: () => {
      uploadStore.addNotification('🔥 File permanently deleted', 'success');
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['authMe'] });
    }
  });
}

export function useEmptyRecycleBin() {
  const queryClient = useQueryClient();
  const uploadStore = useUploadStore();

  return useMutation({
    mutationFn: async () => {
      const res = await api.delete('/files/recycle-bin/empty');
      return res.data;
    },
    onSuccess: (data) => {
      uploadStore.addNotification(`🧹 Recycle Bin emptied (${data.count} items removed)`, 'success');
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['authMe'] });
    }
  });
}

/**
 * TanStack Query Hooks for Super Admin Control Panel (MZ-CLOUD)
 * Includes useAddAdmin and useUpdateUserRole
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { useUploadStore } from '../store/useUploadStore';

export function useAdminAnalytics() {
  return useQuery({
    queryKey: ['adminAnalytics'],
    queryFn: async () => {
      const res = await api.get('/admin/analytics');
      return res.data;
    },
    refetchInterval: 15000
  });
}

export function useAdminUsers(params = {}) {
  return useQuery({
    queryKey: ['adminUsers', params.search, params.role, params.offset],
    queryFn: async () => {
      const res = await api.get('/admin/users', { params });
      return res.data;
    }
  });
}

export function useAddAdmin() {
  const queryClient = useQueryClient();
  const uploadStore = useUploadStore();

  return useMutation({
    mutationFn: async ({ telegramIdOrUsername }) => {
      const res = await api.post('/admin/add-admin', { telegramIdOrUsername });
      return res.data;
    },
    onSuccess: (data) => {
      uploadStore.addNotification(data.message || '✅ Yangi Admin muvaffaqiyatli qo\'shildi!', 'success');
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['adminAnalytics'] });
    }
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  const uploadStore = useUploadStore();

  return useMutation({
    mutationFn: async ({ userId, role }) => {
      const res = await api.patch(`/admin/users/${userId}/role`, { role });
      return res.data;
    },
    onSuccess: (data) => {
      uploadStore.addNotification(`✅ Rol o'zgartirildi: ${data.user?.role || 'USER'}`, 'success');
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['adminAnalytics'] });
    }
  });
}

export function useSetUserBanStatus() {
  const queryClient = useQueryClient();
  const uploadStore = useUploadStore();

  return useMutation({
    mutationFn: async ({ userId, isBanned, banReason }) => {
      const res = await api.patch(`/admin/users/${userId}/ban`, { isBanned, banReason });
      return res.data;
    },
    onSuccess: (data) => {
      const msg = data.user?.isBanned ? '🚫 User Banned' : '✅ User Unbanned';
      uploadStore.addNotification(msg, 'success');
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['adminAnalytics'] });
    }
  });
}

export function useBroadcastMessage() {
  const uploadStore = useUploadStore();

  return useMutation({
    mutationFn: async ({ message, markdown = true }) => {
      const res = await api.post('/admin/broadcast', { message, markdown });
      return res.data;
    },
    onSuccess: (data) => {
      uploadStore.addNotification('📢 Broadcast message dispatched to queue!', 'success');
    }
  });
}

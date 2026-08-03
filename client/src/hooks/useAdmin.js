/**
 * TanStack Query Hooks for Super Admin Control Panel and MZ-CLOUD Premium (Telegram Stars)
 * Includes useAddAdmin, useUpdateUserRole, useCreateStarsInvoice, and useToggleDemoPremium
 * Zero unicode emojis in toast notifications (react-icons/fi only)
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
      uploadStore.addNotification(data.message || 'Yangi Admin muvaffaqiyatli qo\'shildi!', 'success');
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
      uploadStore.addNotification(`Rol o'zgartirildi: ${data.user?.role || 'USER'}`, 'success');
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
      const msg = data.user?.isBanned ? 'User Banned' : 'User Unbanned';
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
    onSuccess: () => {
      uploadStore.addNotification('Broadcast message dispatched to queue!', 'success');
    }
  });
}

/**
 * Send a Telegram Stars (XTR) Invoice directly to the user's Telegram chat
 */
export function useCreateStarsInvoice() {
  const uploadStore = useUploadStore();

  return useMutation({
    mutationFn: async () => {
      const res = await api.post('/auth/create-stars-invoice');
      return res.data;
    },
    onSuccess: (data) => {
      uploadStore.addNotification(
        data.message || '50 Telegram Stars to\'lov hisobi chatingizga yuborildi!',
        'success'
      );
    }
  });
}

/**
 * Dev toggle to instantly test MZ-CLOUD Premium on/off in the WebApp
 */
export function useToggleDemoPremium() {
  const queryClient = useQueryClient();
  const uploadStore = useUploadStore();

  return useMutation({
    mutationFn: async () => {
      const res = await api.post('/auth/toggle-demo-premium');
      return res.data;
    },
    onSuccess: (data) => {
      uploadStore.addNotification(
        data.message || 'MZ-CLOUD Premium statusi yangilandi',
        'success'
      );
      queryClient.invalidateQueries({ queryKey: ['authMe'] });
    }
  });
}

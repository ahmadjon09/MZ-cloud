/**
 * Authentication Store (Zustand)
 * Manages user session, JWT tokens, and storage metrics
 */
import { create } from 'zustand';

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: localStorage.getItem('tgcloud_token') || null,
  refreshToken: localStorage.getItem('tgcloud_refresh') || null,
  isDemoMode: localStorage.getItem('tgcloud_demo') === 'true',

  setAuth: ({ user, accessToken, refreshToken }) => {
    if (accessToken) localStorage.setItem('tgcloud_token', accessToken);
    if (refreshToken) localStorage.setItem('tgcloud_refresh', refreshToken);
    set({ user, accessToken, refreshToken });
  },

  updateUserStorage: (storageUsed, fileCount) => {
    const current = get().user;
    if (current) {
      set({
        user: {
          ...current,
          storageUsed: storageUsed !== undefined ? storageUsed : current.storageUsed,
          fileCount: fileCount !== undefined ? fileCount : current.fileCount
        }
      });
    }
  },

  setDemoMode: (val) => {
    localStorage.setItem('tgcloud_demo', String(val));
    set({ isDemoMode: val });
  },

  logout: () => {
    localStorage.removeItem('tgcloud_token');
    localStorage.removeItem('tgcloud_refresh');
    set({ user: null, accessToken: null, refreshToken: null });
  }
}));

/**
 * Upload Queue Store (Zustand)
 * Tracks parallel background file upload processing and notifications
 */
import { create } from 'zustand';

export const useUploadStore = create((set, get) => ({
  jobs: [],
  notifications: [],

  addJob: (job) => {
    set((state) => ({
      jobs: [job, ...state.jobs]
    }));
  },

  updateJobStatus: (jobId, status, details = {}) => {
    set((state) => ({
      jobs: state.jobs.map((j) =>
        j.id === jobId ? { ...j, status, ...details } : j
      )
    }));
  },

  addNotification: (message, type = 'success') => {
    const notif = {
      id: `notif_${Date.now()}_${Math.random()}`,
      message,
      type,
      timestamp: new Date()
    };
    set((state) => ({
      notifications: [notif, ...state.notifications].slice(0, 10)
    }));
  },

  clearNotifications: () => set({ notifications: [] })
}));

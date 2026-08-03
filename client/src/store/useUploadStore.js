/**
 * Upload Queue Store (Zustand) - MZ-CLOUD
 * Tracks parallel background file upload processing and notifications
 * Notifications automatically disappear after exactly 2 seconds (2000ms)
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
    const id = `notif_${Date.now()}_${Math.random()}`;
    const notif = {
      id,
      message,
      type,
      timestamp: new Date()
    };

    set((state) => ({
      notifications: [notif, ...state.notifications].slice(0, 5)
    }));

    // Auto-remove toast notification after 2 seconds (2000 ms)
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id)
      }));
    }, 2000);
  },

  clearNotifications: () => set({ notifications: [] })
}));

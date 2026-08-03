/**
 * API Client (Axios)
 * Configured with token injection and automatic error handling
 */
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 30000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tgcloud_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Inject Telegram WebApp initData if running inside Telegram webview
  if (window.Telegram?.WebApp?.initData) {
    config.headers['X-Telegram-Init-Data'] = window.Telegram.WebApp.initData;
  }

  // Inject Demo user header for standalone sandbox mode
  config.headers['X-Demo-User-Id'] = '777000';

  return config;
});

api.interceptors.response.use(
  (res) => {
    // If backend sent refreshed tokens in headers, update store
    const newAccess = res.headers['x-access-token'];
    const newRefresh = res.headers['x-refresh-token'];
    if (newAccess) {
      localStorage.setItem('tgcloud_token', newAccess);
    }
    if (newRefresh) {
      localStorage.setItem('tgcloud_refresh', newRefresh);
    }
    return res.data;
  },
  async (error) => {
    return Promise.reject(error.response?.data?.error || error);
  }
);

export default api;

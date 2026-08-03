/**
 * API Client (Axios) - Production Quality
 * Configured with Telegram WebApp headers and automatic error handling
 */
import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 30000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tgcloud_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Inject Telegram WebApp initData and user identity if running inside Telegram webview
  const tgWebApp = window.Telegram?.WebApp;
  if (tgWebApp) {
    if (tgWebApp.initData) {
      config.headers['X-Telegram-Init-Data'] = encodeURIComponent(tgWebApp.initData);
    }
    const userObj = tgWebApp.initDataUnsafe?.user;
    if (userObj && userObj.id) {
      config.headers['X-Telegram-User-Id'] = String(userObj.id);
      config.headers['X-Telegram-User-Data'] = encodeURIComponent(JSON.stringify(userObj));
    }
  }

  // Allow fallback auth for testing ONLY if dev bypass parameter is present
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('dev_bypass') === 'true') {
    config.headers['X-Telegram-User-Id'] = '777000';
    config.headers['X-Telegram-User-Data'] = encodeURIComponent(
      JSON.stringify({
        id: 777000,
        username: 'superadmin',
        first_name: 'Alisher',
        last_name: 'Navoiy',
        language_code: 'uz',
        is_premium: true
      })
    );
  }

  return config;
});

api.interceptors.response.use(
  (res) => {
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

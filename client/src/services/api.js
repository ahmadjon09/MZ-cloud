/**
 * API Client (Axios) - MZ-CLOUD Production Quality
 * Automatically connects to https://mz-cloud.onrender.com/api/v1 when running on vercel.app
 * Provides helper URLs with query parameter auth for live Telegram CDN thumbnail and stream/download endpoints
 */
import axios from 'axios';

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return 'https://mz-cloud.onrender.com/api/v1';
  }
  return '/api/v1';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 30000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tgcloud_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Inject Telegram WebApp initData and user identity
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

/**
 * Returns full backend URL for streaming a file's Telegram CDN thumbnail
 * Includes query parameter auth so browser <img> tags work without custom HTTP headers
 */
export const getFileThumbnailUrl = (fileId) => {
  if (!fileId) return '';
  const token = localStorage.getItem('tgcloud_token') || '';
  const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user?.id || '';
  const params = new URLSearchParams();
  if (token) params.set('token', token);
  if (tgUser) params.set('tgId', tgUser);
  const queryStr = params.toString();
  return `${getBaseUrl()}/files/${fileId}/thumbnail${queryStr ? '?' + queryStr : ''}`;
};

/**
 * Returns full backend URL for streaming/downloading the real file from Telegram CDN
 * Includes query parameter auth so <video>, <audio>, and <a> download links work without custom HTTP headers
 */
export const getFileDownloadUrl = (fileId, download = false) => {
  if (!fileId) return '';
  const token = localStorage.getItem('tgcloud_token') || '';
  const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user?.id || '';
  const params = new URLSearchParams();
  if (token) params.set('token', token);
  if (tgUser) params.set('tgId', tgUser);
  if (download) params.set('download', 'true');
  const queryStr = params.toString();
  return `${getBaseUrl()}/files/${fileId}/download${queryStr ? '?' + queryStr : ''}`;
};

export default api;

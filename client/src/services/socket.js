/**
 * Realtime Socket.IO Client (MZ-CLOUD)
 * Automatically connects to https://mz-cloud.onrender.com when running on vercel.app
 */
import { io } from 'socket.io-client';
import { useUploadStore } from '../store/useUploadStore';

let socket = null;

const getSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return 'https://mz-cloud.onrender.com';
  }
  return '/';
};

export function initSocketClient(queryClient) {
  if (socket && socket.connected) {
    return socket;
  }

  const token = localStorage.getItem('tgcloud_token') || undefined;

  socket = io(getSocketUrl(), {
    auth: {
      token,
      demoId: '777000'
    },
    reconnection: true,
    reconnectionDelay: 1000
  });

  socket.on('connect', () => {
    console.log('⚡ Connected to MZ-CLOUD Realtime Socket.IO server:', socket.id);
  });

  socket.on('upload:completed', (payload) => {
    const uploadStore = useUploadStore.getState();
    const count = payload.count || 1;
    uploadStore.addNotification(`✅ ${count} file(s) saved to MZ-CLOUD!`, 'success');
    queryClient.invalidateQueries({ queryKey: ['files'] });
    queryClient.invalidateQueries({ queryKey: ['authMe'] });
  });

  socket.on('file:updated', () => {
    queryClient.invalidateQueries({ queryKey: ['files'] });
  });

  socket.on('file:deleted', () => {
    queryClient.invalidateQueries({ queryKey: ['files'] });
    queryClient.invalidateQueries({ queryKey: ['authMe'] });
  });

  socket.on('file:restored', () => {
    queryClient.invalidateQueries({ queryKey: ['files'] });
    queryClient.invalidateQueries({ queryKey: ['authMe'] });
  });

  socket.on('folder:created', () => {
    queryClient.invalidateQueries({ queryKey: ['folders'] });
  });

  socket.on('folder:updated', () => {
    queryClient.invalidateQueries({ queryKey: ['folders'] });
  });

  socket.on('folder:deleted', () => {
    queryClient.invalidateQueries({ queryKey: ['folders'] });
    queryClient.invalidateQueries({ queryKey: ['files'] });
  });

  return socket;
}

export function getSocket() {
  return socket;
}

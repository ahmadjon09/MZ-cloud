/**
 * Realtime Socket.IO Client
 * Listens for backend upload completions, folder modifications, and recycle bin events
 */
import { io } from 'socket.io-client';
import { useUploadStore } from '../store/useUploadStore';

let socket = null;

export function initSocketClient(queryClient) {
  if (socket && socket.connected) {
    return socket;
  }

  const token = localStorage.getItem('tgcloud_token') || undefined;

  socket = io('/', {
    auth: {
      token,
      demoId: '777000'
    },
    reconnection: true,
    reconnectionDelay: 1000
  });

  socket.on('connect', () => {
    console.log('⚡ Connected to Realtime Socket.IO server:', socket.id);
  });

  // Handle upload completion
  socket.on('upload:completed', (payload) => {
    const uploadStore = useUploadStore.getState();
    const count = payload.count || 1;
    uploadStore.addNotification(`✅ ${count} file(s) saved to Telegram Cloud!`, 'success');
    queryClient.invalidateQueries({ queryKey: ['files'] });
    queryClient.invalidateQueries({ queryKey: ['authMe'] });
  });

  // Handle file events
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

  // Handle folder events
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

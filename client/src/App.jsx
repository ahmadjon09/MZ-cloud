/**
 * Application Entry & Router Configuration
 * Enforces Telegram WebApp Exclusive Access, TanStack Query, React Router, Socket.IO client, and Auth synchronization
 */
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import SharedFilePage from './pages/SharedFilePage';
import MustOpenInTelegram from './components/common/MustOpenInTelegram';
import { useAuthStore } from './store/useAuthStore';
import api from './services/api';
import { initSocketClient } from './services/socket';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 60000
    }
  }
});

function isTelegramWebAppEnvironment() {
  // Check if WebApp initData is present from Telegram application
  const initData = window.Telegram?.WebApp?.initData;
  const userObj = window.Telegram?.WebApp?.initDataUnsafe?.user;
  if (initData || (userObj && userObj.id)) {
    return true;
  }
  // Allow explicit bypass query parameter for automated UI preview & local testing
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('dev_bypass') === 'true') {
    return true;
  }
  return false;
}

function AuthSynchronizer({ children }) {
  const { setAuth } = useAuthStore();
  const isTgApp = isTelegramWebAppEnvironment();

  const { data, isLoading } = useQuery({
    queryKey: ['authMe'],
    queryFn: async () => {
      const res = await api.get('/auth/me');
      return res.data;
    },
    enabled: isTgApp
  });

  React.useEffect(() => {
    if (data && data.user) {
      setAuth({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken });
      initSocketClient(queryClient);
    }
  }, [data, setAuth]);

  if (!isTgApp) {
    return <MustOpenInTelegram />;
  }

  return children;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthSynchronizer>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<DashboardPage />} />
            </Route>
            <Route path="/share/:token" element={<SharedFilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthSynchronizer>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

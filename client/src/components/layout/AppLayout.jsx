/**
 * Master Enterprise Application Layout (MZ-CLOUD)
 * 100% Full Screen Desktop & Mobile (h-full w-full flex flex-col overflow-hidden)
 * Combines Header, AdBanner (Hidden for Premium), Resizable Sidebar, Active Dashboard Viewport, Audio Player, and Upload Queue
 */
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import AudioBar from './AudioBar';
import UploadQueueWidget from './UploadQueueWidget';
import AdBanner from '../common/AdBanner';

export default function AppLayout() {
  return (
    <div className="flex flex-col h-full w-full flex-1 overflow-hidden bg-[#17212b] font-sans">
      {/* Top Header */}
      <Header />

      {/* Sponsored Ad Banner (Completely hidden for Telegram Premium users) */}
      <AdBanner />

      {/* Main Container with Sidebar + Content Area */}
      <div className="flex flex-1 overflow-hidden relative h-full w-full">
        <Sidebar />

        <main className="flex-1 flex flex-col overflow-y-auto relative pb-20 h-full">
          <Outlet />
        </main>
      </div>

      {/* Persistent Audio Player Bar */}
      <AudioBar />

      {/* Upload Queue Progress Widget */}
      <UploadQueueWidget />
    </div>
  );
}

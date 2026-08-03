/**
 * Master Enterprise Application Layout
 * Combines Header, Resizable Sidebar, Active Dashboard Viewport, Audio Player, and Upload Queue
 */
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import AudioBar from './AudioBar';
import UploadQueueWidget from './UploadQueueWidget';

export default function AppLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-telegram-light dark:bg-telegram-dark font-sans">
      {/* Top Header */}
      <Header />

      {/* Main Container with Sidebar + Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />

        <main className="flex-1 flex flex-col overflow-y-auto relative pb-16">
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

/**
 * Floating Upload Progress Queue & Notification Widget (MZ-CLOUD)
 * Displays parallel batch upload status and realtime toasts
 * Uses react-icons/fi
 */
import React from 'react';
import { useUploadStore } from '../../store/useUploadStore';
import { FiLoader, FiCheckCircle, FiX } from 'react-icons/fi';

export default function UploadQueueWidget() {
  const { jobs, notifications, clearNotifications } = useUploadStore();

  const activeJobs = jobs.filter((j) => j.status === 'uploading');

  if (activeJobs.length === 0 && notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-6 z-50 flex flex-col space-y-2 max-w-sm w-full font-sans">
      {/* Active Upload Jobs */}
      {activeJobs.map((job) => (
        <div
          key={job.id}
          className="p-3 bg-[#1e2329]/95 rounded-xl shadow-2xl border border-[#2481cc]/30 flex items-center justify-between backdrop-blur-md"
        >
          <div className="flex items-center space-x-3">
            <FiLoader className="w-5 h-5 text-[#2481cc] animate-spin" />
            <div>
              <div className="text-xs font-semibold text-white">
                Parallel Processing ({job.count} files)
              </div>
              <div className="text-[10px] text-slate-400">
                Worker pool indexing & extracting Telegram CDN metadata...
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Realtime Toasts / Notifications */}
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className="p-3 bg-[#1e2329]/95 rounded-xl shadow-lg border border-white/10 flex items-center justify-between animate-in fade-in slide-in-from-bottom-3 duration-200 backdrop-blur-md"
        >
          <div className="flex items-center space-x-2">
            <FiCheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span className="text-xs font-medium text-slate-200">
              {notif.message}
            </span>
          </div>
          <button
            onClick={clearNotifications}
            className="text-slate-400 hover:text-slate-200"
          >
            <FiX className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

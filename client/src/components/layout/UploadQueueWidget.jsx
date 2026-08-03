/**
 * Floating Upload Progress Queue & Notification Widget
 * Displays parallel batch upload status and realtime toasts
 */
import React from 'react';
import { useUploadStore } from '../../store/useUploadStore';
import { Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function UploadQueueWidget() {
  const { jobs, notifications, clearNotifications } = useUploadStore();

  const activeJobs = jobs.filter((j) => j.status === 'uploading');

  if (activeJobs.length === 0 && notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-6 z-50 flex flex-col space-y-2 max-w-sm w-full">
      {/* Active Upload Jobs */}
      {activeJobs.map((job) => (
        <div
          key={job.id}
          className="p-3 bg-telegram-light-card dark:bg-telegram-dark-card rounded-xl shadow-telegram-glass border border-telegram-blue/30 flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <Loader2 className="w-5 h-5 text-telegram-blue animate-spin" />
            <div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">
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
          className="p-3 bg-telegram-light-card dark:bg-telegram-dark-card rounded-xl shadow-lg border border-telegram-light-border dark:border-telegram-dark-border flex items-center justify-between animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
              {notif.message}
            </span>
          </div>
          <button
            onClick={clearNotifications}
            className="text-slate-400 hover:text-slate-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

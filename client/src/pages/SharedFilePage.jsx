/**
 * Standalone Public Shared File Page (Vector Icons Only - Lucide React)
 * Displays Telegram Saved Message metadata for public share links (/share/:token)
 */
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import {
  Image as ImageIcon,
  Video,
  FileText,
  Music,
  Code,
  File,
  ExternalLink,
  Cloud,
  AlertTriangle,
  User
} from 'lucide-react';

export default function SharedFilePage() {
  const { token } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['sharedFile', token],
    queryFn: async () => {
      const res = await api.get(`/share/${token}`);
      return res.data;
    }
  });

  const file = data?.file;

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'PHOTO': return <ImageIcon className="w-12 h-12 text-telegram-blue" />;
      case 'VIDEO': return <Video className="w-12 h-12 text-red-500" />;
      case 'AUDIO': return <Music className="w-12 h-12 text-emerald-500" />;
      case 'DOCUMENT': return <FileText className="w-12 h-12 text-blue-500" />;
      case 'CODE': return <Code className="w-12 h-12 text-purple-500" />;
      default: return <File className="w-12 h-12 text-slate-400" />;
    }
  };

  const formatSize = (bytes = 0) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-telegram-light dark:bg-telegram-dark text-slate-400">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-3 border-telegram-blue border-t-transparent rounded-full animate-spin" />
          <span>Loading Shared Telegram File...</span>
        </div>
      </div>
    );
  }

  if (error || !file) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-telegram-light dark:bg-telegram-dark p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
          Shared File Not Found
        </h2>
        <p className="text-sm text-slate-500 max-w-md mb-6">
          This share link may have expired or been revoked by the owner.
        </p>
        <Link
          to="/"
          className="px-5 py-2.5 bg-telegram-blue hover:bg-telegram-blue-hover text-white text-xs font-semibold rounded-xl shadow-md transition-all"
        >
          Return to Cloud Storage App
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-telegram-light dark:bg-telegram-dark p-6">
      <div className="w-full max-w-md bg-telegram-light-card dark:bg-telegram-dark-card border border-telegram-light-border dark:border-telegram-dark-border rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center">
        {/* Top Telegram Cloud Logo */}
        <div className="flex items-center space-x-2 text-telegram-blue font-bold text-xs uppercase tracking-wider mb-6">
          <Cloud className="w-5 h-5" />
          <span>Telegram Cloud Storage Platform</span>
        </div>

        {/* Media Icon */}
        <div className="w-24 h-24 rounded-2xl bg-telegram-light dark:bg-telegram-dark/60 flex items-center justify-center mb-6 shadow-inner">
          {getCategoryIcon(file.category)}
        </div>

        {/* File Name & Size */}
        <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1 max-w-xs truncate">
          {file.fileName}
        </h1>
        <div className="flex items-center space-x-2 text-xs text-slate-400 mb-6">
          <span className="font-semibold text-telegram-blue">{file.category}</span>
          <span>•</span>
          <span>{formatSize(file.fileSize)}</span>
        </div>

        {file.caption && (
          <p className="text-xs text-slate-500 dark:text-slate-400 italic max-w-sm mb-6 bg-telegram-light dark:bg-telegram-dark/40 p-3 rounded-xl border border-telegram-light-border/40">
            "{file.caption}"
          </p>
        )}

        {/* Shared by Info */}
        <div className="w-full py-3 px-4 rounded-xl bg-telegram-light dark:bg-telegram-dark/50 flex items-center justify-between text-xs text-slate-500 mb-6">
          <span className="flex items-center space-x-1">
            <User className="w-3.5 h-3.5" />
            <span>Shared by:</span>
          </span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {file.sharedBy?.firstName || 'Telegram User'}
          </span>
        </div>

        {/* Actions */}
        <div className="w-full space-y-3">
          <Link
            to="/"
            className="w-full py-3 bg-telegram-blue hover:bg-telegram-blue-hover text-white text-xs font-semibold rounded-xl flex items-center justify-center space-x-2 shadow-md transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open in Telegram Cloud Storage</span>
          </Link>

          <div className="text-[10px] text-slate-400">
            Real media stored safely in Telegram CDN
          </div>
        </div>
      </div>
    </div>
  );
}

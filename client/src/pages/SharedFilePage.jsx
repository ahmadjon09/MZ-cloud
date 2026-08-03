/**
 * Standalone Public Shared File Page (MZ-CLOUD - react-icons/fi)
 * Displays Telegram Saved Message metadata for public share links (/share/:token)
 * Includes "Send to my Telegram" button
 */
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { useSendToTelegram } from '../hooks/useFiles';
import {
  FiImage,
  FiVideo,
  FiFileText,
  FiMusic,
  FiCode,
  FiFile,
  FiExternalLink,
  FiCloud,
  FiAlertTriangle,
  FiUser,
  FiSend
} from 'react-icons/fi';

export default function SharedFilePage() {
  const { token } = useParams();
  const sendToTg = useSendToTelegram();

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
      case 'PHOTO': return <FiImage className="w-12 h-12 text-[#2481cc]" />;
      case 'VIDEO': return <FiVideo className="w-12 h-12 text-red-500" />;
      case 'AUDIO': return <FiMusic className="w-12 h-12 text-emerald-500" />;
      case 'DOCUMENT': return <FiFileText className="w-12 h-12 text-blue-500" />;
      case 'CODE': return <FiCode className="w-12 h-12 text-purple-500" />;
      default: return <FiFile className="w-12 h-12 text-slate-400" />;
    }
  };

  const formatSize = (bytes = 0) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#17212b] text-slate-400 font-sans">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#2481cc] border-t-transparent rounded-full animate-spin" />
          <span>Loading Shared MZ-CLOUD File...</span>
        </div>
      </div>
    );
  }

  if (error || !file) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#17212b] p-6 text-center font-sans">
        <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-4">
          <FiAlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-white mb-2">
          Shared File Not Found
        </h2>
        <p className="text-sm text-slate-400 max-w-md mb-6">
          This share link may have expired or been revoked by the owner.
        </p>
        <Link
          to="/"
          className="px-5 py-2.5 bg-[#2481cc] hover:bg-[#2f88d2] text-white text-xs font-semibold rounded-xl shadow-md transition-all"
        >
          Return to MZ-CLOUD App
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#17212b] p-6 font-sans">
      <div className="w-full max-w-md bg-[#1e2329]/90 border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center backdrop-blur-md">
        {/* Top Telegram Cloud Logo */}
        <div className="flex items-center space-x-2 text-[#2481cc] font-bold text-xs uppercase tracking-wider mb-6">
          <FiCloud className="w-5 h-5" />
          <span>MZ-CLOUD Storage Platform</span>
        </div>

        {/* Media Icon */}
        <div className="w-24 h-24 rounded-2xl bg-[#17212b]/80 flex items-center justify-center mb-6 shadow-inner">
          {getCategoryIcon(file.category)}
        </div>

        {/* File Name & Size */}
        <h1 className="text-lg font-bold text-white mb-1 max-w-xs truncate">
          {file.fileName}
        </h1>
        <div className="flex items-center space-x-2 text-xs text-slate-400 mb-6">
          <span className="font-semibold text-[#2481cc]">{file.category}</span>
          <span>•</span>
          <span>{formatSize(file.fileSize)}</span>
        </div>

        {file.caption && (
          <p className="text-xs text-slate-300 italic max-w-sm mb-6 bg-[#17212b]/60 p-3 rounded-xl border border-white/5">
            "{file.caption}"
          </p>
        )}

        {/* Shared by Info */}
        <div className="w-full py-3 px-4 rounded-xl bg-[#17212b]/80 flex items-center justify-between text-xs text-slate-400 mb-6">
          <span className="flex items-center space-x-1">
            <FiUser className="w-3.5 h-3.5" />
            <span>Shared by:</span>
          </span>
          <span className="font-semibold text-white">
            {file.sharedBy?.firstName || 'Telegram User'}
          </span>
        </div>

        {/* Actions */}
        <div className="w-full space-y-3">
          <button
            onClick={() => sendToTg.mutate(file.id)}
            disabled={sendToTg.isPending}
            className="w-full py-3 bg-[#2481cc] hover:bg-[#2f88d2] text-white text-xs font-semibold rounded-xl flex items-center justify-center space-x-2 shadow-md transition-all disabled:opacity-50"
          >
            <FiSend className="w-4 h-4" />
            <span>{sendToTg.isPending ? 'Yuborilmoqda...' : 'Telegram chatingizga yuborish'}</span>
          </button>

          <Link
            to="/"
            className="w-full py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl flex items-center justify-center space-x-2 shadow-sm transition-all"
          >
            <FiExternalLink className="w-4 h-4" />
            <span>MZ-CLOUD ilovasida ochish</span>
          </Link>

          <div className="text-[10px] text-slate-400">
            Real media stored safely in Telegram CDN
          </div>
        </div>
      </div>
    </div>
  );
}

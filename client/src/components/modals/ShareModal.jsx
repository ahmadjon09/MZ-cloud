/**
 * Public Share Link Modal
 * Generate and copy public shareable links for any Saved Message file
 */
import React from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Globe
} from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';

export default function ShareModal() {
  const { activeShareModalFile: shareData, closeShareModal } = useUIStore();
  const [copied, setCopied] = React.useState(false);

  if (!shareData) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareData.shareUrl || window.location.origin + '/share/' + shareData.shareToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-telegram-light-card dark:bg-telegram-dark-card border border-telegram-light-border dark:border-telegram-dark-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-telegram-light-border dark:border-telegram-dark-border flex items-center justify-between bg-telegram-light dark:bg-telegram-dark/50">
          <div className="flex items-center space-x-2.5">
            <Share2 className="w-5 h-5 text-telegram-blue" />
            <div>
              <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                Public Shareable Link
              </h3>
              <span className="text-xs text-slate-400">
                Anyone with the link can view metadata
              </span>
            </div>
          </div>

          <button onClick={closeShareModal} className="p-1.5 text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-3 bg-telegram-light dark:bg-telegram-dark/80 border border-telegram-light-border dark:border-telegram-dark-border rounded-xl flex items-center justify-between space-x-2">
            <Globe className="w-4 h-4 text-telegram-blue flex-shrink-0" />
            <input
              type="text"
              readOnly
              value={shareData.shareUrl || `${window.location.origin}/share/${shareData.shareToken}`}
              className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-100 font-mono focus:outline-none truncate"
            />
          </div>

          <button
            onClick={handleCopy}
            className="w-full py-2.5 bg-telegram-blue hover:bg-telegram-blue-hover text-white text-xs font-semibold rounded-xl flex items-center justify-center space-x-2 shadow-sm transition-all"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Share Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

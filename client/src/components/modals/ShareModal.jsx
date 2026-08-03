/**
 * Public Share Link Modal (MZ-CLOUD - react-icons/fi)
 * Generate and copy public shareable links for any Saved Message file
 * 100% Mobile Responsive
 */
import React from 'react';
import {
  FiX,
  FiShare2,
  FiCopy,
  FiCheck,
  FiGlobe
} from 'react-icons/fi';
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
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 font-sans">
      <div
        className="w-full max-w-md bg-[#1e2329] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 flex items-center justify-between bg-[#17212b]">
          <div className="flex items-center space-x-2.5">
            <FiShare2 className="w-5 h-5 text-[#2481cc]" />
            <div>
              <h3 className="font-semibold text-xs sm:text-sm text-white">
                Public Shareable Link
              </h3>
              <span className="text-[10px] sm:text-xs text-slate-400">
                Anyone with the link can view metadata
              </span>
            </div>
          </div>

          <button onClick={closeShareModal} className="p-1.5 text-slate-400 hover:text-slate-200">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          <div className="p-3 bg-[#17212b]/80 border border-white/10 rounded-xl flex items-center justify-between space-x-2">
            <FiGlobe className="w-4 h-4 text-[#2481cc] flex-shrink-0" />
            <input
              type="text"
              readOnly
              value={shareData.shareUrl || `${window.location.origin}/share/${shareData.shareToken}`}
              className="w-full bg-transparent text-xs text-white font-mono focus:outline-none truncate"
            />
          </div>

          <button
            onClick={handleCopy}
            className="w-full py-2.5 bg-[#2481cc] hover:bg-[#2f88d2] text-white text-xs font-semibold rounded-xl flex items-center justify-center space-x-2 shadow-md transition-all"
          >
            {copied ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Share Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

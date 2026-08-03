/**
 * MZ-CLOUD Sponsorship / Advertisement Banner
 * Completely hidden for MZ-CLOUD Premium users (user.isPremium === true)
 */
import React from 'react';
import { FiStar, FiX } from 'react-icons/fi';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';

export default function AdBanner() {
  const user = useAuthStore((s) => s.user);
  const { openPremiumModal } = useUIStore();
  const [dismissed, setDismissed] = React.useState(false);

  // Zero ads for Premium users
  if (user?.isPremium || dismissed) {
    return null;
  }

  return (
    <div className="w-full bg-gradient-to-r from-amber-500/15 via-[#2481cc]/15 to-purple-500/15 border-b border-white/10 px-4 py-2 flex items-center justify-between text-xs text-slate-200 font-sans backdrop-blur-md">
      <div className="flex items-center space-x-2 truncate">
        <FiStar className="w-4 h-4 text-amber-400 fill-amber-400 flex-shrink-0 animate-pulse" />
        <span className="truncate">
          <b>MZ-CLOUD Premium:</b> Telegram Stars orqali VIP statusga o'ting va 100% reklamasiz tezkor bulutdan foydalaning!
        </span>
      </div>

      <div className="flex items-center space-x-3 flex-shrink-0 ml-2">
        <button
          onClick={openPremiumModal}
          className="hidden sm:flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500 hover:text-white font-semibold transition-colors"
        >
          <FiStar className="w-3 h-3 fill-amber-300" />
          <span>Premium</span>
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-slate-400 hover:text-white transition-colors"
          title="Dismiss banner"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

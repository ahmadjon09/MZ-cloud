/**
 * MZ-CLOUD Sponsorship / Advertisement Banner
 * Completely hidden for Telegram Premium users (user.isPremium === true)
 */
import React from 'react';
import { FiStar, FiX, FiExternalLink } from 'react-icons/fi';
import { useAuthStore } from '../../store/useAuthStore';

export default function AdBanner() {
  const user = useAuthStore((s) => s.user);
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
          <b>MZ-CLOUD Homiylik / Sponsored:</b> Telegram Premium hisobiga o'ting va 100% reklamasiz tezkor bulutdan foydalaning!
        </span>
      </div>

      <div className="flex items-center space-x-3 flex-shrink-0 ml-2">
        <a
          href="https://telegram.org/faq_premium"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center space-x-1 text-[#2481cc] hover:underline font-semibold"
        >
          <span>Premium</span>
          <FiExternalLink className="w-3 h-3" />
        </a>
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

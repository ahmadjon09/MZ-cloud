/**
 * MZ-CLOUD - Telegram WebApp Exclusive Access Screen
 * Restricts access so the WebApp cannot be opened in a standard browser outside Telegram
 * Uses react-icons/fi
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiLock, FiSmartphone, FiSend, FiShield } from 'react-icons/fi';

export default function MustOpenInTelegram() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#17212b] to-[#0e1621] text-white flex flex-col items-center justify-center p-6 text-center select-none font-sans">
      <div className="w-full max-w-md bg-[#1e2329]/90 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl flex flex-col items-center">
        {/* Vector Icon Box */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#2481cc]/20 to-blue-500/20 text-[#2481cc] flex items-center justify-center mb-6 shadow-inner border border-[#2481cc]/30">
          <FiLock className="w-10 h-10" />
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
          MZ-CLOUD Access Restricted
        </h1>

        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          Ushbu Web-ilovadan faqat rasmiy <b>Telegram</b> ilovasi ichidan yuborilgan maxsus WebApp tugmasi orqali foydalanish mumkin. Brauzerdan to'g'ridan-to'g'ri ochish bloklangan.
        </p>

        {/* Steps */}
        <div className="w-full space-y-3 bg-black/30 p-4 rounded-2xl border border-white/5 text-left text-xs text-slate-300 mb-6">
          <div className="flex items-center space-x-3">
            <FiSmartphone className="w-4 h-4 text-[#2481cc] flex-shrink-0" />
            <span>1. Open <b>Telegram Messenger</b> on Mobile or Desktop.</span>
          </div>
          <div className="flex items-center space-x-3">
            <FiSend className="w-4 h-4 text-[#2481cc] flex-shrink-0" />
            <span>2. Go to <b>@MZCloudBot</b> (or your Bot account).</span>
          </div>
          <div className="flex items-center space-x-3">
            <FiShield className="w-4 h-4 text-[#2481cc] flex-shrink-0" />
            <span>3. Click <b>"Open MZ-CLOUD App"</b> button.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-[11px] text-slate-400">
          MZ-CLOUD — Multi-Tenant Zero-Server Security
        </div>
      </div>
    </div>
  );
}

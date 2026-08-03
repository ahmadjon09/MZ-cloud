/**
 * Telegram WebApp Exclusive Access Screen
 * Restricts access so the WebApp cannot be opened in a standard browser outside Telegram
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, Send, Lock, Smartphone } from 'lucide-react';

export default function MustOpenInTelegram() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-telegram-light dark:bg-telegram-dark flex flex-col items-center justify-center p-6 text-center select-none font-sans">
      <div className="w-full max-w-md bg-telegram-light-card dark:bg-telegram-dark-card border border-telegram-light-border dark:border-telegram-dark-border rounded-3xl p-8 shadow-2xl flex flex-col items-center">
        {/* Vector Icon */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-telegram-blue/20 to-blue-500/20 text-telegram-blue flex items-center justify-center mb-6 shadow-inner">
          <Lock className="w-10 h-10" />
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          Access Restricted to Telegram App
        </h1>

        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          Ushbu Web-ilovadan faqat rasmiy <b>Telegram</b> ilovasi ichidan yuborilgan maxsus WebApp tugmasi orqali foydalanish mumkin. Brauzerdan to'g'ridan-to'g'ri ochish bloklangan.
        </p>

        {/* Steps */}
        <div className="w-full space-y-3 bg-telegram-light dark:bg-telegram-dark/50 p-4 rounded-2xl border border-telegram-light-border/60 dark:border-telegram-dark-border/60 text-left text-xs text-slate-600 dark:text-slate-300 mb-6">
          <div className="flex items-center space-x-3">
            <Smartphone className="w-4 h-4 text-telegram-blue flex-shrink-0" />
            <span>1. Open <b>Telegram Messenger</b> on Mobile or Desktop.</span>
          </div>
          <div className="flex items-center space-x-3">
            <Send className="w-4 h-4 text-telegram-blue flex-shrink-0" />
            <span>2. Go to <b>@TGCloudStorageBot</b> (or your Bot account).</span>
          </div>
          <div className="flex items-center space-x-3">
            <ShieldAlert className="w-4 h-4 text-telegram-blue flex-shrink-0" />
            <span>3. Click <b>"Open Telegram Cloud App"</b> button.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-[11px] text-slate-400">
          Telegram Cloud Storage Platform — Multi-Tenant Zero-Server Security
        </div>
      </div>
    </div>
  );
}

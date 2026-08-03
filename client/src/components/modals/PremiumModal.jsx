/**
 * MZ-CLOUD Custom Premium Membership Modal (Telegram Stars XTR)
 * Unlock 100% ad-free cloud storage, VIP golden star badge, and priority worker queues
 * Uses react-icons/fi
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FiX,
  FiStar,
  FiShield,
  FiZap,
  FiCheck,
  FiAward
} from 'react-icons/fi';
import { useAuthStore } from '../../store/useAuthStore';
import { useCreateStarsInvoice, useToggleDemoPremium } from '../../hooks/useAdmin';

export default function PremiumModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const starsInvoiceMutation = useCreateStarsInvoice();
  const toggleDemoPremiumMutation = useToggleDemoPremium();

  if (!isOpen) return null;

  const isDev = import.meta.env.DEV || window.location.hostname.includes('localhost');

  const handlePayWithStars = () => {
    starsInvoiceMutation.mutate();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div
        className="w-full max-w-md bg-[#1e2329] border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-white backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Hero */}
        <div className="p-6 bg-gradient-to-br from-amber-500/20 via-[#17212b] to-[#1e2329] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <FiStar className="w-7 h-7 fill-amber-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-1.5">
                <span>MZ-CLOUD Premium</span>
              </h3>
              <span className="text-xs text-amber-400 font-medium">
                Telegram Stars (XTR) orqali faollashtiring
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Benefits List */}
        <div className="p-6 space-y-4 text-xs text-slate-200">
          <div className="flex items-start space-x-3 p-3 rounded-xl bg-white/5 border border-white/5">
            <FiShield className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block mb-0.5">100% Reklamasiz Interfeys (0 Ads)</span>
              <span className="text-slate-400">Homiylik bannerlari va barcha reklama oynalari butunlay o'chiriladi.</span>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-xl bg-white/5 border border-white/5">
            <FiAward className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block mb-0.5">VIP Oltin Yulduz Yorlig'i</span>
              <span className="text-slate-400">Ismingiz yonida maxsus MZ-CLOUD Premium oltin yulduz statusi ko'rinadi.</span>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-xl bg-white/5 border border-white/5">
            <FiZap className="w-5 h-5 text-[#2481cc] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block mb-0.5">Parallel Upload Ustuvorligi</span>
              <span className="text-slate-400">Fayllaringiz tezkor Worker Pool navbatida eng birinchi yozilib indekslanadi.</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-2 space-y-3 bg-[#17212b]">
          {user?.isPremium ? (
            <div className="w-full py-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-semibold text-xs rounded-xl flex items-center justify-center space-x-2">
              <FiCheck className="w-4 h-4" />
              <span>Siz allaqachon MZ-CLOUD Premium a'zosisiz</span>
            </div>
          ) : (
            <button
              onClick={handlePayWithStars}
              disabled={starsInvoiceMutation.isPending}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-lg transition-all disabled:opacity-50"
            >
              <FiStar className="w-4 h-4 fill-white" />
              <span>{starsInvoiceMutation.isPending ? 'Hisob yuborilmoqda...' : '50 Telegram Stars orqali faollashtirish'}</span>
            </button>
          )}

          {isDev && (
            <button
              onClick={() => {
                toggleDemoPremiumMutation.mutate();
                onClose();
              }}
              className="w-full py-2 bg-white/10 hover:bg-white/15 text-slate-300 font-medium text-[11px] rounded-xl transition-colors"
            >
              [Dev mode] MZ-CLOUD Premium statusini yangilash
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

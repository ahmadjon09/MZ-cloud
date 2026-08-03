/**
 * MZ-CLOUD Admin Authorization Error Screen
 * Displayed when a non-admin user attempts to access /admin
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiAlertTriangle, FiArrowLeft } from 'react-icons/fi';

export default function AdminAccessDenied() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#17212b] to-[#0e1621] text-white flex flex-col items-center justify-center p-6 text-center select-none font-sans">
      <div className="w-full max-w-md bg-[#1e2329]/90 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl flex flex-col items-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-red-500/20 text-amber-400 flex items-center justify-center mb-6 shadow-inner border border-amber-500/30">
          <FiAlertTriangle className="w-10 h-10" />
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
          MZ-CLOUD Admin Authorization Required
        </h1>

        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          Ushbu <b>/admin</b> boshqaruv sahifasi faqat MZ-CLOUD administratorlari (ADMIN yoki SUPER_ADMIN) uchun ruxsat etilgan.
        </p>

        <Link
          to="/"
          className="w-full py-3 bg-[#2481cc] hover:bg-[#2f88d2] text-white text-xs font-semibold rounded-xl flex items-center justify-center space-x-2 shadow-md transition-all"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Asosiy sahifaga qaytish / Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}

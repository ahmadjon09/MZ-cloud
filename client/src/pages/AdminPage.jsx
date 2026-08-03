/**
 * Super Admin Control Panel Page (MZ-CLOUD - react-icons/fi)
 * Features: Live Server Health, Redis/DB/Queue Status, User Management (Ban/Unban, Roles), Audit Logs, and Broadcast
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FiShield,
  FiUsers,
  FiHardDrive,
  FiFileText,
  FiActivity,
  FiServer,
  FiSearch,
  FiRadio,
  FiSend,
  FiAlertTriangle,
  FiStar
} from 'react-icons/fi';
import {
  useAdminAnalytics,
  useAdminUsers,
  useSetUserBanStatus,
  useBroadcastMessage
} from '../hooks/useAdmin';
import { useAuthStore } from '../store/useAuthStore';

export default function AdminPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);

  const { data: analytics, isLoading: analyticsLoading } = useAdminAnalytics();
  const [searchUser, setSearchUser] = React.useState('');
  const { data: usersData, isLoading: usersLoading } = useAdminUsers({ search: searchUser });
  const setUserBan = useSetUserBanStatus();
  const broadcast = useBroadcastMessage();

  const [broadcastText, setBroadcastText] = React.useState('');
  const [banReasonModal, setBanReasonModal] = React.useState(null);
  const [banReasonText, setBanReasonText] = React.useState('');

  if (analyticsLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 text-slate-400">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Loading MZ-CLOUD Admin Metrics...</span>
        </div>
      </div>
    );
  }

  const platform = analytics?.platform || {};
  const health = analytics?.health || {};
  const recentLogs = analytics?.recentLogs || [];
  const usersList = usersData?.users || [];

  const formatSize = (bytes = 0) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;
    broadcast.mutate({ message: broadcastText.trim(), markdown: true });
    setBroadcastText('');
  };

  const handleConfirmBan = () => {
    if (!banReasonModal) return;
    setUserBan.mutate({
      userId: banReasonModal.userId,
      isBanned: banReasonModal.isBanned,
      banReason: banReasonModal.isBanned ? banReasonText : null
    });
    setBanReasonModal(null);
    setBanReasonText('');
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 min-h-screen font-sans">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white shadow-lg">
            <FiShield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              {t('admin.title')}
            </h1>
            <p className="text-xs text-slate-400">
              MZ-CLOUD Live monitoring, user access control, and server health
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
          SUPER ADMIN MODE
        </span>
      </div>

      {/* Top Cards: Total Users, Total Storage, CDN Files, Live Server Health */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 bg-[#1e2329]/90 border border-white/10 rounded-2xl shadow-sm flex items-center justify-between backdrop-blur-md">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              {t('admin.totalUsers')}
            </span>
            <div className="text-2xl font-bold text-white">
              {platform.totalUsers || 1}
            </div>
            <span className="text-xs text-amber-500 font-medium mt-1 inline-flex items-center">
              <FiStar className="w-3.5 h-3.5 fill-amber-500 mr-1" />
              <span>{platform.premiumUsers || 1} Premium</span>
            </span>
          </div>
          <FiUsers className="w-10 h-10 text-[#2481cc] opacity-80" />
        </div>

        <div className="p-5 bg-[#1e2329]/90 border border-white/10 rounded-2xl shadow-sm flex items-center justify-between backdrop-blur-md">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              {t('admin.storageUsed')}
            </span>
            <div className="text-2xl font-bold text-white">
              {formatSize(platform.totalStorageUsed)}
            </div>
            <span className="text-xs text-emerald-500 font-medium mt-1 inline-block">
              Telegram CDN Storage
            </span>
          </div>
          <FiHardDrive className="w-10 h-10 text-emerald-500 opacity-80" />
        </div>

        <div className="p-5 bg-[#1e2329]/90 border border-white/10 rounded-2xl shadow-sm flex items-center justify-between backdrop-blur-md">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              {t('admin.totalFiles')}
            </span>
            <div className="text-2xl font-bold text-white">
              {platform.totalFilesCount || 0}
            </div>
            <span className="text-xs text-blue-500 font-medium mt-1 inline-block">
              Active Files
            </span>
          </div>
          <FiFileText className="w-10 h-10 text-blue-500 opacity-80" />
        </div>

        <div className="p-5 bg-[#1e2329]/90 border border-white/10 rounded-2xl shadow-sm flex items-center justify-between backdrop-blur-md">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              {t('admin.queueLen')}
            </span>
            <div className="text-2xl font-bold text-white">
              {health.queueLength || 0}
            </div>
            <span className="text-xs text-purple-500 font-medium mt-1 inline-block">
              Parallel Worker Pool
            </span>
          </div>
          <FiActivity className="w-10 h-10 text-purple-500 opacity-80" />
        </div>
      </div>

      {/* Live Server Health Panel */}
      <div className="p-6 bg-[#1e2329]/90 border border-white/10 rounded-2xl shadow-sm backdrop-blur-md">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
          <FiServer className="w-4 h-4 text-[#2481cc]" />
          <span>{t('admin.health')}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-[#17212b]/80 border border-white/10">
            <span className="text-slate-400 block mb-1">PostgreSQL Database</span>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-white">{health.dbStatus || 'ONLINE'}</span>
              <span className="text-[10px] text-slate-400">({health.dbLatencyMs || 2}ms)</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#17212b]/80 border border-white/10">
            <span className="text-slate-400 block mb-1">Redis Search / Queue Cache</span>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-white">{health.redisStatus || 'ONLINE'}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#17212b]/80 border border-white/10">
            <span className="text-slate-400 block mb-1">RAM Memory Usage</span>
            <div className="font-bold text-white">
              {health.usedMemoryMb || 120} MB / {health.totalMemoryMb || 4096} MB ({health.memoryUsagePercent || 15}%)
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#17212b]/80 border border-white/10">
            <span className="text-slate-400 block mb-1">CPU Load Average</span>
            <div className="font-bold text-white">
              {health.cpuLoadAverage || '0.12'}
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Grid: User Management & Broadcast Announcement */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: User Management Table */}
        <div className="lg:col-span-2 p-6 bg-[#1e2329]/90 border border-white/10 rounded-2xl shadow-sm backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <FiUsers className="w-4 h-4 text-[#2481cc]" />
              <span>{t('admin.userManagement')}</span>
            </h3>

            <div className="relative w-full sm:w-64">
              <FiSearch className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={t('admin.searchUsers')}
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#17212b] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2481cc]"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[450px]">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 bg-[#17212b]/60">
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Storage</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5">
                    <td className="py-3 px-3 font-medium text-white">
                      <div>{u.firstName} {u.lastName || ''}</div>
                      <div className="text-[10px] text-slate-400">@{u.username || u.telegramId}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                        u.role === 'SUPER_ADMIN' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">{formatSize(u.storageUsed)}</td>
                    <td className="py-3 px-3">
                      {u.isBanned ? (
                        <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 font-semibold">
                          Banned
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-semibold">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {u.role !== 'SUPER_ADMIN' && (
                        <button
                          onClick={() => setBanReasonModal({ userId: u.id, isBanned: !u.isBanned })}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            u.isBanned
                              ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'
                              : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'
                          }`}
                        >
                          {u.isBanned ? 'Unban' : 'Ban'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Broadcast Announcement Tool */}
        <div className="p-6 bg-[#1e2329]/90 border border-white/10 rounded-2xl shadow-sm flex flex-col justify-between backdrop-blur-md">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center space-x-2">
              <FiRadio className="w-4 h-4 text-amber-500" />
              <span>{t('admin.broadcastTitle')}</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {t('admin.broadcastSub')}
            </p>

            <form onSubmit={handleBroadcast} className="space-y-3">
              <textarea
                rows="5"
                required
                placeholder="Write announcement (Markdown supported)..."
                value={broadcastText}
                onChange={(e) => setBroadcastText(e.target.value)}
                className="w-full p-3 text-xs bg-[#17212b] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2481cc] resize-none"
              />

              <button
                type="submit"
                disabled={broadcast.isPending}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-md transition-all disabled:opacity-50"
              >
                <FiSend className="w-4 h-4" />
                <span>{broadcast.isPending ? 'Broadcasting...' : t('admin.broadcastSend')}</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Audit Logs Section */}
      <div className="p-6 bg-[#1e2329]/90 border border-white/10 rounded-2xl shadow-sm backdrop-blur-md">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
          <FiActivity className="w-4 h-4 text-[#2481cc]" />
          <span>{t('admin.auditLogs')}</span>
        </h3>

        <div className="space-y-2 max-h-64 overflow-y-auto text-xs">
          {recentLogs.length === 0 ? (
            <p className="text-slate-400 italic">No system audit logs recorded yet.</p>
          ) : (
            recentLogs.map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-xl bg-[#17212b]/60 flex items-center justify-between border border-white/5"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-[#2481cc]">{log.action}</span>
                  <span className="text-slate-300">
                    User: {log.user?.firstName || 'System'}
                  </span>
                  <span className="text-slate-400 font-mono text-[10px]">
                    {log.details ? log.details : ''}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {new Date(log.createdAt).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Ban Reason Confirmation Modal */}
      {banReasonModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#1e2329] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center space-x-2">
              <FiAlertTriangle className="w-5 h-5 text-amber-500" />
              <span>{banReasonModal.isBanned ? 'Ban User Account' : 'Unban User Account'}</span>
            </h3>

            {banReasonModal.isBanned && (
              <input
                type="text"
                placeholder="Reason for ban (e.g. Terms violation)..."
                value={banReasonText}
                onChange={(e) => setBanReasonText(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#17212b] border border-white/10 rounded-xl text-white"
              />
            )}

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setBanReasonModal(null)}
                className="px-4 py-1.5 text-xs text-slate-400 hover:bg-white/5 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBan}
                className="px-4 py-1.5 text-xs font-semibold bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

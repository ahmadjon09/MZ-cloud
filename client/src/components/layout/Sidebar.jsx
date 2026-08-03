/**
 * MZ-CLOUD Sidebar (Mobile Responsive & react-icons/fi Only)
 * Responsive navigation drawer for mobile and resizable sidebar for desktop
 * Zero overall storage limits (Unlimited capacity displayed)
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FiFolder,
  FiImage,
  FiVideo,
  FiFileText,
  FiMusic,
  FiMic,
  FiCode,
  FiStar,
  FiClock,
  FiTrash2,
  FiShield,
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
  FiChevronDown,
  FiHardDrive,
  FiX
} from 'react-icons/fi';
import { useUIStore } from '../../store/useUIStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useFoldersList } from '../../hooks/useFolders';

export default function Sidebar() {
  const { t } = useTranslation();
  const {
    isSidebarCollapsed,
    setSidebarCollapsed,
    isMobileSidebarOpen,
    setMobileSidebarOpen,
    activeNav,
    activeFolderId,
    setActiveNav,
    setActiveFolderId,
    openFolderModal
  } = useUIStore();
  const user = useAuthStore((s) => s.user);
  const { data: folders = [] } = useFoldersList({ includeHidden: false });

  const [isFoldersExpanded, setFoldersExpanded] = React.useState(true);

  const navItems = [
    { id: 'ALL', label: t('sidebar.allFiles'), icon: FiFolder },
    { id: 'PHOTO', label: t('sidebar.photos'), icon: FiImage },
    { id: 'VIDEO', label: t('sidebar.videos'), icon: FiVideo },
    { id: 'DOCUMENT', label: t('sidebar.documents'), icon: FiFileText },
    { id: 'AUDIO', label: t('sidebar.music'), icon: FiMusic },
    { id: 'VOICE', label: t('sidebar.voice'), icon: FiMic },
    { id: 'CODE', label: t('sidebar.code'), icon: FiCode },
    { id: 'FAVORITE', label: t('sidebar.favorites'), icon: FiStar, color: 'text-amber-500' },
    { id: 'RECENT', label: t('sidebar.recent'), icon: FiClock },
    { id: 'TRASH', label: t('sidebar.trash'), icon: FiTrash2, color: 'text-red-500' }
  ];

  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN');

  const formatSize = (bytes = 0) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const sidebarContent = (
    <>
      {/* Top Mobile Drawer Header */}
      <div className="flex items-center justify-between p-4 sm:hidden border-b border-white/10">
        <span className="font-bold text-sm text-[#2481cc]">MZ-CLOUD</span>
        <button
          onClick={() => setMobileSidebarOpen(false)}
          className="p-1 text-slate-400 hover:text-slate-200"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      {/* Main Nav Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id && activeFolderId === null;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveNav(item.id);
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-[#2481cc] text-white shadow-sm'
                  : 'text-slate-300 hover:bg-white/5 hover:text-[#2481cc]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 flex-shrink-0 ${!isActive && item.color ? item.color : ''}`} />
                {(!isSidebarCollapsed || isMobileSidebarOpen) && <span className="truncate">{item.label}</span>}
              </div>
            </button>
          );
        })}

        {/* Folders Section Header */}
        {(!isSidebarCollapsed || isMobileSidebarOpen) && (
          <div className="pt-4 pb-1 px-3">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
              <button
                onClick={() => setFoldersExpanded(!isFoldersExpanded)}
                className="flex items-center space-x-1 hover:text-[#2481cc]"
              >
                <span>{t('sidebar.folders')}</span>
                <FiChevronDown
                  className={`w-3.5 h-3.5 transform transition-transform ${
                    isFoldersExpanded ? 'rotate-0' : '-rotate-90'
                  }`}
                />
              </button>
              <button
                onClick={() => openFolderModal(null)}
                title={t('sidebar.newFolder')}
                className="p-1 hover:text-[#2481cc] hover:bg-white/5 rounded transition-colors"
              >
                <FiPlus className="w-4 h-4" />
              </button>
            </div>

            {/* Folders List */}
            {isFoldersExpanded && (
              <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
                {folders.length === 0 ? (
                  <p className="text-xs text-slate-400 px-2 py-1">No folders created yet.</p>
                ) : (
                  folders.map((folder) => {
                    const isFolderActive = activeFolderId === folder.id;
                    return (
                      <button
                        key={folder.id}
                        onClick={() => {
                          setActiveFolderId(folder.id);
                          setMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          isFolderActive
                            ? 'bg-[#2481cc] text-white'
                            : 'text-slate-300 hover:bg-white/5 hover:text-[#2481cc]'
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <FiFolder className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{folder.name}</span>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isFolderActive ? 'bg-white/20' : 'bg-slate-700'}`}>
                          {folder._count?.files || 0}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}

        {/* Super Admin Control Button */}
        {isAdmin && (
          <div className="pt-4 border-t border-white/10 mt-4">
            <button
              onClick={() => {
                setActiveNav('ADMIN');
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                activeNav === 'ADMIN'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md'
                  : 'text-amber-400 hover:bg-amber-950/30'
              }`}
            >
              <FiShield className="w-5 h-5 flex-shrink-0" />
              {(!isSidebarCollapsed || isMobileSidebarOpen) && <span>{t('sidebar.adminPanel')}</span>}
            </button>
          </div>
        )}
      </div>

      {/* Footer Storage Progress Bar (Unlimited Capacity Display) */}
      {(!isSidebarCollapsed || isMobileSidebarOpen) && user && (
        <div className="p-4 border-t border-white/10 bg-[#17212b]/50">
          <div className="flex items-center justify-between text-xs font-medium text-slate-300 mb-1">
            <span className="flex items-center space-x-1">
              <FiHardDrive className="w-3.5 h-3.5 text-[#2481cc]" />
              <span>{t('sidebar.storageUsed')}</span>
            </span>
            <span className="text-white font-bold">{formatSize(user.storageUsed)}</span>
          </div>
          <div className="text-[10px] text-emerald-400 flex items-center justify-between">
            <span>Cheksiz Xotira / Unlimited</span>
            <span>∞ GB</span>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Desktop Resizable / Collapsible Sidebar */}
      <aside
        className={`hidden sm:flex relative flex-col border-r border-white/10 bg-[#1e2329]/90 backdrop-blur-md transition-all duration-300 z-10 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Sidebar Collapse Toggle Button */}
        <button
          onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
          title={isSidebarCollapsed ? t('sidebar.expand') : t('sidebar.collapse')}
          className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-[#2481cc] text-white flex items-center justify-center shadow-md hover:bg-[#2f88d2] z-30 transition-transform"
        >
          {isSidebarCollapsed ? <FiChevronRight className="w-3.5 h-3.5" /> : <FiChevronLeft className="w-3.5 h-3.5" />}
        </button>
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex sm:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in"
            onClick={() => setMobileSidebarOpen(false)}
          />

          {/* Drawer Content */}
          <aside className="relative w-72 max-w-[80vw] h-full bg-[#1e2329] shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}

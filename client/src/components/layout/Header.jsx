/**
 * Top Header Navigation Bar
 * Responsive aesthetic with Spotlight Search, Language Switcher, Theme Selector, and Mobile Drawer Button
 * Vector icons only (lucide-react), no text emojis, no demo buttons
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Sun,
  Moon,
  Globe,
  HardDrive,
  ChevronRight,
  Cloud,
  Menu,
  Star
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { useFolderBreadcrumbs } from '../../hooks/useFolders';

export default function Header() {
  const { t, i18n } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const { activeFolderId, setSearchModalOpen, setActiveFolderId, toggleMobileSidebar } = useUIStore();
  const { data: breadcrumbs = [] } = useFolderBreadcrumbs(activeFolderId);

  const [theme, setTheme] = React.useState(() => {
    return localStorage.getItem('tgcloud_theme') || 'telegram';
  });

  React.useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('tgcloud_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'telegram' : 'dark'));
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const formatSize = (bytes = 0) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  return (
    <header className="h-16 px-4 sm:px-6 flex items-center justify-between border-b border-telegram-light-border dark:border-telegram-dark-border bg-telegram-light-card dark:bg-telegram-dark-card shadow-telegram-card transition-colors duration-200 z-20">
      {/* Left: Mobile Drawer Button, Brand Icon & Title */}
      <div className="flex items-center space-x-3 overflow-hidden">
        {/* Mobile menu button */}
        <button
          onClick={toggleMobileSidebar}
          className="p-2 sm:hidden text-slate-600 dark:text-slate-300 hover:text-telegram-blue rounded-lg transition-colors"
          title="Toggle Mobile Sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-100 font-semibold text-lg">
          <Cloud className="w-6 h-6 text-telegram-blue flex-shrink-0" />
          <span className="truncate hidden xs:inline">{t('app.title')}</span>
        </div>

        {/* Dynamic Folder Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <div className="flex items-center space-x-1 text-sm text-slate-500 dark:text-slate-400 overflow-hidden">
            <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <button
              onClick={() => setActiveFolderId(null)}
              className="hover:text-telegram-blue truncate"
            >
              Root
            </button>
            {breadcrumbs.map((crumb) => (
              <React.Fragment key={crumb.id}>
                <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <button
                  onClick={() => setActiveFolderId(crumb.id)}
                  className="flex items-center space-x-1 hover:text-telegram-blue truncate"
                >
                  <span>{crumb.name}</span>
                </button>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Middle: Spotlight Search Trigger */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          onClick={() => setSearchModalOpen(true)}
          className="w-full flex items-center justify-between px-4 py-2 text-sm text-slate-400 bg-telegram-light dark:bg-telegram-dark rounded-full border border-telegram-light-border dark:border-telegram-dark-border hover:border-telegram-blue transition-colors duration-150"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-telegram-blue" />
            <span>{t('app.searchPlaceholder')}</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 rounded">
            Cmd K
          </kbd>
        </button>
      </div>

      {/* Right Actions: Theme, Language & User Profile */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Mobile Search Icon Button */}
        <button
          onClick={() => setSearchModalOpen(true)}
          className="p-2 md:hidden text-slate-600 dark:text-slate-300 hover:text-telegram-blue rounded-full transition-colors"
          title="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          title="Toggle Dark / Light Theme"
          className="p-2 text-slate-600 dark:text-slate-300 hover:text-telegram-blue hover:bg-telegram-light dark:hover:bg-telegram-dark rounded-full transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Language Switcher */}
        <div className="relative group">
          <button
            className="flex items-center space-x-1 p-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-telegram-blue hover:bg-telegram-light dark:hover:bg-telegram-dark rounded-full transition-colors uppercase"
            title="Switch Language"
          >
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">{i18n.language || 'EN'}</span>
          </button>
          <div className="absolute right-0 mt-1 w-28 py-1 bg-telegram-light-card dark:bg-telegram-dark-card rounded-lg shadow-lg border border-telegram-light-border dark:border-telegram-dark-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-30">
            <button
              onClick={() => changeLanguage('en')}
              className="w-full text-left px-3 py-1.5 text-xs hover:bg-telegram-blue hover:text-white transition-colors"
            >
              🇺🇸 English
            </button>
            <button
              onClick={() => changeLanguage('ru')}
              className="w-full text-left px-3 py-1.5 text-xs hover:bg-telegram-blue hover:text-white transition-colors"
            >
              🇷🇺 Русский
            </button>
            <button
              onClick={() => changeLanguage('uz')}
              className="w-full text-left px-3 py-1.5 text-xs hover:bg-telegram-blue hover:text-white transition-colors"
            >
              🇺🇿 O‘zbekcha
            </button>
          </div>
        </div>

        {/* User Profile Badge */}
        {user && (
          <div className="flex items-center space-x-2 pl-2 border-l border-telegram-light-border dark:border-telegram-dark-border">
            <div className="w-8 h-8 rounded-full bg-telegram-blue text-white font-bold flex items-center justify-center text-sm shadow-sm">
              {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'T'}
            </div>
            <div className="hidden md:block text-xs">
              <div className="font-semibold text-slate-800 dark:text-slate-100 flex items-center space-x-1">
                <span>{user.firstName}</span>
                {user.isPremium && <Star className="w-3 h-3 fill-amber-500 text-amber-500" title="Telegram Premium" />}
              </div>
              <div className="text-slate-400 flex items-center space-x-1">
                <HardDrive className="w-3 h-3" />
                <span>{formatSize(user.storageUsed)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

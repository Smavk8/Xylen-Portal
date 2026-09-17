import React, { useState, useRef, useEffect } from 'react';
import { Menu, User, Sun, Moon, Globe, LogOut, UserCheck } from 'lucide-react';
import { Language, ThemeMode } from '../types';
import { t } from '../utils/translations';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
  userName?: string;
  theme: ThemeMode;
  onToggleTheme: () => void;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  onOpenProfile?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileSidebar,
  userName = 'Avazbek Ismatullayev',
  theme,
  onToggleTheme,
  language,
  onSelectLanguage,
  onOpenProfile,
  onLogout,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      id="app-header"
      className="h-16 bg-white dark:bg-[#0c213d] border-b border-slate-200 dark:border-[#183a69] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-colors duration-200"
    >
      {/* Left side: mobile hamburger menu */}
      <div className="flex items-center gap-3">
        <button
          id="mobile-menu-button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Right side: Language, Theme, and Howdy Avazbek Ismatullayev! */}
      <div className="flex items-center gap-2 sm:gap-4 ml-auto">
        {/* Language Toggle (RU / EN) */}
        <div
          id="language-selector"
          className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-200/80 dark:border-slate-700/80 text-xs font-semibold"
          title={language === 'ru' ? 'Выбрать язык: Русский / English' : 'Select language: Russian / English'}
        >
          <div className="px-1.5 py-1 text-slate-400 dark:text-slate-400 hidden sm:flex items-center">
            <Globe className="w-3.5 h-3.5" />
          </div>
          <button
            id="lang-btn-ru"
            onClick={() => onSelectLanguage('ru')}
            className={`px-2.5 py-1 rounded-md transition-all text-xs ${
              language === 'ru'
                ? 'bg-white dark:bg-slate-700 text-[#15437a] dark:text-blue-300 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            RU
          </button>
          <button
            id="lang-btn-en"
            onClick={() => onSelectLanguage('en')}
            className={`px-2.5 py-1 rounded-md transition-all text-xs ${
              language === 'en'
                ? 'bg-white dark:bg-slate-700 text-[#15437a] dark:text-blue-300 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            EN
          </button>
        </div>

        {/* Dark / Light Mode Toggle */}
        <button
          id="theme-mode-toggle"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? t('lightMode', language) : t('darkMode', language)}
          title={theme === 'dark' ? t('lightMode', language) : t('darkMode', language)}
          className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg border border-slate-200/80 dark:border-slate-700/80 transition-all flex items-center justify-center cursor-pointer group"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 group-hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300 transition-transform duration-200 group-hover:-rotate-12" />
          )}
        </button>

        {/* Vertical separator */}
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-0.5 hidden sm:block" />

        {/* Exact Screenshot Styling: "Howdy Avazbek Ismatullayev!" + Avatar with popup */}
        <div className="relative flex items-center gap-2.5" ref={menuRef}>
          <div className="text-[13.5px] font-normal text-slate-800 dark:text-slate-200 select-none">
            Howdy <span className="font-semibold text-slate-900 dark:text-white">{userName}!</span>
          </div>

          {/* User Avatar Circle Button */}
          <button
            id="user-profile-badge"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-8 h-8 rounded-full bg-[#15437a] text-white flex items-center justify-center shadow-xs cursor-pointer hover:opacity-95 ring-2 ring-transparent hover:ring-blue-400 transition-all shrink-0"
            title={`${userName} (QA Lead)`}
            aria-expanded={isMenuOpen}
          >
            <User className="w-4 h-4 text-white" />
          </button>

          {/* Screenshot 10 Exact Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 top-11 w-44 bg-white dark:bg-[#0f284a] rounded-xl border border-slate-200 dark:border-[#183a69] shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenProfile?.();
                }}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-[#15437a] dark:text-blue-400" />
                <span>View Profile</span>
              </button>

              <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onLogout?.();
                }}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};


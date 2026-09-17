import React, { useState } from 'react';
import {
  Home,
  Users,
  Folder,
  Package,
  Signal,
  BarChart2,
  Ticket,
  ChevronDown,
  X,
  Activity,
} from 'lucide-react';
import { NavigationTab, Language } from '../types';
import { XylenLogo } from './XylenLogo';
import { t } from '../utils/translations';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  language: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile,
  language,
}) => {
  // Accordion open states
  const [simMenuOpen, setSimMenuOpen] = useState(true);
  const [reportsMenuOpen, setReportsMenuOpen] = useState(true);

  const isSimActive =
    currentTab === 'sim_list' ||
    currentTab === 'sim_assignments' ||
    currentTab === 'sim_submissions' ||
    currentTab === 'sim_required';

  const isReportsActive = currentTab === 'report_forecast';

  const handleNavClick = (tab: NavigationTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-[#0c213d] border-r border-slate-200 dark:border-[#183a69] flex flex-col transition-all duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-200 dark:border-[#183a69] flex items-center justify-between bg-white dark:bg-[#0c213d]">
          <button
            onClick={() => handleNavClick('dashboard')}
            className="text-left focus:outline-none cursor-pointer"
          >
            <XylenLogo />
          </button>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {/* 1. Dashboard */}
          <button
            id="nav-item-dashboard"
            onClick={() => handleNavClick('dashboard')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-md text-[14px] font-medium transition-colors cursor-pointer ${
              currentTab === 'dashboard'
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <span className="w-5 h-5 flex items-center justify-center text-rose-500">
              <Home className="w-4 h-4" />
            </span>
            <span>{t('dashboard', language)}</span>
          </button>

          {/* 2. Users */}
          <button
            id="nav-item-users"
            onClick={() => handleNavClick('users')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-md text-[14px] font-medium transition-colors cursor-pointer ${
              currentTab === 'users'
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <span className="w-5 h-5 flex items-center justify-center text-purple-500">
              <Users className="w-4 h-4" />
            </span>
            <span>{t('users', language)}</span>
          </button>

          {/* 3. Projects */}
          <button
            id="nav-item-projects"
            onClick={() => handleNavClick('projects')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-md text-[14px] font-medium transition-colors cursor-pointer ${
              currentTab === 'projects'
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <span className="w-5 h-5 flex items-center justify-center text-amber-500">
              <Folder className="w-4 h-4" />
            </span>
            <span>{t('projects', language)}</span>
          </button>

          {/* 4. Inventory */}
          <button
            id="nav-item-inventory"
            onClick={() => handleNavClick('inventory')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-md text-[14px] font-medium transition-colors cursor-pointer ${
              currentTab === 'inventory'
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <span className="w-5 h-5 flex items-center justify-center text-amber-700">
              <Package className="w-4 h-4" />
            </span>
            <span>{t('inventory', language)}</span>
          </button>

          {/* 5. Sim (Accordion) */}
          <div>
            <button
              id="nav-item-sim-parent"
              onClick={() => setSimMenuOpen(!simMenuOpen)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-md text-[14px] font-medium transition-colors cursor-pointer ${
                isSimActive
                  ? 'text-slate-900 dark:text-white font-medium'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Signal className="w-4 h-4" />
                </span>
                <span>{t('sim', language)}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  simMenuOpen ? 'rotate-0' : '-rotate-90'
                }`}
              />
            </button>

            {simMenuOpen && (
              <div className="pl-9 pr-2 py-1 space-y-0.5">
                <button
                  id="nav-subitem-sims"
                  onClick={() => handleNavClick('sim_list')}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-[13.5px] transition-colors cursor-pointer ${
                    currentTab === 'sim_list'
                      ? 'text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/60 dark:bg-blue-900/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  Sims
                </button>
                <button
                  id="nav-subitem-assignments"
                  onClick={() => handleNavClick('sim_assignments')}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-[13.5px] transition-colors cursor-pointer ${
                    currentTab === 'sim_assignments'
                      ? 'text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/60 dark:bg-blue-900/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  Assignments
                </button>
                <button
                  id="nav-subitem-submissions"
                  onClick={() => handleNavClick('sim_submissions')}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-[13.5px] transition-colors cursor-pointer ${
                    currentTab === 'sim_submissions'
                      ? 'text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/60 dark:bg-blue-900/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  Submissions
                </button>
                <button
                  id="nav-subitem-sims-required"
                  onClick={() => handleNavClick('sim_required')}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-[13.5px] transition-colors cursor-pointer ${
                    currentTab === 'sim_required'
                      ? 'text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/60 dark:bg-blue-900/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  Sims Required
                </button>
              </div>
            )}
          </div>

          {/* 6. Reports (Accordion) */}
          <div>
            <button
              id="nav-item-reports-parent"
              onClick={() => setReportsMenuOpen(!reportsMenuOpen)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-md text-[14px] font-medium transition-colors cursor-pointer ${
                isReportsActive
                  ? 'text-slate-900 dark:text-white font-medium'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 flex items-center justify-center text-teal-600 dark:text-teal-400">
                  <BarChart2 className="w-4 h-4" />
                </span>
                <span>Reports</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  reportsMenuOpen ? 'rotate-0' : '-rotate-90'
                }`}
              />
            </button>

            {reportsMenuOpen && (
              <div className="pl-9 pr-2 py-1 space-y-0.5">
                <button
                  id="nav-subitem-forecast"
                  onClick={() => handleNavClick('report_forecast')}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-[13.5px] transition-colors cursor-pointer ${
                    currentTab === 'report_forecast'
                      ? 'text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/60 dark:bg-blue-900/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  Forecast Report
                </button>
              </div>
            )}
          </div>

          {/* 7. CDRs (Between Reports and Tickets) */}
          <button
            id="nav-item-cdrs"
            onClick={() => handleNavClick('cdrs')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-md text-[14px] font-medium transition-colors cursor-pointer ${
              currentTab === 'cdrs' || currentTab === 'minute_telemetry'
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-5 h-5 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Activity className="w-4 h-4" />
              </span>
              <span>{t('cdrs', language)}</span>
            </div>
            <span className="text-[9px] font-extrabold bg-emerald-100 dark:bg-emerald-900/80 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
              LIVE
            </span>
          </button>

          {/* 8. Tickets */}
          <button
            id="nav-item-tickets"
            onClick={() => handleNavClick('tickets')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-md text-[14px] font-medium transition-colors cursor-pointer ${
              currentTab === 'tickets'
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <span className="w-5 h-5 flex items-center justify-center text-orange-500">
              <Ticket className="w-4 h-4" />
            </span>
            <span>{t('tickets', language)}</span>
          </button>
        </nav>

        {/* Footer info in sidebar */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500 text-center">
          {t('version', language)}
        </div>
      </aside>
    </>
  );
};

import React from 'react';
import { X, Mail, Phone, MapPin, Globe, LogOut } from 'lucide-react';
import { Language } from '../../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  language?: Language;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onLogout,
  language = 'ru',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#0f284a] rounded-2xl border border-slate-200 dark:border-[#183a69] shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Banner */}
        <div className="bg-[#15437a] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white text-[#15437a] flex items-center justify-center font-black text-xl shadow-lg ring-4 ring-white/20">
              AI
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold leading-tight">Avazbek Ismatullayev</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-400 text-slate-950 uppercase tracking-wide">
                  QA Lead
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">Xylen Telecom Testing & Fleet QA Management</p>
              <div className="flex items-center gap-2 mt-2 text-[11px] text-emerald-300 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active Session • portal.xylen.net</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6 space-y-5 text-xs text-slate-700 dark:text-slate-200">
          
          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50 dark:bg-[#09182d] p-4 rounded-xl border border-slate-200 dark:border-[#183a69]">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email</div>
                <div className="font-semibold text-slate-900 dark:text-white">avazbek@xylen.net</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Phone</div>
                <div className="font-mono font-semibold text-slate-900 dark:text-white">+998 90 123 45 67</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Location</div>
                <div className="font-semibold text-slate-900 dark:text-white">Tashkent, Uzbekistan</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-purple-500 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Timezone</div>
                <div className="font-semibold text-slate-900 dark:text-white">UTC+5 (Asia/Tashkent)</div>
              </div>
            </div>
          </div>

          {/* Managed Projects & Role Badges */}
          <div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Supervised Client Projects
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-lg text-xs font-bold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                ● Ucell Roaming QA
              </span>
              <span className="px-3 py-1 rounded-lg text-xs font-bold bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                ● Uz Mobile Fleet Testing
              </span>
              <span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                ● NOC Level 2 Dispatcher
              </span>
            </div>
          </div>

          {/* Key Fleet Stats */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#09182d] border border-slate-200 dark:border-[#183a69]">
              <div className="text-base font-black text-slate-900 dark:text-white">201</div>
              <div className="text-[10px] text-slate-500 font-medium">Active SIMs</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#09182d] border border-slate-200 dark:border-[#183a69]">
              <div className="text-base font-black text-emerald-600 dark:text-emerald-400">44</div>
              <div className="text-[10px] text-slate-500 font-medium">Field Testers</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#09182d] border border-slate-200 dark:border-[#183a69]">
              <div className="text-base font-black text-blue-600 dark:text-blue-400">100%</div>
              <div className="text-[10px] text-slate-500 font-medium">Admin Access</div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 dark:bg-[#0c213d] px-6 py-4 border-t border-slate-200 dark:border-[#183a69] flex items-center justify-between">
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Session</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#15437a] hover:bg-[#113560] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

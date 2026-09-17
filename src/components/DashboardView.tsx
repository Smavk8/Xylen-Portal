import React from 'react';
import {
  Target,
  CreditCard,
  Ban,
  Ticket,
  Tag,
  UserCheck,
  Calendar,
  Layers,
} from 'lucide-react';
import { SimItem, ProjectItem, TicketItem, Language } from '../types';
import { t } from '../utils/translations';

interface DashboardViewProps {
  sims: SimItem[];
  projects: ProjectItem[];
  tickets: TicketItem[];
  onNavigateToTab?: (tab: any) => void;
  language?: Language;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  sims,
  projects,
  tickets,
  onNavigateToTab,
  language = 'ru',
}) => {
  const openTicketsCount = tickets.filter((t) => t.status === 'Open').length;

  return (
    <div id="dashboard-view" className="space-y-6 pb-10">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
          <span>👋</span> {t('helloUser', language)}
        </h1>
        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {t('updatedDate', language)}
        </div>
      </div>

      {/* 4 Metric Cards Matching Screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Achieved Target */}
        <div
          id="card-achieved-target"
          className="bg-white dark:bg-[#0f284a] rounded-xl border border-slate-200/90 dark:border-[#183a69] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[13px] font-medium text-slate-500 dark:text-slate-400">
                {t('achievedTarget', language)}
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                  37.52%
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {t('currentMonth', language)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Active SIMs */}
        <div
          id="card-active-sims"
          className="bg-white dark:bg-[#0f284a] rounded-xl border border-slate-200/90 dark:border-[#183a69] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[13px] font-medium text-slate-500 dark:text-slate-400">
                {t('activeSims', language)}
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                  201
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  / 7 not assigned
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Target Not Achieved */}
        <div
          id="card-target-not-achieved"
          className="bg-white dark:bg-[#0f284a] rounded-xl border border-slate-200/90 dark:border-[#183a69] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-900/40 text-rose-500 dark:text-rose-400 flex items-center justify-center shrink-0">
              <Ban className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[13px] font-medium text-slate-500 dark:text-slate-400">
                {t('targetNotAchieved', language)}
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                  118
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {t('fromAssignedSims', language)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Open SIM Tickets */}
        <div
          id="card-open-tickets"
          className="bg-white dark:bg-[#0f284a] rounded-xl border border-slate-200/90 dark:border-[#183a69] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onNavigateToTab?.('tickets')}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[13px] font-medium text-slate-500 dark:text-slate-400">
                {t('openSimTickets', language)}
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                  0
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {t('pending', language)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Main Analytical Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel: Project Performance (MB) - Column Chart */}
        <div
          id="panel-project-performance"
          className="lg:col-span-7 bg-white dark:bg-[#0f284a] rounded-xl border border-slate-200/90 dark:border-[#183a69] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between"
        >
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-[#183a69] gap-2">
              <div>
                <h2 className="text-[16px] font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <span className="text-blue-600">📊</span> {t('projectPerformanceTitle', language)}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t('projectPerformanceSubtitle', language)}
                </p>
              </div>

              {/* Legend matching screenshot */}
              <div className="flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3 rounded-xs bg-[#0066ff]" />
                  <span>{t('achievedMb', language)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3 rounded-xs bg-slate-300 dark:bg-slate-600" />
                  <span>{t('remainingMb', language)}</span>
                </div>
              </div>
            </div>

            {/* Vertical Stacked Bar Chart */}
            <div className="mt-6 relative h-80 flex">
              {/* Y Axis Labels */}
              <div className="w-20 pr-3 flex flex-col justify-between text-[11px] text-slate-400 dark:text-slate-400 text-right select-none font-mono py-1">
                <span>9 000 000</span>
                <span>8 000 000</span>
                <span>7 000 000</span>
                <span>6 000 000</span>
                <span>5 000 000</span>
                <span>4 000 000</span>
                <span>3 000 000</span>
                <span>2 000 000</span>
                <span>1 000 000</span>
                <span>0</span>
              </div>

              {/* Chart Grid & Columns Area */}
              <div className="flex-1 relative flex flex-col justify-between border-l border-b border-slate-200 dark:border-slate-700">
                {/* Horizontal Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="w-full border-t border-slate-100 dark:border-slate-800"
                    />
                  ))}
                </div>

                {/* Y-axis label */}
                <span className="absolute -left-7 top-1/2 -rotate-90 text-[10px] text-slate-400 font-medium">
                  MB
                </span>

                {/* Bars Container */}
                <div className="relative z-10 h-full flex items-end justify-around px-8 pt-6">
                  {/* Ucell Bar */}
                  <div className="w-40 flex flex-col items-center group">
                    {/* Top Total Badge */}
                    <span className="text-[11.5px] font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                      8.4M (47%)
                    </span>
                    {/* Stacked Pillar */}
                    <div className="w-full h-64 rounded-t-sm overflow-hidden flex flex-col justify-end shadow-xs">
                      {/* Remaining (Grey) */}
                      <div
                        className="w-full bg-slate-200 dark:bg-slate-600 transition-all"
                        style={{ height: '53%' }}
                        title="Remaining: 4.5M MB"
                      />
                      {/* Achieved (Blue) */}
                      <div
                        className="w-full bg-[#0066ff] flex items-center justify-center text-xs font-bold text-white transition-all shadow-inner"
                        style={{ height: '47%' }}
                        title="Achieved: 3.9M MB"
                      >
                        3.9M
                      </div>
                    </div>
                    {/* X Axis Label */}
                    <span className="mt-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Ucell
                    </span>
                  </div>

                  {/* Uz Mobile Bar */}
                  <div className="w-40 flex flex-col items-center group">
                    {/* Top Total Badge */}
                    <span className="text-[11.5px] font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                      7.2M (30%)
                    </span>
                    {/* Stacked Pillar */}
                    <div className="w-full h-54 rounded-t-sm overflow-hidden flex flex-col justify-end shadow-xs">
                      {/* Remaining (Grey) */}
                      <div
                        className="w-full bg-slate-200 dark:bg-slate-600 transition-all"
                        style={{ height: '70%' }}
                        title="Remaining: 5.1M MB"
                      />
                      {/* Achieved (Blue) */}
                      <div
                        className="w-full bg-[#0066ff] flex items-center justify-center text-xs font-bold text-white transition-all shadow-inner"
                        style={{ height: '30%' }}
                        title="Achieved: 2.1M MB"
                      >
                        2.1M
                      </div>
                    </div>
                    {/* X Axis Label */}
                    <span className="mt-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Uz Mobile
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: SIM Status Overview */}
        <div
          id="panel-sim-status-overview"
          className="lg:col-span-5 bg-white dark:bg-[#0f284a] rounded-xl border border-slate-200/90 dark:border-[#183a69] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between"
        >
          <div>
            {/* Header with 407 Total Badge */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#183a69]">
              <h2 className="text-[16px] font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <span className="text-blue-600">🗂</span> {t('simStatusOverview', language)}
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800">
                <Layers className="w-3.5 h-3.5" />
                407 Total
              </span>
            </div>

            {/* Donut Ring in Center */}
            <div className="mt-5 flex flex-col items-center justify-center">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 42 42">
                  {/* Background base */}
                  <circle
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    stroke="#e2e8f0"
                    className="dark:stroke-slate-700"
                    strokeWidth="5"
                  />
                  {/* Active (Green - dominant 60%) */}
                  <circle
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    stroke="#059669"
                    strokeWidth="5"
                    strokeDasharray="60 40"
                    strokeDashoffset="0"
                  />
                  {/* Dormant (Purple - 15%) */}
                  <circle
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    stroke="#8b5cf6"
                    strokeWidth="5"
                    strokeDasharray="15 85"
                    strokeDashoffset="-60"
                  />
                  {/* In Transit (Amber - 8%) */}
                  <circle
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    stroke="#f59e0b"
                    strokeWidth="5"
                    strokeDasharray="8 92"
                    strokeDashoffset="-75"
                  />
                  {/* Disconnection (Grey - 17%) */}
                  <circle
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    stroke="#94a3b8"
                    strokeWidth="5"
                    strokeDasharray="17 83"
                    strokeDashoffset="-83"
                  />
                </svg>
                {/* Center metric */}
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    239
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Total SIMs
                  </span>
                </div>
              </div>
            </div>

            {/* 3 Progress Bars matching screenshot */}
            <div className="mt-5 space-y-3.5">
              {/* 1. Project Rate Assigned */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1 font-medium">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <Tag className="w-3.5 h-3.5 text-cyan-600" />
                    Project Rate Assigned
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    201/201 (100%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 rounded-full"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              {/* 2. Tester Assigned */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1 font-medium">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Tester Assigned
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    194/201 (96.5%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem]"
                    style={{ width: '96.5%' }}
                  />
                </div>
              </div>

              {/* 3. Roaming Dates */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1 font-medium">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    Roaming Dates
                  </span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    141/201 (70.1%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: '70.1%' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Status Pills Cloud matching screenshot */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#183a69] flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Active: <strong>201</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Active (with issue): <strong>4</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              In Transit: <strong>2</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              Steered: <strong>1</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              Dormant: <strong>28</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Sim Issue: <strong>3</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              Disconnection: <strong>168</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

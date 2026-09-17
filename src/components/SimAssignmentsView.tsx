import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { AssignmentItem, Language } from '../types';
import { t } from '../utils/translations';

interface SimAssignmentsViewProps {
  assignments: AssignmentItem[];
  language?: Language;
}

export const SimAssignmentsView: React.FC<SimAssignmentsViewProps> = ({
  assignments,
  language = 'ru',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAssignments = useMemo(() => {
    if (!searchQuery.trim()) return assignments;
    const q = searchQuery.toLowerCase();
    return assignments.filter(
      (a) =>
        a.testerName.toLowerCase().includes(q) ||
        a.mno.toLowerCase().includes(q) ||
        a.mobileNumber.toLowerCase().includes(q) ||
        a.simNumber.toLowerCase().includes(q)
    );
  }, [assignments, searchQuery]);

  const totalResults = 194;
  const totalPages = Math.ceil(totalResults / pageSize);
  const paginatedAssignments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAssignments.slice(start, start + pageSize);
  }, [filteredAssignments, currentPage, pageSize]);

  const formatMB = (val: number) => {
    return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div id="sim-assignments-view" className="space-y-4">
      {/* Search Toolbar */}
      <div className="bg-white dark:bg-[#0f284a] p-4 rounded-lg border border-slate-200 dark:border-[#183a69] flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-64">
            <input
              type="text"
              placeholder={language === 'ru' ? 'Поиск назначений...' : 'Search assignments...'}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-9 pl-3 pr-8 rounded-md border border-slate-300 dark:border-[#1c457c] text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white dark:bg-[#08172c] text-slate-800 dark:text-white placeholder-slate-400"
            />
          </div>

          <button
            id="btn-search-assignments"
            className="h-9 px-4 bg-[#15437a] hover:bg-[#123660] text-white text-sm font-medium rounded-md transition-colors shadow-xs cursor-pointer"
          >
            {t('search', language)}
          </button>

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="h-9 px-2 rounded-md border border-slate-300 dark:border-[#1c457c] text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white dark:bg-[#08172c] text-slate-700 dark:text-slate-200"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-[#0f284a] rounded-lg border border-slate-200 dark:border-[#183a69] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#15437a] dark:bg-[#0c203b] text-white font-semibold select-none">
                <th className="py-3 px-3 w-8 text-center">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-white/70 mx-auto" />
                </th>
                <th className="py-3 px-3">{t('colTester', language)}</th>
                <th className="py-3 px-3">{t('colMno', language)}</th>
                <th className="py-3 px-3 font-mono">{t('colMobileNumber', language)}</th>
                <th className="py-3 px-3 font-mono">{t('colSimNumber', language)}</th>
                <th className="py-3 px-3 text-center">{t('colTestDays', language)}</th>
                <th className="py-3 px-3 text-center">{t('colBreakDays', language)}</th>
                <th className="py-3 px-3">{t('roamingStartDate', language)}</th>
                <th className="py-3 px-3">{t('roamingEndDate', language)}</th>
                <th className="py-3 px-3 text-right">{t('colDailyTarget', language)}</th>
                <th className="py-3 px-3 text-center">{t('colStatus', language)}</th>
                <th className="py-3 px-4 min-w-[200px]">Monthly Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-[#183a69]">
              {paginatedAssignments.map((a, index) => {
                const percent = Math.min(
                  100,
                  Math.round((a.submittedMB / (a.monthlyTargetMB || 1)) * 100)
                );

                return (
                  <tr
                    key={a.id}
                    className={`transition-colors hover:bg-blue-50/40 dark:hover:bg-blue-900/20 ${
                      index % 2 === 1 ? 'bg-slate-50/40 dark:bg-[#0c1f38]' : 'bg-white dark:bg-[#0f284a]'
                    }`}
                  >
                    <td className="py-3 px-3 text-center text-slate-400 dark:text-slate-500 font-bold">
                      {a.id}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {a.testerName}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {a.mno}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {a.mobileNumber}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {a.simNumber}
                    </td>
                    <td className="py-3 px-3 text-center font-medium text-slate-700 dark:text-slate-300">
                      {a.testDays}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-500 dark:text-slate-400">
                      {a.breakDays}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {a.startDate}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {a.endDate}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {a.dailyTargetMB.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        Active
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="text-[11px] font-mono text-slate-700 dark:text-slate-300 font-semibold">
                          {formatMB(a.submittedMB)} / {formatMB(a.monthlyTargetMB)} MB
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              percent >= 80
                                ? 'bg-emerald-500'
                                : percent >= 40
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.max(5, percent)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3.5 border-t border-slate-200 dark:border-[#183a69] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalResults)} of 227 results
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="w-7 h-7 rounded border border-slate-300 dark:border-[#1c457c] flex items-center justify-center text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              &lt;
            </button>

            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded text-xs font-medium transition-colors cursor-pointer ${
                  currentPage === page
                    ? 'bg-blue-600 text-white font-bold'
                    : 'border border-slate-300 dark:border-[#1c457c] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {page}
              </button>
            ))}
            <span className="px-1 text-slate-400">...</span>
            <button
              onClick={() => setCurrentPage(22)}
              className="w-7 h-7 rounded border border-slate-300 dark:border-[#1c457c] text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
            >
              22
            </button>
            <button
              onClick={() => setCurrentPage(23)}
              className="w-7 h-7 rounded border border-slate-300 dark:border-[#1c457c] text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
            >
              23
            </button>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-7 h-7 rounded border border-slate-300 dark:border-[#1c457c] flex items-center justify-center text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { RotateCcw } from 'lucide-react';
import { SubmissionItem, Language } from '../types';
import { t } from '../utils/translations';

interface SimSubmissionsViewProps {
  submissions: SubmissionItem[];
  onViewSubmission: (sub: SubmissionItem) => void;
  language?: Language;
}

export const SimSubmissionsView: React.FC<SimSubmissionsViewProps> = ({
  submissions,
  onViewSubmission,
  language = 'ru',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((s) => {
      const q = searchQuery.toLowerCase();
      const matchesQuery =
        !q ||
        s.testerName.toLowerCase().includes(q) ||
        s.mno.toLowerCase().includes(q) ||
        s.mobileNumber.toLowerCase().includes(q) ||
        s.comments.toLowerCase().includes(q);

      const matchesDateFrom = !dateFrom || s.date >= dateFrom;
      const matchesDateTo = !dateTo || s.date <= dateTo;

      return matchesQuery && matchesDateFrom && matchesDateTo;
    });
  }, [submissions, searchQuery, dateFrom, dateTo]);

  const totalResults = filteredSubmissions.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));
  const paginatedSubmissions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSubmissions.slice(start, start + pageSize);
  }, [filteredSubmissions, currentPage, pageSize]);

  const handleReset = () => {
    setSearchQuery('');
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);
  };

  return (
    <div id="sim-submissions-view" className="space-y-4">
      {/* Title */}
      <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
        Assignment Submissions
      </h1>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-[#0f284a] p-4 rounded-lg border border-slate-200 dark:border-[#183a69] flex flex-wrap items-center gap-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Type here to search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-9 pl-3 pr-3 rounded-md border border-slate-300 dark:border-[#1c457c] text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white dark:bg-[#08172c] text-slate-800 dark:text-white placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Select the date from"
            onFocus={(e) => (e.target.type = 'date')}
            onBlur={(e) => {
              if (!e.target.value) e.target.type = 'text';
            }}
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="h-9 px-3 rounded-md border border-slate-300 dark:border-[#1c457c] text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white dark:bg-[#08172c] text-slate-700 dark:text-slate-200 w-44"
          />
          <input
            type="text"
            placeholder="Select the date to"
            onFocus={(e) => (e.target.type = 'date')}
            onBlur={(e) => {
              if (!e.target.value) e.target.type = 'text';
            }}
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="h-9 px-3 rounded-md border border-slate-300 dark:border-[#1c457c] text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white dark:bg-[#08172c] text-slate-700 dark:text-slate-200 w-44"
          />
        </div>

        <button
          id="btn-filter-submissions"
          className="h-9 px-4 bg-[#15437a] hover:bg-[#123660] text-white text-xs font-semibold rounded-md transition-colors shadow-xs cursor-pointer"
        >
          Filter
        </button>

        <button
          onClick={handleReset}
          className="h-9 px-4 bg-slate-500 hover:bg-slate-600 text-white text-xs font-semibold rounded-md transition-colors shadow-xs cursor-pointer"
        >
          Reset
        </button>

        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="h-9 px-3 rounded-md border border-slate-300 dark:border-[#1c457c] text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white dark:bg-[#08172c] text-slate-700 dark:text-slate-200 ml-auto"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-[#0f284a] rounded-lg border border-slate-200 dark:border-[#183a69] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-white dark:bg-[#0f284a] text-slate-800 dark:text-white font-bold border-b border-slate-200 dark:border-[#183a69] select-none">
                <th className="py-3 px-3 w-10 text-center">#</th>
                <th className="py-3 px-3">Tester Name</th>
                <th className="py-3 px-3">Project Name</th>
                <th className="py-3 px-3">MNO</th>
                <th className="py-3 px-3">Mobile number</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3 text-right">MB Used</th>
                <th className="py-3 px-3">Comments</th>
                <th className="py-3 px-3 text-center">Test Complete</th>
                <th className="py-3 px-3">Data Session</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-[#183a69]">
              {paginatedSubmissions.map((s, index) => (
                <tr
                  key={s.id}
                  className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                >
                  <td className="py-2.5 px-3 text-center text-slate-500 font-bold">
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                    {s.testerName}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 whitespace-nowrap font-medium">
                    {s.projectName}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                    {s.mno}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {s.mobileNumber}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {s.date}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                    {s.mbUsed.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                    {s.comments}
                  </td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    <button
                      onClick={() => onViewSubmission(s)}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                    >
                      View
                    </button>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px] font-mono whitespace-nowrap">
                    {s.dataSession || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar matching Screenshot 8 */}
        <div className="p-3.5 border-t border-slate-200 dark:border-[#183a69] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, 7830)} of 7830 results
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="w-7 h-7 rounded border border-slate-300 dark:border-[#1c457c] flex items-center justify-center text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
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
                    : 'border border-slate-300 dark:border-[#1c457c] text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}
            <span className="px-1 text-slate-400">...</span>
            <button
              onClick={() => setCurrentPage(391)}
              className="w-7 h-7 rounded border border-slate-300 dark:border-[#1c457c] text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
            >
              391
            </button>
            <button
              onClick={() => setCurrentPage(392)}
              className="w-7 h-7 rounded border border-slate-300 dark:border-[#1c457c] text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
            >
              392
            </button>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-7 h-7 rounded border border-slate-300 dark:border-[#1c457c] flex items-center justify-center text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

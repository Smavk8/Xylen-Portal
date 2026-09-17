import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Eye,
  Edit2,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Wifi,
} from 'lucide-react';
import { SimItem, Language } from '../types';
import { t } from '../utils/translations';

interface SimsListViewProps {
  sims: SimItem[];
  onOpenAssignTester: () => void;
  onViewSim: (sim: SimItem) => void;
  onEditSim: (sim: SimItem) => void;
  language?: Language;
}

export const SimsListView: React.FC<SimsListViewProps> = ({
  sims,
  onOpenAssignTester,
  onViewSim,
  onEditSim,
  language = 'ru',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [projectFilter, setProjectFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<keyof SimItem>('id');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Filtering
  const filteredSims = useMemo(() => {
    return sims.filter((s) => {
      const matchesSearch =
        s.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.mno.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.simNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.mobileNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tester.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesProject =
        projectFilter === 'All' || s.project === projectFilter;

      return matchesSearch && matchesProject;
    });
  }, [sims, searchQuery, projectFilter]);

  // Sorting
  const sortedSims = useMemo(() => {
    return [...filteredSims].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return 0;
    });
  }, [filteredSims, sortField, sortAsc]);

  // Pagination
  const totalResults = 407;
  const totalPages = Math.ceil(totalResults / pageSize);
  const paginatedSims = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedSims.slice(start, start + pageSize);
  }, [sortedSims, currentPage, pageSize]);

  const handleSort = (field: keyof SimItem) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedSims.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedSims.map((s) => s.id));
    }
  };

  const toggleSelectRow = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Status localization helper
  const getLocalizedStatus = (status: string) => {
    switch (status) {
      case 'Active':
        return t('statusActive', language);
      case 'Active (with issue)':
        return t('statusActiveWithIssue', language);
      case 'In Transit':
        return t('statusInTransit', language);
      case 'Steered':
        return t('statusSteered', language);
      case 'Dormant':
        return t('statusDormant', language);
      case 'Sim Issue':
        return t('statusSimIssue', language);
      case 'Disconnection':
        return t('statusDisconnection', language);
      default:
        return status;
    }
  };

  return (
    <div id="sims-list-view" className="space-y-4">
      {/* Top Action & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#0f284a] p-4 rounded-lg border border-slate-200 dark:border-[#183a69] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        {/* Left: Search + Page size */}
        <div className="flex flex-wrap items-center gap-2 flex-1 max-w-2xl">
          <div className="relative flex-1 min-w-[220px]">
            <input
              id="input-search-sims"
              type="text"
              placeholder={t('searchSimsPlaceholder', language)}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-9 pl-9 pr-3 text-sm rounded-md border border-slate-300 dark:border-[#1c457c] bg-white dark:bg-[#08172c] text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-1.5">
            <select
              id="select-project-filter"
              value={projectFilter}
              onChange={(e) => {
                setProjectFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 px-3 rounded-md border border-slate-300 dark:border-[#1c457c] text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white dark:bg-[#08172c] text-slate-700 dark:text-slate-200"
            >
              <option value="All">{t('allProjects', language)}</option>
              <option value="Uz Mobile">Uz Mobile</option>
              <option value="Ucell">Ucell</option>
            </select>
          </div>

          <button
            id="btn-search-sims"
            className="h-9 px-4 bg-[#15437a] hover:bg-[#123660] text-white text-sm font-medium rounded-md transition-colors shadow-xs cursor-pointer"
          >
            {t('search', language)}
          </button>

          <div className="flex items-center gap-1.5 ml-1">
            <select
              id="select-page-size"
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
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {/* Right: + Assign Tester button */}
        <div className="flex items-center gap-3">
          <button
            id="btn-assign-tester"
            onClick={onOpenAssignTester}
            className="h-9 px-4 bg-[#22c55e] hover:bg-[#16a34a] text-white text-sm font-semibold rounded-md flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('assignTester', language)}</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-[#0f284a] rounded-lg border border-slate-200 dark:border-[#183a69] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            {/* Navy Table Header */}
            <thead>
              <tr className="bg-[#15437a] dark:bg-[#0c203b] text-white font-semibold select-none">
                <th className="py-3 px-3 w-10 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-white/70" />
                  </div>
                </th>
                <th className="py-3 px-2 w-8 text-center">
                  <input
                    type="checkbox"
                    checked={
                      paginatedSims.length > 0 &&
                      selectedIds.length === paginatedSims.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th
                  onClick={() => handleSort('id')}
                  className="py-3 px-3 cursor-pointer hover:bg-white/10 w-10 text-center"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>#</span>
                  </div>
                </th>
                <th
                  onClick={() => handleSort('supplier')}
                  className="py-3 px-3 cursor-pointer hover:bg-white/10"
                >
                  <div className="flex items-center gap-1">
                    <span>{t('colSupplier', language)}</span>
                    <span className="text-white/60 text-[10px]">⇅</span>
                  </div>
                </th>
                <th
                  onClick={() => handleSort('project')}
                  className="py-3 px-3 cursor-pointer hover:bg-white/10"
                >
                  <div className="flex items-center gap-1">
                    <span>{t('colProject', language)}</span>
                    <span className="text-white/60 text-[10px]">⇅</span>
                  </div>
                </th>
                <th
                  onClick={() => handleSort('mno')}
                  className="py-3 px-3 cursor-pointer hover:bg-white/10"
                >
                  <div className="flex items-center gap-1">
                    <span>{t('colMno', language)}</span>
                    <span className="text-white/60 text-[10px]">⇅</span>
                  </div>
                </th>
                <th
                  onClick={() => handleSort('simNumber')}
                  className="py-3 px-3 cursor-pointer hover:bg-white/10 font-mono"
                >
                  <div className="flex items-center gap-1">
                    <span>{t('colSimNumber', language)}</span>
                    <span className="text-white/60 text-[10px]">⇅</span>
                  </div>
                </th>
                <th
                  onClick={() => handleSort('mobileNumber')}
                  className="py-3 px-3 cursor-pointer hover:bg-white/10 font-mono"
                >
                  <div className="flex items-center gap-1">
                    <span>{t('colMobileNumber', language)}</span>
                    <span className="text-white/60 text-[10px]">⇅</span>
                  </div>
                </th>
                <th
                  onClick={() => handleSort('tester')}
                  className="py-3 px-3 cursor-pointer hover:bg-white/10"
                >
                  <div className="flex items-center gap-1">
                    <span>{t('colTester', language)}</span>
                    <span className="text-white/60 text-[10px]">⇅</span>
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="py-3 px-3 cursor-pointer hover:bg-white/10"
                >
                  <div className="flex items-center gap-1">
                    <span>{t('colStatus', language)}</span>
                    <span className="text-white/60 text-[10px]">⇅</span>
                  </div>
                </th>
                <th className="py-3 px-3">
                  <span>{t('colMissing', language)}</span>
                </th>
                <th className="py-3 px-3 text-center w-24">
                  <span>{t('actions', language)}</span>
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-200 dark:divide-[#183a69]">
              {paginatedSims.map((sim, index) => {
                const isSelected = selectedIds.includes(sim.id);
                const displayIndex = (currentPage - 1) * pageSize + index + 1;

                return (
                  <tr
                    key={sim.id}
                    className={`transition-colors hover:bg-blue-50/40 dark:hover:bg-blue-900/20 ${
                      isSelected
                        ? 'bg-blue-50/70 dark:bg-blue-900/30'
                        : index % 2 === 1
                        ? 'bg-slate-50/40 dark:bg-[#0c1f38]'
                        : 'bg-white dark:bg-[#0f284a]'
                    }`}
                  >
                    {/* Filter placeholder */}
                    <td className="py-2.5 px-3 text-center text-slate-300 dark:text-slate-600">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                    </td>

                    {/* Checkbox */}
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(sim.id)}
                        className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                      />
                    </td>

                    {/* Index */}
                    <td className="py-2.5 px-3 text-center text-slate-500 dark:text-slate-400 font-medium">
                      {displayIndex}
                    </td>

                    {/* Supplier */}
                    <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {sim.supplier}
                    </td>

                    {/* Project */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {sim.project === 'Uz Mobile' ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                          Uz Mobile
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                          Ucell
                        </span>
                      )}
                    </td>

                    {/* MNO */}
                    <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {sim.mno}
                    </td>

                    {/* SIM Number */}
                    <td className="py-2.5 px-3 font-mono text-[11.5px] text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {sim.simNumber}
                    </td>

                    {/* Mobile Number + eSIM indicator */}
                    <td className="py-2.5 px-3 font-mono text-[11.5px] text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span>{sim.mobileNumber}</span>
                        {sim.isEsim && (
                          <span
                            title="eSIM Profile"
                            className="inline-flex items-center justify-center p-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                          >
                            <Wifi className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Tester */}
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {sim.tester === '-' ? (
                        <span className="text-slate-400 font-normal">-</span>
                      ) : (
                        <span className="font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                          {sim.tester}
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {sim.status === 'In Transit' ? (
                        <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                          {getLocalizedStatus(sim.status)}
                        </span>
                      ) : sim.status === 'Active' ? (
                        <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          {getLocalizedStatus(sim.status)}
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                          {getLocalizedStatus(sim.status)}
                        </span>
                      )}
                    </td>

                    {/* Missing */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {sim.missing && sim.missing.length > 0 ? (
                        <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                          {sim.missing.map((m) => (m === 'Tester' ? (language === 'ru' ? 'Тестер' : 'Tester') : m === 'Roaming Dates' ? (language === 'ru' ? 'Даты' : 'Dates') : m)).join(', ')}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onViewSim(sim)}
                          className="w-7 h-7 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                          title={t('view', language)}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditSim(sim)}
                          className="w-7 h-7 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                          title={t('edit', language)}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
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
            {language === 'ru' ? (
              <span>
                Показано {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, totalResults)} из {totalResults} записей
              </span>
            ) : (
              <span>
                Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalResults)} of {totalResults} entries
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="w-7 h-7 rounded border border-slate-300 dark:border-[#1c457c] flex items-center justify-center text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded text-xs font-medium transition-colors cursor-pointer ${
                  currentPage === page
                    ? 'bg-[#15437a] text-white'
                    : 'border border-slate-300 dark:border-[#1c457c] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {page}
              </button>
            ))}

            <span className="px-1 text-slate-400">...</span>

            {[40, 41].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded text-xs font-medium transition-colors cursor-pointer ${
                  currentPage === page
                    ? 'bg-[#15437a] text-white'
                    : 'border border-slate-300 dark:border-[#1c457c] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-7 h-7 rounded border border-slate-300 dark:border-[#1c457c] flex items-center justify-center text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

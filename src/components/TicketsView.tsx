import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, ChevronsUpDown, CheckCircle, Eye, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { TicketItem, Language } from '../types';
import { t } from '../utils/translations';

interface TicketsViewProps {
  tickets: TicketItem[];
  onCreateTicket: () => void;
  onResolveTicket: (id: string) => void;
  language?: Language;
}

export const TicketsView: React.FC<TicketsViewProps> = ({
  tickets,
  onCreateTicket,
  onResolveTicket,
  language = 'ru',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortField, setSortField] = useState<string>('id');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const filteredTickets = useMemo(() => {
    let result = tickets.filter((t) => {
      const q = searchQuery.toLowerCase();
      if (!q) return true;
      const sub = t.subject || t.title || '';
      return (
        sub.toLowerCase().includes(q) ||
        t.type?.toLowerCase().includes(q) ||
        t.createdBy?.toLowerCase().includes(q) ||
        t.id?.toLowerCase().includes(q)
      );
    });

    result.sort((a, b) => {
      const valA = (a as Record<string, any>)[sortField] || '';
      const valB = (b as Record<string, any>)[sortField] || '';
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

    return result;
  }, [tickets, searchQuery, sortField, sortAsc]);

  const totalResults = filteredTickets.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));
  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTickets.slice(start, start + pageSize);
  }, [filteredTickets, currentPage, pageSize]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div id="tickets-view" className="space-y-4">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
          {language === 'ru' ? 'Тикеты (Tickets)' : 'Tickets'}
        </h1>
      </div>

      {/* Top Filter Bar — matches Screenshot 10 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Power search box with inline Search button */}
          <div className="flex items-center bg-white dark:bg-[#0f284a] rounded-md border border-slate-300 dark:border-[#1c457c] overflow-hidden shadow-xs focus-within:ring-1 focus-within:ring-[#15437a]">
            <div className="pl-3 text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder={language === 'ru' ? 'Поиск тикетов (Power search)...' : 'Power search...'}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 px-3 text-xs focus:outline-none bg-transparent text-slate-800 dark:text-white placeholder-slate-400 w-56 sm:w-64"
            />
            <button
              id="btn-search-tickets"
              className="h-9 px-4 bg-[#15437a] hover:bg-[#123660] text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              {t('search', language)}
            </button>
          </div>

          {/* Page size dropdown */}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="h-9 px-3 rounded-md border border-slate-300 dark:border-[#1c457c] text-xs font-medium focus:outline-none bg-white dark:bg-[#0f284a] text-slate-700 dark:text-slate-200 cursor-pointer shadow-xs"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* + New Ticket Button */}
        <button
          id="btn-create-ticket"
          onClick={onCreateTicket}
          className="h-9 px-4 bg-[#15437a] hover:bg-[#123660] text-white text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer ml-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{language === 'ru' ? '+ Создать тикет' : '+ New Ticket'}</span>
        </button>
      </div>

      {/* Tickets Table — Blue Header with sort arrows */}
      <div className="bg-white dark:bg-[#0f284a] rounded-lg border border-slate-200 dark:border-[#183a69] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#15437a] dark:bg-[#0c203b] text-white font-semibold select-none">
                {/* Funnel Icon Header */}
                <th className="py-3 px-4 w-12 text-center">
                  <div className="w-6 h-6 rounded-full bg-blue-900/60 hover:bg-blue-800/80 flex items-center justify-center mx-auto cursor-pointer transition-colors" title="Filter columns">
                    <Filter className="w-3 h-3 text-white" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('subject')}
                  className="py-3 px-4 cursor-pointer hover:bg-blue-900/40 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{language === 'ru' ? 'Тема (Subject)' : 'Subject'}</span>
                    <ChevronsUpDown className="w-3.5 h-3.5 opacity-70" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('type')}
                  className="py-3 px-4 cursor-pointer hover:bg-blue-900/40 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{language === 'ru' ? 'Тип (Type)' : 'Type'}</span>
                    <ChevronsUpDown className="w-3.5 h-3.5 opacity-70" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('createdBy')}
                  className="py-3 px-4 cursor-pointer hover:bg-blue-900/40 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{language === 'ru' ? 'Создатель (Created By)' : 'Created By'}</span>
                    <ChevronsUpDown className="w-3.5 h-3.5 opacity-70" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('resolutionDate')}
                  className="py-3 px-4 cursor-pointer hover:bg-blue-900/40 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{language === 'ru' ? 'Срок решения (Resolution Date)' : 'Resolution Date'}</span>
                    <ChevronsUpDown className="w-3.5 h-3.5 opacity-70" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="py-3 px-4 cursor-pointer hover:bg-blue-900/40 transition-colors whitespace-nowrap text-center"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>{language === 'ru' ? 'Статус (Status)' : 'Status'}</span>
                    <ChevronsUpDown className="w-3.5 h-3.5 opacity-70" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('isNew')}
                  className="py-3 px-4 cursor-pointer hover:bg-blue-900/40 transition-colors whitespace-nowrap text-center"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>{language === 'ru' ? 'Новый (New)' : 'New'}</span>
                    <ChevronsUpDown className="w-3.5 h-3.5 opacity-70" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center whitespace-nowrap">
                  {language === 'ru' ? 'Действия (Actions)' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-[#183a69]">
              {paginatedTickets.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-12 text-center text-slate-400 dark:text-slate-400 text-xs italic"
                  >
                    No tickets found
                  </td>
                </tr>
              ) : (
                paginatedTickets.map((ticket, idx) => (
                  <tr
                    key={ticket.id || idx}
                    className="hover:bg-slate-50/80 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <td className="py-3 px-4 text-center text-slate-400 font-mono text-[11px]">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-white">
                      {ticket.subject || ticket.title}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {ticket.type || 'SIM Issue'}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-700 dark:text-slate-300">
                      {ticket.createdBy || ticket.tester || 'Avazbek Ismatullayev'}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                      {ticket.resolutionDate || ticket.createdAt || '-'}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold ${
                          ticket.status === 'Resolved'
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {ticket.isNew ? (
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-600" />
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        {ticket.status !== 'Resolved' && (
                          <button
                            onClick={() => onResolveTicket(ticket.id)}
                            className="p-1.5 rounded bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                            title="Resolve ticket"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          className="p-1.5 rounded bg-blue-50 dark:bg-blue-900/40 text-[#15437a] dark:text-blue-400 hover:bg-[#15437a] hover:text-white transition-colors cursor-pointer"
                          title="View ticket"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Bar */}
      <div className="flex items-center justify-end gap-3 text-xs text-slate-500 dark:text-slate-400 pt-2">
        <span>
          Showing {paginatedTickets.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
          {Math.min(currentPage * pageSize, totalResults)} of {totalResults} results
        </span>
        <div className="flex items-center gap-1">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1 rounded border border-slate-300 dark:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 py-0.5 rounded bg-[#15437a] text-white font-semibold text-xs">
            {currentPage}
          </span>
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1 rounded border border-slate-300 dark:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};


import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Eye,
  Edit2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { UserItem, Language } from '../types';
import { t } from '../utils/translations';

interface UsersViewProps {
  users: UserItem[];
  onAddUser: () => void;
  onViewUser: (user: UserItem) => void;
  onEditUser: (user: UserItem) => void;
  language?: Language;
}

export const UsersView: React.FC<UsersViewProps> = ({
  users,
  onAddUser,
  onViewUser,
  onEditUser,
  language = 'ru',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.contactNo.toLowerCase().includes(q) ||
        u.country.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  const totalResults = 44;
  const totalPages = Math.ceil(totalResults / pageSize);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  return (
    <div id="users-view" className="space-y-4">
      {/* Top Toolbar — matches Screenshot 4 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Search box with inline Search button */}
          <div className="flex items-center bg-white dark:bg-[#0f284a] rounded-md border border-slate-300 dark:border-[#1c457c] overflow-hidden shadow-xs focus-within:ring-1 focus-within:ring-[#15437a]">
            <div className="pl-3 text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder={language === 'ru' ? 'Поиск пользователей (Type here to search..)' : 'Type here to search..'}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 px-3 text-xs focus:outline-none bg-transparent text-slate-800 dark:text-white placeholder-slate-400 w-56 sm:w-64"
            />
            <button
              id="btn-search-users"
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

        {/* + Add User Button */}
        <button
          id="btn-add-user"
          onClick={onAddUser}
          className="h-9 px-4 bg-[#15437a] hover:bg-[#123660] text-white text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer ml-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{language === 'ru' ? '+ Добавить пользователя' : '+ Add User'}</span>
        </button>
      </div>

      {/* Users Table — Screenshot 4 White Header */}
      <div className="bg-white dark:bg-[#0f284a] rounded-lg border border-slate-200 dark:border-[#183a69] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-white dark:bg-[#0a1b33] text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-[#183a69] select-none">
                <th className="py-3 px-4 w-10 text-center">#</th>
                <th className="py-3 px-4">{language === 'ru' ? 'Имя' : 'Name'}</th>
                <th className="py-3 px-4">{language === 'ru' ? 'Роль' : 'Role'}</th>
                <th className="py-3 px-4 font-mono">{language === 'ru' ? 'Телефон' : 'Contact No'}</th>
                <th className="py-3 px-4">{t('colStatus', language)}</th>
                <th className="py-3 px-4">{language === 'ru' ? 'Страна' : 'Country'}</th>
                <th className="py-3 px-4 text-center">SIMs</th>
                <th className="py-3 px-4">{t('colProject', language)}</th>
                <th className="py-3 px-4 text-center w-24">{t('actions', language)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#183a69]">
              {paginatedUsers.map((user, index) => {
                const displayIndex = (currentPage - 1) * pageSize + index + 1;
                return (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <td className="py-3 px-4 text-center text-slate-400 font-mono text-[11px]">
                      {displayIndex}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {user.name}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500 text-white shadow-xs">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {user.contactNo}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-white ${
                          user.status === 'Active'
                            ? 'bg-[#16a34a]'
                            : 'bg-amber-500'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {user.country}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-400 text-slate-900 font-bold text-[11px] mx-auto shadow-xs">
                        {user.simsCount}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {user.projects.map((proj) => (
                          <span
                            key={proj}
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold text-white ${
                              proj === 'Uz Mobile'
                                ? 'bg-[#008ba3]'
                                : 'bg-[#6b46c1]'
                            }`}
                          >
                            {proj}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onViewUser(user)}
                          className="w-7 h-7 rounded bg-[#15437a] text-white hover:bg-[#123660] flex items-center justify-center transition-colors cursor-pointer"
                          title={t('view', language)}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditUser(user)}
                          className="w-7 h-7 rounded bg-[#15437a] text-white hover:bg-[#123660] flex items-center justify-center transition-colors cursor-pointer"
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

        {/* Pagination — matches Screenshot 4 */}
        <div className="p-3.5 border-t border-slate-100 dark:border-[#183a69] flex items-center justify-end gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalResults)} of {totalResults} results
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="w-7 h-7 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded text-xs font-semibold transition-colors cursor-pointer ${
                  currentPage === page
                    ? 'bg-[#15437a] text-white'
                    : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-7 h-7 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

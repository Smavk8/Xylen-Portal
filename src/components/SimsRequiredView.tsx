import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, Search } from 'lucide-react';
import { SimRequiredItem, Language } from '../types';
import { t } from '../utils/translations';

interface SimsRequiredViewProps {
  items: SimRequiredItem[];
  language?: Language;
}

export const SimsRequiredView: React.FC<SimsRequiredViewProps> = ({
  items,
  language = 'ru',
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.mno.toLowerCase().includes(q) ||
        item.assignedTo.toLowerCase().includes(q) ||
        item.tariff.toLowerCase().includes(q) ||
        item.notes.toLowerCase().includes(q)
    );
  }, [items, searchQuery]);

  return (
    <div id="sims-required-view" className="space-y-4">
      {/* Top Search Toolbar */}
      <div className="bg-white dark:bg-[#0f284a] p-4 rounded-lg border border-slate-200 dark:border-[#183a69] flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2">
          <div className="relative w-72">
            <input
              type="text"
              placeholder={language === 'ru' ? 'Поиск потребностей SIM, оператора...' : 'Search required SIMs, notes...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-3 pr-8 rounded-md border border-slate-300 dark:border-[#1c457c] text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white dark:bg-[#08172c] text-slate-800 dark:text-white placeholder-slate-400"
            />
          </div>
          <button
            id="btn-search-sims-required"
            className="h-9 px-4 bg-[#15437a] hover:bg-[#123660] text-white text-sm font-medium rounded-md transition-colors shadow-xs cursor-pointer"
          >
            {t('search', language)}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#0f284a] rounded-lg border border-slate-200 dark:border-[#183a69] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#15437a] dark:bg-[#0c203b] text-white font-semibold select-none">
                <th className="py-3 px-3 w-8 text-center">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-white/70 mx-auto" />
                </th>
                <th className="py-3 px-3">{t('colMno', language)}</th>
                <th className="py-3 px-3">{t('colAssignedLead', language)}</th>
                <th className="py-3 px-3">{language === 'ru' ? 'Тип SIM' : 'SIM Type'}</th>
                <th className="py-3 px-3">{t('colContractType', language)}</th>
                <th className="py-3 px-3">{t('colTariff', language)}</th>
                <th className="py-3 px-3">{t('colBundle', language)}</th>
                <th className="py-3 px-3">{t('colSupplier', language)}</th>
                <th className="py-3 px-3">{t('colProject', language)}</th>
                <th className="py-3 px-3 text-center">{t('colTargetSims', language)}</th>
                <th className="py-3 px-3 text-center">{t('colInStock', language)}</th>
                <th className="py-3 px-3 text-center">{t('colAcquiredInTransit', language)}</th>
                <th className="py-3 px-3 text-center">{t('colPendingDeficit', language)}</th>
                <th className="py-3 px-3 min-w-[320px]">{t('colNotes', language)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-[#183a69]">
              {filteredItems.map((item, index) => (
                <tr
                  key={item.id}
                  className={`transition-colors hover:bg-slate-50 dark:hover:bg-blue-900/20 ${
                    index % 2 === 1 ? 'bg-slate-50/40 dark:bg-[#0c1f38]' : 'bg-white dark:bg-[#0f284a]'
                  }`}
                >
                  <td className="py-3 px-3 text-center text-slate-400 font-bold">
                    {item.id}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                    {item.mno}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-bold text-white ${
                        item.assignedTo === 'Amaan Hussain'
                          ? 'bg-[#e11d48]'
                          : item.assignedTo === 'Xylen'
                          ? 'bg-[#0891b2]'
                          : 'bg-[#2563eb]'
                      }`}
                    >
                      {item.assignedTo}
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white ${
                        item.simType === 'eSIM' ? 'bg-[#10b981]' : 'bg-[#2563eb]'
                      }`}
                    >
                      {item.simType}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {item.contractPrepaid}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium">
                      {item.tariff || '—'}
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium">
                      {item.roamingBundle || '—'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                    {item.suppliers || '—'}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white ${
                        item.project === 'Uz Mobile' ? 'bg-[#0284c7]' : 'bg-[#7c3aed]'
                      }`}
                    >
                      {item.project}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-slate-800 dark:text-slate-200">
                    {item.target}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-slate-800 dark:text-slate-200">
                    {item.inStock}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-slate-800 dark:text-slate-200">
                    {item.acquiredInTr}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-slate-800 dark:text-slate-200">
                    {item.pending}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300 text-xs leading-relaxed max-w-xl">
                    {item.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

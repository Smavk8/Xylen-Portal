import React, { useState, useMemo } from 'react';
import { Plus, Search, RotateCcw, Edit2, Trash2 } from 'lucide-react';
import { DeviceItem, Language } from '../types';
import { t } from '../utils/translations';

interface InventoryViewProps {
  devices: DeviceItem[];
  onAddDevice: () => void;
  onEditDevice: (device: DeviceItem) => void;
  onDeleteDevice: (id: number) => void;
  language?: Language;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  devices,
  onAddDevice,
  onEditDevice,
  onDeleteDevice,
  language = 'ru',
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDevices = useMemo(() => {
    if (!searchQuery.trim()) return devices;
    const q = searchQuery.toLowerCase();
    return devices.filter(
      (d) =>
        d.imei.toLowerCase().includes(q) ||
        d.make.toLowerCase().includes(q) ||
        d.model.toLowerCase().includes(q) ||
        d.testerName.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q)
    );
  }, [devices, searchQuery]);

  return (
    <div id="inventory-view" className="space-y-5">
      {/* Title & Action Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
          {language === 'ru' ? 'Реестр устройств (Inventory List)' : 'Inventory List'}
        </h1>
        <button
          id="btn-add-device"
          onClick={onAddDevice}
          className="h-9 px-5 bg-[#15437a] hover:bg-[#123660] text-white text-xs font-semibold rounded-full flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <span>{language === 'ru' ? 'Добавить устройство' : 'Add device'}</span>
        </button>
      </div>

      {/* Search & Reset Bar — matches Screenshot 2 */}
      <div className="flex items-center gap-0 max-w-xl bg-white dark:bg-[#0f284a] rounded-md border border-slate-300 dark:border-[#1c457c] overflow-hidden shadow-xs">
        <input
          type="text"
          placeholder={language === 'ru' ? 'Поиск по IMEI, модели, марке, тестеру...' : 'Search by IMEI, Model, Make, Tester...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 h-9 px-3 text-xs focus:outline-none bg-transparent text-slate-800 dark:text-white placeholder-slate-400"
        />
        <button
          id="btn-search-devices"
          className="h-9 px-4 bg-[#15437a] hover:bg-[#123660] text-white text-xs font-semibold transition-colors cursor-pointer"
        >
          {t('search', language)}
        </button>
        <button
          id="btn-reset-devices"
          onClick={() => setSearchQuery('')}
          className="h-9 px-4 bg-[#4a5568] hover:bg-[#3d4655] text-white text-xs font-semibold transition-colors cursor-pointer"
        >
          {t('reset', language)}
        </button>
      </div>

      {/* Table — Screenshot 2 White Header */}
      <div className="bg-white dark:bg-[#0f284a] rounded-lg border border-slate-200 dark:border-[#183a69] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-white dark:bg-[#0a1b33] text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-[#183a69] select-none">
                <th className="py-3 px-3 w-10 text-center">#</th>
                <th className="py-3 px-3">{language === 'ru' ? 'Тип устройства' : 'Device Type'}</th>
                <th className="py-3 px-3">{language === 'ru' ? 'Производитель' : 'Make'}</th>
                <th className="py-3 px-3">{language === 'ru' ? 'Модель' : 'Model'}</th>
                <th className="py-3 px-3 font-mono">IMEI</th>
                <th className="py-3 px-3 text-center">{language === 'ru' ? 'SIM слоты' : 'SIM Slots'}</th>
                <th className="py-3 px-3">{language === 'ru' ? 'Владение' : 'Ownership'}</th>
                <th className="py-3 px-3">{language === 'ru' ? 'Имя тестера' : 'Tester Name'}</th>
                <th className="py-3 px-3">{language === 'ru' ? 'Страна' : 'Country'}</th>
                <th className="py-3 px-3 text-center">{t('actions', language)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#183a69]">
              {filteredDevices.map((d, index) => (
                <tr
                  key={d.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <td className="py-3 px-3 text-center text-slate-400 font-mono text-[11px]">
                    {index + 1}
                  </td>
                  <td className="py-3 px-3 font-normal text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {d.deviceType}
                  </td>
                  <td className="py-3 px-3 font-normal text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {d.make}
                  </td>
                  <td className="py-3 px-3 font-normal text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {d.model}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {d.imei}
                  </td>
                  <td className="py-3 px-3 text-center font-normal text-slate-700 dark:text-slate-300">
                    {d.simSlots}
                  </td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {d.ownership}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="text-blue-600 hover:underline cursor-pointer font-medium">
                      {d.testerName}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {d.country}
                  </td>
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onEditDevice(d)}
                        className="w-7 h-7 rounded bg-[#15437a] text-white hover:bg-[#123660] flex items-center justify-center transition-colors cursor-pointer"
                        title={t('edit', language)}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteDevice(d.id)}
                        className="w-7 h-7 rounded bg-rose-500 text-white hover:bg-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                        title={language === 'ru' ? 'Удалить' : 'Delete'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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

import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { DeviceItem, UserItem } from '../../types';

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserItem[];
  onAdd: (device: Omit<DeviceItem, 'id'>) => void;
}

export const AddDeviceModal: React.FC<AddDeviceModalProps> = ({
  isOpen,
  onClose,
  users,
  onAdd,
}) => {
  const [deviceType, setDeviceType] = useState('Mobile');
  const [make, setMake] = useState('Xiaomi');
  const [model, setModel] = useState('Redmi Note 12');
  const [imei, setImei] = useState('867034057691234');
  const [simSlots, setSimSlots] = useState(2);
  const [ownership, setOwnership] = useState<'Personal' | 'Company'>('Personal');
  const [testerName, setTesterName] = useState(users[0]?.name || 'Mirzobek Jabbarganov');
  const [country, setCountry] = useState('Uzbekistan');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imei.trim()) return;
    onAdd({
      deviceType,
      make,
      model,
      imei,
      simSlots,
      ownership,
      testerName,
      country,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full overflow-hidden">
        <div className="bg-[#15437a] text-white px-5 py-4 flex items-center justify-between">
          <h2 className="text-base font-bold">Add New Device</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Device Type
              </label>
              <select
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm focus:ring-1 focus:ring-blue-600 focus:outline-none"
              >
                <option value="Mobile">Mobile</option>
                <option value="Tablet">Tablet</option>
                <option value="Modem/Router">Modem/Router</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Ownership
              </label>
              <select
                value={ownership}
                onChange={(e) => setOwnership(e.target.value as any)}
                className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm focus:ring-1 focus:ring-blue-600 focus:outline-none"
              >
                <option value="Personal">Personal</option>
                <option value="Company">Company</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Make
              </label>
              <input
                type="text"
                value={make}
                onChange={(e) => setMake(e.target.value)}
                placeholder="e.g. Samsung"
                className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm focus:ring-1 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Model
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. Galaxy A54"
                className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm focus:ring-1 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              IMEI Number
            </label>
            <input
              type="text"
              value={imei}
              onChange={(e) => setImei(e.target.value)}
              placeholder="15-digit IMEI"
              className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm focus:ring-1 focus:ring-blue-600 focus:outline-none font-mono"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                SIM Slots
              </label>
              <input
                type="number"
                value={simSlots}
                onChange={(e) => setSimSlots(Number(e.target.value))}
                min={1}
                max={4}
                className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm focus:ring-1 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm focus:ring-1 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Assigned Tester
            </label>
            <select
              value={testerName}
              onChange={(e) => setTesterName(e.target.value)}
              className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm focus:ring-1 focus:ring-blue-600 focus:outline-none"
            >
              {users.map((u) => (
                <option key={u.id} value={u.name}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md bg-[#15437a] hover:bg-[#123660] text-white text-sm font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>Save Device</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

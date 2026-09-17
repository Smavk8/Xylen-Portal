import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { SimItem, UserItem } from '../../types';

interface SimDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  sim: SimItem | null;
  mode: 'view' | 'edit';
  users: UserItem[];
  onSave: (updatedSim: SimItem) => void;
}

export const SimDetailModal: React.FC<SimDetailModalProps> = ({
  isOpen,
  onClose,
  sim,
  mode,
  users,
  onSave,
}) => {
  if (!isOpen || !sim) return null;

  const [status, setStatus] = useState(sim.status);
  const [tester, setTester] = useState(sim.tester);
  const [tariff, setTariff] = useState(sim.tariff || '');
  const [roamingDates, setRoamingDates] = useState(sim.roamingDates || '');
  const [notes, setNotes] = useState(sim.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const missing: string[] = [];
    if (tester === '-') missing.push('Tester');
    if (!roamingDates || roamingDates === 'Pending confirmation') missing.push('Roaming Dates');

    onSave({
      ...sim,
      status,
      tester,
      tariff,
      roamingDates,
      notes,
      missing,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden">
        <div className="bg-[#15437a] text-white px-5 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold">
              {mode === 'edit' ? 'Edit SIM Card' : 'SIM Card Details'}
            </h2>
            <p className="text-xs text-blue-100 font-mono">
              #{sim.id} • {sim.mno} ({sim.project})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">SIM Number (ICCID)</span>
              <span className="font-mono font-bold text-slate-800 text-[12px]">{sim.simNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Mobile MSISDN</span>
              <span className="font-mono font-bold text-slate-800 text-[12px]">{sim.mobileNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Supplier</span>
              <span className="font-semibold text-slate-700">{sim.supplier}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Type</span>
              <span className="font-semibold text-slate-700">{sim.isEsim ? 'eSIM Profile' : 'Physical Plastic SIM'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                disabled={mode === 'view'}
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm focus:ring-1 focus:ring-blue-600 focus:outline-none disabled:bg-slate-100"
              >
                <option value="Active">Active</option>
                <option value="In Transit">In Transit</option>
                <option value="Active (with issue)">Active (with issue)</option>
                <option value="Steered">Steered</option>
                <option value="Dormant">Dormant</option>
                <option value="Sim Issue">Sim Issue</option>
                <option value="Disconnection">Disconnection</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Assigned Tester
              </label>
              <select
                disabled={mode === 'view'}
                value={tester}
                onChange={(e) => setTester(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm focus:ring-1 focus:ring-blue-600 focus:outline-none disabled:bg-slate-100"
              >
                <option value="-">- Not Assigned -</option>
                {users.map((u) => (
                  <option key={u.id} value={u.name}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tariff / Plan
              </label>
              <input
                type="text"
                disabled={mode === 'view'}
                value={tariff}
                onChange={(e) => setTariff(e.target.value)}
                placeholder="e.g. Tim Basic 7.99"
                className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm focus:ring-1 focus:ring-blue-600 focus:outline-none disabled:bg-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Roaming Dates
              </label>
              <input
                type="text"
                disabled={mode === 'view'}
                value={roamingDates}
                onChange={(e) => setRoamingDates(e.target.value)}
                placeholder="e.g. 2026-09-10 - 2026-09-24"
                className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm focus:ring-1 focus:ring-blue-600 focus:outline-none disabled:bg-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Internal Operational Notes
            </label>
            <textarea
              disabled={mode === 'view'}
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add supplier notes, APN configuration, or Upwork contract IDs..."
              className="w-full p-2.5 rounded-md border border-slate-300 text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none disabled:bg-slate-100"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>
            {mode === 'edit' && (
              <button
                type="submit"
                className="px-5 py-2 rounded-md bg-[#15437a] hover:bg-[#123660] text-white text-sm font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Check className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

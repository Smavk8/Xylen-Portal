import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { UserItem, SimItem } from '../../types';

interface AssignTesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserItem[];
  sims: SimItem[];
  onAssign: (data: {
    testerName: string;
    simId: number;
    testDays: number;
    breakDays: number;
    startDate: string;
    endDate: string;
    dailyTargetMB: number;
  }) => void;
}

export const AssignTesterModal: React.FC<AssignTesterModalProps> = ({
  isOpen,
  onClose,
  users,
  sims,
  onAssign,
}) => {
  const [selectedTester, setSelectedTester] = useState(users[0]?.name || '');
  const [selectedSimId, setSelectedSimId] = useState<number>(sims[0]?.id || 1);
  const [testDays, setTestDays] = useState(15);
  const [breakDays, setBreakDays] = useState(15);
  const [startDate, setStartDate] = useState('2026-09-15');
  const [endDate, setEndDate] = useState('2026-09-30');
  const [dailyTargetMB, setDailyTargetMB] = useState(10240);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAssign({
      testerName: selectedTester,
      simId: selectedSimId,
      testDays,
      breakDays,
      startDate,
      endDate,
      dailyTargetMB,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-[#15437a] text-white px-5 py-4 flex items-center justify-between">
          <h2 className="text-base font-bold">Assign Tester to SIM</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Select Tester
            </label>
            <select
              value={selectedTester}
              onChange={(e) => setSelectedTester(e.target.value)}
              className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm focus:ring-1 focus:ring-blue-600 focus:outline-none"
              required
            >
              {users.map((u) => (
                <option key={u.id} value={u.name}>
                  {u.name} ({u.role} - {u.country})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Select SIM Card
            </label>
            <select
              value={selectedSimId}
              onChange={(e) => setSelectedSimId(Number(e.target.value))}
              className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm focus:ring-1 focus:ring-blue-600 focus:outline-none font-mono"
              required
            >
              {sims.map((s) => (
                <option key={s.id} value={s.id}>
                  #{s.id} - {s.mno} ({s.mobileNumber}) [{s.project}]
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm focus:ring-1 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm focus:ring-1 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Test Days
              </label>
              <input
                type="number"
                value={testDays}
                onChange={(e) => setTestDays(Number(e.target.value))}
                className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm focus:ring-1 focus:ring-blue-600 focus:outline-none"
                min={1}
                max={31}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Break Days
              </label>
              <input
                type="number"
                value={breakDays}
                onChange={(e) => setBreakDays(Number(e.target.value))}
                className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm focus:ring-1 focus:ring-blue-600 focus:outline-none"
                min={0}
                max={30}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Daily MB
              </label>
              <input
                type="number"
                value={dailyTargetMB}
                onChange={(e) => setDailyTargetMB(Number(e.target.value))}
                className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm focus:ring-1 focus:ring-blue-600 focus:outline-none"
                step={512}
                required
              />
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs text-slate-600">
            Estimated Monthly Target:{' '}
            <strong className="text-slate-900 font-bold">
              {(testDays * dailyTargetMB).toLocaleString()} MB
            </strong>
          </div>

          {/* Footer Buttons */}
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
              className="px-5 py-2 rounded-md bg-[#22c55e] hover:bg-[#16a34a] text-white text-sm font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>Confirm Assignment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

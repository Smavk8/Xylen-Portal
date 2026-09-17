import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { TicketItem } from '../../types';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (ticket: TicketItem) => void;
}

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [title, setTitle] = useState('');
  const [mno, setMno] = useState('Tim Italia');
  const [tester, setTester] = useState('Avazbek Ismatullayev');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('High');
  const [description, setDescription] = useState('');

  const [type, setType] = useState('Data Stall');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTicket: TicketItem = {
      id: `TICK-${Math.floor(100 + Math.random() * 900)}`,
      subject: title,
      title,
      type,
      createdBy: tester,
      resolutionDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      isNew: true,
      mno,
      tester,
      priority,
      status: 'Open',
      createdAt: 'Just now',
      description,
    };

    onAdd(newTicket);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full overflow-hidden">
        <div className="bg-[#15437a] text-white px-5 py-4 flex items-center justify-between">
          <h2 className="text-base font-bold">Create New SIM Ticket</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Issue Summary
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Roaming data stall during handover"
              className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm focus:ring-1 focus:ring-blue-600 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Carrier / MNO
              </label>
              <input
                type="text"
                value={mno}
                onChange={(e) => setMno(e.target.value)}
                placeholder="e.g. Tim Italia"
                className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm focus:ring-1 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm focus:ring-1 focus:ring-blue-600 focus:outline-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Detailed Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe APN behavior, RSRP readings, failure codes..."
              className="w-full p-2.5 rounded-md border border-slate-300 text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
              required
            />
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
              <span>Submit Ticket</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

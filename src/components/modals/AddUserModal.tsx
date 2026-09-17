import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { UserItem } from '../../types';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (user: Omit<UserItem, 'id' | 'simsCount'>) => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<'Tester' | 'Manager' | 'Admin'>('Tester');
  const [contactNo, setContactNo] = useState('+998');
  const [status, setStatus] = useState<'Onboarding' | 'Active'>('Active');
  const [country, setCountry] = useState('Uzbekistan');
  const [projects, setProjects] = useState<string[]>(['Ucell', 'Uz Mobile']);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      name,
      role,
      contactNo,
      status,
      country,
      projects,
    });
    onClose();
  };

  const toggleProject = (p: string) => {
    if (projects.includes(p)) {
      setProjects(projects.filter((item) => item !== p));
    } else {
      setProjects([...projects, p]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full overflow-hidden">
        <div className="bg-[#15437a] text-white px-5 py-4 flex items-center justify-between">
          <h2 className="text-base font-bold">Add New User</h2>
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
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jasur Alimov"
              className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm focus:ring-1 focus:ring-blue-600 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm focus:ring-1 focus:ring-blue-600 focus:outline-none"
              >
                <option value="Tester">Tester</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm focus:ring-1 focus:ring-blue-600 focus:outline-none"
              >
                <option value="Active">Active</option>
                <option value="Onboarding">Onboarding</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Contact Number
              </label>
              <input
                type="text"
                value={contactNo}
                onChange={(e) => setContactNo(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm focus:ring-1 focus:ring-blue-600 focus:outline-none font-mono"
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
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Assigned Projects
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={projects.includes('Ucell')}
                  onChange={() => toggleProject('Ucell')}
                  className="rounded text-blue-600"
                />
                <span>Ucell</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={projects.includes('Uz Mobile')}
                  onChange={() => toggleProject('Uz Mobile')}
                  className="rounded text-blue-600"
                />
                <span>Uz Mobile</span>
              </label>
            </div>
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
              <span>Save User</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React from 'react';
import { X, DollarSign, CheckCircle } from 'lucide-react';
import { ProjectItem } from '../../types';

interface RatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectItem | null;
}

export const RatesModal: React.FC<RatesModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  if (!isOpen || !project) return null;

  const mockRates = [
    { mno: 'Tim Italia', bundle: 'TIM in Viaggio Pass XL', ratePerMB: '$0.0028', dailyLimit: '15,360 MB', currency: 'EUR' },
    { mno: 'Vodafone Australia', bundle: '200GB medium sim only', ratePerMB: '$0.0035', dailyLimit: '10,240 MB', currency: 'AUD' },
    { mno: 'Free Mobile France', bundle: 'Free Max plan (Unlimited)', ratePerMB: '$0.0019', dailyLimit: '20,480 MB', currency: 'EUR' },
    { mno: 'Celcom Digi Malaysia', bundle: 'Digi Postpaid Roam 30GB', ratePerMB: '$0.0042', dailyLimit: '3,072 MB', currency: 'MYR' },
    { mno: 'Telus Canada', bundle: 'Peace of Mind Unlimited Can-US-Intl', ratePerMB: '$0.0050', dailyLimit: '10,240 MB', currency: 'CAD' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-2xl w-full overflow-hidden">
        <div className="bg-[#15437a] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded bg-white/20 flex items-center justify-center font-bold text-sm">
              $
            </span>
            <div>
              <h2 className="text-base font-bold">{project.name} Rates & Tariffs</h2>
              <p className="text-xs text-blue-100">
                Current roaming settlement agreements and billing caps
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between text-xs bg-slate-50 p-3 rounded border border-slate-200">
            <div>
              <span className="text-slate-500">Project Status:</span>{' '}
              <span className="font-bold text-emerald-700">{project.status}</span>
            </div>
            <div>
              <span className="text-slate-500">Monthly Volume Target:</span>{' '}
              <span className="font-bold text-slate-900 font-mono">
                {project.totalTargetMB.toLocaleString()} MB
              </span>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold">
                  <th className="py-2.5 px-3">MNO Partner</th>
                  <th className="py-2.5 px-3">Tariff / Bundle</th>
                  <th className="py-2.5 px-3">Settlement Rate</th>
                  <th className="py-2.5 px-3">Daily Test Cap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {mockRates.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{r.mno}</td>
                    <td className="py-2.5 px-3 text-slate-600">{r.bundle}</td>
                    <td className="py-2.5 px-3 font-mono font-medium text-emerald-700">
                      {r.ratePerMB} / MB ({r.currency})
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-700">{r.dailyLimit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-[#15437a] text-white text-sm font-semibold hover:bg-[#123660] transition-colors shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

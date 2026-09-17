import React from 'react';
import { X, CheckCircle2, Radio, Smartphone, Activity } from 'lucide-react';
import { SubmissionItem } from '../../types';

interface SubmissionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: SubmissionItem | null;
}

export const SubmissionDetailModal: React.FC<SubmissionDetailModalProps> = ({
  isOpen,
  onClose,
  submission,
}) => {
  if (!isOpen || !submission) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden">
        <div className="bg-[#15437a] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold">Verified Test Submission</h2>
              <p className="text-xs text-blue-100">
                #{submission.id} • {submission.date}
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

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-md border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Tester</span>
              <span className="font-bold text-slate-800 text-sm">
                {submission.testerName}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Project</span>
              <span className="font-bold text-blue-700 text-sm">
                {submission.projectName}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">MNO Carrier</span>
              <span className="font-semibold text-slate-700">
                {submission.mno}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">MSISDN</span>
              <span className="font-mono font-semibold text-slate-700">
                {submission.mobileNumber}
              </span>
            </div>
          </div>

          <div className="border border-emerald-200 bg-emerald-50/60 p-4 rounded-md flex items-center justify-between">
            <div>
              <div className="text-xs text-emerald-800 font-semibold uppercase tracking-wider">
                Volume Transferred
              </div>
              <div className="text-2xl font-extrabold text-emerald-950 font-mono">
                {submission.mbUsed.toLocaleString('en-US', { minimumFractionDigits: 2 })} MB
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Radio & Session Telemetry
            </div>
            <div className="bg-slate-900 text-slate-200 p-3 rounded text-[11px] font-mono leading-relaxed space-y-1">
              <div>STATUS: PDP Context Active (QCI: 9)</div>
              <div>ATTACH_RAT: E-UTRAN LTE Band 3 (1800 MHz)</div>
              <div>RSRP: -88 dBm | RSRQ: -9 dB | SINR: 18 dB</div>
              <div>CORE_APN: internet.telecom.roam</div>
              <div>DNS_RESOLVE: Success (RTT 32ms)</div>
            </div>
          </div>

          {submission.comments && (
            <div>
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tester Notes
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700">
                {submission.comments}
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-[#15437a] text-white text-sm font-semibold hover:bg-[#123660] transition-colors shadow-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { Info, RotateCcw } from 'lucide-react';
import { ForecastRateItem, Language } from '../types';
import { t } from '../utils/translations';

interface ForecastReportViewProps {
  rates: ForecastRateItem[];
  language?: Language;
}

export const ForecastReportView: React.FC<ForecastReportViewProps> = ({
  rates,
  language = 'ru',
}) => {
  const [selectedProject, setSelectedProject] = useState<string>('All Projects');

  const filteredRates = useMemo(() => {
    if (selectedProject === 'All Projects') return rates;
    return rates.filter((r) => r.project === selectedProject);
  }, [rates, selectedProject]);

  const totalMonthlyTarget = 15052348.0;
  const totalActualSubmissions = 5978476.4;
  const totalAchievedPercent = 39.72;

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div id="forecast-report-view" className="space-y-6">
      {/* Top Banner & Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Info Banner matching Screenshot 6 */}
        <div className="lg:col-span-8 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border-l-4 border-blue-600 dark:border-blue-500 p-4.5 flex items-start gap-3 shadow-xs">
          <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
            i
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Forecast Overview Report
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              This report projects revenue based on configured project rates multiplied by daily targets, aggregated to provide an estimated monthly target. These values are indicative and may vary from actual performance.
            </p>
          </div>
        </div>

        {/* Right: Monthly Target Highlight Card with Green Border */}
        <div className="lg:col-span-4 bg-white dark:bg-[#0f284a] rounded-xl border-2 border-emerald-500 p-4 shadow-xs flex flex-col justify-center">
          <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
            MONTHLY TARGET
          </div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5 font-mono">
            {formatNumber(totalMonthlyTarget)} MB
          </div>
          <div className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-1">
            {formatNumber(totalActualSubmissions)} / {formatNumber(totalMonthlyTarget)} MB ({totalAchievedPercent}%)
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-3">
        <div className="relative w-64">
          <input
            type="text"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full h-9 px-3 rounded-md border border-slate-300 dark:border-[#1c457c] text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white dark:bg-[#08172c] text-slate-800 dark:text-white"
          />
        </div>

        <button
          id="btn-filter-forecast"
          className="h-9 px-6 bg-[#15437a] hover:bg-[#123660] text-white text-xs font-bold rounded-md transition-colors shadow-xs cursor-pointer"
        >
          Filter
        </button>

        <button
          id="btn-clear-forecast"
          onClick={() => setSelectedProject('All Projects')}
          className="h-9 px-6 bg-slate-600 hover:bg-slate-700 text-white text-xs font-bold rounded-md transition-colors shadow-xs cursor-pointer"
        >
          Clear
        </button>
      </div>

      {/* Project Table Container matching Screenshot 6 */}
      <div className="bg-white dark:bg-[#0f284a] rounded-xl border border-slate-200 dark:border-[#183a69] overflow-hidden shadow-xs">
        {/* Project Section Heading */}
        <div className="p-4 border-b border-slate-200 dark:border-[#183a69]">
          <h3 className="text-sm font-black text-blue-700 dark:text-blue-400">
            {selectedProject === 'All Projects' ? 'Ucell' : selectedProject}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-white dark:bg-[#0f284a] text-slate-800 dark:text-white font-bold border-b border-slate-200 dark:border-[#183a69] select-none">
                <th className="py-3 px-4">Rate (MNO)</th>
                <th className="py-3 px-4 text-center">Active SIMs</th>
                <th className="py-3 px-4 text-right">Target Per SIM (MB)</th>
                <th className="py-3 px-4 text-right">Monthly Target (MB)</th>
                <th className="py-3 px-4 text-right">Actual Submissions (MB)</th>
                <th className="py-3 px-4 text-right">Difference (MB)</th>
                <th className="py-3 px-4 min-w-[200px]">Achieved MB (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#183a69]">
              {filteredRates.map((r) => {
                return (
                  <tr
                    key={r.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {r.mno}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-800 dark:text-slate-200">
                      {r.activeSims}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {r.targetPerSimMB.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {r.monthlyTargetMB.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {r.actualSubmissionsMB.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {r.differenceMB.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {r.achievedPercent.toFixed(1)}%
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {r.actualSubmissionsMB.toLocaleString()}.00 / {r.monthlyTargetMB.toLocaleString()}.00 MB
                        </span>
                      </div>
                      <div className="w-full h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            r.achievedPercent >= 80
                              ? 'bg-emerald-500'
                              : r.achievedPercent >= 40
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.max(2, Math.min(100, r.achievedPercent))}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

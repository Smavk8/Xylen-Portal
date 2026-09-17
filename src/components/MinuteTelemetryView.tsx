import React, { useState, useMemo } from 'react';
import {
  Radio,
  ChevronRight,
  ArrowLeft,
  Search,
  Clock,
  Smartphone,
  CheckCircle2,
  Database,
  Send,
  Code2,
  Copy,
  Check,
  Zap,
  Activity,
  User,
  Sparkles,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { MinuteTelemetryRecord, TelemetryOperatorNode, TelemetryTesterNode, Language } from '../types';
import {
  INITIAL_TELEMETRY_OPERATORS,
  INITIAL_TELEMETRY_TESTERS,
  INITIAL_TELEMETRY_RECORDS,
} from '../data/telemetryData';

interface MinuteTelemetryViewProps {
  language?: Language;
}

export const MinuteTelemetryView: React.FC<MinuteTelemetryViewProps> = ({
  language = 'ru',
}) => {
  // Navigation drill-down state:
  // null = Level 1 (Operators list)
  // 'Ucell' = Level 2 (Testers list for operator)
  // Level 3 = selectedTester is set (Minute-by-minute table)
  const [selectedOperator, setSelectedOperator] = useState<string | null>(null);
  const [selectedTester, setSelectedTester] = useState<TelemetryTesterNode | null>(null);

  // Search & Filter
  const [operatorSearch, setOperatorSearch] = useState('');
  const [testerSearch, setTesterSearch] = useState('');
  const [recordSearch, setRecordSearch] = useState('');

  // Telemetry Datasets state (allows real-time insertion/simulation)
  const [operators, setOperators] = useState<TelemetryOperatorNode[]>(INITIAL_TELEMETRY_OPERATORS);
  const [testersMap, setTestersMap] = useState<Record<string, TelemetryTesterNode[]>>(INITIAL_TELEMETRY_TESTERS);
  const [recordsMap, setRecordsMap] = useState<Record<string, MinuteTelemetryRecord[]>>(INITIAL_TELEMETRY_RECORDS);

  // Modals & Drawers
  const [isApiGuideOpen, setIsApiGuideOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [jsonDetailRecord, setJsonDetailRecord] = useState<MinuteTelemetryRecord | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Simulator Form State
  const [simUsage, setSimUsage] = useState<number>(8.5);
  const [simNetwork, setSimNetwork] = useState<string>('Ucell (LTE)');
  const [simComments, setSimComments] = useState<string>('Automated minute telemetry ping');

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Filtered Operators (Level 1)
  const filteredOperators = useMemo(() => {
    const q = operatorSearch.toLowerCase().trim();
    if (!q) return operators;
    return operators.filter(
      (op) =>
        op.mno.toLowerCase().includes(q) ||
        op.country.toLowerCase().includes(q) ||
        op.project.toLowerCase().includes(q)
    );
  }, [operators, operatorSearch]);

  // Filtered Testers for Selected Operator (Level 2)
  const currentTesters = useMemo(() => {
    if (!selectedOperator) return [];
    const list = testersMap[selectedOperator] || [];
    const q = testerSearch.toLowerCase().trim();
    if (!q) return list;
    return list.filter(
      (t) =>
        t.testerName.toLowerCase().includes(q) ||
        t.mobileNo.includes(q) ||
        t.userEmail.toLowerCase().includes(q) ||
        t.imsiNo.includes(q)
    );
  }, [selectedOperator, testersMap, testerSearch]);

  // Records for Selected Tester (Level 3)
  const currentRecords = useMemo(() => {
    if (!selectedTester) return [];
    const list = recordsMap[selectedTester.mobileNo] || [];
    const q = recordSearch.toLowerCase().trim();
    if (!q) return list;
    return list.filter(
      (r) =>
        r.mobile_no.includes(q) ||
        r.date_time.toLowerCase().includes(q) ||
        r.connected_network.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
    );
  }, [selectedTester, recordsMap, recordSearch]);

  // Metrics for current tester session
  const sessionStats = useMemo(() => {
    if (!currentRecords.length) return { totalMB: 0, avgMB: 0, count: 0 };
    const total = currentRecords.reduce((acc, r) => acc + r.usage_pm, 0);
    return {
      totalMB: Number(total.toFixed(2)),
      avgMB: Number((total / currentRecords.length).toFixed(2)),
      count: currentRecords.length,
    };
  }, [currentRecords]);

  // Add simulated minute ping
  const handleSendSimulatedPing = () => {
    if (!selectedTester) return;

    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const dateTimeStr = `${day}.${month}.${year} ${hours}:${minutes}`;
    const createdAtStr = `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;

    const newRecord: MinuteTelemetryRecord = {
      id: `sim-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user_email: selectedTester.userEmail,
      mobile_no: selectedTester.mobileNo,
      imsi_no: selectedTester.imsiNo,
      usage_pm: Number(simUsage) || 8.2,
      date_time: dateTimeStr,
      connected_network: simNetwork,
      created_at: createdAtStr,
    };

    // Update records map
    setRecordsMap((prev) => {
      const existing = prev[selectedTester.mobileNo] || [];
      return {
        ...prev,
        [selectedTester.mobileNo]: [newRecord, ...existing],
      };
    });

    // Update tester node stats
    if (selectedOperator) {
      setTestersMap((prev) => {
        const list = prev[selectedOperator] || [];
        return {
          ...prev,
          [selectedOperator]: list.map((t) =>
            t.mobileNo === selectedTester.mobileNo
              ? {
                  ...t,
                  recordsCount: t.recordsCount + 1,
                  totalUsageMB: Number((t.totalUsageMB + newRecord.usage_pm).toFixed(2)),
                  lastPingTime: dateTimeStr,
                  currentNetwork: simNetwork,
                  status: 'Online',
                }
              : t
          ),
        };
      });

      // Update operator node stats
      setOperators((prev) =>
        prev.map((op) =>
          op.mno === selectedOperator
            ? {
                ...op,
                totalRecordsCount: op.totalRecordsCount + 1,
                totalUsageTodayMB: Number((op.totalUsageTodayMB + newRecord.usage_pm).toFixed(2)),
                lastActive: 'Just now',
              }
            : op
        )
      );
    }

    setIsSimulatorOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumbs & Page Action Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          {/* Breadcrumb path */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1.5 flex-wrap">
            <button
              onClick={() => {
                setSelectedOperator(null);
                setSelectedTester(null);
              }}
              className={`hover:text-blue-600 transition-colors ${
                !selectedOperator ? 'text-blue-700 font-semibold' : ''
              }`}
            >
              Операторы SIM-карт
            </button>

            {selectedOperator && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <button
                  onClick={() => setSelectedTester(null)}
                  className={`hover:text-blue-600 transition-colors ${
                    !selectedTester ? 'text-blue-700 font-semibold' : ''
                  }`}
                >
                  {selectedOperator}
                </button>
              </>
            )}

            {selectedTester && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-slate-800 font-semibold">
                  {selectedTester.testerName} ({selectedTester.mobileNo})
                </span>
              </>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-emerald-600" />
            {!selectedOperator && 'Поминутная телеметрия / Операторы SIM'}
            {selectedOperator && !selectedTester && `Оператор: ${selectedOperator}`}
            {selectedTester && `Поминутный расход: ${selectedTester.testerName}`}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {!selectedOperator &&
              'Выберите оператора связи для просмотра привязанных тестеров и анализа данных.'}
            {selectedOperator &&
              !selectedTester &&
              'Выберите связку «тестер — мобильный номер» для перехода к детальному поминутному отчету.'}
            {selectedTester &&
              `Поминутная фиксация интернет-трафика (минут на минут) для номера ${selectedTester.mobileNo}.`}
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {selectedTester && (
            <button
              onClick={() => setIsSimulatorOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Отправить тестовую минуту</span>
            </button>
          )}

          <button
            onClick={() => setIsApiGuideOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold transition-colors border border-slate-200"
          >
            <Code2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Инструкция Android / API</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LEVEL 1: LIST OF OPERATORS */}
      {/* ========================================================================= */}
      {!selectedOperator && (
        <div className="space-y-4">
          {/* Filter & Search Bar */}
          <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Поиск оператора или страны..."
                value={operatorSearch}
                onChange={(e) => setOperatorSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div className="text-xs text-slate-500 font-medium self-end sm:self-center">
              Всего операторов в реестре: <span className="font-bold text-slate-800">{filteredOperators.length}</span>
            </div>
          </div>

          {/* Operators Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredOperators.map((op) => (
              <div
                key={op.mno}
                onClick={() => setSelectedOperator(op.mno)}
                className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-lg p-4 cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span
                        className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider mb-1.5 ${
                          op.project === 'Ucell'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {op.project}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {op.mno}
                      </h3>
                      <p className="text-xs text-slate-400">{op.country}</p>
                    </div>

                    <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Radio className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="space-y-2 py-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Активных тестеров:</span>
                      <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-full">
                        {op.activeTestersCount} тестера
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Расход сегодня:</span>
                      <span className="font-bold text-emerald-600">{op.totalUsageTodayMB.toFixed(1)} MB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Поминутных записей:</span>
                      <span className="font-mono text-slate-700">{op.totalRecordsCount} логов</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>Активность: {op.lastActive}</span>
                  <span className="text-blue-600 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Выбрать <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LEVEL 2: LIST OF TESTERS FOR SELECTED OPERATOR */}
      {/* ========================================================================= */}
      {selectedOperator && !selectedTester && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedOperator(null)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-md shadow-xs transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Вернуться ко всем операторам</span>
            </button>

            <div className="relative w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Поиск тестера или номера..."
                value={testerSearch}
                onChange={(e) => setTesterSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Список «Тестер — Мобильный номер» для {selectedOperator}
                </h3>
                <p className="text-xs text-slate-500">
                  Нажмите на строку любого тестера, чтобы открыть полную поминутную таблицу.
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-600 bg-slate-200/70 px-2.5 py-1 rounded-full">
                {currentTesters.length} тестеров
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {currentTesters.map((t) => (
                <div
                  key={t.mobileNo}
                  onClick={() => setSelectedTester(t)}
                  className="p-4 hover:bg-blue-50/40 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                      {t.testerName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                          {t.testerName}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            t.status === 'Online'
                              ? 'bg-emerald-100 text-emerald-700'
                              : t.status === 'Idle'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              t.status === 'Online'
                                ? 'bg-emerald-500 animate-pulse'
                                : t.status === 'Idle'
                                ? 'bg-amber-500'
                                : 'bg-slate-400'
                            }`}
                          />
                          {t.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap font-mono">
                        <span className="font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                          {t.mobileNo}
                        </span>
                        <span>IMSI: {t.imsiNo || 'Не указан'}</span>
                        <span>Email: {t.userEmail}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 justify-between md:justify-end text-xs shrink-0">
                    <div className="text-right">
                      <div className="text-slate-400 text-[11px]">Текущая сеть</div>
                      <div className="font-medium text-slate-800">{t.currentNetwork}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-slate-400 text-[11px]">Использовано сегодня</div>
                      <div className="font-bold text-emerald-600 text-sm">{t.totalUsageMB} MB</div>
                    </div>

                    <div className="text-right">
                      <div className="text-slate-400 text-[11px]">Последний пинг</div>
                      <div className="font-mono text-slate-600">{t.lastPingTime}</div>
                    </div>

                    <button className="px-3.5 py-2 bg-blue-50 text-blue-700 font-semibold rounded-md group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center gap-1">
                      <span>Минуты</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {currentTesters.length === 0 && (
                <div className="p-8 text-center text-slate-500 text-xs">
                  Для данного оператора пока нет привязанных тестеров или результат не найден.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LEVEL 3: MINUTE-BY-MINUTE TABLE */}
      {/* ========================================================================= */}
      {selectedTester && (
        <div className="space-y-4">
          {/* Back button & tester summary pill */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <button
              onClick={() => setSelectedTester(null)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-md shadow-xs transition-colors self-start"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Назад к списку тестеров ({selectedOperator})</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Фильтр по времени/сети..."
                  value={recordSearch}
                  onChange={(e) => setRecordSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={() =>
                  handleCopy(
                    JSON.stringify(currentRecords, null, 2),
                    'export-json'
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-md hover:bg-slate-50 shadow-xs"
              >
                {copiedKey === 'export-json' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Скопировано!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Экспорт JSON</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* KPI Mini-Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
              <div className="text-[11px] text-slate-500 font-medium">Мобильный номер</div>
              <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">{selectedTester.mobileNo}</div>
              <div className="text-[10px] text-slate-400 mt-1">{selectedTester.testerName}</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
              <div className="text-[11px] text-slate-500 font-medium">Суммарный расход сессии</div>
              <div className="text-sm font-bold text-emerald-600 mt-0.5">{sessionStats.totalMB} MB</div>
              <div className="text-[10px] text-slate-400 mt-1">Всего {sessionStats.count} минут зафиксировано</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
              <div className="text-[11px] text-slate-500 font-medium">Средний расход в минуту</div>
              <div className="text-sm font-bold text-blue-600 mt-0.5">{sessionStats.avgMB} MB / мин</div>
              <div className="text-[10px] text-slate-400 mt-1">Стабильный трафик</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
              <div className="text-[11px] text-slate-500 font-medium">Подключенная сеть</div>
              <div className="text-sm font-bold text-purple-700 mt-0.5">{selectedTester.currentNetwork}</div>
              <div className="text-[10px] text-emerald-600 font-medium mt-1">PDP Active • RSRP -85 dBm</div>
            </div>
          </div>

          {/* MAIN MINUTE-BY-MINUTE TABLE */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#15437a] text-white text-xs font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Мобильный номер</th>
                    <th className="py-3 px-4">Число использованных данных</th>
                    <th className="py-3 px-4">Дата и время</th>
                    <th className="py-3 px-4">Подключенный мобильный оператор</th>
                    <th className="py-3 px-4 text-right">Детали / JSON</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  {currentRecords.map((rec, idx) => (
                    <tr
                      key={rec.id || idx}
                      className="hover:bg-blue-50/50 transition-colors"
                    >
                      {/* Column 1: Мобильный номер */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                          <span>{rec.mobile_no}</span>
                        </div>
                      </td>

                      {/* Column 2: Число использованных данных (usage_pm) */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{rec.usage_pm} MB</span>
                          <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                            +{(rec.usage_pm * 1024).toFixed(0)} KB
                          </span>
                        </div>
                      </td>

                      {/* Column 3: Дата и время */}
                      <td className="py-3 px-4 font-mono text-slate-700 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-semibold">{rec.date_time}</span>
                        </div>
                      </td>

                      {/* Column 4: Подключенный мобильный оператор */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200/60">
                          <Radio className="w-3 h-3 text-blue-600" />
                          <span>{rec.connected_network}</span>
                        </span>
                      </td>

                      {/* Column 5: Actions / JSON inspection */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setJsonDetailRecord(rec)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded border border-slate-200 text-[11px] font-medium transition-colors"
                        >
                          <Code2 className="w-3 h-3" />
                          <span>Смотреть JSON</span>
                        </button>
                      </td>
                    </tr>
                  ))}

                  {currentRecords.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                        Нет поминутных записей для данного номера. Нажмите «Отправить тестовую минуту», чтобы сымитировать отправку с Android.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>
                Показано <strong className="text-slate-800">{currentRecords.length}</strong> поминутных записей
              </span>
              <span className="font-mono text-[11px]">
                Интервал дискретизации: 60 сек • Формат ISO / Local Time
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ANDROID INTEGRATION & API GUIDE */}
      {/* ========================================================================= */}
      {isApiGuideOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="bg-[#15437a] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Code2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold">Интеграция с Android APK & Документация API</h3>
              </div>
              <button
                onClick={() => setIsApiGuideOpen(false)}
                className="text-white/80 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs text-slate-700">
              {/* Question 1 Answer */}
              <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-blue-900">
                    1. Где сейчас запущен портал (URL / IP)
                  </span>
                  <span className="bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px]">
                    HTTPS / SSL Включен
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Прототип развернут на облачной инфраструктуре Google Cloud Run с доверенным SSL-сертификатом.
                  <strong> usesCleartextTraffic НЕ требуется</strong>, так как трафик передается по защищенному HTTPS.
                </p>
                <div className="bg-slate-900 text-slate-200 p-2.5 rounded font-mono text-[11px] flex items-center justify-between">
                  <span className="truncate mr-2">
                    https://ais-dev-hmmzntbr4m4iqjohwzuijq-304506612114.asia-southeast1.run.app
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(
                        'https://ais-dev-hmmzntbr4m4iqjohwzuijq-304506612114.asia-southeast1.run.app',
                        'copy-base-url'
                      )
                    }
                    className="shrink-0 px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-semibold flex items-center gap-1"
                  >
                    {copiedKey === 'copy-base-url' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>Копировать</span>
                  </button>
                </div>
              </div>

              {/* Question 2 Answer */}
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-2">
                  2. Согласованные эндпоинты телеметрии и форматы JSON
                </h4>

                {/* Endpoint A: Telemetry minute array */}
                <div className="border border-slate-200 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-600 text-white px-2 py-0.5 rounded font-bold text-[10px]">
                        POST
                      </span>
                      <span className="font-mono font-bold text-slate-800">/api/v1/telemetry/minute</span>
                    </div>
                    <span className="text-slate-500 text-[11px]">Поминутный массив</span>
                  </div>
                  <pre className="bg-slate-900 text-slate-100 p-3 rounded text-[11px] font-mono overflow-x-auto">
{`[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_email": "tester1@company.com",
    "mobile_no": "+998901234567",
    "imsi_no": "434050123456789",
    "usage_pm": 8.2,
    "date_time": "31.08.2026 18:18",
    "connected_network": "Ucell (LTE)",
    "created_at": "31.08.2026 18:19:00"
  }
]`}
                  </pre>
                </div>

                {/* Endpoint B: Heartbeat */}
                <div className="border border-slate-200 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-600 text-white px-2 py-0.5 rounded font-bold text-[10px]">
                        POST
                      </span>
                      <span className="font-mono font-bold text-slate-800">/api/v1/heartbeat</span>
                    </div>
                    <span className="text-slate-500 text-[11px]">Текущее состояние SIM и устройства</span>
                  </div>
                  <pre className="bg-slate-900 text-slate-100 p-3 rounded text-[11px] font-mono overflow-x-auto">
{`{
  "device": "Samsung Galaxy A55",
  "battery": 85,
  "wifi_ssid": "Office_5G",
  "sim_slot": 1,
  "carrier": "Ucell",
  "network_type": "5G",
  "is_roaming": false,
  "phone_number": "+998901234567",
  "iccid": "8999...",
  "imsi": "43405...",
  "private_key": "KEY_...",
  "today_mobile_bytes": 104857600,
  "today_roaming_bytes": 0,
  "today_wifi_bytes": 524288000
}`}
                  </pre>
                </div>

                {/* Endpoint C: Batch Record */}
                <div className="border border-slate-200 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-600 text-white px-2 py-0.5 rounded font-bold text-[10px]">
                        POST
                      </span>
                      <span className="font-mono font-bold text-slate-800">/api/v1/telemetry/record</span>
                    </div>
                    <span className="text-slate-500 text-[11px]">Пакетная выгрузка delta_bytes</span>
                  </div>
                  <pre className="bg-slate-900 text-slate-100 p-3 rounded text-[11px] font-mono overflow-x-auto">
{`{
  "telemetry": [
    {
      "private_key": "KEY_123",
      "timestamp": 1726588800000,
      "carrier": "Ucell",
      "network_type": "Mobile",
      "delta_bytes": 45120,
      "total_day_bytes": 104857600
    }
  ]
}`}
                  </pre>
                </div>
              </div>

              {/* Question 3 Answer */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
                <span className="font-bold text-sm text-amber-900">
                  3. Авторизация и заголовок API-ключа
                </span>
                <p className="text-amber-800 leading-relaxed">
                  Для быстрого старта на этапе тестирования доступ открыт (без блокировки по ключу). Для защиты
                  продакшена поддерживаются заголовки:
                </p>
                <div className="bg-slate-900 text-amber-200 p-2.5 rounded font-mono text-[11px]">
                  X-Portal-Api-Key: xylen_live_qa_2026<br />
                  Authorization: Bearer xylen_live_qa_2026
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsApiGuideOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-md transition-colors"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: SIMULATOR / INJECT TEST TELEMETRY */}
      {/* ========================================================================= */}
      {isSimulatorOpen && selectedTester && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#15437a] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold">Симуляция Android Ping</h3>
              </div>
              <button
                onClick={() => setIsSimulatorOpen(false)}
                className="text-white/80 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Тестер & Мобильный номер</label>
                <div className="p-2.5 bg-slate-100 rounded font-mono font-bold text-slate-800">
                  {selectedTester.testerName} • {selectedTester.mobileNo}
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Объем данных за минуту (usage_pm в MB)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={simUsage}
                  onChange={(e) => setSimUsage(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Подключенный мобильный оператор (connected_network)
                </label>
                <select
                  value={simNetwork}
                  onChange={(e) => setSimNetwork(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 font-medium"
                >
                  <option value="Ucell (LTE)">Ucell (LTE)</option>
                  <option value="Ucell (5G NSA)">Ucell (5G NSA)</option>
                  <option value="Uz Mobile (LTE Band 3)">Uz Mobile (LTE Band 3)</option>
                  <option value="Uz Mobile (5G)">Uz Mobile (5G)</option>
                  <option value="TIM (LTE Band 20)">TIM (LTE Band 20)</option>
                  <option value="Vodafone AU (LTE)">Vodafone AU (LTE)</option>
                </select>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded text-[11px]">
                При нажатии «Отправить» сформируется запись с текущим временем и мгновенно появится в верхней строке таблицы.
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsSimulatorOpen(false)}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 rounded text-xs font-semibold"
              >
                Отмена
              </button>
              <button
                onClick={handleSendSimulatedPing}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Отправить в таблицу</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: VIEW ROW JSON DETAILS */}
      {/* ========================================================================= */}
      {jsonDetailRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold">Сырые данные поминутной записи</h3>
              </div>
              <button
                onClick={() => setJsonDetailRecord(null)}
                className="text-white/80 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-5">
              <pre className="bg-slate-900 text-emerald-400 p-4 rounded-lg text-[11px] font-mono overflow-x-auto max-h-96">
                {JSON.stringify(jsonDetailRecord, null, 2)}
              </pre>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <button
                onClick={() =>
                  handleCopy(
                    JSON.stringify(jsonDetailRecord, null, 2),
                    'copy-row-json'
                  )
                }
                className="inline-flex items-center gap-1 text-slate-700 hover:text-blue-600 font-semibold"
              >
                {copiedKey === 'copy-row-json' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Скопировать объект</span>
              </button>
              <button
                onClick={() => setJsonDetailRecord(null)}
                className="px-3.5 py-1.5 bg-slate-800 text-white font-semibold rounded text-xs"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

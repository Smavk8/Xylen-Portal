import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  Search,
  Filter,
  Download,
  Play,
  Pause,
  Zap,
  Radio,
  Wifi,
  Database,
  Layers,
  ChevronRight,
  Code2,
  Copy,
  Check,
  X,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from 'lucide-react';
import { CdrRecord, Language } from '../types';

interface CdrsViewProps {
  language?: Language;
}

const INITIAL_CDRS: CdrRecord[] = [
  {
    id: 'CDR-20260917-0091',
    timestamp: '2026-09-17 16:44:58.120',
    testerName: 'Avazbek Ismatullayev',
    userEmail: 'avazbek@xylen.net',
    mobileNo: '+998 90 123 45 67',
    imsiNo: '434050123456789',
    mno: 'Ucell',
    project: 'Ucell',
    cellId: '204-12948',
    tac: '4120',
    band: 'LTE B3 (1800 MHz)',
    rsrp: -82,
    sinr: 19.4,
    uploadMb: 2.14,
    downloadMb: 8.42,
    totalMb: 10.56,
    apn: 'internet.ucell.uz',
    pdpStatus: 'Connected',
  },
  {
    id: 'CDR-20260917-0090',
    timestamp: '2026-09-17 16:44:12.845',
    testerName: 'Diyorbek Olimov',
    userEmail: 'diyorbek@company.com',
    mobileNo: '+998 93 987 65 43',
    imsiNo: '434050987654321',
    mno: 'Ucell',
    project: 'Ucell',
    cellId: '204-12949',
    tac: '4120',
    band: 'LTE B7 (2600 MHz)',
    rsrp: -89,
    sinr: 14.2,
    uploadMb: 1.45,
    downloadMb: 6.15,
    totalMb: 7.60,
    apn: 'internet.ucell.uz',
    pdpStatus: 'Connected',
  },
  {
    id: 'CDR-20260917-0089',
    timestamp: '2026-09-17 16:43:30.410',
    testerName: 'Avazbek Ismatullayev',
    userEmail: 'avazbek@xylen.net',
    mobileNo: '+39 333 521 4442',
    imsiNo: '222010123456789',
    mno: 'Tim Italia',
    project: 'Uz Mobile',
    cellId: '222-01-8419',
    tac: '1084',
    band: 'LTE B20 (800 MHz Roam)',
    rsrp: -94,
    sinr: 11.8,
    uploadMb: 3.20,
    downloadMb: 12.80,
    totalMb: 16.00,
    apn: 'ibox.tim.it',
    pdpStatus: 'Connected',
  },
  {
    id: 'CDR-20260917-0088',
    timestamp: '2026-09-17 16:42:04.980',
    testerName: 'Sherdilov Azim',
    userEmail: 'azim@company.com',
    mobileNo: '+1 902 789 3516',
    imsiNo: '302220123456789',
    mno: 'Telus Canada',
    project: 'Uz Mobile',
    cellId: '302-220-4100',
    tac: '2901',
    band: 'LTE B4 (AWS-1)',
    rsrp: -86,
    sinr: 16.5,
    uploadMb: 1.80,
    downloadMb: 7.40,
    totalMb: 9.20,
    apn: 'sp.telus.com',
    pdpStatus: 'Connected',
  },
  {
    id: 'CDR-20260917-0087',
    timestamp: '2026-09-17 16:40:45.312',
    testerName: 'Nurmuhammadov Asadbek',
    userEmail: 'asadbek@company.com',
    mobileNo: '+94 70 712 5664',
    imsiNo: '413010123456789',
    mno: 'Mobitel Sri Lanka',
    project: 'Ucell',
    cellId: '413-01-3810',
    tac: '8204',
    band: 'LTE B3 (1800 MHz)',
    rsrp: -78,
    sinr: 22.0,
    uploadMb: 0.90,
    downloadMb: 3.07,
    totalMb: 3.97,
    apn: 'mobitel4g',
    pdpStatus: 'Connected',
  },
  {
    id: 'CDR-20260917-0086',
    timestamp: '2026-09-17 16:39:18.150',
    testerName: 'Rauf Navruzov',
    userEmail: 'rauf@company.com',
    mobileNo: '+1 782 446 6450',
    imsiNo: '302610123456789',
    mno: 'Bell Canada',
    project: 'Ucell',
    cellId: '302-610-9182',
    tac: '3400',
    band: 'LTE B7 (2600 MHz)',
    rsrp: -92,
    sinr: 13.1,
    uploadMb: 2.80,
    downloadMb: 11.20,
    totalMb: 14.00,
    apn: 'pda.bell.ca',
    pdpStatus: 'Connected',
  },
  {
    id: 'CDR-20260917-0085',
    timestamp: '2026-09-17 16:37:55.770',
    testerName: 'Azizbek Yusufjonov',
    userEmail: 'azizbek@company.com',
    mobileNo: '+91 709 201 9196',
    imsiNo: '404010123456789',
    mno: 'Vodafone Idea India',
    project: 'Ucell',
    cellId: '404-01-1194',
    tac: '6201',
    band: 'LTE B1 (2100 MHz)',
    rsrp: -88,
    sinr: 15.6,
    uploadMb: 1.10,
    downloadMb: 5.40,
    totalMb: 6.50,
    apn: 'portalnmms',
    pdpStatus: 'Connected',
  },
];

export const CdrsView: React.FC<CdrsViewProps> = ({ language = 'ru' }) => {
  const [cdrs, setCdrs] = useState<CdrRecord[]>(INITIAL_CDRS);
  const [isStreaming, setIsStreaming] = useState(true);
  const [streamInterval, setStreamInterval] = useState<number>(3000); // 3 seconds
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState<'All' | 'Ucell' | 'Uz Mobile'>('All');
  const [selectedRecordForInspection, setSelectedRecordForInspection] = useState<CdrRecord | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);

  // Live Auto-Streaming effect
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toISOString().replace('T', ' ').slice(0, 23);
      const randomUpload = parseFloat((Math.random() * 2 + 0.5).toFixed(2));
      const randomDownload = parseFloat((Math.random() * 8 + 2.5).toFixed(2));
      const randomTotal = parseFloat((randomUpload + randomDownload).toFixed(2));
      const randomRsrp = Math.floor(Math.random() * 25) - 100; // -100 to -75 dBm
      const randomSinr = parseFloat((Math.random() * 15 + 10).toFixed(1)); // 10 to 25 dB

      const newCdr: CdrRecord = {
        id: `CDR-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: timeStr,
        testerName: Math.random() > 0.5 ? 'Avazbek Ismatullayev' : 'Nurmuhammadov Asadbek',
        userEmail: 'avazbek@xylen.net',
        mobileNo: Math.random() > 0.5 ? '+998 90 123 45 67' : '+39 333 521 4442',
        imsiNo: '434050123456789',
        mno: Math.random() > 0.5 ? 'Ucell' : 'Tim Italia',
        project: Math.random() > 0.5 ? 'Ucell' : 'Uz Mobile',
        cellId: `204-${Math.floor(10000 + Math.random() * 90000)}`,
        tac: '4120',
        band: 'LTE B3 (1800 MHz)',
        rsrp: randomRsrp,
        sinr: randomSinr,
        uploadMb: randomUpload,
        downloadMb: randomDownload,
        totalMb: randomTotal,
        apn: 'internet.ucell.uz',
        pdpStatus: 'Connected',
      };

      setCdrs((prev) => [newCdr, ...prev.slice(0, 49)]); // Keep last 50
    }, streamInterval);

    return () => clearInterval(interval);
  }, [isStreaming, streamInterval]);

  // Filtering
  const filteredCdrs = useMemo(() => {
    return cdrs.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.testerName.toLowerCase().includes(q) ||
        c.mobileNo.includes(q) ||
        c.imsiNo.includes(q) ||
        c.cellId.toLowerCase().includes(q) ||
        c.mno.toLowerCase().includes(q) ||
        c.apn.toLowerCase().includes(q);

      const matchesProject = projectFilter === 'All' || c.project === projectFilter;
      return matchesSearch && matchesProject;
    });
  }, [cdrs, searchQuery, projectFilter]);

  // Aggregate Metrics
  const totalMbTransferred = useMemo(() => {
    return cdrs.reduce((acc, curr) => acc + curr.totalMb, 0).toFixed(2);
  }, [cdrs]);

  const totalUploadMb = useMemo(() => {
    return cdrs.reduce((acc, curr) => acc + curr.uploadMb, 0).toFixed(2);
  }, [cdrs]);

  const totalDownloadMb = useMemo(() => {
    return cdrs.reduce((acc, curr) => acc + curr.downloadMb, 0).toFixed(2);
  }, [cdrs]);

  // Export to CSV
  const handleExportCsv = () => {
    const headers = 'ID,Timestamp,Tester,Mobile,IMSI,MNO,Project,CellID,TAC,Band,RSRP,SINR,UploadMB,DownloadMB,TotalMB,APN,PDPStatus\n';
    const rows = filteredCdrs
      .map((c) =>
        [
          c.id,
          c.timestamp,
          `"${c.testerName}"`,
          c.mobileNo,
          c.imsiNo,
          `"${c.mno}"`,
          c.project,
          c.cellId,
          c.tac,
          `"${c.band}"`,
          c.rsrp,
          c.sinr,
          c.uploadMb,
          c.downloadMb,
          c.totalMb,
          c.apn,
          c.pdpStatus,
        ].join(',')
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `xylen_cdrs_${new Date().toISOString().slice(0, 10)}.csv`);
    link.click();
  };

  // Copy JSON payload
  const handleCopyJson = () => {
    if (selectedRecordForInspection) {
      navigator.clipboard.writeText(JSON.stringify(selectedRecordForInspection, null, 2));
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    }
  };

  // Manual Ping injection
  const handleInjectPing = () => {
    const now = new Date();
    const timeStr = now.toISOString().replace('T', ' ').slice(0, 23);
    const pingCdr: CdrRecord = {
      id: `CDR-MANUAL-${Date.now().toString().slice(-6)}`,
      timestamp: timeStr,
      testerName: 'Avazbek Ismatullayev',
      userEmail: 'avazbek@xylen.net',
      mobileNo: '+998 90 123 45 67',
      imsiNo: '434050123456789',
      mno: 'Ucell',
      project: 'Ucell',
      cellId: '204-12948',
      tac: '4120',
      band: 'LTE B3 (1800 MHz)',
      rsrp: -81,
      sinr: 21.2,
      uploadMb: 2.50,
      downloadMb: 10.00,
      totalMb: 12.50,
      apn: 'internet.ucell.uz',
      pdpStatus: 'Connected',
    };
    setCdrs([pingCdr, ...cdrs]);
  };

  return (
    <div id="cdrs-telemetry-view" className="space-y-5 pb-12 animate-in fade-in duration-200">
      
      {/* Top Banner & Controls Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-[#0f284a] p-5 rounded-xl border border-slate-200 dark:border-[#183a69] shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>⚡ CDRs — Call Detail & Data Session Telemetry</span>
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide border ${
                isStreaming
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
              {isStreaming ? 'STREAMING ACTIVE' : 'STREAM PAUSED'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Потоковый аудит PDP-контекстов, базовых станций eNodeB (Cell ID / TAC) и радио-метрик RSRP/SINR по SIM флоту
          </p>
        </div>

        {/* Streaming Controls & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Pause / Resume Button */}
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`h-9 px-3.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              isStreaming
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isStreaming ? 'Пауза потока' : 'Возобновить'}</span>
          </button>

          {/* Speed selector */}
          <select
            value={streamInterval}
            onChange={(e) => setStreamInterval(Number(e.target.value))}
            className="h-9 px-2.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-[#1c457c] bg-white dark:bg-[#08172c] text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <option value={1000}>1 сек / CDR</option>
            <option value={3000}>3 сек / CDR</option>
            <option value={5000}>5 сек / CDR</option>
          </select>

          {/* Inject Test Ping Button */}
          <button
            onClick={handleInjectPing}
            className="h-9 px-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>+ Тест CDR</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCsv}
            className="h-9 px-3.5 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Экспорт CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Telecommunications KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0f284a] rounded-xl border border-slate-200 dark:border-[#183a69] p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Суммарный трафик CDR</span>
            <span className="text-blue-600 bg-blue-50 dark:bg-blue-900/40 p-1.5 rounded-lg text-sm">📊</span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white font-mono">
            {totalMbTransferred} <span className="text-xs font-bold text-slate-500">MB</span>
          </div>
          <div className="mt-1 flex items-center gap-3 text-[11px] font-semibold text-slate-500">
            <span className="flex items-center gap-0.5 text-emerald-600">
              <ArrowDownRight className="w-3 h-3" /> DL: {totalDownloadMb} MB
            </span>
            <span className="flex items-center gap-0.5 text-blue-600">
              <ArrowUpRight className="w-3 h-3" /> UL: {totalUploadMb} MB
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f284a] rounded-xl border border-slate-200 dark:border-[#183a69] p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Активные PDP сессии</span>
            <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/40 p-1.5 rounded-lg text-sm">📶</span>
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            18 <span className="text-xs font-normal text-slate-400">bearers</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 font-medium">100% прикреплены к LTE core</div>
        </div>

        <div className="bg-white dark:bg-[#0f284a] rounded-xl border border-slate-200 dark:border-[#183a69] p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Пиковая скорость сети</span>
            <span className="text-purple-600 bg-purple-50 dark:bg-purple-900/40 p-1.5 rounded-lg text-sm">⚡</span>
          </div>
          <div className="mt-2 text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">
            24.8 <span className="text-xs font-bold text-slate-400">Mbps</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">Агрегация Carrier Aggregation 2CC</div>
        </div>

        <div className="bg-white dark:bg-[#0f284a] rounded-xl border border-slate-200 dark:border-[#183a69] p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Качество радиосигнала</span>
            <span className="text-teal-600 bg-teal-50 dark:bg-teal-900/40 p-1.5 rounded-lg text-sm">📡</span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white font-mono">
            -84 <span className="text-xs font-bold text-slate-500">dBm RSRP</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 font-medium">SINR: +18.5 dB (Отличное)</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-[#0f284a] p-4 rounded-xl border border-slate-200 dark:border-[#183a69] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Поиск по IMSI, телефону, тестеру, Cell ID, APN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-3 pr-8 rounded-lg border border-slate-300 dark:border-[#1c457c] text-xs bg-white dark:bg-[#08172c] text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setProjectFilter('All')}
              className={`px-3 py-1 rounded-md transition-all ${
                projectFilter === 'All'
                  ? 'bg-white dark:bg-slate-700 text-[#15437a] dark:text-blue-300 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Все проекты
            </button>
            <button
              onClick={() => setProjectFilter('Ucell')}
              className={`px-3 py-1 rounded-md transition-all ${
                projectFilter === 'Ucell'
                  ? 'bg-purple-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Ucell
            </button>
            <button
              onClick={() => setProjectFilter('Uz Mobile')}
              className={`px-3 py-1 rounded-md transition-all ${
                projectFilter === 'Uz Mobile'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Uz Mobile
            </button>
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Отображается: <strong className="text-slate-900 dark:text-white">{filteredCdrs.length}</strong> CDR записей
        </div>
      </div>

      {/* CDRs Real-Time Data Grid */}
      <div className="bg-white dark:bg-[#0f284a] rounded-xl border border-slate-200 dark:border-[#183a69] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#15437a] text-white font-semibold select-none">
                <th className="py-3 px-3.5 w-10 text-center">
                  <Radio className="w-3.5 h-3.5 mx-auto text-cyan-300" />
                </th>
                <th className="py-3 px-3">Timestamp / CDR ID</th>
                <th className="py-3 px-3">Тестер & MSISDN</th>
                <th className="py-3 px-3">Оператор / Проект</th>
                <th className="py-3 px-3">Cell ID & TAC</th>
                <th className="py-3 px-3">Радиосигнал (RSRP/SINR)</th>
                <th className="py-3 px-3 text-right">Трафик (DL / UL)</th>
                <th className="py-3 px-3 text-right">Итого MB</th>
                <th className="py-3 px-3 text-center">APN / PDP</th>
                <th className="py-3 px-3 text-center w-20">Пакет</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-[#183a69] font-mono">
              {filteredCdrs.map((cdr, index) => (
                <tr
                  key={cdr.id}
                  className={`hover:bg-blue-50/50 dark:hover:bg-slate-800/60 transition-colors ${
                    index === 0 && isStreaming ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 text-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                  </td>

                  {/* Timestamp / ID */}
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-slate-800 dark:text-white font-sans text-xs">
                      {cdr.timestamp.slice(11, 23)}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">{cdr.id}</div>
                  </td>

                  {/* Tester & MSISDN */}
                  <td className="py-2.5 px-3 font-sans">
                    <div className="font-bold text-slate-900 dark:text-white text-xs">{cdr.testerName}</div>
                    <div className="text-[11px] font-mono text-slate-500">{cdr.mobileNo}</div>
                  </td>

                  {/* MNO / Project */}
                  <td className="py-2.5 px-3 font-sans">
                    <div className="font-bold text-slate-900 dark:text-white">{cdr.mno}</div>
                    <span
                      className={`inline-block mt-0.5 px-1.5 py-0.2 text-[9.5px] font-bold rounded ${
                        cdr.project === 'Uz Mobile'
                          ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300'
                          : 'bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300'
                      }`}
                    >
                      {cdr.project}
                    </span>
                  </td>

                  {/* Cell ID & TAC */}
                  <td className="py-2.5 px-3">
                    <div className="text-slate-800 dark:text-slate-200 font-bold">{cdr.cellId}</div>
                    <div className="text-[10.5px] text-slate-400 font-sans">
                      TAC: {cdr.tac} • {cdr.band.split(' ')[0]}
                    </div>
                  </td>

                  {/* RSRP / SINR */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          cdr.rsrp > -90
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                        }`}
                      >
                        {cdr.rsrp} dBm
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">{cdr.sinr} dB</span>
                    </div>
                  </td>

                  {/* Traffic split */}
                  <td className="py-2.5 px-3 text-right">
                    <div className="text-emerald-600 dark:text-emerald-400 font-bold">↓ {cdr.downloadMb.toFixed(2)}</div>
                    <div className="text-blue-600 dark:text-blue-400 text-[10.5px]">↑ {cdr.uploadMb.toFixed(2)}</div>
                  </td>

                  {/* Total MB */}
                  <td className="py-2.5 px-3 text-right font-black text-slate-900 dark:text-white text-xs">
                    {cdr.totalMb.toFixed(2)} MB
                  </td>

                  {/* APN & Status */}
                  <td className="py-2.5 px-3 text-center font-sans">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {cdr.pdpStatus}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{cdr.apn}</div>
                  </td>

                  {/* Inspect Button */}
                  <td className="py-2.5 px-3 text-center font-sans">
                    <button
                      onClick={() => setSelectedRecordForInspection(cdr)}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#15437a] hover:text-white dark:hover:bg-blue-600 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                      title="Inspect Raw CDR JSON"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Raw CDR JSON Packet Modal */}
      {selectedRecordForInspection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0f284a] rounded-2xl border border-slate-200 dark:border-[#183a69] shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#15437a] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Database className="w-4 h-4 text-cyan-300" />
                <span>Raw Telecom CDR Payload — {selectedRecordForInspection.id}</span>
              </div>
              <button
                onClick={() => setSelectedRecordForInspection(null)}
                className="text-white/80 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">ASN.1 / 3GPP Rel-16 Standard Format</span>
                <button
                  onClick={handleCopyJson}
                  className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedJson ? 'Скопировано!' : 'Копировать JSON'}</span>
                </button>
              </div>

              <pre className="bg-slate-950 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-96 custom-scrollbar border border-slate-800">
                {JSON.stringify(
                  {
                    record_type: 'CHARGING_DATA_RECORD_PGW_SGW',
                    cdr_id: selectedRecordForInspection.id,
                    timestamp_utc: selectedRecordForInspection.timestamp,
                    session_info: {
                      serving_network: selectedRecordForInspection.mno,
                      project_assignment: selectedRecordForInspection.project,
                      msisdn: selectedRecordForInspection.mobileNo,
                      imsi: selectedRecordForInspection.imsiNo,
                      apn_ni: selectedRecordForInspection.apn,
                      pdp_type: 'IPv4v6',
                      charging_id: '0x3F8A2B9C',
                    },
                    radio_access_bearer: {
                      rat_type: 'E-UTRAN (LTE)',
                      band: selectedRecordForInspection.band,
                      cell_global_id: selectedRecordForInspection.cellId,
                      tracking_area_code: selectedRecordForInspection.tac,
                      rsrp_dbm: selectedRecordForInspection.rsrp,
                      sinr_db: selectedRecordForInspection.sinr,
                    },
                    data_volume_octets: {
                      uplink_mb: selectedRecordForInspection.uploadMb,
                      downlink_mb: selectedRecordForInspection.downloadMb,
                      total_transferred_mb: selectedRecordForInspection.totalMb,
                    },
                    session_state: selectedRecordForInspection.pdpStatus,
                  },
                  null,
                  2
                )}
              </pre>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setSelectedRecordForInspection(null)}
                  className="px-4 py-2 bg-[#15437a] hover:bg-[#113560] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  Search,
  Download,
  Play,
  Pause,
  Zap,
  Radio,
  Wifi,
  ChevronRight,
  Code2,
  Copy,
  Check,
  X,
  ArrowLeft,
  Smartphone,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  CheckCircle,
  Clock,
  ExternalLink,
  Database,
  Server,
  Globe,
  Signal,
  User,
  RefreshCw,
} from 'lucide-react';
import { CdrRecord, Language } from '../types';
import { t } from '../utils/translations';

interface CdrsViewProps {
  language?: Language;
}

type CdrLevel = 'projects' | 'mnos' | 'testers' | 'telemetry';

interface ProjectCdrSummary {
  id: 'Ucell' | 'Uz Mobile';
  name: string;
  mnosCount: number;
  activeTesters: number;
  totalSessions: number;
  totalDataMb: string;
  status: string;
  descriptionEn: string;
  descriptionRu: string;
}

interface MnoCdrSummary {
  id: string;
  name: string;
  countryEn: string;
  countryRu: string;
  project: 'Ucell' | 'Uz Mobile';
  activeTestersCount: number;
  networkStandard: string;
  avgRsrp: string;
  totalMb: string;
  status: 'Active' | 'Optimal' | 'Alert';
}

interface TesterCdrSession {
  id: string;
  testerName: string;
  mobileNumber: string;
  mno: string;
  project: 'Ucell' | 'Uz Mobile';
  deviceModel: string;
  imei: string;
  iccid: string;
  radioBand: string;
  rsrp: number;
  sinr: number;
  status: 'Streaming' | 'Active' | 'Idle';
  transferredMb: string;
  apn: string;
}

const PROJECTS_DATA: ProjectCdrSummary[] = [
  {
    id: 'Ucell',
    name: 'Ucell Roaming QA Platform',
    mnosCount: 8,
    activeTesters: 14,
    totalSessions: 4821,
    totalDataMb: '3,982,540.00 MB',
    status: 'Active',
    descriptionEn: 'Live cellular roaming test telemetry across European, North American, and Asian partner carriers.',
    descriptionRu: 'Потоковая телеметрия полевого роуминг-тестирования операторов Европы, Америки и Азии.',
  },
  {
    id: 'Uz Mobile',
    name: 'Uz Mobile Global SIM Fleet',
    mnosCount: 6,
    activeTesters: 11,
    totalSessions: 3190,
    totalDataMb: '2,154,200.00 MB',
    status: 'Active',
    descriptionEn: 'High-speed automated and field tester cellular quota verification and PDP context audit.',
    descriptionRu: 'Аудит квот передачи данных, активации PDP контекста и радиопараметров полевых инженеров.',
  },
];

const MNOS_DATA: MnoCdrSummary[] = [
  // Ucell MNOs
  {
    id: 'tim-italia',
    name: 'Tim Italia',
    countryEn: 'Italy',
    countryRu: 'Италия',
    project: 'Ucell',
    activeTestersCount: 3,
    networkStandard: '4G LTE / 5G NSA',
    avgRsrp: '-84 dBm',
    totalMb: '894,400.00 MB',
    status: 'Optimal',
  },
  {
    id: '3-denmark',
    name: '3 Denmark',
    countryEn: 'Denmark',
    countryRu: 'Дания',
    project: 'Ucell',
    activeTestersCount: 2,
    networkStandard: '4G LTE (eSIM)',
    avgRsrp: '-91 dBm',
    totalMb: '512,300.00 MB',
    status: 'Active',
  },
  {
    id: 'telus-canada-ucell',
    name: 'Telus Canada',
    countryEn: 'Canada',
    countryRu: 'Канада',
    project: 'Ucell',
    activeTestersCount: 2,
    networkStandard: '4G LTE Advanced',
    avgRsrp: '-88 dBm',
    totalMb: '839,680.00 MB',
    status: 'Optimal',
  },
  {
    id: 'celcom-digi',
    name: 'Celcom Digi Malaysia',
    countryEn: 'Malaysia',
    countryRu: 'Малайзия',
    project: 'Ucell',
    activeTestersCount: 2,
    networkStandard: '4G LTE (Band 7)',
    avgRsrp: '-85 dBm',
    totalMb: '599,522.00 MB',
    status: 'Optimal',
  },
  {
    id: 'orange-france',
    name: 'Orange France',
    countryEn: 'France',
    countryRu: 'Франция',
    project: 'Ucell',
    activeTestersCount: 1,
    networkStandard: '4G LTE (eSIM)',
    avgRsrp: '-82 dBm',
    totalMb: '400,443.00 MB',
    status: 'Optimal',
  },
  {
    id: 'bell-canada',
    name: 'Bell Canada',
    countryEn: 'Canada',
    countryRu: 'Канада',
    project: 'Ucell',
    activeTestersCount: 1,
    networkStandard: '4G LTE Advanced',
    avgRsrp: '-87 dBm',
    totalMb: '291,840.00 MB',
    status: 'Active',
  },
  {
    id: 'mobitel-sri-lanka',
    name: 'Mobitel Sri Lanka',
    countryEn: 'Sri Lanka',
    countryRu: 'Шри-Ланка',
    project: 'Ucell',
    activeTestersCount: 2,
    networkStandard: '4G LTE',
    avgRsrp: '-90 dBm',
    totalMb: '321,400.00 MB',
    status: 'Active',
  },
  {
    id: 'vodafone-india',
    name: 'Vodafone Idea India',
    countryEn: 'India',
    countryRu: 'Индия',
    project: 'Ucell',
    activeTestersCount: 1,
    networkStandard: '4G LTE',
    avgRsrp: '-96 dBm',
    totalMb: '122,955.00 MB',
    status: 'Alert',
  },

  // Uz Mobile MNOs
  {
    id: 'tim-italia-uz',
    name: 'Tim Italia',
    countryEn: 'Italy',
    countryRu: 'Италия',
    project: 'Uz Mobile',
    activeTestersCount: 3,
    networkStandard: '4G LTE / 5G NSA',
    avgRsrp: '-82 dBm',
    totalMb: '1,000,000.00 MB',
    status: 'Optimal',
  },
  {
    id: 'vodafone-australia',
    name: 'Vodafone Australia',
    countryEn: 'Australia',
    countryRu: 'Австралия',
    project: 'Uz Mobile',
    activeTestersCount: 2,
    networkStandard: '4G LTE (Band 28)',
    avgRsrp: '-89 dBm',
    totalMb: '480,200.00 MB',
    status: 'Optimal',
  },
  {
    id: 'telus-canada-uz',
    name: 'Telus Canada',
    countryEn: 'Canada',
    countryRu: 'Канада',
    project: 'Uz Mobile',
    activeTestersCount: 2,
    networkStandard: '4G LTE Advanced',
    avgRsrp: '-86 dBm',
    totalMb: '320,000.00 MB',
    status: 'Optimal',
  },
  {
    id: 'starhub-singapore',
    name: 'Starhub Singapore',
    countryEn: 'Singapore',
    countryRu: 'Сингапур',
    project: 'Uz Mobile',
    activeTestersCount: 1,
    networkStandard: '4G LTE / 5G',
    avgRsrp: '-81 dBm',
    totalMb: '150,000.00 MB',
    status: 'Optimal',
  },
  {
    id: 'verizon-usa',
    name: 'Verizon USA',
    countryEn: 'United States',
    countryRu: 'США',
    project: 'Uz Mobile',
    activeTestersCount: 1,
    networkStandard: '4G LTE (Band 13)',
    avgRsrp: '-93 dBm',
    totalMb: '120,000.00 MB',
    status: 'Active',
  },
  {
    id: 'free-mobile-france',
    name: 'Free Mobile France',
    countryEn: 'France',
    countryRu: 'Франция',
    project: 'Uz Mobile',
    activeTestersCount: 1,
    networkStandard: '4G LTE (Band 28)',
    avgRsrp: '-88 dBm',
    totalMb: '84,000.00 MB',
    status: 'Active',
  },
];

const TESTERS_DATA: TesterCdrSession[] = [
  // Tim Italia
  {
    id: 't-tim-1',
    testerName: 'Avazbek Ismatullayev',
    mobileNumber: '+39 3335214442',
    mno: 'Tim Italia',
    project: 'Ucell',
    deviceModel: 'Xiaomi Redmi Note 10S',
    imei: '867034057624596',
    iccid: '89390100002746628209',
    radioBand: 'LTE B3 (1800 MHz)',
    rsrp: -82,
    sinr: 19.4,
    status: 'Streaming',
    transferredMb: '231,300.00 MB',
    apn: 'ibox.tim.it',
  },
  {
    id: 't-tim-2',
    testerName: 'Lucilla Antonacci',
    mobileNumber: '+39 3317550646',
    mno: 'Tim Italia',
    project: 'Ucell',
    deviceModel: 'Samsung Galaxy A54 5G',
    imei: '354892109823412',
    iccid: '89390100002764651505',
    radioBand: 'LTE B7 (2600 MHz)',
    rsrp: -86,
    sinr: 16.2,
    status: 'Streaming',
    transferredMb: '142,500.00 MB',
    apn: 'ibox.tim.it',
  },
  {
    id: 't-tim-3',
    testerName: 'Marco Rossi',
    mobileNumber: '+39 3401122334',
    mno: 'Tim Italia',
    project: 'Ucell',
    deviceModel: 'iPhone 14 Pro (eSIM)',
    imei: '359120485729103',
    iccid: '89390100002890123456',
    radioBand: 'LTE B20 (800 MHz)',
    rsrp: -92,
    sinr: 12.8,
    status: 'Active',
    transferredMb: '89,400.00 MB',
    apn: 'ibox.tim.it',
  },

  // 3 Denmark
  {
    id: 't-3dk-1',
    testerName: 'Michael Eboji',
    mobileNumber: '+45 00000300',
    mno: '3 Denmark',
    project: 'Ucell',
    deviceModel: 'Samsung Galaxy S22',
    imei: '351289047192834',
    iccid: '0000064000',
    radioBand: 'LTE B20 (800 MHz)',
    rsrp: -89,
    sinr: 15.0,
    status: 'Streaming',
    transferredMb: '298,100.00 MB',
    apn: 'data.tre.dk',
  },
  {
    id: 't-3dk-2',
    testerName: 'Josefine Fischer',
    mobileNumber: '+45 7632189566',
    mno: '3 Denmark',
    project: 'Ucell',
    deviceModel: 'Google Pixel 8 (eSIM)',
    imei: '358901234567890',
    iccid: '78964',
    radioBand: 'LTE B3 (1800 MHz)',
    rsrp: -93,
    sinr: 11.4,
    status: 'Active',
    transferredMb: '214,200.00 MB',
    apn: 'data.tre.dk',
  },

  // Celcom Digi
  {
    id: 't-cdigi-1',
    testerName: 'Abdunabiyev Asadbek',
    mobileNumber: '+60 162779716',
    mno: 'Celcom Digi Malaysia',
    project: 'Ucell',
    deviceModel: 'Xiaomi 13T Pro',
    imei: '869012345678901',
    iccid: '89601623050504984205',
    radioBand: 'LTE B7 (2600 MHz)',
    rsrp: -85,
    sinr: 18.2,
    status: 'Streaming',
    transferredMb: '385,200.00 MB',
    apn: 'diginet',
  },

  // Vodafone Australia
  {
    id: 't-voda-1',
    testerName: 'Ramy Hamed',
    mobileNumber: '+61 415386030',
    mno: 'Vodafone Australia',
    project: 'Uz Mobile',
    deviceModel: 'Samsung Galaxy A34',
    imei: '357890123456789',
    iccid: '89610300003467379476',
    radioBand: 'LTE B28 (700 MHz)',
    rsrp: -88,
    sinr: 17.5,
    status: 'Streaming',
    transferredMb: '240,100.00 MB',
    apn: 'live.vodafone.com',
  },
  {
    id: 't-voda-2',
    testerName: 'Davi Francheschi',
    mobileNumber: '+61 410938593',
    mno: 'Vodafone Australia',
    project: 'Uz Mobile',
    deviceModel: 'Google Pixel 7a',
    imei: '356789012345678',
    iccid: '89610300003473866102',
    radioBand: 'LTE B3 (1800 MHz)',
    rsrp: -90,
    sinr: 13.9,
    status: 'Active',
    transferredMb: '240,100.00 MB',
    apn: 'live.vodafone.com',
  },

  // Telus Canada
  {
    id: 't-telus-1',
    testerName: 'Sharon Fraser',
    mobileNumber: '+1 9027896244',
    mno: 'Telus Canada',
    project: 'Uz Mobile',
    deviceModel: 'iPhone 13 (eSIM)',
    imei: '354321098765432',
    iccid: '8912230000540853405',
    radioBand: 'LTE B4 (AWS-1)',
    rsrp: -86,
    sinr: 19.0,
    status: 'Streaming',
    transferredMb: '180,000.00 MB',
    apn: 'sp.telus.com',
  },
];

export const CdrsView: React.FC<CdrsViewProps> = ({ language = 'ru' }) => {
  // Navigation Drill-Down State
  const [currentLevel, setCurrentLevel] = useState<CdrLevel>('projects');
  const [selectedProject, setSelectedProject] = useState<'Ucell' | 'Uz Mobile' | null>(null);
  const [selectedMno, setSelectedMno] = useState<MnoCdrSummary | null>(null);
  const [selectedTester, setSelectedTester] = useState<TesterCdrSession | null>(null);

  // Streaming State for Tier 4
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [streamIntervalMs, setStreamIntervalMs] = useState<number>(1500);
  const [records, setRecords] = useState<CdrRecord[]>([]);
  const [selectedRecordForModal, setSelectedRecordForModal] = useState<CdrRecord | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Auto-generate initial records for selected tester
  useEffect(() => {
    if (selectedTester) {
      const initList: CdrRecord[] = [];
      const now = Date.now();
      for (let i = 0; i < 8; i++) {
        const time = new Date(now - i * 1400);
        const timeStr = time.toISOString().replace('T', ' ').substring(0, 23);
        const ul = +(0.5 + Math.random() * 2.5).toFixed(2);
        const dl = +(3.0 + Math.random() * 18.0).toFixed(2);
        initList.push({
          id: `CDR-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: timeStr,
          testerName: selectedTester.testerName,
          userEmail: `${selectedTester.testerName.toLowerCase().replace(/\s+/g, '.')}@xylen.net`,
          mobileNo: selectedTester.mobileNumber,
          imsiNo: selectedTester.iccid.substring(0, 15),
          mno: selectedTester.mno,
          project: selectedTester.project,
          cellId: `222-01-${Math.floor(10000 + Math.random() * 90000)}`,
          tac: `${Math.floor(1000 + Math.random() * 9000)}`,
          band: selectedTester.radioBand,
          rsrp: Math.floor(selectedTester.rsrp + (Math.random() * 8 - 4)),
          sinr: +(selectedTester.sinr + (Math.random() * 4 - 2)).toFixed(1),
          uploadMb: ul,
          downloadMb: dl,
          totalMb: +(ul + dl).toFixed(2),
          apn: selectedTester.apn,
          pdpStatus: 'Connected',
        });
      }
      setRecords(initList);
    }
  }, [selectedTester]);

  // Live Stream interval for Tier 4
  useEffect(() => {
    if (!isLiveStreaming || currentLevel !== 'telemetry' || !selectedTester) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toISOString().replace('T', ' ').substring(0, 23);
      const ul = +(0.8 + Math.random() * 3.2).toFixed(2);
      const dl = +(5.0 + Math.random() * 25.0).toFixed(2);
      const newCdr: CdrRecord = {
        id: `CDR-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: timeStr,
        testerName: selectedTester.testerName,
        userEmail: `${selectedTester.testerName.toLowerCase().replace(/\s+/g, '.')}@xylen.net`,
        mobileNo: selectedTester.mobileNumber,
        imsiNo: selectedTester.iccid.substring(0, 15),
        mno: selectedTester.mno,
        project: selectedTester.project,
        cellId: `222-01-${Math.floor(10000 + Math.random() * 90000)}`,
        tac: `${Math.floor(1000 + Math.random() * 9000)}`,
        band: selectedTester.radioBand,
        rsrp: Math.floor(selectedTester.rsrp + (Math.random() * 6 - 3)),
        sinr: +(selectedTester.sinr + (Math.random() * 3 - 1.5)).toFixed(1),
        uploadMb: ul,
        downloadMb: dl,
        totalMb: +(ul + dl).toFixed(2),
        apn: selectedTester.apn,
        pdpStatus: 'Connected',
      };

      setRecords((prev) => [newCdr, ...prev.slice(0, 49)]); // Keep last 50
    }, streamIntervalMs);

    return () => clearInterval(interval);
  }, [isLiveStreaming, streamIntervalMs, currentLevel, selectedTester]);

  // Filtered MNOs for Level 2
  const visibleMnos = useMemo(() => {
    if (!selectedProject) return MNOS_DATA;
    return MNOS_DATA.filter((m) => m.project === selectedProject);
  }, [selectedProject]);

  // Filtered Testers for Level 3
  const visibleTesters = useMemo(() => {
    return TESTERS_DATA.filter((t) => {
      const matchProject = !selectedProject || t.project === selectedProject;
      const matchMno = !selectedMno || t.mno.toLowerCase() === selectedMno.name.toLowerCase();
      return matchProject && matchMno;
    });
  }, [selectedProject, selectedMno]);

  // Filtered CDRs for Level 4
  const filteredRecords = useMemo(() => {
    if (!searchFilter.trim()) return records;
    const q = searchFilter.toLowerCase().trim();
    return records.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.cellId.toLowerCase().includes(q) ||
        r.tac.includes(q) ||
        r.apn.toLowerCase().includes(q) ||
        r.band.toLowerCase().includes(q)
    );
  }, [records, searchFilter]);

  // Aggregate Metrics for Tier 4
  const totalTransferredMb = useMemo(() => {
    return records.reduce((acc, curr) => acc + curr.totalMb, 0).toFixed(2);
  }, [records]);

  const totalDlMb = useMemo(() => {
    return records.reduce((acc, curr) => acc + curr.downloadMb, 0).toFixed(2);
  }, [records]);

  const totalUlMb = useMemo(() => {
    return records.reduce((acc, curr) => acc + curr.uploadMb, 0).toFixed(2);
  }, [records]);

  // Export CSV
  const handleExportCsv = () => {
    const headers = 'ID,Timestamp,Tester,Mobile,IMSI,MNO,Project,CellID,TAC,Band,RSRP,SINR,UploadMB,DownloadMB,TotalMB,APN,PDPStatus\n';
    const rows = filteredRecords
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
    link.setAttribute('download', `xylen_cdrs_${selectedTester?.testerName || 'stream'}_${new Date().toISOString().slice(0, 10)}.csv`);
    link.click();
  };

  // Copy JSON
  const handleCopyJson = () => {
    if (selectedRecordForModal) {
      navigator.clipboard.writeText(JSON.stringify(selectedRecordForModal, null, 2));
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Inject Test CDR packet
  const handleInjectPing = () => {
    if (!selectedTester) return;
    const now = new Date();
    const timeStr = now.toISOString().replace('T', ' ').slice(0, 23);
    const pingCdr: CdrRecord = {
      id: `CDR-INJECT-${Date.now().toString().slice(-6)}`,
      timestamp: timeStr,
      testerName: selectedTester.testerName,
      userEmail: `${selectedTester.testerName.toLowerCase().replace(/\s+/g, '.')}@xylen.net`,
      mobileNo: selectedTester.mobileNumber,
      imsiNo: selectedTester.iccid.substring(0, 15),
      mno: selectedTester.mno,
      project: selectedTester.project,
      cellId: '222-01-99410',
      tac: '4120',
      band: selectedTester.radioBand,
      rsrp: -81,
      sinr: 21.4,
      uploadMb: 3.20,
      downloadMb: 18.50,
      totalMb: 21.70,
      apn: selectedTester.apn,
      pdpStatus: 'Connected',
    };
    setRecords([pingCdr, ...records]);
  };

  return (
    <div id="cdrs-telemetry-view" className="space-y-5 pb-12 animate-in fade-in duration-200 font-sans">
      
      {/* Universal Breadcrumb Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-[#0f284a] px-4 py-3 rounded-xl border border-slate-200 dark:border-[#183a69] shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold overflow-x-auto custom-scrollbar">
          {/* Tier 1 root */}
          <button
            onClick={() => {
              setCurrentLevel('projects');
              setSelectedProject(null);
              setSelectedMno(null);
              setSelectedTester(null);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              currentLevel === 'projects'
                ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>CDRs ({t('cdrsProjectsTitle', language)})</span>
          </button>

          {/* Tier 2 MNOs breadcrumb */}
          {selectedProject && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <button
                onClick={() => {
                  setCurrentLevel('mnos');
                  setSelectedMno(null);
                  setSelectedTester(null);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  currentLevel === 'mnos'
                    ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>{selectedProject}</span>
              </button>
            </>
          )}

          {/* Tier 3 Testers breadcrumb */}
          {selectedMno && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <button
                onClick={() => {
                  setCurrentLevel('testers');
                  setSelectedTester(null);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  currentLevel === 'testers'
                    ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-purple-600" />
                <span>{selectedMno.name}</span>
              </button>
            </>
          )}

          {/* Tier 4 Tester Telemetry breadcrumb */}
          {selectedTester && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold">
                <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                <span>{selectedTester.testerName} — {selectedTester.mobileNumber}</span>
              </span>
            </>
          )}
        </div>

        {/* Level Navigation Back Button */}
        {currentLevel !== 'projects' && (
          <button
            onClick={() => {
              if (currentLevel === 'telemetry') setCurrentLevel('testers');
              else if (currentLevel === 'testers') setCurrentLevel('mnos');
              else if (currentLevel === 'mnos') setCurrentLevel('projects');
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#15437a] dark:hover:text-blue-400 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>
              {currentLevel === 'telemetry'
                ? t('backToTesters', language)
                : currentLevel === 'testers'
                ? t('backToMnos', language)
                : t('backToProjects', language)}
            </span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* TIER 1: CLIENT TELECOM PROJECTS                                           */}
      {/* ========================================================================= */}
      {currentLevel === 'projects' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              <span>{t('cdrsProjectsTitle', language)}</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t('cdrsProjectsDesc', language)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PROJECTS_DATA.map((proj) => (
              <div
                key={proj.id}
                onClick={() => {
                  setSelectedProject(proj.id);
                  setCurrentLevel('mnos');
                }}
                className="group relative bg-white dark:bg-[#0f284a] rounded-xl border-2 border-slate-200 dark:border-[#183a69] hover:border-blue-500 dark:hover:border-blue-400 p-6 shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-lg border border-blue-100 dark:border-blue-800 group-hover:scale-105 transition-transform">
                      {proj.id === 'Ucell' ? 'UC' : 'UZ'}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-2">
                        <span>{proj.name}</span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </h2>
                      <span className="inline-block mt-0.5 px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        ● {proj.status}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-4 line-clamp-2">
                  {language === 'ru' ? proj.descriptionRu : proj.descriptionEn}
                </p>

                <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                  <div>
                    <span className="text-[10.5px] uppercase font-bold text-slate-400">{t('activeRoamingMnos', language)}</span>
                    <div className="text-base font-extrabold text-slate-800 dark:text-white font-mono mt-0.5">{proj.mnosCount} MNOs</div>
                  </div>
                  <div>
                    <span className="text-[10.5px] uppercase font-bold text-slate-400">{t('activeTesters', language)}</span>
                    <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">{proj.activeTesters} {language === 'ru' ? 'чел' : 'testers'}</div>
                  </div>
                  <div>
                    <span className="text-[10.5px] uppercase font-bold text-slate-400">{t('totalDataTransferred', language)}</span>
                    <div className="text-xs font-black text-blue-600 dark:text-blue-400 font-mono mt-1">{proj.totalDataMb}</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:underline">
                  <span>{language === 'ru' ? 'Открыть роуминг-партнеров' : 'Open Roaming Partners'} →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TIER 2: ROAMING OPERATORS (MNOS)                                          */}
      {/* ========================================================================= */}
      {currentLevel === 'mnos' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                <span>{selectedProject} — {t('cdrsMnosTitle', language)}</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t('cdrsMnosDesc', language)}
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 self-start sm:self-auto">
              {visibleMnos.length} {language === 'ru' ? 'активных роуминг-операторов' : 'roaming operators'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleMnos.map((mno) => (
              <div
                key={mno.id}
                onClick={() => {
                  setSelectedMno(mno);
                  setCurrentLevel('testers');
                }}
                className="group bg-white dark:bg-[#0f284a] rounded-xl border border-slate-200 dark:border-[#183a69] hover:border-blue-500 dark:hover:border-blue-400 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                      <span>{mno.name}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <span>{language === 'ru' ? mno.countryRu : mno.countryEn}</span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold ${
                      mno.status === 'Optimal'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : mno.status === 'Alert'
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                        : 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                    }`}
                  >
                    ● {mno.status}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span className="text-slate-400">{language === 'ru' ? 'Стандарт сети:' : 'Network Standard:'}</span>
                    <span className="font-semibold">{mno.networkStandard}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span className="text-slate-400">{language === 'ru' ? 'Средний RSRP:' : 'Average RSRP:'}</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{mno.avgRsrp}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span className="text-slate-400">{language === 'ru' ? 'Инженеры:' : 'Testers:'}</span>
                    <span className="font-bold text-slate-800 dark:text-white">
                      {mno.activeTestersCount} {language === 'ru' ? 'закреплено' : 'assigned'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span className="text-slate-400">{language === 'ru' ? 'Трафик:' : 'Data:'}</span>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{mno.totalMb}</span>
                  </div>
                </div>

                <div className="mt-4 pt-2 flex items-center justify-end text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:underline">
                  <span>{language === 'ru' ? 'Выбрать тестеров' : 'View Testers'} →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TIER 3: TESTERS DIRECTORY ("Имя тестера — телефон номер")                 */}
      {/* ========================================================================= */}
      {currentLevel === 'testers' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <User className="w-5 h-5 text-purple-600" />
                <span>{selectedMno?.name} — {t('cdrsTestersTitle', language)}</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t('cdrsTestersDesc', language)}
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 self-start sm:self-auto">
              {visibleTesters.length} {language === 'ru' ? 'активных сессий тестеров' : 'active tester sessions'}
            </span>
          </div>

          <div className="space-y-3">
            {visibleTesters.map((tester) => (
              <div
                key={tester.id}
                onClick={() => {
                  setSelectedTester(tester);
                  setCurrentLevel('telemetry');
                }}
                className="group bg-white dark:bg-[#0f284a] rounded-xl border border-slate-200 dark:border-[#183a69] hover:border-blue-500 dark:hover:border-blue-400 p-4.5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Primary Column: "Имя тестера — телефон номер" */}
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-300 font-bold border border-purple-100 dark:border-purple-800 group-hover:scale-105 transition-transform shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    {/* The exact requested format: "Имя тестера — телефон номер" */}
                    <div className="text-sm font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-2">
                      <span>{tester.testerName} — <span className="font-mono text-blue-600 dark:text-blue-400">{tester.mobileNumber}</span></span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-bold ${
                          tester.status === 'Streaming'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 animate-pulse'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {tester.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span>{tester.deviceModel}</span>
                      <span>IMEI: <span className="font-mono text-slate-700 dark:text-slate-200">{tester.imei}</span></span>
                      <span>ICCID: <span className="font-mono text-slate-700 dark:text-slate-200">{tester.iccid}</span></span>
                    </div>
                  </div>
                </div>

                {/* Secondary Column: Radio Telemetry Quick Peek */}
                <div className="flex items-center gap-6 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800">
                  <div className="text-right">
                    <span className="text-[10.5px] uppercase font-bold text-slate-400">{language === 'ru' ? 'Радиочастота / RSRP' : 'Radio / RSRP'}</span>
                    <div className="text-xs font-mono font-bold text-slate-800 dark:text-white mt-0.5">
                      {tester.radioBand.split(' ')[0]} • <span className="text-emerald-600 dark:text-emerald-400">{tester.rsrp} dBm</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10.5px] uppercase font-bold text-slate-400">{language === 'ru' ? 'Передано данных' : 'Transferred'}</span>
                    <div className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                      {tester.transferredMb}
                    </div>
                  </div>

                  <button className="h-8 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 transition-colors shrink-0">
                    <span>{language === 'ru' ? 'Открыть CDRs' : 'Open CDRs'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TIER 4: DETAILED TELEMETRY & LIVE STREAMING GRID                          */}
      {/* ========================================================================= */}
      {currentLevel === 'telemetry' && selectedTester && (
        <div className="space-y-5 animate-in fade-in duration-200">
          
          {/* Active Tester Card Banner */}
          <div className="bg-[#15437a] text-white p-5 rounded-xl shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-blue-200 uppercase tracking-wider font-bold">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>{language === 'ru' ? 'Прямой канал сбора телеметрии полевого тестера' : 'Direct Field Tester Telemetry Ingestion'}</span>
              </div>
              <h2 className="text-xl font-extrabold text-white mt-1 flex items-center gap-3">
                <span>{selectedTester.testerName} — {selectedTester.mobileNumber}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-mono font-bold">
                  {selectedTester.mno} ({selectedTester.project})
                </span>
              </h2>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-blue-100/90 mt-2 font-mono">
                <span>Device: {selectedTester.deviceModel}</span>
                <span>IMEI: {selectedTester.imei}</span>
                <span>ICCID: {selectedTester.iccid}</span>
                <span>APN: {selectedTester.apn}</span>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsLiveStreaming(!isLiveStreaming)}
                className={`h-9 px-3.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                  isLiveStreaming
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                }`}
              >
                {isLiveStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isLiveStreaming ? t('pauseStream', language) : t('resumeStream', language)}</span>
              </button>

              <select
                value={streamIntervalMs}
                onChange={(e) => setStreamIntervalMs(Number(e.target.value))}
                className="h-9 px-2.5 text-xs font-semibold rounded-lg border border-blue-400/30 bg-[#113560] text-white cursor-pointer"
              >
                <option value={1000}>1 сек / CDR</option>
                <option value={1500}>1.5 сек / CDR</option>
                <option value={3000}>3 сек / CDR</option>
              </select>

              <button
                onClick={handleInjectPing}
                className="h-9 px-3.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>+ {t('injectPacket', language)}</span>
              </button>

              <button
                onClick={handleExportCsv}
                className="h-9 px-3.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer border border-white/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t('exportCsv', language)}</span>
              </button>
            </div>
          </div>

          {/* 4 Telecommunications KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#0f284a] rounded-xl border border-slate-200 dark:border-[#183a69] p-4.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('totalDataTransferred', language)}</span>
                <span className="text-blue-600 bg-blue-50 dark:bg-blue-900/40 p-1.5 rounded-lg text-sm">📊</span>
              </div>
              <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white font-mono">
                {totalTransferredMb} <span className="text-xs font-bold text-slate-500">MB</span>
              </div>
              <div className="mt-1 flex items-center gap-3 text-[11px] font-semibold text-slate-500">
                <span className="flex items-center gap-0.5 text-emerald-600">
                  <ArrowDownRight className="w-3 h-3" /> DL: {totalDlMb} MB
                </span>
                <span className="flex items-center gap-0.5 text-blue-600">
                  <ArrowUpRight className="w-3 h-3" /> UL: {totalUlMb} MB
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0f284a] rounded-xl border border-slate-200 dark:border-[#183a69] p-4.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('pdpStatus', language)}</span>
                <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/40 p-1.5 rounded-lg text-sm">📶</span>
              </div>
              <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                Active <span className="text-xs font-normal text-slate-400">Bearer</span>
              </div>
              <div className="mt-1 text-[11px] text-emerald-600 font-medium">100% прикреплен к LTE Core EPC</div>
            </div>

            <div className="bg-white dark:bg-[#0f284a] rounded-xl border border-slate-200 dark:border-[#183a69] p-4.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{language === 'ru' ? 'Пиковая скорость' : 'Peak Throughput'}</span>
                <span className="text-purple-600 bg-purple-50 dark:bg-purple-900/40 p-1.5 rounded-lg text-sm">⚡</span>
              </div>
              <div className="mt-2 text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">
                28.4 <span className="text-xs font-bold text-slate-400">Mbps</span>
              </div>
              <div className="mt-1 text-[11px] text-slate-500 font-medium">LTE CA Band 3 + Band 7</div>
            </div>

            <div className="bg-white dark:bg-[#0f284a] rounded-xl border border-slate-200 dark:border-[#183a69] p-4.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('signalQuality', language)}</span>
                <span className="text-teal-600 bg-teal-50 dark:bg-teal-900/40 p-1.5 rounded-lg text-sm">📡</span>
              </div>
              <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white font-mono">
                {selectedTester.rsrp} <span className="text-xs font-bold text-slate-500">dBm</span>
              </div>
              <div className="mt-1 text-[11px] text-emerald-600 font-medium">SINR: +{selectedTester.sinr} dB (Отличное)</div>
            </div>
          </div>

          {/* Filter Toolbar */}
          <div className="bg-white dark:bg-[#0f284a] p-4 rounded-xl border border-slate-200 dark:border-[#183a69] flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder={language === 'ru' ? 'Поиск по CDR ID, Cell ID, TAC, APN...' : 'Search CDR ID, Cell ID, TAC, APN...'}
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full h-9 pl-3 pr-8 rounded-lg border border-slate-300 dark:border-[#1c457c] text-xs bg-white dark:bg-[#08172c] text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5" />
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {language === 'ru' ? 'Отображается:' : 'Showing:'} <strong className="text-slate-900 dark:text-white">{filteredRecords.length}</strong> CDR записей
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
                    <th className="py-3 px-3">{language === 'ru' ? 'Тестер & MSISDN' : 'Tester & MSISDN'}</th>
                    <th className="py-3 px-3">{language === 'ru' ? 'Оператор / Проект' : 'MNO / Project'}</th>
                    <th className="py-3 px-3">Cell ID & TAC</th>
                    <th className="py-3 px-3">{language === 'ru' ? 'Радиосигнал (RSRP/SINR)' : 'Signal (RSRP/SINR)'}</th>
                    <th className="py-3 px-3 text-right">{language === 'ru' ? 'Трафик (DL / UL)' : 'Data (DL / UL)'}</th>
                    <th className="py-3 px-3 text-right">{language === 'ru' ? 'Итого MB' : 'Total MB'}</th>
                    <th className="py-3 px-3 text-center">APN / PDP</th>
                    <th className="py-3 px-3 text-center w-20">{language === 'ru' ? 'Пакет' : 'Packet'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-[#183a69] font-mono">
                  {filteredRecords.map((cdr, index) => (
                    <tr
                      key={cdr.id}
                      className={`hover:bg-blue-50/50 dark:hover:bg-slate-800/60 transition-colors ${
                        index === 0 && isLiveStreaming ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 text-center">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
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
                          onClick={() => setSelectedRecordForModal(cdr)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#15437a] hover:text-white dark:hover:bg-blue-600 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                          title="Inspect Raw CDR JSON (ASN.1)"
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
          {selectedRecordForModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <div className="bg-white dark:bg-[#0f284a] rounded-2xl border border-slate-200 dark:border-[#183a69] shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-[#15437a] text-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Database className="w-4 h-4 text-cyan-300" />
                    <span>Raw Telecom CDR Payload — {selectedRecordForModal.id}</span>
                  </div>
                  <button
                    onClick={() => setSelectedRecordForModal(null)}
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
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Скопировано!' : 'Копировать JSON'}</span>
                    </button>
                  </div>

                  <pre className="bg-slate-950 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-96 custom-scrollbar border border-slate-800">
                    {JSON.stringify(
                      {
                        record_type: 'CHARGING_DATA_RECORD_PGW_SGW',
                        cdr_id: selectedRecordForModal.id,
                        timestamp_utc: selectedRecordForModal.timestamp,
                        session_info: {
                          serving_network: selectedRecordForModal.mno,
                          project_assignment: selectedRecordForModal.project,
                          msisdn: selectedRecordForModal.mobileNo,
                          imsi: selectedRecordForModal.imsiNo,
                          apn_ni: selectedRecordForModal.apn,
                          pdp_type: 'IPv4v6',
                          charging_id: '0x3F8A2B9C',
                        },
                        radio_access_bearer: {
                          rat_type: 'E-UTRAN (LTE)',
                          band: selectedRecordForModal.band,
                          cell_global_id: selectedRecordForModal.cellId,
                          tracking_area_code: selectedRecordForModal.tac,
                          rsrp_dbm: selectedRecordForModal.rsrp,
                          sinr_db: selectedRecordForModal.sinr,
                        },
                        data_volume_octets: {
                          uplink_mb: selectedRecordForModal.uploadMb,
                          downlink_mb: selectedRecordForModal.downloadMb,
                          total_transferred_mb: selectedRecordForModal.totalMb,
                        },
                        session_state: selectedRecordForModal.pdpStatus,
                      },
                      null,
                      2
                    )}
                  </pre>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => setSelectedRecordForModal(null)}
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
      )}
    </div>
  );
};

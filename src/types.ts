export type NavigationTab =
  | 'dashboard'
  | 'users'
  | 'projects'
  | 'inventory'
  | 'sim_list'
  | 'sim_assignments'
  | 'sim_submissions'
  | 'sim_required'
  | 'report_forecast'
  | 'minute_telemetry'
  | 'cdrs'
  | 'tickets';

export type Language = 'en' | 'ru';
export type ThemeMode = 'light' | 'dark';

export interface CdrRecord {
  id: string;
  timestamp: string;
  testerName: string;
  userEmail: string;
  mobileNo: string;
  imsiNo: string;
  mno: string;
  project: 'Uz Mobile' | 'Ucell';
  cellId: string;
  tac: string;
  band: string; // e.g. 'LTE B3 (1800)'
  rsrp: number; // in dBm, e.g. -85
  sinr: number; // in dB, e.g. 18
  uploadMb: number;
  downloadMb: number;
  totalMb: number;
  apn: string;
  pdpStatus: 'Connected' | 'Re-attaching' | 'Idle';
}

export interface MinuteTelemetryRecord {
  id: string;
  user_email: string;
  mobile_no: string;
  imsi_no: string;
  usage_pm: number; // in MB
  date_time: string;
  connected_network: string;
  created_at: string;
}

export interface TelemetryTesterNode {
  testerName: string;
  userEmail: string;
  mobileNo: string;
  imsiNo: string;
  mno: string;
  recordsCount: number;
  totalUsageMB: number;
  lastPingTime: string;
  currentNetwork: string;
  status: 'Online' | 'Idle' | 'Offline';
}

export interface TelemetryOperatorNode {
  mno: string;
  project: string;
  country: string;
  activeTestersCount: number;
  totalUsageTodayMB: number;
  totalRecordsCount: number;
  lastActive: string;
}

export interface SimItem {
  id: number;
  supplier: string;
  project: 'Uz Mobile' | 'Ucell';
  mno: string;
  simNumber: string;
  mobileNumber: string;
  isEsim: boolean;
  tester: string;
  status: 'In Transit' | 'Active' | 'Active (with issue)' | 'Steered' | 'Dormant' | 'Sim Issue' | 'Disconnection';
  missing: string[]; // e.g. ['Tester'], ['Tester', 'Roaming Dates'], ['Roaming Dates']
  roamingDates?: string;
  tariff?: string;
  notes?: string;
}

export interface DeviceItem {
  id: number;
  deviceType: string;
  make: string;
  model: string;
  imei: string;
  simSlots: number;
  ownership: 'Personal' | 'Company';
  testerName: string;
  country: string;
}

export interface ProjectItem {
  id: number;
  name: 'Uz Mobile' | 'Ucell';
  status: 'Active' | 'Inactive';
  totalTargetMB: number;
  achievedMB: number;
  ratesCount?: number;
}

export interface UserItem {
  id: number;
  name: string;
  role: 'Tester' | 'Manager' | 'Admin';
  contactNo: string;
  status: 'Onboarding' | 'Active' | 'Inactive';
  country: string;
  simsCount: number;
  projects: string[];
}

export interface AssignmentItem {
  id: number;
  testerName: string;
  mno: string;
  mobileNumber: string;
  simNumber: string;
  testDays: number;
  breakDays: number;
  startDate: string;
  endDate: string;
  dailyTargetMB: number;
  status: 'Active' | 'Completed' | 'Pending';
  submittedMB: number;
  monthlyTargetMB: number;
}

export interface SubmissionItem {
  id: number;
  testerName: string;
  projectName: 'Ucell' | 'Uz Mobile';
  mno: string;
  mobileNumber: string;
  date: string;
  mbUsed: number;
  comments: string;
  testComplete: boolean;
  dataSession?: string;
}

export interface SimRequiredItem {
  id: number;
  mno: string;
  assignedTo: string;
  assignedToColor: 'red' | 'cyan' | 'blue';
  simType: 'eSIM' | 'Physical';
  contractPrepaid: 'Contract' | 'Prepaid';
  tariff: string;
  roamingBundle: string;
  suppliers: string;
  project: 'Ucell' | 'Uz Mobile';
  target: number;
  inStock: number;
  acquiredInTr: number;
  pending: number;
  notes: string;
}

export interface ForecastRateItem {
  id: number;
  project: 'Ucell' | 'Uz Mobile';
  mno: string;
  activeSims: number;
  targetPerSimMB: number;
  monthlyTargetMB: number;
  actualSubmissionsMB: number;
  differenceMB: number;
  achievedPercent: number;
}

export interface TicketItem {
  id: string;
  subject: string;
  title?: string;
  type: string; // e.g. 'Data Stall' | 'LPA Timeout' | 'Steering Issue' | 'APN Failure'
  createdBy: string;
  resolutionDate: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  isNew?: boolean;
  mno?: string;
  tester?: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  createdAt?: string;
  description?: string;
}

export interface UserProfile {
  name: string;
  title: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  timezone: string;
  projects: string[];
  activeSimsSupervised: number;
  assignedDevicesCount: number;
  lastLogin: string;
}

export interface CdrRecord {
  id: string;
  timestamp: string;
  testerName: string;
  userEmail: string;
  mobileNo: string;
  imsiNo: string;
  mno: string;
  project: 'Ucell' | 'Uz Mobile';
  cellId: string;
  tac: string;
  band: string;
  rsrp: number;
  sinr: number;
  uploadMb: number;
  downloadMb: number;
  totalMb: number;
  apn: string;
  pdpStatus: 'Connected' | 'Idle' | 'Handover' | 'Terminated';
}

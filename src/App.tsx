import React, { useState, useEffect } from 'react';
import {
  NavigationTab,
  Language,
  ThemeMode,
  SimItem,
  DeviceItem,
  ProjectItem,
  UserItem,
  AssignmentItem,
  SubmissionItem,
  SimRequiredItem,
  ForecastRateItem,
  TicketItem,
} from './types';
import {
  INITIAL_SIMS,
  INITIAL_DEVICES,
  INITIAL_PROJECTS,
  INITIAL_USERS,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_SIMS_REQUIRED,
  INITIAL_FORECAST_RATES,
  INITIAL_TICKETS,
} from './data/mockData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { SimsListView } from './components/SimsListView';
import { UsersView } from './components/UsersView';
import { ProjectsView } from './components/ProjectsView';
import { InventoryView } from './components/InventoryView';
import { SimAssignmentsView } from './components/SimAssignmentsView';
import { SimSubmissionsView } from './components/SimSubmissionsView';
import { SimsRequiredView } from './components/SimsRequiredView';
import { ForecastReportView } from './components/ForecastReportView';
import { MinuteTelemetryView } from './components/MinuteTelemetryView';
import { CdrsView } from './components/CdrsView';
import { TicketsView } from './components/TicketsView';

// Modals
import { AssignTesterModal } from './components/modals/AssignTesterModal';
import { AddUserModal } from './components/modals/AddUserModal';
import { AddDeviceModal } from './components/modals/AddDeviceModal';
import { SimDetailModal } from './components/modals/SimDetailModal';
import { RatesModal } from './components/modals/RatesModal';
import { SubmissionDetailModal } from './components/modals/SubmissionDetailModal';
import { CreateTicketModal } from './components/modals/CreateTicketModal';
import { UserProfileModal } from './components/modals/UserProfileModal';

export default function App() {
  // Theme & Language State
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('xylen_theme') as ThemeMode) || 'light';
  });

  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('xylen_lang') as Language) || 'ru';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('xylen_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    showToast(theme === 'light' ? 'Включена темная тема' : 'Включена светлая тема');
  };

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('xylen_lang', lang);
    showToast(lang === 'ru' ? 'Язык изменен на Русский' : 'Language changed to English');
  };

  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavigationTab>('sim_list');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Core Datasets
  const [sims, setSims] = useState<SimItem[]>(INITIAL_SIMS);
  const [devices, setDevices] = useState<DeviceItem[]>(INITIAL_DEVICES);
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS);
  const [assignments, setAssignments] = useState<AssignmentItem[]>(INITIAL_ASSIGNMENTS);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>(INITIAL_SUBMISSIONS);
  const [simsRequired, setSimsRequired] = useState<SimRequiredItem[]>(INITIAL_SIMS_REQUIRED);
  const [forecastRates, setForecastRates] = useState<ForecastRateItem[]>(INITIAL_FORECAST_RATES);
  const [tickets, setTickets] = useState<TicketItem[]>(INITIAL_TICKETS);

  // Modals state
  const [isAssignTesterModalOpen, setIsAssignTesterModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [selectedSimForDetail, setSelectedSimForDetail] = useState<SimItem | null>(null);
  const [simDetailMode, setSimDetailMode] = useState<'view' | 'edit'>('view');
  const [isSimDetailModalOpen, setIsSimDetailModalOpen] = useState(false);

  const [selectedProjectForRates, setSelectedProjectForRates] = useState<ProjectItem | null>(null);
  const [isRatesModalOpen, setIsRatesModalOpen] = useState(false);

  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionItem | null>(null);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handlers
  const handleAssignTester = (data: {
    testerName: string;
    simId: number;
    testDays: number;
    breakDays: number;
    startDate: string;
    endDate: string;
    dailyTargetMB: number;
  }) => {
    // Update Sim
    setSims((prev) =>
      prev.map((s) => {
        if (s.id === data.simId) {
          const missing = s.missing.filter((m) => m !== 'Tester');
          return {
            ...s,
            tester: data.testerName,
            status: 'Active',
            missing,
          };
        }
        return s;
      })
    );

    // Create or append to Assignments
    const targetSim = sims.find((s) => s.id === data.simId);
    if (targetSim) {
      const newAssignment: AssignmentItem = {
        id: assignments.length + 1,
        testerName: data.testerName,
        mno: targetSim.mno,
        mobileNumber: targetSim.mobileNumber,
        simNumber: targetSim.simNumber,
        testDays: data.testDays,
        breakDays: data.breakDays,
        startDate: data.startDate,
        endDate: data.endDate,
        dailyTargetMB: data.dailyTargetMB,
        status: 'Active',
        submittedMB: 0,
        monthlyTargetMB: data.testDays * data.dailyTargetMB,
      };
      setAssignments([newAssignment, ...assignments]);
    }

    showToast(`Tester "${data.testerName}" assigned successfully!`);
  };

  const handleAddUser = (newUserData: Omit<UserItem, 'id' | 'simsCount'>) => {
    const newUser: UserItem = {
      ...newUserData,
      id: users.length + 1,
      simsCount: 0,
    };
    setUsers([...users, newUser]);
    showToast(`User "${newUser.name}" added successfully!`);
  };

  const handleAddDevice = (newDeviceData: Omit<DeviceItem, 'id'>) => {
    const newDevice: DeviceItem = {
      ...newDeviceData,
      id: devices.length + 1,
    };
    setDevices([...devices, newDevice]);
    showToast(`Device "${newDevice.make} ${newDevice.model}" added to inventory!`);
  };

  const handleDeleteDevice = (id: number) => {
    setDevices(devices.filter((d) => d.id !== id));
    showToast('Device removed from inventory.');
  };

  const handleSaveSim = (updatedSim: SimItem) => {
    setSims(sims.map((s) => (s.id === updatedSim.id ? updatedSim : s)));
    showToast(`SIM #${updatedSim.id} updated successfully!`);
  };

  const handleAddTicket = (ticket: TicketItem) => {
    setTickets([ticket, ...tickets]);
    showToast(`Ticket ${ticket.id} logged successfully.`);
  };

  const handleResolveTicket = (ticketId: string) => {
    setTickets(
      tickets.map((t) => (t.id === ticketId ? { ...t, status: 'Resolved' } : t))
    );
    showToast(`Ticket ${ticketId} marked as Resolved.`);
  };

  return (
    <div
      className={`min-h-screen ${
        theme === 'dark' ? 'dark bg-[#09182d] text-slate-100' : 'bg-[#f8fafc] text-slate-800'
      } flex flex-col antialiased transition-colors duration-200`}
    >
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        language={language}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Header Bar */}
        <Header
          onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
          userName="Avazbek Ismatullayev"
          theme={theme}
          onToggleTheme={handleToggleTheme}
          language={language}
          onSelectLanguage={handleSelectLanguage}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onLogout={() => {
            showToast(language === 'ru' ? 'Сессия завершена' : 'Session logged out');
            setIsProfileModalOpen(false);
          }}
        />

        {/* View Router */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              sims={sims}
              projects={projects}
              tickets={tickets}
              onNavigateToTab={(tab) => setCurrentTab(tab)}
              language={language}
            />
          )}

          {currentTab === 'sim_list' && (
            <SimsListView
              sims={sims}
              onOpenAssignTester={() => setIsAssignTesterModalOpen(true)}
              onViewSim={(sim) => {
                setSelectedSimForDetail(sim);
                setSimDetailMode('view');
                setIsSimDetailModalOpen(true);
              }}
              onEditSim={(sim) => {
                setSelectedSimForDetail(sim);
                setSimDetailMode('edit');
                setIsSimDetailModalOpen(true);
              }}
              language={language}
            />
          )}

          {currentTab === 'sim_assignments' && (
            <SimAssignmentsView assignments={assignments} language={language} />
          )}

          {currentTab === 'sim_submissions' && (
            <SimSubmissionsView
              submissions={submissions}
              onViewSubmission={(sub) => {
                setSelectedSubmission(sub);
                setIsSubmissionModalOpen(true);
              }}
              language={language}
            />
          )}

          {currentTab === 'sim_required' && (
            <SimsRequiredView items={simsRequired} language={language} />
          )}

          {currentTab === 'users' && (
            <UsersView
              users={users}
              onAddUser={() => setIsAddUserModalOpen(true)}
              onViewUser={(user) => {
                showToast(`Viewing details for ${user.name}`);
              }}
              onEditUser={(user) => {
                showToast(`Editing permissions for ${user.name}`);
              }}
              language={language}
            />
          )}

          {currentTab === 'projects' && (
            <ProjectsView
              projects={projects}
              onOpenRates={(project) => {
                setSelectedProjectForRates(project);
                setIsRatesModalOpen(true);
              }}
              language={language}
            />
          )}

          {currentTab === 'inventory' && (
            <InventoryView
              devices={devices}
              onAddDevice={() => setIsAddDeviceModalOpen(true)}
              onEditDevice={(device) => {
                showToast(`Editing device ${device.model}`);
              }}
              onDeleteDevice={handleDeleteDevice}
              language={language}
            />
          )}

          {currentTab === 'report_forecast' && (
            <ForecastReportView rates={forecastRates} language={language} />
          )}

          {(currentTab === 'cdrs' || currentTab === 'minute_telemetry') && (
            <CdrsView language={language} />
          )}

          {currentTab === 'tickets' && (
            <TicketsView
              tickets={tickets}
              onCreateTicket={() => setIsCreateTicketModalOpen(true)}
              onResolveTicket={handleResolveTicket}
              language={language}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <AssignTesterModal
        isOpen={isAssignTesterModalOpen}
        onClose={() => setIsAssignTesterModalOpen(false)}
        users={users}
        sims={sims}
        onAssign={handleAssignTester}
      />

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onAdd={handleAddUser}
      />

      <AddDeviceModal
        isOpen={isAddDeviceModalOpen}
        onClose={() => setIsAddDeviceModalOpen(false)}
        users={users}
        onAdd={handleAddDevice}
      />

      <SimDetailModal
        isOpen={isSimDetailModalOpen}
        onClose={() => setIsSimDetailModalOpen(false)}
        sim={selectedSimForDetail}
        mode={simDetailMode}
        users={users}
        onSave={handleSaveSim}
      />

      <RatesModal
        isOpen={isRatesModalOpen}
        onClose={() => setIsRatesModalOpen(false)}
        project={selectedProjectForRates}
      />

      <SubmissionDetailModal
        isOpen={isSubmissionModalOpen}
        onClose={() => setIsSubmissionModalOpen(false)}
        submission={selectedSubmission}
      />

      <CreateTicketModal
        isOpen={isCreateTicketModalOpen}
        onClose={() => setIsCreateTicketModalOpen(false)}
        onAdd={handleAddTicket}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onLogout={() => {
          showToast(language === 'ru' ? 'Сессия завершена' : 'Session logged out');
          setIsProfileModalOpen(false);
        }}
        language={language}
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-lg border border-slate-700/50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

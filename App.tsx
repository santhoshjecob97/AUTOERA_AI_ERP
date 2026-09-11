import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Bell, Search, Sparkles, RefreshCw, LogOut, Sun, Moon, Bot, Globe, Palette } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import SalesEngine from './pages/SalesEngine';
import ServiceLayout from './components/layouts/ServiceLayout';
import ServiceOverviewPage from './pages/service/ServiceOverviewPage';
import FinanceEngine from './pages/FinanceEngine';
import InsuranceEngine from './pages/InsuranceEngine';
import WorkforceEngine from './pages/WorkforceEngine';
import FleetEngine from './pages/FleetEngine';
import EVIntelligencePage from './pages/ev/EVIntelligencePage';
import OEMDashboardPage from './pages/oem/OEMDashboardPage';
import DeveloperPortalPage from './pages/developer/DeveloperPortalPage';
import DatabaseArchitecturePage from './pages/developer/DatabaseArchitecturePage';
import BackendArchitecturePage from './pages/developer/BackendArchitecturePage';
import TechnologyStackPage from './pages/developer/TechnologyStackPage';
import SecurityCompliancePage from './pages/developer/SecurityCompliancePage';
import MobileAppDesignPage from './pages/developer/MobileAppDesignPage';
import ServiceAIDashboard from './pages/ai-engines/ServiceAIDashboard';
import AIOperatingSystemPage from './pages/ai-engines/AIOperatingSystemPage';
import PlansPage from './pages/PlansPage';
import AIChatModal from './components/AIChatModal';
import CommandPalette from './components/CommandPalette';
import AISidebarPanel from './components/AISidebarPanel';
import LoginScreen from './components/LoginScreen';
import { ViewState } from './types';
import { VoiceProvider } from './context/VoiceContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { WhiteLabelProvider, useWhiteLabel, BrandPreset } from './context/WhiteLabelContext';
import { LocaleProvider, useLocale, SupportedLocale } from './context/LocaleContext';
import RoleProtectedRoute from './components/RoleProtectedRoute';

// Import New 2026 Enterprise Workflows
import Customer360Page from './pages/Customer360Page';
import Vehicle360Page from './pages/Vehicle360Page';
import DeskingPage from './pages/sales/DeskingPage';
import WorkshopCommandPage from './pages/service/WorkshopCommandPage';
import GeneralLedgerPage from './pages/finance/GeneralLedgerPage';
import UsedCarEngine from './pages/UsedCarEngine';
import DailyOperationsChecklistPage from './pages/DailyOperationsChecklist';
import CustomerComplaintsPage from './pages/CustomerComplaintsPage';

// Import Service sub-pages
import ServiceBaysPage from './pages/service/ServiceBaysPage';
import ServiceMaintenancePage from './pages/service/ServiceMaintenancePage';
import ServiceTechniciansPage from './pages/service/ServiceTechniciansPage';
import ServiceInventoryPage from './pages/service/ServiceInventoryPage';
import ServiceQualityPage from './pages/service/ServiceQualityPage';
import ServiceEmergencyPage from './pages/service/ServiceEmergencyPage';
import ServiceAnalyticsPage from './pages/service/ServiceAnalyticsPage';

import OperationsPage from './pages/service/OperationsPage';
import SchedulerPage from './pages/service/SchedulerPage';
import CommunicationPage from './pages/service/CommunicationPage';
import QualityPage from './pages/service/QualityPage';
import AnalyticsPage from './pages/service/AnalyticsPage';

// Import Sales sub-pages
import LeadsPage from './pages/sales/LeadsPage';
import VirtualShowroomPage from './pages/sales/VirtualShowroomPage';
import PricingPage from './pages/sales/PricingPage';
import ChatbotPage from './pages/sales/ChatbotPage';
import SalesAnalyticsPage from './pages/sales/AnalyticsPage';
import SalesTargetsIncentivesPage from './pages/sales/SalesTargetsIncentivesPage';

// Import Finance sub-pages
import CreditScoringPage from './pages/finance/CreditScoringPage';
import LoanApprovalPage from './pages/finance/LoanApprovalPage';
import RiskAssessmentPage from './pages/finance/RiskAssessmentPage';
import PaymentProcessingPage from './pages/finance/PaymentProcessingPage';
import FraudDetectionPage from './pages/finance/FraudDetectionPage';
import LoanCalculatorPage from './pages/finance/LoanCalculatorPage';
import CompliancePage from './pages/finance/CompliancePage';
import FinanceAnalyticsPage from './pages/finance/AnalyticsPage';

// Import Insurance sub-pages
import ClaimProcessingPage from './pages/insurance/ClaimProcessingPage';
import DamageAssessmentPage from './pages/insurance/DamageAssessmentPage';
import InsuranceFraudDetectionPage from './pages/insurance/FraudDetectionPage';
import PolicyRecommendationsPage from './pages/insurance/PolicyRecommendationsPage';
import SettlementCalculatorPage from './pages/insurance/SettlementCalculatorPage';
import DocumentManagementPage from './pages/insurance/DocumentManagementPage';
import InsuranceAnalyticsPage from './pages/insurance/AnalyticsPage';

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading, logout, retryInit, switchRole } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { preset, setPreset, availablePresets } = useWhiteLabel();
  const { locale, setLocale, availableLocales } = useLocale();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);
  const [copilotInitialPrompt, setCopilotInitialPrompt] = useState<string | undefined>(undefined);

  // Global Cmd+K / Ctrl+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Derive current view from location
  const getCurrentView = (): ViewState => {
    const path = location.pathname;
    if (path.startsWith('/customer-360')) return 'customer-360';
    if (path.startsWith('/complaints')) return 'complaints';
    if (path.startsWith('/vehicle-360')) return 'vehicle-360';
    if (path.startsWith('/sales/targets-incentives')) return 'sales-targets';
    if (path.startsWith('/sales/desking')) return 'desking';
    if (path.startsWith('/service/workshop-command')) return 'workshop-command';
    if (path.startsWith('/finance/ledger')) return 'general-ledger';
    if (path.startsWith('/sales-ai')) return 'sales-ai';
    if (path.startsWith('/finance-ai')) return 'finance-ai';
    if (path.startsWith('/insurance-ai')) return 'insurance-ai';
    if (path.startsWith('/fleet-ai')) return 'fleet-ai';
    if (path.startsWith('/workforce-ai')) return 'workforce-ai';
    if (path.startsWith('/ev-ai')) return 'ev-ai';
    if (path.startsWith('/voice-ai')) return 'voice-ai';
    if (path.startsWith('/sales')) return 'sales';
    if (path.startsWith('/service')) return 'service';
    if (path.startsWith('/finance')) return 'finance';
    if (path.startsWith('/insurance')) return 'insurance';
    if (path.startsWith('/workforce')) return 'workforce';
    if (path.startsWith('/fleet')) return 'fleet';
    if (path.startsWith('/ev')) return 'ev';
    if (path.startsWith('/oem')) return 'oem';
    if (path.startsWith('/developer')) return 'developer';
    if (path.startsWith('/plans')) return 'plans';
    if (path.startsWith('/used-cars')) return 'used-cars';
    if (path.startsWith('/daily-checklists') || path.startsWith('/operations/daily-checklist')) return 'daily-checklists';
    if (path.startsWith('/ai-os')) return 'ai-os';
    if (path.startsWith('/database-arch')) return 'database-arch';
    if (path.startsWith('/backend-arch')) return 'backend-arch';
    if (path.startsWith('/service-ai')) return 'service-ai';
    return 'dashboard';
  };

  const currentView = getCurrentView();

  // Premium Branded Loading & Timeout Recovery Screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070a13] flex flex-col items-center justify-center p-6 text-slate-100 font-sans">
        <div className="max-w-sm w-full text-center space-y-6 animate-fade-in">
          <div className="flex justify-center">
            <img
              src="/assets/autoera-ai-logo.png"
              alt="AutoEra AI"
              className="h-16 w-auto object-contain drop-shadow-[0_4px_16px_rgba(249,115,22,0.3)] animate-pulse"
            />
          </div>

          <div>
            <h3 className="text-lg font-bold text-white tracking-tight font-['Outfit']">
              AutoEra AI ERP 2026
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Synchronizing dealership security & session...
            </p>
          </div>

          <div className="flex justify-center py-2">
            <div className="w-8 h-8 border-3 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
          </div>

          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => retryInit()}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-medium transition-all flex items-center gap-1.5"
            >
              <RefreshCw size={13} />
              <span>Retry</span>
            </button>
            <button
              onClick={() => logout()}
              className="px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-xs text-orange-400 font-medium transition-all flex items-center gap-1.5"
            >
              <LogOut size={13} />
              <span>Sign In Screen</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, show login screen
  if (!user) {
    return <LoginScreen />;
  }

  return (
    <VoiceProvider>
      <div className="flex h-screen bg-slate-50 dark:bg-[#070a13] text-slate-900 dark:text-slate-100 overflow-hidden transition-colors">
        <Sidebar
          currentView={currentView}
          onChangeView={(view) => {
            const routeMap: Record<ViewState, string> = {
              dashboard: '/',
              'customer-360': '/customer-360',
              'vehicle-360': '/vehicle-360',
              complaints: '/complaints',
              desking: '/sales/desking',
              'workshop-command': '/service/workshop-command',
              'general-ledger': '/finance/ledger',
              sales: '/sales',
              service: '/service',
              finance: '/finance',
              insurance: '/insurance',
              workforce: '/workforce',
              fleet: '/fleet',
              ev: '/ev',
              oem: '/oem',
              developer: '/developer',
              plans: '/plans',
              'ai-os': '/ai-os',
              'database-arch': '/database-arch',
              'backend-arch': '/backend-arch',
              'tech-stack': '/tech-stack',
              security: '/security',
              'mobile-app': '/mobile-app',
              'used-cars': '/used-cars',
              'daily-checklists': '/operations/daily-checklist',
              'sales-targets': '/sales/targets-incentives',
              'service-ai': '/service-ai',
              'sales-ai': '/sales-ai',
              'finance-ai': '/finance-ai',
              'insurance-ai': '/insurance-ai',
              'fleet-ai': '/fleet-ai',
              'workforce-ai': '/workforce-ai',
              'ev-ai': '/ev-ai',
              'voice-ai': '/voice-ai',
            };
            navigate(routeMap[view] || '/');
            setIsSidebarOpen(false);
          }}
          isOpen={isSidebarOpen}
          user={user}
          onLogout={logout}
        />

        <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
          <header className="h-16 bg-white dark:bg-[#090d16] border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between px-4 md:px-8 z-30 shadow-xs transition-colors">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 mr-4 md:hidden text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                <Menu size={22} />
              </button>

              <div className="hidden md:flex items-center gap-3">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-orange-600 dark:text-orange-400 font-extrabold uppercase tracking-wider font-mono">
                      {user.organizationName || 'Apex Mobility Group'}
                    </span>
                    <span className="text-slate-400">&bull;</span>
                    {/* Live Role Switcher Dropdown */}
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-orange-500/10 border border-orange-500/30 rounded-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <select
                        value={user.role}
                        onChange={(e) => switchRole(e.target.value as any)}
                        className="bg-transparent text-[11px] font-bold text-orange-600 dark:text-orange-400 outline-none cursor-pointer"
                        title="Switch Active Dealership Role"
                      >
                        <optgroup label="── Corporate ──" className="bg-slate-900 text-amber-400 font-bold">
                          <option value="Dealer Principal" className="bg-slate-900 text-white">Dealer Principal (Group Board)</option>
                          <option value="CEO" className="bg-slate-900 text-white">CEO (Chief Executive Officer)</option>
                          <option value="CFO" className="bg-slate-900 text-white">CFO (Financial Governance)</option>
                          <option value="Group Sales Head" className="bg-slate-900 text-white">Group Sales Head</option>
                          <option value="Group Service Head" className="bg-slate-900 text-white">Group Service Head</option>
                          <option value="Super Admin" className="bg-slate-900 text-white">Super Admin</option>
                        </optgroup>
                        <optgroup label="── Branch Leadership ──" className="bg-slate-900 text-blue-400 font-bold">
                          <option value="General Manager" className="bg-slate-900 text-white">General Manager (All Access)</option>
                          <option value="Branch Manager" className="bg-slate-900 text-white">Branch Manager</option>
                          <option value="Sales Manager" className="bg-slate-900 text-white">Sales Manager</option>
                          <option value="Service Manager" className="bg-slate-900 text-white">Service Manager</option>
                          <option value="Workshop Manager" className="bg-slate-900 text-white">Workshop Manager</option>
                          <option value="Parts Manager" className="bg-slate-900 text-white">Parts Manager</option>
                          <option value="Finance Manager" className="bg-slate-900 text-white">Finance Manager</option>
                          <option value="Insurance Manager" className="bg-slate-900 text-white">Insurance Manager</option>
                          <option value="HR Manager" className="bg-slate-900 text-white">HR Manager</option>
                        </optgroup>
                        <optgroup label="── Operational ──" className="bg-slate-900 text-emerald-400 font-bold">
                          <option value="Sales Executive" className="bg-slate-900 text-white">Sales Executive</option>
                          <option value="Telecaller" className="bg-slate-900 text-white">Telecaller / BDC</option>
                          <option value="CRM Executive" className="bg-slate-900 text-white">CRM Executive</option>
                          <option value="Service Advisor" className="bg-slate-900 text-white">Service Advisor</option>
                          <option value="Technician" className="bg-slate-900 text-white">Technician</option>
                          <option value="EV Technician" className="bg-slate-900 text-white">EV Technician</option>
                          <option value="Warranty Executive" className="bg-slate-900 text-white">Warranty Executive</option>
                          <option value="Finance Officer" className="bg-slate-900 text-white">Finance Officer</option>
                          <option value="Insurance Executive" className="bg-slate-900 text-white">Insurance Executive</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white capitalize font-['Outfit']">
                    {currentView === 'dashboard' ? 'Overview & Live Operations' : `${currentView.replace(/-/g, ' ')} Management`}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 md:space-x-3">
              <div
                onClick={() => setIsCommandPaletteOpen(true)}
                className="hidden md:flex relative items-center cursor-pointer group"
              >
                <input
                  type="text"
                  readOnly
                  placeholder="Search workflows, VINs, or run Cmd+K..."
                  className="pl-9 pr-14 py-2 bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 group-hover:border-orange-500/50 rounded-lg text-xs transition-all w-72 text-slate-800 dark:text-slate-100 placeholder-slate-400 cursor-pointer outline-none select-none"
                />
                <Search size={15} className="absolute left-3 top-2.5 text-slate-400 group-hover:text-orange-500 transition-colors" />
                <kbd className="absolute right-2 top-2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 shadow-2xs">
                  Ctrl K
                </kbd>
              </div>

              <button
                onClick={() => setIsAIModalOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-md shadow-orange-500/20 active:scale-[0.98] cursor-pointer"
              >
                <Sparkles size={15} className="text-amber-200" />
                <span className="hidden md:inline">AutoEra Copilot</span>
              </button>

              {/* AI Specialist Sidebar Dock Toggle */}
              <button
                onClick={() => setIsAISidebarOpen(!isAISidebarOpen)}
                className={`p-2 rounded-lg transition-all cursor-pointer relative ${
                  isAISidebarOpen
                    ? 'bg-orange-500/20 text-orange-500 border border-orange-500/40 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
                title="Toggle AI Specialist Assistant Panel"
              >
                <Bot size={18} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              </button>

              {/* Brand Theming Preset Selector */}
              <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs">
                <Palette size={13} className="text-orange-500" />
                <select
                  value={preset}
                  onChange={(e) => setPreset(e.target.value as BrandPreset)}
                  className="bg-transparent text-[11px] font-semibold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
                  title="Switch Dealer Brand Theme"
                >
                  {availablePresets.map(p => (
                    <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Internationalisation Language Selector */}
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs">
                <Globe size={13} className="text-blue-500" />
                <select
                  value={locale}
                  onChange={(e) => setLocale(e.target.value as SupportedLocale)}
                  className="bg-transparent text-[11px] font-semibold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
                  title="Switch Language & Regional Currency"
                >
                  {availableLocales.map(l => (
                    <option key={l.code} value={l.code} className="bg-slate-900 text-white">
                      {l.nativeName} ({l.code.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Theme Toggle (Dark / Light) */}
              <button
                onClick={toggleTheme}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-lg transition-colors cursor-pointer"
                title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} mode`}
              >
                {resolvedTheme === 'dark' ? (
                  <Sun size={18} className="text-amber-400" />
                ) : (
                  <Moon size={18} className="text-slate-600" />
                )}
              </button>

              <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-slate-800/60 rounded-lg transition-colors relative">
                <Bell size={19} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border border-white dark:border-slate-900" />
              </button>

              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border border-orange-500/30 shadow-sm bg-gradient-to-br from-slate-800 to-slate-900">
                {user.avatar ? (
                  <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full" />
                ) : (
                  user.name.charAt(0)
                )}
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-4 md:p-8 relative">
            <Routes>
              <Route
                path="/"
                element={
                  <Dashboard
                    onNavigate={(view) => {
                      const routeMap: Record<ViewState, string> = {
                        dashboard: '/',
                        'customer-360': '/customer-360',
                        complaints: '/complaints',
                        'vehicle-360': '/vehicle-360',
                        desking: '/sales/desking',
                        'workshop-command': '/service/workshop-command',
                        'general-ledger': '/finance/ledger',
                        sales: '/sales',
                        service: '/service',
                        finance: '/finance',
                        insurance: '/insurance',
                        workforce: '/workforce',
                        fleet: '/fleet',
                        ev: '/ev',
                        oem: '/oem',
                        developer: '/developer',
                        plans: '/plans',
                        'ai-os': '/ai-os',
                        'database-arch': '/database-arch',
                        'backend-arch': '/backend-arch',
                        'tech-stack': '/tech-stack',
                        security: '/security',
                        'mobile-app': '/mobile-app',
                        'service-ai': '/service-ai',
                        'sales-ai': '/sales-ai',
                        'finance-ai': '/finance-ai',
                        'insurance-ai': '/insurance-ai',
                        'fleet-ai': '/fleet-ai',
                        'workforce-ai': '/workforce-ai',
                        'ev-ai': '/ev-ai',
                        'voice-ai': '/voice-ai',
                      };
                      navigate(routeMap[view] || '/');
                    }}
                    user={user}
                  />
                }
              />

              {/* Customer 360 & Vehicle 360 Unified Dossiers & Complaints */}
              <Route path="/customer-360" element={<RoleProtectedRoute permission={['customer-360', 'sales', 'service']}><Customer360Page /></RoleProtectedRoute>} />
              <Route path="/customer-360/:id" element={<RoleProtectedRoute permission={['customer-360', 'sales', 'service']}><Customer360Page /></RoleProtectedRoute>} />
              <Route path="/complaints" element={<RoleProtectedRoute permission={['complaints', 'service', 'customer-360']}><CustomerComplaintsPage /></RoleProtectedRoute>} />
              <Route path="/vehicle-360" element={<RoleProtectedRoute permission={['vehicle-360', 'service', 'fleet', 'ev']}><Vehicle360Page /></RoleProtectedRoute>} />
              <Route path="/vehicle-360/:vin" element={<RoleProtectedRoute permission={['vehicle-360', 'service', 'fleet', 'ev']}><Vehicle360Page /></RoleProtectedRoute>} />

              {/* Sales Routes */}
              <Route path="/sales" element={<RoleProtectedRoute permission="sales"><SalesEngine /></RoleProtectedRoute>} />
              <Route path="/sales/desking" element={<RoleProtectedRoute permission={['sales', 'desking']}><DeskingPage /></RoleProtectedRoute>} />
              <Route path="/sales/targets-incentives" element={<RoleProtectedRoute permission={['sales', 'sales-targets']}><SalesTargetsIncentivesPage /></RoleProtectedRoute>} />
              <Route path="/sales/leads" element={<RoleProtectedRoute permission="sales"><LeadsPage /></RoleProtectedRoute>} />
              <Route path="/sales/showroom" element={<RoleProtectedRoute permission="sales"><VirtualShowroomPage /></RoleProtectedRoute>} />
              <Route path="/sales/pricing" element={<RoleProtectedRoute permission="sales"><PricingPage /></RoleProtectedRoute>} />
              <Route path="/sales/chatbot" element={<RoleProtectedRoute permission="sales"><ChatbotPage /></RoleProtectedRoute>} />
              <Route path="/sales/analytics" element={<RoleProtectedRoute permission="sales"><SalesAnalyticsPage /></RoleProtectedRoute>} />
              
              {/* Service Engine Routes */}
              <Route path="/service/workshop-command" element={<RoleProtectedRoute permission={['service', 'workshop-command']}><WorkshopCommandPage /></RoleProtectedRoute>} />
              <Route path="/service" element={<RoleProtectedRoute permission="service"><ServiceLayout /></RoleProtectedRoute>}>
                <Route index element={<ServiceOverviewPage />} />
                <Route path="bays" element={<ServiceBaysPage />} />
                <Route path="maintenance" element={<ServiceMaintenancePage />} />
                <Route path="technicians" element={<ServiceTechniciansPage />} />
                <Route path="inventory" element={<ServiceInventoryPage />} />
                <Route path="operations" element={<OperationsPage />} />
                <Route path="scheduler" element={<SchedulerPage />} />
                <Route path="communication" element={<CommunicationPage />} />
                <Route path="quality" element={<ServiceQualityPage />} />
                <Route path="emergency" element={<ServiceEmergencyPage />} />
                <Route path="analytics" element={<ServiceAnalyticsPage />} />
              </Route>

              {/* Finance Routes */}
              <Route path="/finance" element={<RoleProtectedRoute permission="finance"><FinanceEngine /></RoleProtectedRoute>} />
              <Route path="/finance/ledger" element={<RoleProtectedRoute permission={['finance', 'general-ledger']}><GeneralLedgerPage /></RoleProtectedRoute>} />
              <Route path="/finance/credit-scoring" element={<RoleProtectedRoute permission="finance"><CreditScoringPage /></RoleProtectedRoute>} />
              <Route path="/finance/loan-approval" element={<RoleProtectedRoute permission="finance"><LoanApprovalPage /></RoleProtectedRoute>} />
              <Route path="/finance/risk-assessment" element={<RoleProtectedRoute permission="finance"><RiskAssessmentPage /></RoleProtectedRoute>} />
              <Route path="/finance/payments" element={<RoleProtectedRoute permission="finance"><PaymentProcessingPage /></RoleProtectedRoute>} />
              <Route path="/finance/fraud-detection" element={<RoleProtectedRoute permission="finance"><FraudDetectionPage /></RoleProtectedRoute>} />
              <Route path="/finance/calculator" element={<RoleProtectedRoute permission="finance"><LoanCalculatorPage /></RoleProtectedRoute>} />
              <Route path="/finance/compliance" element={<RoleProtectedRoute permission="finance"><CompliancePage /></RoleProtectedRoute>} />
              <Route path="/finance/analytics" element={<RoleProtectedRoute permission="finance"><FinanceAnalyticsPage /></RoleProtectedRoute>} />

              {/* Insurance Routes */}
              <Route path="/insurance" element={<RoleProtectedRoute permission="insurance"><InsuranceEngine /></RoleProtectedRoute>} />
              <Route path="/insurance/claims" element={<RoleProtectedRoute permission="insurance"><ClaimProcessingPage /></RoleProtectedRoute>} />
              <Route path="/insurance/damage-assessment" element={<RoleProtectedRoute permission="insurance"><DamageAssessmentPage /></RoleProtectedRoute>} />
              <Route path="/insurance/fraud-detection" element={<RoleProtectedRoute permission="insurance"><InsuranceFraudDetectionPage /></RoleProtectedRoute>} />
              <Route path="/insurance/policies" element={<RoleProtectedRoute permission="insurance"><PolicyRecommendationsPage /></RoleProtectedRoute>} />
              <Route path="/insurance/settlement" element={<RoleProtectedRoute permission="insurance"><SettlementCalculatorPage /></RoleProtectedRoute>} />
              <Route path="/insurance/documents" element={<RoleProtectedRoute permission="insurance"><DocumentManagementPage /></RoleProtectedRoute>} />
              <Route path="/insurance/analytics" element={<RoleProtectedRoute permission="insurance"><InsuranceAnalyticsPage /></RoleProtectedRoute>} />

              {/* Operations & AI Routes */}
              <Route path="/workforce" element={<RoleProtectedRoute permission="workforce"><WorkforceEngine /></RoleProtectedRoute>} />
              <Route path="/used-cars" element={<RoleProtectedRoute permission={['sales', 'used-cars']}><UsedCarEngine /></RoleProtectedRoute>} />
              <Route path="/daily-checklists" element={<DailyOperationsChecklistPage />} />
              <Route path="/operations/daily-checklist" element={<DailyOperationsChecklistPage />} />
              <Route path="/fleet" element={<RoleProtectedRoute permission="fleet"><FleetEngine /></RoleProtectedRoute>} />
              <Route path="/ev" element={<RoleProtectedRoute permission="ev"><EVIntelligencePage /></RoleProtectedRoute>} />
              <Route path="/oem" element={<RoleProtectedRoute permission="oem"><OEMDashboardPage /></RoleProtectedRoute>} />
              <Route path="/developer" element={<RoleProtectedRoute permission="developer"><DeveloperPortalPage /></RoleProtectedRoute>} />
              <Route path="/plans" element={<PlansPage />} />
              <Route path="/ai-os" element={<AIOperatingSystemPage />} />
              <Route path="/database-arch" element={<DatabaseArchitecturePage />} />
              <Route path="/backend-arch" element={<BackendArchitecturePage />} />
              <Route path="/tech-stack" element={<TechnologyStackPage />} />
              <Route path="/security" element={<SecurityCompliancePage />} />
              <Route path="/mobile-app" element={<MobileAppDesignPage />} />
              <Route path="/service-ai" element={<RoleProtectedRoute permission="service-ai"><ServiceAIDashboard activeCopilotRole="SERVICE" /></RoleProtectedRoute>} />
              <Route path="/sales-ai" element={<RoleProtectedRoute permission="sales-ai"><ServiceAIDashboard activeCopilotRole="SALES" /></RoleProtectedRoute>} />
              <Route path="/finance-ai" element={<RoleProtectedRoute permission="finance-ai"><ServiceAIDashboard activeCopilotRole="FINANCE" /></RoleProtectedRoute>} />
              <Route path="/insurance-ai" element={<RoleProtectedRoute permission="insurance-ai"><ServiceAIDashboard activeCopilotRole="INSURANCE" /></RoleProtectedRoute>} />
              <Route path="/fleet-ai" element={<RoleProtectedRoute permission="fleet-ai"><ServiceAIDashboard activeCopilotRole="FLEET_EV" /></RoleProtectedRoute>} />
              <Route path="/workforce-ai" element={<RoleProtectedRoute permission="workforce-ai"><ServiceAIDashboard activeCopilotRole="WORKFORCE" /></RoleProtectedRoute>} />
              <Route path="/ev-ai" element={<RoleProtectedRoute permission="ev-ai"><ServiceAIDashboard activeCopilotRole="FLEET_EV" /></RoleProtectedRoute>} />
              <Route path="/voice-ai" element={<ServiceAIDashboard activeCopilotRole="ALL" />} />
            </Routes>
          </main>
        </div>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <AIChatModal
          isOpen={isAIModalOpen}
          onClose={() => setIsAIModalOpen(false)}
          context={`${currentView} (User: ${user.name}, Role: ${user.role})`}
        />

        {/* Global Command Palette (Cmd+K / Ctrl+K) */}
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onOpenAICopilot={(prompt) => {
            setCopilotInitialPrompt(prompt);
            setIsAISidebarOpen(true);
          }}
        />

        {/* 320px Collapsible Specialist AI Sidebar Panel */}
        <AISidebarPanel
          isOpen={isAISidebarOpen}
          onClose={() => setIsAISidebarOpen(false)}
          initialPrompt={copilotInitialPrompt}
        />
      </div>
    </VoiceProvider>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <WhiteLabelProvider>
            <LocaleProvider>
              <AppContent />
            </LocaleProvider>
          </WhiteLabelProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
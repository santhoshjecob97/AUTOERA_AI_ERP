import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Bell, Search, Sparkles, RefreshCw, LogOut } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import SalesEngine from './pages/SalesEngine';
import ServiceLayout from './components/layouts/ServiceLayout';
import ServiceOverviewPage from './pages/service/ServiceOverviewPage';
import FinanceEngine from './pages/FinanceEngine';
import InsuranceEngine from './pages/InsuranceEngine';
import WorkforceEngine from './pages/WorkforceEngine';
import FleetEngine from './pages/FleetEngine';
import ServiceAIDashboard from './pages/ai-engines/ServiceAIDashboard';
import PlansPage from './pages/PlansPage';
import AIChatModal from './components/AIChatModal';
import LoginScreen from './components/LoginScreen';
import { ViewState } from './types';
import { VoiceProvider } from './context/VoiceContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import RoleProtectedRoute from './components/RoleProtectedRoute';

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
  const { user, isLoading, logout, retryInit } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // Derive current view from location
  const getCurrentView = (): ViewState => {
    const path = location.pathname;
    if (path.startsWith('/sales')) return 'sales';
    if (path.startsWith('/service')) return 'service';
    if (path.startsWith('/finance')) return 'finance';
    if (path.startsWith('/insurance')) return 'insurance';
    if (path.startsWith('/workforce')) return 'workforce';
    if (path.startsWith('/fleet')) return 'fleet';
    if (path.startsWith('/plans')) return 'plans';
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
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        <Sidebar
          currentView={currentView}
          onChangeView={(view) => {
            const routeMap: Record<ViewState, string> = {
              dashboard: '/',
              sales: '/sales',
              service: '/service',
              finance: '/finance',
              insurance: '/insurance',
              workforce: '/workforce',
              fleet: '/fleet',
              ev: '/ev',
              plans: '/plans',
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
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-30 shadow-xs">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 mr-4 md:hidden text-slate-500 hover:bg-slate-100 rounded-lg"
              >
                <Menu size={22} />
              </button>

              <div className="hidden md:flex flex-col">
                <span className="text-[11px] text-orange-600 font-bold uppercase tracking-wider">
                  {user.role} &bull; {user.organizationName || 'Apex Mobility Group'}
                </span>
                <span className="text-sm font-bold text-slate-900 capitalize font-['Outfit']">
                  {currentView === 'dashboard' ? 'Overview & Live Operations' : `${currentView} Management`}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="hidden md:flex relative">
                <input
                  type="text"
                  placeholder="Search vehicles, customers, job cards..."
                  className="pl-9 pr-4 py-2 bg-slate-100/90 border border-slate-200 focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-lg text-xs transition-all w-72 text-slate-800 placeholder-slate-400 outline-none"
                />
                <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
              </div>

              <button
                onClick={() => setIsAIModalOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-md shadow-orange-500/20 active:scale-[0.98] cursor-pointer"
              >
                <Sparkles size={15} className="text-amber-200" />
                <span className="hidden md:inline">AutoEra Copilot</span>
              </button>

              <button className="p-2 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors relative">
                <Bell size={19} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border border-white" />
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
                        sales: '/sales',
                        service: '/service',
                        finance: '/finance',
                        insurance: '/insurance',
                        workforce: '/workforce',
                        fleet: '/fleet',
                        ev: '/ev',
                        plans: '/plans',
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
              {/* Sales Routes */}
              <Route path="/sales" element={<RoleProtectedRoute permission="sales"><SalesEngine /></RoleProtectedRoute>} />
              <Route path="/sales/leads" element={<RoleProtectedRoute permission="sales"><LeadsPage /></RoleProtectedRoute>} />
              <Route path="/sales/showroom" element={<RoleProtectedRoute permission="sales"><VirtualShowroomPage /></RoleProtectedRoute>} />
              <Route path="/sales/pricing" element={<RoleProtectedRoute permission="sales"><PricingPage /></RoleProtectedRoute>} />
              <Route path="/sales/chatbot" element={<RoleProtectedRoute permission="sales"><ChatbotPage /></RoleProtectedRoute>} />
              <Route path="/sales/analytics" element={<RoleProtectedRoute permission="sales"><SalesAnalyticsPage /></RoleProtectedRoute>} />
              
              {/* Service Engine Routes */}
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
              <Route path="/fleet" element={<RoleProtectedRoute permission="fleet"><FleetEngine /></RoleProtectedRoute>} />
              <Route path="/plans" element={<PlansPage />} />
              <Route path="/service-ai" element={<RoleProtectedRoute permission="service-ai"><ServiceAIDashboard /></RoleProtectedRoute>} />
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
      </div>
    </VoiceProvider>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
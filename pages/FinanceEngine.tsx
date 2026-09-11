import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DollarSign, Percent, ShieldAlert, FileText, Plus, Search, ArrowUpRight, ArrowDownRight, CreditCard, Sparkles, PieChart as PieIcon, Activity, BarChart2, Download, Calculator, CheckCircle, Wallet, AlertTriangle, FileCheck } from 'lucide-react';
import StatCard from '../components/StatCard';
import { LoanApplication, Transaction } from '../types';
import LoanApplicationModal from '../components/LoanApplicationModal';
import FinanceAnalysisModal from '../components/FinanceAnalysisModal';
import FraudAnalysisModal from '../components/FraudAnalysisModal';
import EMIWidget from '../components/EMIWidget';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, BarChart, Bar } from 'recharts';
import CsvImportModal, { CsvColumn } from '../components/common/CsvImportModal';
import FinanceDashboard from '../components/dashboard/FinanceDashboard';
import VoiceCallButton from '../components/voice/VoiceCallButton';
import VoiceCallModal from '../components/voice/VoiceCallModal';
import UniversalVoiceCampaignSection from '../components/voice/UniversalVoiceCampaignSection';
import PageNavigation from '../components/common/PageNavigation';
import Section08FinanceWorkspace from '../components/finance/Section08FinanceWorkspace';

const initialLoans: LoanApplication[] = [
  { id: 'LN-2024-001', applicantName: 'Arjun Mehta', vehicle: 'Hyundai Creta', creditScore: 780, loanAmount: '₹12.5L', tenure: 60, status: 'Approved', riskLevel: 'Low', interestRate: 9.2, monthlyEMI: '₹26,050', aiProbability: 95 },
  { id: 'LN-2024-002', applicantName: 'Sneha Reddy', vehicle: 'Kia Seltos', creditScore: 650, loanAmount: '₹10.0L', tenure: 48, status: 'Review', riskLevel: 'Medium', interestRate: 10.5, monthlyEMI: '₹25,600', aiProbability: 60 },
  { id: 'LN-2024-003', applicantName: 'Vikram Singh', vehicle: 'Tata Nexon EV', creditScore: 820, loanAmount: '₹14.0L', tenure: 60, status: 'Pending', riskLevel: 'Low', interestRate: 8.9, monthlyEMI: '₹28,900', aiProbability: 98 },
  { id: 'LN-2024-004', applicantName: 'Pooja Desai', vehicle: 'Maruti Brezza', creditScore: 580, loanAmount: '₹8.0L', tenure: 36, status: 'Rejected', riskLevel: 'High', interestRate: 12.0, monthlyEMI: '₹26,500', aiProbability: 20 },
];

const initialTransactions: Transaction[] = [
    { id: 'TX-9981', customer: 'Amit P.', amount: '₹15,000', date: 'Today, 10:30 AM', type: 'Service Payment', status: 'Success' },
    { id: 'TX-9982', customer: 'Rajesh K.', amount: '₹2,50,000', date: 'Today, 09:15 AM', type: 'Vehicle Downpayment', status: 'Success' },
    { 
        id: 'TX-9983', customer: 'Unknown', amount: '₹45,000', date: 'Yesterday, 11:00 PM', type: 'Accessory Purchase', status: 'Fraud Alert',
        fraudAnalysis: {
            riskScore: 92,
            flaggedReasons: ['IP Address Mismatch (Nigeria)', 'Device ID not recognized', 'High Value Transaction for new user'],
            locationMismatch: true,
            deviceFingerprint: 'Suspicious',
            transactionVelocity: 'Critical',
            recommendation: 'Block'
        }
    },
    { id: 'TX-9984', customer: 'Sarah L.', amount: '₹5,600', date: 'Yesterday, 04:30 PM', type: 'Service Payment', status: 'Failed' },
];

const cashFlowData = [
    { name: 'Week 1', value: 4500000 },
    { name: 'Week 2', value: 5200000 },
    { name: 'Week 3', value: 4800000 },
    { name: 'Week 4', value: 6100000 },
];

const fraudTrendData = [
    { name: 'Mon', attempts: 4, blocked: 4 },
    { name: 'Tue', attempts: 2, blocked: 2 },
    { name: 'Wed', attempts: 6, blocked: 5 },
    { name: 'Thu', attempts: 3, blocked: 3 },
    { name: 'Fri', attempts: 8, blocked: 8 },
];

const loanStatusData = [
    { name: 'Approved', value: 45, color: '#10b981' },
    { name: 'Pending', value: 30, color: '#3b82f6' },
    { name: 'Rejected', value: 10, color: '#ef4444' },
    { name: 'Review', value: 15, color: '#f59e0b' },
];

const financeCsvColumns: CsvColumn[] = [
  { key: 'applicantName', label: 'Applicant full name', required: true },
  { key: 'email', label: 'Applicant email' },
  { key: 'phone', label: 'Contact phone number', required: true },
  { key: 'vehicleModel', label: 'Vehicle to be financed', required: true },
  { key: 'vehiclePrice', label: 'On-road price in INR', required: true },
  { key: 'downPayment', label: 'Down payment amount in INR' },
  { key: 'loanAmount', label: 'Requested loan amount in INR', required: true },
  { key: 'loanTenure', label: 'Loan tenure in months' },
  { key: 'employmentType', label: 'Employment type' },
  { key: 'monthlyIncome', label: 'Monthly income in INR' },
  { key: 'creditScore', label: 'Credit score (300-900)' },
  { key: 'status', label: 'Application status' },
];

const financeSampleRows = [
  {
    applicantName: 'Vikram Singh',
    email: 'vikram@example.com',
    phone: '+91-9876543214',
    vehicleModel: 'Hyundai Creta',
    vehiclePrice: '1800000',
    downPayment: '300000',
    loanAmount: '1500000',
    loanTenure: '60',
    employmentType: 'Salaried',
    monthlyIncome: '85000',
    creditScore: '750',
    status: 'Pending',
  },
  {
    applicantName: 'Anjali Desai',
    email: 'anjali@example.com',
    phone: '+91-9876543215',
    vehicleModel: 'Maruti Swift',
    vehiclePrice: '900000',
    downPayment: '200000',
    loanAmount: '700000',
    loanTenure: '48',
    employmentType: 'Self-Employed',
    monthlyIncome: '65000',
    creditScore: '720',
    status: 'Approved',
  },
];

type FinanceView = 'overview' | 'credit-scoring' | 'loan-approval' | 'risk-assessment' | 'payments' | 'fraud-detection' | 'calculator' | 'compliance' | 'analytics';

const FinanceEngine: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine active view from current route
  const getActiveView = (): FinanceView => {
    const path = location.pathname;
    if (path === '/finance/credit-scoring') return 'credit-scoring';
    if (path === '/finance/loan-approval') return 'loan-approval';
    if (path === '/finance/risk-assessment') return 'risk-assessment';
    if (path === '/finance/payments') return 'payments';
    if (path === '/finance/fraud-detection') return 'fraud-detection';
    if (path === '/finance/calculator') return 'calculator';
    if (path === '/finance/compliance') return 'compliance';
    if (path === '/finance/analytics') return 'analytics';
    return 'overview';
  };
  
  const activeView = getActiveView();
  const [loans, setLoans] = useState<LoanApplication[]>(initialLoans);
  const [transactions] = useState<Transaction[]>(initialTransactions);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [isFraudModalOpen, setIsFraudModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<LoanApplication | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [selectedLoanForCall, setSelectedLoanForCall] = useState<LoanApplication | null>(null);

  const handleAddLoan = (newLoanData: Omit<LoanApplication, 'id' | 'status'>) => {
    const newLoan: LoanApplication = {
        ...newLoanData,
        id: `LN-2024-00${loans.length + 1}`,
        status: 'Pending',
    };
    setLoans([newLoan, ...loans]);
  };

  const handleImportLoans = (rows: Omit<LoanApplication, 'id'>[]) => {
    const startIndex = loans.length + 1;
    const imported: LoanApplication[] = rows.map((data, idx) => ({
      ...data,
      id: `LN-2024-${String(startIndex + idx).padStart(3, '0')}`,
    }));
    setLoans([...imported, ...loans]);
  };

  const handleAnalyze = (loan: LoanApplication) => {
    setSelectedLoan(loan);
    setIsAnalysisOpen(true);
  };

  const handleAnalyzeFraud = (tx: Transaction) => {
      setSelectedTransaction(tx);
      setIsFraudModalOpen(true);
  };

  // Define tabs for navigation
  const tabs = [
    { id: 'overview', label: 'Overview', path: '/finance' },
    { id: 'credit-scoring', label: 'Credit Scoring', path: '/finance/credit-scoring' },
    { id: 'loan-approval', label: 'Loan Approval', path: '/finance/loan-approval' },
    { id: 'risk-assessment', label: 'Risk Assessment', path: '/finance/risk-assessment' },
    { id: 'payments', label: 'Payments', path: '/finance/payments' },
    { id: 'fraud-detection', label: 'Fraud Detection', path: '/finance/fraud-detection' },
    { id: 'calculator', label: 'Calculator', path: '/finance/calculator' },
    { id: 'compliance', label: 'Compliance', path: '/finance/compliance' },
    { id: 'analytics', label: 'Analytics', path: '/finance/analytics' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Navigation */}
      <PageNavigation
        tabs={tabs}
        engineName="Finance AI Engine"
        enginePath="/finance"
      />

      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5 font-['Outfit'] tracking-tight">
            <DollarSign className="text-emerald-500" size={28} /> Finance AI Engine
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Credit Scoring, Loan Approvals &amp; Fraud Detection.</p>
        </div>
        
        <div className="flex bg-slate-100/90 dark:bg-[#0c121e] p-1 rounded-2xl border border-slate-200 dark:border-slate-800 w-full xl:w-auto overflow-x-auto no-scrollbar shadow-xs">
          {[
            { id: 'overview', label: 'Overview', icon: DollarSign, route: '/finance' },
            { id: 'credit-scoring', label: 'Credit Scoring', icon: CreditCard, route: '/finance/credit-scoring' },
            { id: 'loan-approval', label: 'Loan Approval', icon: CheckCircle, route: '/finance/loan-approval' },
            { id: 'risk-assessment', label: 'Risk Assessment', icon: ShieldAlert, route: '/finance/risk-assessment' },
            { id: 'payments', label: 'Payments', icon: Wallet, route: '/finance/payments' },
            { id: 'fraud-detection', label: 'Fraud Detection', icon: AlertTriangle, route: '/finance/fraud-detection' },
            { id: 'calculator', label: 'Calculator', icon: Calculator, route: '/finance/calculator' },
            { id: 'compliance', label: 'Compliance', icon: FileCheck, route: '/finance/compliance' },
            { id: 'analytics', label: 'Analytics', icon: BarChart2, route: '/finance/analytics' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => navigate(tab.route)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeView === tab.id 
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 font-bold' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800/60'
              }`}
            >
              <tab.icon size={15} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons - Only show on overview */}
      {activeView === 'overview' && (
        <div className="flex flex-wrap gap-2.5">
          <button 
            onClick={() => setIsImportOpen(true)}
            className="bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold hover:border-orange-500/50 transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <Download size={14} /> Import
          </button>
          <button className="bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold hover:border-orange-500/50 transition-all cursor-pointer shadow-xs flex items-center gap-1.5">
            <FileText size={14} /> Reports
          </button>
          <button 
            onClick={() => setIsLoanModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <Plus size={15} /> New Application
          </button>
        </div>
      )}

      {/* Overview Page Content - Only show when on /finance route */}
      {activeView === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Total Revenue" value="₹2.4 Cr" trend="15%" trendUp={true} icon={<DollarSign size={24}/>} color="emerald" />
            <StatCard title="Loan Approval Rate" value="78%" trend="2%" trendUp={true} icon={<Percent size={24}/>} color="blue" />
            <StatCard title="Fraud Prevented" value="₹12.5L" trend="4 Cases" icon={<ShieldAlert size={24}/>} color="indigo" />
            <StatCard title="Pending Disbursals" value="₹45L" trend="8 Apps" trendUp={false} icon={<CreditCard size={24}/>} color="orange" />
          </div>
          
          {/* Section 08: Finance Module Master Architecture Workspace */}
          <Section08FinanceWorkspace />

          {/* Enterprise Analytics Dashboard */}
          <FinanceDashboard />

          {/* Voice AI Bulk Campaign Section */}
          <UniversalVoiceCampaignSection engineType="finance" />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Loan Table & Distribution Chart */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900">Recent Loan Applications</h3>
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-2.5 text-slate-400"/>
                        <input type="text" placeholder="Search applicant..." className="pl-8 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50 w-48"/>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="px-6 py-4 font-medium">Applicant</th>
                                <th className="px-6 py-4 font-medium">Loan Details</th>
                                <th className="px-6 py-4 font-medium">Credit Score</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loans.map((loan) => (
                                <tr key={loan.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{loan.applicantName}</div>
                                        <div className="text-xs text-slate-500">{loan.id}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-slate-900 font-medium">{loan.loanAmount}</div>
                                        <div className="text-xs text-slate-500">{loan.vehicle}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 bg-slate-100 rounded-full h-1.5">
                                                <div 
                                                    className={`h-1.5 rounded-full ${loan.creditScore >= 750 ? 'bg-green-500' : loan.creditScore >= 650 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                                                    style={{ width: `${(loan.creditScore / 900) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-semibold">{loan.creditScore}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                            ${loan.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                                            loan.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                                            loan.status === 'Review' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-blue-100 text-blue-800'}`}>
                                            {loan.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => handleAnalyze(loan)}
                                                className="text-emerald-600 hover:text-emerald-800 font-medium text-xs flex items-center gap-1.5 px-2 py-1 hover:bg-emerald-50 rounded transition-colors"
                                            >
                                                <Sparkles size={14} /> AI Analysis
                                            </button>
                                            <VoiceCallButton
                                                engineType="finance"
                                                contextData={loan}
                                                customerName={loan.applicantName}
                                                customerPhone={loan.phone || '+91-9876543210'}
                                                onClick={() => {
                                                    setSelectedLoanForCall(loan);
                                                    setIsVoiceModalOpen(true);
                                                }}
                                                variant="icon"
                                                size="sm"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Loan Status Distribution */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <PieIcon size={18} className="text-slate-500" /> Loan Portfolio Status
                    </h3>
                    <div className="h-48 flex items-center">
                        <div className="w-1/2 h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie 
                                        data={loanStatusData} 
                                        innerRadius={40} 
                                        outerRadius={60} 
                                        paddingAngle={5} 
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {loanStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-1/2 space-y-2">
                            {loanStatusData.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-slate-600 font-medium">{item.name} ({item.value}%)</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Interactive EMI Widget */}
                <EMIWidget />
            </div>
          </div>

          {/* Right Column Widgets */}
          <div className="space-y-6">
              {/* Cashflow Chart */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-4">Monthly Cash Flow</h3>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={cashFlowData}>
                            <defs>
                                <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}}/>
                            <YAxis hide/>
                            <Tooltip />
                            <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill="url(#colorFlow)" />
                        </AreaChart>
                    </ResponsiveContainer>
                  </div>
              </div>

              {/* Fraud Detection Section */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-4 border-b border-slate-100 bg-red-50 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                          <ShieldAlert size={18} className="text-red-600"/>
                          <h3 className="font-bold text-slate-900">Fraud Intelligence</h3>
                      </div>
                      <span className="text-[10px] bg-red-200 text-red-800 px-2 py-0.5 rounded-full font-bold">1 ALERT</span>
                  </div>
                  
                  {/* Fraud Trend Chart */}
                  <div className="p-4 border-b border-slate-100">
                     <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Threat Trends (Last 5 Days)</p>
                     <div className="h-24">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={fraudTrendData}>
                                <Bar dataKey="attempts" fill="#fee2e2" radius={[2, 2, 0, 0]} />
                                <Bar dataKey="blocked" fill="#dc2626" radius={[2, 2, 0, 0]} />
                                <Tooltip cursor={{fill: 'transparent'}} />
                            </BarChart>
                        </ResponsiveContainer>
                     </div>
                  </div>

                  <div className="divide-y divide-slate-100">
                      {transactions.filter(t => t.status === 'Fraud Alert').map((tx) => (
                           <div key={tx.id} className="p-4 bg-red-50/30">
                              <div className="flex justify-between items-start mb-2">
                                  <div>
                                      <p className="font-bold text-slate-900 text-sm">{tx.amount}</p>
                                      <p className="text-xs text-slate-500">{tx.customer} • {tx.type}</p>
                                  </div>
                                  <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-1 rounded">HIGH RISK</span>
                              </div>
                              <p className="text-xs text-red-700 mb-3 bg-red-50 p-2 rounded border border-red-100">
                                  <Activity size={12} className="inline mr-1"/>
                                  Anomaly: Location Mismatch (Nigeria IP)
                              </p>
                              <button 
                                onClick={() => handleAnalyzeFraud(tx)}
                                className="w-full py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded transition-colors shadow-sm"
                              >
                                  Investigate Threat
                              </button>
                           </div>
                      ))}
                      {transactions.filter(t => t.status !== 'Fraud Alert').slice(0, 3).map((tx) => (
                          <div key={tx.id} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center">
                              <div className="flex items-start gap-3">
                                  <div className={`p-2 rounded-lg ${
                                      tx.status === 'Failed' ? 'bg-orange-50 text-orange-600' :
                                      'bg-green-50 text-green-600'
                                  }`}>
                                      {tx.type.includes('Payment') ? <ArrowDownRight size={16}/> : <ArrowUpRight size={16}/>}
                                  </div>
                                  <div>
                                      <p className="text-sm font-bold text-slate-900">{tx.amount}</p>
                                      <p className="text-xs text-slate-500 truncate w-32">{tx.customer} • {tx.type}</p>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>
        </>
      )}

      {/* Placeholder pages for other tabs - Will be implemented in subsequent tasks */}
      {activeView === 'credit-scoring' && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-8 text-center">
          <CreditCard size={48} className="mx-auto text-purple-600 mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Credit Scoring</h2>
          <p className="text-slate-600 mb-4">AI-powered credit assessment with instant scoring and risk analysis.</p>
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium">
            <Sparkles size={16} /> Coming Soon - Task 2
          </div>
        </div>
      )}

      {activeView === 'loan-approval' && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-8 text-center">
          <CheckCircle size={48} className="mx-auto text-green-600 mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Loan Approval Workflow</h2>
          <p className="text-slate-600 mb-4">Three-tier approval queues with AI-powered instant approvals.</p>
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium">
            <Sparkles size={16} /> Coming Soon - Task 3
          </div>
        </div>
      )}

      {activeView === 'risk-assessment' && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-8 text-center">
          <ShieldAlert size={48} className="mx-auto text-amber-600 mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Risk Assessment</h2>
          <p className="text-slate-600 mb-4">Portfolio risk monitoring with AI mitigation strategies and stress testing.</p>
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-lg text-sm font-medium">
            <Sparkles size={16} /> Coming Soon - Task 4
          </div>
        </div>
      )}

      {activeView === 'payments' && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-8 text-center">
          <Wallet size={48} className="mx-auto text-blue-600 mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Processing</h2>
          <p className="text-slate-600 mb-4">AI-optimized payment scheduling with overdue management and collection analytics.</p>
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium">
            <Sparkles size={16} /> Coming Soon - Task 5
          </div>
        </div>
      )}

      {activeView === 'fraud-detection' && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-8 text-center">
          <AlertTriangle size={48} className="mx-auto text-red-600 mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Fraud Detection</h2>
          <p className="text-slate-600 mb-4">Real-time fraud alerts with AI-powered threat intelligence and pattern recognition.</p>
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium">
            <Sparkles size={16} /> Coming Soon - Task 6
          </div>
        </div>
      )}

      {activeView === 'calculator' && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-8 text-center">
          <Calculator size={48} className="mx-auto text-indigo-600 mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Loan Calculator</h2>
          <p className="text-slate-600 mb-4">Interactive EMI calculator with real-time cost breakdown and comparison tools.</p>
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium">
            <Sparkles size={16} /> Coming Soon - Task 7
          </div>
        </div>
      )}

      {activeView === 'compliance' && (
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200 rounded-xl p-8 text-center">
          <FileCheck size={48} className="mx-auto text-slate-600 mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Compliance Dashboard</h2>
          <p className="text-slate-600 mb-4">Regulatory compliance tracking with audit trails and security certifications.</p>
          <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium">
            <Sparkles size={16} /> Coming Soon - Task 8
          </div>
        </div>
      )}

      {activeView === 'analytics' && (
        <div className="bg-gradient-to-r from-teal-50 to-green-50 border border-teal-200 rounded-xl p-8 text-center">
          <BarChart2 size={48} className="mx-auto text-teal-600 mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Analytics Dashboard</h2>
          <p className="text-slate-600 mb-4">Comprehensive KPIs with trend analysis, benchmarks, and predictive forecasting.</p>
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-lg text-sm font-medium">
            <Sparkles size={16} /> Coming Soon - Task 9
          </div>
        </div>
      )}

      <LoanApplicationModal 
        isOpen={isLoanModalOpen}
        onClose={() => setIsLoanModalOpen(false)}
        onAdd={handleAddLoan}
      />

      <FinanceAnalysisModal 
        isOpen={isAnalysisOpen}
        onClose={() => setIsAnalysisOpen(false)}
        application={selectedLoan}
      />

      <FraudAnalysisModal 
        isOpen={isFraudModalOpen}
        onClose={() => setIsFraudModalOpen(false)}
        transaction={selectedTransaction}
      />

      {isImportOpen && (
        <CsvImportModal
          isOpen={isImportOpen}
          title="Import Finance Applications"
          description="Upload finance_applications_template.csv to bulk import loan applications. Required: applicantName, phone, vehicleModel, vehiclePrice, loanAmount."
          columns={financeCsvColumns}
          sampleRows={financeSampleRows}
          mapRow={(raw) => {
            const trim = (v: unknown) => (v == null ? '' : String(v).trim());

            const applicantName = trim((raw as any).applicantName);
            const email = trim((raw as any).email);
            const phone = trim((raw as any).phone);
            const vehicleModel = trim((raw as any).vehicleModel);
            const vehiclePriceRaw = trim((raw as any).vehiclePrice);
            const loanAmountRaw = trim((raw as any).loanAmount);
            const downPaymentRaw = trim((raw as any).downPayment);
            const loanTenureRaw = trim((raw as any).loanTenure);
            const employmentType = trim((raw as any).employmentType);
            const monthlyIncomeRaw = trim((raw as any).monthlyIncome);
            const creditScoreRaw = trim((raw as any).creditScore);
            const statusRaw = trim((raw as any).status);

            if (!applicantName) return { error: 'applicantName is required' };
            if (!phone) return { error: 'phone is required' };
            if (!vehicleModel) return { error: 'vehicleModel is required' };
            if (!vehiclePriceRaw) return { error: 'vehiclePrice is required' };
            if (!loanAmountRaw) return { error: 'loanAmount is required' };

            const phoneClean = phone.replace(/\s+/g, '');
            if (!/^\+?[0-9\-]+$/.test(phoneClean)) {
              return { error: 'Invalid phone format. Use country code, e.g. +91-9876543210' };
            }

            if (email) {
              const emailRegex = /[^@\s]+@[^@\s]+\.[^@\s]+/;
              if (!emailRegex.test(email)) {
                return { error: 'Invalid email format' };
              }
            }

            const vehiclePrice = Number(vehiclePriceRaw.replace(/,/g, ''));
            const loanAmount = Number(loanAmountRaw.replace(/,/g, ''));
            if (!Number.isFinite(vehiclePrice) || vehiclePrice <= 0) {
              return { error: 'vehiclePrice must be a positive number (no currency symbols)' };
            }
            if (!Number.isFinite(loanAmount) || loanAmount <= 0) {
              return { error: 'loanAmount must be a positive number (no currency symbols)' };
            }
            if (loanAmount > vehiclePrice) {
              return { error: 'Loan amount cannot exceed vehicle price' };
            }

            let downPayment: number | undefined;
            if (downPaymentRaw) {
              const val = Number(downPaymentRaw.replace(/,/g, ''));
              if (!Number.isFinite(val) || val <= 0) {
                return { error: 'downPayment must be a positive number (no currency symbols)' };
              }
              downPayment = val;
            }

            let monthlyIncome: number | undefined;
            if (monthlyIncomeRaw) {
              const val = Number(monthlyIncomeRaw.replace(/,/g, ''));
              if (!Number.isFinite(val) || val <= 0) {
                return { error: 'monthlyIncome must be a positive number (no currency symbols)' };
              }
              monthlyIncome = val;
            }

            let creditScore = 750;
            if (creditScoreRaw) {
              const val = Number(creditScoreRaw);
              if (!Number.isFinite(val) || val < 300 || val > 900) {
                return { error: 'creditScore must be between 300 and 900' };
              }
              creditScore = val;
            }

            let tenure = 60;
            if (loanTenureRaw) {
              const val = Number(loanTenureRaw);
              const allowed = [12, 24, 36, 48, 60, 72, 84];
              if (!allowed.includes(val)) {
                return { error: 'loanTenure must be one of: 12, 24, 36, 48, 60, 72, 84' };
              }
              tenure = val;
            }

            let status: LoanApplication['status'] = 'Pending';
            if (statusRaw) {
              const normalized = statusRaw.toLowerCase();
              const map: Record<string, LoanApplication['status']> = {
                pending: 'Pending',
                approved: 'Approved',
                rejected: 'Rejected',
                review: 'Review',
              };
              if (!map[normalized]) {
                return { error: 'Status must be one of: Pending, Approved, Rejected, Review' };
              }
              status = map[normalized];
            }

            let riskLevel: LoanApplication['riskLevel'];
            if (creditScore >= 750) riskLevel = 'Low';
            else if (creditScore >= 650) riskLevel = 'Medium';
            else riskLevel = 'High';

            const interestRate = riskLevel === 'Low' ? 9.0 : riskLevel === 'Medium' ? 10.5 : 12.5;
            const R = interestRate / 12 / 100;
            const N = tenure;
            let monthlyEmi = 0;
            if (loanAmount > 0 && R > 0 && N > 0) {
              const factor = Math.pow(1 + R, N);
              monthlyEmi = loanAmount * (R * factor) / (factor - 1);
            }

            const aiProbability = riskLevel === 'Low' ? 95 : riskLevel === 'Medium' ? 75 : 45;

            const value: Omit<LoanApplication, 'id'> = {
              applicantName,
              vehicle: vehicleModel,
              creditScore,
              loanAmount: `₹${(loanAmount / 100000).toFixed(1)}L`,
              tenure,
              status,
              riskLevel,
              interestRate,
              monthlyEMI: `₹${Math.round(monthlyEmi).toLocaleString('en-IN')}`,
              aiProbability,
              email: email || undefined,
              phone,
              vehiclePrice: vehiclePrice.toString(),
              downPayment: downPayment != null ? downPayment.toString() : undefined,
              employmentType: employmentType || undefined,
              monthlyIncome: monthlyIncome != null ? monthlyIncome.toString() : undefined,
            };

            return { value };
          }}
          onImport={(rows) => {
            handleImportLoans(rows as Omit<LoanApplication, 'id'>[]);
            setIsImportOpen(false);
          }}
          onClose={() => setIsImportOpen(false)}
        />
      )}

      {/* Voice Call Modal */}
      {isVoiceModalOpen && selectedLoanForCall && (
        <VoiceCallModal
          isOpen={isVoiceModalOpen}
          onClose={() => {
            setIsVoiceModalOpen(false);
            setSelectedLoanForCall(null);
          }}
          engineType="finance"
          contextData={selectedLoanForCall}
          customerName={selectedLoanForCall.applicantName}
          customerPhone={selectedLoanForCall.phone || '+91-9876543210'}
        />
      )}
    </div>
  );
};

export default FinanceEngine;
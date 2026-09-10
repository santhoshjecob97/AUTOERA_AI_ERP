import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  Building2,
  Send,
  Zap,
  TrendingUp,
  CreditCard,
  Percent,
  Clock,
  ArrowRight,
  Sparkles,
  Smartphone,
  AlertCircle,
  Download,
  Lock,
  DollarSign,
  ChevronRight,
  RefreshCw,
  Award
} from 'lucide-react';

interface BankQuote {
  bank: string;
  rackRate: number;
  effectiveRate: number;
  emi: number;
  procFee: number;
  maxLtv: number;
  prepayment: string;
  probabilityPct: number;
  recommended?: boolean;
}

const initialBankQuotes: BankQuote[] = [
  { bank: 'State Bank of India', rackRate: 8.50, effectiveRate: 7.00, emi: 19801, procFee: 2500, maxLtv: 85, prepayment: 'NIL after 12m', probabilityPct: 88, recommended: true },
  { bank: 'Punjab National Bank', rackRate: 8.60, effectiveRate: 7.10, emi: 19848, procFee: 3000, maxLtv: 85, prepayment: 'NIL Foreclosure', probabilityPct: 84 },
  { bank: 'Bank of Baroda', rackRate: 8.65, effectiveRate: 7.15, emi: 19872, procFee: 3500, maxLtv: 90, prepayment: 'Zero Prepayment Fee', probabilityPct: 86 },
  { bank: 'Canara Bank', rackRate: 8.65, effectiveRate: 7.15, emi: 19872, procFee: 3000, maxLtv: 85, prepayment: 'NIL after 12m', probabilityPct: 82 },
  { bank: 'Kotak Mahindra Bank', rackRate: 8.70, effectiveRate: 7.20, emi: 19896, procFee: 4000, maxLtv: 90, prepayment: '2% before 24m', probabilityPct: 89 },
  { bank: 'HDFC Bank', rackRate: 8.75, effectiveRate: 7.25, emi: 19919, procFee: 5000, maxLtv: 90, prepayment: 'NIL after 24m', probabilityPct: 92, recommended: true },
  { bank: 'ICICI Bank', rackRate: 8.85, effectiveRate: 7.35, emi: 19967, procFee: 5000, maxLtv: 90, prepayment: 'NIL after 18m', probabilityPct: 90 },
  { bank: 'Axis Bank', rackRate: 8.90, effectiveRate: 7.40, emi: 19991, procFee: 5000, maxLtv: 95, prepayment: 'NIL on Part-payment', probabilityPct: 85 },
  { bank: 'IndusInd Bank', rackRate: 8.95, effectiveRate: 7.45, emi: 20015, procFee: 5000, maxLtv: 90, prepayment: 'NIL after 12m', probabilityPct: 87 },
  { bank: 'Tata Capital', rackRate: 9.25, effectiveRate: 7.75, emi: 20160, procFee: 7500, maxLtv: 85, prepayment: '3% Outstanding', probabilityPct: 94 }
];

const subventionSchemes = [
  { id: 'TATA_FESTIVE', name: 'Tata Motors Festive Drive — 2.0% Subvention', subsidy: 2.0, oemShare: 1.5, dealerShare: 0.5, models: 'Nexon, Harrier, Safari, Curvv' },
  { id: 'EV_GREEN', name: 'EV Green Mobility Scheme — 1.5% Subvention', subsidy: 1.5, oemShare: 1.0, dealerShare: 0.5, models: 'Nexon EV, Punch EV, Tiago EV' },
  { id: 'NONE', name: 'Standard Commercial Rates (No OEM Subvention)', subsidy: 0.0, oemShare: 0.0, dealerShare: 0.0, models: 'All Other Vehicles' }
];

export const Section08FinanceWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'flow' | 'prescreen' | 'digilocker' | 'bank_api' | 'nach_commission'>('flow');
  
  // 14-Step Flow State
  const [currentStep, setCurrentStep] = useState(7); // default at review step
  
  // Pre-Screen Inputs
  const [monthlyIncome, setMonthlyIncome] = useState(95000);
  const [existingEmi, setExistingEmi] = useState(15000);
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [tenure, setTenure] = useState(60);
  const [employmentType, setEmploymentType] = useState('SALARIED');
  const [selectedSubvention, setSelectedSubvention] = useState(subventionSchemes[1]);
  const [isPreScreening, setIsPreScreening] = useState(false);
  const [preScreenDone, setPreScreenDone] = useState(true);

  // DigiLocker State
  const [digiStatus, setDigiStatus] = useState<'IDLE' | 'SENT' | 'AUTHENTICATED'>('AUTHENTICATED');
  const [ocrVerified, setOcrVerified] = useState(true);

  // Bank Submission State
  const [submissionStatus, setSubmissionStatus] = useState<'PENDING' | 'SUBMITTED' | 'APPROVED'>('APPROVED');
  const [bankAck, setBankAck] = useState('HDFC-AUTO-202609091531');

  // Disbursement & Commission
  const [disbursedAmount, setDisbursedAmount] = useState(950000);
  const [invoiceAmount] = useState(1150000);

  const calculateFoir = () => {
    if (monthlyIncome <= 0) return 0;
    return Math.round((existingEmi / monthlyIncome) * 100);
  };

  const calculateMaxBorrowing = () => {
    const foirMax = employmentType === 'SALARIED' ? 0.55 : 0.50;
    const availableEmi = Math.max(0, (monthlyIncome * foirMax) - existingEmi);
    return Math.round((availableEmi / 2064) * 100000);
  };

  const handleRunPreScreen = () => {
    setIsPreScreening(true);
    setTimeout(() => {
      setIsPreScreening(false);
      setPreScreenDone(true);
    }, 1200);
  };

  const steps14 = [
    { num: 1, title: 'Customer Interest', desc: 'Customer expresses EMI interest to Sales Consultant', tag: 'Sales Lead' },
    { num: 2, title: 'Data Entry', desc: 'Enter income, employment, existing EMI, city', tag: 'Data Input' },
    { num: 3, title: 'AI Pre-Screen', desc: 'Approval probability per bank in 20s (no bureau pull)', tag: 'AI Engine', highlight: true },
    { num: 4, title: 'Select Bank', desc: 'Customer selects preferred bank + tenure from recommendations', tag: 'Decision' },
    { num: 5, title: 'DigiLocker WhatsApp', desc: 'System WhatsApps customer secure DigiLocker upload link', tag: 'WhatsApp API', highlight: true },
    { num: 6, title: 'Paperless Fetch', desc: 'Customer uploads -> DigiLocker API fetches authenticated docs directly', tag: 'DigiLocker API' },
    { num: 7, title: 'OCR & Cross-Check', desc: 'OCR extracts all fields -> system cross-validates name, income, PAN-Aadhaar', tag: 'OCR Vision', highlight: true },
    { num: 8, title: 'Manager Review', desc: 'Finance Manager reviews verified document set -> submits to bank API', tag: 'Review' },
    { num: 9, title: 'Bank API ACK', desc: 'Bank API returns ACK number + expected decision SLA (4 hrs)', tag: 'Bank API' },
    { num: 10, title: '4h Polling', desc: 'System polls bank API every 4h -> on approval: Manager notified in 5m', tag: 'Polling Engine', highlight: true },
    { num: 11, title: 'Sanction Review', desc: 'Finance Manager reviews conditions -> confirms disbursement date with dealer', tag: 'Sanction' },
    { num: 12, title: 'Disbursement', desc: 'Bank transfers loan amount to dealer account -> system records transfer', tag: 'Bank Transfer' },
    { num: 13, title: '1% Commission', desc: '1% auto-calculated and added to monthly dealer commission ledger', tag: '1% Payout', highlight: true },
    { num: 14, title: 'Customer Pack', desc: 'Customer receives loan account no, first EMI date, NACH mandate confirmation', tag: 'Completion' }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-6 shadow-xl relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Module 08 • Auto-Loan Intelligence
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              P0 MVP + P1 Full Suite
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
              1% Commission Engine
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            Finance Module & Multi-Bank EMI Ecosystem
          </h2>
          <p className="text-sm text-slate-400">
            20-Sec Bureau-Free AI Pre-Screening • DigiLocker Paperless KYC • 10+ Bank Quotes • NPCI e-NACH • OEM Subventions
          </p>
        </div>

        {/* Action Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('flow')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'flow' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Zap size={14} /> 14-Step Flow
          </button>
          <button
            onClick={() => setActiveTab('prescreen')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'prescreen' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <TrendingUp size={14} /> AI Pre-Screen & 10 Banks
          </button>
          <button
            onClick={() => setActiveTab('digilocker')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'digilocker' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck size={14} /> DigiLocker & OCR
          </button>
          <button
            onClick={() => setActiveTab('bank_api')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'bank_api' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Building2 size={14} /> Bank API & 4h Poller
          </button>
          <button
            onClick={() => setActiveTab('nach_commission')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'nach_commission' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Percent size={14} /> NACH & 1% Commission
          </button>
        </div>
      </div>

      {/* TAB 1: 14-Step End-to-End Processing Flow */}
      {activeTab === 'flow' && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div className="flex items-center justify-between bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="text-emerald-400" size={16} /> Finance Application End-to-End SLA Lifecycle
              </h3>
              <p className="text-xs text-slate-400">
                14-step automated pipeline connecting customer enquiry, DigiLocker KYC, Bank APIs, and 1% dealer commission.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Active Stage:</span>
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Step {currentStep} / 14
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
            {steps14.map((s) => {
              const isPast = s.num < currentStep;
              const isCurrent = s.num === currentStep;
              return (
                <div
                  key={s.num}
                  onClick={() => setCurrentStep(s.num)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                    isCurrent
                      ? 'bg-emerald-950/40 border-emerald-500 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500'
                      : isPast
                      ? 'bg-slate-950/50 border-emerald-500/40 text-slate-300'
                      : 'bg-slate-950/30 border-slate-800/80 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isPast ? 'bg-emerald-500 text-slate-950' : isCurrent ? 'bg-emerald-400 text-slate-950 animate-pulse' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {isPast ? '✓' : s.num}
                      </span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        s.highlight ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {s.tag}
                      </span>
                    </div>
                    <div className="font-semibold text-xs text-white line-clamp-1">{s.title}</div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug line-clamp-3">{s.desc}</p>
                  </div>
                  {isCurrent && (
                    <div className="mt-2 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                      Current Focus <ChevronRight size={12} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-300">Quick Simulation:</span>
              <button
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium"
              >
                Previous Step
              </button>
              <button
                onClick={() => setCurrentStep(Math.min(14, currentStep + 1))}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium"
              >
                Next Step
              </button>
              <button
                onClick={() => setCurrentStep(14)}
                className="px-3 py-1 bg-blue-600/80 hover:bg-blue-500 text-white rounded-lg font-medium"
              >
                Fast-Forward to Completion (Step 14)
              </button>
            </div>
            <div className="text-slate-400">
              Elapsed Time: <span className="text-emerald-400 font-mono font-semibold">18 min (DigiLocker) + 4h (Bank SLA)</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI Pre-Screening & 10-Bank EMI Comparison */}
      {activeTab === 'prescreen' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Form */}
            <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Sparkles className="text-amber-400" size={16} /> 20-Sec Pre-Screen Inputs
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                  No Bureau Pull
                </span>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Monthly In-Hand Income (INR)</label>
                <input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-medium focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Existing Monthly EMIs (INR)</label>
                <input
                  type="number"
                  value={existingEmi}
                  onChange={(e) => setExistingEmi(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-medium focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Employment Type</label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white"
                  >
                    <option value="SALARIED">Salaried (MNC/Govt)</option>
                    <option value="SELF_EMPLOYED">Self-Employed Prof.</option>
                    <option value="BUSINESS">Business Owner</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Tenure (Months)</label>
                  <select
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white"
                  >
                    <option value={36}>36 Months (3 Yrs)</option>
                    <option value={48}>48 Months (4 Yrs)</option>
                    <option value={60}>60 Months (5 Yrs)</option>
                    <option value={84}>84 Months (7 Yrs)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">OEM Subvention Scheme</label>
                <select
                  value={selectedSubvention.id}
                  onChange={(e) => {
                    const found = subventionSchemes.find(s => s.id === e.target.value);
                    if (found) setSelectedSubvention(found);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-amber-300 font-medium"
                >
                  {subventionSchemes.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.subsidy > 0 ? `-${s.subsidy}% Subsidy` : 'Rack'})
                    </option>
                  ))}
                </select>
                <div className="text-[11px] text-slate-400 mt-1">
                  OEM Share: {selectedSubvention.oemShare}% • Dealer Share: {selectedSubvention.dealerShare}%
                </div>
              </div>

              <button
                onClick={handleRunPreScreen}
                disabled={isPreScreening}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-lg text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                {isPreScreening ? (
                  <>
                    <RefreshCw className="animate-spin" size={14} /> Evaluating FOIR & 10 Banks...
                  </>
                ) : (
                  <>
                    <Zap size={14} /> Run 20-Sec Pre-Screen Algorithm
                  </>
                )}
              </button>
            </div>

            {/* Pre-Screen Result Card */}
            <div className="lg:col-span-2 bg-slate-950/70 border border-slate-800 p-5 rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-white">AI Eligibility & FOIR Analysis</h3>
                  <p className="text-xs text-slate-400">Calculated under 20-second SLA without bureau pull.</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">
                  Execution: 18s SLA Met
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">FOIR Utilization</div>
                  <div className="text-xl font-bold text-white mt-1">{calculateFoir()}%</div>
                  <div className="text-[11px] text-emerald-400 mt-0.5">Max Permitted: {employmentType === 'SALARIED' ? '55%' : '50%'}</div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: `${Math.min(100, calculateFoir() * 1.8)}%` }} />
                  </div>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">Max Borrowing Capacity</div>
                  <div className="text-xl font-bold text-emerald-400 mt-1">₹{(calculateMaxBorrowing() / 100000).toFixed(2)} Lakhs</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Based on 60m tenure capacity</div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-blue-500 h-full" style={{ width: `${Math.min(100, (loanAmount / calculateMaxBorrowing()) * 100)}%` }} />
                  </div>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">Top Recommended Lender</div>
                  <div className="text-xl font-bold text-white mt-1">HDFC Bank</div>
                  <div className="text-[11px] text-amber-300 mt-0.5">92% Sanction Probability</div>
                  <div className="text-[11px] text-slate-400 mt-1">Fastest 4-Hour Sanction SLA</div>
                </div>
              </div>

              {/* 10-Bank Live Comparison Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Live Quotes Across 10+ Tier-1 Banking Partners
                  </h4>
                  <span className="text-[11px] text-amber-400 font-medium">
                    {selectedSubvention.subsidy > 0 ? `Active: ${selectedSubvention.subsidy}% Subvention Applied` : 'Rack Rates'}
                  </span>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/90 text-slate-400">
                      <tr>
                        <th className="py-2.5 px-3">Bank Name</th>
                        <th className="py-2.5 px-3">Effective ROI</th>
                        <th className="py-2.5 px-3">Monthly EMI</th>
                        <th className="py-2.5 px-3">Processing Fee</th>
                        <th className="py-2.5 px-3">Max LTV</th>
                        <th className="py-2.5 px-3">Prepayment Terms</th>
                        <th className="py-2.5 px-3">AI Probability</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {initialBankQuotes.map((b) => {
                        const effRate = (b.rackRate - selectedSubvention.subsidy).toFixed(2);
                        return (
                          <tr key={b.bank} className={`hover:bg-slate-900/50 ${b.recommended ? 'bg-emerald-950/20' : ''}`}>
                            <td className="py-2.5 px-3 font-semibold text-white flex items-center gap-1.5">
                              {b.bank}
                              {b.recommended && (
                                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded">
                                  Top Pick
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 font-mono font-semibold text-emerald-400">
                              {effRate}% <span className="text-[10px] text-slate-500 line-through">({b.rackRate}%)</span>
                            </td>
                            <td className="py-2.5 px-3 font-mono font-bold text-white">₹{b.emi.toLocaleString()}</td>
                            <td className="py-2.5 px-3">₹{b.procFee.toLocaleString()}</td>
                            <td className="py-2.5 px-3">{b.maxLtv}%</td>
                            <td className="py-2.5 px-3 text-slate-400">{b.prepayment}</td>
                            <td className="py-2.5 px-3">
                              <span className="font-semibold text-emerald-400">{b.probabilityPct}%</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DigiLocker & OCR Verification */}
      {activeTab === 'digilocker' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* WhatsApp DigiLocker Link Card */}
            <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Smartphone className="text-emerald-400" size={16} /> DigiLocker WhatsApp Paperless KYC
                </h3>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                  Govt Authenticated
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Sends a zero-friction WhatsApp consent link to the applicant. Documents are retrieved directly from Govt DigiLocker servers without customer scanning or uploading fraud risk.
              </p>

              {/* Message Preview Box */}
              <div className="bg-slate-900 border border-slate-700/80 p-3.5 rounded-xl text-xs space-y-2 font-mono">
                <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <Send size={12} /> WhatsApp Business API [Automated]
                </div>
                <div className="text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  "Hi Rahul Sharma, your auto loan is pre-screened with HDFC Bank at 7.25%! Complete your paperless DigiLocker document verification in 2 minutes: <span className="text-blue-400 underline">https://digilocker.autoera.ai/auth/cbf803b4</span>"
                </div>
                <div className="text-[11px] text-slate-500 flex justify-between">
                  <span>Delivered via Meta WhatsApp Gateway</span>
                  <span className="text-emerald-400">✓✓ Read by Customer</span>
                </div>
              </div>

              {/* Status button */}
              <div className="flex gap-3">
                <button
                  onClick={() => setDigiStatus('AUTHENTICATED')}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 rounded-lg text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <CheckCircle2 size={14} /> Fetch Authenticated DigiLocker Set
                </button>
              </div>

              {/* Verified Documents Checklist */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Govt Verified Dossier</h4>
                {[
                  { name: 'Aadhaar Card (UIDAI)', issuer: 'UIDAI Govt of India', id: 'XXXX-XXXX-4821', status: 'VERIFIED_XML' },
                  { name: 'Permanent Account Number (PAN)', issuer: 'Income Tax Dept', id: 'ABCPS1234D', status: 'VERIFIED_OPERATIVE' },
                  { name: '6-Month Bank Statement', issuer: 'HDFC Bank Netbanking API', id: 'Avg ₹1.15L Credit', status: 'VERIFIED_SALARY' },
                  { name: 'Form 16 / ITR 2025-26', issuer: 'TCS Ltd / Tax Portal', id: 'Gross ₹14.80L', status: 'VERIFIED_ITR' }
                ].map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                        ✓
                      </div>
                      <div>
                        <div className="font-semibold text-white">{doc.name}</div>
                        <div className="text-[11px] text-slate-400">{doc.issuer} • {doc.id}</div>
                      </div>
                    </div>
                    <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[10px] px-2 py-0.5 rounded">
                      AUTHENTICATED
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Document OCR & Cross-Validation Engine */}
            <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <ShieldCheck className="text-blue-400" size={16} /> Document OCR & Cross-Field Validation
                </h3>
                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono">
                  Zero Mismatch SLA
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                AI Cross-checks all fields before submission to bank API, eliminating pre-sanction rejections and turnaround delays.
              </p>

              {/* Validation Cards */}
              <div className="space-y-3">
                <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">Name Match (Fuzzy Levenshtein)</div>
                    <div className="text-sm font-bold text-white mt-0.5">Rahul Sharma (Application vs Aadhaar)</div>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-bold font-mono text-sm">98% Match</span>
                    <div className="text-[10px] text-slate-400">Threshold &ge; 80%</div>
                  </div>
                </div>

                <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">PAN - Aadhaar Linkage</div>
                    <div className="text-sm font-bold text-white mt-0.5">UIDAI & NSDL Link Confirmed</div>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-bold text-xs bg-emerald-500/20 px-2 py-0.5 rounded">LINKED</span>
                  </div>
                </div>

                <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">Declared Salary vs Bank Statement</div>
                    <div className="text-sm font-bold text-white mt-0.5">Declared: ₹95,000 | 6m Avg: ₹1,15,000</div>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-bold text-xs bg-emerald-500/20 px-2 py-0.5 rounded">PASSED (0% Risk)</span>
                  </div>
                </div>

                <div className="bg-emerald-950/30 border border-emerald-500/40 p-3.5 rounded-xl">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 size={14} /> Dossier Ready for 1-Click Bank Submission
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">
                    All 4 government documents authenticated. Zero mismatches flagged. Expected bank sanction time: 4 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Bank Application API & 4-Hour SLA Poller */}
      {activeTab === 'bank_api' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1-Click Submission Card */}
            <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Building2 className="text-blue-400" size={16} /> 1-Click Bank API Submission
                </h3>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                  HDFC Bank Direct API
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Selected Partner:</span>
                  <span className="text-white font-semibold">HDFC Bank Limited</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Requested Loan Amount:</span>
                  <span className="text-white font-semibold">₹10,00,000</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Subvention Scheme:</span>
                  <span className="text-amber-300 font-semibold">EV Green Mobility (-1.5%)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Effective Interest Rate:</span>
                  <span className="text-emerald-400 font-bold">7.25% p.a.</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Acknowledgement Number:</span>
                  <span className="text-blue-400 font-mono font-bold">{bankAck}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSubmissionStatus('SUBMITTED');
                  setTimeout(() => setSubmissionStatus('APPROVED'), 1500);
                }}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
              >
                <Send size={14} /> Submit Application Dossier to Bank API
              </button>
            </div>

            {/* 4-Hourly Status Poller & Sanction Letter */}
            <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Clock className="text-amber-400" size={16} /> 4-Hour Status Polling Engine
                </h3>
                <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">
                  Every 4 Hours
                </span>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Decision Status:</span>
                    <span className="px-2 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-400">
                      {submissionStatus === 'APPROVED' ? 'SANCTIONED' : 'UNDER_APPRAISAL'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Approved Loan Amount:</span>
                    <span className="font-bold text-white">₹9,50,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sanctioned ROI:</span>
                    <span className="font-bold text-emerald-400">7.25% (Fixed)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Notification SLA:</span>
                    <span className="text-slate-300">Finance Manager alerted in 5 min</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-white">
                    <FileText className="text-emerald-400" size={16} />
                    <span>HDFC_Sanction_Letter_{bankAck}.pdf</span>
                  </div>
                  <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg flex items-center gap-1">
                    <Download size={12} /> Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: NACH Mandate Management & 1% Dealer Commission */}
      {activeTab === 'nach_commission' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* NPCI e-NACH Mandate Card */}
            <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <CreditCard className="text-purple-400" size={16} /> NPCI e-NACH Mandate Management
                </h3>
                <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono">
                  NPCI Registered
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Mandate Reference ID:</span>
                  <span className="text-white font-mono font-bold">MND-6B182D1F4311</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">NPCI UMRN Number:</span>
                  <span className="text-emerald-400 font-mono font-bold">UMRNA4482B9C11F347F0</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Customer Account:</span>
                  <span className="text-white">HDFC Bank ••••••7890</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Monthly EMI Auto-Debit:</span>
                  <span className="text-white font-bold">₹19,919 / month</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Max Authorized Debit Limit:</span>
                  <span className="text-amber-400 font-bold">₹24,898 (25% Buffer)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Auth Mode:</span>
                  <span className="text-slate-300">Aadhaar OTP / Netbanking</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 size={14} /> e-NACH Mandate active with NPCI clearing house.
              </div>
            </div>

            {/* 1% Dealer Commission & Monthly Ledger */}
            <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Award className="text-emerald-400" size={16} /> 1% Dealer Finance Commission Ledger
                </h3>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                  P0 MVP Feature
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">Disbursed Loan Amount</div>
                  <div className="text-lg font-bold text-white mt-1">₹{disbursedAmount.toLocaleString()}</div>
                  <div className="text-[11px] text-slate-500">UTR: NEFT-HDFC-99120349</div>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">1% Auto Dealer Payout</div>
                  <div className="text-lg font-bold text-emerald-400 mt-1">₹{(disbursedAmount * 0.01).toLocaleString()}</div>
                  <div className="text-[11px] text-emerald-400">Calculated instantly</div>
                </div>
              </div>

              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-white flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span>Monthly Commission Ledger (September 2026)</span>
                  <span className="text-slate-400 font-mono">5 Loans Disbursed</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Total Loan Volume Disbursed:</span>
                  <span className="font-bold text-white">₹50,50,000</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Gross 1% Dealership Commission:</span>
                  <span>₹50,500</span>
                </div>
                <div className="flex justify-between text-amber-300">
                  <span>Finance Executive Incentive Pool (25%):</span>
                  <span>₹12,625</span>
                </div>
                <div className="flex justify-between text-white font-bold border-t border-slate-800 pt-1.5">
                  <span>Net Dealer Principal Payout:</span>
                  <span className="text-emerald-400">₹37,875</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Section08FinanceWorkspace;

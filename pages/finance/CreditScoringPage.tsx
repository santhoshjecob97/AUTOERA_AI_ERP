import React, { useState } from 'react';
import { CreditCard, Sparkles, TrendingUp, AlertCircle, CheckCircle, DollarSign, Calendar, Briefcase, Home, Phone } from 'lucide-react';
import PageNavigation from '../../components/common/PageNavigation';

interface CreditApplication {
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  vehicle: string;
  loanAmount: string;
  creditScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  approvalProbability: number;
  interestRate: number;
  maxLoanAmount: string;
}

const mockApplications: CreditApplication[] = [
  {
    id: 'FIN-001',
    applicantName: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: '+91-9876543210',
    vehicle: 'BMW X5',
    loanAmount: '₹15,00,000',
    creditScore: 782,
    riskLevel: 'Low',
    approvalProbability: 94,
    interestRate: 8.5,
    maxLoanAmount: '₹18,00,000'
  },
  {
    id: 'FIN-002',
    applicantName: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '+91-9876543211',
    vehicle: 'Audi Q5',
    loanAmount: '₹12,00,000',
    creditScore: 685,
    riskLevel: 'Medium',
    approvalProbability: 72,
    interestRate: 10.5,
    maxLoanAmount: '₹14,00,000'
  },
  {
    id: 'FIN-003',
    applicantName: 'Amit Singh',
    email: 'amit@example.com',
    phone: '+91-9876543212',
    vehicle: 'Mercedes GLE',
    loanAmount: '₹20,00,000',
    creditScore: 580,
    riskLevel: 'High',
    approvalProbability: 35,
    interestRate: 12.5,
    maxLoanAmount: '₹15,00,000'
  }
];

const CreditScoringPage: React.FC = () => {
  const [selectedApp, setSelectedApp] = useState<CreditApplication>(mockApplications[0]);

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-600';
    if (score >= 650) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCreditScoreBg = (score: number) => {
    if (score >= 750) return 'bg-green-100';
    if (score >= 650) return 'bg-yellow-100';
    return 'bg-red-100';
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
    <div className="space-y-6">
      {/* Page Navigation */}
      <PageNavigation
        tabs={tabs}
        engineName="Finance AI Engine"
        enginePath="/finance"
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <CreditCard size={32} className="text-purple-600" />
          <h2 className="text-2xl font-bold text-slate-900">AI Credit Assessment</h2>
        </div>
        <p className="text-slate-600">Instant credit scoring with AI-powered analysis in 2-3 seconds</p>
      </div>

      {/* Application Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <h3 className="font-bold text-slate-900 mb-3">Select Application</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {mockApplications.map((app) => (
            <button
              key={app.id}
              onClick={() => setSelectedApp(app)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedApp.id === app.id
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-slate-200 hover:border-purple-300'
              }`}
            >
              <div className="font-bold text-slate-900">{app.applicantName}</div>
              <div className="text-sm text-slate-500">{app.id} • {app.vehicle}</div>
              <div className="text-sm font-semibold text-purple-600 mt-1">{app.loanAmount}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Credit Score Assessment */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Credit Score Assessment</h3>
            <p className="text-sm text-slate-500">Application #{selectedApp.id} • {selectedApp.vehicle}</p>
          </div>
          <div className="flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-lg">
            <Sparkles size={16} />
            <span className="text-sm font-semibold">AI Processed in 2.3s</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Credit Score Ring */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
              <div className="text-center">
                <div className={`text-6xl font-bold ${getCreditScoreColor(selectedApp.creditScore)} mb-2`}>
                  {selectedApp.creditScore}
                </div>
                <div className="text-slate-600 font-medium mb-4">/ 900</div>
                
                {/* Progress Bar */}
                <div className="w-full bg-slate-200 rounded-full h-3 mb-4">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      selectedApp.creditScore >= 750 ? 'bg-green-500' :
                      selectedApp.creditScore >= 650 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${(selectedApp.creditScore / 900) * 100}%` }}
                  ></div>
                </div>

                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getCreditScoreBg(selectedApp.creditScore)}`}>
                  {selectedApp.riskLevel === 'Low' && <CheckCircle size={16} className="text-green-600" />}
                  {selectedApp.riskLevel === 'Medium' && <AlertCircle size={16} className="text-yellow-600" />}
                  {selectedApp.riskLevel === 'High' && <AlertCircle size={16} className="text-red-600" />}
                  <span className={`font-bold ${getCreditScoreColor(selectedApp.creditScore)}`}>
                    {selectedApp.riskLevel} Risk
                  </span>
                </div>

                <div className="mt-4 pt-4 border-t border-purple-200">
                  <div className="text-sm text-slate-600 mb-1">Approval Probability</div>
                  <div className="text-3xl font-bold text-purple-600">{selectedApp.approvalProbability}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Score Breakdown & Factors */}
          <div className="lg:col-span-2 space-y-4">
            {/* Score Breakdown */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-3">Score Breakdown</h4>
              <div className="space-y-3">
                {[
                  { label: 'Payment History', score: 95, color: 'bg-green-500' },
                  { label: 'Credit Utilization', score: 82, color: 'bg-blue-500' },
                  { label: 'Credit Age', score: 88, color: 'bg-purple-500' },
                  { label: 'Credit Mix', score: 75, color: 'bg-yellow-500' },
                  { label: 'New Credit', score: 70, color: 'bg-orange-500' }
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-700 font-medium">{item.label}</span>
                      <span className="text-slate-900 font-bold">{item.score}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.score}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Credit Factors */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-3">Credit Factors</h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: CheckCircle, label: 'Payment History', value: 'Excellent', color: 'text-green-600' },
                  { icon: Briefcase, label: 'Employment', value: '8 years stable', color: 'text-green-600' },
                  { icon: DollarSign, label: 'Income', value: '₹12L/year', color: 'text-green-600' },
                  { icon: Home, label: 'Existing Loans', value: '2 (good)', color: 'text-green-600' },
                  { icon: AlertCircle, label: 'Credit Inquiries', value: '3 (6mo)', color: 'text-yellow-600' },
                  { icon: TrendingUp, label: 'Debt-to-Income', value: '28%', color: 'text-green-600' }
                ].map((factor, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <factor.icon size={16} className={factor.color} />
                    <div>
                      <div className="text-xs text-slate-500">{factor.label}</div>
                      <div className={`text-sm font-semibold ${factor.color}`}>{factor.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Analysis */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={20} className="text-indigo-600" />
          <h4 className="font-bold text-slate-900">AI Analysis</h4>
        </div>
        <p className="text-slate-700 leading-relaxed">
          "Excellent credit history with 100% on-time payments. Stable employment (8 years). 
          Debt-to-income ratio: 28% (Excellent). Strong financial profile with consistent income. 
          Recommend instant approval with best interest rate."
        </p>
      </div>

      {/* Recommended Loan Structure */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Recommended Loan Structure</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="text-sm text-slate-600 mb-1">Loan Amount</div>
            <div className="text-xl font-bold text-purple-600">{selectedApp.loanAmount}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-sm text-slate-600 mb-1">Interest Rate</div>
            <div className="text-xl font-bold text-green-600">{selectedApp.interestRate}% APR</div>
            <div className="text-xs text-green-600 font-medium">Best Rate</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-sm text-slate-600 mb-1">Tenure</div>
            <div className="text-xl font-bold text-blue-600">60 months</div>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <div className="text-sm text-slate-600 mb-1">Monthly EMI</div>
            <div className="text-xl font-bold text-amber-600">₹30,750</div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Processing Fee (0.5%)</span>
            <span className="font-semibold">₹7,500</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Total Interest</span>
            <span className="font-semibold">₹3,45,000</span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
            <span className="text-slate-900 font-bold">Total Payable</span>
            <span className="text-lg font-bold text-purple-600">₹18,45,000</span>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Approve Instantly
          </button>
          <button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Modify Terms
          </button>
          <button className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Reject
          </button>
        </div>
      </div>

      {/* Applicant Details */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Applicant Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Phone size={20} className="text-purple-600" />
            </div>
            <div>
              <div className="text-xs text-slate-500">Phone</div>
              <div className="font-semibold text-slate-900">{selectedApp.phone}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-xs text-slate-500">Email</div>
              <div className="font-semibold text-slate-900">{selectedApp.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign size={20} className="text-green-600" />
            </div>
            <div>
              <div className="text-xs text-slate-500">Max Loan Amount</div>
              <div className="font-semibold text-green-600">{selectedApp.maxLoanAmount}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditScoringPage;

import React, { useState } from 'react';
import { Shield, AlertTriangle, TrendingDown, Sparkles, Activity, DollarSign, Phone } from 'lucide-react';
import PageNavigation from '../../components/common/PageNavigation';

interface HighRiskLoan {
  id: string;
  applicantName: string;
  phone: string;
  loanAmount: string;
  riskScore: number;
  defaultProbability: number;
  redFlags: string[];
  mitigationStrategy: string;
}

const mockHighRiskLoans: HighRiskLoan[] = [
  {
    id: 'FIN-201',
    applicantName: 'Amit Patel',
    phone: '+91-9876543220',
    loanAmount: '₹35,00,000',
    riskScore: 78,
    defaultProbability: 24,
    redFlags: ['Low credit score (590)', 'High loan-to-income ratio', 'Recent credit inquiries'],
    mitigationStrategy: 'Require co-signer, increase down payment to 30%, reduce loan tenure'
  },
  {
    id: 'FIN-202',
    applicantName: 'Neha Gupta',
    phone: '+91-9876543221',
    loanAmount: '₹40,00,000',
    riskScore: 82,
    defaultProbability: 28,
    redFlags: ['Insufficient credit history', 'High debt-to-income ratio (45%)', 'Unstable employment'],
    mitigationStrategy: 'Request additional collateral, increase interest rate by 2%, monthly income verification'
  },
  {
    id: 'FIN-203',
    applicantName: 'Suresh Kumar',
    phone: '+91-9876543222',
    loanAmount: '₹28,00,000',
    riskScore: 72,
    defaultProbability: 19,
    redFlags: ['Previous loan default', 'Multiple credit inquiries'],
    mitigationStrategy: 'Require guarantor, implement bi-weekly payment schedule'
  }
];

interface StressTestScenario {
  name: string;
  description: string;
  impact: number;
  color: string;
}

const RiskAssessmentPage: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<string>('recession');

  const portfolioStats = {
    totalLoans: 1247,
    totalValue: '₹186.5 Cr',
    avgRiskScore: 42,
    highRiskLoans: 23,
    defaultRate: 2.8,
    portfolioHealth: 'Good'
  };

  const riskDistribution = [
    { category: 'Low Risk', count: 892, percentage: 71.5, color: 'bg-green-500' },
    { category: 'Medium Risk', count: 332, percentage: 26.6, color: 'bg-yellow-500' },
    { category: 'High Risk', count: 23, percentage: 1.9, color: 'bg-red-500' }
  ];

  const stressTestScenarios: StressTestScenario[] = [
    {
      name: 'recession',
      description: 'Economic Recession (GDP -3%)',
      impact: 15.2,
      color: 'bg-red-500'
    },
    {
      name: 'interest',
      description: 'Interest Rate Hike (+2%)',
      impact: 8.7,
      color: 'bg-orange-500'
    },
    {
      name: 'unemployment',
      description: 'Unemployment Spike (+5%)',
      impact: 12.4,
      color: 'bg-red-400'
    },
    {
      name: 'market',
      description: 'Market Crash (-20%)',
      impact: 10.3,
      color: 'bg-orange-400'
    }
  ];

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getRiskBg = (score: number) => {
    if (score >= 70) return 'bg-red-100 border-red-300';
    if (score >= 50) return 'bg-yellow-100 border-yellow-300';
    return 'bg-green-100 border-green-300';
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
          <Shield size={32} className="text-purple-600" />
          <h2 className="text-2xl font-bold text-slate-900">Risk Assessment Dashboard</h2>
        </div>
        <p className="text-slate-600">AI-powered portfolio risk analysis and mitigation strategies</p>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <div className="text-sm text-slate-600 mb-1">Total Loans</div>
          <div className="text-2xl font-bold text-slate-900">{portfolioStats.totalLoans}</div>
        </div>
        <div className="bg-purple-50 rounded-xl border border-purple-200 p-4">
          <div className="text-sm text-purple-700 mb-1">Total Value</div>
          <div className="text-2xl font-bold text-purple-600">{portfolioStats.totalValue}</div>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
          <div className="text-sm text-blue-700 mb-1">Avg Risk Score</div>
          <div className="text-2xl font-bold text-blue-600">{portfolioStats.avgRiskScore}</div>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-4">
          <div className="text-sm text-red-700 mb-1">High Risk Loans</div>
          <div className="text-2xl font-bold text-red-600">{portfolioStats.highRiskLoans}</div>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
          <div className="text-sm text-amber-700 mb-1">Default Rate</div>
          <div className="text-2xl font-bold text-amber-600">{portfolioStats.defaultRate}%</div>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4">
          <div className="text-sm text-green-700 mb-1">Portfolio Health</div>
          <div className="text-2xl font-bold text-green-600">{portfolioStats.portfolioHealth}</div>
        </div>
      </div>

      {/* Portfolio Risk Score */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Portfolio Risk Score</h3>
            <p className="text-sm text-slate-500">Overall risk assessment of loan portfolio</p>
          </div>
          <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg">
            <Activity size={16} />
            <span className="text-sm font-semibold">Low Risk Portfolio</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Score Display */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <div className="text-center">
              <div className="text-6xl font-bold text-green-600 mb-2">{portfolioStats.avgRiskScore}</div>
              <div className="text-slate-600 font-medium mb-4">/ 100</div>
              
              <div className="w-full bg-slate-200 rounded-full h-4 mb-4">
                <div
                  className="bg-green-500 h-4 rounded-full transition-all"
                  style={{ width: `${portfolioStats.avgRiskScore}%` }}
                ></div>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border border-green-300">
                <Shield size={16} className="text-green-600" />
                <span className="font-bold text-green-600">Low Risk</span>
              </div>
            </div>
          </div>

          {/* Risk Distribution Pie Chart */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-4">Risk Distribution</h4>
            <div className="space-y-3">
              {riskDistribution.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-700 font-medium">{item.category}</span>
                    <span className="text-slate-900 font-bold">{item.count} ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div className={`${item.color} h-3 rounded-full`} style={{ width: `${item.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-300">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Total Loans</span>
                <span className="text-lg font-bold text-slate-900">{portfolioStats.totalLoans}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* High Risk Loans Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">High Risk Loans</h3>
            <p className="text-sm text-slate-500">Loans requiring immediate attention</p>
          </div>
          <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg">
            <AlertTriangle size={16} />
            <span className="text-sm font-semibold">{mockHighRiskLoans.length} Active Alerts</span>
          </div>
        </div>

        <div className="space-y-4">
          {mockHighRiskLoans.map((loan) => (
            <div
              key={loan.id}
              className="bg-red-50 rounded-xl p-5 border-2 border-red-200 hover:border-red-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                <div className="flex-1 min-w-[250px]">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-bold text-slate-900">{loan.applicantName}</h4>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-200 text-red-800 border border-red-300">
                      HIGH RISK
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-slate-600">Loan ID:</span>
                      <span className="ml-2 font-semibold text-slate-900">{loan.id}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Amount:</span>
                      <span className="ml-2 font-semibold text-purple-600">{loan.loanAmount}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className={`rounded-lg p-4 border ${getRiskBg(loan.riskScore)} min-w-[120px] text-center`}>
                    <div className="text-sm text-slate-600 mb-1">Risk Score</div>
                    <div className={`text-3xl font-bold ${getRiskColor(loan.riskScore)}`}>{loan.riskScore}</div>
                  </div>
                  <div className="bg-red-100 rounded-lg p-4 border border-red-300 min-w-[120px] text-center">
                    <div className="text-sm text-red-700 mb-1">Default Risk</div>
                    <div className="text-3xl font-bold text-red-600">{loan.defaultProbability}%</div>
                  </div>
                </div>
              </div>

              {/* Red Flags */}
              <div className="bg-white rounded-lg p-4 mb-4">
                <div className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-red-600" />
                  Red Flags:
                </div>
                <ul className="text-sm text-slate-700 space-y-1">
                  {loan.redFlags.map((flag, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* AI Mitigation Strategy */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 mb-4 border border-indigo-200">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-indigo-600" />
                  <span className="font-semibold text-slate-900">AI Mitigation Strategy:</span>
                </div>
                <p className="text-sm text-slate-700">{loan.mitigationStrategy}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                  <Phone size={16} />
                  Call Applicant
                </button>
                <button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                  Apply Mitigation
                </button>
                <button className="flex-1 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                  View Full Report
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stress Test Scenarios */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Stress Test Scenarios</h3>
            <p className="text-sm text-slate-500">Portfolio resilience under adverse conditions</p>
          </div>
          <div className="flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-lg">
            <TrendingDown size={16} />
            <span className="text-sm font-semibold">Scenario Analysis</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {stressTestScenarios.map((scenario) => (
            <button
              key={scenario.name}
              onClick={() => setSelectedScenario(scenario.name)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedScenario === scenario.name
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-slate-200 hover:border-purple-300'
              }`}
            >
              <div className="font-bold text-slate-900 mb-1">{scenario.description}</div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Projected Default Increase:</span>
                <span className="text-lg font-bold text-red-600">+{scenario.impact}%</span>
              </div>
            </button>
          ))}
        </div>

        {/* Selected Scenario Impact */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
          <h4 className="font-bold text-slate-900 mb-4">Impact Analysis</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-red-200">
              <div className="text-sm text-slate-600 mb-1">Current Default Rate</div>
              <div className="text-2xl font-bold text-slate-900">{portfolioStats.defaultRate}%</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-red-200">
              <div className="text-sm text-slate-600 mb-1">Projected Default Rate</div>
              <div className="text-2xl font-bold text-red-600">
                {(portfolioStats.defaultRate + stressTestScenarios.find(s => s.name === selectedScenario)!.impact).toFixed(1)}%
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-red-200">
              <div className="text-sm text-slate-600 mb-1">Potential Losses</div>
              <div className="text-2xl font-bold text-red-600">₹{(stressTestScenarios.find(s => s.name === selectedScenario)!.impact * 0.5).toFixed(1)} Cr</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-red-200">
              <div className="text-sm text-slate-600 mb-1">Capital Buffer</div>
              <div className="text-2xl font-bold text-green-600">₹28.5 Cr</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessmentPage;

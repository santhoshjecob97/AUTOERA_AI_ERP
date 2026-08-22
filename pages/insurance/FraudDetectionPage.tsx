import React, { useState } from 'react';
import { AlertTriangle, Shield, TrendingUp, Phone, Ban, Eye, CheckCircle } from 'lucide-react';
import PageNavigation from '../../components/common/PageNavigation';

interface FraudAlert {
  id: string;
  claimId: string;
  policyholderName: string;
  phone: string;
  fraudScore: number;
  priority: 'critical' | 'high' | 'medium';
  redFlags: string[];
  detectedAt: string;
  status: 'active' | 'investigating' | 'resolved';
  recommendedAction: string;
}

const mockFraudAlerts: FraudAlert[] = [
  {
    id: 'FRAUD-001',
    claimId: 'INS-2024-005678',
    policyholderName: 'Amit Verma',
    phone: '+91-9876543220',
    fraudScore: 87,
    priority: 'critical',
    redFlags: [
      '3rd claim in 6 months (unusual frequency)',
      'Similar damage pattern to previous claims',
      'Incident location inconsistent with route',
      'Photos metadata shows editing software',
      'Witness contact unreachable',
      'Repair shop has fraud history'
    ],
    detectedAt: '2024-12-06 10:23 AM',
    status: 'active',
    recommendedAction: 'INVESTIGATE + DENY'
  },
  {
    id: 'FRAUD-002',
    claimId: 'INS-2024-005679',
    policyholderName: 'Suspicious Claim 2',
    phone: '+91-9876543221',
    fraudScore: 72,
    priority: 'high',
    redFlags: [
      'Multiple claims in short timeframe',
      'Inconsistent incident description',
      'Bank account recently changed'
    ],
    detectedAt: '2024-12-06 09:15 AM',
    status: 'investigating',
    recommendedAction: 'REQUEST ADDITIONAL DOCUMENTS'
  },
  {
    id: 'FRAUD-003',
    claimId: 'INS-2024-005680',
    policyholderName: 'Resolved Case 1',
    phone: '+91-9876543222',
    fraudScore: 65,
    priority: 'medium',
    redFlags: [
      'Minor document inconsistencies',
      'Delayed reporting (5 days)'
    ],
    detectedAt: '2024-12-05 04:30 PM',
    status: 'resolved',
    recommendedAction: 'APPROVED AFTER VERIFICATION'
  }
];

const FraudDetectionPage: React.FC = () => {
  const [selectedPriority, setSelectedPriority] = useState<'all' | 'critical' | 'high' | 'medium'>('all');

  const stats = {
    totalAlerts: mockFraudAlerts.length,
    criticalAlerts: mockFraudAlerts.filter(a => a.priority === 'critical').length,
    highAlerts: mockFraudAlerts.filter(a => a.priority === 'high').length,
    mediumAlerts: mockFraudAlerts.filter(a => a.priority === 'medium').length,
    detectionAccuracy: 87,
    preventedLosses: '₹25L',
    savingsPerYear: '₹2Cr'
  };

  const filteredAlerts = selectedPriority === 'all'
    ? mockFraudAlerts
    : mockFraudAlerts.filter(a => a.priority === selectedPriority);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-700 border-red-300';
      case 'investigating': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'resolved': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getFraudScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-yellow-600';
  };

  const getFraudScoreBg = (score: number) => {
    if (score >= 80) return 'bg-red-100 border-red-300';
    if (score >= 60) return 'bg-orange-100 border-orange-300';
    return 'bg-yellow-100 border-yellow-300';
  };

  // Define tabs for navigation
  const tabs = [
    { id: 'overview', label: 'Overview', path: '/insurance' },
    { id: 'claims', label: 'Claim Processing', path: '/insurance/claims' },
    { id: 'damage', label: 'Damage Assessment', path: '/insurance/damage-assessment' },
    { id: 'fraud', label: 'Fraud Detection', path: '/insurance/fraud-detection' },
    { id: 'policies', label: 'Policy Recommendations', path: '/insurance/policies' },
    { id: 'settlement', label: 'Settlement Calculator', path: '/insurance/settlement' },
    { id: 'documents', label: 'Documents', path: '/insurance/documents' },
    { id: 'analytics', label: 'Analytics', path: '/insurance/analytics' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Navigation */}
      <PageNavigation
        tabs={tabs}
        engineName="Insurance AI Engine"
        enginePath="/insurance"
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield size={32} className="text-red-600" />
          <h2 className="text-2xl font-bold text-slate-900">AI Fraud Detection</h2>
        </div>
        <p className="text-slate-600">
          Real-time fraud detection with 87% accuracy • 278% better than manual detection
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <div className="text-sm text-slate-600 mb-1">Total Alerts</div>
          <div className="text-2xl font-bold text-slate-900">{stats.totalAlerts}</div>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-4">
          <div className="text-sm text-red-700 mb-1">Critical</div>
          <div className="text-2xl font-bold text-red-600">{stats.criticalAlerts}</div>
        </div>
        <div className="bg-orange-50 rounded-xl border border-orange-200 p-4">
          <div className="text-sm text-orange-700 mb-1">High</div>
          <div className="text-2xl font-bold text-orange-600">{stats.highAlerts}</div>
        </div>
        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
          <div className="text-sm text-yellow-700 mb-1">Medium</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.mediumAlerts}</div>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4">
          <div className="text-sm text-green-700 mb-1">Accuracy</div>
          <div className="text-2xl font-bold text-green-600">{stats.detectionAccuracy}%</div>
        </div>
        <div className="bg-purple-50 rounded-xl border border-purple-200 p-4">
          <div className="text-sm text-purple-700 mb-1">Prevented</div>
          <div className="text-2xl font-bold text-purple-600">{stats.preventedLosses}</div>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
          <div className="text-sm text-blue-700 mb-1">Savings/Year</div>
          <div className="text-2xl font-bold text-blue-600">{stats.savingsPerYear}</div>
        </div>
      </div>

      {/* AI Detection System Info */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={24} className="text-indigo-600" />
          <h3 className="text-xl font-bold text-slate-900">AI Detection System</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-indigo-200">
            <div className="text-sm text-slate-600 mb-2">Pattern Analysis</div>
            <div className="text-lg font-bold text-indigo-600">Real-Time</div>
            <div className="text-xs text-slate-500 mt-1">Behavioral analytics</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-indigo-200">
            <div className="text-sm text-slate-600 mb-2">Photo Forensics</div>
            <div className="text-lg font-bold text-purple-600">AI-Powered</div>
            <div className="text-xs text-slate-500 mt-1">Metadata analysis</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-indigo-200">
            <div className="text-sm text-slate-600 mb-2">Network Detection</div>
            <div className="text-lg font-bold text-blue-600">Multi-Factor</div>
            <div className="text-xs text-slate-500 mt-1">Connected fraud rings</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-indigo-200">
            <div className="text-sm text-slate-600 mb-2">Response Time</div>
            <div className="text-lg font-bold text-green-600">1.5s</div>
            <div className="text-xs text-slate-500 mt-1">Average detection</div>
          </div>
        </div>
      </div>

      {/* Priority Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedPriority('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedPriority === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Alerts ({mockFraudAlerts.length})
          </button>
          <button
            onClick={() => setSelectedPriority('critical')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedPriority === 'critical'
                ? 'bg-red-600 text-white'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            Critical ({stats.criticalAlerts})
          </button>
          <button
            onClick={() => setSelectedPriority('high')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedPriority === 'high'
                ? 'bg-orange-600 text-white'
                : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
            }`}
          >
            High ({stats.highAlerts})
          </button>
          <button
            onClick={() => setSelectedPriority('medium')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedPriority === 'medium'
                ? 'bg-yellow-600 text-white'
                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
            }`}
          >
            Medium ({stats.mediumAlerts})
          </button>
        </div>
      </div>

      {/* Fraud Alerts */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`rounded-xl shadow-sm border-2 p-6 hover:shadow-md transition-shadow ${
              alert.priority === 'critical' ? 'bg-red-50 border-red-300' :
              alert.priority === 'high' ? 'bg-orange-50 border-orange-300' :
              'bg-yellow-50 border-yellow-300'
            }`}
          >
            <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
              {/* Alert Info */}
              <div className="flex-1 min-w-[250px]">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle size={24} className={
                    alert.priority === 'critical' ? 'text-red-600' :
                    alert.priority === 'high' ? 'text-orange-600' : 'text-yellow-600'
                  } />
                  <h3 className="text-lg font-bold text-slate-900">{alert.policyholderName}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(alert.priority)}`}>
                    {alert.priority.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(alert.status)}`}>
                    {alert.status.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-slate-600">Alert ID:</span>
                    <span className="ml-2 font-semibold text-slate-900">{alert.id}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Claim ID:</span>
                    <span className="ml-2 font-semibold text-slate-900">{alert.claimId}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Detected:</span>
                    <span className="ml-2 font-semibold text-slate-900">{alert.detectedAt}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Phone:</span>
                    <span className="ml-2 font-semibold text-slate-900">{alert.phone}</span>
                  </div>
                </div>
              </div>

              {/* Fraud Score */}
              <div className={`rounded-lg p-4 border ${getFraudScoreBg(alert.fraudScore)} min-w-[150px] text-center`}>
                <div className="text-sm text-slate-600 mb-1">Fraud Score</div>
                <div className={`text-4xl font-bold ${getFraudScoreColor(alert.fraudScore)}`}>{alert.fraudScore}</div>
                <div className="text-xs text-slate-600 mt-1">/ 100</div>
              </div>
            </div>

            {/* Red Flags */}
            <div className="bg-white rounded-lg p-4 mb-4 border-2 border-red-200">
              <div className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <AlertTriangle size={18} className="text-red-600" />
                Detected Red Flags:
              </div>
              <ul className="space-y-2">
                {alert.redFlags.map((flag, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-red-600 font-bold">⚠️</span>
                    <span className="text-slate-700">{flag}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Analysis */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 mb-4 border border-indigo-200">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={16} className="text-indigo-600" />
                <span className="font-semibold text-slate-900">AI Analysis:</span>
              </div>
              <p className="text-sm text-slate-700">
                {alert.fraudScore >= 80 && "High probability of fraudulent activity detected. Multiple critical red flags identified. Immediate action recommended - investigate thoroughly and consider denial."}
                {alert.fraudScore >= 60 && alert.fraudScore < 80 && "Significant fraud indicators present. Manual verification strongly recommended before proceeding. Request additional documentation and conduct thorough review."}
                {alert.fraudScore < 60 && "Moderate fraud risk detected. Additional verification recommended. May proceed with enhanced monitoring and documentation requirements."}
              </p>
            </div>

            {/* Recommended Action */}
            <div className="bg-white rounded-lg p-4 mb-4 border border-slate-200">
              <div className="font-semibold text-slate-900 mb-2">Recommended Action:</div>
              <p className="text-lg font-bold text-red-600">{alert.recommendedAction}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {alert.status === 'active' && (
                <>
                  <button className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                    <Ban size={16} />
                    Deny Claim
                  </button>
                  <button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                    <Eye size={16} />
                    Investigate
                  </button>
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                    <Phone size={16} />
                    Contact
                  </button>
                </>
              )}
              {alert.status === 'investigating' && (
                <>
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                    <CheckCircle size={16} />
                    Mark Resolved
                  </button>
                  <button className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                    <Ban size={16} />
                    Confirm Fraud
                  </button>
                  <button className="flex-1 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                    View Details
                  </button>
                </>
              )}
              {alert.status === 'resolved' && (
                <>
                  <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-semibold transition-colors">
                    View Report
                  </button>
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                    Download Evidence
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Fraud Analytics */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={24} className="text-purple-600" />
          <h3 className="text-xl font-bold text-slate-900">Fraud Analytics</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="text-sm text-slate-600 mb-2">Cases This Month</div>
            <div className="text-2xl font-bold text-red-600">23</div>
            <div className="text-xs text-green-600 mt-1">↓ 15% from last month</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="text-sm text-slate-600 mb-2">Detection Rate</div>
            <div className="text-2xl font-bold text-green-600">87%</div>
            <div className="text-xs text-green-600 mt-1">↑ 2.3% from last month</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="text-sm text-slate-600 mb-2">False Positive Rate</div>
            <div className="text-2xl font-bold text-blue-600">5%</div>
            <div className="text-xs text-green-600 mt-1">↓ 0.8% from last month</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="text-sm text-slate-600 mb-2">Avg Detection Time</div>
            <div className="text-2xl font-bold text-purple-600">1.5s</div>
            <div className="text-xs text-green-600 mt-1">↓ 0.3s from last month</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FraudDetectionPage;

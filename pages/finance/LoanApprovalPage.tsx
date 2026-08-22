import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertTriangle, Sparkles, TrendingUp, Filter, Download, Phone } from 'lucide-react';
import VoiceCallButton from '../../components/voice/VoiceCallButton';
import UniversalVoiceCampaignSection from '../../components/voice/UniversalVoiceCampaignSection';

interface LoanApplication {
  id: string;
  applicantName: string;
  phone: string;
  vehicle: string;
  loanAmount: string;
  creditScore: number;
  aiConfidence: number;
  status: 'instant' | 'review' | 'high-risk';
  timeRemaining?: number;
  riskFactors?: string[];
}

const mockApplications: LoanApplication[] = [
  {
    id: 'FIN-101',
    applicantName: 'Rajesh Kumar',
    phone: '+91-9876543210',
    vehicle: 'BMW X5',
    loanAmount: '₹15,00,000',
    creditScore: 782,
    aiConfidence: 96,
    status: 'instant',
    timeRemaining: 45
  },
  {
    id: 'FIN-102',
    applicantName: 'Anita Desai',
    phone: '+91-9876543211',
    vehicle: 'Mercedes C-Class',
    loanAmount: '₹18,00,000',
    creditScore: 795,
    aiConfidence: 94,
    status: 'instant',
    timeRemaining: 28
  },
  {
    id: 'FIN-103',
    applicantName: 'Vikram Singh',
    phone: '+91-9876543212',
    vehicle: 'Audi Q7',
    loanAmount: '₹22,00,000',
    creditScore: 710,
    aiConfidence: 78,
    status: 'review'
  },
  {
    id: 'FIN-104',
    applicantName: 'Priya Sharma',
    phone: '+91-9876543213',
    vehicle: 'Jaguar XF',
    loanAmount: '₹25,00,000',
    creditScore: 685,
    aiConfidence: 72,
    status: 'review'
  },
  {
    id: 'FIN-105',
    applicantName: 'Amit Patel',
    phone: '+91-9876543214',
    vehicle: 'Range Rover',
    loanAmount: '₹35,00,000',
    creditScore: 590,
    aiConfidence: 42,
    status: 'high-risk',
    riskFactors: ['Low credit score', 'High loan-to-income ratio', 'Recent credit inquiries']
  },
  {
    id: 'FIN-106',
    applicantName: 'Neha Gupta',
    phone: '+91-9876543215',
    vehicle: 'Porsche Cayenne',
    loanAmount: '₹40,00,000',
    creditScore: 620,
    aiConfidence: 38,
    status: 'high-risk',
    riskFactors: ['Insufficient credit history', 'High debt-to-income ratio']
  }
];

const LoanApprovalPage: React.FC = () => {
  const [applications, setApplications] = useState<LoanApplication[]>(mockApplications);
  const [selectedQueue, setSelectedQueue] = useState<'all' | 'instant' | 'review' | 'high-risk'>('all');

  // Auto-approve countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setApplications(prev => prev.map(app => {
        if (app.status === 'instant' && app.timeRemaining && app.timeRemaining > 0) {
          return { ...app, timeRemaining: app.timeRemaining - 1 };
        }
        return app;
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const instantApprovals = applications.filter(app => app.status === 'instant');
  const reviewQueue = applications.filter(app => app.status === 'review');
  const highRiskQueue = applications.filter(app => app.status === 'high-risk');

  const filteredApplications = selectedQueue === 'all' 
    ? applications 
    : applications.filter(app => app.status === selectedQueue);

  const stats = {
    totalApplications: applications.length,
    instantApprovals: instantApprovals.length,
    needsReview: reviewQueue.length,
    highRisk: highRiskQueue.length,
    avgProcessingTime: '2.3s',
    approvalRate: '87%'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'instant': return 'bg-green-100 text-green-700 border-green-300';
      case 'review': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'high-risk': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'instant': return <CheckCircle size={16} />;
      case 'review': return <Clock size={16} />;
      case 'high-risk': return <AlertTriangle size={16} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp size={32} className="text-purple-600" />
          <h2 className="text-2xl font-bold text-slate-900">Loan Approval Workflow</h2>
        </div>
        <p className="text-slate-600">AI-powered loan categorization and instant approval system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <div className="text-sm text-slate-600 mb-1">Total Applications</div>
          <div className="text-2xl font-bold text-slate-900">{stats.totalApplications}</div>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4">
          <div className="text-sm text-green-700 mb-1">Instant Approvals</div>
          <div className="text-2xl font-bold text-green-600">{stats.instantApprovals}</div>
        </div>
        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
          <div className="text-sm text-yellow-700 mb-1">Needs Review</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.needsReview}</div>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-4">
          <div className="text-sm text-red-700 mb-1">High Risk</div>
          <div className="text-2xl font-bold text-red-600">{stats.highRisk}</div>
        </div>
        <div className="bg-purple-50 rounded-xl border border-purple-200 p-4">
          <div className="text-sm text-purple-700 mb-1">Avg Processing</div>
          <div className="text-2xl font-bold text-purple-600">{stats.avgProcessingTime}</div>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
          <div className="text-sm text-blue-700 mb-1">Approval Rate</div>
          <div className="text-2xl font-bold text-blue-600">{stats.approvalRate}</div>
        </div>
      </div>

      {/* Queue Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-slate-600" />
            <span className="font-semibold text-slate-900">Filter by Queue:</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedQueue('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedQueue === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All ({applications.length})
            </button>
            <button
              onClick={() => setSelectedQueue('instant')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedQueue === 'instant'
                  ? 'bg-green-600 text-white'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              Instant ({instantApprovals.length})
            </button>
            <button
              onClick={() => setSelectedQueue('review')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedQueue === 'review'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
              }`}
            >
              Review ({reviewQueue.length})
            </button>
            <button
              onClick={() => setSelectedQueue('high-risk')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedQueue === 'high-risk'
                  ? 'bg-red-600 text-white'
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              High Risk ({highRiskQueue.length})
            </button>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((app) => (
          <div
            key={app.id}
            className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              {/* Application Info */}
              <div className="flex-1 min-w-[250px]">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-slate-900">{app.applicantName}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(app.status)}`}>
                    {getStatusIcon(app.status)}
                    {app.status === 'instant' && 'Instant Approval'}
                    {app.status === 'review' && 'Needs Review'}
                    {app.status === 'high-risk' && 'High Risk'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-slate-500">Application ID:</span>
                    <span className="ml-2 font-semibold text-slate-900">{app.id}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Vehicle:</span>
                    <span className="ml-2 font-semibold text-slate-900">{app.vehicle}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Loan Amount:</span>
                    <span className="ml-2 font-semibold text-purple-600">{app.loanAmount}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Credit Score:</span>
                    <span className={`ml-2 font-semibold ${
                      app.creditScore >= 750 ? 'text-green-600' :
                      app.creditScore >= 650 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {app.creditScore}
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Confidence */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200 min-w-[180px]">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-indigo-600" />
                  <span className="text-sm font-semibold text-slate-700">AI Confidence</span>
                </div>
                <div className="text-3xl font-bold text-indigo-600 mb-2">{app.aiConfidence}%</div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      app.aiConfidence >= 90 ? 'bg-green-500' :
                      app.aiConfidence >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${app.aiConfidence}%` }}
                  ></div>
                </div>
              </div>

              {/* Timer for Instant Approvals */}
              {app.status === 'instant' && app.timeRemaining !== undefined && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200 min-w-[150px] text-center">
                  <div className="text-sm text-green-700 mb-1">Auto-Approve In</div>
                  <div className="text-3xl font-bold text-green-600 font-mono">
                    {Math.floor(app.timeRemaining / 60)}:{(app.timeRemaining % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs text-green-600 mt-1">seconds</div>
                </div>
              )}

              {/* Risk Factors for High Risk */}
              {app.status === 'high-risk' && app.riskFactors && (
                <div className="bg-red-50 rounded-lg p-4 border border-red-200 min-w-[200px]">
                  <div className="text-sm font-semibold text-red-700 mb-2">Risk Factors:</div>
                  <ul className="text-xs text-red-600 space-y-1">
                    {app.riskFactors.map((factor, idx) => (
                      <li key={idx}>• {factor}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
              {app.status === 'instant' && (
                <>
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                    Approve Now
                  </button>
                  <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors">
                    View Details
                  </button>
                </>
              )}
              {app.status === 'review' && (
                <>
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                    Approve
                  </button>
                  <button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                    Request Info
                  </button>
                  <button className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                    Reject
                  </button>
                </>
              )}
              {app.status === 'high-risk' && (
                <>
                  <button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                    Manual Review
                  </button>
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                    <Phone size={16} />
                    Call Applicant
                  </button>
                  <button className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bulk Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <span className="font-semibold text-slate-900">Bulk Actions:</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
              Approve All Instant ({instantApprovals.length})
            </button>
            <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors">
              Send Review Requests ({reviewQueue.length})
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              Export High Risk ({highRiskQueue.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanApprovalPage;

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, FileText, Camera, AlertTriangle, Calculator, Lightbulb, BarChart3, FileCheck } from 'lucide-react';
import InsuranceDashboard from '../components/dashboard/InsuranceDashboard';
import PageNavigation from '../components/common/PageNavigation';

const InsuranceEngine: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Shield, path: '/insurance' },
    { id: 'claims', label: 'Claim Processing', icon: FileText, path: '/insurance/claims' },
    { id: 'damage', label: 'Damage Assessment', icon: Camera, path: '/insurance/damage-assessment' },
    { id: 'fraud', label: 'Fraud Detection', icon: AlertTriangle, path: '/insurance/fraud-detection' },
    { id: 'policies', label: 'Policy Recommendations', icon: Lightbulb, path: '/insurance/policies' },
    { id: 'settlement', label: 'Settlement Calculator', icon: Calculator, path: '/insurance/settlement' },
    { id: 'documents', label: 'Documents', icon: FileCheck, path: '/insurance/documents' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/insurance/analytics' },
  ];

  const activeTab = tabs.find(tab => location.pathname === tab.path)?.id || 'overview';

  return (
    <div className="space-y-6">
      {/* Page Navigation */}
      <PageNavigation
        tabs={tabs}
        engineName="Insurance AI Engine"
        enginePath="/insurance"
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield size={32} className="text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-900">Insurance AI Engine</h1>
        </div>
        <p className="text-slate-600">
          AI-powered insurance operations: 86% faster processing, 278% better fraud detection, 34% cost savings
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content - Show Dashboard on Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <InsuranceDashboard />
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Active Claims</p>
                  <p className="text-2xl font-bold text-slate-900">127</p>
                </div>
              </div>
              <p className="text-xs text-green-600 font-medium">↑ 12% from last month</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle size={20} className="text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Fraud Detected</p>
                  <p className="text-2xl font-bold text-red-600">8</p>
                </div>
              </div>
              <p className="text-xs text-slate-500">87% detection rate</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calculator size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Settled Amount</p>
                  <p className="text-2xl font-bold text-green-600">₹45Cr</p>
                </div>
              </div>
              <p className="text-xs text-green-600 font-medium">↑ 18% from last month</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BarChart3 size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">AI Score</p>
                  <p className="text-2xl font-bold text-purple-600">94/100</p>
                </div>
              </div>
              <p className="text-xs text-purple-600 font-medium">Excellent performance</p>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Lightbulb size={20} className="text-indigo-600" />
              AI Recommendations
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span className="text-slate-700">Review 8 fraud flags requiring immediate attention</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-slate-700">Approve 47 instant settlement claims</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span className="text-slate-700">Contact 12 customers for document submission</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsuranceEngine;

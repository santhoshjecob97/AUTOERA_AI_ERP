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
      <div className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <Shield size={30} className="text-orange-500" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] tracking-tight">
            Insurance AI Engine
          </h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-3xl">
          Automated 90/60/30-day renewal pipelines, crash damage computer vision assessment &amp; algorithmic claim settlement verification.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-slate-100/90 dark:bg-[#0c121e] rounded-2xl border border-slate-200 dark:border-slate-800 p-1 shadow-xs">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
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
            <div className="bg-white dark:bg-[#0c121e] rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800 p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-500">
                  <FileText size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Claims</p>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-['Outfit']">127</p>
                </div>
              </div>
              <p className="text-xs text-emerald-500 font-semibold">↑ 12% from last month</p>
            </div>

            <div className="bg-white dark:bg-[#0c121e] rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800 p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fraud Flagged</p>
                  <p className="text-2xl font-extrabold text-red-500 font-['Outfit']">8</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 font-mono">87% detection precision</p>
            </div>

            <div className="bg-white dark:bg-[#0c121e] rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800 p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500">
                  <Calculator size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Settled Payouts</p>
                  <p className="text-2xl font-extrabold text-emerald-500 font-['Outfit']">₹45 Cr</p>
                </div>
              </div>
              <p className="text-xs text-emerald-500 font-semibold">↑ 18% from last month</p>
            </div>

            <div className="bg-white dark:bg-[#0c121e] rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800 p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-500">
                  <BarChart3 size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">AI Accuracy Score</p>
                  <p className="text-2xl font-extrabold text-orange-500 font-['Outfit']">94/100</p>
                </div>
              </div>
              <p className="text-xs text-orange-400 font-semibold">Automated Straight-through</p>
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

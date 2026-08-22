import React, { useState } from 'react';
import { BarChart3, TrendingUp, Clock, AlertTriangle, ThumbsUp, Target } from 'lucide-react';
import PageNavigation from '../../components/common/PageNavigation';

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const kpis = [
    { name: 'Avg Processing Time', value: '2 days', change: -86, icon: Clock, color: 'purple' },
    { name: 'Fraud Detection Rate', value: '87%', change: 278, icon: AlertTriangle, color: 'red' },
    { name: 'Assessment Accuracy', value: '94%', change: 21, icon: Target, color: 'green' },
    { name: 'Customer Satisfaction', value: '4.6/5', change: 18, icon: ThumbsUp, color: 'blue' }
  ];

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

      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 size={32} className="text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-900">Insurance Analytics</h2>
            </div>
            <p className="text-slate-600">Comprehensive performance metrics and AI insights</p>
          </div>
          <div className="flex gap-2">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className={`bg-${kpi.color}-50 rounded-xl shadow-sm border border-${kpi.color}-200 p-6`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 bg-${kpi.color}-100 rounded-lg`}>
                  <Icon size={24} className={`text-${kpi.color}-600`} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                  kpi.change > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  <TrendingUp size={12} className={kpi.change < 0 ? 'rotate-180' : ''} />
                  {Math.abs(kpi.change)}%
                </div>
              </div>
              <div className="text-sm text-slate-600 mb-1">{kpi.name}</div>
              <div className={`text-3xl font-bold text-${kpi.color}-600`}>{kpi.value}</div>
              <div className="text-xs text-slate-500 mt-2">vs previous period</div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-sm text-green-700 mb-2 font-semibold">Strengths</div>
            <ul className="text-sm text-slate-700 space-y-1">
              <li>• 86% faster processing (2 days vs 14)</li>
              <li>• 87% fraud detection accuracy</li>
              <li>• 94% assessment accuracy</li>
              <li>• 34% cost savings</li>
            </ul>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="text-sm text-yellow-700 mb-2 font-semibold">Improvements</div>
            <ul className="text-sm text-slate-700 space-y-1">
              <li>• Reduce false positives (5%)</li>
              <li>• Faster document processing</li>
              <li>• Enhanced photo quality checks</li>
            </ul>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-sm text-blue-700 mb-2 font-semibold">Recommendations</div>
            <ul className="text-sm text-slate-700 space-y-1">
              <li>• Expand AI training data</li>
              <li>• Implement 3D damage modeling</li>
              <li>• Add predictive fraud patterns</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;

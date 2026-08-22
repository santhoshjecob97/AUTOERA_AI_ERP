import React, { useState } from 'react';
import { Lightbulb, Star, CheckCircle, TrendingUp } from 'lucide-react';
import PageNavigation from '../../components/common/PageNavigation';

const PolicyRecommendationsPage: React.FC = () => {
  const [selectedPolicy, setSelectedPolicy] = useState('recommended');

  const policies = [
    {
      id: 'recommended',
      name: 'Comprehensive Plus',
      badge: 'RECOMMENDED',
      premium: '₹25,000/year',
      discount: '15% discount',
      idv: '₹18,00,000',
      ncb: '50%',
      features: [
        'Own Damage: ₹18L',
        'Third Party: Unlimited',
        'Personal Accident: ₹15L',
        'Zero Depreciation',
        'Engine Protection',
        'Roadside Assistance'
      ],
      savings: '₹4,500',
      match: 95
    },
    {
      id: 'standard',
      name: 'Standard Policy',
      premium: '₹22,000/year',
      idv: '₹18,00,000',
      ncb: '50%',
      features: [
        'Own Damage: ₹18L',
        'Third Party: Unlimited',
        'Personal Accident: ₹15L'
      ],
      match: 75
    },
    {
      id: 'premium',
      name: 'Premium Policy',
      premium: '₹32,000/year',
      idv: '₹18,00,000',
      ncb: '50%',
      features: [
        'Own Damage: ₹18L',
        'Third Party: Unlimited',
        'Personal Accident: ₹15L',
        'Zero Depreciation',
        'Engine Protection',
        'Roadside Assistance',
        'Return to Invoice',
        'Key Replacement'
      ],
      match: 88
    }
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
        <div className="flex items-center gap-3 mb-2">
          <Lightbulb size={32} className="text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900">AI Policy Recommendations</h2>
        </div>
        <p className="text-slate-600">Personalized insurance recommendations based on your profile</p>
      </div>

      {/* Customer Profile */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="font-bold text-slate-900 mb-4">Customer Profile</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-slate-600">Customer</p>
            <p className="font-semibold text-slate-900">Rajesh Kumar</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Vehicle</p>
            <p className="font-semibold text-slate-900">BMW X5 2022</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Usage</p>
            <p className="font-semibold text-slate-900">Daily commute</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Driving Score</p>
            <p className="font-semibold text-green-600">92/100 (Excellent) ✅</p>
          </div>
        </div>
      </div>

      {/* Policy Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {policies.map((policy) => (
          <div
            key={policy.id}
            className={`rounded-xl p-6 border-2 transition-all cursor-pointer ${
              policy.id === 'recommended'
                ? 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-300 ring-2 ring-purple-200'
                : selectedPolicy === policy.id
                ? 'bg-blue-50 border-blue-300'
                : 'bg-white border-slate-200 hover:border-blue-300'
            }`}
            onClick={() => setSelectedPolicy(policy.id)}
          >
            {policy.badge && (
              <div className="flex items-center gap-2 mb-3">
                <Star size={16} className="text-purple-600" />
                <span className="text-xs font-bold text-purple-600">{policy.badge}</span>
              </div>
            )}
            <h3 className="text-xl font-bold text-slate-900 mb-2">{policy.name}</h3>
            <div className="text-2xl font-bold text-purple-600 mb-1">{policy.premium}</div>
            {policy.discount && (
              <div className="text-sm text-green-600 font-semibold mb-4">{policy.discount}</div>
            )}
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">IDV</span>
                <span className="font-semibold">{policy.idv}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">NCB</span>
                <span className="font-semibold">{policy.ncb}</span>
              </div>
              {policy.match && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Match Score</span>
                  <span className="font-semibold text-green-600">{policy.match}%</span>
                </div>
              )}
            </div>

            <div className="space-y-2 mb-4">
              {policy.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <CheckCircle size={14} className="text-green-600" />
                  <span className="text-slate-700">{feature}</span>
                </div>
              ))}
            </div>

            {policy.savings && (
              <div className="bg-green-50 rounded-lg p-3 mb-4 border border-green-200">
                <p className="text-sm text-green-700 font-semibold">
                  Save {policy.savings} vs. standard
                </p>
              </div>
            )}

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
              Select Policy
            </button>
          </div>
        ))}
      </div>

      {/* AI Insight */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={20} className="text-indigo-600" />
          <h4 className="font-bold text-slate-900">AI Insight</h4>
        </div>
        <p className="text-slate-700">
          Your excellent driving record qualifies you for our best rates. The Comprehensive Plus policy 
          saves you ₹4,500 vs. standard and provides optimal coverage for your BMW X5.
        </p>
      </div>
    </div>
  );
};

export default PolicyRecommendationsPage;

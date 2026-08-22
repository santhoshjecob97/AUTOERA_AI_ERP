import React from 'react';
import { Calculator, CheckCircle } from 'lucide-react';
import PageNavigation from '../../components/common/PageNavigation';

const SettlementCalculatorPage: React.FC = () => {
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
          <Calculator size={32} className="text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900">AI Settlement Calculator</h2>
        </div>
        <p className="text-slate-600">Automated claim settlement with policy compliance</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Settlement Calculation</h3>
        <div className="space-y-4">
          <div className="flex justify-between py-2 border-b">
            <span className="text-slate-600">Repair Cost</span>
            <span className="font-bold">₹90,000</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-slate-600">Depreciation (10%)</span>
            <span className="font-bold text-red-600">-₹9,000</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-slate-600">Deductible</span>
            <span className="font-bold text-red-600">-₹5,000</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-slate-600">Diminished Value</span>
            <span className="font-bold">₹15,000</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-slate-600">Rental Car (3 days)</span>
            <span className="font-bold">₹4,500</span>
          </div>
          <div className="flex justify-between py-3 border-t-2 border-slate-300">
            <span className="text-lg font-bold text-slate-900">Total Settlement</span>
            <span className="text-2xl font-bold text-purple-600">₹95,500</span>
          </div>
        </div>

        <div className="mt-6 bg-green-50 rounded-lg p-4 border border-green-200">
          <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
            <CheckCircle size={16} className="text-green-600" />
            AI Verification
          </h4>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-green-600" />
              <span>Market rates verified (local average)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-green-600" />
              <span>Policy terms compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-green-600" />
              <span>Depreciation calculated correctly</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-green-600" />
              <span>No fraud indicators</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Approve Settlement
          </button>
          <button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Adjust Amount
          </button>
          <button className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettlementCalculatorPage;

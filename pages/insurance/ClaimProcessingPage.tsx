import React, { useState } from 'react';
import { FileText, Camera, Sparkles, CheckCircle, AlertTriangle, Clock, Phone, Upload } from 'lucide-react';
import PageNavigation from '../../components/common/PageNavigation';

interface Claim {
  id: string;
  policyholderName: string;
  phone: string;
  policyNumber: string;
  vehicle: string;
  incidentType: string;
  damagePhotos: number;
  aiProcessingTime: string;
  damageSeverity: number;
  fraudProbability: number;
  estimatedCost: string;
  recommendedSettlement: string;
  status: 'submitted' | 'ai-assessed' | 'under-review' | 'approved' | 'rejected';
  submittedAt: string;
}

const mockClaims: Claim[] = [
  {
    id: 'INS-2024-001234',
    policyholderName: 'Rajesh Kumar',
    phone: '+91-9876543210',
    policyNumber: 'POL-789456',
    vehicle: 'BMW X5 2022',
    incidentType: 'Rear collision',
    damagePhotos: 3,
    aiProcessingTime: '3.2s',
    damageSeverity: 67,
    fraudProbability: 12,
    estimatedCost: '₹85,000 - ₹95,000',
    recommendedSettlement: '₹90,000',
    status: 'ai-assessed',
    submittedAt: '10:30 AM Today'
  },
  {
    id: 'INS-2024-001235',
    policyholderName: 'Priya Sharma',
    phone: '+91-9876543211',
    policyNumber: 'POL-789457',
    vehicle: 'Audi Q7 2023',
    incidentType: 'Front-end damage',
    damagePhotos: 5,
    aiProcessingTime: '4.1s',
    damageSeverity: 82,
    fraudProbability: 8,
    estimatedCost: '₹1,50,000 - ₹1,70,000',
    recommendedSettlement: '₹1,60,000',
    status: 'under-review',
    submittedAt: '09:15 AM Today'
  },
  {
    id: 'INS-2024-001236',
    policyholderName: 'Amit Verma',
    phone: '+91-9876543212',
    policyNumber: 'POL-789458',
    vehicle: 'Mercedes C-Class 2021',
    incidentType: 'Side impact',
    damagePhotos: 4,
    aiProcessingTime: '3.8s',
    damageSeverity: 45,
    fraudProbability: 87,
    estimatedCost: '₹60,000 - ₹70,000',
    recommendedSettlement: 'INVESTIGATE',
    status: 'under-review',
    submittedAt: '08:45 AM Today'
  }
];

const ClaimProcessingPage: React.FC = () => {
  const [selectedClaim, setSelectedClaim] = useState<Claim>(mockClaims[0]);
  const [showDamageDetails, setShowDamageDetails] = useState(true);

  const getSeverityColor = (severity: number) => {
    if (severity <= 30) return 'text-green-600';
    if (severity <= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityBg = (severity: number) => {
    if (severity <= 30) return 'bg-green-100 border-green-300';
    if (severity <= 70) return 'bg-yellow-100 border-yellow-300';
    return 'bg-red-100 border-red-300';
  };

  const getFraudColor = (probability: number) => {
    if (probability <= 30) return 'text-green-600';
    if (probability <= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-300';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-300';
      case 'under-review': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'ai-assessed': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const damageDetails = [
    { part: 'Rear Bumper', severity: 85, action: 'Replace', cost: '₹45,000', labor: '4 hours', color: 'red' },
    { part: 'Right Taillight', severity: 62, action: 'Replace', cost: '₹18,000', labor: '1 hour', color: 'yellow' },
    { part: 'Trunk Panel', severity: 35, action: 'Repair', cost: '₹12,000', labor: '2 hours', color: 'green' },
    { part: 'Paint Damage', severity: 45, action: 'Repaint', cost: '₹15,000', labor: '3 hours', color: 'yellow' }
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

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FileText size={32} className="text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-900">AI Claim Processing</h2>
            </div>
            <p className="text-slate-600">Automated claim assessment with computer vision damage analysis</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
              <Upload size={18} />
              New Claim
            </button>
            <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-semibold transition-colors">
              <Camera size={18} />
              Bulk Upload
            </button>
          </div>
        </div>
      </div>

      {/* Claims List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <h3 className="font-bold text-slate-900 mb-3">Recent Claims</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {mockClaims.map((claim) => (
            <button
              key={claim.id}
              onClick={() => setSelectedClaim(claim)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedClaim.id === claim.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="font-bold text-slate-900">{claim.policyholderName}</div>
              <div className="text-sm text-slate-500">{claim.id} • {claim.vehicle}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(claim.status)}`}>
                  {claim.status.replace('-', ' ').toUpperCase()}
                </span>
                {claim.fraudProbability > 70 && (
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700 border border-red-300">
                    FRAUD ALERT
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Claim Details */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Claim Assessment</h3>
            <p className="text-sm text-slate-500">
              Application #{selectedClaim.id} • {selectedClaim.vehicle}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-lg">
            <Sparkles size={16} />
            <span className="text-sm font-semibold">AI Processed in {selectedClaim.aiProcessingTime}</span>
          </div>
        </div>

        {/* Policyholder Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
          <div>
            <p className="text-xs text-slate-500 mb-1">Policyholder</p>
            <p className="font-semibold text-slate-900">{selectedClaim.policyholderName}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Policy Number</p>
            <p className="font-semibold text-slate-900">{selectedClaim.policyNumber}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Incident Type</p>
            <p className="font-semibold text-slate-900">{selectedClaim.incidentType}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Submitted</p>
            <p className="font-semibold text-slate-900">{selectedClaim.submittedAt}</p>
          </div>
        </div>

        {/* Damage Assessment */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <Camera size={20} className="text-blue-600" />
              AI Damage Assessment
            </h4>
            <button
              onClick={() => setShowDamageDetails(!showDamageDetails)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {showDamageDetails ? 'Hide Details' : 'Show Details'}
            </button>
          </div>

          {/* Damage Photos Placeholder */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-video bg-slate-200 rounded-lg flex items-center justify-center">
                <Camera size={32} className="text-slate-400" />
              </div>
            ))}
          </div>

          {/* AI Detection Summary */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-indigo-600" />
              <span className="font-semibold text-slate-900">AI Detection Results:</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-600" />
                <span className="text-slate-700">Rear bumper: Severe damage (replace)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-600" />
                <span className="text-slate-700">Right taillight: Cracked (replace)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-600" />
                <span className="text-slate-700">Trunk panel: Minor dent (repair)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-600" />
                <span className="text-slate-700">Paint damage: 2 panels</span>
              </div>
            </div>
          </div>

          {/* Severity and Fraud Scores */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`rounded-lg p-4 border ${getSeverityBg(selectedClaim.damageSeverity)}`}>
              <p className="text-sm text-slate-600 mb-1">Damage Severity</p>
              <p className={`text-3xl font-bold ${getSeverityColor(selectedClaim.damageSeverity)}`}>
                {selectedClaim.damageSeverity}/100
              </p>
              <p className="text-xs text-slate-600 mt-1">
                {selectedClaim.damageSeverity <= 30 ? 'MINOR' : selectedClaim.damageSeverity <= 70 ? 'MODERATE' : 'SEVERE'}
              </p>
            </div>
            <div className={`rounded-lg p-4 border ${
              selectedClaim.fraudProbability <= 30 ? 'bg-green-100 border-green-300' :
              selectedClaim.fraudProbability <= 70 ? 'bg-yellow-100 border-yellow-300' :
              'bg-red-100 border-red-300'
            }`}>
              <p className="text-sm text-slate-600 mb-1">Fraud Probability</p>
              <p className={`text-3xl font-bold ${getFraudColor(selectedClaim.fraudProbability)}`}>
                {selectedClaim.fraudProbability}/100
              </p>
              <p className="text-xs text-slate-600 mt-1">
                {selectedClaim.fraudProbability <= 30 ? 'LOW RISK ✅' : 
                 selectedClaim.fraudProbability <= 70 ? 'MEDIUM RISK ⚠️' : 
                 'HIGH RISK 🚨'}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Damage Breakdown */}
        {showDamageDetails && (
          <div className="bg-slate-50 rounded-xl p-4 mb-6">
            <h4 className="font-bold text-slate-900 mb-3">Part-by-Part Analysis</h4>
            <div className="space-y-3">
              {damageDetails.map((detail, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-900">{detail.part}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      detail.color === 'red' ? 'bg-red-100 text-red-700' :
                      detail.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      Severity: {detail.severity}/100
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Action</p>
                      <p className="font-semibold text-slate-900">{detail.action}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Cost</p>
                      <p className="font-semibold text-slate-900">{detail.cost}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Labor</p>
                      <p className="font-semibold text-slate-900">{detail.labor}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cost Breakdown and Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cost Breakdown */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3">Cost Breakdown</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Parts</span>
                <span className="font-semibold">₹45,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Labor</span>
                <span className="font-semibold">₹30,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Paint</span>
                <span className="font-semibold">₹15,000</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-300">
                <span className="font-bold text-slate-900">Estimated Cost</span>
                <span className="font-bold text-slate-900">{selectedClaim.estimatedCost}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-300">
                <span className="font-bold text-purple-600">Recommended Settlement</span>
                <span className="font-bold text-purple-600">{selectedClaim.recommendedSettlement}</span>
              </div>
            </div>
          </div>

          {/* Fraud Analysis */}
          <div className={`rounded-lg p-4 border ${
            selectedClaim.fraudProbability > 70 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
          }`}>
            <h4 className="font-bold text-slate-900 mb-3">Fraud Analysis</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-600" />
                <span className="text-slate-700">Claim History: Clean ✅</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-600" />
                <span className="text-slate-700">Timing: Normal ✅</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-600" />
                <span className="text-slate-700">Location: Consistent ✅</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-600" />
                <span className="text-slate-700">Photos: Authentic ✅</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-600" />
                <span className="text-slate-700">Pattern Match: None ✅</span>
              </div>
              <div className="pt-2 border-t border-slate-300 mt-2">
                <p className={`font-bold ${getFraudColor(selectedClaim.fraudProbability)}`}>
                  Overall Risk: {selectedClaim.fraudProbability <= 30 ? 'LOW' : 
                                selectedClaim.fraudProbability <= 70 ? 'MEDIUM' : 'HIGH'} 
                  ({selectedClaim.fraudProbability}/100)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200">
          {selectedClaim.fraudProbability <= 70 ? (
            <>
              <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Approve Settlement
              </button>
              <button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Request More Info
              </button>
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                <Phone size={18} />
                Call Customer
              </button>
            </>
          ) : (
            <>
              <button className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Investigate Fraud
              </button>
              <button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Request Documents
              </button>
              <button className="flex-1 bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Deny Claim
              </button>
            </>
          )}
        </div>
      </div>

      {/* Claim Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Claim Timeline</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle size={16} className="text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900">Submitted</p>
              <p className="text-sm text-slate-500">{selectedClaim.submittedAt}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle size={16} className="text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900">AI Assessment</p>
              <p className="text-sm text-slate-500">Completed in {selectedClaim.aiProcessingTime}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle size={16} className="text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900">Fraud Check</p>
              <p className="text-sm text-slate-500">Completed (1 min)</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2 bg-yellow-100 rounded-full">
              <Clock size={16} className="text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900">Manager Review</p>
              <p className="text-sm text-slate-500">In Progress</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2 bg-slate-100 rounded-full">
              <Clock size={16} className="text-slate-400" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900">Settlement</p>
              <p className="text-sm text-slate-500">Pending approval</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimProcessingPage;

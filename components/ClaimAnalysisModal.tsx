import React from 'react';
import { X, ShieldAlert, CheckCircle, Search, AlertTriangle, Camera, FileText, Zap, MapPin, Clock, History, AlertOctagon } from 'lucide-react';
import { InsuranceClaim } from '../types';

interface ClaimAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  claim: InsuranceClaim | null;
}

const ClaimAnalysisModal: React.FC<ClaimAnalysisModalProps> = ({ isOpen, onClose, claim }) => {
  if (!isOpen || !claim || !claim.aiAssessment) return null;

  const { aiAssessment } = claim;
  const fraudRisk = aiAssessment.fraudProbability > 50 ? 'High' : aiAssessment.fraudProbability > 20 ? 'Medium' : 'Low';
  const fraudColor = fraudRisk === 'High' ? 'text-red-600 bg-red-50 border-red-100' : fraudRisk === 'Medium' ? 'text-orange-600 bg-orange-50 border-orange-100' : 'text-green-600 bg-green-50 border-green-100';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Zap size={20} className="text-yellow-400" />
            <div>
              <h3 className="font-bold">AI Claim Adjudicator</h3>
              <p className="text-xs text-slate-400">Claim ID: {claim.id} • {claim.policyHolder}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6 bg-slate-50/50 flex-1">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visual Damage Assessment */}
            <div className="space-y-4">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Camera size={16} className="text-indigo-600"/> Visual Intelligence
                </h4>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="aspect-video bg-slate-800 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden group">
                         {/* Mock Heatmap */}
                         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 grayscale group-hover:grayscale-0 transition-all duration-500"></div>
                         <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-red-500 rounded-full blur-xl opacity-60 animate-pulse"></div>
                         <div className="absolute top-1/2 right-1/3 w-12 h-12 bg-orange-500 rounded-full blur-xl opacity-60"></div>
                         
                         <div className="absolute bottom-3 left-3 flex gap-2">
                             <span className="px-2 py-1 bg-black/60 backdrop-blur text-white text-[10px] rounded font-mono">CONFIDENCE: 98.2%</span>
                             <span className="px-2 py-1 bg-red-600 text-white text-[10px] rounded font-bold uppercase">Severe Impact</span>
                         </div>
                    </div>
                    
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                            <span className="text-slate-600">Primary Impact Zone</span>
                            <span className="font-bold text-slate-900">Front Bumper / Right Fender</span>
                        </div>
                        
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Component Damage Breakdown</p>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-700">Front Bumper Assembly</span>
                                    <span className="text-red-600 font-bold">Replace (100%)</span>
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full">
                                    <div className="bg-red-500 h-1.5 rounded-full w-full"></div>
                                </div>

                                <div className="flex items-center justify-between text-xs mt-1">
                                    <span className="text-slate-700">Right Headlamp Unit</span>
                                    <span className="text-orange-600 font-bold">Repair/Check (60%)</span>
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full">
                                    <div className="bg-orange-500 h-1.5 rounded-full w-[60%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fraud Detection & Analysis */}
            <div className="space-y-4">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <ShieldAlert size={16} className="text-red-600"/> Fraud Risk Analysis
                </h4>
                
                {/* Score Card */}
                <div className={`p-4 rounded-xl border flex items-center justify-between ${fraudColor}`}>
                     <div>
                        <p className="text-xs font-bold uppercase opacity-70">Fraud Probability</p>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-bold">{aiAssessment.fraudProbability}%</span>
                            <span className="text-sm font-medium mb-1 opacity-80">{fraudRisk} Risk</span>
                        </div>
                     </div>
                     <div className="bg-white/50 p-2 rounded-lg">
                        <AlertOctagon size={24} />
                     </div>
                </div>

                {/* Risk Factors Checklist */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-3 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase">
                        Risk Factor Verification
                    </div>
                    <div className="divide-y divide-slate-100">
                        <div className="p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-1.5 rounded-full ${aiAssessment.fraudProbability > 50 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                    <MapPin size={14} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900">Location Consistency</p>
                                    <p className="text-[10px] text-slate-500">GPS matches incident report</p>
                                </div>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded ${aiAssessment.fraudProbability > 50 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                                {aiAssessment.fraudProbability > 50 ? 'MISMATCH' : 'VERIFIED'}
                            </span>
                        </div>

                        <div className="p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-1.5 rounded-full ${aiAssessment.fraudProbability > 60 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                    <Clock size={14} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900">Metadata Timestamp</p>
                                    <p className="text-[10px] text-slate-500">Photo creation time vs incident</p>
                                </div>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded ${aiAssessment.fraudProbability > 60 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                                {aiAssessment.fraudProbability > 60 ? 'ANOMALY' : 'VERIFIED'}
                            </span>
                        </div>

                        <div className="p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 rounded-full bg-blue-100 text-blue-600">
                                    <History size={14} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900">Claim Velocity</p>
                                    <p className="text-[10px] text-slate-500">Frequency of claims in 12 months</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-1 rounded bg-blue-50 text-blue-700">
                                NORMAL
                            </span>
                        </div>
                    </div>
                </div>

                {/* Anomalies List */}
                {aiAssessment.flaggedInconsistencies.length > 0 && (
                    <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                         <p className="text-xs font-bold text-red-800 mb-2 flex items-center gap-1">
                            <AlertTriangle size={12}/> Critical Inconsistencies Detected
                         </p>
                         <ul className="list-disc list-inside space-y-1">
                            {aiAssessment.flaggedInconsistencies.map((flag, idx) => (
                                <li key={idx} className="text-xs text-red-700 pl-1">{flag}</li>
                            ))}
                         </ul>
                    </div>
                )}
            </div>
          </div>
          
          {/* Payout Recommendation */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                    <p className="text-sm font-medium text-slate-600">Claimed Amount</p>
                    <p className="text-lg font-bold text-slate-900 line-through decoration-slate-400 opacity-60">{claim.claimedAmount}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold text-indigo-900">AI Adjusted Payout</p>
                    <p className="text-2xl font-bold text-indigo-600">{aiAssessment.recommendedPayout}</p>
                    <p className="text-[10px] text-slate-500">Adjusted for depreciation & deductible</p>
                </div>
          </div>

        </div>

        <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-3">
             <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                Dismiss
             </button>
             {fraudRisk === 'High' ? (
                <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors flex items-center gap-2">
                    <Search size={16} /> Flag for Investigation
                </button>
             ) : (
                <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm transition-colors flex items-center gap-2">
                    <CheckCircle size={16} /> Approve Payout
                </button>
             )}
        </div>
      </div>
    </div>
  );
};

export default ClaimAnalysisModal;
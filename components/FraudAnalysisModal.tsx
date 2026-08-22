import React from 'react';
import { X, ShieldAlert, MapPin, Smartphone, Activity, AlertTriangle, CheckCircle, Ban } from 'lucide-react';
import { Transaction } from '../types';

interface FraudAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

const FraudAnalysisModal: React.FC<FraudAnalysisModalProps> = ({ isOpen, onClose, transaction }) => {
  if (!isOpen || !transaction || !transaction.fraudAnalysis) return null;

  const { fraudAnalysis } = transaction;
  const riskColor = fraudAnalysis.riskScore > 80 ? 'text-red-600' : fraudAnalysis.riskScore > 50 ? 'text-orange-600' : 'text-green-600';
  const riskBg = fraudAnalysis.riskScore > 80 ? 'bg-red-50 border-red-100' : fraudAnalysis.riskScore > 50 ? 'bg-orange-50 border-orange-100' : 'bg-green-50 border-green-100';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-red-600 text-white">
          <div className="flex items-center gap-2">
            <ShieldAlert size={20} className="text-red-100" />
            <div>
              <h3 className="font-bold">Fraud Detection Intelligence</h3>
              <p className="text-xs text-red-100 opacity-90">Transaction ID: {transaction.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Top Risk Score */}
          <div className="flex items-stretch gap-6">
            <div className={`flex-1 p-4 rounded-xl border ${riskBg} flex flex-col items-center justify-center text-center`}>
              <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">AI Risk Score</h4>
              <div className="text-5xl font-bold mb-2 flex items-start justify-center gap-1">
                <span className={riskColor}>{fraudAnalysis.riskScore}</span>
                <span className="text-sm text-slate-400 mt-2">/100</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                fraudAnalysis.riskScore > 80 ? 'bg-red-200 text-red-800' : 'bg-orange-200 text-orange-800'
              }`}>
                CRITICAL RISK
              </span>
            </div>

            <div className="flex-1 space-y-3">
               <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                 <div className="flex items-center gap-2 text-slate-700">
                    <MapPin size={16} />
                    <span className="text-sm font-medium">Location Check</span>
                 </div>
                 <span className={`text-xs font-bold px-2 py-0.5 rounded ${fraudAnalysis.locationMismatch ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {fraudAnalysis.locationMismatch ? 'MISMATCH' : 'MATCH'}
                 </span>
               </div>
               <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                 <div className="flex items-center gap-2 text-slate-700">
                    <Smartphone size={16} />
                    <span className="text-sm font-medium">Device Fingerprint</span>
                 </div>
                 <span className={`text-xs font-bold px-2 py-0.5 rounded ${fraudAnalysis.deviceFingerprint === 'Trusted' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {fraudAnalysis.deviceFingerprint.toUpperCase()}
                 </span>
               </div>
               <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                 <div className="flex items-center gap-2 text-slate-700">
                    <Activity size={16} />
                    <span className="text-sm font-medium">Velocity Check</span>
                 </div>
                 <span className={`text-xs font-bold px-2 py-0.5 rounded ${fraudAnalysis.transactionVelocity === 'Normal' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {fraudAnalysis.transactionVelocity.toUpperCase()}
                 </span>
               </div>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-500" />
              Flagged Anomalies
            </h4>
            <div className="space-y-2">
              {fraudAnalysis.flaggedReasons.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></span>
                  {reason}
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-500 italic">
                "Transaction originated from an IP address (Nigeria) consistent with known botnets, while customer billing address is in Mumbai. High velocity of attempts detected."
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-3 border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50">
              Dismiss (False Positive)
            </button>
            <button className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 shadow-lg shadow-red-200">
              <Ban size={18} />
              Block & Report Fraud
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FraudAnalysisModal;
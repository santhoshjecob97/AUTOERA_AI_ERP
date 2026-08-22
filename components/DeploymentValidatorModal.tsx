import React, { useState } from 'react';
import { X, CheckCircle, AlertTriangle, Loader2, Server, Globe, Database, Lock, Play } from 'lucide-react';

interface DeploymentValidatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeploymentValidatorModal: React.FC<DeploymentValidatorModalProps> = ({ isOpen, onClose }) => {
  const [isValidating, setIsValidating] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const checks = [
    { id: 1, label: 'PostgreSQL Database Connection', icon: Database },
    { id: 2, label: 'Redis Cache Cluster', icon: Server },
    { id: 3, label: 'SSL Certificate Validity', icon: Lock },
    { id: 4, label: 'DNS Propagation (CNAME)', icon: Globe },
    { id: 5, label: 'Twilio SMS API', icon: Server },
    { id: 6, label: 'SendGrid Email API', icon: Server },
    { id: 7, label: 'Gemini AI Model Latency', icon: Server },
  ];

  const runValidation = () => {
    setIsValidating(true);
    setResults([]);
    
    checks.forEach((check, index) => {
        setTimeout(() => {
            setResults(prev => [...prev, { id: check.id, status: Math.random() > 0.1 ? 'Pass' : 'Warn' }]);
            if (index === checks.length - 1) setIsValidating(false);
        }, (index + 1) * 600);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-400" size={20} />
            <div>
              <h3 className="font-bold">Deployment Validator</h3>
              <p className="text-xs text-slate-400">Pre-Flight System Checks</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
            {!isValidating && results.length === 0 ? (
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Server size={32} className="text-slate-400" />
                    </div>
                    <h4 className="font-bold text-slate-800">Ready to Validate</h4>
                    <p className="text-sm text-slate-500 mb-6">Run a full system diagnostic before launching the tenant.</p>
                    <button 
                        onClick={runValidation}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 mx-auto"
                    >
                        <Play size={18} /> Run Diagnostics
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {checks.map((check) => {
                        const result = results.find(r => r.id === check.id);
                        return (
                            <div key={check.id} className="flex justify-between items-center p-3 border border-slate-100 rounded-lg bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <check.icon size={16} className="text-slate-500" />
                                    <span className="text-sm font-medium text-slate-700">{check.label}</span>
                                </div>
                                <div>
                                    {result ? (
                                        <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded ${
                                            result.status === 'Pass' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                        }`}>
                                            {result.status === 'Pass' ? <CheckCircle size={12}/> : <AlertTriangle size={12}/>}
                                            {result.status === 'Pass' ? 'PASSED' : 'WARNING'}
                                        </span>
                                    ) : (
                                        isValidating && <Loader2 size={16} className="animate-spin text-slate-400" />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
             <span className="text-xs text-slate-500">
                {isValidating ? 'Running checks...' : results.length > 0 ? 'Validation Complete' : 'Last run: Never'}
             </span>
             {results.length > 0 && !isValidating && (
                 <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors">
                    Proceed to Launch
                 </button>
             )}
        </div>
      </div>
    </div>
  );
};

export default DeploymentValidatorModal;
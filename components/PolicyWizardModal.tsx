import React, { useState } from 'react';
import { X, Shield, ChevronRight, Check, Activity, Car, Award, Star, Info, Zap, ThumbsUp } from 'lucide-react';

interface PolicyWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PolicyWizardModal: React.FC<PolicyWizardModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [data, setData] = useState({
    vehicleAge: '0-2',
    driverAge: '25-35',
    usage: 'Personal',
    claimsHistory: 'None'
  });

  if (!isOpen) return null;

  const calculatePolicy = () => {
    setLoading(true);
    setTimeout(() => {
        setResult({
            riskScore: 85,
            recommendedType: 'Zero Depreciation',
            comparison: [
                {
                    type: 'Third Party',
                    price: '₹6,500',
                    coverage: ['Liability Only', 'Legal Protection', 'Personal Accident'],
                    missing: ['Own Damage', 'Theft Protection', 'Zero Depreciation', 'Roadside Assistance'],
                    suitability: 'Low',
                    aiReason: 'Basic mandatory coverage only.'
                },
                {
                    type: 'Comprehensive',
                    price: '₹14,200',
                    coverage: ['Third Party Liability', 'Own Damage', 'Theft', 'Fire & Natural Calamity'],
                    missing: ['Zero Depreciation', 'Engine Protection'],
                    suitability: 'Medium',
                    aiReason: 'Good balance, but depreciation applies.'
                },
                {
                    type: 'Zero Depreciation',
                    price: '₹18,500',
                    isRecommended: true,
                    coverage: ['All Comprehensive Covers', 'Zero Depreciation (100% Parts)', 'Engine Protection', '24/7 Roadside Assistance'],
                    missing: [],
                    suitability: 'High',
                    aiReason: 'Highly Recommended for new vehicles (0-2 years) to ensure 100% claim recovery.'
                }
            ],
            savings: '₹4,200'
        });
        setLoading(false);
        setStep(2);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-emerald-50">
          <div className="flex items-center gap-2">
            <Shield className="text-emerald-600" size={20} />
            <h3 className="font-bold text-slate-900">AI Policy Recommender & Comparison</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-emerald-100 rounded-full transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
            {step === 1 && (
                !loading ? (
                    <div className="max-w-lg mx-auto space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-xl font-bold text-slate-900">Personalized Coverage Analysis</h2>
                            <p className="text-sm text-slate-600 mt-1">Our AI analyzes your driver profile and vehicle data to recommend optimal coverage.</p>
                        </div>
                        
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase">Vehicle Age</label>
                            <div className="grid grid-cols-3 gap-3 mt-2">
                                {['0-2', '3-5', '5+'].map(opt => (
                                    <button 
                                        key={opt}
                                        onClick={() => setData({...data, vehicleAge: opt})}
                                        className={`py-3 px-4 text-sm font-medium rounded-xl border transition-all ${data.vehicleAge === opt ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                                    >
                                        {opt} Years
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase">Driver Age</label>
                            <div className="grid grid-cols-3 gap-3 mt-2">
                                {['18-24', '25-35', '35+'].map(opt => (
                                    <button 
                                        key={opt}
                                        onClick={() => setData({...data, driverAge: opt})}
                                        className={`py-3 px-4 text-sm font-medium rounded-xl border transition-all ${data.driverAge === opt ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase">Prior Claims History</label>
                            <div className="grid grid-cols-2 gap-3 mt-2">
                                {['None', '1+'].map(opt => (
                                    <button 
                                        key={opt}
                                        onClick={() => setData({...data, claimsHistory: opt})}
                                        className={`py-3 px-4 text-sm font-medium rounded-xl border transition-all ${data.claimsHistory === opt ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button 
                            onClick={calculatePolicy}
                            className="w-full mt-6 py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg"
                        >
                            <Zap size={18} className="fill-current" /> Analyze Risk & Compare Plans
                        </button>
                    </div>
                ) : (
                    <div className="py-24 flex flex-col items-center justify-center text-center">
                        <div className="relative">
                             <Activity className="text-emerald-500 animate-pulse" size={64} />
                             <div className="absolute inset-0 bg-emerald-200 blur-xl opacity-20 rounded-full animate-pulse"></div>
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg mt-6">Running Actuarial Models...</h3>
                        <p className="text-sm text-slate-500 mt-2">Comparing 15+ parameters against risk database</p>
                    </div>
                )
            )}

            {step === 2 && result && (
                <div className="animate-in slide-in-from-right duration-300 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                         <div className="flex items-center gap-4">
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                <Activity className="text-emerald-600" size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-semibold">Calculated Risk Score</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-slate-900">{result.riskScore}/100</span>
                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">Low Risk Profile</span>
                                </div>
                            </div>
                         </div>
                         <div className="text-right hidden sm:block">
                             <p className="text-xs text-slate-500 uppercase font-semibold mb-1">AI Recommendation</p>
                             <div className="flex items-center gap-1.5 justify-end text-emerald-700 font-bold">
                                <Star size={16} className="fill-current" /> {result.recommendedType}
                             </div>
                         </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {result.comparison.map((plan: any, idx: number) => (
                            <div key={idx} className={`relative flex flex-col border rounded-xl overflow-hidden transition-all ${plan.isRecommended ? 'border-emerald-500 shadow-lg ring-1 ring-emerald-500 bg-white scale-105 z-10' : 'border-slate-200 bg-slate-50/50 hover:bg-white'}`}>
                                {plan.isRecommended && (
                                    <div className="bg-emerald-500 text-white text-center py-1 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                                        <ThumbsUp size={10} /> AI Recommended
                                    </div>
                                )}
                                <div className="p-5 flex-1 flex flex-col">
                                    <h4 className="font-bold text-slate-900 text-lg mb-1">{plan.type}</h4>
                                    <div className="text-2xl font-bold text-slate-900 mb-2">{plan.price} <span className="text-xs font-normal text-slate-500">/year</span></div>
                                    
                                    {plan.aiReason && (
                                        <p className="text-xs text-slate-500 italic mb-4 bg-slate-100 p-2 rounded">
                                            "{plan.aiReason}"
                                        </p>
                                    )}

                                    <div className="space-y-3 mb-6 flex-1">
                                        {plan.coverage.map((feat: string, i: number) => (
                                            <div key={i} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                                                <Check size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                                                {feat}
                                            </div>
                                        ))}
                                        {plan.missing.map((feat: string, i: number) => (
                                            <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                                                <X size={14} className="text-slate-300 mt-0.5 shrink-0" />
                                                {feat}
                                            </div>
                                        ))}
                                    </div>

                                    <button className={`w-full py-2.5 rounded-lg text-sm font-bold transition-colors ${plan.isRecommended ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                        Select Plan
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <button onClick={() => setStep(1)} className="self-center text-sm text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1">
                        Start Over
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default PolicyWizardModal;
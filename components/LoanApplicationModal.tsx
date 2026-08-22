import React, { useState, useEffect } from 'react';
import { X, Save, User, Wallet, Calendar, Percent, Calculator, Sparkles, CheckCircle, AlertCircle, ThumbsUp, ArrowRight } from 'lucide-react';
import { LoanApplication } from '../types';

interface LoanApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (loan: Omit<LoanApplication, 'id' | 'status'>) => void;
}

const LoanApplicationModal: React.FC<LoanApplicationModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    applicantName: '',
    vehicle: '',
    creditScore: 750,
    loanAmount: 1000000,
    tenure: 60,
    interestRate: 9.5,
    monthlyEMI: ''
  });
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [aiReport, setAiReport] = useState<{
    eligible: boolean;
    probability: number;
    reasoning: string[];
    risk: 'Low' | 'Medium' | 'High';
    originalAmount?: number;
  } | null>(null);

  // Simple EMI Calculation logic
  useEffect(() => {
    const P = formData.loanAmount;
    const R = formData.interestRate / 12 / 100;
    const N = formData.tenure;
    
    if (P > 0 && R > 0 && N > 0) {
      const emi = P * R * (Math.pow(1 + R, N) / (Math.pow(1 + R, N) - 1));
      setFormData(prev => ({ ...prev, monthlyEMI: Math.round(emi).toString() }));
    }
  }, [formData.loanAmount, formData.interestRate, formData.tenure]);

  if (!isOpen) return null;

  const handleAISuggest = () => {
    setIsOptimizing(true);
    setAiReport(null);
    const originalAmount = formData.loanAmount;

    // Simulate AI optimization
    setTimeout(() => {
        const score = formData.creditScore;
        let rate = 11.0;
        let tenure = 48;
        let probability = 50;
        let risk: 'Low' | 'Medium' | 'High' = 'High';
        let reasoning = [];
        let optimizedAmount = originalAmount;
        
        if (score > 800) { 
            rate = 8.5; tenure = 60; probability = 98; risk = 'Low';
            reasoning = ['Excellent Credit History', 'Low Debt-to-Income Ratio', 'Prime Borrower Category'];
        }
        else if (score > 750) { 
            rate = 9.2; tenure = 60; probability = 85; risk = 'Low';
            reasoning = ['Good Repayment Track Record', 'Stable Employment Sector'];
        }
        else if (score > 700) { 
            rate = 9.9; tenure = 60; probability = 70; risk = 'Medium';
            reasoning = ['Moderate Credit Utilization', 'Acceptable Risk Profile'];
        } else {
            rate = 12.5; tenure = 36; probability = 45; risk = 'High';
            // Logic to reduce loan amount for higher approval chance
            optimizedAmount = Math.round(originalAmount * 0.85 / 10000) * 10000; 
            reasoning = [
                'Recent Delinquencies Detected', 
                'High Credit Utilization (>80%)',
                `Loan Amount optimized (-15%) to increase approval odds`
            ];
        }

        setFormData(prev => ({
            ...prev,
            interestRate: rate,
            tenure: tenure,
            loanAmount: optimizedAmount
        }));
        
        setAiReport({
            eligible: probability > 60,
            probability,
            risk,
            reasoning,
            originalAmount: optimizedAmount !== originalAmount ? originalAmount : undefined
        });

        setIsOptimizing(false);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
        applicantName: formData.applicantName,
        vehicle: formData.vehicle,
        creditScore: formData.creditScore,
        loanAmount: `₹${(formData.loanAmount / 100000).toFixed(1)}L`,
        tenure: formData.tenure,
        interestRate: formData.interestRate,
        monthlyEMI: `₹${parseInt(formData.monthlyEMI).toLocaleString('en-IN')}`,
        aiProbability: aiReport?.probability || (formData.creditScore > 750 ? 90 : 60),
        riskLevel: aiReport?.risk || (formData.creditScore > 750 ? 'Low' : 'Medium')
    });
    // Reset form
    setFormData({ applicantName: '', vehicle: '', creditScore: 750, loanAmount: 1000000, tenure: 60, interestRate: 9.5, monthlyEMI: '' });
    setAiReport(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-emerald-50">
          <div className="flex items-center gap-2">
            <Wallet className="text-emerald-600" size={20} />
            <h3 className="font-bold text-slate-900">New Loan Application</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-emerald-100 rounded-full transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Applicant Name</label>
                <div className="relative">
                <User size={16} className="absolute left-3 top-3 text-slate-400" />
                <input 
                    required
                    type="text" 
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm"
                    placeholder="Full Legal Name"
                    value={formData.applicantName}
                    onChange={e => setFormData({...formData, applicantName: e.target.value})}
                />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle Model</label>
                <input 
                required
                type="text" 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                placeholder="e.g. 2024 Tata Nexon EV"
                value={formData.vehicle}
                onChange={e => setFormData({...formData, vehicle: e.target.value})}
                />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Loan Amount (₹)</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                  value={formData.loanAmount}
                  onChange={e => setFormData({...formData, loanAmount: Number(e.target.value)})}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Credit Score</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                  value={formData.creditScore}
                  onChange={e => setFormData({...formData, creditScore: Number(e.target.value)})}
                  placeholder="e.g. 750"
                />
            </div>
          </div>

          <div className="flex justify-end">
             <button 
                type="button" 
                onClick={handleAISuggest}
                disabled={isOptimizing}
                className="text-xs flex items-center gap-1.5 text-white bg-emerald-600 hover:bg-emerald-700 font-medium px-3 py-1.5 rounded-lg shadow-sm transition-all disabled:opacity-50"
             >
                <Sparkles size={14} className={isOptimizing ? "animate-spin" : ""} /> 
                {isOptimizing ? 'Analyzing Profile...' : 'Assess Eligibility & Optimize Terms'}
             </button>
          </div>

          {/* AI Pre-Qualification Report */}
          {aiReport && (
            <div className={`rounded-xl p-4 border animate-in fade-in zoom-in duration-300 ${aiReport.eligible ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        {aiReport.eligible ? <ThumbsUp size={18} className="text-green-600"/> : <AlertCircle size={18} className="text-orange-600"/>}
                        <h4 className={`font-bold text-sm ${aiReport.eligible ? 'text-green-900' : 'text-orange-900'}`}>
                            {aiReport.eligible ? 'High Eligibility Probability' : 'Optimization Required'}
                        </h4>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${aiReport.eligible ? 'bg-green-200 text-green-800' : 'bg-orange-200 text-orange-800'}`}>
                        {aiReport.probability}% Match
                    </span>
                </div>
                <div className="space-y-1 mb-2 pl-6">
                    {aiReport.reasoning.map((reason, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-600">
                            <CheckCircle size={10} className={aiReport.eligible ? "text-green-500" : "text-orange-500"}/>
                            {reason}
                        </div>
                    ))}
                    {aiReport.originalAmount && (
                         <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold mt-1">
                             <ArrowRight size={10} className="text-emerald-600"/>
                             Adjusted Amount: ₹{aiReport.originalAmount.toLocaleString()} → ₹{formData.loanAmount.toLocaleString()}
                         </div>
                    )}
                </div>
                <div className="text-xs italic opacity-75 pl-6 border-t border-black/5 pt-2 mt-2">
                    AI suggests setting Interest Rate to <strong>{formData.interestRate}%</strong> and Tenure to <strong>{formData.tenure} months</strong> for optimal approval.
                </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tenure (Months)</label>
                <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input 
                    type="number" 
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                    value={formData.tenure}
                    onChange={e => setFormData({...formData, tenure: Number(e.target.value)})}
                    />
                </div>
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Interest Rate (%)</label>
                <div className="relative">
                    <Percent size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input 
                    type="number" 
                    step="0.1"
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                    value={formData.interestRate}
                    onChange={e => setFormData({...formData, interestRate: Number(e.target.value)})}
                    />
                </div>
             </div>
          </div>

          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 mt-2">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Calculator size={18} className="text-emerald-600"/>
                    <span className="text-sm font-semibold text-emerald-900">Estimated EMI</span>
                </div>
                <span className="text-xl font-bold text-emerald-700">₹{parseInt(formData.monthlyEMI).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors text-sm"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors flex items-center justify-center gap-2 shadow-sm shadow-emerald-200 text-sm"
            >
              <Save size={16} />
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoanApplicationModal;
import React, { useState } from 'react';
import { X, TrendingUp, AlertTriangle, CheckCircle, ShieldCheck, Activity, PieChart, ArrowUpCircle, AlertCircle, Sliders } from 'lucide-react';
import { LoanApplication } from '../types';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface FinanceAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: LoanApplication | null;
}

const FinanceAnalysisModal: React.FC<FinanceAnalysisModalProps> = ({ isOpen, onClose, application }) => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'simulator'>('analysis');
  const [simulatedPayoff, setSimulatedPayoff] = useState(0);

  if (!isOpen || !application) return null;

  const data = [
    { name: 'Income', value: 70, color: '#10b981' }, // emerald-500
    { name: 'Existing Debt', value: 20, color: '#f59e0b' }, // amber-500
    { name: 'New EMI', value: 10, color: '#6366f1' }, // indigo-500
  ];

  const scoreColor = application.creditScore >= 750 ? 'text-green-600' : application.creditScore >= 650 ? 'text-yellow-600' : 'text-red-600';
  const riskColor = application.riskLevel === 'Low' ? 'bg-green-100 text-green-800' : application.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';

  // Mock Factor Analysis Logic
  const factors = [
    { name: 'Payment History', impact: 'High', status: 'Positive', detail: 'No missed payments in 24 months.' },
    { name: 'Credit Utilization', impact: 'High', status: application.creditScore > 700 ? 'Positive' : 'Negative', detail: application.creditScore > 700 ? 'Usage below 30% limit.' : 'High usage detected (>70%).' },
    { name: 'Credit Age', impact: 'Medium', status: 'Neutral', detail: 'Average account age: 3.5 years.' },
    { name: 'Recent Inquiries', impact: 'Low', status: 'Positive', detail: 'Only 1 inquiry in last 6 months.' },
  ];

  // Simulator Logic
  const simulatedScore = application.creditScore + Math.min(50, Math.floor(simulatedPayoff / 2000));
  const scoreDiff = simulatedScore - application.creditScore;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-emerald-600 text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-emerald-100" />
            <div>
                <h3 className="font-bold">Financial Risk Assessment</h3>
                <p className="text-xs text-emerald-100 opacity-90">App ID: {application.id} • {application.applicantName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50">
            <button 
                onClick={() => setActiveTab('analysis')}
                className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'analysis' ? 'border-emerald-600 text-emerald-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
                AI Risk Analysis
            </button>
            <button 
                onClick={() => setActiveTab('simulator')}
                className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'simulator' ? 'border-emerald-600 text-emerald-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
                <Sliders size={14} /> Score Simulator
            </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6 flex-1 bg-slate-50/50">
            
            {activeTab === 'analysis' ? (
                <>
                {/* Top Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <h4 className="font-semibold text-slate-500 text-xs uppercase tracking-wider mb-2">Credit Score Engine</h4>
                        <div className="flex items-end gap-2">
                            <span className={`text-4xl font-bold ${scoreColor}`}>{application.creditScore}</span>
                            <span className="text-xs text-slate-400 mb-1">/ 900</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
                            <div 
                                className={`h-1.5 rounded-full ${application.creditScore >= 750 ? 'bg-green-500' : 'bg-yellow-500'}`} 
                                style={{ width: `${(application.creditScore / 900) * 100}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">AI Assessment: {application.riskLevel} Risk Profile</p>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <h4 className="font-semibold text-slate-500 text-xs uppercase tracking-wider mb-2">Approval Probability</h4>
                        <div className="flex items-center justify-between">
                            <div className="relative w-20 h-20">
                                <svg className="w-full h-full" viewBox="0 0 36 36">
                                    <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="#e2e8f0"
                                        strokeWidth="3"
                                    />
                                    <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="#10b981"
                                        strokeWidth="3"
                                        strokeDasharray={`${application.aiProbability}, 100`}
                                    />
                                </svg>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-slate-900">
                                    {application.aiProbability}%
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`inline-block px-2 py-1 rounded text-xs font-bold mb-1 ${riskColor}`}>
                                    {application.riskLevel} Risk
                                </span>
                                <p className="text-xs text-slate-400">AI Confidence: 98%</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <h4 className="font-semibold text-slate-500 text-xs uppercase tracking-wider mb-2">AI Recommended Terms</h4>
                        <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Max Loan:</span>
                                <span className="font-bold text-slate-900">₹{application.creditScore > 750 ? '15.0L' : '10.0L'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Interest:</span>
                                <span className="font-bold text-green-600">{application.interestRate > 9 ? application.interestRate - 0.5 : application.interestRate}% <span className="text-[10px] font-normal text-slate-400 line-through">{application.interestRate}%</span></span>
                            </div>
                            <div className="mt-3 pt-2 border-t border-slate-100">
                                <p className="text-xs text-slate-500 italic">"Applicant qualifies for Prime Rate discount based on DTI ratio."</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Credit Analysis Breakdown */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Activity size={18} className="text-emerald-600"/> Credit Score Factor Analysis
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {factors.map((factor, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50">
                                <div className={`mt-0.5 p-1 rounded-full ${factor.status === 'Positive' ? 'bg-green-100 text-green-600' : factor.status === 'Negative' ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-500'}`}>
                                    {factor.status === 'Positive' ? <ArrowUpCircle size={16}/> : factor.status === 'Negative' ? <AlertCircle size={16}/> : <Activity size={16}/>}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-slate-800">{factor.name}</span>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                            factor.impact === 'High' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                                        }`}>
                                            {factor.impact} Impact
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600 mt-1">{factor.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Improvement Plan */}
                {application.creditScore < 750 && (
                    <div className="bg-indigo-50 rounded-xl shadow-sm border border-indigo-100 p-4 flex items-start gap-4">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600">
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-indigo-900 text-sm mb-1">Score Improvement Plan</h4>
                            <p className="text-xs text-indigo-700 leading-relaxed">
                                To reach the next tier (750+), the applicant should reduce credit card utilization below 30% on their primary card. An increase of +25 points is projected within 3 months if no new hard inquiries occur.
                            </p>
                        </div>
                    </div>
                )}

                {/* Main Analysis Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
                        <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <PieChart size={16} className="text-indigo-500"/> Debt-to-Income Ratio (DTI)
                        </h4>
                        <div className="h-48 flex items-center">
                            <div className="w-1/2 h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RechartsPie>
                                        <Pie 
                                            data={data} 
                                            innerRadius={40} 
                                            outerRadius={60} 
                                            paddingAngle={5} 
                                            dataKey="value"
                                        >
                                            {data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </RechartsPie>
                                </ResponsiveContainer>
                            </div>
                            <div className="w-1/2 space-y-2">
                                {data.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                        <span className="text-xs text-slate-600">{item.name} ({item.value}%)</span>
                                    </div>
                                ))}
                                <p className="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-100">
                                    Healthy DTI detected (30%). Well within 45% threshold.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
                            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <Activity size={16} className="text-slate-600"/> Fraud Detection Checks
                            </h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-2 bg-green-50 rounded border border-green-100">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle size={14} className="text-green-600"/>
                                        <span className="text-xs font-medium text-green-900">Identity Verification (KYC)</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-green-700 bg-white px-1.5 py-0.5 rounded border border-green-200">PASSED</span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-green-50 rounded border border-green-100">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle size={14} className="text-green-600"/>
                                        <span className="text-xs font-medium text-green-900">Income Validation</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-green-700 bg-white px-1.5 py-0.5 rounded border border-green-200">PASSED</span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-yellow-50 rounded border border-yellow-100">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle size={14} className="text-yellow-600"/>
                                        <span className="text-xs font-medium text-yellow-900">Address Stability</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-yellow-700 bg-white px-1.5 py-0.5 rounded border border-yellow-200">REVIEW</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </>
            ) : (
                <div className="h-full flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-slate-100">
                    <div className="w-full max-w-lg space-y-8">
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-slate-900">Credit Score Simulator</h3>
                            <p className="text-sm text-slate-500">Estimate how paying off existing debt impacts eligibility.</p>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex justify-between items-center">
                            <div className="text-center">
                                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Current Score</p>
                                <p className="text-3xl font-bold text-slate-600">{application.creditScore}</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <ArrowUpCircle size={24} className="text-emerald-500 animate-bounce" />
                                <span className="font-bold text-emerald-600">+{scoreDiff}</span>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Simulated Score</p>
                                <p className="text-3xl font-bold text-emerald-600">{simulatedScore}</p>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-slate-700">Pay Down Existing Debt</label>
                                <span className="text-sm font-bold text-indigo-600">₹{simulatedPayoff.toLocaleString()}</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="100000" 
                                step="5000" 
                                value={simulatedPayoff}
                                onChange={(e) => setSimulatedPayoff(Number(e.target.value))}
                                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                            <div className="flex justify-between text-xs text-slate-400 mt-1">
                                <span>₹0</span>
                                <span>₹1,00,000</span>
                            </div>
                        </div>

                        <div className="bg-indigo-50 p-4 rounded-xl text-indigo-800 text-sm leading-relaxed border border-indigo-100">
                            <strong>AI Prediction:</strong> Reducing debt by ₹{simulatedPayoff.toLocaleString()} could improve credit utilization ratio by {Math.floor(simulatedPayoff/2000)}%, potentially qualifying the applicant for a <strong>{(application.interestRate - 0.5).toFixed(1)}%</strong> interest rate.
                        </div>
                    </div>
                </div>
            )}

        </div>

        <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-3">
             <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                Close
             </button>
             <button className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors flex items-center gap-2">
                <CheckCircle size={16} /> Approve Loan
             </button>
        </div>
      </div>
    </div>
  );
};

export default FinanceAnalysisModal;
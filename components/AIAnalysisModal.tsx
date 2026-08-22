import React from 'react';
import { X, TrendingUp, AlertCircle, CheckCircle2, MessageSquare, Target, BarChart2, Clock, History } from 'lucide-react';
import { Lead } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface AIAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
}

const AIAnalysisModal: React.FC<AIAnalysisModalProps> = ({ isOpen, onClose, lead }) => {
  if (!isOpen || !lead) return null;

  const scoreData = [
    { subject: 'Budget Fit', A: lead.aiScore > 80 ? 95 : 60, fullMark: 100 },
    { subject: 'Engagement', A: lead.aiScore > 70 ? 85 : 40, fullMark: 100 },
    { subject: 'Urgency', A: lead.aiScore > 90 ? 90 : 50, fullMark: 100 },
    { subject: 'History', A: lead.status === 'New' ? 30 : 85, fullMark: 100 },
    { subject: 'Credit', A: 85, fullMark: 100 },
  ];

  const sentiment = lead.aiScore > 75 ? 'Positive' : lead.aiScore > 40 ? 'Neutral' : 'Cautious';
  const sentimentColor = lead.aiScore > 75 ? 'text-green-600 bg-green-50 border-green-100' : lead.aiScore > 40 ? 'text-blue-600 bg-blue-50 border-blue-100' : 'text-orange-600 bg-orange-50 border-orange-100';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white">
          <div className="flex items-center gap-2">
            <Target size={20} className="text-indigo-200" />
            <h3 className="font-bold">AI Analysis: {lead.name}</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6 flex-1">
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col items-center">
                    <h4 className="text-sm font-semibold text-slate-500 mb-2 w-full text-left">Scoring Breakdown</h4>
                    <div className="h-48 w-full">
                         <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={scoreData}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar name="Lead" dataKey="A" stroke="#4f46e5" strokeWidth={2} fill="#4f46e5" fillOpacity={0.3} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="space-y-4">
                     <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-sm font-semibold text-slate-500 mb-1">Conversion Probability</h4>
                                <div className="flex items-end gap-2">
                                    <span className="text-4xl font-bold text-indigo-600">{lead.aiScore}%</span>
                                    <span className="text-sm text-slate-400 mb-1">Confidence</span>
                                </div>
                            </div>
                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                <TrendingUp size={20} />
                            </div>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 mt-3">
                             <div className="bg-indigo-600 h-2 rounded-full transition-all duration-1000" style={{ width: `${lead.aiScore}%` }}></div>
                        </div>
                        
                        {/* New Metrics: Interaction & Time Decay */}
                        <div className="flex justify-between mt-4 pt-3 border-t border-slate-50">
                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                <History size={14} className="text-indigo-500"/>
                                <span>12 Interactions</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                <Clock size={14} className="text-indigo-500"/>
                                <span>Active: 2 days</span>
                            </div>
                        </div>
                     </div>

                     <div className={`rounded-xl p-4 border ${sentimentColor}`}>
                        <h4 className="text-sm font-semibold opacity-80 mb-2">Customer Sentiment</h4>
                        <div className="flex items-center gap-2">
                            <MessageSquare size={18} />
                            <span className="font-bold">{sentiment}</span>
                        </div>
                        <p className="text-xs opacity-75 mt-2 leading-relaxed">
                           Analysis based on interaction history. Customer shows strong interest in {lead.vehicleInterest} but may be price sensitive regarding the {lead.budget} budget range.
                        </p>
                     </div>
                </div>
            </div>

            {/* Vehicle Recommendation Logic */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <BarChart2 size={16} className="text-indigo-600"/> Market Context
                    </h4>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Demand Trend</span>
                            <span className="font-semibold text-green-600">+15% (Rising)</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Resale Value</span>
                            <span className="font-semibold text-slate-900">High</span>
                        </div>
                         <div className="text-xs text-slate-400 mt-2 italic">
                            "SUV segment showing strong Q3 growth in region."
                        </div>
                    </div>
                </div>
                
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-indigo-600"/> Real-time Inventory
                    </h4>
                     <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Availability</span>
                            <span className="font-semibold text-indigo-600">3 Units Available</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Colors</span>
                            <span className="font-semibold text-slate-900">White, Silver, Red</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-2 italic">
                            "Match found for 2023 Model in preferred color."
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            <div>
                 <h4 className="text-md font-bold text-slate-900 mb-3">AI Recommended Next Steps</h4>
                 <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <CheckCircle2 size={18} className="text-blue-600 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-blue-900">Schedule Test Drive</p>
                            <p className="text-xs text-blue-700 mt-0.5">High probability of conversion. Customer prefers weekends.</p>
                        </div>
                    </div>
                    {lead.aiScore < 70 && (
                        <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                            <AlertCircle size={18} className="text-orange-600 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-orange-900">Send Competitor Comparison</p>
                                <p className="text-xs text-orange-700 mt-0.5">Customer is comparing with Hyundai Creta. Send feature vs price breakdown.</p>
                            </div>
                        </div>
                    )}
                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                         <div className="mt-0.5 text-slate-500">
                            <Target size={18} />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-slate-900">Financial Pre-Approval</p>
                            <p className="text-xs text-slate-500 mt-0.5">Budget {lead.budget} fits within standard EMI plans. Initiate soft credit check.</p>
                        </div>
                    </div>
                 </div>
            </div>
        </div>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
             <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                Close
             </button>
             <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors">
                Generate Full Report
             </button>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisModal;
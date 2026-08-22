import React from 'react';
import { X, MessageSquare, Star, ThumbsUp, ThumbsDown, TrendingUp, User } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, CartesianGrid } from 'recharts';

interface FeedbackAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackAnalysisModal: React.FC<FeedbackAnalysisModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const sentimentData = [
      { name: 'Positive', value: 75, color: '#22c55e' },
      { name: 'Neutral', value: 15, color: '#f59e0b' },
      { name: 'Negative', value: 10, color: '#ef4444' }
  ];

  const categoryData = [
      { name: 'Quality', score: 4.8 },
      { name: 'Time', score: 4.2 },
      { name: 'Price', score: 3.9 },
      { name: 'Staff', score: 4.9 },
  ];

  const reviews = [
      { user: 'Rahul M.', rating: 5, text: 'Excellent service! The AI diagnostics found an issue others missed.', sentiment: 'Positive' },
      { user: 'Sneha P.', rating: 4, text: 'Good work but waited 15 mins longer than estimated.', sentiment: 'Neutral' },
      { user: 'Amit K.', rating: 5, text: 'Very professional staff. The car feels brand new.', sentiment: 'Positive' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white">
          <div className="flex items-center gap-2">
            <MessageSquare className="text-indigo-200" size={20} />
            <div>
              <h3 className="font-bold">Customer Feedback Intelligence</h3>
              <p className="text-xs text-indigo-100 opacity-90">Sentiment Analysis & NPS Tracker</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">Net Promoter Score (NPS)</p>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-slate-900">72</span>
                        <span className="text-green-600 text-sm font-bold mb-1 flex items-center gap-1"><TrendingUp size={14}/> +4.2</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Excellent (Industry Avg: 55)</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">Avg Rating</p>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-slate-900">4.7</span>
                        <div className="flex mb-1.5 text-yellow-400">
                            {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Based on 1,240 reviews</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase mb-1">Sentiment Split</p>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1 text-xs font-medium text-green-700"><ThumbsUp size={12}/> 75% Positive</div>
                            <div className="flex items-center gap-1 text-xs font-medium text-red-700"><ThumbsDown size={12}/> 10% Negative</div>
                        </div>
                    </div>
                    <div className="h-20 w-20">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={sentimentData} innerRadius={15} outerRadius={30} paddingAngle={5} dataKey="value" stroke="none">
                                    {sentimentData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-4">Category Performance</h4>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" domain={[0, 5]} hide />
                                <Bar dataKey="score" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={20} />
                                <Tooltip cursor={{fill: 'transparent'}} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="font-bold text-slate-900">Recent AI-Analyzed Feedback</h4>
                    <div className="space-y-3">
                        {reviews.map((review, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
                                            <User size={12} className="text-slate-500" />
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">{review.user}</span>
                                    </div>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                        review.sentiment === 'Positive' ? 'bg-green-100 text-green-700' : 
                                        review.sentiment === 'Neutral' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {review.sentiment}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed">"{review.text}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackAnalysisModal;

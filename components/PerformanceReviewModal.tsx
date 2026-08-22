import React from 'react';
import { X, Award, TrendingUp, BookOpen, BrainCircuit, Star, Zap, UserCheck, AlertTriangle } from 'lucide-react';
import { Employee } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface PerformanceReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

const PerformanceReviewModal: React.FC<PerformanceReviewModalProps> = ({ isOpen, onClose, employee }) => {
  if (!isOpen || !employee) return null;

  const skillData = employee.skills.map(s => ({
    subject: s.name,
    A: s.level,
    B: s.targetLevel,
    fullMark: 100
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-purple-600 text-white">
          <div className="flex items-center gap-2">
            <Award size={20} className="text-purple-200" />
            <div>
                <h3 className="font-bold">Performance & Skill Matrix</h3>
                <p className="text-xs text-purple-100 opacity-90">{employee.name} • {employee.role}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6 flex-1 bg-slate-50/50">
            
            {/* Top KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Efficiency Score</p>
                    <div className="flex items-end gap-2">
                        <span className={`text-2xl font-bold ${employee.efficiencyScore >= 90 ? 'text-green-600' : employee.efficiencyScore >= 75 ? 'text-blue-600' : 'text-orange-600'}`}>
                            {employee.efficiencyScore}%
                        </span>
                        <TrendingUp size={16} className="text-green-500 mb-1" />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Attendance</p>
                    <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-slate-800">{employee.attendance}%</span>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Current Load</p>
                    <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-slate-800">{employee.currentLoad}%</span>
                        <Zap size={16} className="text-yellow-500 mb-1" />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Customer Rating</p>
                    <div className="flex items-center gap-1">
                        <span className="text-2xl font-bold text-slate-800">4.8</span>
                        <Star size={16} className="text-yellow-400 fill-current" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Skill Radar Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <BrainCircuit size={18} className="text-purple-600" /> Skill Gap Analysis
                    </h4>
                    <div className="h-64 w-full">
                         <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar name="Current" dataKey="A" stroke="#8b5cf6" strokeWidth={2} fill="#8b5cf6" fillOpacity={0.4} />
                            <Radar name="Target" dataKey="B" stroke="#94a3b8" strokeWidth={2} fill="transparent" strokeDasharray="4 4" />
                            <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 mt-2">
                        <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 bg-purple-500/40 border border-purple-500 rounded-sm"></span>
                            <span className="text-xs text-slate-600">Current Level</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 border border-slate-400 border-dashed rounded-sm"></span>
                            <span className="text-xs text-slate-600">Role Target</span>
                        </div>
                    </div>
                </div>

                {/* AI Insights & Training */}
                <div className="space-y-4">
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                        <h4 className="font-bold text-indigo-900 text-sm mb-2 flex items-center gap-2">
                            <Zap size={16} /> AI Performance Insight
                        </h4>
                        <p className="text-xs text-indigo-800 leading-relaxed">
                            {employee.name} demonstrates exceptional consistency in standard maintenance tasks. However, diagnostic time for EV systems is 15% higher than the team average. Recommending targeted upskilling in high-voltage systems.
                        </p>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                        <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <BookOpen size={18} className="text-purple-600" /> Recommended Training Path
                        </h4>
                        <div className="space-y-3">
                            {employee.recommendedTraining.map((module) => (
                                <div key={module.id} className="flex justify-between items-start p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-semibold text-slate-800">{module.title}</span>
                                            {module.priority === 'High' && (
                                                <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">HIGH PRIORITY</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 mb-1">{module.reason}</p>
                                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                            <span>{module.duration}</span>
                                            <span>•</span>
                                            <span className={module.status === 'In Progress' ? 'text-blue-500' : 'text-slate-400'}>{module.status}</span>
                                        </div>
                                    </div>
                                    <button className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded hover:bg-purple-700 transition-colors">
                                        Assign
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-3">
             <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                Close
             </button>
             <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition-colors flex items-center gap-2">
                <UserCheck size={16} /> Update Review
             </button>
        </div>
      </div>
    </div>
  );
};

export default PerformanceReviewModal;
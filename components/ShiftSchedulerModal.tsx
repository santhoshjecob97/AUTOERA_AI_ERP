import React, { useState } from 'react';
import { X, Calendar, Sparkles, Check, ChevronLeft, ChevronRight, User, AlertCircle } from 'lucide-react';

interface ShiftSchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShiftSchedulerModal: React.FC<ShiftSchedulerModalProps> = ({ isOpen, onClose }) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [scheduleGenerated, setScheduleGenerated] = useState(false);

  if (!isOpen) return null;

  const handleOptimize = () => {
      setIsOptimizing(true);
      setTimeout(() => {
          setIsOptimizing(false);
          setScheduleGenerated(true);
      }, 2000);
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Mock Data for Visualization
  const demandPrediction = [40, 45, 50, 60, 85, 95, 30]; // % Demand
  const shifts = [
      { name: 'Morning (8-4)', staff: ['Amit', 'Rajesh', 'Priya', 'Sarah'] },
      { name: 'Afternoon (12-8)', staff: ['Vikram', 'John', 'Meera', 'Sneha'] },
      { name: 'Evening (4-10)', staff: ['Arjun', 'Rohan'] },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 h-[80vh] flex flex-col">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Calendar className="text-purple-400" size={20} />
            <h3 className="font-bold">AI Shift Optimization Engine</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
                        <button className="p-1 hover:bg-slate-100 rounded"><ChevronLeft size={16} /></button>
                        <span className="text-sm font-semibold px-2">Oct 23 - Oct 29, 2024</span>
                        <button className="p-1 hover:bg-slate-100 rounded"><ChevronRight size={16} /></button>
                    </div>
                    {!scheduleGenerated && (
                        <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded flex items-center gap-1">
                            <AlertCircle size={12}/> Schedule Conflict Detected
                        </span>
                    )}
                </div>
                <button 
                    onClick={handleOptimize}
                    disabled={isOptimizing}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                >
                    {isOptimizing ? (
                        <>
                           <Sparkles size={16} className="animate-spin" /> Optimizing...
                        </>
                    ) : (
                        <>
                           <Sparkles size={16} /> {scheduleGenerated ? 'Re-Optimize' : 'Auto-Generate Schedule'}
                        </>
                    )}
                </button>
            </div>

            <div className="flex-1 overflow-auto p-6">
                {!scheduleGenerated && !isOptimizing ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-70">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                            <Calendar size={32} className="text-slate-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-700">No Schedule Generated</h3>
                            <p className="text-sm text-slate-500 max-w-sm mx-auto">
                                The AI engine analyzes historical service volume, employee skills, and availability to create the optimal roster.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        {/* Demand Prediction Chart */}
                        <div>
                            <h4 className="text-sm font-bold text-slate-700 mb-3">Predicted Workload Demand</h4>
                            <div className="flex gap-2 h-24 items-end">
                                {demandPrediction.map((val, i) => (
                                    <div key={i} className="flex-1 flex flex-col justify-end group">
                                        <div 
                                            className={`w-full rounded-t-md transition-all duration-1000 ${val > 80 ? 'bg-red-400' : val > 50 ? 'bg-purple-400' : 'bg-blue-400'}`} 
                                            style={{ height: `${val}%` }}
                                        ></div>
                                        <div className="text-center text-xs font-semibold text-slate-500 mt-2">{days[i]}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Schedule Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                            {days.map((day, i) => (
                                <div key={day} className={`border rounded-xl overflow-hidden ${demandPrediction[i] > 80 ? 'border-red-200 bg-red-50/30' : 'border-slate-200 bg-white'}`}>
                                    <div className={`p-2 text-center text-sm font-bold border-b ${demandPrediction[i] > 80 ? 'bg-red-50 text-red-700 border-red-100' : 'bg-slate-50 text-slate-700 border-slate-100'}`}>
                                        {day}
                                    </div>
                                    <div className="p-2 space-y-2">
                                        {shifts.map((shift, idx) => (
                                            <div key={idx} className="bg-white border border-slate-100 rounded p-2 shadow-sm">
                                                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">{shift.name}</div>
                                                <div className="flex flex-wrap gap-1">
                                                    {shift.staff.slice(0, demandPrediction[i] > 80 ? 4 : 2).map((staff, sIdx) => (
                                                        <div key={sIdx} className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] font-bold border border-purple-200" title={staff}>
                                                            {staff.charAt(0)}
                                                        </div>
                                                    ))}
                                                    {demandPrediction[i] > 80 && (
                                                        <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] border border-red-200">
                                                            +1
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {scheduleGenerated && (
            <div className="p-4 border-t border-slate-100 bg-white flex justify-between items-center">
                <div className="text-xs text-slate-500">
                    <span className="font-bold text-green-600">AI Optimization:</span> Staffing aligned with 98% of predicted demand spikes.
                </div>
                <button 
                    onClick={onClose}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                    <Check size={16} /> Publish Roster
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default ShiftSchedulerModal;
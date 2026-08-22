import React from 'react';
import { X, Zap, Activity, Battery, AlertTriangle, TrendingDown, Clock, Thermometer } from 'lucide-react';
import { FleetVehicle } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface BatteryHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: FleetVehicle | null;
}

const BatteryHealthModal: React.FC<BatteryHealthModalProps> = ({ isOpen, onClose, vehicle }) => {
  if (!isOpen || !vehicle) return null;

  // Mock degradation data
  const degradationData = [
    { month: 'Jan', soh: 99 },
    { month: 'Feb', soh: 98.5 },
    { month: 'Mar', soh: 98.2 },
    { month: 'Apr', soh: 97.8 },
    { month: 'May', soh: 97.5 },
    { month: 'Jun', soh: 97.2 },
  ];

  const voltageData = [
    { cell: 1, v: 3.8 }, { cell: 2, v: 3.82 }, { cell: 3, v: 3.79 }, { cell: 4, v: 3.81 },
    { cell: 5, v: 3.65 }, { cell: 6, v: 3.8 }, { cell: 7, v: 3.81 }, { cell: 8, v: 3.79 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-emerald-900 text-white">
          <div className="flex items-center gap-2">
            <Zap className="text-emerald-400" size={24} />
            <div>
              <h3 className="font-bold text-lg">EV Battery Health Engine</h3>
              <p className="text-xs text-emerald-200 opacity-90">{vehicle.model} • {vehicle.plateNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors text-emerald-200 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-6">
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">State of Health (SOH)</p>
                    <div className="flex items-end gap-2">
                        <span className={`text-3xl font-bold ${vehicle.healthScore > 90 ? 'text-green-600' : 'text-orange-600'}`}>
                            {vehicle.healthScore}%
                        </span>
                        <Activity size={20} className="text-slate-400 mb-1" />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Est. Range</p>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-slate-900">{vehicle.range}</span>
                        <span className="text-sm text-slate-500 mb-1">km</span>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Cycles</p>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-slate-900">412</span>
                        <span className="text-xs text-slate-500 mb-1">Charge Cycles</span>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Temperature</p>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-green-600">32°C</span>
                        <Thermometer size={20} className="text-slate-400 mb-1" />
                    </div>
                </div>
            </div>

            {/* AI Analysis Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Degradation Chart */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <TrendingDown size={18} className="text-emerald-600" /> Degradation Analysis
                    </h4>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={degradationData}>
                                <defs>
                                    <linearGradient id="colorSoh" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                                <YAxis domain={[90, 100]} axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                                <Tooltip />
                                <Area type="monotone" dataKey="soh" stroke="#10b981" fillOpacity={1} fill="url(#colorSoh)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 italic">Projected life: 6.2 years remaining at current usage.</p>
                </div>

                {/* Cell Voltage Balancing */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                            <Battery size={18} className="text-emerald-600" /> Cell Voltage Monitor
                        </h4>
                        <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-bold">1 IMBALANCE DETECTED</span>
                    </div>
                    <div className="h-48 grid grid-cols-4 gap-2 content-center">
                         {voltageData.map((d, i) => (
                             <div key={i} className={`flex flex-col items-center justify-center p-2 rounded border ${d.v < 3.7 ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-100'}`}>
                                 <div className={`h-8 w-3 rounded-sm mb-1 ${d.v < 3.7 ? 'bg-red-400' : 'bg-emerald-400'}`}></div>
                                 <span className="text-xs font-bold text-slate-700">{d.v}V</span>
                                 <span className="text-[10px] text-slate-400">C{d.cell}</span>
                             </div>
                         ))}
                    </div>
                    <p className="text-xs text-red-500 mt-2 font-medium flex items-center gap-1">
                        <AlertTriangle size={12} /> Cell 5 shows voltage droop. Recommend cell balancing charge.
                    </p>
                </div>
            </div>

            {/* Recommendations */}
            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                <h4 className="font-bold text-indigo-900 text-sm mb-2 flex items-center gap-2">
                    <Zap size={16} /> AI Maintenance Recommendations
                </h4>
                <div className="space-y-2">
                    <div className="flex items-start gap-2 text-xs text-indigo-800">
                        <Clock size={14} className="mt-0.5 shrink-0" />
                        <span>Schedule deep-cycle charging to recalibrate BMS (Battery Management System).</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-indigo-800">
                        <Thermometer size={14} className="mt-0.5 shrink-0" />
                        <span>Avoid fast charging {'>'} 80% to reduce thermal stress based on recent heat patterns.</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-3">
             <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                Close
             </button>
             <button className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors flex items-center gap-2">
                <Zap size={16} /> Schedule Maintenance
             </button>
        </div>
      </div>
    </div>
  );
};

export default BatteryHealthModal;
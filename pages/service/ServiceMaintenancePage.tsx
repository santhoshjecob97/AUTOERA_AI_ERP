import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Activity, TrendingUp, Search, Calendar, Zap } from 'lucide-react';
import StatCard from '../../components/StatCard';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

interface VehicleHealth {
    id: string;
    vehicle: string;
    owner: string;
    healthScore: number;
    predictedFailure: string; // e.g., "Transmission Slippage"
    timeToFailure: string; // e.g., "1,200 km / 2 weeks"
    urgency: 'critical' | 'warning' | 'stable';
    lastService: string;
    aiConfidence: number;
}

const mockVehicles: VehicleHealth[] = [
    { id: '1', vehicle: 'Honda City (MH01 AB 1234)', owner: 'Rohan Gupta', healthScore: 45, predictedFailure: 'Transmission Slippage', timeToFailure: '400 km', urgency: 'critical', lastService: '2024-10-10', aiConfidence: 94 },
    { id: '2', vehicle: 'Hyundai Creta (KA02 CD 5678)', owner: 'Anjali P.', healthScore: 78, predictedFailure: 'Brake Pad Wear', timeToFailure: '2,500 km', urgency: 'warning', lastService: '2024-11-05', aiConfidence: 89 },
    { id: '3', vehicle: 'Tata Nexon (DL03 EF 9012)', owner: 'Vikram Singh', healthScore: 92, predictedFailure: 'None', timeToFailure: '-', urgency: 'stable', lastService: '2024-12-01', aiConfidence: 98 },
    { id: '4', vehicle: 'Mahindra XUV700 (TS04 GH 3456)', owner: 'Rahul V.', healthScore: 65, predictedFailure: 'Battery Degradation', timeToFailure: '3 weeks', urgency: 'warning', lastService: '2024-09-20', aiConfidence: 91 },
    { id: '5', vehicle: 'Toyota Fortuner (TN05 IJ 7890)', owner: 'Suresh M.', healthScore: 30, predictedFailure: 'Coolant Leak', timeToFailure: 'Immediate', urgency: 'critical', lastService: '2024-08-15', aiConfidence: 96 },
];

const smallChartData = [
    { val: 40 }, { val: 30 }, { val: 45 }, { val: 80 }, { val: 55 }, { val: 90 }, { val: 65 }
];

const ServiceMaintenancePage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Vehicles Monitored" value="1,245" trend="+12 this week" trendUp={true} icon={<Activity size={20} />} color="blue" />
                <StatCard title="Critical Alerts" value="28" trend="Requires Action" icon={<AlertTriangle size={20} />} color="red" />
                <StatCard title="Prevented Failures" value="156" trend="Est. ₹4.2M Saved" trendUp={true} icon={<CheckCircle size={20} />} color="green" />
                <StatCard title="AI Accuracy" value="94.8%" trend="Last 30 days" icon={<Zap size={20} />} color="purple" />
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <TrendingUp size={18} className="text-orange-600" /> Predictive Health Monitor
                        </h3>
                        <p className="text-sm text-slate-500">AI-driven insights for proactive maintenance.</p>
                    </div>

                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search vehicle or owner..."
                            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-64 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="px-6 py-4 font-medium">Vehicle Details</th>
                                <th className="px-6 py-4 font-medium">Health Score</th>
                                <th className="px-6 py-4 font-medium">Predicted Failure</th>
                                <th className="px-6 py-4 font-medium">Est. Time to Failure</th>
                                <th className="px-6 py-4 font-medium">Urgency</th>
                                <th className="px-6 py-4 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {mockVehicles.filter(v =>
                                v.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                v.owner.toLowerCase().includes(searchTerm.toLowerCase())
                            ).map(vehicle => (
                                <tr key={vehicle.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{vehicle.vehicle}</div>
                                        <div className="text-xs text-slate-500">{vehicle.owner} • Last Service: {vehicle.lastService}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-10 h-10 flex items-center justify-center">
                                                <svg className="w-full h-full" viewBox="0 0 36 36">
                                                    <path
                                                        className="text-slate-200"
                                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="3"
                                                    />
                                                    <path
                                                        className={`${vehicle.healthScore > 80 ? 'text-green-500' :
                                                                vehicle.healthScore > 50 ? 'text-orange-500' : 'text-red-500'
                                                            }`}
                                                        strokeDasharray={`${vehicle.healthScore}, 100`}
                                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="3"
                                                    />
                                                </svg>
                                                <span className="absolute text-[10px] font-bold text-slate-700">{vehicle.healthScore}</span>
                                            </div>

                                            {/* Mini chart for trend simulation */}
                                            <div className="w-16 h-8 opacity-50">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={smallChartData}>
                                                        <Area type="monotone" dataKey="val" stroke="#64748b" strokeWidth={1} fill="none" />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-800">{vehicle.predictedFailure}</div>
                                        {vehicle.predictedFailure !== 'None' && (
                                            <div className="text-xs text-blue-600 flex items-center gap-1">
                                                <Zap size={10} /> AI Confidence: {vehicle.aiConfidence}%
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-slate-600">
                                        {vehicle.timeToFailure}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${vehicle.urgency === 'critical' ? 'bg-red-100 text-red-700' :
                                                vehicle.urgency === 'warning' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-green-100 text-green-700'
                                            }`}>
                                            {vehicle.urgency === 'critical' && <AlertTriangle size={12} />}
                                            {vehicle.urgency}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium hover:underline flex items-center gap-1">
                                            <Calendar size={14} /> Schedule
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination / Footer */}
                <div className="p-4 border-t border-slate-100 flex justify-center">
                    <button className="text-sm text-slate-500 hover:text-slate-800 transition-colors">View All Vehicles</button>
                </div>
            </div>
        </div>
    );
};

export default ServiceMaintenancePage;

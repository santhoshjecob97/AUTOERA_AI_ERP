import React from 'react';
import { X, Wrench, AlertTriangle, CheckCircle, Clock, Database, Thermometer, Activity } from 'lucide-react';
import { ServiceJob } from '../types';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip } from 'recharts';

interface ServiceAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: ServiceJob | null;
}

const ServiceAnalysisModal: React.FC<ServiceAnalysisModalProps> = ({ isOpen, onClose, job }) => {
  if (!isOpen || !job) return null;

  const data = [
    { name: 'Engine Health', uv: 90, fill: '#22c55e' },
    { name: 'Brakes', uv: 45, fill: '#f97316' },
    { name: 'Transmission', uv: 80, fill: '#3b82f6' },
    { name: 'Battery', uv: 70, fill: '#eab308' },
    { name: 'Electronics', uv: 85, fill: '#8b5cf6' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-orange-600 text-white">
          <div className="flex items-center gap-2">
            <Wrench size={20} className="text-orange-200" />
            <div>
                <h3 className="font-bold">Service Intelligence: {job.vehicle}</h3>
                <p className="text-xs text-orange-100 opacity-90">Job ID: {job.id} • {job.customer}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6 flex-1 bg-slate-50/50">
            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="text-orange-600" size={18} />
                        <h4 className="font-semibold text-slate-700 text-sm">Diagnosis Confidence</h4>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-slate-900">{job.aiInsights?.diagnosisConfidence || 88}%</span>
                        <span className="text-xs text-green-600 font-medium mb-1">High Accuracy</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Based on 14 similar cases for this model.</p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-2">
                        <Database className="text-blue-600" size={18} />
                        <h4 className="font-semibold text-slate-700 text-sm">Parts Status</h4>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className={`text-xl font-bold ${
                            job.aiInsights?.partsAvailability === 'Out of Stock' ? 'text-red-600' : 
                            job.aiInsights?.partsAvailability === 'Low Stock' ? 'text-orange-600' : 'text-green-600'
                        }`}>
                            {job.aiInsights?.partsAvailability || 'In Stock'}
                        </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                        {job.aiInsights?.partsRequired?.map((part, i) => (
                            <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">{part}</span>
                        )) || <span className="text-xs text-slate-400">No parts listed</span>}
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="text-purple-600" size={18} />
                        <h4 className="font-semibold text-slate-700 text-sm">Est. Completion</h4>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-slate-900">{job.predictedCompletion}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Technician {job.technician || 'Assigned'} is on schedule.</p>
                </div>
            </div>

            {/* Main Analysis Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Thermometer size={16} className="text-red-500"/> Predictive Health Scan
                    </h4>
                    <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" barSize={15} data={data}>
                                <RadialBar
                                    label={{ position: 'insideStart', fill: '#fff' }}
                                    background
                                    dataKey="uv"
                                />
                                <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{right: 0}} />
                                <Tooltip />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-center text-xs text-slate-400 mt-2">Values indicate component health percentage.</p>
                </div>

                <div className="space-y-4">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
                         <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <Wrench size={16} className="text-slate-600"/> Recommended Actions
                         </h4>
                         <div className="space-y-3">
                            <div className="flex gap-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                                <div className="mt-0.5"><AlertTriangle size={16} className="text-red-600"/></div>
                                <div>
                                    <p className="text-sm font-bold text-red-900">Replace Brake Pads</p>
                                    <p className="text-xs text-red-700">Wear level at 85%. Safety critical. Part #BP-2024-X in stock.</p>
                                </div>
                            </div>
                            <div className="flex gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                <div className="mt-0.5"><CheckCircle size={16} className="text-blue-600"/></div>
                                <div>
                                    <p className="text-sm font-bold text-blue-900">AC Gas Top-up</p>
                                    <p className="text-xs text-blue-700">Cooling efficiency at 60%. Standard procedure.</p>
                                </div>
                            </div>
                         </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
                         <h4 className="font-bold text-slate-900 mb-3 text-sm">Cost Estimation</h4>
                         <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Parts</span>
                                <span className="font-medium">₹{job.aiInsights?.estimatedCost ? parseInt(job.aiInsights.estimatedCost) * 0.7 : '4,500'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Labor</span>
                                <span className="font-medium">₹{job.aiInsights?.estimatedCost ? parseInt(job.aiInsights.estimatedCost) * 0.3 : '1,200'}</span>
                            </div>
                            <div className="flex justify-between text-sm pt-2 border-t border-slate-100 font-bold text-slate-900">
                                <span>Total Estimate</span>
                                <span>₹{job.aiInsights?.estimatedCost || '5,700'}</span>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-3">
             <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                Close
             </button>
             <button className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm transition-colors flex items-center gap-2">
                <CheckCircle size={16} /> Approve Job & Order Parts
             </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceAnalysisModal;
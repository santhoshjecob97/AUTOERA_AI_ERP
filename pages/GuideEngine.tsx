import React, { useState } from 'react';
import { 
    Layout, Globe, Server, CheckCircle, Rocket, 
    TrendingUp, Users, AlertCircle, RefreshCw, 
    Code, CreditCard, Box, Zap, Activity
} from 'lucide-react';
import StatCard from '../components/StatCard';
import TenantConfigModal from '../components/TenantConfigModal';
import DeploymentValidatorModal from '../components/DeploymentValidatorModal';
import OnboardingModal from '../components/OnboardingModal';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ImplementationStep, IntegrationStatus, OnboardingStage } from '../types';

const GuideEngine: React.FC = () => {
    const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);
    const [isValidatorModalOpen, setIsValidatorModalOpen] = useState(false);
    const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
    
    // Mock Data
    const engineProgress: ImplementationStep[] = [
        { id: '1', engine: 'Sales', progress: 100, status: 'Active', lastUpdated: '2h ago' },
        { id: '2', engine: 'Service', progress: 100, status: 'Active', lastUpdated: '1h ago' },
        { id: '3', engine: 'Finance', progress: 85, status: 'Deploying', lastUpdated: '5m ago' },
        { id: '4', engine: 'Insurance', progress: 40, status: 'Deploying', lastUpdated: '30m ago' },
        { id: '5', engine: 'Workforce', progress: 0, status: 'Not Started', lastUpdated: '-' },
        { id: '6', engine: 'Fleet', progress: 10, status: 'Not Started', lastUpdated: '-' },
    ];

    const integrations: IntegrationStatus[] = [
        { service: 'Stripe', status: 'Healthy', latency: '45ms', uptime: '99.99%' },
        { service: 'Twilio', status: 'Healthy', latency: '120ms', uptime: '99.95%' },
        { service: 'AWS', status: 'Healthy', latency: '22ms', uptime: '100%' },
        { service: 'Google Maps', status: 'Degraded', latency: '450ms', uptime: '98.50%' },
    ];

    const revenueData = [
        { name: 'Mon', value: 12000 },
        { name: 'Tue', value: 19000 },
        { name: 'Wed', value: 15000 },
        { name: 'Thu', value: 28000 },
        { name: 'Fri', value: 32000 },
        { name: 'Sat', value: 25000 },
        { name: 'Sun', value: 45000 },
    ];

    const onboardingStages: OnboardingStage[] = [
        { id: '1', customerName: 'Apex Auto Group', stage: 'Technical Setup', progress: 45, nextTask: 'DNS Configuration', dueDate: 'Tomorrow' },
        { id: '2', customerName: 'City Motors', stage: 'Training', progress: 75, nextTask: 'Staff Workshop', dueDate: 'Today' },
        { id: '3', customerName: 'Royal Fleet', stage: 'Discovery', progress: 10, nextTask: 'Requirements Gathering', dueDate: 'Next Week' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Layout className="text-slate-700" /> Super Admin & Implementation Guide
                    </h1>
                    <p className="text-slate-500">Master Control Panel for White-Label SaaS Deployment & Orchestration.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button 
                        onClick={() => setIsTenantModalOpen(true)}
                        className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                        <Globe size={16} /> Tenant Config
                    </button>
                    <button 
                        onClick={() => setIsValidatorModalOpen(true)}
                        className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                        <CheckCircle size={16} /> Validate System
                    </button>
                    <button 
                        onClick={() => setIsOnboardingModalOpen(true)}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-slate-200"
                    >
                        <Rocket size={16} /> Onboard Customer
                    </button>
                </div>
            </div>

            {/* REVENUE_DASHBOARD */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Monthly Recurring (MRR)" value="₹42.5L" trend="+12%" trendUp={true} icon={<CreditCard size={24}/>} color="blue" />
                <StatCard title="Annual Recurring (ARR)" value="₹5.1 Cr" trend="Projc." icon={<TrendingUp size={24}/>} color="indigo" />
                <StatCard title="Churn Rate" value="2.1%" trend="-0.5%" trendUp={true} icon={<Users size={24}/>} color="green" />
                <StatCard title="LTV / CAC" value="15:1" trend="Excellent" icon={<Activity size={24}/>} color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* IMPLEMENTATION_TRACKER */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <Box size={18} className="text-indigo-600"/> AI Engine Deployment Tracker
                        </h3>
                        <span className="text-xs font-semibold text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                            Auto-Sync Active
                        </span>
                    </div>
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {engineProgress.map((item) => (
                            <div key={item.id} className="bg-white border border-slate-100 rounded-lg p-4 shadow-sm relative overflow-hidden group">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-slate-700">{item.engine} Engine</span>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                                        item.status === 'Active' ? 'bg-green-100 text-green-700' :
                                        item.status === 'Deploying' ? 'bg-blue-100 text-blue-700' :
                                        'bg-slate-100 text-slate-500'
                                    }`}>
                                        {item.status}
                                    </span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                                    <div 
                                        className={`h-2 rounded-full transition-all duration-1000 ${
                                            item.status === 'Active' ? 'bg-green-500' : 
                                            item.status === 'Deploying' ? 'bg-blue-500' : 'bg-slate-300'
                                        }`} 
                                        style={{ width: `${item.progress}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>v2.5.0</span>
                                    <span>Updated: {item.lastUpdated}</span>
                                </div>
                                {item.status === 'Deploying' && (
                                    <div className="absolute top-0 right-0 p-1">
                                        <RefreshCw size={12} className="text-blue-500 animate-spin" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* INTEGRATION_MONITOR */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <Code size={18} className="text-indigo-600"/> Integration Health
                        </h3>
                    </div>
                    <div className="flex-1 p-6 space-y-4">
                        {integrations.map((int, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${
                                        int.status === 'Healthy' ? 'bg-green-500' : 
                                        int.status === 'Degraded' ? 'bg-orange-500' : 'bg-red-500'
                                    }`}></div>
                                    <span className="text-sm font-semibold text-slate-700">{int.service}</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-bold text-slate-900">{int.uptime}</div>
                                    <div className="text-[10px] text-slate-400">{int.latency}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
                        <button className="text-xs text-indigo-600 font-bold hover:text-indigo-800 flex items-center justify-center gap-1">
                            <Activity size={12} /> View System Logs
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Revenue Chart & Team */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-900">Revenue Growth (Real-time)</h3>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div> Gross
                            </span>
                        </div>
                    </div>
                    <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                </linearGradient>
                                </defs>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                                <Tooltip />
                                <Area type="monotone" dataKey="value" stroke="#4f46e5" fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                 </div>

                 {/* TEAM_COLLABORATION (Mini) */}
                 <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-900">Team Assignments</h3>
                        <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded font-bold">4 Online</span>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: 'Sarah Connor', role: 'Integration Lead', task: 'Stripe API Config', status: 'In Progress' },
                            { name: 'John Smith', role: 'Support Agent', task: 'Client Onboarding', status: 'Active' },
                            { name: 'Mike Ross', role: 'DevOps', task: 'Redis Scaling', status: 'Pending' },
                        ].map((member, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                    {member.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-800">{member.name}</p>
                                    <p className="text-xs text-slate-500">{member.role}</p>
                                </div>
                                <span className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-600 border border-slate-200">
                                    {member.status}
                                </span>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 font-medium hover:bg-slate-50">
                        Manage Team Roles
                    </button>
                 </div>
            </div>

            <TenantConfigModal isOpen={isTenantModalOpen} onClose={() => setIsTenantModalOpen(false)} />
            <DeploymentValidatorModal isOpen={isValidatorModalOpen} onClose={() => setIsValidatorModalOpen(false)} />
            <OnboardingModal isOpen={isOnboardingModalOpen} onClose={() => setIsOnboardingModalOpen(false)} stages={onboardingStages} />
        </div>
    );
};

export default GuideEngine;
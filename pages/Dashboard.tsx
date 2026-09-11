import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import { 
  DollarSign, Car, Wrench, Users, ArrowUpRight, Target, ShieldCheck, Zap, TrendingUp, 
  Activity, Server, Smartphone, HeadphonesIcon, Settings, FileText, ArrowRight, 
  BrainCircuit, Sparkles, CheckCircle, AlertCircle, Clock, BarChart3
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { ChartData, ViewState, User } from '../types';
import ExecutiveActionCommandCenter from '../components/dashboard/ExecutiveActionCommandCenter';

interface DashboardProps {
    onNavigate: (view: ViewState) => void;
    user?: User;
}

const revenueData: ChartData[] = [
  { name: 'Mon', value: 40000, value2: 24000 },
  { name: 'Tue', value: 30000, value2: 13980 },
  { name: 'Wed', value: 20000, value2: 58000 },
  { name: 'Thu', value: 27800, value2: 39080 },
  { name: 'Fri', value: 18900, value2: 48000 },
  { name: 'Sat', value: 23900, value2: 38000 },
  { name: 'Sun', value: 34900, value2: 43000 },
];

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, user }) => {
  const [activeBranch, setActiveBranch] = React.useState('Indiranagar Main (BLR)');
  const [isBriefDismissed, setIsBriefDismissed] = React.useState(false);

  // Platform-wide KPIs
  const platformKPIs = {
    totalRevenue: '₹42.5M',
    revenueGrowth: '+12.5%',
    customerHealth: '94%',
    churnRate: '2.1%',
    systemUptime: '99.9%',
    aiLatency: '45ms',
    totalModels: 64,
    activeEngines: 6
  };

  const engineStatusData = [
    { name: 'Active', value: 6, color: '#10b981' },
    { name: 'Optimal', value: 58, color: '#3b82f6' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={13} className="text-orange-500" />
              {user?.organizationName || 'Apex Mobility Group'}
            </span>

            {/* Multi-Branch Selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
              {['Indiranagar Main (BLR)', 'Anna Nagar (Chennai)', 'OMR Tech Hub', 'Porur Workshop'].map(br => (
                <button
                  key={br}
                  onClick={() => setActiveBranch(br)}
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    activeBranch === br ? 'bg-white dark:bg-slate-800 shadow-xs text-orange-600 dark:text-orange-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  {br}
                </button>
              ))}
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3 font-['Outfit'] tracking-tight">
            <BrainCircuit className="text-orange-500" size={30} />
            AutoEra AI ERP Operations Center
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Welcome back, {user?.name || 'Dealership Executive'} &bull; Real-time Multi-Branch AI Operations, Workshop &amp; Lead Telemetry
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Assigned Role</p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 text-orange-800 dark:text-orange-300 text-xs font-bold shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              {user?.role || 'General Manager'}
            </span>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">AutoEra AI-OS</p>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
              <Sparkles size={13} className="text-orange-500" />
              10 Agents Active
            </span>
          </div>
        </div>
      </div>

      {/* AI Morning Brief & Pending ActionProposal Alert Strip (Section 02/11) */}
      {!isBriefDismissed && (
        <div className="bg-gradient-to-r from-slate-900 via-[#0D1117] to-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0 mt-0.5">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider font-mono">
                  8:00 AM Dealer Principal Brief &bull; Executive Analytics Agent
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  DHI 94/100
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                <strong>{activeBranch}:</strong> Yesterday revenue reached 104% of daily target. 3 urgent actions pending GM approval: Senthil Nathan 2.8% discount exception, 40x Tata Nexon brake pads replenishment order, and 12 insurance renewals expiring in &lt; 30 days.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('service-ai')}
              className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Review AI Proposals (3)</span>
              <ArrowRight size={13} />
            </button>
            <button
              onClick={() => setIsBriefDismissed(true)}
              className="p-1.5 text-slate-400 hover:text-slate-200 text-xs transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Dealership Command Center: 5 Executive Questions & Signature Action AI */}
      <ExecutiveActionCommandCenter />

      {/* Platform-Wide KPI Overview */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 size={20} className="text-indigo-600" />
            Platform Performance Overview
          </h2>
          <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold flex items-center gap-1">
            <CheckCircle size={12} />
            All Systems Operational
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={16} className="text-emerald-600" />
              <p className="text-xs text-slate-500 font-medium">Total ARR</p>
            </div>
            <p className="text-xl font-bold text-slate-900">{platformKPIs.totalRevenue}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">{platformKPIs.revenueGrowth}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={16} className="text-blue-600" />
              <p className="text-xs text-slate-500 font-medium">Health Score</p>
            </div>
            <p className="text-xl font-bold text-slate-900">{platformKPIs.customerHealth}</p>
            <p className="text-xs text-slate-500 font-semibold mt-1">Excellent</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-orange-600" />
              <p className="text-xs text-slate-500 font-medium">Churn Rate</p>
            </div>
            <p className="text-xl font-bold text-slate-900">{platformKPIs.churnRate}</p>
            <p className="text-xs text-green-600 font-semibold mt-1">Low</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <Server size={16} className="text-purple-600" />
              <p className="text-xs text-slate-500 font-medium">Uptime</p>
            </div>
            <p className="text-xl font-bold text-slate-900">{platformKPIs.systemUptime}</p>
            <p className="text-xs text-green-600 font-semibold mt-1">Stable</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-yellow-600" />
              <p className="text-xs text-slate-500 font-medium">AI Latency</p>
            </div>
            <p className="text-xl font-bold text-slate-900">{platformKPIs.aiLatency}</p>
            <p className="text-xs text-green-600 font-semibold mt-1">Fast</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <BrainCircuit size={16} className="text-indigo-600" />
              <p className="text-xs text-slate-500 font-medium">AI Models</p>
            </div>
            <p className="text-xl font-bold text-slate-900">{platformKPIs.totalModels}</p>
            <p className="text-xs text-indigo-600 font-semibold mt-1">Deployed</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-pink-600" />
              <p className="text-xs text-slate-500 font-medium">Engines</p>
            </div>
            <p className="text-xl font-bold text-slate-900">{platformKPIs.activeEngines}</p>
            <p className="text-xs text-green-600 font-semibold mt-1">Active</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={16} className="text-slate-600" />
              <p className="text-xs text-slate-500 font-medium">Response</p>
            </div>
            <p className="text-xl font-bold text-slate-900">1.2s</p>
            <p className="text-xs text-green-600 font-semibold mt-1">Optimal</p>
          </div>
        </div>
      </div>

      {/* 6 Core AI Engines - Main Navigation */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles size={22} className="text-indigo-600" />
            Core AI Engines
          </h2>
          <span className="text-sm text-slate-500">Click any engine to access detailed dashboard</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sales AI Engine */}
          {user?.permissions.includes('sales') && (
            <div 
              onClick={() => onNavigate('sales')}
              className="group bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl border-2 border-blue-200 hover:border-blue-400 p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <Target size={28} className="text-white" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full font-bold mb-1">8 Models</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Active</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Sales AI Engine</h3>
              <p className="text-sm text-slate-600 mb-4">Lead qualification, scoring & conversion predictions</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-600">1,284</p>
                  <p className="text-xs text-slate-500">Active Leads</p>
                </div>
                <ArrowRight className="text-blue-600 group-hover:translate-x-1 transition-transform" size={20} />
              </div>
            </div>
          )}

          {/* Service AI Engine */}
          {user?.permissions.includes('service') && (
            <div 
              onClick={() => onNavigate('service')}
              className="group bg-gradient-to-br from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 rounded-xl border-2 border-orange-200 hover:border-orange-400 p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-orange-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <Wrench size={28} className="text-white" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded-full font-bold mb-1">9 Models</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Active</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Service AI Engine</h3>
              <p className="text-sm text-slate-600 mb-4">Predictive maintenance, scheduling & quality control</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-orange-600">342</p>
                  <p className="text-xs text-slate-500">Service Jobs</p>
                </div>
                <ArrowRight className="text-orange-600 group-hover:translate-x-1 transition-transform" size={20} />
              </div>
            </div>
          )}

          {/* Finance AI Engine */}
          {user?.permissions.includes('finance') && (
            <div 
              onClick={() => onNavigate('finance')}
              className="group bg-gradient-to-br from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 rounded-xl border-2 border-emerald-200 hover:border-emerald-400 p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-emerald-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <DollarSign size={28} className="text-white" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs bg-emerald-600 text-white px-2 py-1 rounded-full font-bold mb-1">9 Models</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Active</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Finance AI Engine</h3>
              <p className="text-sm text-slate-600 mb-4">Credit scoring, loan approvals & fraud detection</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-emerald-600">₹42.5M</p>
                  <p className="text-xs text-slate-500">Total Revenue</p>
                </div>
                <ArrowRight className="text-emerald-600 group-hover:translate-x-1 transition-transform" size={20} />
              </div>
            </div>
          )}

          {/* Insurance AI Engine */}
          {user?.permissions.includes('insurance') && (
            <div 
              onClick={() => onNavigate('insurance')}
              className="group bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 rounded-xl border-2 border-indigo-200 hover:border-indigo-400 p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-indigo-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <ShieldCheck size={28} className="text-white" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-full font-bold mb-1">7 Models</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Active</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Insurance AI Engine</h3>
              <p className="text-sm text-slate-600 mb-4">Policy management, claims processing & risk assessment</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-indigo-600">2,847</p>
                  <p className="text-xs text-slate-500">Active Policies</p>
                </div>
                <ArrowRight className="text-indigo-600 group-hover:translate-x-1 transition-transform" size={20} />
              </div>
            </div>
          )}

          {/* Workforce AI Engine */}
          {user?.permissions.includes('workforce') && (
            <div 
              onClick={() => onNavigate('workforce')}
              className="group bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-xl border-2 border-purple-200 hover:border-purple-400 p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <Users size={28} className="text-white" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full font-bold mb-1">7 Models</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Active</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Workforce AI Engine</h3>
              <p className="text-sm text-slate-600 mb-4">Performance tracking, skill matching & scheduling</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-purple-600">94%</p>
                  <p className="text-xs text-slate-500">Efficiency Score</p>
                </div>
                <ArrowRight className="text-purple-600 group-hover:translate-x-1 transition-transform" size={20} />
              </div>
            </div>
          )}

          {/* Fleet & EV AI Engine */}
          {user?.permissions.includes('fleet') && (
            <div 
              onClick={() => onNavigate('fleet')}
              className="group bg-gradient-to-br from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100 rounded-xl border-2 border-teal-200 hover:border-teal-400 p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-teal-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <Zap size={28} className="text-white" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs bg-teal-600 text-white px-2 py-1 rounded-full font-bold mb-1">7 Models</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Active</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Fleet & EV AI Engine</h3>
              <p className="text-sm text-slate-600 mb-4">Battery health, route optimization & tracking</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-teal-600">156</p>
                  <p className="text-xs text-slate-500">Active Vehicles</p>
                </div>
                <ArrowRight className="text-teal-600 group-hover:translate-x-1 transition-transform" size={20} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Access Tools */}
      <div className="bg-white dark:bg-[#0c121e] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Zap size={20} className="text-amber-500" />
          Quick Access Tools
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => onNavigate('developer')}
            className="flex flex-col items-center gap-3 p-4 rounded-lg border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all group cursor-pointer"
          >
            <div className="p-3 bg-indigo-100 dark:bg-indigo-950/60 rounded-lg group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/60 transition-colors">
              <Server size={24} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">API Integration</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Developer Portal</p>
            </div>
          </button>
          <button 
            onClick={() => onNavigate('mobile-app')}
            className="flex flex-col items-center gap-3 p-4 rounded-lg border-2 border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all group cursor-pointer"
          >
            <div className="p-3 bg-blue-100 dark:bg-blue-950/60 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/60 transition-colors">
              <Smartphone size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Mobile App</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Dealership Apps</p>
            </div>
          </button>
          <button 
            onClick={() => onNavigate('complaints')}
            className="flex flex-col items-center gap-3 p-4 rounded-lg border-2 border-slate-200 dark:border-slate-800 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50/50 dark:hover:bg-green-950/20 transition-all group cursor-pointer"
          >
            <div className="p-3 bg-green-100 dark:bg-green-950/60 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/60 transition-colors">
              <HeadphonesIcon size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Support Desk</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Customer Grievance</p>
            </div>
          </button>
          <button 
            onClick={() => onNavigate('daily-checklists')}
            className="flex flex-col items-center gap-3 p-4 rounded-lg border-2 border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all group cursor-pointer"
          >
            <div className="p-3 bg-purple-100 dark:bg-purple-950/60 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-900/60 transition-colors">
              <Settings size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Daily Operations</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Dealership SOPs</p>
            </div>
          </button>
        </div>
      </div>

      {/* Analytics and AI Model Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#0c121e] p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Platform Revenue Trend</h3>
            <select className="text-sm border-none bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-orange-500">
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #334155', color: '#f8fafc', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)' }}
                  itemStyle={{ color: '#f97316' }}
                />
                <Area type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2.5} fillOpacity={1} fill="url(#colorValue)" name="Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0c121e] p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">AI Model Status</h3>
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={engineStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {engineStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{platformKPIs.totalModels}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Total Models</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-100 dark:border-emerald-900/40">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Active Engines</span>
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-white">6</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-100 dark:border-blue-900/40">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Optimal Models</span>
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-white">58</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0c121e] p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent AI Autonomous Operations</h3>
        <div className="space-y-3">
          {[
            { engine: 'Sales AI Copilot', action: 'Lead Scored & VIP Flagged', detail: 'Rajesh Kumar marked as High Priority (98%) - Auto-assigned to Priya Sharma', time: '2m ago', badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800', show: user?.permissions.includes('sales') },
            { engine: 'Service AI Engine', action: 'Predictive Diagnostic Alert', detail: 'Battery failure risk predicted for Vehicle MH-02-DN-4321 - Bay 3 notified', time: '15m ago', badge: 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200 dark:border-orange-800', show: user?.permissions.includes('service') },
            { engine: 'Finance AI Copilot', action: 'Instant Approval Generated', detail: 'Auto-approved loan for application #LN-9922 (HDFC Bank API)', time: '32m ago', badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800', show: user?.permissions.includes('finance') },
            { engine: 'Fleet AI Engine', action: 'Route Telemetry Optimized', detail: 'Saved 14% energy on Logistics Route B - Battery thermal balanced', time: '1h ago', badge: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800', show: user?.permissions.includes('fleet') },
          ].filter(item => item.show).map((item, idx) => (
            <div key={idx} className="flex items-start p-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-lg transition-colors border-b border-slate-100 dark:border-slate-800/60 last:border-0">
              <span className={`px-2.5 py-1 rounded-md text-xs font-semibold mr-3 whitespace-nowrap ${item.badge}`}>
                {item.engine}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.action}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.detail}</p>
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">{item.time}</span>
            </div>
          ))}
          {user?.role === 'Technician' && (
             <p className="text-center text-sm text-slate-400 italic py-2">Service Workshop Copilot active. Monitoring Bay & Diagnostic Telemetry.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
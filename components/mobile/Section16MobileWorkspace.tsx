import React, { useState } from 'react';
import {
  Smartphone, Zap, Truck, ShieldCheck, Wrench, User,
  Wifi, WifiOff, Bell, MapPin, Activity, ChevronDown, ChevronRight,
  CheckCircle2, AlertTriangle, Bot, Clock, Radio
} from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────

interface AppScreen {
  screen: string;
  features: string[];
  ai?: string | null;
  offline?: string;
  updateFreq?: string;
}

interface MobileApp {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  targetUser: string;
  screens: AppScreen[];
}

const APPS: MobileApp[] = [
  {
    id: 'APP-01', name: 'Customer App', icon: <User size={18} />,
    color: 'text-orange-400', gradient: 'from-orange-500/20 to-amber-500/10',
    targetUser: 'Vehicle Owner (L7)',
    screens: [
      { screen: 'Home', features: ['Vehicle health score (large, prominent)', 'Next service due countdown', 'Insurance expiry alert', 'Quick actions: Book Service, Renew Insurance, Contact Advisor'], ai: "AI summary: '3 things to watch on your Creta this month'", offline: 'Cached data viewable' },
      { screen: 'My Vehicle', features: ['Full vehicle profile', 'Service history timeline', 'Insurance policy', 'Loan EMI schedule', 'Warranty status', 'Documents vault'], ai: "AI: 'Next service likely due in 3 weeks based on mileage pattern'", offline: 'Full offline' },
      { screen: 'Book Service', features: ['Workshop finder by location', 'Slot selection', 'Voice complaint entry (Tamil/English)', 'Photo upload', 'Booking confirmation'], ai: "AI slot: 'Tomorrow 11am at Porur has the shortest wait time'", offline: 'Online required' },
      { screen: 'Service Status', features: ['Real-time 6-stage job card status', 'Stage-by-stage timeline', 'Estimated completion', 'Advisor contact'], ai: 'Auto-push at every stage change — no need to open app', offline: 'Online required' },
      { screen: 'Insurance', features: ['Policy details', 'Multi-insurer renewal quotes', 'One-tap renewal payment', 'Claim initiation with photo upload'], ai: "AI: 'NCB saves Rs.1,840. Best: HDFC Ergo at Rs.14,200 comprehensive'", offline: 'Cached policy viewable' },
      { screen: 'Finance', features: ['Loan details', 'Full EMI schedule with countdown', 'Payment button', 'Account statement'], ai: 'EMI reminder push notification 5 days before due date', offline: 'Full offline' },
      { screen: 'EV Battery', features: ['Daily health score', 'Personalised range estimate', 'Charging history', 'Degradation graph', 'Replacement timeline'], ai: "AI: 'Charging to 80% extends battery life by 14 months vs 100% habit'", offline: 'Cached data' },
      { screen: 'Profile', features: ['Personal details', 'Notification preferences', 'Consent management (DPDP)', 'Linked vehicles', 'Data export request'], ai: null, offline: 'Full offline' },
    ]
  },
  {
    id: 'APP-02', name: 'Service Advisor', icon: <Wrench size={18} />,
    color: 'text-cyan-400', gradient: 'from-cyan-500/20 to-blue-500/10',
    targetUser: 'Service Advisor (L5) + Technician (L6)',
    screens: [
      { screen: 'Job Queue', features: ['All assigned jobs with status badges', 'Priority sorting', 'Vehicle details', 'Customer contact', 'Complaint summary'], ai: null, offline: 'Full offline — synced on connection' },
      { screen: 'Job Card Creator', features: ['Number plate OCR scan (< 2 sec)', 'Voice complaint entry (Tamil/English)', 'AI diagnosis view', 'Parts availability check', 'Photo evidence capture'], ai: 'AI diagnosis: symptoms → probable faults → recommended repair actions', offline: 'Partial offline — create locally, sync on connection' },
      { screen: 'Vehicle Inspection', features: ['Digital checklist with photo per point', 'AI defect detection from photos', 'Pass/fail per item', 'Condition notes'], ai: 'AI image analysis for defect identification', offline: 'Full offline — syncs on connection' },
      { screen: 'Status Updates', features: ['One-tap 6-stage change: Received → Work Started → 50% → QC → Ready → Delivered', 'Auto-triggers customer WhatsApp at each change'], ai: null, offline: 'Online required for WhatsApp trigger' },
      { screen: 'Parts Request', features: ['View allocated parts', 'Request additional from parts team', 'Confirm physical receipt'], ai: null, offline: 'Online for stock availability check' },
      { screen: 'My Productivity', features: ["Today's jobs completed", 'Efficiency score vs target', 'Earnings tracker (incentive)', 'Skill matrix progress'], ai: null, offline: 'Synced data — viewable offline' },
    ]
  },
  {
    id: 'APP-03', name: 'Fleet Manager', icon: <Truck size={18} />,
    color: 'text-emerald-400', gradient: 'from-emerald-500/20 to-green-500/10',
    targetUser: 'Fleet Manager (L4)',
    screens: [
      { screen: 'Fleet Live Map', features: ['All vehicle live locations', 'Colour-coded health (green/yellow/red)', 'Click vehicle for detail', 'Filter by status/driver'], ai: null, updateFreq: 'WebSocket — 30-second push' },
      { screen: 'Alerts Centre', features: ['Active alerts ranked: CRITICAL / WARNING / ADVISORY', 'One-tap action each alert'], ai: null, updateFreq: 'Push for CRITICAL, in-app badge for others' },
      { screen: 'Vehicle Detail', features: ['Individual health score', '7-day telemetry trend charts', 'Upcoming maintenance schedule', 'Current driver', 'Trip history'], ai: null, updateFreq: '5-min polling + live for active trip' },
      { screen: 'Driver Scorecards', features: ['Weekly score per driver', 'Team leaderboard', 'Coaching flag indicators', 'Incentive calculation', 'Trip replay'], ai: null, updateFreq: 'Weekly batch + live incident alerts' },
      { screen: 'Fuel Intelligence', features: ['Daily consumption per vehicle', 'Anomaly flags (theft detection)', 'Month-end efficiency ranking', 'Fuel station log'], ai: null, updateFreq: 'Daily batch + instant anomaly alerts' },
      { screen: 'Maintenance Calendar', features: ['Upcoming scheduled maintenance', 'Predictive recommendations by urgency', 'One-tap service booking'], ai: null, updateFreq: 'Weekly + predictive alert push' },
    ]
  },
  {
    id: 'APP-04', name: 'Dealer Executive', icon: <ShieldCheck size={18} />,
    color: 'text-purple-400', gradient: 'from-purple-500/20 to-violet-500/10',
    targetUser: 'Dealer Principal (L2), General Manager (L3), Sales Manager (L4), Sales Executive (L5)',
    screens: [
      { screen: 'Morning Brief', features: ['AI-generated daily summary at 7:55am', 'Yesterday revenue vs target', 'Top 3 actions today', 'One risk to watch', "Today's target"], ai: 'GPT-4o generates from all dashboard data every morning at 7:55am', updateFreq: 'Daily at 7:55am' },
      { screen: 'Lead Pipeline', features: ['Hot/Warm/Cold sorted list', 'SLA countdown per lead', 'One-tap call or WhatsApp', 'AI lead score on each card'], ai: 'AI next-best-action visible on each lead card', updateFreq: 'Real-time WebSocket' },
      { screen: 'Discount Approvals', features: ['Pending requests with margin impact', 'Vehicle details', 'Lead score', 'One-tap approve/reject with reason'], ai: 'AI recommendation: accept/reject based on probability × margin', updateFreq: 'Push on new request' },
      { screen: 'Team Performance', features: ['Individual KPIs per executive/advisor', 'NPS scores', 'Finance penetration', 'Insurance renewals'], ai: 'AI flags underperformers + likely root cause', updateFreq: 'Daily batch + real-time today' },
      { screen: 'My KPIs', features: ['Own lead pipeline', 'Conversion rate', 'Revenue contributed', 'Team ranking', 'Bonus calculation', 'Trend vs last month'], ai: "AI coaching: 'Response time avg 48 min — team best is 18 min'", updateFreq: 'Real-time for active leads' },
      { screen: 'Alerts', features: ['All escalations', 'Claim updates', 'Payment received', 'Churn risk flags', 'System alerts — priority ranked'], ai: 'AI priority ranking: most urgent + most impactful first', updateFreq: 'Push notification in real-time' },
    ]
  },
  {
    id: 'APP-05', name: 'Technician App', icon: <Zap size={18} />,
    color: 'text-amber-400', gradient: 'from-amber-500/20 to-yellow-500/10',
    targetUser: 'Technician (L6)',
    screens: [
      { screen: 'My Job Queue', features: ['Assigned jobs only (filtered to technician)', 'Estimated time per job', 'Vehicle & complaint details', 'Skill match indicator'], ai: 'AI diagnosis notes from service advisor pre-populated', offline: 'Full offline' },
      { screen: 'Job Execution', features: ['Step-by-step repair checklist', 'Time tracking (start/pause/complete)', 'Parts used confirmation', 'Photo evidence at each step'], ai: 'AI suggested repair steps based on DTC codes', offline: 'Full offline — syncs on completion' },
      { screen: 'Vehicle Inspection', features: ['Pre/post repair inspection checklist', 'Photo per inspection point', 'AI defect detection', 'Sign-off capture'], ai: 'AI image analysis for defect identification', offline: 'Full offline' },
      { screen: "My Productivity", features: ['Jobs completed today', 'Efficiency score', 'Skill badges earned', 'Income tracker (incentive)'], ai: null, offline: 'Cached data' },
    ]
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

const ScreenCard: React.FC<{ screen: AppScreen; appColor: string; expanded: boolean; onClick: () => void }> = ({ screen, appColor, expanded, onClick }) => (
  <div onClick={onClick} className={`rounded-lg border transition-all cursor-pointer ${expanded ? 'border-slate-600/50 bg-[#12172a]' : 'border-slate-800/60 bg-[#0d1117] hover:border-slate-700/50'}`}>
    <div className="flex items-center justify-between px-3 py-2.5">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-white">{screen.screen}</span>
        {screen.ai && <Bot size={12} className="text-purple-400" />}
        {screen.offline && (
          screen.offline.toLowerCase().includes('full offline')
            ? <WifiOff size={11} className="text-emerald-400" />
            : screen.offline.toLowerCase().includes('partial')
              ? <Wifi size={11} className="text-amber-400" />
              : null
        )}
      </div>
      {expanded ? <ChevronDown size={13} className="text-slate-400" /> : <ChevronRight size={13} className="text-slate-600" />}
    </div>
    {expanded && (
      <div className="px-3 pb-3 border-t border-slate-800/40 pt-2 space-y-2">
        <ul className="space-y-1">
          {screen.features.map((f, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-slate-400">
              <CheckCircle2 size={10} className="text-slate-600 shrink-0 mt-0.5" />{f}
            </li>
          ))}
        </ul>
        {screen.ai && (
          <div className="bg-purple-500/10 border border-purple-500/20 rounded px-2.5 py-1.5 text-xs text-purple-300 flex items-start gap-1.5">
            <Bot size={11} className="shrink-0 mt-0.5" /> {screen.ai}
          </div>
        )}
        {screen.offline && (
          <div className="bg-slate-800/50 rounded px-2.5 py-1 text-[11px] text-slate-400 flex items-center gap-1.5">
            <WifiOff size={10} className="shrink-0" /> Offline: {screen.offline}
          </div>
        )}
        {screen.updateFreq && (
          <div className="bg-cyan-500/5 border border-cyan-500/15 rounded px-2.5 py-1 text-[11px] text-cyan-400 flex items-center gap-1.5">
            <Radio size={10} className="shrink-0" /> {screen.updateFreq}
          </div>
        )}
      </div>
    )}
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────

const Section16MobileWorkspace: React.FC = () => {
  const [selectedApp, setSelectedApp] = useState('APP-01');
  const [expandedScreen, setExpandedScreen] = useState<string | null>(null);

  const currentApp = APPS.find(a => a.id === selectedApp)!;

  const aiScreenCount = currentApp.screens.filter(s => s.ai).length;
  const offlineScreenCount = currentApp.screens.filter(s => s.offline && s.offline.includes('offline')).length;

  return (
    <div className="space-y-5">
      {/* Architecture banner */}
      <div className="bg-gradient-to-r from-slate-900 to-[#0d1117] border border-slate-700/50 rounded-xl p-4 flex flex-wrap gap-4 items-center">
        <div>
          <p className="text-xs font-bold text-white">Shared Architecture — React Native + Expo EAS</p>
          <p className="text-xs text-slate-400 mt-0.5">1 codebase · 5 apps · 1 team · Role-based screen routing · 90% code reuse</p>
        </div>
        <div className="flex flex-wrap gap-2 ml-auto">
          {[
            { label: 'OTA Updates', icon: <Zap size={11} />, color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
            { label: 'Offline-First', icon: <WifiOff size={11} />, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
            { label: 'Tamil + Hindi + English', icon: <Radio size={11} />, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
            { label: 'Voice + OCR', icon: <Activity size={11} />, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
          ].map((b, i) => (
            <span key={i} className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${b.color}`}>
              {b.icon} {b.label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* App selector */}
        <div className="lg:w-52 shrink-0 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">5 Apps</p>
          {APPS.map(app => (
            <button
              key={app.id}
              onClick={() => { setSelectedApp(app.id); setExpandedScreen(null); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all border ${
                selectedApp === app.id
                  ? `bg-gradient-to-r ${app.gradient} border-slate-600/60`
                  : 'border-slate-800/60 bg-[#0d1117] hover:border-slate-700/50'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${app.color} bg-slate-800/80`}>
                {app.icon}
              </div>
              <div className="min-w-0">
                <p className={`text-xs font-bold ${selectedApp === app.id ? 'text-white' : 'text-slate-300'}`}>{app.id}</p>
                <p className="text-[11px] text-slate-500 truncate">{app.name}</p>
              </div>
              {selectedApp === app.id && <ChevronRight size={13} className={`${app.color} ml-auto shrink-0`} />}
            </button>
          ))}
        </div>

        {/* App detail */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* App header */}
          <div className={`bg-gradient-to-r ${currentApp.gradient} border border-slate-700/40 rounded-xl p-4`}>
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${currentApp.color} bg-slate-800/80`}>
                {currentApp.icon}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-base font-black text-white">{currentApp.name}</p>
                  <span className="text-[10px] font-mono text-slate-500">{currentApp.id}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{currentApp.targetUser}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-3">
              {[
                { label: `${currentApp.screens.length} Screens`, icon: <Smartphone size={11} /> },
                { label: `${aiScreenCount} AI-Powered`, icon: <Bot size={11} /> },
                { label: `${offlineScreenCount} Offline-Capable`, icon: <WifiOff size={11} /> },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-slate-300">
                  <span className={currentApp.color}>{s.icon}</span> {s.label}
                </div>
              ))}
            </div>
          </div>

          {/* Screens */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Screens</p>
            {currentApp.screens.map(screen => (
              <ScreenCard
                key={screen.screen}
                screen={screen}
                appColor={currentApp.color}
                expanded={expandedScreen === screen.screen}
                onClick={() => setExpandedScreen(expandedScreen === screen.screen ? null : screen.screen)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* All-apps overview */}
      <div className="bg-[#0d1117] border border-slate-800/70 rounded-xl p-4">
        <p className="text-xs font-bold text-slate-300 mb-3">All-Apps Overview</p>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {APPS.map(app => (
            <div key={app.id} className={`bg-gradient-to-br ${app.gradient} border border-slate-700/30 rounded-xl p-3 text-center`}>
              <div className={`${app.color} flex justify-center mb-1.5`}>{app.icon}</div>
              <p className="text-xs font-bold text-white">{app.name}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{app.screens.length} screens</p>
              <p className="text-[10px] mt-1">
                <span className="text-purple-400">{app.screens.filter(s => s.ai).length} AI</span>
                {' · '}
                <span className="text-emerald-400">{app.screens.filter(s => s.offline && s.offline.includes('offline')).length} offline</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Section16MobileWorkspace;

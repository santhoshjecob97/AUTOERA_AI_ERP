import React, { useState } from 'react';
import {
  User, Award, Activity, MessageSquare, Phone, Star, Wrench,
  Clock, AlertTriangle, TrendingUp, CheckCircle, Flame, ShieldAlert,
  Play, Square, ChevronRight, BarChart2, Info, ArrowUpRight
} from 'lucide-react';
import StatCard from '../../components/StatCard';
import PageNavigation from '../../components/common/PageNavigation';

interface TechnicianPerformance {
  id: string;
  name: string;
  skillTier: 'L1' | 'L2' | 'L3';
  skillTierLabel: string;
  role: string;
  status: 'active' | 'break' | 'leave' | 'idle';
  currentJob?: string;
  bayNumber?: string;
  skills: string[];
  clockedHoursToday: number;
  availableHours: number;
  soldFlatRateHours: number;
  productiveHours: number;
  productivityPct: number; // Productive / Available * 100
  efficiencyPct: number;   // Sold / Clocked * 100
  utilizationPct: number;  // Clocked / Available * 100
  rating: number;
  certifications: string[];
  comebackCount: number;
  idleSpikeAlert?: string;
}

const TECHNICIANS_DATA: TechnicianPerformance[] = [
  {
    id: 'T-1',
    name: 'K. Rajesh Kumar',
    skillTier: 'L3',
    skillTierLabel: 'Level 3 — Master Tech & EV Specialist',
    role: 'Diagnostic Lead & EV High Voltage',
    status: 'active',
    currentJob: 'City e:HEV — Hybrid Inverter & Powertrain Diagnostic',
    bayNumber: 'Bay 04 (Express Diagnostic)',
    skills: ['High Voltage Battery', 'ECU Flashing', 'AT Overhaul', 'ADAS Calibration'],
    clockedHoursToday: 7.2,
    availableHours: 8.0,
    productiveHours: 7.0,
    soldFlatRateHours: 8.5,
    productivityPct: 87.5,
    efficiencyPct: 118.1,
    utilizationPct: 90.0,
    rating: 4.9,
    certifications: ['Honda Master Tech 2025', 'EV Safety Level 4', 'ASE Certified'],
    comebackCount: 0
  },
  {
    id: 'T-2',
    name: 'M. Suresh Anand',
    skillTier: 'L2',
    skillTierLabel: 'Level 2 — Mechanical & Suspension',
    role: 'Senior Mechanic',
    status: 'active',
    currentJob: 'Elevate ZX — 30,000km PMS + Brake Pad Replacement',
    bayNumber: 'Bay 02 (Two-Post Lift)',
    skills: ['Suspension', 'Braking Systems', 'Steering Rack', 'AC Overhaul'],
    clockedHoursToday: 7.5,
    availableHours: 8.0,
    productiveHours: 7.2,
    soldFlatRateHours: 7.8,
    productivityPct: 90.0,
    efficiencyPct: 104.0,
    utilizationPct: 93.8,
    rating: 4.8,
    certifications: ['Honda Silver Certified', 'Air Conditioning Specialist'],
    comebackCount: 0
  },
  {
    id: 'T-3',
    name: 'D. Vinod',
    skillTier: 'L2',
    skillTierLabel: 'Level 2 — Electrical & Diagnostics',
    role: 'Electrical & Transmission Tech',
    status: 'idle',
    currentJob: 'Awaiting Brake Disc Rotors from Spare Parts',
    bayNumber: 'Bay 05',
    skills: ['Wiring Harness', 'Alternator', 'Transmission', 'Sensors'],
    clockedHoursToday: 5.5,
    availableHours: 8.0,
    productiveHours: 4.5,
    soldFlatRateHours: 4.8,
    productivityPct: 56.3,
    efficiencyPct: 87.3,
    utilizationPct: 68.8,
    rating: 4.6,
    certifications: ['Honda Diagnostic Pro'],
    comebackCount: 1,
    idleSpikeAlert: 'Idle 1.8h waiting for Parts Counter issue slip'
  },
  {
    id: 'T-4',
    name: 'P. Arumugam',
    skillTier: 'L1',
    skillTierLabel: 'Level 1 — PMS & Maintenance',
    role: 'PMS Technician',
    status: 'active',
    currentJob: 'Amaze S — 10,000km Free Periodic Service',
    bayNumber: 'Bay 01 (Express Service)',
    skills: ['Engine Oil & Filters', 'Tire Rotation', '40-Point Safety Inspection'],
    clockedHoursToday: 7.0,
    availableHours: 8.0,
    productiveHours: 6.8,
    soldFlatRateHours: 7.2,
    productivityPct: 85.0,
    efficiencyPct: 102.9,
    utilizationPct: 87.5,
    rating: 4.7,
    certifications: ['Honda Fast-Track PMS'],
    comebackCount: 0
  },
  {
    id: 'T-5',
    name: 'S. Karthikeyan',
    skillTier: 'L1',
    skillTierLabel: 'Level 1 — PMS & Wheel Alignment',
    role: 'Alignment & Lube Specialist',
    status: 'break',
    skills: ['Wheel Alignment', 'Balancing', 'Fluid Flush'],
    clockedHoursToday: 6.5,
    availableHours: 8.0,
    productiveHours: 6.0,
    soldFlatRateHours: 6.5,
    productivityPct: 75.0,
    efficiencyPct: 100.0,
    utilizationPct: 81.3,
    rating: 4.5,
    certifications: ['Hunter Alignment Pro'],
    comebackCount: 0
  },
  {
    id: 'T-6',
    name: 'V. Sundaram',
    skillTier: 'L3',
    skillTierLabel: 'Level 3 — Master Engine Overhaul',
    role: 'Engine & Gearbox Specialist',
    status: 'leave',
    skills: ['i-VTEC Overhaul', 'Cylinder Head', 'CVT Teardown'],
    clockedHoursToday: 0,
    availableHours: 0,
    productiveHours: 0,
    soldFlatRateHours: 0,
    productivityPct: 0,
    efficiencyPct: 0,
    utilizationPct: 0,
    rating: 4.9,
    certifications: ['Honda Master Engine Builder 2024'],
    comebackCount: 0
  }
];

export const ServiceTechniciansPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'active' | 'idle' | 'break' | 'leave'>('all');
  const [selectedTech, setSelectedTech] = useState<TechnicianPerformance | null>(null);
  const [isClockModalOpen, setIsClockModalOpen] = useState(false);

  // Workshop-wide rollups
  const activeTechnicians = TECHNICIANS_DATA.filter(t => t.availableHours > 0);
  const totalAvailable = activeTechnicians.reduce((acc, t) => acc + t.availableHours, 0);
  const totalClocked = activeTechnicians.reduce((acc, t) => acc + t.clockedHoursToday, 0);
  const totalProductive = activeTechnicians.reduce((acc, t) => acc + t.productiveHours, 0);
  const totalSold = activeTechnicians.reduce((acc, t) => acc + t.soldFlatRateHours, 0);

  const shopProductivity = Math.round((totalProductive / totalAvailable) * 100);
  const shopEfficiency = Math.round((totalSold / totalClocked) * 100);
  const shopUtilization = Math.round((totalClocked / totalAvailable) * 100);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-300';
      case 'idle':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-300 animate-pulse';
      case 'break':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-300';
      case 'leave':
        return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-300';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'L3': return 'bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-300';
      case 'L2': return 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-300';
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300';
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageNavigation
        breadcrumbs={[
          { label: 'Service Command', href: '/service' },
          { label: 'Workshop & Technician Productivity Engine (SOP 8 & 9)' }
        ]}
      />

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-2xl border border-indigo-500/20 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Capital Honda Workshop SOP 8 & 9
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock size={12} className="text-indigo-400" />
              Live Time-Clock Tracking & Labour Sold
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Wrench className="text-indigo-400" size={28} />
            Technician Productivity Engine
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Real-time measurement of Productivity, Efficiency, and Utilization. Automated identification of flat-rate variances, comeback patterns, and spare parts idle bottlenecks.
          </p>
        </div>

        <button
          onClick={() => setIsClockModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition"
        >
          <Play size={16} />
          Clock In / Out Job Card
        </button>
      </div>

      {/* The 3 Standard Dealership Productivity Formulas Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Formula 1: Productivity */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Formula 1: Productivity
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono font-bold">
              Target: 85%+
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {shopProductivity}%
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            <code className="font-mono bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-[11px]">Productive Hrs / Available Hrs × 100</code>
          </p>
          <div className="mt-3 text-xs text-slate-600 dark:text-slate-300">
            {totalProductive}h productive work out of {totalAvailable}h shop capacity.
          </div>
        </div>

        {/* Formula 2: Efficiency */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Formula 2: Efficiency
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-bold">
              Target: 100%+
            </span>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {shopEfficiency}%
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            <code className="font-mono bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-[11px]">Sold Flat-Rate Hrs / Clocked Hrs × 100</code>
          </p>
          <div className="mt-3 text-xs text-slate-600 dark:text-slate-300">
            {totalSold}h billed to customers across {totalClocked}h clocked.
          </div>
        </div>

        {/* Formula 3: Utilization */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Formula 3: Utilization
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-mono font-bold">
              Target: 85%+
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {shopUtilization}%
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            <code className="font-mono bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-[11px]">Clocked Hrs / Available Hrs × 100</code>
          </p>
          <div className="mt-3 text-xs text-slate-600 dark:text-slate-300">
            {totalClocked}h actively logged out of {totalAvailable}h scheduled attendance.
          </div>
        </div>
      </div>

      {/* AI Anomaly & Bottleneck Banner */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/60 p-4 rounded-xl flex items-start gap-3 text-amber-900 dark:text-amber-200">
        <AlertTriangle className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" size={20} />
        <div className="text-xs space-y-1">
          <span className="font-bold">AI Workshop Bottleneck Detected: </span>
          <span>
            Bay 05 technician D. Vinod has logged <strong>1.8 hours idle waiting time</strong> for brake rotors from Spare Parts counter.
            Parts Manager notified to prioritize emergency workshop counter fulfillment.
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 w-fit">
        {(['all', 'active', 'idle', 'break', 'leave'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
              filter === f
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {f} {f === 'idle' ? '⚠️' : ''}
          </button>
        ))}
      </div>

      {/* Technician Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TECHNICIANS_DATA.filter(t => filter === 'all' || t.status === filter).map(tech => (
          <div
            key={tech.id}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-all space-y-4"
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">{tech.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${getTierColor(tech.skillTier)}`}>
                    {tech.skillTier}
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{tech.role}</div>
                <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">{tech.skillTierLabel}</div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(tech.status)}`}>
                {tech.status}
              </span>
            </div>

            {/* Current Assignment / Bay */}
            <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
              <div className="text-slate-400 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Wrench size={12} className="text-indigo-500" /> Current Work Order
                </span>
                {tech.bayNumber && <span className="font-semibold text-slate-700 dark:text-slate-300">{tech.bayNumber}</span>}
              </div>
              <div className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                {tech.currentJob || 'Available for next repair order'}
              </div>
              {tech.idleSpikeAlert && (
                <div className="mt-2 text-[11px] text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                  <ShieldAlert size={12} /> {tech.idleSpikeAlert}
                </div>
              )}
            </div>

            {/* 3 Productivity Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50/50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Productivity</div>
                <div className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                  {tech.productivityPct}%
                </div>
                <div className="text-[10px] text-slate-400">{tech.productiveHours}h / {tech.availableHours}h</div>
              </div>
              <div className="border-x border-slate-200 dark:border-slate-700 px-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Efficiency</div>
                <div className={`text-sm font-extrabold ${tech.efficiencyPct >= 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600'}`}>
                  {tech.efficiencyPct}%
                </div>
                <div className="text-[10px] text-slate-400">{tech.soldFlatRateHours}h sold</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Utilization</div>
                <div className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                  {tech.utilizationPct}%
                </div>
                <div className="text-[10px] text-slate-400">{tech.clockedHoursToday}h clocked</div>
              </div>
            </div>

            {/* Certifications & Rating */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <Award size={13} className="text-indigo-500" />
                <span className="truncate max-w-[150px]">{tech.certifications[0]}</span>
              </div>
              <div className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                {tech.rating}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Clock Event Modal */}
      {isClockModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="text-indigo-500" size={20} />
              Technician Job Card Clocking
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Accurately track clocked hours against standard flat-rate labor schedule for efficiency metrics.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Select Technician</label>
                <select className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900">
                  {TECHNICIANS_DATA.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.skillTier})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Repair Order / Job Card Number</label>
                <input
                  type="text"
                  placeholder="e.g. RO-2026-0814"
                  defaultValue="RO-2026-0814"
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Standard Flat-Rate Labour Hours (Sold)</label>
                <input
                  type="number"
                  step="0.1"
                  defaultValue="2.5"
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsClockModalOpen(false)}
                className="flex-1 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Technician time log started for RO-2026-0814. Real-time timer active.');
                  setIsClockModalOpen(false);
                }}
                className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
              >
                Confirm Clock-In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceTechniciansPage;

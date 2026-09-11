import React, { useState } from 'react';
import {
  Target, Award, TrendingUp, Users, DollarSign, Shield,
  CheckCircle2, AlertCircle, ArrowUpRight, Calculator,
  Calendar, Check, ChevronRight, BarChart3, Star, AlertTriangle
} from 'lucide-react';
import StatCard from '../../components/StatCard';
import PageNavigation from '../../components/common/PageNavigation';

interface RepTarget {
  id: string;
  name: string;
  avatar: string;
  targetUnits: number;
  actualUnits: number;
  achievementPct: number;
  aiForecastUnits: number;
  gapUnits: number;
  revenueTargetLakhs: number;
  revenueActualLakhs: number;
  financePenetrationPct: number;
  insurancePenetrationPct: number;
  accessoriesRevenue: number;
  csiScore: number;
  status: 'ACHIEVED' | 'ON_TRACK' | 'AT_RISK';
  incentiveGross: number;
  csiAdjustment: number;
  incentiveFinal: number;
  slabApplied: string;
}

const SALES_REPS_DATA: RepTarget[] = [
  {
    id: 'SR-1',
    name: 'Amit Sharma',
    avatar: 'A',
    targetUnits: 12,
    actualUnits: 14,
    achievementPct: 116.7,
    aiForecastUnits: 16.5,
    gapUnits: 0,
    revenueTargetLakhs: 180,
    revenueActualLakhs: 215,
    financePenetrationPct: 88,
    insurancePenetrationPct: 92,
    accessoriesRevenue: 145000,
    csiScore: 97.5,
    status: 'ACHIEVED',
    incentiveGross: 66000,
    csiAdjustment: 0,
    incentiveFinal: 66000,
    slabApplied: 'Super Achiever (>12 Units @ ₹4,000 + ₹10K Bonus)'
  },
  {
    id: 'SR-2',
    name: 'Priya Patel',
    avatar: 'P',
    targetUnits: 10,
    actualUnits: 9,
    achievementPct: 90.0,
    aiForecastUnits: 11.2,
    gapUnits: 1,
    revenueTargetLakhs: 150,
    revenueActualLakhs: 142,
    financePenetrationPct: 82,
    insurancePenetrationPct: 85,
    accessoriesRevenue: 98000,
    csiScore: 94.0,
    status: 'ON_TRACK',
    incentiveGross: 22500,
    csiAdjustment: 0,
    incentiveFinal: 22500,
    slabApplied: 'Core Performer (8-12 Units @ ₹2,500)'
  },
  {
    id: 'SR-3',
    name: 'Rahul Singh',
    avatar: 'R',
    targetUnits: 10,
    actualUnits: 8,
    achievementPct: 80.0,
    aiForecastUnits: 9.8,
    gapUnits: 2,
    revenueTargetLakhs: 150,
    revenueActualLakhs: 124,
    financePenetrationPct: 75,
    insurancePenetrationPct: 80,
    accessoriesRevenue: 85000,
    csiScore: 86.5, // Below 90% threshold!
    status: 'ON_TRACK',
    incentiveGross: 20000,
    csiAdjustment: -3000, // 15% CSI Penalty
    incentiveFinal: 17000,
    slabApplied: 'Core Performer (8-12 Units @ ₹2,500)'
  },
  {
    id: 'SR-4',
    name: 'Sneha Reddy',
    avatar: 'S',
    targetUnits: 8,
    actualUnits: 5,
    achievementPct: 62.5,
    aiForecastUnits: 6.5,
    gapUnits: 3,
    revenueTargetLakhs: 120,
    revenueActualLakhs: 78,
    financePenetrationPct: 65,
    insurancePenetrationPct: 72,
    accessoriesRevenue: 42000,
    csiScore: 92.0,
    status: 'AT_RISK',
    incentiveGross: 7500,
    csiAdjustment: 0,
    incentiveFinal: 7500,
    slabApplied: 'Base Tier (1-7 Units @ ₹1,500)'
  }
];

export const SalesTargetsIncentivesPage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('09');
  const [selectedRep, setSelectedRep] = useState<RepTarget | null>(null);
  const [isPayrollApproved, setIsPayrollApproved] = useState(false);

  // Rollups
  const totalTargetUnits = SALES_REPS_DATA.reduce((acc, r) => acc + r.targetUnits, 0);
  const totalActualUnits = SALES_REPS_DATA.reduce((acc, r) => acc + r.actualUnits, 0);
  const totalForecastUnits = SALES_REPS_DATA.reduce((acc, r) => acc + r.aiForecastUnits, 0);
  const totalGapUnits = SALES_REPS_DATA.reduce((acc, r) => acc + r.gapUnits, 0);
  const overallAchievement = Math.round((totalActualUnits / totalTargetUnits) * 100);
  const totalIncentives = SALES_REPS_DATA.reduce((acc, r) => acc + r.incentiveFinal, 0);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageNavigation
        breadcrumbs={[
          { label: 'Sales Command', href: '/sales' },
          { label: 'Target Hierarchy & Incentive Engine (SOP 20 & 21)' }
        ]}
      />

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-orange-950 to-slate-900 p-6 rounded-2xl border border-orange-500/20 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-md bg-orange-500/20 text-orange-300 border border-orange-500/30">
              Capital Honda SOP 20 & 21
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar size={13} className="text-orange-400" />
              September 2026 Target Cycle
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Target className="text-orange-400" size={28} />
            Target Hierarchy & Incentive Engine
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Target → Actual → Achievement % → Forecast → Gap. Explainable slab calculation with CSI quality gates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsPayrollApproved(true);
              alert('September 2026 sales incentives approved and transmitted to General Ledger & Payroll.');
            }}
            disabled={isPayrollApproved}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition shadow-lg ${
              isPayrollApproved
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/30'
            }`}
          >
            <CheckCircle2 size={16} />
            {isPayrollApproved ? 'Incentive Ledger Approved' : 'Approve Month-End Incentives'}
          </button>
        </div>
      </div>

      {/* Branch Target Rollup (Section 39 Master Spec) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Branch Target vs Actual"
          value={`${totalActualUnits} / ${totalTargetUnits} Cars`}
          icon={<Target className="w-5 h-5 text-orange-500" />}
          trend={{ value: overallAchievement, isPositive: overallAchievement >= 80 }}
          description={`Achievement: ${overallAchievement}% of Target`}
        />
        <StatCard
          title="AI Month-End Forecast"
          value={`${totalForecastUnits.toFixed(0)} Cars`}
          icon={<TrendingUp className="w-5 h-5 text-blue-500" />}
          trend={{ value: 12.8, isPositive: true }}
          description="Predicted Run-Rate Delivery"
        />
        <StatCard
          title="Gap to Target"
          value={`${totalGapUnits} Cars`}
          icon={<AlertCircle className="w-5 h-5 text-amber-500" />}
          description="Required across 20 working days"
        />
        <StatCard
          title="Total Incentive Pool"
          value={`₹${(totalIncentives / 1000).toFixed(1)}k`}
          icon={<Award className="w-5 h-5 text-emerald-500" />}
          description="Explainable Audit Ledger"
        />
      </div>

      {/* Transparent Incentive Rule Breakdown (Section 40) */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator size={18} className="text-orange-500" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Configured Retail Incentive Scheme: Capital Honda Tiered Slab 2026
            </h3>
          </div>
          <span className="text-xs px-2.5 py-1 rounded bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 font-bold">
            CSI Gate: ≥ 90.0% Score
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Calculation Chain: <strong>Base Salary → Volume Slab → Achievement Booster → CSI Modifier → Final Payable</strong>. Never hidden.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="font-bold text-slate-900 dark:text-white">Tier 1: Base Performer</div>
            <div className="text-slate-500 mt-1">1 to 7 Deliveries</div>
            <div className="text-indigo-600 dark:text-indigo-400 font-bold mt-1">₹1,500 / Vehicle</div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="font-bold text-slate-900 dark:text-white">Tier 2: Core Performer</div>
            <div className="text-slate-500 mt-1">8 to 12 Deliveries</div>
            <div className="text-emerald-600 dark:text-emerald-400 font-bold mt-1">₹2,500 / Vehicle</div>
          </div>
          <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-xl border border-orange-200 dark:border-orange-800">
            <div className="font-bold text-orange-900 dark:text-orange-200">Tier 3: Super Achiever</div>
            <div className="text-orange-700 dark:text-orange-400 mt-1">&gt; 12 Deliveries</div>
            <div className="text-orange-600 dark:text-orange-300 font-bold mt-1">₹4,000 / Vehicle + ₹10,000 Booster</div>
          </div>
        </div>
      </div>

      {/* Sales Representative Target & Incentive Matrix */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Representative Performance & Incentive Matrix</h3>
            <p className="text-xs text-slate-500">Live target vs actual tracking across volume, revenue, and CSI modifiers</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-4">Sales Executive</th>
                <th className="p-4">Target / Actual</th>
                <th className="p-4">Achievement %</th>
                <th className="p-4">AI Forecast</th>
                <th className="p-4">F&I Penetration</th>
                <th className="p-4">CSI Score</th>
                <th className="p-4">Slab Applied</th>
                <th className="p-4 text-right">Incentive Payable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {SALES_REPS_DATA.map(rep => (
                <tr
                  key={rep.id}
                  onClick={() => setSelectedRep(rep)}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/60 cursor-pointer transition"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold flex items-center justify-center text-xs">
                        {rep.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{rep.name}</div>
                        <div className="text-[10px] text-slate-400">{rep.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">
                    {rep.actualUnits} / {rep.targetUnits} Cars
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            rep.achievementPct >= 100
                              ? 'bg-emerald-500'
                              : rep.achievementPct >= 80
                              ? 'bg-orange-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.min(100, rep.achievementPct)}%` }}
                        />
                      </div>
                      <span className="font-bold">{rep.achievementPct}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-blue-600 dark:text-blue-400 font-semibold">
                    {rep.aiForecastUnits} Cars
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">
                    Fin: {rep.financePenetrationPct}% | Ins: {rep.insurancePenetrationPct}%
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded font-bold flex items-center gap-1 w-fit ${
                      rep.csiScore >= 90
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                    }`}>
                      <Star size={10} className="fill-current" />
                      {rep.csiScore}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                    {rep.slabApplied}
                  </td>
                  <td className="p-4 text-right">
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                      ₹{rep.incentiveFinal.toLocaleString('en-IN')}
                    </div>
                    {rep.csiAdjustment < 0 && (
                      <div className="text-[10px] text-rose-500 font-semibold">
                        CSI Pen: -₹{Math.abs(rep.csiAdjustment).toLocaleString('en-IN')}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Rep Explainable Calculation Modal */}
      {selectedRep && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Explainable Incentive Audit: {selectedRep.name}
                </h3>
                <p className="text-xs text-slate-500">Transparent Base → Rule → Achievement → Modifier Trail</p>
              </div>
              <button
                onClick={() => setSelectedRep(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Target Assigned:</span>
                <span className="font-semibold">{selectedRep.targetUnits} Units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Actual Delivered:</span>
                <span className="font-semibold">{selectedRep.actualUnits} Units ({selectedRep.achievementPct}%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Slab Scheme:</span>
                <span className="font-semibold text-orange-600 dark:text-orange-400">{selectedRep.slabApplied}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2">
                <span className="text-slate-500">Gross Incentive:</span>
                <span className="font-bold">₹{selectedRep.incentiveGross.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">CSI Score & Gate (≥90%):</span>
                <span className={selectedRep.csiScore >= 90 ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>
                  {selectedRep.csiScore}% {selectedRep.csiScore < 90 ? '(15% Penalty Applied)' : '(Gate Cleared)'}
                </span>
              </div>
              {selectedRep.csiAdjustment < 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>CSI Adjustment:</span>
                  <span>-₹{Math.abs(selectedRep.csiAdjustment).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-300 dark:border-slate-600 pt-2 text-sm font-extrabold text-slate-900 dark:text-white">
                <span>Final Payout:</span>
                <span className="text-emerald-600 dark:text-emerald-400">₹{selectedRep.incentiveFinal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedRep(null)}
              className="w-full py-2 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-lg text-xs font-semibold"
            >
              Close Audit Trail
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesTargetsIncentivesPage;

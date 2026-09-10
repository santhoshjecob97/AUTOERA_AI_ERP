import React, { useState } from 'react';
import { 
  Sparkles, CheckCircle2, AlertTriangle, ArrowRight, 
  DollarSign, TrendingDown, Clock, ShieldAlert, Zap,
  Users, Car, FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ExecutiveActionCommandCenter: React.FC = () => {
  const navigate = useNavigate();
  const [executedAction, setExecutedAction] = useState<string | null>(null);
  const [activeQuery, setActiveQuery] = useState<'sales_drop' | 'ro_delay' | 'parts_stockout'>('sales_drop');

  const handleAction = (title: string, details: string) => {
    setExecutedAction(`Action Executed & Logged: ${title} (${details}). ActionProposal approved and dispatched to dealership event bus.`);
    setTimeout(() => setExecutedAction(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Action Notification Toast */}
      {executedAction && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-400 flex items-center justify-between animate-fade-in shadow-lg shadow-emerald-500/10">
          <span className="flex items-center gap-2 font-medium">
            <CheckCircle2 size={17} className="text-emerald-400 shrink-0" />
            {executedAction}
          </span>
          <button onClick={() => setExecutedAction(null)} className="text-slate-400 hover:text-white ml-3">✕</button>
        </div>
      )}

      {/* 5 Core Dealership Executive Questions Grid */}
      <div className="bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
              Dealership Command Center & Intelligence Brief
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-['Outfit'] mt-0.5">
              5 Executive Questions Every Dealership Must Answer Today
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg">
            Live Telemetry • AutoEra AI-OS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Question 1: Performance */}
          <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40 space-y-2">
            <span className="text-[11px] font-bold text-blue-500 uppercase tracking-wider flex items-center gap-1">
              <Zap size={13} /> 1. How Are We Performing?
            </span>
            <p className="text-xl font-bold text-slate-900 dark:text-white">₹ 4.25 Cr <span className="text-xs text-emerald-500 font-semibold">(104% Target)</span></p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              18 Units Delivered today. Service gross profit is at ₹ 14.8L with 42 Repair Orders closed. CSI: 94.2/100.
            </p>
          </div>

          {/* Question 2: What Changed Today */}
          <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40 space-y-2">
            <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 size={13} /> 2. What Changed Today?
            </span>
            <p className="text-xl font-bold text-slate-900 dark:text-white">+14% <span className="text-xs text-slate-400 font-normal">Leads Influx</span></p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Walk-in footfall increased by 14% due to festive campaign. Workshop bay backlog cleared 6 delayed jobs.
            </p>
          </div>

          {/* Question 3: What Needs Attention */}
          <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40 space-y-2">
            <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle size={13} /> 3. What Needs Attention?
            </span>
            <p className="text-xl font-bold text-amber-500">11 Aging Units</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              11 vehicles aged &gt;60 days in yard (holding cost: ₹4,200/day). 27 leads have no follow-up within 24 hours.
            </p>
          </div>

          {/* Question 4: Money Being Lost */}
          <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40 space-y-2">
            <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1">
              <DollarSign size={13} /> 4. What Money Is Being Lost?
            </span>
            <p className="text-xl font-bold text-rose-500">₹ 1,45,000</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Discount leakage exceeding margin limits (₹97k) + 3 rejected warranty claims (₹48k) pending OEM dispute.
            </p>
          </div>
        </div>

        {/* Question 5: Action Center - What Should Management Do Today */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/30 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-orange-500 text-white">
                <Sparkles size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  5. What Should Management Do Today? — AutoEra AI Action Proposals
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  AI verified recommendations with 1-click execution &amp; managerial audit trails
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30">
              3 High-Impact Proposals
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-bold text-orange-500 uppercase">Sales Recovery</span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">Auto-Assign 27 Overdue Leads</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Distribute high-intent leads among top 3 available sales reps to recover ₹ 6.4L potential pipeline.
                </p>
              </div>
              <button
                onClick={() => handleAction("Auto-Assign 27 Leads", "Lead Dispatcher balanced across Arjun, Priya & Rahul")}
                className="w-full py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
              >
                [EXECUTE AUTO-ASSIGNMENT]
              </button>
            </div>

            <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-bold text-amber-500 uppercase">Inventory Velocity</span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">Reprice 11 Aging Units by 3%</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Apply targeted subvention to 11 vehicles aged &gt;60 days to liquidate ₹ 1.8 Cr trapped capital.
                </p>
              </div>
              <button
                onClick={() => handleAction("Reprice 11 Aging Units", "Festive 3% subvention discount queued for GM signoff")}
                className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
              >
                [REPRICE 11 VEHICLES]
              </button>
            </div>

            <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-bold text-blue-500 uppercase">Fixed Ops</span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">Approve 4 Pending Estimates</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Unblock Job Cards #JC-001 through #JC-004 to release Bay 1 and Bay 4 for afternoon express service.
                </p>
              </div>
              <button
                onClick={() => handleAction("Approve 4 Estimates", "Batch authorization granted for ROs #JC-001 to #JC-004")}
                className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
              >
                [APPROVE 4 ESTIMATES]
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Signature AutoEra Experience: Root Cause Diagnosis & Dialogue */}
      <div className="bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-500">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Signature AutoEra Experience: Natural Language Dealership Diagnostics
              </h3>
              <p className="text-[11px] text-slate-400">
                Ask root-cause business questions — AutoEra analyzes the dealership and executes safe actions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => setActiveQuery('sales_drop')}
              className={`px-3 py-1 rounded-md font-bold transition-all ${
                activeQuery === 'sales_drop' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-500 hover:text-white'
              }`}
            >
              "Why did sales drop this week?"
            </button>
            <button
              onClick={() => setActiveQuery('ro_delay')}
              className={`px-3 py-1 rounded-md font-bold transition-all ${
                activeQuery === 'ro_delay' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-500 hover:text-white'
              }`}
            >
              "Which ROs are delayed?"
            </button>
            <button
              onClick={() => setActiveQuery('parts_stockout')}
              className={`px-3 py-1 rounded-md font-bold transition-all ${
                activeQuery === 'parts_stockout' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-500 hover:text-white'
              }`}
            >
              "Find 14-day stockout parts"
            </button>
          </div>
        </div>

        {/* Simulated Dialogue Rendering */}
        <div className="p-5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800 space-y-4 font-sans">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">
              GM
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">General Manager Query</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                {activeQuery === 'sales_drop' && '"Why did showroom sales drop this week?"'}
                {activeQuery === 'ro_delay' && '"Which repair orders are delayed in the workshop?"'}
                {activeQuery === 'parts_stockout' && '"Which fast-moving spare parts will stock out within 14 days?"'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 border-t border-slate-200 dark:border-slate-800/80 pt-4">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
              AI
            </div>
            <div className="space-y-3 flex-1">
              <div>
                <p className="text-xs font-bold text-orange-500 uppercase">AutoEra AI Intelligence Core</p>
                {activeQuery === 'sales_drop' && (
                  <div className="space-y-2 mt-1 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <p className="text-sm font-bold text-rose-500">
                      Sales are down 11.8% versus last week (₹ 34.2L vs ₹ 38.8L).
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-white">Primary drivers identified by multi-agent analysis:</p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                      <li>SUV lead conversion fell <strong>8%</strong> due to competitor price cut on Creta / Seltos.</li>
                      <li><strong>27 high-intent leads</strong> had no consultant contact within the 24-hour SLA window.</li>
                      <li><strong>11 vehicles</strong> aged &gt;60 days in yard with zero showroom exposure.</li>
                      <li>Finance approval conversion dropped <strong>5%</strong> at HDFC Bank due to missing ITR documents.</li>
                    </ul>
                  </div>
                )}
                {activeQuery === 'ro_delay' && (
                  <div className="space-y-2 mt-1 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <p className="text-sm font-bold text-amber-500">
                      2 Repair Orders are delayed past the 3.5-hour customer promised time.
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-white">Root Causes:</p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                      <li>Job Card #JC-002: Awaiting customer WhatsApp estimate approval for rear disc rotors (₹ 3,400).</li>
                      <li>Job Card #JC-005: Bay 4 wheel alignment laser sensor recalibration in progress.</li>
                    </ul>
                  </div>
                )}
                {activeQuery === 'parts_stockout' && (
                  <div className="space-y-2 mt-1 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <p className="text-sm font-bold text-blue-500">
                      3 Fast-Moving Parts are below reorder threshold based on 14-day service scheduling:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                      <li>HY-BRK-PAD-F (Front Brake Pads): 5 in stock (burn rate: 3/day) &bull; Stockout in 2 days.</li>
                      <li>HY-OIL-SYN-5W30 (Synthetic Engine Oil): 10L in stock &bull; Stockout in 4 days.</li>
                      <li>HY-FLT-OIL-01 (Oil Filter Cartridge): 8 in stock &bull; Stockout in 5 days.</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {activeQuery === 'sales_drop' && (
                  <>
                    <button
                      onClick={() => handleAction("Overdue Leads Re-assigned", "27 leads redistributed to Arjun Reddy and Priya Sharma")}
                      className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                    >
                      [ASSIGN 27 OVERDUE LEADS]
                    </button>
                    <button
                      onClick={() => handleAction("11 Aging Vehicles Repriced", "Subvention discount applied and published to portal")}
                      className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-bold transition-all"
                    >
                      [REPRICE 11 AGING VEHICLES]
                    </button>
                    <button
                      onClick={() => navigate('/finance/analytics')}
                      className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition-all"
                    >
                      [OPEN FINANCE ANALYSIS]
                    </button>
                  </>
                )}
                {activeQuery === 'ro_delay' && (
                  <button
                    onClick={() => handleAction("WhatsApp Reminder Dispatched", "Customer notified with OTP approval link for rear rotors")}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                  >
                    [SEND WHATSAPP APPROVAL REMINDER]
                  </button>
                )}
                {activeQuery === 'parts_stockout' && (
                  <button
                    onClick={() => handleAction("Purchase Order Drafted", "PO #PO-20260910-01 sent to Mobis Auto Parts for 50x Pads & 40L Oil")}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                  >
                    [DRAFT REPLENISHMENT PO (₹ 1,38,600)]
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveActionCommandCenter;

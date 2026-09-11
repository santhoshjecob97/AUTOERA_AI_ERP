import React, { useState, useEffect } from 'react';
import { 
  Sparkles, CheckCircle2, AlertTriangle, ArrowRight, 
  DollarSign, TrendingDown, Clock, ShieldAlert, Zap,
  Users, Car, FileText, RefreshCw, ShieldCheck, Flame
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import aiEngineApi, { ActionPriorityItem, SLASummaryResponse } from '../../services/aiEngineApi';
import ActionProposalDrawer from '../ActionProposalDrawer';

export const ExecutiveActionCommandCenter: React.FC = () => {
  const navigate = useNavigate();
  const [executedAction, setExecutedAction] = useState<string | null>(null);
  const [activeQuery, setActiveQuery] = useState<'sales_drop' | 'ro_delay' | 'parts_stockout'>('sales_drop');
  const [isProposalDrawerOpen, setIsProposalDrawerOpen] = useState(false);
  const [topActions, setTopActions] = useState<ActionPriorityItem[]>([]);
  const [slaSummary, setSlaSummary] = useState<SLASummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingProposalsCount, setPendingProposalsCount] = useState(3);

  const fetchLiveActionsAndSLA = async () => {
    setIsLoading(true);
    try {
      const [actionsRes, slaRes, proposalsRes] = await Promise.allSettled([
        aiEngineApi.getTopActions(),
        aiEngineApi.getSLASummary(),
        aiEngineApi.getProposals({ status: 'PENDING_APPROVAL' })
      ]);

      if (actionsRes.status === 'fulfilled' && actionsRes.value?.actions) {
        setTopActions(actionsRes.value.actions);
      }
      if (slaRes.status === 'fulfilled' && slaRes.value) {
        setSlaSummary(slaRes.value);
      }
      if (proposalsRes.status === 'fulfilled' && Array.isArray(proposalsRes.value)) {
        setPendingProposalsCount(proposalsRes.value.length);
      }
    } catch (err) {
      console.warn('Live SLA telemetry load warning:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveActionsAndSLA();
  }, []);

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
            <p className="text-xl font-bold text-amber-500">
              {slaSummary ? `${slaSummary.sla_summary.at_risk + slaSummary.sla_summary.breached} SLA Actions` : '11 Aging Units'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {slaSummary ? (
                <>
                  <strong className="text-slate-900 dark:text-white">{slaSummary.sla_summary.at_risk} operations at risk</strong> and {slaSummary.sla_summary.breached} breached. Overall dealership SLA compliance: <strong className="text-emerald-500">{slaSummary.sla_summary.compliance_rate_pct}%</strong>.
                </>
              ) : (
                '11 vehicles aged >60 days in yard (holding cost: ₹4,200/day). 27 leads have no follow-up within 24 hours.'
              )}
            </p>
          </div>

          {/* Question 4: Money Being Lost */}
          <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40 space-y-2">
            <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1">
              <DollarSign size={13} /> 4. What Money Is Being Lost?
            </span>
            <p className="text-xl font-bold text-rose-500">
              {slaSummary?.financial_exposure_total_inr 
                ? `₹ ${(slaSummary.financial_exposure_total_inr / 100000).toFixed(2)} Lakh` 
                : '₹ 1,45,000'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {slaSummary?.financial_exposure_total_inr 
                ? `Immediate financial exposure tracked across ${slaSummary.total_actions_today} open operational bottlenecks & delayed job orders.`
                : 'Discount leakage exceeding margin limits (₹97k) + 3 rejected warranty claims (₹48k) pending OEM dispute.'}
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
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>5. What Should Management Do Today? — Dynamic Top Actions</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-orange-500/20 text-orange-600 dark:text-orange-400">
                    SLA Priority Engine Active
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Real-time multi-dimensional scoring: Business Impact + Urgency + SLA Risk + Financial Exposure
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsProposalDrawerOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck size={14} />
                <span>Review AI Proposals ({pendingProposalsCount})</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            {topActions.length > 0 ? (
              topActions.slice(0, 3).map((act) => (
                <div key={act.action_id} className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-black text-orange-500 uppercase tracking-wider">
                        {act.category} &bull; Score {act.priority_score}
                      </span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        act.sla_status === 'BREACHED' 
                          ? 'bg-rose-500/10 text-rose-500 border border-rose-500/30' 
                          : act.sla_status === 'AT_RISK'
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                            : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                      }`}>
                        {act.sla_status}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1 line-clamp-2">
                      {act.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                      {act.recommended_action}
                    </p>
                    {act.financial_exposure_inr > 0 && (
                      <p className="text-[10px] font-semibold text-rose-500 mt-1">
                        Exposure: ₹ {act.financial_exposure_inr.toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      if (act.category === 'SERVICE') navigate('/service');
                      else if (act.category === 'SALES') navigate('/sales');
                      else setIsProposalDrawerOpen(true);
                    }}
                    className="w-full py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    RESOLVE NOW &rarr;
                  </button>
                </div>
              ))
            ) : (
              <>
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
              </>
            )}
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

      {/* Level 1 Group Command: Multi-Branch Benchmarking & Revenue at Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Multi-Branch Benchmarking Matrix */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Level 1 Group Command</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Multi-Branch Real-Time Benchmarking
              </h3>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
              3 Branches Reporting
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="p-3">Dealership Branch</th>
                  <th className="p-3">Retail (MTD)</th>
                  <th className="p-3">Workshop ROs</th>
                  <th className="p-3">F&I Penetration</th>
                  <th className="p-3">CSI Score</th>
                  <th className="p-3">EOD Status</th>
                  <th className="p-3 text-right">Target Achievement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-850 transition">
                  <td className="p-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Capital Honda Meenambakkam (3S)
                  </td>
                  <td className="p-3 font-semibold">18 / 20 Units</td>
                  <td className="p-3">42 ROs (₹3.8L Labour)</td>
                  <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold">84%</td>
                  <td className="p-3 font-bold text-amber-500">96.2</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                      SOP Signed
                    </span>
                  </td>
                  <td className="p-3 text-right font-extrabold text-emerald-600">104.2%</td>
                </tr>
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-850 transition">
                  <td className="p-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Capital Honda OMR / Perungudi
                  </td>
                  <td className="p-3 font-semibold">12 / 15 Units</td>
                  <td className="p-3">34 ROs (₹2.4L Labour)</td>
                  <td className="p-3 font-semibold">78%</td>
                  <td className="p-3 font-bold text-amber-500">94.0</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                      SOP Signed
                    </span>
                  </td>
                  <td className="p-3 text-right font-bold text-indigo-500">92.0%</td>
                </tr>
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-850 transition">
                  <td className="p-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Capital Honda Velachery / Pallikaranai
                  </td>
                  <td className="p-3 font-semibold">8 / 10 Units</td>
                  <td className="p-3">22 ROs (₹1.6L Labour)</td>
                  <td className="p-3 font-semibold text-rose-500">72%</td>
                  <td className="p-3 font-bold text-amber-500">91.5</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 text-[10px] font-bold">
                      In Review
                    </span>
                  </td>
                  <td className="p-3 text-right font-bold text-amber-500">86.0%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Real-Time Revenue at Risk Tracker */}
        <div className="bg-gradient-to-br from-slate-900 to-rose-950 text-white rounded-2xl p-6 border border-rose-500/30 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="text-rose-400" size={20} />
              <h3 className="font-bold text-sm">Real-Time Revenue At Risk</h3>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-extrabold border border-rose-500/40">
              ₹ 1.25 Cr Total
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Risk 1 */}
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-rose-300">Pending Loan Disbursements</span>
                <span className="text-white">₹ 48.5 L</span>
              </div>
              <p className="text-[11px] text-slate-300">
                4 vehicle deliveries blocked waiting for bank DO letter clearance &gt; 48 hours.
              </p>
              <button
                onClick={() => handleAction("Bank Escalation", "DO dispatch expedited with HDFC & Honda Finance credit officers")}
                className="mt-1 text-[10px] text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1"
              >
                Trigger Bank SLA Escalation <ArrowRight size={10} />
              </button>
            </div>

            {/* Risk 2 */}
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-amber-300">Yard Aging Stock (&gt;60 Days)</span>
                <span className="text-white">₹ 64.0 L</span>
              </div>
              <p className="text-[11px] text-slate-300">
                3 hybrid/top-trim units incurring holding charges of ₹1,800/day.
              </p>
              <button
                onClick={() => handleAction("Inter-Branch Stock Transfer", "3 aged units posted to OMR branch high-demand zone")}
                className="mt-1 text-[10px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
              >
                Initiate Inter-Branch Reallocation <ArrowRight size={10} />
              </button>
            </div>

            {/* Risk 3 */}
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-blue-300">Unapproved Workshop Estimates</span>
                <span className="text-white">₹ 12.5 L</span>
              </div>
              <p className="text-[11px] text-slate-300">
                6 repair orders waiting for customer authorization, blocking service bays.
              </p>
              <button
                onClick={() => handleAction("Automated WhatsApp Push", "Digital approval cards sent with payment options")}
                className="mt-1 text-[10px] text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
              >
                Send Automated Customer Follow-up <ArrowRight size={10} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stage 6C Human-in-the-Loop Action Proposal Drawer */}
      <ActionProposalDrawer
        isOpen={isProposalDrawerOpen}
        onClose={() => setIsProposalDrawerOpen(false)}
        onActionCompleted={fetchLiveActionsAndSLA}
      />
    </div>
  );
};

export default ExecutiveActionCommandCenter;


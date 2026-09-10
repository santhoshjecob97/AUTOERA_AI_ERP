import React, { useState } from 'react';
import { 
  Calculator, CheckCircle2, AlertTriangle, ShieldCheck, 
  IndianRupee, Sparkles, RefreshCw, Send, FileText, Check
} from 'lucide-react';
import PageNavigation from '../../components/common/PageNavigation';

const SettlementCalculatorPage: React.FC = () => {
  const [vehicleAgeYears, setVehicleAgeYears] = useState<number>(2);
  const [isZeroDep, setIsZeroDep] = useState<boolean>(true);
  const [partsCost, setPartsCost] = useState<number>(48000);
  const [paintCost, setPaintCost] = useState<number>(18000);
  const [labourCost, setLabourCost] = useState<number>(14500);
  const [salvageEstimate, setSalvageEstimate] = useState<number>(1500);
  const [selectedInsurer, setSelectedInsurer] = useState<string>('HDFC ERGO');
  const [isApproved, setIsApproved] = useState<boolean>(false);

  const tabs = [
    { id: 'overview', label: 'Overview', path: '/insurance' },
    { id: 'claims', label: 'Claim Processing', path: '/insurance/claims' },
    { id: 'damage', label: 'Damage Assessment', path: '/insurance/damage-assessment' },
    { id: 'fraud', label: 'Fraud Detection', path: '/insurance/fraud-detection' },
    { id: 'policies', label: 'Policy Recommendations', path: '/insurance/policies' },
    { id: 'settlement', label: 'Settlement Calculator', path: '/insurance/settlement' },
    { id: 'documents', label: 'Documents', path: '/insurance/documents' },
    { id: 'analytics', label: 'Analytics', path: '/insurance/analytics' },
  ];

  // Standard IRDAI Depreciation rate based on vehicle age (if not zero-dep)
  const getMetalDepreciationRate = (years: number) => {
    if (isZeroDep) return 0;
    if (years <= 0.5) return 0;
    if (years <= 1) return 0.05;
    if (years <= 2) return 0.10;
    if (years <= 3) return 0.15;
    if (years <= 4) return 0.25;
    if (years <= 5) return 0.35;
    return 0.50;
  };

  const metalDepPct = getMetalDepreciationRate(vehicleAgeYears);
  const depreciationDeduction = isZeroDep ? 0 : Math.round(partsCost * metalDepPct);
  const compulsoryDeductible = 1000; // Standard IRDAI compulsory excess for private cars
  const grossEstimate = partsCost + paintCost + labourCost;
  const netSettlementPayable = Math.max(0, grossEstimate - depreciationDeduction - compulsoryDeductible - salvageEstimate);

  const handleApprove = () => {
    setIsApproved(true);
    setTimeout(() => setIsApproved(false), 5000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageNavigation
        tabs={tabs}
        engineName="Insurance AI Engine"
        enginePath="/insurance"
      />

      {/* Title Banner */}
      <div className="bg-[#0D1117] border border-slate-800/90 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={13} className="text-cyan-400" />
              Section 07 &bull; Cashless Settlement &amp; Depreciation Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit'] flex items-center gap-3">
              IRDAI Cashless Garage Settlement Calculator
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl">
              Real-time IRDAI depreciation schedule, Zero-Depreciation waiver evaluation, compulsory excess deduction &amp; instant cashless surveyor pre-approval.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-bold">
              Cashless Tie-up Active &bull; Tier-1 Garage
            </span>
          </div>
        </div>
      </div>

      {/* Approved Notification */}
      {isApproved && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 size={16} />
          <span>Settlement order of ₹{netSettlementPayable.toLocaleString()} signed and transmitted to {selectedInsurer} cashless gateway.</span>
        </div>
      )}

      {/* Main Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Claim Parameters & Cost Breakdown */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-[#0D1117] border border-slate-800/90 rounded-2xl p-6 shadow-xl space-y-5">
            <h3 className="text-base font-bold text-white font-['Outfit'] pb-3 border-b border-slate-800">
              Claim Inputs &amp; Vehicle Policy Parameters
            </h3>

            {/* Insurer & Zero-Dep Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase block mb-1.5">Insurer Underwriter</label>
                <select
                  value={selectedInsurer}
                  onChange={(e) => setSelectedInsurer(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="HDFC ERGO">HDFC ERGO General Insurance</option>
                  <option value="ICICI Lombard">ICICI Lombard GIC</option>
                  <option value="Bajaj Allianz">Bajaj Allianz General Insurance</option>
                  <option value="Tata AIG">Tata AIG General Insurance</option>
                  <option value="New India Assurance">New India Assurance Co Ltd</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase block mb-1.5">Vehicle Age (Years)</label>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg p-2">
                  <input
                    type="range"
                    min="0"
                    max="8"
                    step="0.5"
                    value={vehicleAgeYears}
                    onChange={(e) => setVehicleAgeYears(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer h-1.5"
                  />
                  <span className="text-xs font-bold text-white font-mono shrink-0">{vehicleAgeYears} Yrs</span>
                </div>
              </div>
            </div>

            {/* Zero Dep Toggle */}
            <div 
              onClick={() => setIsZeroDep(!isZeroDep)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                isZeroDep ? 'bg-cyan-500/10 border-cyan-500/40 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded flex items-center justify-center border ${isZeroDep ? 'bg-cyan-500 border-cyan-500 text-slate-900' : 'border-slate-700'}`}>
                  {isZeroDep && <Check size={13} className="font-bold" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Zero Depreciation (Bumper-to-Bumper) Add-on</p>
                  <p className="text-[11px] text-slate-400">Waives off 100% metal, plastic (50%), and rubber (50%) depreciation</p>
                </div>
              </div>
              <span className="text-xs font-bold text-cyan-400">{isZeroDep ? 'ACTIVE (0% Dep)' : 'STANDARD'}</span>
            </div>

            {/* Repair Cost Fields */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Authorized Workshop Estimate Breakdown</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <label className="text-slate-400 block mb-1">Parts &amp; Components</label>
                  <input
                    type="number"
                    value={partsCost}
                    onChange={(e) => setPartsCost(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-white font-bold font-mono text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <label className="text-slate-400 block mb-1">Painting &amp; Materials</label>
                  <input
                    type="number"
                    value={paintCost}
                    onChange={(e) => setPaintCost(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-white font-bold font-mono text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <label className="text-slate-400 block mb-1">Labour &amp; Dismantling</label>
                  <input
                    type="number"
                    value={labourCost}
                    onChange={(e) => setLabourCost(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-white font-bold font-mono text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right 5 Cols: Settlement Order Summary */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-[#0D1117] border border-slate-800/90 rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-white font-['Outfit'] pb-3 border-b border-slate-800 flex items-center justify-between">
              <span>Cashless Settlement Calculation</span>
              <span className="text-xs text-orange-400 font-mono">{selectedInsurer}</span>
            </h3>

            <div className="space-y-2.5 my-4 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Total Workshop Estimate (Gross)</span>
                <span className="font-bold text-white">₹{grossEstimate.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">
                  Depreciation Deduction {isZeroDep ? '(Zero-Dep Protected)' : `(${metalDepPct * 100}%)`}
                </span>
                <span className={`font-bold ${depreciationDeduction > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  -₹{depreciationDeduction.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Compulsory Excess / Policy Deductible</span>
                <span className="font-bold text-rose-400">-₹{compulsoryDeductible.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Salvage Value Credit</span>
                <span className="font-bold text-rose-400">-₹{salvageEstimate.toLocaleString()}</span>
              </div>

              {/* Net Cashless Payout */}
              <div className="pt-4 border-t-2 border-slate-800 flex justify-between items-end">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Net Insurer Cashless Payout</p>
                  <p className="text-2xl font-black text-emerald-400 font-['Outfit']">
                    ₹{netSettlementPayable.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400">Customer Liability</p>
                  <p className="text-sm font-extrabold text-rose-400 font-mono">
                    ₹{(grossEstimate - netSettlementPayable).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Approval Action */}
            <div className="space-y-2.5 pt-4">
              <button
                onClick={handleApprove}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ShieldCheck size={16} />
                <span>Approve Cashless Settlement &amp; Release Job</span>
              </button>

              <button className="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-all">
                <FileText size={15} />
                <span>Export Surveyor Approval Certificate (PDF)</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default SettlementCalculatorPage;

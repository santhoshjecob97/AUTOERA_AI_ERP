import React, { useState } from 'react';
import {
  Zap, Battery, BatteryCharging, AlertTriangle, ShieldCheck,
  TrendingUp, RefreshCw, Gauge, Cpu, CheckCircle2, ChevronRight,
  Activity, ArrowUpRight, Flame, MapPin, Sparkles, Send,
  Wrench, Car, DollarSign, Leaf, Layers, Sliders, Radio,
  Clock, ShieldAlert, Check, HelpCircle
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';

export const Section10EVWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'HEALTH_SCORE' | 'RANGE_PREDICT' | 'DEGRADATION' | 'CHARGING_ANALYTICS' |
    'RANGE_ANXIETY' | 'CELL_BALANCE' | 'THERMAL' | 'TCO_CALC' | 'REPLACEMENT' | 'OEM_BMS'
  >('HEALTH_SCORE');

  // -------------------------------------------------------------
  // Feature 1: Daily Health Score State
  // -------------------------------------------------------------
  const [sohInput, setSohInput] = useState<number>(91.5);
  const [fadeRateInput, setFadeRateInput] = useState<number>(0.018);
  const [balanceScoreInput, setBalanceScoreInput] = useState<number>(94.0);
  const [thermalScoreInput, setThermalScoreInput] = useState<number>(92.0);
  const [batchComputing, setBatchComputing] = useState<boolean>(false);
  const [batchComputedMsg, setBatchComputedMsg] = useState<string | null>(null);

  const calculateScore = () => {
    const sohScore = sohInput;
    const fadeScore = Math.max(0, (1 - fadeRateInput) * 100);
    const balanceScore = balanceScoreInput;
    const thermalScore = thermalScoreInput;

    const raw = (sohScore * 0.40) + (fadeScore * 0.30) + (balanceScore * 0.20) + (thermalScore * 0.10);
    const score = Math.round(raw * 10) / 10;

    let status = 'URGENT';
    let advisory = 'Immediate workshop diagnosis required. High voltage pack inspection recommended.';
    if (score >= 90) {
      status = 'EXCELLENT';
      advisory = 'Battery pack operating within nominal factory specifications. Continue regular slow AC charging.';
    } else if (score >= 80) {
      status = 'HEALTHY';
      advisory = 'Pack health is good. Maintain charging between 20%–80% for maximum cell longevity.';
    } else if (score >= 70) {
      status = 'MONITOR';
      advisory = 'Mild cell degradation detected. Limit fast DC charging to preserve cathode structure.';
    } else if (score >= 60) {
      status = 'CONSULT';
      advisory = 'Capacity fade accelerating. Book BMS cell-rebalancing session with authorized service center.';
    }

    return { score, status, advisory };
  };

  const currentHealth = calculateScore();

  const handle2amBatchCompute = () => {
    setBatchComputing(true);
    setTimeout(() => {
      setBatchComputing(false);
      setBatchComputedMsg('Daily 2:00 AM Battery Health Scoring executed across all 24 active fleet units.');
      setTimeout(() => setBatchComputedMsg(null), 5000);
    }, 1200);
  };

  // -------------------------------------------------------------
  // Feature 2: Range Prediction State
  // -------------------------------------------------------------
  const [rangeSoc, setRangeSoc] = useState<number>(85);
  const [rangeDriverProfile, setRangeDriverProfile] = useState<'ECO' | 'NORMAL' | 'AGGRESSIVE'>('NORMAL');
  const [rangeTemp, setRangeTemp] = useState<number>(32);
  const [rangeTerrain, setRangeTerrain] = useState<'FLAT' | 'ROLLING' | 'HILLY'>('FLAT');
  const [rangePayload, setRangePayload] = useState<number>(160);
  const [rangeAcOn, setRangeAcOn] = useState<boolean>(true);

  const calculatePredictedRange = () => {
    const packKwh = 40.5;
    const usableKwh = packKwh * (rangeSoc / 100.0) * 0.95;
    const baseWhPerKm = 135.0;

    const driverMult = rangeDriverProfile === 'ECO' ? 0.88 : (rangeDriverProfile === 'NORMAL' ? 1.00 : 1.25);
    let tempMult = 1.0;
    if (rangeTemp > 35) tempMult += 0.12;
    else if (rangeTemp < 10) tempMult += 0.18;

    if (rangeAcOn) tempMult += 0.08;

    const terrainMult = rangeTerrain === 'FLAT' ? 1.0 : (rangeTerrain === 'ROLLING' ? 1.08 : 1.24);
    const payloadMult = 1.0 + Math.max(0, (rangePayload - 100) / 100) * 0.025;

    const effectiveWhKm = baseWhPerKm * driverMult * tempMult * terrainMult * payloadMult;
    const estKm = Math.round((usableKwh * 1000.0) / effectiveWhKm);
    const efficiency = Math.round((1000.0 / effectiveWhKm) * 10) / 10;

    return { estKm, efficiency, whKm: Math.round(effectiveWhKm) };
  };

  const rangeResult = calculatePredictedRange();

  // -------------------------------------------------------------
  // Feature 3: Degradation Forecasting State
  // -------------------------------------------------------------
  const [annualKm, setAnnualKm] = useState<number>(24000);
  const [fastChargeRatio, setFastChargeRatio] = useState<number>(35); // 35% DC fast charging
  const monthsToWarranty = Math.round((Math.max(0, sohInput - 70.0) / (0.88 * (1 + fastChargeRatio / 100))) * (10000 / annualKm) * 12);
  const estCostInr = 40.5 * 8500;

  // -------------------------------------------------------------
  // Feature 4: Charging Session Analytics State
  // -------------------------------------------------------------
  const [chargingEnergy, setChargingEnergy] = useState<number>(29.4);
  const [chargingChargerType, setChargingChargerType] = useState<'AC_SLOW' | 'DC_FAST'>('DC_FAST');
  const [chargingStartHour, setChargingStartHour] = useState<number>(19); // 7:00 PM (Peak)

  const isPeak = chargingStartHour >= 18 && chargingStartHour < 22;
  const isOffPeak = chargingStartHour >= 22 || chargingStartHour < 6;
  const ratePerKwh = isPeak ? 11.50 : (isOffPeak ? 5.20 : 8.00);
  const sessionCost = Math.round(chargingEnergy * ratePerKwh);
  const potentialSavings = Math.max(0, Math.round(chargingEnergy * (ratePerKwh - 5.20)));
  const chargeEfficiency = chargingChargerType === 'DC_FAST' ? 88.5 : 93.5;

  // -------------------------------------------------------------
  // Feature 5: Range Anxiety Intervention State
  // -------------------------------------------------------------
  const [alertVehicleReg, setAlertVehicleReg] = useState<string>('TN-09-EV-8421');
  const [alertSoc, setAlertSoc] = useState<number>(18);
  const [alertSent, setAlertSent] = useState<boolean>(false);

  // -------------------------------------------------------------
  // Feature 6: Cell Imbalance State
  // -------------------------------------------------------------
  const [cellDeltaMv, setCellDeltaMv] = useState<number>(28);
  const getImbalanceSeverity = (delta: number) => {
    if (delta <= 25) return { label: 'BALANCED', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', desc: 'Series string within factory delta balance (< 25 mV).' };
    if (delta <= 50) return { label: 'MILD_IMBALANCE', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30', desc: 'Schedule overnight AC slow charge for passive bleed balancing.' };
    if (delta <= 80) return { label: 'ELEVATED_WARNING', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', desc: 'Cell #17 voltage sagging. Top-balancing cycle required.' };
    return { label: 'CRITICAL_WEAK_CELL', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30', desc: 'Severe weak-cell anomaly (> 80 mV). Module replacement required.' };
  };

  // -------------------------------------------------------------
  // Feature 7: Thermal Management State
  // -------------------------------------------------------------
  const [packTempMax, setPackTempMax] = useState<number>(33);
  const getThermalStatus = (temp: number) => {
    if (temp > 48) return { label: 'CRITICAL_THERMAL_RUNAWAY_RISK', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30', action: 'Immediately halt charging. Maximum chiller pump flow engaged.' };
    if (temp > 42) return { label: 'ELEVATED_TEMPERATURE', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', action: 'Derate fast-charge rate from 60kW to 25kW to limit heat generation.' };
    if (temp < 0) return { label: 'FREEZING_LITHIUM_PLATING_RISK', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', action: 'Activate internal pack PTC heaters before allowing charge current.' };
    return { label: 'OPTIMAL_TEMPERATURE', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', action: 'Active liquid thermal management operating nominally.' };
  };

  // -------------------------------------------------------------
  // Feature 8: TCO Calculator State
  // -------------------------------------------------------------
  const [tcoAnnualKm, setTcoAnnualKm] = useState<number>(30000);
  const [tcoElecCost, setTcoElecCost] = useState<number>(8.0);
  const [tcoDieselCost, setTcoDieselCost] = useState<number>(94.0);

  const evCostPerKm = Math.round(((tcoElecCost / 7.0) + 0.45 + 0.40) * 100) / 100;
  const dieselCostPerKm = Math.round(((tcoDieselCost / 13.5) + 1.35 + 0.40) * 100) / 100;
  const annualEvCost = Math.round(tcoAnnualKm * evCostPerKm);
  const annualDieselCost = Math.round(tcoAnnualKm * dieselCostPerKm);
  const annualSavings = annualDieselCost - annualEvCost;
  const threeYearSavings = annualSavings * 3;
  const co2AvertedKg = Math.round(tcoAnnualKm * 0.142);

  // -------------------------------------------------------------
  // Feature 9: Battery Replacement Planning State
  // -------------------------------------------------------------
  const [selectedReplacementOption, setSelectedReplacementOption] = useState<string>('OEM_NEW_PACK');
  const [bookedJobCard, setBookedJobCard] = useState<string | null>(null);

  const replacementOptions = [
    {
      id: 'OEM_NEW_PACK',
      title: 'OEM Factory New Battery Pack (Tata / OEM Genuine)',
      sohGuarantee: '100% SOH',
      warranty: '8 Years / 160,000 km',
      costInr: '₹3,80,000',
      badge: 'Maximum Resale Value'
    },
    {
      id: 'CERTIFIED_REFURB',
      title: 'AutoEra Certified Refurbished Module Pack',
      sohGuarantee: '90% SOH',
      warranty: '3 Years / 60,000 km',
      costInr: '₹1,90,000',
      badge: '50% Fleet Savings'
    },
    {
      id: 'CELL_RECONDITION',
      title: 'Weak Cell Replacement & Module Rebalancing',
      sohGuarantee: '82% SOH',
      warranty: '1 Year / 25,000 km',
      costInr: '₹85,000',
      badge: 'Quick Economic Fix'
    },
    {
      id: 'TRADE_IN_UPGRADE',
      title: 'Guaranteed Buyback & Upgrade to New EV Model',
      sohGuarantee: '100% SOH (New EV)',
      warranty: 'Full New Car Warranty',
      costInr: '₹2,50,000 (Net)',
      badge: 'Dealer Loyalty Subsidy'
    }
  ];

  const handleBookWorkshop = () => {
    const jcRef = `JC-EV-TN09-BATTERY-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookedJobCard(jcRef);
  };

  // -------------------------------------------------------------
  // Feature 10: OEM BMS APIs State
  // -------------------------------------------------------------
  const oemConnectors = [
    { name: 'Tata Motors EV BMS API', model: 'Nexon EV / Curvv EV / Tiago EV', status: 'ONLINE', protocol: 'OAuth2.0 + mTLS', fw: 'v4.1.2-PROD', ping: '24ms' },
    { name: 'Ather Energy AtherGrid API', model: 'Ather 450X / 450 Apex', status: 'ONLINE', protocol: 'REST + WebSockets', fw: 'AtherOS-v14.2', ping: '18ms' },
    { name: 'OLA Electric HyperBMS Cloud', model: 'S1 Pro / S1 Air / Roadster', status: 'ONLINE', protocol: 'MQTT + AWS IoT Core', fw: 'MoveOS-4.0', ping: '31ms' },
    { name: 'Mahindra Electric INGLO API', model: 'XUV400 / BE.05 Fleet', status: 'ONLINE', protocol: 'ISO 15118 + PKI mTLS', fw: 'M-BMS-v2.8', ping: '29ms' }
  ];

  return (
    <div className="space-y-6 pt-4">
      {/* Navigation Sub-Tabs for Section 10 */}
      <div className="bg-[#0D1117] border border-slate-800 rounded-2xl p-2.5 shadow-xl">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 px-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-300 font-['Outfit']">
              Section 10 Master Capabilities Hub &bull; 10 Integrated EV Engines
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">P0 MVP &amp; P1/P2 Modules</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'HEALTH_SCORE', label: '1. Health Score (P0)', icon: Activity },
            { id: 'RANGE_PREDICT', label: '2. Range Prediction (P1)', icon: Gauge },
            { id: 'DEGRADATION', label: '3. Degradation Curve (P1)', icon: TrendingUp },
            { id: 'CHARGING_ANALYTICS', label: '4. Charging Analytics (P1)', icon: BatteryCharging },
            { id: 'RANGE_ANXIETY', label: '5. Range Anxiety Alert (P0)', icon: AlertTriangle },
            { id: 'CELL_BALANCE', label: '6. Cell Imbalance (P2)', icon: Cpu },
            { id: 'THERMAL', label: '7. Thermal Safety (P1)', icon: Flame },
            { id: 'TCO_CALC', label: '8. EV vs Diesel TCO (P1)', icon: DollarSign },
            { id: 'REPLACEMENT', label: '9. Replacement Plan (P1)', icon: Wrench },
            { id: 'OEM_BMS', label: '10. OEM BMS APIs (P2)', icon: Radio },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon size={13} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: DAILY BATTERY HEALTH SCORING (P0 MVP) */}
      {/* ========================================================= */}
      {activeTab === 'HEALTH_SCORE' && (
        <div className="bg-[#0D1117] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
                <Activity size={20} className="text-cyan-400" />
                Daily Battery Health Scoring Engine (P0 MVP)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Formula: SOH (40%) + 90-Day Fade (30%) + Cell Balance (20%) + Thermal Efficiency (10%) &bull; 2:00 AM Automated Batch
              </p>
            </div>

            <button
              onClick={handle2amBatchCompute}
              disabled={batchComputing}
              className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw size={13} className={batchComputing ? 'animate-spin' : ''} />
              {batchComputing ? 'Running 2am Batch...' : 'Trigger 2:00 AM Daily Scoring'}
            </button>
          </div>

          {batchComputedMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 size={15} />
              {batchComputedMsg}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Sliders */}
            <div className="lg:col-span-2 space-y-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Weighted Component Calibration</h4>

              {/* SOH (40%) */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">State of Health (SOH) &bull; 40% Weight</span>
                  <span className="text-cyan-400 font-bold font-mono">{sohInput}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="0.5"
                  value={sohInput}
                  onChange={(e) => setSohInput(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Fade Rate (30%) */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">90-Day Capacity Fade Rate &bull; 30% Weight</span>
                  <span className="text-orange-400 font-bold font-mono">{(fadeRateInput * 100).toFixed(1)}% / 90 days</span>
                </div>
                <input
                  type="range"
                  min="0.005"
                  max="0.080"
                  step="0.002"
                  value={fadeRateInput}
                  onChange={(e) => setFadeRateInput(parseFloat(e.target.value))}
                  className="w-full accent-orange-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Cell Balance (20%) */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Cell Voltage Balance Score &bull; 20% Weight</span>
                  <span className="text-purple-400 font-bold font-mono">{balanceScoreInput} / 100</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  step="1"
                  value={balanceScoreInput}
                  onChange={(e) => setBalanceScoreInput(parseFloat(e.target.value))}
                  className="w-full accent-purple-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Thermal Management (10%) */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Thermal Management Efficiency &bull; 10% Weight</span>
                  <span className="text-emerald-400 font-bold font-mono">{thermalScoreInput} / 100</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  step="1"
                  value={thermalScoreInput}
                  onChange={(e) => setThermalScoreInput(parseFloat(e.target.value))}
                  className="w-full accent-emerald-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Live Result Card */}
            <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 flex flex-col justify-between items-center text-center">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Composite Health Score</span>
                <div className="my-4 relative w-36 h-36 flex items-center justify-center">
                  <div className="w-full h-full rounded-full border-4 border-slate-800 border-t-cyan-400 border-r-orange-400 animate-spin-slow" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-white font-['Outfit']">{currentHealth.score}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">out of 100</span>
                  </div>
                </div>

                <div className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold border ${
                  currentHealth.status === 'EXCELLENT' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                  currentHealth.status === 'HEALTHY' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' :
                  currentHealth.status === 'MONITOR' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                  currentHealth.status === 'CONSULT' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' :
                  'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}>
                  STATUS: {currentHealth.status}
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-left">
                <p className="text-[11px] text-slate-400 uppercase font-bold flex items-center gap-1.5 mb-1">
                  <Sparkles size={12} className="text-cyan-400" /> AI Prescriptive Advisory:
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">{currentHealth.advisory}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: RANGE PREDICTION REGRESSION MODEL (P1) */}
      {/* ========================================================= */}
      {activeTab === 'RANGE_PREDICT' && (
        <div className="bg-[#0D1117] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
              <Gauge size={20} className="text-cyan-400" />
              Personalised Range Prediction Regression Engine (P1)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-variable regression factoring driver acceleration profiles, ambient temperature HVAC load, terrain incline, and payload.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
              {/* Battery SOC */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Current State of Charge (SOC)</span>
                  <span className="text-cyan-400 font-bold font-mono">{rangeSoc}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={rangeSoc}
                  onChange={(e) => setRangeSoc(parseInt(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Driver Profile */}
              <div>
                <span className="text-xs font-medium text-slate-300 block mb-2">Driver Profile (Historical Telematics)</span>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'ECO', label: 'Eco (+12% Range)', desc: 'Smooth regen, < 80 km/h' },
                    { id: 'NORMAL', label: 'Normal (1.0x)', desc: 'Balanced mixed city' },
                    { id: 'AGGRESSIVE', label: 'Aggressive (-25%)', desc: 'Frequent hard acceleration' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setRangeDriverProfile(p.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        rangeDriverProfile === p.id
                          ? 'bg-cyan-500/20 border-cyan-500/60 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <p className="text-xs font-bold">{p.label}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{p.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Weather Ambient Temp */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Ambient Temperature</span>
                  <span className="text-orange-400 font-bold font-mono">{rangeTemp}°C {rangeTemp > 35 ? '(AC Stress)' : ''}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="48"
                  value={rangeTemp}
                  onChange={(e) => setRangeTemp(parseInt(e.target.value))}
                  className="w-full accent-orange-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Terrain & Payload */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Terrain Gradient</label>
                  <select
                    value={rangeTerrain}
                    onChange={(e) => setRangeTerrain(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
                  >
                    <option value="FLAT">Flat City Expressway (1.0x)</option>
                    <option value="ROLLING">Rolling Suburbs (+8% load)</option>
                    <option value="HILLY">Ghats / Hilly Terrain (+24% load)</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Payload (Passengers + Cargo)</span>
                    <span className="text-cyan-400 font-bold font-mono">{rangePayload} kg</span>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="500"
                    step="10"
                    value={rangePayload}
                    onChange={(e) => setRangePayload(parseInt(e.target.value))}
                    className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer mt-2"
                  />
                </div>
              </div>

              {/* AC Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-semibold text-slate-300">HVAC Climate Control Active (8% draw)</span>
                <input
                  type="checkbox"
                  checked={rangeAcOn}
                  onChange={(e) => setRangeAcOn(e.target.checked)}
                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Range Output Card */}
            <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 flex flex-col justify-between items-center text-center">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dynamic Projected Range</span>
                <div className="my-6">
                  <span className="text-5xl font-black text-cyan-300 font-['Outfit']">{rangeResult.estKm}</span>
                  <span className="text-sm font-bold text-slate-400 ml-1.5">KM</span>
                  <p className="text-xs text-emerald-400 font-semibold mt-1">
                    Efficiency: {rangeResult.efficiency} km/kWh ({rangeResult.whKm} Wh/km)
                  </p>
                </div>
              </div>

              <div className="w-full space-y-2 text-left text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Usable Pack Energy:</span>
                  <span className="font-bold text-slate-200">{(40.5 * (rangeSoc / 100) * 0.95).toFixed(1)} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Driver Modifier:</span>
                  <span className="font-bold text-slate-200">{rangeDriverProfile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">HVAC Consumption:</span>
                  <span className="font-bold text-slate-200">{rangeAcOn ? 'Active (~1.2 kW)' : 'Off'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: DEGRADATION FORECASTING (WEIBULL) (P1) */}
      {/* ========================================================= */}
      {activeTab === 'DEGRADATION' && (
        <div className="bg-[#0D1117] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
              <TrendingUp size={20} className="text-orange-500" />
              Battery Degradation Forecasting &amp; Weibull Curve (P1)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Predicts replacement horizon to the OEM 70% warranty threshold with 95% confidence intervals and cost estimates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-bold">Horizon to 70% SOH</span>
              <p className="text-3xl font-black text-orange-400 font-['Outfit'] mt-1">{monthsToWarranty} Months</p>
              <p className="text-[11px] text-slate-500 mt-0.5">~{(monthsToWarranty / 12).toFixed(1)} Years of operational life</p>
            </div>
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-bold">Est. Pack Replacement Cost</span>
              <p className="text-3xl font-black text-white font-['Outfit'] mt-1">₹{estCostInr.toLocaleString('en-IN')}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Based on ₹8,500/kWh factory benchmark</p>
            </div>
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-bold">Confidence Interval</span>
              <p className="text-3xl font-black text-emerald-400 font-['Outfit'] mt-1">95% CI</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Weibull &beta;=2.15, &eta;=2850 cycles, R²=0.942</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-900/40 p-5 rounded-xl border border-slate-800">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Annual Fleet Usage</span>
                <span className="text-cyan-400 font-bold font-mono">{annualKm.toLocaleString('en-IN')} km/year</span>
              </div>
              <input
                type="range"
                min="10000"
                max="60000"
                step="2000"
                value={annualKm}
                onChange={(e) => setAnnualKm(parseInt(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">DC Fast Charge Utilization Ratio</span>
                <span className="text-orange-400 font-bold font-mono">{fastChargeRatio}% DC Fast</span>
              </div>
              <input
                type="range"
                min="5"
                max="90"
                step="5"
                value={fastChargeRatio}
                onChange={(e) => setFastChargeRatio(parseInt(e.target.value))}
                className="w-full accent-orange-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: CHARGING SESSION ANALYTICS (P1) */}
      {/* ========================================================= */}
      {activeTab === 'CHARGING_ANALYTICS' && (
        <div className="bg-[#0D1117] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
              <BatteryCharging size={20} className="text-purple-400" />
              Charging Session Analytics &amp; Time-Of-Use Optimization (P1)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Analyzes cost per kWh, session thermal charging efficiency, and optimal off-peak 1:00 AM – 5:00 AM dispatch windows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-bold">Current Tariff Rate</span>
              <p className="text-2xl font-black text-white font-['Outfit'] mt-1">₹{ratePerKwh.toFixed(2)} / kWh</p>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                isPeak ? 'bg-rose-500/20 text-rose-400' : (isOffPeak ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-400')
              }`}>
                {isPeak ? 'PEAK TARIFF (18-22h)' : (isOffPeak ? 'OFF-PEAK (22-06h)' : 'NORMAL DAY (06-18h)')}
              </span>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-bold">Session Cost</span>
              <p className="text-2xl font-black text-cyan-400 font-['Outfit'] mt-1">₹{sessionCost}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{chargingEnergy} kWh added</p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-bold">Off-Peak Potential Savings</span>
              <p className="text-2xl font-black text-emerald-400 font-['Outfit'] mt-1">₹{potentialSavings}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">If charged at ₹5.20/kWh</p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-bold">Thermal Efficiency</span>
              <p className="text-2xl font-black text-purple-400 font-['Outfit'] mt-1">{chargeEfficiency}%</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{chargingChargerType === 'DC_FAST' ? 'DC 50kW CCS2' : 'AC 7.2kW Slow'}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Session Start Hour (24-Hour Clock)</label>
              <input
                type="range"
                min="0"
                max="23"
                value={chargingStartHour}
                onChange={(e) => setChargingStartHour(parseInt(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <span className="text-xs text-slate-400 font-mono mt-1 block">{chargingStartHour}:00 Hours</span>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Energy Added (kWh)</label>
              <input
                type="number"
                value={chargingEnergy}
                onChange={(e) => setChargingEnergy(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Charger Type</label>
              <select
                value={chargingChargerType}
                onChange={(e) => setChargingChargerType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white"
              >
                <option value="DC_FAST">DC Fast Charger (CCS2 50kW-120kW)</option>
                <option value="AC_SLOW">AC Normal Slow Charger (Type-2 7.2kW)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: RANGE ANXIETY INTERVENTION (P0 MVP) */}
      {/* ========================================================= */}
      {activeTab === 'RANGE_ANXIETY' && (
        <div className="bg-[#0D1117] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
              <AlertTriangle size={20} className="text-rose-400" />
              Range Anxiety Automated Intervention Engine (P0 MVP)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Proactive WhatsApp message dispatch with 3 verified nearest fast-charging stations when SOH drops below 80% or SOC drops below 20%.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Trigger Simulation</h4>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Vehicle Registration</label>
                <input
                  type="text"
                  value={alertVehicleReg}
                  onChange={(e) => setAlertVehicleReg(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">On-Road Battery SOC</span>
                  <span className={`font-bold font-mono ${alertSoc < 20 ? 'text-rose-400' : 'text-cyan-400'}`}>{alertSoc}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={alertSoc}
                  onChange={(e) => setAlertSoc(parseInt(e.target.value))}
                  className="w-full accent-rose-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-slate-400">Intervention Rule:</span>
                <p className="text-slate-200 mt-1">
                  {alertSoc < 20 ? '⚠️ Trigger condition MET (SOC < 20%). Proactive routing active.' : 'Nominal state (> 20% SOC).'}
                </p>
              </div>

              <button
                onClick={() => {
                  setAlertSent(true);
                  setTimeout(() => setAlertSent(false), 4000);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Send size={14} />
                Dispatch WhatsApp Intervention to Driver
              </button>

              {alertSent && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 size={14} /> WhatsApp message sent via Meta Cloud API to +91-9840XXXXXX
                </div>
              )}
            </div>

            {/* WhatsApp Preview Card */}
            <div className="bg-[#0B141A] p-5 rounded-2xl border border-emerald-950/60 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80 text-emerald-400 text-xs font-bold">
                  <Sparkles size={14} /> AutoEra AI WhatsApp Business Assistant
                </div>

                <div className="mt-4 p-4 rounded-xl bg-[#202C33] text-slate-200 text-xs space-y-2.5 shadow-md">
                  <p className="font-bold text-white">⚠️ AutoEra EV Range Alert for {alertVehicleReg}</p>
                  <p>Your battery SoC is at <strong className="text-rose-400">{alertSoc}%</strong> (~32 km range left). Here are the 3 nearest fast-charging stations with live available ports:</p>
                  
                  <div className="space-y-2 pt-1">
                    <div className="p-2 rounded-lg bg-[#111B21] border border-slate-700">
                      <p className="font-bold text-cyan-300">1. Tata Power EZ Charge — Bandra Kurla Complex</p>
                      <p className="text-[11px] text-slate-400">CCS2 60kW DC Fast &bull; 2.4 km away &bull; 3 ports free &bull; ₹16.50/kWh</p>
                    </div>
                    <div className="p-2 rounded-lg bg-[#111B21] border border-slate-700">
                      <p className="font-bold text-cyan-300">2. Jio-bp pulse — BKC Fuel &amp; Charge Hub</p>
                      <p className="text-[11px] text-slate-400">CCS2 120kW Ultra Fast &bull; 3.8 km away &bull; 4 ports free &bull; ₹18.00/kWh</p>
                    </div>
                    <div className="p-2 rounded-lg bg-[#111B21] border border-slate-700">
                      <p className="font-bold text-cyan-300">3. Zeon Charging — Highway Hub</p>
                      <p className="text-[11px] text-slate-400">CCS2 50kW DC Fast &bull; 5.1 km away &bull; 2 ports free &bull; ₹17.00/kWh</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-emerald-400 pt-1">📍 Tap here to navigate via Google Maps</p>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 text-right mt-3">Delivered &bull; Read 19:42</div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: CELL IMBALANCE ANOMALY DETECTION (P2) */}
      {/* ========================================================= */}
      {activeTab === 'CELL_BALANCE' && (
        <div className="bg-[#0D1117] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
              <Cpu size={20} className="text-cyan-400" />
              Cell Imbalance &amp; Weak-Cell Anomaly Detection (P2)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Individual cell voltage monitoring across 96/108 series cells for early detection of weak or failing modules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-bold">Series String Cells</span>
              <p className="text-3xl font-black text-white font-['Outfit'] mt-1">96 Cells</p>
              <p className="text-[11px] text-slate-500 mt-0.5">24 Series Banks &times; 4 Parallel</p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-bold">Cell Voltage Delta (&Delta;V)</span>
              <p className={`text-3xl font-black font-['Outfit'] mt-1 ${getImbalanceSeverity(cellDeltaMv).color}`}>
                {cellDeltaMv} mV
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Threshold: 25 mV nominal</p>
            </div>

            <div className={`p-4 rounded-xl border ${getImbalanceSeverity(cellDeltaMv).bg}`}>
              <span className="text-xs uppercase font-bold text-slate-400">Anomaly Classification</span>
              <p className={`text-lg font-black mt-1 ${getImbalanceSeverity(cellDeltaMv).color}`}>
                {getImbalanceSeverity(cellDeltaMv).label}
              </p>
              <p className="text-[11px] text-slate-300 mt-1">{getImbalanceSeverity(cellDeltaMv).desc}</p>
            </div>
          </div>

          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Calibrate Cell Delta Tester</span>
              <span className="text-cyan-400 font-bold font-mono">{cellDeltaMv} mV</span>
            </div>
            <input
              type="range"
              min="5"
              max="110"
              value={cellDeltaMv}
              onChange={(e) => setCellDeltaMv(parseInt(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 7: THERMAL MANAGEMENT SAFETY (P1) */}
      {/* ========================================================= */}
      {activeTab === 'THERMAL' && (
        <div className="bg-[#0D1117] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
              <Flame size={20} className="text-orange-500" />
              Thermal Management &amp; Thermal Runaway Early Alert (P1)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Continuous temperature deviation monitoring during charge and discharge with automated current derate advisories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-bold">Max Cell Temperature</span>
              <p className={`text-3xl font-black font-['Outfit'] mt-1 ${getThermalStatus(packTempMax).color}`}>
                {packTempMax}°C
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Optimal zone: 20°C – 38°C</p>
            </div>

            <div className={`md:col-span-2 p-4 rounded-xl border ${getThermalStatus(packTempMax).bg}`}>
              <span className="text-xs uppercase font-bold text-slate-400">Thermal Engine Advisory</span>
              <p className={`text-base font-bold mt-1 ${getThermalStatus(packTempMax).color}`}>
                {getThermalStatus(packTempMax).label}
              </p>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                {getThermalStatus(packTempMax).action}
              </p>
            </div>
          </div>

          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Simulate Pack Temperature Sensor</span>
              <span className="text-orange-400 font-bold font-mono">{packTempMax}°C</span>
            </div>
            <input
              type="range"
              min="-5"
              max="55"
              value={packTempMax}
              onChange={(e) => setPackTempMax(parseInt(e.target.value))}
              className="w-full accent-orange-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 8: EV TOTAL COST OF OWNERSHIP (TCO) CALCULATOR (P1) */}
      {/* ========================================================= */}
      {activeTab === 'TCO_CALC' && (
        <div className="bg-[#0D1117] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
              <DollarSign size={20} className="text-emerald-400" />
              EV Total Cost of Ownership (TCO) Calculator vs. Diesel (P1)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Calculates per-kilometer operating costs (energy + maintenance + tyres) vs. diesel equivalent and projected 3-year commercial ROI.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-bold">EV Cost per KM</span>
              <p className="text-2xl font-black text-cyan-400 font-['Outfit'] mt-1">₹{evCostPerKm} / km</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Energy (7 km/kWh) + Maint</p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-bold">Diesel Cost per KM</span>
              <p className="text-2xl font-black text-slate-300 font-['Outfit'] mt-1">₹{dieselCostPerKm} / km</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Fuel (13.5 km/L) + Maint</p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-bold">3-Year Fleet Savings</span>
              <p className="text-2xl font-black text-emerald-400 font-['Outfit'] mt-1">₹{threeYearSavings.toLocaleString('en-IN')}</p>
              <p className="text-[11px] text-emerald-400/80 mt-0.5">Net cash savings</p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-bold">CO2 Emissions Averted</span>
              <p className="text-2xl font-black text-teal-300 font-['Outfit'] mt-1">{co2AvertedKg.toLocaleString('en-IN')} kg</p>
              <p className="text-[11px] text-slate-500 mt-0.5">142g CO2/km avoided</p>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Annual Travel Distance</span>
                <span className="text-cyan-400 font-bold font-mono">{tcoAnnualKm.toLocaleString('en-IN')} km</span>
              </div>
              <input
                type="range"
                min="10000"
                max="80000"
                step="5000"
                value={tcoAnnualKm}
                onChange={(e) => setTcoAnnualKm(parseInt(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Electricity Tariff (₹/kWh)</label>
                <input
                  type="number"
                  step="0.5"
                  value={tcoElecCost}
                  onChange={(e) => setTcoElecCost(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Diesel Retail Price (₹/L)</label>
                <input
                  type="number"
                  step="0.5"
                  value={tcoDieselCost}
                  onChange={(e) => setTcoDieselCost(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 9: BATTERY REPLACEMENT PLANNING & BOOKING (P1) */}
      {/* ========================================================= */}
      {activeTab === 'REPLACEMENT' && (
        <div className="bg-[#0D1117] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
              <Wrench size={20} className="text-orange-500" />
              Battery Replacement Planning &amp; Workshop Booking (P1)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated trigger at SOH &le; 70% threshold presenting 4 structured replacement options and digital job card creation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {replacementOptions.map((opt) => {
              const isSelected = selectedReplacementOption === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedReplacementOption(opt.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-orange-500/10 border-orange-500/60 shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-white">{opt.title}</h4>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {opt.badge}
                      </span>
                    </div>
                    <div className="mt-2.5 space-y-1 text-xs text-slate-300">
                      <p><span className="text-slate-500">SOH Guarantee:</span> {opt.sohGuarantee}</p>
                      <p><span className="text-slate-500">Warranty:</span> {opt.warranty}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between items-center">
                    <span className="text-lg font-black text-white font-['Outfit']">{opt.costInr}</span>
                    <button className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                      isSelected ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {isSelected ? 'Selected' : 'Choose'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-xs font-bold text-white">Proceed with Replacement Option</p>
              <p className="text-xs text-slate-400 mt-0.5">Creates workshop digital job card with parts pre-reservation &amp; technician allocation</p>
            </div>

            <button
              onClick={handleBookWorkshop}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-bold text-xs shadow-lg transition-all"
            >
              Book Workshop Replacement Job Card &rarr;
            </button>
          </div>

          {bookedJobCard && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>Job Card Created: <strong className="text-white font-mono">{bookedJobCard}</strong> (Bay: High-Voltage EV Bay #2)</span>
              </div>
              <span className="text-emerald-300 text-[11px] underline cursor-pointer">View in Service Module &rarr;</span>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 10: OEM BMS API INTEGRATION (P2) */}
      {/* ========================================================= */}
      {activeTab === 'OEM_BMS' && (
        <div className="bg-[#0D1117] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
              <Radio size={20} className="text-cyan-400" />
              OEM BMS API Integration Connectors (P2)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Mutual TLS (mTLS) authenticated pipelines connecting directly to manufacturer cloud endpoints for live telemetry verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {oemConnectors.map((c, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-white">{c.name}</h4>
                    <p className="text-[11px] text-slate-400">{c.model}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {c.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                  <div>
                    <span className="text-slate-500">Security:</span>
                    <p className="text-slate-200 font-mono">{c.protocol}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Firmware:</span>
                    <p className="text-cyan-400 font-mono">{c.fw}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span>Latency: <strong className="text-slate-300">{c.ping}</strong></span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <ShieldCheck size={11} /> Cryptographically Signed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

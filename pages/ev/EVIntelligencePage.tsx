import React, { useState } from 'react';
import { 
  Zap, Battery, BatteryCharging, AlertTriangle, ShieldCheck, 
  TrendingUp, RefreshCw, Gauge, Cpu, CheckCircle2, ChevronRight,
  Activity, ArrowUpRight, Flame, MapPin, Sparkles, Filter
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import { Section10EVWorkspace } from '../../components/ev/Section10EVWorkspace';

interface EVBatteryMetric {
  vehicleId: string;
  model: string;
  plateNumber: string;
  customerOrFleet: string;
  sohPct: number; // 0-100
  socPct: number; // Current charge %
  cellDeltaMv: number; // Delta between min and max cell in mV
  packTempC: number; // Celsius
  chargeCycles: number;
  estRangeKm: number;
  healthScore: number; // Composite score
  status: 'EXCELLENT' | 'HEALTHY' | 'MONITOR' | 'CONSULT' | 'URGENT';
  bmsFirmware: string;
  lastSync: string;
}

// Exact Section 10 Formula: SOH 40% + Fade 30% + Balance 20% + Thermal 10%
const calculateCompositeScore = (
  sohPct: number, 
  fadeRate90d: number, 
  cellDeltaMv: number, 
  packTempC: number
): { score: number; status: 'EXCELLENT' | 'HEALTHY' | 'MONITOR' | 'CONSULT' | 'URGENT' } => {
  const sohScore = sohPct;
  const fadeScore = Math.max(0, (1 - fadeRate90d) * 100);
  const balanceScore = Math.max(0, 100 - (cellDeltaMv * 1.5));
  const thermalScore = packTempC >= 20 && packTempC <= 38 ? 100 : Math.max(0, 100 - Math.abs(packTempC - 30) * 4);

  const rawScore = (sohScore * 0.40) + (fadeScore * 0.30) + (balanceScore * 0.20) + (thermalScore * 0.10);
  const score = Math.round(rawScore * 10) / 10;

  let status: 'EXCELLENT' | 'HEALTHY' | 'MONITOR' | 'CONSULT' | 'URGENT' = 'URGENT';
  if (score >= 90) status = 'EXCELLENT';
  else if (score >= 80) status = 'HEALTHY';
  else if (score >= 70) status = 'MONITOR';
  else if (score >= 60) status = 'CONSULT';

  return { score, status };
};

const initialEVFleet: EVBatteryMetric[] = [
  {
    vehicleId: 'EV-TN-01',
    model: 'Tata Nexon EV Max',
    plateNumber: 'TN-09-EV-8421',
    customerOrFleet: 'Apex Fleet South',
    sohPct: 96.2,
    socPct: 82,
    cellDeltaMv: 12,
    packTempC: 28,
    chargeCycles: 142,
    estRangeKm: 348,
    healthScore: 94.6,
    status: 'EXCELLENT',
    bmsFirmware: 'v4.12-OTA',
    lastSync: '2 min ago'
  },
  {
    vehicleId: 'EV-TN-02',
    model: 'Mahindra XUV400 EL Pro',
    plateNumber: 'TN-07-EV-1904',
    customerOrFleet: 'Rajesh S. (Retail VIP)',
    sohPct: 91.5,
    socPct: 65,
    cellDeltaMv: 18,
    packTempC: 31,
    chargeCycles: 210,
    estRangeKm: 285,
    healthScore: 89.2,
    status: 'HEALTHY',
    bmsFirmware: 'v3.8-OEM',
    lastSync: '6 min ago'
  },
  {
    vehicleId: 'EV-TN-03',
    model: 'MG ZS EV Excite',
    plateNumber: 'TN-14-EV-6091',
    customerOrFleet: 'City Express Mobility',
    sohPct: 78.4,
    socPct: 34,
    cellDeltaMv: 38,
    packTempC: 36,
    chargeCycles: 580,
    estRangeKm: 204,
    healthScore: 74.8,
    status: 'MONITOR',
    bmsFirmware: 'v2.9-OEM',
    lastSync: '12 min ago'
  },
  {
    vehicleId: 'EV-TN-04',
    model: 'Tata Ace EV Cargo',
    plateNumber: 'TN-02-EV-4412',
    customerOrFleet: 'OMR Logistics Hub',
    sohPct: 88.0,
    socPct: 94,
    cellDeltaMv: 21,
    packTempC: 29,
    chargeCycles: 320,
    estRangeKm: 122,
    healthScore: 86.4,
    status: 'HEALTHY',
    bmsFirmware: 'v4.0-OTA',
    lastSync: '1 min ago'
  },
  {
    vehicleId: 'EV-TN-05',
    model: 'Hyundai Ioniq 5 AWD',
    plateNumber: 'TN-22-EV-9999',
    customerOrFleet: 'Karthik Narayanan (Executive)',
    sohPct: 98.4,
    socPct: 78,
    cellDeltaMv: 8,
    packTempC: 26,
    chargeCycles: 64,
    estRangeKm: 462,
    healthScore: 97.2,
    status: 'EXCELLENT',
    bmsFirmware: 'v5.1-ULTRA',
    lastSync: 'Just now'
  },
  {
    vehicleId: 'EV-TN-06',
    model: 'BYD Atto 3 Superior',
    plateNumber: 'TN-10-EV-3318',
    customerOrFleet: 'Kaveri Transport Corp',
    sohPct: 69.5,
    socPct: 19,
    cellDeltaMv: 52,
    packTempC: 41,
    chargeCycles: 790,
    estRangeKm: 145,
    healthScore: 64.1,
    status: 'CONSULT',
    bmsFirmware: 'v2.1-OEM',
    lastSync: '18 min ago'
  }
];

// 96-Cell Voltage simulation for deep telemetry view
const generateCellVoltages = (baseV: number, deltaMv: number) => {
  return Array.from({ length: 24 }, (_, i) => ({
    cellGroup: `Bank ${i + 1}`,
    voltage: (baseV + (Math.sin(i * 1.5) * (deltaMv / 2000))).toFixed(3),
    temp: (27 + (i % 5)).toFixed(1)
  }));
};

// SOH Degradation vs Distance Projection Curve
const degradationData = [
  { km: '0k', actual: 100, projected: 100, warrantyFloor: 70 },
  { km: '25k', actual: 98.2, projected: 98.0, warrantyFloor: 70 },
  { km: '50k', actual: 95.8, projected: 95.5, warrantyFloor: 70 },
  { km: '75k', actual: 93.1, projected: 92.8, warrantyFloor: 70 },
  { km: '100k', actual: 90.4, projected: 89.9, warrantyFloor: 70 },
  { km: '125k', actual: null, projected: 86.8, warrantyFloor: 70 },
  { km: '150k', actual: null, projected: 83.2, warrantyFloor: 70 },
];

const EVIntelligencePage: React.FC = () => {
  const [vehicles] = useState<EVBatteryMetric[]>(initialEVFleet);
  const [selectedVehicle, setSelectedVehicle] = useState<EVBatteryMetric>(initialEVFleet[0]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredVehicles = filterStatus === 'ALL' 
    ? vehicles 
    : vehicles.filter(v => v.status === filterStatus);

  const cellVoltages = generateCellVoltages(3.78, selectedVehicle.cellDeltaMv);

  const getStatusBadge = (status: EVBatteryMetric['status']) => {
    switch (status) {
      case 'EXCELLENT':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'HEALTHY':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'MONITOR':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'CONSULT':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'URGENT':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Platform Title Banner (Tesla Dark Aesthetic) */}
      <div className="bg-[#0D1117] border border-slate-800/90 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/10 via-orange-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Zap size={13} className="text-cyan-400" />
              Section 10 &bull; Master Architecture 2026
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit'] flex items-center gap-3">
              EV Intelligence &amp; Battery Telemetry Platform
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl">
              Daily State of Health (SOH) composite scoring, thermal runaway early warning, cell balance analytics &amp; range degradation forecasting across dealership &amp; fleet EV inventory.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs font-semibold transition-all flex items-center gap-2">
              <RefreshCw size={13} className="text-cyan-400 animate-spin-slow" />
              Sync BMS Telemetry
            </button>
            <div className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/40 text-orange-300 text-xs font-bold">
              Formula: SOH(40%) + Fade(30%) + &Delta;V(20%) + Temp(10%)
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0D1117] border border-slate-800/80 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Fleet SOH Average</span>
            <Battery className="text-emerald-400" size={18} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-['Outfit']">91.4%</span>
            <span className="text-xs text-emerald-400 font-bold flex items-center">
              <TrendingUp size={12} className="mr-0.5" /> +0.4% MoM
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">24 Active EV units monitored</p>
        </div>

        <div className="bg-[#0D1117] border border-slate-800/80 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Avg Cell Imbalance (&Delta;V)</span>
            <Cpu className="text-cyan-400" size={18} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-cyan-300 font-['Outfit']">18.2 mV</span>
            <span className="text-xs text-cyan-400 font-semibold">Normal &lt; 30mV</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">1 unit in caution state</p>
        </div>

        <div className="bg-[#0D1117] border border-slate-800/80 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Thermal Runaway Risk</span>
            <Flame className="text-orange-400" size={18} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400 font-['Outfit']">0 Active</span>
            <span className="text-xs text-emerald-400 font-semibold">Pack &lt; 42°C</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Real-time gradient monitor</p>
        </div>

        <div className="bg-[#0D1117] border border-slate-800/80 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Fast Charge Efficiency</span>
            <BatteryCharging className="text-purple-400" size={18} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-['Outfit']">94.8%</span>
            <span className="text-xs text-purple-400 font-semibold">50kW DC Depot</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">₹3.4/km vs ₹8.9/km Diesel</p>
        </div>
      </div>

      {/* Main Telemetry Cockpit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: EV Roster & Telemetry Data Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#0D1117] border border-slate-800/90 rounded-xl p-5 shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
                  <Activity size={17} className="text-cyan-400" />
                  Live EV Battery Telemetry Grid
                </h3>
                <p className="text-xs text-slate-400">Select any vehicle to inspect 96-cell delta, degradation, and thermal status</p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
                {['ALL', 'EXCELLENT', 'HEALTHY', 'MONITOR', 'CONSULT'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                      filterStatus === st
                        ? 'bg-orange-500 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle List */}
            <div className="divide-y divide-slate-800/80 mt-2 overflow-x-auto">
              {filteredVehicles.map((v) => {
                const isSelected = selectedVehicle.vehicleId === v.vehicleId;
                return (
                  <div
                    key={v.vehicleId}
                    onClick={() => setSelectedVehicle(v)}
                    className={`p-3.5 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-4 my-1.5 ${
                      isSelected
                        ? 'bg-slate-800/80 border border-orange-500/40 shadow-md'
                        : 'hover:bg-slate-900/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-[200px]">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold border ${getStatusBadge(v.status)}`}>
                        <Zap size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{v.model}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${getStatusBadge(v.status)}`}>
                            {v.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">
                          {v.plateNumber} &bull; <span className="text-slate-500">{v.customerOrFleet}</span>
                        </p>
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-6 text-xs">
                      <div>
                        <p className="text-slate-400 text-[10px] uppercase font-bold">Charge (SOC)</p>
                        <p className="font-bold text-white">{v.socPct}%</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[10px] uppercase font-bold">Health (SOH)</p>
                        <p className="font-bold text-cyan-400">{v.sohPct}%</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[10px] uppercase font-bold">Cell &Delta;V</p>
                        <p className={`font-mono font-bold ${v.cellDeltaMv > 30 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {v.cellDeltaMv} mV
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[10px] uppercase font-bold">Pack Temp</p>
                        <p className={`font-bold ${v.packTempC > 38 ? 'text-amber-400' : 'text-slate-200'}`}>
                          {v.packTempC}°C
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-black text-white font-['Outfit']">{v.healthScore}</p>
                        <p className="text-[10px] text-slate-400">Score / 100</p>
                      </div>
                      <ChevronRight size={16} className={`text-slate-400 transition-transform ${isSelected ? 'rotate-90 text-orange-400' : ''}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SOH Degradation vs Warranty Floor Chart */}
          <div className="bg-[#0D1117] border border-slate-800/90 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-white font-['Outfit'] flex items-center gap-2">
                  <TrendingUp size={16} className="text-orange-500" />
                  Battery Degradation Curve vs. OEM 70% Warranty Floor
                </h4>
                <p className="text-xs text-slate-400">Projected Weibull distribution over 150,000 km lifecycle</p>
              </div>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full font-semibold">
                Within Warranty Margin
              </span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={degradationData}>
                  <defs>
                    <linearGradient id="sohGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00C8F0" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#00C8F0" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="km" stroke="#64748B" tick={{ fontSize: 11 }} />
                  <YAxis domain={[60, 105]} stroke="#64748B" tick={{ fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="actual" stroke="#00C8F0" strokeWidth={2.5} fill="url(#sohGrad)" name="Actual SOH %" />
                  <Area type="monotone" dataKey="projected" stroke="#F5C842" strokeWidth={2} strokeDasharray="4 4" fill="none" name="Projected SOH %" />
                  <Area type="monotone" dataKey="warrantyFloor" stroke="#FF3B5C" strokeWidth={1.5} fill="none" name="Warranty Floor (70%)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Col: Deep Diagnostic Telemetry of Selected Vehicle */}
        <div className="space-y-4">
          <div className="bg-[#0D1117] border border-slate-800/90 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} />
                Selected EV Telemetry
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(selectedVehicle.status)}`}>
                {selectedVehicle.status}
              </span>
            </div>

            <div className="mt-4 text-center pb-4 border-b border-slate-800">
              <h3 className="text-lg font-black text-white font-['Outfit']">{selectedVehicle.model}</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedVehicle.plateNumber}</p>
              
              <div className="mt-4 flex items-center justify-center">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <div className="w-full h-full rounded-full border-4 border-slate-800 border-t-cyan-400 border-r-orange-500 animate-spin-slow" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-white font-['Outfit']">{selectedVehicle.healthScore}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Health Score</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Diagnostic Parameters Grid */}
            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Battery SOH</p>
                <p className="text-base font-bold text-white">{selectedVehicle.sohPct}%</p>
                <p className="text-[10px] text-emerald-400 mt-0.5">Nominal degradation</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Current SOC</p>
                <p className="text-base font-bold text-white">{selectedVehicle.socPct}%</p>
                <p className="text-[10px] text-cyan-400 mt-0.5">Est. {selectedVehicle.estRangeKm} km left</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Cell &Delta;V Delta</p>
                <p className={`text-base font-bold font-mono ${selectedVehicle.cellDeltaMv > 30 ? 'text-rose-400' : 'text-cyan-400'}`}>
                  {selectedVehicle.cellDeltaMv} mV
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Threshold: 30mV</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Charge Cycles</p>
                <p className="text-base font-bold text-white">{selectedVehicle.chargeCycles}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">LFP Rating: 2,500</p>
              </div>
            </div>

            {/* 24 Cell Bank Voltage Bar Visualizer */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-white">Cell Bank Voltage Uniformity (24 Banks)</p>
                <span className="text-[10px] text-slate-400 font-mono">3.78V Base</span>
              </div>
              <div className="h-28 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cellVoltages}>
                    <Bar dataKey="voltage" fill="#00C8F0" radius={[2, 2, 0, 0]}>
                      {cellVoltages.map((_, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={index % 6 === 0 && selectedVehicle.cellDeltaMv > 30 ? '#FF3B5C' : '#00C8F0'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Range Anxiety & Smart Advisory Alert */}
            {selectedVehicle.sohPct < 80 ? (
              <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="text-rose-400 shrink-0 mt-0.5" size={16} />
                  <div>
                    <h5 className="text-xs font-bold text-rose-300">Range Anxiety Intervention Active</h5>
                    <p className="text-[11px] text-slate-300 mt-1">
                      SOH is below 80% threshold. Automated WhatsApp advisory dispatched with route guidance to nearest DC fast charger.
                    </p>
                    <button className="mt-2 text-[11px] text-rose-300 font-bold underline hover:text-rose-200">
                      Schedule High-Voltage Bay Inspection &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="text-cyan-400 shrink-0 mt-0.5" size={16} />
                  <div>
                    <h5 className="text-xs font-bold text-cyan-300">Optimal BMS Operation</h5>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Cell balancing routine executed 2:00 AM. Fast charge degradation index well within OEM specification.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
              <span>BMS FW: {selectedVehicle.bmsFirmware}</span>
              <span className="text-cyan-400 font-mono">Synced {selectedVehicle.lastSync}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Section 10 EV Intelligence Deep Capabilities Suite */}
      <Section10EVWorkspace />
    </div>
  );
};

export default EVIntelligencePage;


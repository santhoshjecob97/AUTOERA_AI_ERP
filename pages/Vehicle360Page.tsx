import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { 
  Car, BatteryCharging, Wrench, ShieldAlert, 
  TrendingUp, CheckCircle2, AlertCircle, ArrowLeft,
  Sparkles, Zap, Clock, ShieldCheck, Download
} from 'lucide-react';

export const Vehicle360Page: React.FC = () => {
  const { vin } = useParams<{ vin?: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'repairs' | 'battery' | 'predictions' | 'valuation' | 'recalls'>('repairs');
  const [estimateSuccess, setEstimateSuccess] = useState<string | null>(null);

  const vehicleVin = vin || 'VIN9988HY001';

  const defaultMockVehicle = {
    vin: vehicleVin,
    reg: 'KA-01-MJ-9988',
    make: 'Hyundai',
    model: 'Creta 1.5 SX(O) Turbo DCT',
    year: 2023,
    color: 'Abyss Black Pearl',
    fuel: 'Petrol Turbo',
    transmission: '7-Speed Dual Clutch (DCT)',
    odometer: 24500,
    owner: 'Rajesh Kumar (VIP Platinum)',
    ownerId: 'cust-apex-001',
    deliveryDate: '15 March 2023',
    warrantyExpiry: '14 March 2026 (Valid)',
    insuranceStatus: 'HDFC ERGO Active',
    overallHealth: 92,
    evBattery: {
      isEV: true,
      soh: 96.4,
      capacityKwh: '72.6 kWh',
      cellChemistry: 'LFP (Lithium Iron Phosphate)',
      estimatedRangeKm: 420,
      chargingCycles: 142,
      fastChargeRatioPct: 24,
      cellMaxDeltaMv: 12,
      packTempC: 27.5,
      predictedRulYears: 7.4
    }
  };

  const [currentVehicle, setCurrentVehicle] = useState(defaultMockVehicle);
  const [vehicleOptions, setVehicleOptions] = useState<Array<{ id: string; vin: string; reg: string; model: string }>>([]);

  useEffect(() => {
    // 1. Fetch live vehicle fleet from backend
    apiService.get<any[]>('/api/v1/vehicles/')
      .then(res => {
        if (Array.isArray(res) && res.length > 0) {
          const mapped = res.map(v => ({
            id: v.id,
            vin: v.vin,
            reg: v.registration_number || 'N/A',
            model: `${v.make || ''} ${v.model || ''}`.trim() || 'Vehicle'
          }));
          setVehicleOptions(mapped);
        }
      })
      .catch(err => console.warn('Could not fetch vehicle fleet:', err));
  }, []);

  useEffect(() => {
    if (!vin || vin === 'VIN9988HY001') return;

    // Find vehicle by vin
    const match = vehicleOptions.find(vo => vo.vin === vin);
    const targetId = match ? match.id : vin;

    apiService.get<any>(`/api/v1/vehicles/${targetId}/360/`)
      .then(data => {
        if (data && data.vin) {
          setCurrentVehicle({
            vin: data.vin,
            reg: data.registration_number || 'REG-PENDING',
            make: data.make || 'Hyundai',
            model: `${data.model || ''} ${data.variant || ''}`.trim() || 'Vehicle',
            year: data.year || 2024,
            color: data.color || 'Polar White',
            fuel: data.fuel_type || 'Electric',
            transmission: data.transmission_type || 'Automatic',
            odometer: data.odometer_reading || 12000,
            owner: data.owner ? `${data.owner.first_name} ${data.owner.last_name}` : 'Registered Owner',
            ownerId: data.owner?.id || 'cust-apex-001',
            deliveryDate: '10 Jan 2024',
            warrantyExpiry: '09 Jan 2027 (Valid)',
            insuranceStatus: 'Active Comprehensive',
            overallHealth: 94,
            evBattery: {
              isEV: data.fuel_type?.toUpperCase().includes('EV') || data.fuel_type?.toUpperCase().includes('ELECTRIC') || true,
              soh: 97.2,
              capacityKwh: '72.6 kWh',
              cellChemistry: 'LFP',
              estimatedRangeKm: 440,
              chargingCycles: 98,
              fastChargeRatioPct: 18,
              cellMaxDeltaMv: 10,
              packTempC: 26.8,
              predictedRulYears: 8.2
            }
          });
        }
      })
      .catch(err => console.warn('Using default vehicle mock:', err));
  }, [vin, vehicleOptions]);

  const handleGenerateEstimate = () => {
    setEstimateSuccess("Pre-service estimate generated with OEM labor times and genuine parts pricing (RO #EST-8819).");
    setTimeout(() => setEstimateSuccess(null), 5000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Dealership Fleet / Customer</span>
        </button>
        <span className="text-xs font-mono text-slate-400">Digital VIN Passport System</span>
      </div>

      {/* Vehicle Fleet Selector */}
      {vehicleOptions.length > 0 && (
        <div className="flex items-center justify-between bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-2">
            <Car size={14} className="text-blue-500" />
            Inspect Registered Vehicle Passport:
          </span>
          <select
            value={currentVehicle.vin}
            onChange={(e) => navigate(`/vehicle-360/${e.target.value}`)}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-lg px-3 py-1.5 outline-none cursor-pointer"
          >
            <option value="VIN9988HY001">KA-01-MJ-9988 &bull; Hyundai Creta 1.5 DCT (Demo)</option>
            {vehicleOptions.map(vo => (
              <option key={vo.id} value={vo.vin}>
                {vo.reg} &bull; {vo.model} (VIN: {vo.vin})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Vehicle Identity Header Banner */}
      <div className="bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-blue-600/20">
              <Car size={32} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-['Outfit']">
                  {currentVehicle.make} {currentVehicle.model}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                  {currentVehicle.reg}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 size={12} /> Clean Title
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">VIN: {currentVehicle.vin}</span>
                <span>{currentVehicle.year} • {currentVehicle.color} • {currentVehicle.transmission}</span>
                <span>Owner: <strong 
                  onClick={() => navigate('/customer-360')}
                  className="text-orange-500 hover:underline cursor-pointer"
                >{currentVehicle.owner}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleGenerateEstimate}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all active:scale-[0.98]"
            >
              <Sparkles size={14} />
              <span>Generate AI Estimate</span>
            </button>
            <button className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-white transition-colors" title="Download Digital Passport PDF">
              <Download size={16} />
            </button>
          </div>
        </div>

        {estimateSuccess && (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center justify-between animate-fade-in">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} /> {estimateSuccess}
            </span>
            <button onClick={() => setEstimateSuccess(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Quick Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80">
          <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Current Odometer</span>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{currentVehicle.odometer.toLocaleString()} km</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">AI Health Score</span>
            <p className="text-lg font-bold text-emerald-500 mt-0.5">{currentVehicle.overallHealth} / 100</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">OEM Warranty</span>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5 text-xs truncate">{currentVehicle.warrantyExpiry}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Trade-in Equity</span>
            <p className="text-lg font-bold text-blue-500 mt-0.5">₹ 14,80,000</p>
          </div>
        </div>
      </div>

      {/* EV Intelligence Highlights Card */}
      {currentVehicle.evBattery.isEV && (
        <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 rounded-2xl p-5">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-500">
              <Zap size={20} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  EV Battery Health (SOH) & High-Voltage Telemetry
                </span>
                <span className="text-xs font-bold text-emerald-500">{currentVehicle.evBattery.soh}% SOH</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400">Pack Capacity</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{currentVehicle.evBattery.capacityKwh}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Real-World Range</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{currentVehicle.evBattery.estimatedRangeKm} km</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Cell Imbalance</span>
                  <p className="font-semibold text-emerald-500">{currentVehicle.evBattery.cellMaxDeltaMv} mV (Normal)</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Remaining Useful Life</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{currentVehicle.evBattery.predictedRulYears} Years</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Passport Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-px">
        {[
          { id: 'repairs', label: 'Repairs & Service Orders', icon: Wrench },
          { id: 'battery', label: 'BMS & EV Telemetry', icon: BatteryCharging },
          { id: 'predictions', label: 'Predictive Component Health', icon: AlertCircle },
          { id: 'valuation', label: 'Trade-In & Resale Valuation', icon: TrendingUp },
          { id: 'recalls', label: 'OEM Safety Recalls', icon: ShieldCheck }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'border-orange-500 text-orange-600 dark:text-orange-400 bg-orange-500/5'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === 'repairs' && (
        <div className="bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Service History & Repair Orders</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  COMPLETED
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">Job Card #JC-2026-001 (20,000 km Service)</h4>
                <p className="text-xs text-slate-400">Replaced Front Brake Pads (HY-BRK-PAD-F) & Fully Synthetic Oil • Total: ₹ 4,550.00</p>
                <p className="text-[11px] text-slate-500 mt-1">Technician: Suresh Babu • Bay: Bay 1 (Express)</p>
              </div>
              <span className="text-xs font-mono text-slate-400">10 Sep 2026</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  COMPLETED
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">Job Card #JC-2025-0842 (10,000 km 1st Periodic)</h4>
                <p className="text-xs text-slate-400">Engine Oil Filter Cartridge & 32-Point Quality Check • Total: ₹ 2,100.00</p>
                <p className="text-[11px] text-slate-500 mt-1">Technician: Manoj Nair • Bay: Bay 2</p>
              </div>
              <span className="text-xs font-mono text-slate-400">14 Nov 2025</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'battery' && (
        <div className="bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">BMS Telemetry & Degradation Analytics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">DC Fast Charge Ratio</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{mockVehicle.evBattery.fastChargeRatioPct}%</p>
              <p className="text-[11px] text-slate-400 mt-1">Healthy battery preservation practice</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Pack Temperature</span>
              <p className="text-xl font-bold text-emerald-500 mt-1">{mockVehicle.evBattery.packTempC}°C</p>
              <p className="text-[11px] text-slate-400 mt-1">Liquid cooling operating at peak efficiency</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Charge Cycles</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{mockVehicle.evBattery.chargingCycles}</p>
              <p className="text-[11px] text-slate-400 mt-1">Rated for 2,500+ full cycles</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'predictions' && (
        <div className="bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Component Wear & Predictive Failure Modeling</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Front Brake Pads</h4>
                <p className="text-xs text-slate-400">Replaced recently on 10 Sep 2026. Remaining useful life: ~38,000 km.</p>
              </div>
              <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-500/10 text-emerald-500">
                Health: 98%
              </span>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">12V Auxiliary Starter Battery</h4>
                <p className="text-xs text-slate-400">Terminal voltage stable at 12.6V. Recommended replacement in 11 months.</p>
              </div>
              <span className="px-2.5 py-1 rounded text-xs font-bold bg-amber-500/10 text-amber-500">
                Health: 78%
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'valuation' && (
        <div className="bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Trade-in Equity & Market Resale Estimate</h3>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-blue-500">CURRENT MARKET VALUATION</span>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">₹ 14,80,000 - ₹ 15,40,000</p>
              <p className="text-xs text-slate-400 mt-1">Based on Bangalore regional dealer network sales data for 2023 Creta Turbo</p>
            </div>
            <button 
              onClick={() => navigate('/sales/desking')}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all"
            >
              Structure Trade-in Deal
            </button>
          </div>
        </div>
      )}

      {activeTab === 'recalls' && (
        <div className="bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">OEM Safety Bulletins & Campaign Verification</h3>
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-500" />
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Zero Pending OEM Safety Recalls</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">All mandatory service bulletins and ECU calibrations are verified up to date.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vehicle360Page;

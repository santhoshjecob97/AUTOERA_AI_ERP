import React, { useState } from 'react';
import {
  Building2,
  TrendingUp,
  AlertTriangle,
  Zap,
  Package,
  Layers,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  Search,
  CheckCircle2,
  Clock,
  Activity,
  Server,
  Share2,
  BarChart3,
  Cpu,
  RefreshCw,
  Eye,
  FileSpreadsheet
} from 'lucide-react';

interface DealershipBenchmark {
  id: string;
  name: string;
  city: string;
  region: string;
  salesTarget: number;
  salesActual: number;
  serviceNPS: number;
  avgTurnaroundHours: number;
  warrantyClaimRate: number;
  complianceScore: number;
  status: 'TOP_PERFORMER' | 'ON_TRACK' | 'ATTENTION_NEEDED';
}

interface WarrantyDefectCluster {
  dtcCode: string;
  title: string;
  subsystem: string;
  affectedCount: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  trend: '+18%' | '+4%' | '-12%';
  supplierLiability: string;
  recommendedAction: string;
  supplierBatch: string;
}

interface SupplyChainPart {
  partNumber: string;
  name: string;
  centralStock: number;
  dealerDemand: number;
  fillRate: number;
  leadTimeDays: number;
  status: 'OPTIMAL' | 'LOW_STOCK' | 'CRITICAL_BACKORDER';
}

export const OEMDashboardPage: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [selectedModel, setSelectedModel] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'benchmarks' | 'warranty' | 'ev-fleet' | 'supply-chain'>('benchmarks');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const dealerships: DealershipBenchmark[] = [
    {
      id: 'D-CHN-01',
      name: 'Apex Motors - Guindy HQ',
      city: 'Chennai',
      region: 'South',
      salesTarget: 240,
      salesActual: 268,
      serviceNPS: 92,
      avgTurnaroundHours: 3.8,
      warrantyClaimRate: 2.1,
      complianceScore: 98,
      status: 'TOP_PERFORMER'
    },
    {
      id: 'D-BLR-02',
      name: 'Apex Mobility - Whitefield',
      city: 'Bengaluru',
      region: 'South',
      salesTarget: 310,
      salesActual: 325,
      serviceNPS: 89,
      avgTurnaroundHours: 4.1,
      warrantyClaimRate: 2.8,
      complianceScore: 95,
      status: 'TOP_PERFORMER'
    },
    {
      id: 'D-CBE-03',
      name: 'Apex Auto - Avinashi Road',
      city: 'Coimbatore',
      region: 'South',
      salesTarget: 180,
      salesActual: 162,
      serviceNPS: 81,
      avgTurnaroundHours: 5.2,
      warrantyClaimRate: 4.5,
      complianceScore: 88,
      status: 'ON_TRACK'
    },
    {
      id: 'D-MUM-04',
      name: 'Western Autoera - Andheri',
      city: 'Mumbai',
      region: 'West',
      salesTarget: 290,
      salesActual: 245,
      serviceNPS: 76,
      avgTurnaroundHours: 6.4,
      warrantyClaimRate: 6.2,
      complianceScore: 82,
      status: 'ATTENTION_NEEDED'
    },
    {
      id: 'D-DEL-05',
      name: 'Northern Star Dealership',
      city: 'Delhi NCR',
      region: 'North',
      salesTarget: 340,
      salesActual: 355,
      serviceNPS: 88,
      avgTurnaroundHours: 4.0,
      warrantyClaimRate: 3.1,
      complianceScore: 94,
      status: 'TOP_PERFORMER'
    }
  ];

  const defectClusters: WarrantyDefectCluster[] = [
    {
      dtcCode: 'P0300',
      title: 'Random/Multiple Cylinder Misfire Detected',
      subsystem: 'Powertrain / Fuel Delivery',
      affectedCount: 142,
      severity: 'CRITICAL',
      trend: '+18%',
      supplierLiability: 'Tier-1 Injector Systems Ltd (85% backcharge)',
      recommendedAction: 'OEM Service Advisory #SA-2026-08 issued. Free seal replacement campaign.',
      supplierBatch: 'BATCH-2025-Q3-094'
    },
    {
      dtcCode: 'P0A80',
      title: 'Hybrid / EV Traction Battery Pack Degradation Anomaly',
      subsystem: 'EV High Voltage BMS',
      affectedCount: 38,
      severity: 'HIGH',
      trend: '+4%',
      supplierLiability: 'VoltCell Power India (Warranty cell exchange)',
      recommendedAction: 'Firmware BMS v4.2 OTA calibration flash. Monitor cell delta voltage.',
      supplierBatch: 'CELL-NMC-811-A2'
    },
    {
      dtcCode: 'P0700',
      title: 'Transmission Control System Malfunction (TCU Link)',
      subsystem: 'Automatic Transmission / CAN-Bus',
      affectedCount: 29,
      severity: 'MEDIUM',
      trend: '-12%',
      supplierLiability: 'ElectroDrive Automations',
      recommendedAction: 'Harness inspection pin check on 10,000km scheduled service.',
      supplierBatch: 'TCU-HARN-REV3'
    },
    {
      dtcCode: 'B1402',
      title: 'HVAC Dual-Zone Flap Actuator Potentiometer Fault',
      subsystem: 'Body & Climate Electronics',
      affectedCount: 67,
      severity: 'MEDIUM',
      trend: '+4%',
      supplierLiability: 'ThermoTech Systems',
      recommendedAction: 'Dealer stock replacement parts dispatched via express logistics.',
      supplierBatch: 'ACT-FLAP-2025-V2'
    }
  ];

  const supplyChainParts: SupplyChainPart[] = [
    {
      partNumber: 'OEM-BRK-4021',
      name: 'Ceramic Composite Front Brake Pad Set',
      centralStock: 14500,
      dealerDemand: 12100,
      fillRate: 98.4,
      leadTimeDays: 2,
      status: 'OPTIMAL'
    },
    {
      partNumber: 'OEM-BMS-9904',
      name: 'High Voltage Master BMS Sensor Module',
      centralStock: 480,
      dealerDemand: 820,
      fillRate: 72.1,
      leadTimeDays: 14,
      status: 'CRITICAL_BACKORDER'
    },
    {
      partNumber: 'OEM-INJ-1102',
      name: 'High-Pressure Direct GDI Fuel Injector',
      centralStock: 2100,
      dealerDemand: 2800,
      fillRate: 84.5,
      leadTimeDays: 5,
      status: 'LOW_STOCK'
    },
    {
      partNumber: 'OEM-FLT-8831',
      name: 'HEPA Cabin Air Filtration Assembly (PM2.5)',
      centralStock: 24000,
      dealerDemand: 19500,
      fillRate: 99.2,
      leadTimeDays: 1,
      status: 'OPTIMAL'
    }
  ];

  const filteredDealerships = dealerships.filter(d => {
    const matchesRegion = selectedRegion === 'ALL' || d.region === selectedRegion;
    const matchesSearch = searchQuery === '' || 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      d.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/50 p-6 rounded-2xl border border-slate-800 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-orange-500/10 via-indigo-500/5 to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Building2 size={13} />
                OEM Enterprise Headquarters
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-medium flex items-center gap-1">
                <Activity size={12} className="animate-pulse" />
                Kafka Bus Active: 14,280 msgs/s
              </span>
              <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-medium flex items-center gap-1">
                <Cpu size={12} />
                GraphQL Gateway: 18ms p95
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-['Outfit']">
              OEM Master Control & Dealer Network Benchmarking
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Real-time multi-dealer performance telemetry, predictive warranty defect clustering, EV fleet degradation analytics, and national parts supply chain pacing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className={`p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all ${isRefreshing ? 'animate-spin text-orange-400' : ''}`}
              title="Refresh OEM Telemetry"
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={() => alert('Exporting OEM Network Executive Summary PDF/CSV...')}
              className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2"
            >
              <FileSpreadsheet size={15} />
              <span>Export Network Dossier</span>
            </button>
          </div>
        </div>

        {/* Global Network KPI Ticker */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Active Dealerships</span>
            <div className="text-2xl font-bold text-white mt-0.5 font-['Outfit']">84 <span className="text-xs text-emerald-400 font-medium">+6 this Qtr</span></div>
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Fleet Sales Target Pacing</span>
            <div className="text-2xl font-bold text-emerald-400 mt-0.5 font-['Outfit']">104.2% <span className="text-xs text-slate-400 font-normal">(18,420 units)</span></div>
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Warranty Defect Ratio</span>
            <div className="text-2xl font-bold text-orange-400 mt-0.5 font-['Outfit']">2.68% <span className="text-xs text-emerald-400 font-medium">-0.4% MoM</span></div>
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">National Parts Fill Rate</span>
            <div className="text-2xl font-bold text-blue-400 mt-0.5 font-['Outfit']">96.4% <span className="text-xs text-slate-400 font-normal">24hr dispatch</span></div>
          </div>
        </div>
      </div>

      {/* Control Filters & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('benchmarks')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'benchmarks'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart3 size={14} />
            Dealer Benchmarking
          </button>
          <button
            onClick={() => setActiveTab('warranty')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'warranty'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldAlert size={14} />
            Warranty Defect Clusters ({defectClusters.length})
          </button>
          <button
            onClick={() => setActiveTab('ev-fleet')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'ev-fleet'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Zap size={14} />
            EV Fleet Battery SOH
          </button>
          <button
            onClick={() => setActiveTab('supply-chain')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'supply-chain'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Package size={14} />
            Central Parts Logistics
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search size={14} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search dealer, city, DTC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-orange-500"
          >
            <option value="ALL">All Regions</option>
            <option value="South">South Region</option>
            <option value="West">West Region</option>
            <option value="North">North Region</option>
          </select>
        </div>
      </div>

      {/* Tab 1: Dealership Benchmarking */}
      {activeTab === 'benchmarks' && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-['Outfit']">Dealership Scorecard & Target Realization</h3>
                <p className="text-xs text-slate-400 mt-0.5">Ranked by composite efficiency, customer satisfaction, and SLA adherence.</p>
              </div>
              <span className="text-xs text-slate-400">Showing {filteredDealerships.length} dealerships</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Dealership & Branch</th>
                    <th className="px-4 py-3.5">Region</th>
                    <th className="px-4 py-3.5">Sales (Target vs Actual)</th>
                    <th className="px-4 py-3.5">Service NPS</th>
                    <th className="px-4 py-3.5">Avg Turnaround</th>
                    <th className="px-4 py-3.5">Warranty Claim Rate</th>
                    <th className="px-4 py-3.5">Compliance</th>
                    <th className="px-4 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredDealerships.map((d) => {
                    const achievementPct = Math.round((d.salesActual / d.salesTarget) * 100);
                    return (
                      <tr key={d.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-bold text-white">{d.name}</div>
                          <div className="text-[11px] text-slate-400">{d.city} · {d.id}</div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="px-2 py-0.5 bg-slate-800 rounded text-[11px] font-medium text-slate-300">
                            {d.region}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{d.salesActual}</span>
                            <span className="text-slate-400 text-[11px]">/ {d.salesTarget}</span>
                            <span className={`text-[11px] font-bold ${achievementPct >= 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                              ({achievementPct}%)
                            </span>
                          </div>
                          <div className="w-28 bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${achievementPct >= 100 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                              style={{ width: `${Math.min(achievementPct, 100)}%` }}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5 font-bold text-white">
                            <span className={d.serviceNPS >= 85 ? 'text-emerald-400' : 'text-amber-400'}>{d.serviceNPS}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1 text-slate-300">
                            <Clock size={13} className="text-slate-400" />
                            <span>{d.avgTurnaroundHours} hrs</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`font-semibold ${d.warrantyClaimRate > 5.0 ? 'text-red-400' : d.warrantyClaimRate > 3.0 ? 'text-amber-400' : 'text-slate-300'}`}>
                            {d.warrantyClaimRate}%
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-emerald-400 font-bold">{d.complianceScore}%</span>
                        </td>
                        <td className="px-4 py-4">
                          {d.status === 'TOP_PERFORMER' && (
                            <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-[11px] font-bold">
                              Top Performer
                            </span>
                          )}
                          {d.status === 'ON_TRACK' && (
                            <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md text-[11px] font-bold">
                              On Track
                            </span>
                          )}
                          {d.status === 'ATTENTION_NEEDED' && (
                            <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md text-[11px] font-bold">
                              Audit Required
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Warranty Defect Clusters */}
      {activeTab === 'warranty' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {defectClusters.map((cluster) => (
              <div key={cluster.dtcCode} className="bg-slate-900/60 rounded-xl p-5 border border-slate-800 hover:border-slate-700 transition-all shadow-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-mono font-bold">
                      {cluster.dtcCode}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">{cluster.subsystem}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    cluster.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    cluster.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                    'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {cluster.severity}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white mt-3 font-['Outfit']">{cluster.title}</h4>

                <div className="grid grid-cols-2 gap-3 mt-4 p-3 bg-slate-950/70 rounded-lg border border-slate-800/80 text-xs">
                  <div>
                    <span className="text-slate-500">Affected Vehicles:</span>
                    <div className="font-bold text-white text-sm mt-0.5">{cluster.affectedCount} units</div>
                  </div>
                  <div>
                    <span className="text-slate-500">30-Day Failure Trend:</span>
                    <div className="font-bold text-red-400 text-sm mt-0.5">{cluster.trend}</div>
                  </div>
                  <div className="col-span-2 border-t border-slate-800/80 pt-2">
                    <span className="text-slate-500">Supplier Batch Identification:</span>
                    <div className="font-mono text-xs text-orange-300 mt-0.5">{cluster.supplierBatch}</div>
                  </div>
                </div>

                <div className="mt-4 text-xs space-y-2">
                  <div>
                    <span className="text-slate-400 font-medium">Supplier Liability & Backcharge:</span>
                    <p className="text-slate-200 mt-0.5 font-semibold">{cluster.supplierLiability}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Recommended OEM Remediation:</span>
                    <p className="text-emerald-300 mt-0.5">{cluster.recommendedAction}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: EV Fleet Battery SOH */}
      {activeTab === 'ev-fleet' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Fleet Optimal Range (SOH &gt; 90%)</span>
              <div className="text-3xl font-extrabold text-emerald-400 mt-2 font-['Outfit']">74.2%</div>
              <p className="text-xs text-slate-400 mt-1">3,410 connected EVs showing nominal degradation rate (&lt;1.2%/yr).</p>
            </div>
            <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Moderate Wear (SOH 80–90%)</span>
              <div className="text-3xl font-extrabold text-amber-400 mt-2 font-['Outfit']">21.5%</div>
              <p className="text-xs text-slate-400 mt-1">988 vehicles. High DC fast-charging ratio (&gt;65% fast charging).</p>
            </div>
            <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Cell Imbalance / Critical (&lt; 80%)</span>
              <div className="text-3xl font-extrabold text-red-400 mt-2 font-['Outfit']">4.3%</div>
              <p className="text-xs text-slate-400 mt-1">198 vehicles flagged for dealer module testing and warranty pack swap.</p>
            </div>
          </div>

          <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-800">
            <h3 className="text-sm font-bold text-white font-['Outfit']">National EV Thermal & Fast Charging Analysis</h3>
            <p className="text-xs text-slate-400 mt-1">Real-time CAN-bus telemetry correlation between ambient temperature and peak charging heat.</p>
            
            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Tropical Climate Fast Charging Stress (Chennai / Mumbai)</span>
                  <span className="text-orange-400 font-bold">Max Pack Temp: 44.8°C (Nominal &lt; 45°C)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-gradient-to-r from-emerald-500 via-amber-500 to-orange-500 h-2 rounded-full" style={{ width: '88%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Fleet Cell Voltage Balancing Delta (&lt; 20mV Target)</span>
                  <span className="text-emerald-400 font-bold">14.2 mV Average Delta</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '92%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Central Parts Logistics */}
      {activeTab === 'supply-chain' && (
        <div className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white font-['Outfit']">Tier-1 OEM Parts Warehouse Pacing</h3>
              <p className="text-xs text-slate-400 mt-0.5">Central warehouse distribution, replenishment lead times, and dealer order fill rates.</p>
            </div>
            <button
              onClick={() => alert('Triggering automatic supplier purchase order replenishment dispatch...')}
              className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <Package size={14} />
              <span>Auto-Replenish Backorders</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Part Details</th>
                  <th className="px-4 py-3.5">Central Inventory</th>
                  <th className="px-4 py-3.5">Dealer 30-Day Demand</th>
                  <th className="px-4 py-3.5">Fulfillment Fill Rate</th>
                  <th className="px-4 py-3.5">Logistics Lead Time</th>
                  <th className="px-4 py-3.5">Inventory Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {supplyChainParts.map((part) => (
                  <tr key={part.partNumber} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-white">{part.name}</div>
                      <div className="font-mono text-[11px] text-orange-400">{part.partNumber}</div>
                    </td>
                    <td className="px-4 py-4 font-bold text-white">{part.centralStock.toLocaleString()} units</td>
                    <td className="px-4 py-4 text-slate-300">{part.dealerDemand.toLocaleString()} units</td>
                    <td className="px-4 py-4">
                      <span className={`font-bold ${part.fillRate >= 95 ? 'text-emerald-400' : part.fillRate >= 80 ? 'text-amber-400' : 'text-red-400'}`}>
                        {part.fillRate}%
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-300">{part.leadTimeDays} days</td>
                    <td className="px-4 py-4">
                      {part.status === 'OPTIMAL' && (
                        <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-[11px] font-bold">
                          Optimal Supply
                        </span>
                      )}
                      {part.status === 'LOW_STOCK' && (
                        <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md text-[11px] font-bold">
                          Low Buffer
                        </span>
                      )}
                      {part.status === 'CRITICAL_BACKORDER' && (
                        <span className="px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-md text-[11px] font-bold">
                          Critical Backorder
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OEMDashboardPage;

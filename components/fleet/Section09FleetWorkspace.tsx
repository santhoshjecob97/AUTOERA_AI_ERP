import React, { useState } from 'react';
import {
  Navigation,
  Activity,
  AlertTriangle,
  Zap,
  TrendingUp,
  Truck,
  ShieldAlert,
  Fuel,
  Award,
  Calendar,
  DollarSign,
  Layers,
  MapPin,
  Clock,
  CheckCircle2,
  RefreshCw,
  Gauge,
  Thermometer,
  BatteryCharging,
  Cpu,
  ArrowRight,
  Sparkles,
  PhoneCall,
  Sliders,
  Radio
} from 'lucide-react';

export const Section09FleetWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'pipeline' | 'gps' | 'obd_anomaly' | 'predictive' | 'fuel' | 'driver_leaderboard' | 'cost_tco' | 'route_opt'
  >('pipeline');

  // GPS & Corridor State
  const [corridorDeviated, setCorridorDeviated] = useState(false);
  const [geofenceBreach, setGeofenceBreach] = useState(false);

  // OBD Anomaly State
  const [tempAnomaly, setTempAnomaly] = useState(false);
  const [voltageLow, setVoltageLow] = useState(false);

  // Fuel Intelligence State
  const [simulatedTheft, setSimulatedTheft] = useState(false);

  // TCO State
  const [monthlyKm, setMonthlyKm] = useState(3200);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-6 shadow-2xl relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Module 09 • Fleet IoT & Telematics AI
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              2,880 Points/Day/Vehicle
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
              TimescaleDB 10:1 Compression
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            Fleet Intelligence & Predictive IoT Ecosystem
          </h2>
          <p className="text-sm text-slate-400">
            Real-Time GPS Corridor Tracking • Isolation Forest OBD-II Anomaly • LSTM Failure Forecast • Fuel Theft Siphoning Alerts • TCO
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'pipeline' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers size={14} /> IoT Pipeline
          </button>
          <button
            onClick={() => setActiveTab('gps')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'gps' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Navigation size={14} /> GPS & Geofence
          </button>
          <button
            onClick={() => setActiveTab('obd_anomaly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'obd_anomaly' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Activity size={14} /> OBD Anomaly
          </button>
          <button
            onClick={() => setActiveTab('predictive')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'predictive' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Cpu size={14} /> LSTM Predictive
          </button>
          <button
            onClick={() => setActiveTab('fuel')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'fuel' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Fuel size={14} /> Fuel Theft
          </button>
          <button
            onClick={() => setActiveTab('driver_leaderboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'driver_leaderboard' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Award size={14} /> Leaderboard
          </button>
          <button
            onClick={() => setActiveTab('cost_tco')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'cost_tco' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <DollarSign size={14} /> TCO & Maint.
          </button>
          <button
            onClick={() => setActiveTab('route_opt')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'route_opt' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MapPin size={14} /> Route Opt.
          </button>
        </div>
      </div>

      {/* TAB 1: Fleet IoT Data Pipeline Architecture */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Radio className="text-blue-400" size={16} /> OBD-II to Dashboard End-to-End Ingestion Pipeline
              </h3>
              <p className="text-xs text-slate-400">
                Architectural specification supporting 288,000 points/day for 100 vehicles (~800MB raw → ~80MB compressed in TimescaleDB).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">TimescaleDB Hypertable:</span>
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                10:1 Native Compression
              </span>
            </div>
          </div>

          {/* Pipeline Flow Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
            {[
              { step: '1. Device Port', title: 'OBD-II Telematics', desc: 'Teltonika FMB920 or Blackbox BT-500 streaming 30s intervals', tag: 'Vehicle Port' },
              { step: '2. Cellular IoT', title: 'Airtel IoT 4G SIM', desc: 'Encrypted Cat-M1 / NB-IoT cellular connectivity', tag: 'LTE Uplink' },
              { step: '3. Cloud Broker', title: 'AWS IoT Core', desc: 'MQTT over TLS 1.3 with X.509 device certificates', tag: 'AWS MQTT' },
              { step: '4. Stream Buffer', title: 'AWS Kinesis Data', desc: 'High-throughput 24h real-time ingestion buffer', tag: 'Buffer' },
              { step: '5. TimescaleDB', title: 'Hot Storage (30d)', desc: 'PostgreSQL hypertable compressing 288k rows/day by 10:1', tag: 'TimescaleDB', highlight: true },
              { step: '6. Dashboard', title: 'Alerts & WebSocket', desc: 'WhatsApp alerts to Fleet Manager + 30s WebSocket UI refresh', tag: 'Live UI', highlight: true }
            ].map((p, idx) => (
              <div key={idx} className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                p.highlight ? 'bg-blue-950/30 border-blue-500/50' : 'bg-slate-950/40 border-slate-800'
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{p.step}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">{p.tag}</span>
                  </div>
                  <div className="text-xs font-bold text-white">{p.title}</div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Scale & Ingestion Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400">Daily Records (100 Vehicles)</div>
              <div className="text-2xl font-bold text-white mt-1">288,000 / day</div>
              <div className="text-[11px] text-emerald-400 mt-0.5">2,880 data points per vehicle</div>
            </div>
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400">Raw Uncompressed Volume</div>
              <div className="text-2xl font-bold text-amber-400 mt-1">~788 MB / day</div>
              <div className="text-[11px] text-slate-400 mt-0.5">~2.8 KB per JSON frame</div>
            </div>
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400">TimescaleDB Stored Volume</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">~78.8 MB / day</div>
              <div className="text-[11px] text-emerald-400 mt-0.5">10:1 ratio chunk compression</div>
            </div>
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400">Cold Storage Archive</div>
              <div className="text-2xl font-bold text-blue-400 mt-1">5 Years (S3)</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Parquet Snappy format</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Real-Time GPS Tracking & Geofence Corridor Check */}
      {activeTab === 'gps' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* GPS Simulation Controls */}
            <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Navigation className="text-blue-400" size={16} /> Live Vehicle GPS Telematics
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                  Online 4G LTE
                </span>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Vehicle Tag:</span>
                  <span className="font-bold text-white">FL-01 (Tata Ace EV)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Registration Plate:</span>
                  <span className="font-mono text-white">MH-12-EV-9921</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Live Speed:</span>
                  <span className="font-bold text-emerald-400">62.4 km/h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Heading:</span>
                  <span className="text-slate-300">284° (North-West)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned Route:</span>
                  <span className="text-blue-300">Corridor 4 (Andheri to BKC Hub)</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">Simulate Corridor Test:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setCorridorDeviated(false); setGeofenceBreach(false); }}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                      !corridorDeviated ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    Within Corridor (64m)
                  </button>
                  <button
                    onClick={() => setCorridorDeviated(true)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                      corridorDeviated ? 'bg-amber-950/40 border-amber-500 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    Deviate (&gt;500m)
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setGeofenceBreach(!geofenceBreach)}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                    geofenceBreach ? 'bg-red-950/40 border-red-500 text-red-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <ShieldAlert size={14} /> {geofenceBreach ? 'Clear Geofence Breach' : 'Simulate Restricted Zone Entry'}
                </button>
              </div>
            </div>

            {/* Live Map & Corridor Status Display */}
            <div className="lg:col-span-2 bg-slate-950/70 border border-slate-800 p-5 rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-white">Route Corridor & Geofence Status</h3>
                  <p className="text-xs text-slate-400">Real-time Haversine distance evaluation against 500m safety buffer.</p>
                </div>
                {corridorDeviated ? (
                  <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center gap-1">
                    <AlertTriangle size={14} /> Route Deviation: 5,851m
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 size={14} /> Normal (63.9m from corridor)
                  </span>
                )}
              </div>

              {/* Simulated Map View Canvas */}
              <div className="h-64 bg-slate-900/90 rounded-xl border border-slate-800 relative overflow-hidden flex items-center justify-center p-4">
                {/* Grid Lines */}
                <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

                {/* Corridor Polyline Mock */}
                <div className="absolute w-3/4 h-1 bg-blue-500/30 rounded-full rotate-6" />
                <div className="absolute w-3/4 h-8 bg-blue-500/10 rounded-full rotate-6 border border-blue-500/20 pointer-events-none" />

                {/* Geofence Circle Mock */}
                <div className="absolute top-6 right-8 w-28 h-28 rounded-full border border-dashed border-red-500/40 bg-red-500/10 flex items-center justify-center text-[10px] text-red-400 font-bold">
                  Restricted Port Zone
                </div>

                {/* Vehicle Pin */}
                <div className={`absolute z-10 transition-all duration-700 flex flex-col items-center ${
                  corridorDeviated ? 'bottom-8 left-12' : 'top-24 left-1/2 -translate-x-1/2'
                }`}>
                  <div className={`p-2 rounded-full shadow-lg ${
                    corridorDeviated ? 'bg-amber-500 text-slate-950 animate-bounce' : 'bg-emerald-500 text-slate-950'
                  }`}>
                    <Truck size={16} />
                  </div>
                  <span className="mt-1 text-[10px] font-bold bg-slate-950/90 text-white px-1.5 py-0.5 rounded border border-slate-800">
                    FL-01 (62 km/h)
                  </span>
                </div>
              </div>

              {/* Alerts Log */}
              {geofenceBreach && (
                <div className="p-3 bg-red-950/30 border border-red-500/40 rounded-xl flex items-center justify-between text-xs text-red-300">
                  <div className="flex items-center gap-2">
                    <ShieldAlert size={16} className="text-red-400" />
                    <span>CRITICAL: FL-01 entered unauthorized Restricted Port Zone. WhatsApp alert sent to Fleet Manager.</span>
                  </div>
                  <span className="font-mono text-[10px] bg-red-500/20 px-2 py-0.5 rounded">JUST NOW</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: OBD-II Health & Isolation Forest Anomaly Detection */}
      {activeTab === 'obd_anomaly' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className={`p-4 rounded-xl border ${tempAnomaly ? 'bg-red-950/30 border-red-500/40' : 'bg-slate-950/60 border-slate-800'}`}>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Coolant Temp</span>
                <Thermometer size={14} className={tempAnomaly ? 'text-red-400' : 'text-emerald-400'} />
              </div>
              <div className="text-2xl font-bold text-white mt-1">{tempAnomaly ? '112°C' : '90°C'}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Threshold: &le; 105°C</div>
            </div>

            <div className={`p-4 rounded-xl border ${voltageLow ? 'bg-amber-950/30 border-amber-500/40' : 'bg-slate-950/60 border-slate-800'}`}>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>12V Battery Voltage</span>
                <BatteryCharging size={14} className={voltageLow ? 'text-amber-400' : 'text-emerald-400'} />
              </div>
              <div className="text-2xl font-bold text-white mt-1">{voltageLow ? '11.4 V' : '12.6 V'}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Threshold: &ge; 11.8V</div>
            </div>

            <div className="p-4 rounded-xl border bg-slate-950/60 border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Engine RPM</span>
                <Gauge size={14} className="text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white mt-1">{tempAnomaly ? '5,200' : '2,100'}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Redline: 6,000 RPM</div>
            </div>

            <div className="p-4 rounded-xl border bg-slate-950/60 border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Health Score</span>
                <Sparkles size={14} className="text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{tempAnomaly ? '65/100' : '96/100'}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Calculated in real-time</div>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Isolation Forest Multivariate Anomaly Engine</h3>
                <p className="text-xs text-slate-400">Correlates RPM, Temperature, Voltage, and active DTCs over consecutive telemetry frames.</p>
              </div>
              <button
                onClick={() => { setTempAnomaly(!tempAnomaly); setVoltageLow(!voltageLow); }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5"
              >
                <RefreshCw size={12} /> {tempAnomaly ? 'Reset to Baseline' : 'Inject Telemetry Anomaly'}
              </button>
            </div>

            {tempAnomaly ? (
              <div className="p-4 bg-red-950/30 border border-red-500/50 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-red-300">
                  <span>ANOMALY FLAGGED: Frame #2 (Isolation Forest Score: 0.85 &gt; 0.45 threshold)</span>
                  <span className="bg-red-500/20 px-2 py-0.5 rounded font-mono">DTC: P0217, P0300</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Root Cause: High Coolant Temperature (112°C) combined with Cylinder Misfire (DTC P0300) and Voltage Sag (11.4V).
                  Prescriptive Action: Discontinue aggressive highway driving. Automatic workshop ticket dispatched.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 size={16} /> All 2,880 daily telemetry points within normal multivariate bounds. Zero DTC anomalies.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: LSTM Predictive Maintenance */}
      {activeTab === 'predictive' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-xl space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Cpu className="text-purple-400" size={16} /> LSTM Sequence Forecaster
              </h3>
              <p className="text-xs text-slate-400">
                Predicts component failures 7–14 days ahead with 88%+ accuracy target.
              </p>

              <div className="space-y-3">
                <div className="p-3 bg-slate-900 rounded-lg">
                  <div className="text-xs text-slate-400">Remaining Useful Life (RUL)</div>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">2,850 km</div>
                  <div className="text-xs text-slate-400 mt-0.5">Approx. 14 Days Remaining</div>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg">
                  <div className="text-xs text-slate-400">Model Verification Target</div>
                  <div className="text-lg font-bold text-white mt-1">88%+ Forecast Accuracy</div>
                  <div className="text-[11px] text-purple-300">Model: autoera-lstm-pm-v2.1</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-slate-950/70 border border-slate-800 p-5 rounded-xl space-y-4">
              <h3 className="font-bold text-sm text-white">Subsystem Risk Breakdown</h3>
              <div className="space-y-3">
                {[
                  { name: 'Cooling Subsystem', risk: 18, status: 'NORMAL', desc: 'Thermostat and radiator operational.' },
                  { name: 'Front Brake Pads', risk: 78, status: 'ELEVATED (7-14 Days)', desc: 'Pad thickness &le; 2.5mm detected via deceleration curve.' },
                  { name: '12V Lead-Acid Battery', risk: 24, status: 'NORMAL', desc: 'Conductance healthy, alternator ripple &le; 0.2V.' },
                  { name: 'Transmission & Clutch', risk: 12, status: 'NORMAL', desc: 'No slip ratio anomaly detected.' }
                ].map((s, idx) => (
                  <div key={idx} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">{s.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{s.desc}</div>
                    </div>
                    <div className="text-right">
                      <span className={`font-bold font-mono ${s.risk > 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {s.risk}% Failure Risk
                      </span>
                      <div className="text-[10px] text-slate-400">{s.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Fuel Intelligence & Theft Detection */}
      {activeTab === 'fuel' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Fuel className="text-amber-400" size={16} /> Fuel Economy & Baseline Engine
                </h3>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                  13.5 km/L
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Correlates GPS trip distances with actual fuel consumption sensor baselines to rate driver efficiency.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900 p-3 rounded-lg">
                  <div className="text-slate-400">Actual Economy</div>
                  <div className="text-lg font-bold text-white mt-1">13.5 km/L</div>
                  <div className="text-[11px] text-emerald-400">Baseline: 12.5 km/L (+8%)</div>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg">
                  <div className="text-slate-400">Efficiency Score</div>
                  <div className="text-lg font-bold text-emerald-400 mt-1">100%</div>
                  <div className="text-[11px] text-slate-400">Optimal Fuel Usage</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <ShieldAlert className="text-red-400" size={16} /> Stationary Fuel Siphoning Theft Detection
                </h3>
                <button
                  onClick={() => setSimulatedTheft(!simulatedTheft)}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded font-medium"
                >
                  {simulatedTheft ? 'Reset Sensor' : 'Simulate Fuel Drop'}
                </button>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Flags any drop &ge; 4.0 Litres within 10 minutes while vehicle is stationary (Speed = 0, Engine RPM = 0).
              </p>

              {simulatedTheft ? (
                <div className="p-4 bg-red-950/40 border border-red-500/60 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-red-300">
                    <span>CRITICAL_THEFT_ALERT: Fuel Siphoning Event Detected</span>
                    <span className="font-mono text-red-400">6.5 Litres in 5 min</span>
                  </div>
                  <p className="text-slate-300">
                    Vehicle: FL-02 (Parked at Thane Warehouse). Speed: 0 km/h, RPM: 0.
                    WhatsApp security alert dispatched to Fleet Manager & Security Guard.
                  </p>
                </div>
              ) : (
                <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 size={16} /> No stationary fuel level anomalies detected across fleet in last 24 hours.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Driver Leaderboard & Gamified Incentives */}
      {activeTab === 'driver_leaderboard' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Award className="text-amber-400" size={16} /> Weekly Driver Safety & Fuel Efficiency Leaderboard
                </h3>
                <p className="text-xs text-slate-400">Gamified incentive program rewarding top 10% drivers with monthly cash bonuses.</p>
              </div>
              <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-bold font-mono">
                Pool: ₹5,500 Distributed
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400">
                  <tr>
                    <th className="py-2.5 px-3">Rank</th>
                    <th className="py-2.5 px-3">Driver Name</th>
                    <th className="py-2.5 px-3">Vehicle Tag</th>
                    <th className="py-2.5 px-3">Safety Score</th>
                    <th className="py-2.5 px-3">Grade</th>
                    <th className="py-2.5 px-3">Fuel Economy</th>
                    <th className="py-2.5 px-3">Weekly Incentive</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {[
                    { rank: 1, name: 'Ramesh Patil', tag: 'FL-01', score: 98, grade: 'A+', fuel: '14.8 km/L', bonus: '₹2,500' },
                    { rank: 2, name: 'Vikram Singh', tag: 'FL-03', score: 95, grade: 'A+', fuel: '14.1 km/L', bonus: '₹1,800' },
                    { rank: 3, name: 'Suresh Kumar', tag: 'FL-02', score: 91, grade: 'A', fuel: '13.5 km/L', bonus: '₹1,200' },
                    { rank: 4, name: 'Amit Sharma', tag: 'FL-05', score: 84, grade: 'B', fuel: '12.2 km/L', bonus: '—' },
                    { rank: 5, name: 'Deepak Joshi', tag: 'FL-04', score: 72, grade: 'C', fuel: '10.9 km/L', bonus: '—' }
                  ].map((d) => (
                    <tr key={d.rank} className={`hover:bg-slate-900/50 ${d.rank === 1 ? 'bg-amber-950/20' : ''}`}>
                      <td className="py-2.5 px-3 font-bold text-white">#{d.rank}</td>
                      <td className="py-2.5 px-3 font-semibold text-white">{d.name}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-400">{d.tag}</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-400">{d.score}/100</td>
                      <td className="py-2.5 px-3 font-bold text-blue-400">{d.grade}</td>
                      <td className="py-2.5 px-3">{d.fuel}</td>
                      <td className="py-2.5 px-3 font-bold text-amber-400">{d.bonus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: Fleet Cost Optimisation & AI Maintenance Scheduling */}
      {activeTab === 'cost_tco' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-xl space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <DollarSign className="text-emerald-400" size={16} /> Total Cost of Ownership (TCO) per Month
              </h3>

              <div className="p-3 bg-slate-900 rounded-lg text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Monthly Operating Cost:</span>
                  <span className="font-bold text-white">₹80,800 / vehicle</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cost per Kilometer:</span>
                  <span className="font-bold text-emerald-400">₹25.25 / km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Peer Benchmark:</span>
                  <span className="text-slate-300">₹24.50 / km (+3.1% variance)</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase">Ranked Cost Savings Opportunities</h4>
                {[
                  { title: 'Excessive Idle Reduction', savings: '₹4,800/mo', action: 'Enforce 5-min engine idle cut-off policy' },
                  { title: 'Speed Governance (Max 80 km/h)', savings: '₹3,600/mo', action: 'Throttle governor on highway corridors' },
                  { title: 'Predictive Maintenance Pre-Emption', savings: '₹2,900/mo', action: 'Avoid roadside breakdown tow & salvage fees' }
                ].map((o, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-900/70 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-white">{o.title}</div>
                      <div className="text-[11px] text-slate-400">{o.action}</div>
                    </div>
                    <span className="font-bold text-emerald-400">{o.savings}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-xl space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Calendar className="text-purple-400" size={16} /> AI Maintenance Scheduling & Parts Pre-Order
              </h3>
              <p className="text-xs text-slate-400">
                Automatically books workshop bays during off-peak weekend slots, pre-ordering parts 7 days ahead to cut off-road downtime by 56%.
              </p>

              <div className="p-3.5 bg-slate-900 rounded-xl space-y-2 text-xs border border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Vehicle:</span>
                  <span className="font-bold text-white">FL-03 (Brake Pad Replacement)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Scheduled Slot:</span>
                  <span className="text-purple-300 font-semibold">Saturday 08:00 AM (Off-Peak)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Off-Road Time:</span>
                  <span className="text-emerald-400 font-bold">3.5 hrs (vs 8.0h industry avg)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pre-Ordered Parts Kit:</span>
                  <span className="text-white">Ceramic Brake Pads (SKU: BRK-PAD-F)</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 size={14} /> Parts reserved in dealer inventory. Downtime reduced by 56.2%.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: Multi-Stop Route Optimisation */}
      {activeTab === 'route_opt' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <MapPin className="text-emerald-400" size={16} /> Multi-Stop Graph Route Optimisation (Priority & Traffic)
                </h3>
                <p className="text-xs text-slate-400">Reorders delivery stops to prioritize urgent drops while minimizing total fuel consumption.</p>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">
                14% Distance Saved
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-slate-900 rounded-xl">
                <div className="text-xs text-slate-400">Distance Reduction</div>
                <div className="text-xl font-bold text-white mt-1">44.7 km &rarr; 38.4 km</div>
                <div className="text-[11px] text-emerald-400 mt-0.5">6.3 km eliminated</div>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl">
                <div className="text-xs text-slate-400">Fuel Conserved</div>
                <div className="text-xl font-bold text-amber-400 mt-1">0.50 Litres / trip</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Save ₹48 per run</div>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl">
                <div className="text-xs text-slate-400">Carbon Footprint Saved</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">1.34 kg CO2</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Environmental ESG benefit</div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase">Optimized Sequence Order</h4>
              {[
                { stop: 1, name: 'Andheri East Cargo Centre', priority: 'URGENT', dist: '8.2 km', eta: '15 min' },
                { stop: 2, name: 'Bandra West Delivery Hub', priority: 'HIGH', dist: '14.5 km', eta: '26 min' },
                { stop: 3, name: 'Thane Distribution Warehouse', priority: 'NORMAL', dist: '22.0 km', eta: '40 min' }
              ].map((s) => (
                <div key={s.stop} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                      {s.stop}
                    </span>
                    <div>
                      <div className="font-semibold text-white">{s.name}</div>
                      <div className="text-[11px] text-slate-400">Transit Distance: {s.dist}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      s.priority === 'URGENT' ? 'bg-red-500/20 text-red-300' : s.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {s.priority}
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">ETA: {s.eta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Section09FleetWorkspace;

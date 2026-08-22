import React, { useState } from 'react';
import { Zap, Map, Activity, Battery, TrendingUp, Navigation, AlertTriangle, CheckCircle, Truck, Download } from 'lucide-react';
import StatCard from '../components/StatCard';
import { FleetVehicle, ChargingStation } from '../types';
import BatteryHealthModal from '../components/BatteryHealthModal';
import RouteOptimizationModal from '../components/RouteOptimizationModal';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import CsvImportModal, { CsvColumn } from '../components/common/CsvImportModal';
import ActionDropdown from '../components/common/ActionDropdown';
import FleetDashboard from '../components/dashboard/FleetDashboard';
import VoiceCallButton from '../components/voice/VoiceCallButton';
import VoiceCallModal from '../components/voice/VoiceCallModal';
import UniversalVoiceCampaignSection from '../components/voice/UniversalVoiceCampaignSection';

const initialVehicles: FleetVehicle[] = [
    { id: 'EV-001', model: 'Tata Ace EV', plateNumber: 'MH-12-EV-9921', type: 'EV', status: 'Active', batteryLevel: 72, range: 105, healthScore: 96, location: 'Route 4 (Andheri)', driver: 'Ramesh P.', nextMaintenance: '2024-12-10' },
    { id: 'EV-002', model: 'Mahindra Zor', plateNumber: 'MH-12-EV-4432', type: 'EV', status: 'Charging', batteryLevel: 45, range: 60, healthScore: 88, location: 'Station A', driver: 'Suresh K.', nextMaintenance: '2024-11-20' },
    { id: 'ICE-001', model: 'Ashok Leyland Dost', plateNumber: 'MH-14-GH-1122', type: 'ICE', status: 'Active', batteryLevel: 100, range: 400, healthScore: 100, location: 'Route 1 (Thane)', driver: 'Vikram S.', nextMaintenance: '2024-11-15' },
    { id: 'EV-003', model: 'Tata Nexon EV', plateNumber: 'MH-02-BZ-3321', type: 'EV', status: 'Maintenance', batteryLevel: 10, range: 15, healthScore: 75, location: 'Workshop', driver: 'N/A', nextMaintenance: 'Overdue' },
];

const initialStations: ChargingStation[] = [
    { id: 'CS-01', location: 'Depot Main', type: 'DC Fast', status: 'Occupied', powerOutput: '50kW', currentSession: { vehicleId: 'EV-002', startTime: '10:30', energyDelivered: '12kWh' } },
    { id: 'CS-02', location: 'Depot Main', type: 'AC Type 2', status: 'Available', powerOutput: '7.2kW' },
    { id: 'CS-03', location: 'Logistics Hub', type: 'DC Fast', status: 'Available', powerOutput: '50kW' },
];

const fleetCsvColumns: CsvColumn[] = [
  { key: 'vehicleId', label: 'Unique vehicle identifier', required: true },
  { key: 'make', label: 'Vehicle manufacturer', required: true },
  { key: 'model', label: 'Vehicle model', required: true },
  { key: 'registrationNumber', label: 'License plate number', required: true },
  { key: 'year', label: 'Manufacturing year' },
  { key: 'fuelType', label: 'Fuel type (EV, Hybrid, Petrol, Diesel, CNG)' },
  { key: 'batteryCapacity', label: 'Battery capacity in kWh (for EVs)' },
  { key: 'currentMileage', label: 'Current mileage in km' },
  { key: 'lastServiceDate', label: 'Last service date (YYYY-MM-DD)' },
  { key: 'assignedDriver', label: 'Assigned driver name' },
  { key: 'status', label: 'Vehicle status' },
];

const fleetSampleRows = [
  {
    vehicleId: 'FLT001',
    make: 'Tata',
    model: 'Nexon EV',
    year: '2023',
    registrationNumber: 'DL07IJ7890',
    fuelType: 'EV',
    batteryCapacity: '30.2',
    currentMileage: '15000',
    lastServiceDate: '2025-11-15',
    assignedDriver: 'Ramesh Kumar',
    status: 'Active',
  },
  {
    vehicleId: 'FLT002',
    make: 'Mahindra',
    model: 'XUV700',
    year: '2024',
    registrationNumber: 'MH02KL1234',
    fuelType: 'Diesel',
    batteryCapacity: '',
    currentMileage: '8500',
    lastServiceDate: '2025-10-20',
    assignedDriver: 'Suresh Patil',
    status: 'Maintenance',
  },
];

const FleetEngine: React.FC = () => {
  const [vehicles, setVehicles] = useState<FleetVehicle[]>(initialVehicles);
  const [stations] = useState<ChargingStation[]>(initialStations);
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null);
  const [isBatteryModalOpen, setIsBatteryModalOpen] = useState(false);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [selectedVehicleForCall, setSelectedVehicleForCall] = useState<FleetVehicle | null>(null);

  const activeEVs = vehicles.filter(v => v.type === 'EV' && v.status === 'Active').length;
  const avgHealth = Math.round(vehicles.filter(v => v.type === 'EV').reduce((acc, v) => acc + v.healthScore, 0) / vehicles.filter(v => v.type === 'EV').length);

  const statusData = [
    { name: 'Active', value: vehicles.filter(v => v.status === 'Active').length, color: '#10b981' },
    { name: 'Charging', value: vehicles.filter(v => v.status === 'Charging').length, color: '#3b82f6' },
    { name: 'Maintenance', value: vehicles.filter(v => v.status === 'Maintenance').length, color: '#ef4444' },
    { name: 'Idle', value: vehicles.filter(v => v.status === 'Idle').length, color: '#94a3b8' },
  ];

  const handleBatteryCheck = (v: FleetVehicle) => {
      setSelectedVehicle(v);
      setIsBatteryModalOpen(true);
  };

  const handleRouteOptimize = (v: FleetVehicle) => {
      setSelectedVehicle(v);
      setIsRouteModalOpen(true);
  };

  const updateVehicleStatus = (id: string, status: FleetVehicle['status']) => {
    setVehicles(prev => prev.map(v => (v.id === id ? { ...v, status } : v)));
  };

  const handleImportVehicles = (
    rows: Array<Omit<FleetVehicle, 'id'> & { __vehicleId: string }>,
  ) => {
    const existingIds = new Set(vehicles.map((v) => v.id));

    const imported: FleetVehicle[] = rows.map((data) => {
      let id = data.__vehicleId || `FLT-${Math.random().toString(36).slice(2, 8)}`;
      if (existingIds.has(id)) {
        let suffix = 1;
        while (existingIds.has(`${id}-${suffix}`)) suffix += 1;
        id = `${id}-${suffix}`;
      }
      existingIds.add(id);

      return {
        id,
        model: data.model,
        plateNumber: data.plateNumber,
        type: data.type,
        status: data.status,
        batteryLevel: data.batteryLevel,
        range: data.range,
        healthScore: data.healthScore,
        location: data.location,
        driver: data.driver,
        nextMaintenance: data.nextMaintenance,
        make: data.make,
        year: data.year,
        batteryCapacity: data.batteryCapacity,
        currentMileage: data.currentMileage,
        lastServiceDate: data.lastServiceDate,
      };
    });

    setVehicles([...imported, ...vehicles]);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Zap className="text-emerald-600" /> Fleet EV AI Engine
          </h1>
          <p className="text-slate-500">Real-time EV Tracking, Battery Health & Route Optimization.</p>
        </div>
        <div className="flex gap-2">
            <button 
              onClick={() => setIsImportOpen(true)}
              className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
                <Download size={16} /> Import Fleet
            </button>
            <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                <Map size={16} /> Live Map View
            </button>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm shadow-emerald-200">
                <Truck size={16} /> Add Vehicle
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Active EV Fleet" value={activeEVs.toString()} trend="High Usage" trendUp={true} icon={<Truck size={24}/>} color="blue" />
        <StatCard title="Avg Battery Health" value={`${avgHealth}%`} trend="-0.2%" trendUp={false} icon={<Activity size={24}/>} color="emerald" />
        <StatCard title="CO2 Saved" value="1.2 Tons" trend="This Month" icon={<TrendingUp size={24}/>} color="green" />
        <StatCard title="Charging Status" value={`${stations.filter(s => s.status === 'Available').length}/${stations.length}`} trend="Available" icon={<Zap size={24}/>} color="orange" />
      </div>

      {/* Enterprise Analytics Dashboard */}
      <FleetDashboard />

      {/* Voice AI Bulk Campaign Section */}
      <UniversalVoiceCampaignSection engineType="fleet" />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Fleet List */}
          <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Live Fleet Tracking</h3>
                <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Real-time Telemetry
                </div>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                        <tr>
                            <th className="px-6 py-4 font-medium">Vehicle</th>
                            <th className="px-6 py-4 font-medium">Status & Driver</th>
                            <th className="px-6 py-4 font-medium">Battery & Range</th>
                            <th className="px-6 py-4 font-medium">AI Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {vehicles.map((v) => (
                            <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${v.type === 'EV' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                                            <Truck size={16} />
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-900">{v.model}</div>
                                            <div className="text-xs text-slate-500">{v.plateNumber}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-1
                                        ${v.status === 'Active' ? 'bg-green-100 text-green-700' : 
                                          v.status === 'Charging' ? 'bg-blue-100 text-blue-700' : 
                                          v.status === 'Maintenance' ? 'bg-red-100 text-red-700' :
                                          'bg-slate-100 text-slate-700'}`}>
                                        {v.status}
                                    </span>
                                    <div className="text-xs text-slate-600">{v.driver}</div>
                                </td>
                                <td className="px-6 py-4">
                                    {v.type === 'EV' ? (
                                        <div className="w-32">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className={`font-bold ${v.batteryLevel < 20 ? 'text-red-600' : 'text-slate-700'}`}>{v.batteryLevel}%</span>
                                                <span className="text-slate-500">{v.range}km</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full ${v.batteryLevel < 20 ? 'bg-red-500' : v.status === 'Charging' ? 'bg-blue-500' : 'bg-emerald-500'}`} 
                                                    style={{ width: `${v.batteryLevel}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-slate-400">N/A (ICE)</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {v.type === 'EV' && (
                                            <>
                                                <button 
                                                    onClick={() => handleBatteryCheck(v)}
                                                    className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                                                    title="Check Battery Health"
                                                >
                                                    <Activity size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleRouteOptimize(v)}
                                                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Optimize Route"
                                                >
                                                    <Navigation size={16} />
                                                </button>
                                            </>
                                        )}
                                        <VoiceCallButton
                                            engineType="fleet"
                                            contextData={v}
                                            customerName={v.driver || 'Driver'}
                                            customerPhone="+91-9876543210"
                                            onClick={() => {
                                                setSelectedVehicleForCall(v);
                                                setIsVoiceModalOpen(true);
                                            }}
                                            variant="icon"
                                            size="sm"
                                        />
                                        <ActionDropdown
                                          items={[
                                            {
                                              label: 'Set Active',
                                              onClick: () => updateVehicleStatus(v.id, 'Active'),
                                            },
                                            {
                                              label: 'Set Charging',
                                              onClick: () => updateVehicleStatus(v.id, 'Charging'),
                                            },
                                            {
                                              label: 'Set Maintenance',
                                              onClick: () => updateVehicleStatus(v.id, 'Maintenance'),
                                            },
                                            {
                                              label: 'Set Idle',
                                              onClick: () => updateVehicleStatus(v.id, 'Idle'),
                                            },
                                          ]}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
          </div>

          <div className="space-y-6">
              {/* Charging Station Status */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Zap size={18} className="text-blue-600" /> Charging Infrastructure
                  </h3>
                  <div className="space-y-3">
                      {stations.map(station => (
                          <div key={station.id} className="p-3 border border-slate-100 rounded-lg flex justify-between items-center bg-slate-50">
                              <div>
                                  <div className="font-bold text-sm text-slate-700">{station.location}</div>
                                  <div className="text-xs text-slate-500">{station.type} • {station.powerOutput}</div>
                              </div>
                              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${station.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                  {station.status}
                              </span>
                          </div>
                      ))}
                  </div>
                  <button className="w-full mt-4 py-2 border border-blue-200 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors">
                      Manage Stations
                  </button>
              </div>

              {/* Status Chart */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-2">Fleet Status</h3>
                  <div className="h-40 flex items-center">
                    <div className="w-1/2 h-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={statusData} innerRadius={30} outerRadius={50} paddingAngle={5} dataKey="value" stroke="none">
                                    {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="w-1/2 space-y-1">
                        {statusData.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-slate-600">{item.name}</span>
                                </div>
                                <span className="font-bold">{item.value}</span>
                            </div>
                        ))}
                    </div>
                  </div>
              </div>
          </div>
      </div>

      <BatteryHealthModal 
        isOpen={isBatteryModalOpen} 
        onClose={() => setIsBatteryModalOpen(false)}
        vehicle={selectedVehicle}
      />

      <RouteOptimizationModal 
        isOpen={isRouteModalOpen}
        onClose={() => setIsRouteModalOpen(false)}
        vehicle={selectedVehicle}
      />

      {isImportOpen && (
        <CsvImportModal
          isOpen={isImportOpen}
          title="Import Fleet Vehicles"
          description="Upload fleet_vehicles_template.csv to bulk import vehicles. Required: vehicleId, make, model, registrationNumber."
          columns={fleetCsvColumns}
          sampleRows={fleetSampleRows}
          mapRow={(raw) => {
            const trim = (v: unknown) => (v == null ? '' : String(v).trim());

            const vehicleId = trim((raw as any).vehicleId);
            const make = trim((raw as any).make);
            const model = trim((raw as any).model);
            const registrationNumber = trim((raw as any).registrationNumber);
            const yearRaw = trim((raw as any).year);
            const fuelTypeRaw = trim((raw as any).fuelType);
            const batteryCapacityRaw = trim((raw as any).batteryCapacity);
            const currentMileageRaw = trim((raw as any).currentMileage);
            const lastServiceDate = trim((raw as any).lastServiceDate);
            const assignedDriver = trim((raw as any).assignedDriver);
            const statusRaw = trim((raw as any).status);

            if (!vehicleId) return { error: 'vehicleId is required' };
            if (!make) return { error: 'make is required' };
            if (!model) return { error: 'model is required' };
            if (!registrationNumber) return { error: 'registrationNumber is required' };

            let year: number | undefined;
            if (yearRaw) {
              const val = Number(yearRaw);
              if (!Number.isInteger(val) || val < 2000 || val > 2030) {
                return { error: 'year must be between 2000 and 2030' };
              }
              year = val;
            }

            let fuelType = fuelTypeRaw.toLowerCase();
            if (fuelType && !['ev', 'hybrid', 'petrol', 'diesel', 'cng'].includes(fuelType)) {
              return { error: 'fuelType must be one of: EV, Hybrid, Petrol, Diesel, CNG' };
            }

            let type: FleetVehicle['type'] = 'ICE';
            if (fuelType === 'ev') type = 'EV';
            else if (fuelType === 'hybrid') type = 'Hybrid';

            let batteryCapacity: number | undefined;
            if (batteryCapacityRaw) {
              const val = Number(batteryCapacityRaw.replace(/,/g, ''));
              if (!Number.isFinite(val) || val <= 0) {
                return { error: 'batteryCapacity must be a positive number (no currency symbols)' };
              }
              if (type === 'ICE') {
                return { error: 'batteryCapacity should only be provided for EV or Hybrid vehicles' };
              }
              batteryCapacity = val;
            }

            let currentMileage: number | undefined;
            if (currentMileageRaw) {
              const val = Number(currentMileageRaw.replace(/,/g, ''));
              if (!Number.isFinite(val) || val <= 0) {
                return { error: 'currentMileage must be a positive number (no currency symbols)' };
              }
              currentMileage = val;
            }

            if (lastServiceDate) {
              if (!/^\d{4}-\d{2}-\d{2}$/.test(lastServiceDate)) {
                return { error: 'Invalid lastServiceDate format. Use YYYY-MM-DD' };
              }
            }

            let status: FleetVehicle['status'] = 'Active';
            if (statusRaw) {
              const normalized = statusRaw.toLowerCase();
              const map: Record<string, FleetVehicle['status']> = {
                active: 'Active',
                charging: 'Charging',
                maintenance: 'Maintenance',
                idle: 'Idle',
              };
              if (!map[normalized]) {
                return { error: 'status must be one of: Active, Charging, Maintenance, Idle' };
              }
              status = map[normalized];
            }

            const batteryLevel = type === 'EV' || type === 'Hybrid' ? 80 : 0;
            const range = type === 'EV' || type === 'Hybrid' ? 200 : 400;
            const healthScore = 90;

            const value: Omit<FleetVehicle, 'id'> & { __vehicleId: string } = {
              __vehicleId: vehicleId,
              model: `${make} ${model}`,
              plateNumber: registrationNumber,
              type,
              status,
              batteryLevel,
              range,
              healthScore,
              location: 'Depot',
              driver: assignedDriver || 'Unassigned',
              nextMaintenance: 'TBD',
              make,
              year,
              batteryCapacity,
              currentMileage,
              lastServiceDate: lastServiceDate || undefined,
            };

            return { value };
          }}
          onImport={(rows) => {
            handleImportVehicles(
              rows as Array<Omit<FleetVehicle, 'id'> & { __vehicleId: string }>,
            );
            setIsImportOpen(false);
          }}
          onClose={() => setIsImportOpen(false)}
        />
      )}

      {/* Voice Call Modal */}
      {isVoiceModalOpen && selectedVehicleForCall && (
        <VoiceCallModal
          isOpen={isVoiceModalOpen}
          onClose={() => {
            setIsVoiceModalOpen(false);
            setSelectedVehicleForCall(null);
          }}
          engineType="fleet"
          contextData={selectedVehicleForCall}
          customerName={selectedVehicleForCall.driver || 'Driver'}
          customerPhone="+91-9876543210"
        />
      )}
    </div>
  );
};

export default FleetEngine;
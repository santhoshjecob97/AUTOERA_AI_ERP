import React from 'react';
import { Truck, Battery, Route, Wrench, AlertTriangle, CheckCircle } from 'lucide-react';
import DashboardPanel from './DashboardPanel';
import KPICard from './KPICard';
import TrendChart from './TrendChart';
import ProgressRing from './ProgressRing';
import { FleetDashboardData, SummaryMetric } from '../../types/dashboard';

const mockFleetData: FleetDashboardData = {
  totalVehicles: 48,
  availableVehicles: 42,
  avgRouteEfficiency: 87.5,
  maintenanceAlerts: 6,
  vehicleStatus: [
    { name: 'Available', count: 42, color: '#22c55e' },
    { name: 'In Service', count: 3, color: '#f59e0b' },
    { name: 'Maintenance', count: 2, color: '#ef4444' },
    { name: 'Reserved', count: 1, color: '#6366f1' },
  ],
  routeEfficiency: [
    { name: 'Route A', efficiency: 92, fuelCost: 4500 },
    { name: 'Route B', efficiency: 88, fuelCost: 5200 },
    { name: 'Route C', efficiency: 85, fuelCost: 4800 },
    { name: 'Route D', efficiency: 78, fuelCost: 6100 },
  ],
  batteryHealth: [
    { name: 'Excellent', count: 12, color: '#22c55e' },
    { name: 'Good', count: 8, color: '#84cc16' },
    { name: 'Fair', count: 4, color: '#f59e0b' },
    { name: 'Poor', count: 1, color: '#ef4444' },
  ],
  maintenancePriority: [
    { vehicle: 'MH-01-AB-1234', alert: 'Brake pad replacement', priority: 'high' },
    { vehicle: 'MH-01-CD-5678', alert: 'Oil change due', priority: 'medium' },
    { vehicle: 'MH-01-EF-9012', alert: 'Tire rotation', priority: 'low' },
    { vehicle: 'MH-01-GH-3456', alert: 'Battery check', priority: 'medium' },
    { vehicle: 'MH-01-IJ-7890', alert: 'AC service', priority: 'low' },
    { vehicle: 'MH-01-KL-2345', alert: 'Brake fluid top-up', priority: 'high' },
  ],
};

const FleetDashboard: React.FC = () => {
  const data = mockFleetData;
  const availabilityRate = (data.availableVehicles / data.totalVehicles) * 100;

  const summaryMetrics: SummaryMetric[] = [
    { label: 'Fleet', value: data.totalVehicles, trend: 4.2, trendUp: true },
    { label: 'Available', value: data.availableVehicles, trend: 2.5, trendUp: true },
    { label: 'Efficiency', value: `${data.avgRouteEfficiency}%`, trend: 3.8, trendUp: true },
    { label: 'Alerts', value: data.maintenanceAlerts, trend: 2, trendUp: false },
  ];

  return (
    <DashboardPanel
      engineType="fleet"
      title="Fleet Analytics Dashboard"
      summaryMetrics={summaryMetrics}
    >
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Total Vehicles"
          value={data.totalVehicles}
          trend={4.2}
          trendUp={true}
          icon={<Truck size={20} />}
          color="green"
          sparklineData={[42, 44, 45, 46, 47, 48, 48]}
          subtitle="Fleet size"
        />
        <KPICard
          title="Available Now"
          value={data.availableVehicles}
          trend={2.5}
          trendUp={true}
          icon={<CheckCircle size={20} />}
          color="blue"
          sparklineData={[38, 39, 40, 41, 41, 42, 42]}
          subtitle={`${availabilityRate.toFixed(0)}% availability`}
        />
        <KPICard
          title="Route Efficiency"
          value={`${data.avgRouteEfficiency}%`}
          trend={3.8}
          trendUp={true}
          icon={<Route size={20} />}
          color="indigo"
          sparklineData={[82, 83, 84, 85, 86, 87.5, 87.5]}
          subtitle="Avg across routes"
        />
        <KPICard
          title="Maintenance Alerts"
          value={data.maintenanceAlerts}
          trend={2}
          trendUp={false}
          icon={<AlertTriangle size={20} />}
          color="orange"
          sparklineData={[10, 9, 8, 7, 7, 6, 6]}
          subtitle="Pending actions"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TrendChart
          title="Route Efficiency & Fuel Cost"
          data={data.routeEfficiency}
          lines={[
            { dataKey: 'efficiency', color: '#22c55e', name: 'Efficiency %', type: 'area' },
            { dataKey: 'fuelCost', color: '#f97316', name: 'Fuel Cost (₹)', type: 'line' },
          ]}
          height={280}
          onTimeRangeChange={(range) => console.log('Range:', range)}
        />
        
        {/* Vehicle Status Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Truck size={18} className="text-green-600" />
            Vehicle Status Distribution
          </h4>
          <div className="flex items-center justify-center mb-4">
            <ProgressRing
              value={availabilityRate}
              maxValue={100}
              size={120}
              strokeWidth={10}
              color="#22c55e"
              label="Available"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {data.vehicleStatus.map((status, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                <span className="text-sm text-slate-600">{status.name}</span>
                <span className="ml-auto font-bold text-slate-900">{status.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* EV Battery Health */}
        <div className="bg-slate-50 rounded-xl p-5">
          <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Battery size={18} className="text-green-600" />
            EV Battery Health
          </h4>
          <div className="space-y-3">
            {data.batteryHealth.map((item, index) => {
              const total = data.batteryHealth.reduce((sum, i) => sum + i.count, 0);
              const percentage = (item.count / total) * 100;
              return (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">{item.name}</span>
                    <span className="font-medium text-slate-900">{item.count} vehicles</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Maintenance Priority */}
        <div className="lg:col-span-2 bg-slate-50 rounded-xl p-5">
          <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Wrench size={18} className="text-green-600" />
            Predictive Maintenance Alerts
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 border-b border-slate-200">
                  <th className="text-left py-2 font-medium">Vehicle</th>
                  <th className="text-left py-2 font-medium">Alert</th>
                  <th className="text-right py-2 font-medium">Priority</th>
                </tr>
              </thead>
              <tbody>
                {data.maintenancePriority.map((item, index) => (
                  <tr key={index} className="border-b border-slate-100">
                    <td className="py-3 font-medium text-slate-900">{item.vehicle}</td>
                    <td className="py-3 text-slate-600">{item.alert}</td>
                    <td className="py-3 text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.priority === 'high' ? 'bg-red-100 text-red-700' : 
                        item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-green-100 text-green-700'
                      }`}>
                        {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardPanel>
  );
};

export default FleetDashboard;

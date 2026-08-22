import React from 'react';
import { Wrench, Clock, Users, Box, Star, TrendingUp } from 'lucide-react';
import DashboardPanel from './DashboardPanel';
import KPICard from './KPICard';
import TrendChart from './TrendChart';
import HeatMap from './HeatMap';
import ProgressRing from './ProgressRing';
import { ServiceDashboardData, SummaryMetric } from '../../types/dashboard';

// Mock data for Service Dashboard
const mockServiceData: ServiceDashboardData = {
  bayUtilization: 89,
  technicianEfficiency: 94,
  serviceCompletion: 92,
  avgServiceTime: 3.2,
  revenueToday: 285000,
  revenueTrend: [
    { name: 'Mon', revenue: 245000, target: 250000 },
    { name: 'Tue', revenue: 268000, target: 250000 },
    { name: 'Wed', revenue: 252000, target: 250000 },
    { name: 'Thu', revenue: 298000, target: 250000 },
    { name: 'Fri', revenue: 285000, target: 250000 },
    { name: 'Sat', revenue: 312000, target: 280000 },
  ],
  bayOccupancy: [
    { x: 0, y: 0, value: 95, label: 'Bay 1 - 9AM' },
    { x: 1, y: 0, value: 88, label: 'Bay 2 - 9AM' },
    { x: 2, y: 0, value: 72, label: 'Bay 3 - 9AM' },
    { x: 3, y: 0, value: 100, label: 'Bay 4 - 9AM' },
    { x: 0, y: 1, value: 100, label: 'Bay 1 - 12PM' },
    { x: 1, y: 1, value: 95, label: 'Bay 2 - 12PM' },
    { x: 2, y: 1, value: 88, label: 'Bay 3 - 12PM' },
    { x: 3, y: 1, value: 92, label: 'Bay 4 - 12PM' },
    { x: 0, y: 2, value: 85, label: 'Bay 1 - 3PM' },
    { x: 1, y: 2, value: 78, label: 'Bay 2 - 3PM' },
    { x: 2, y: 2, value: 95, label: 'Bay 3 - 3PM' },
    { x: 3, y: 2, value: 88, label: 'Bay 4 - 3PM' },
    { x: 0, y: 3, value: 72, label: 'Bay 1 - 6PM' },
    { x: 1, y: 3, value: 65, label: 'Bay 2 - 6PM' },
    { x: 2, y: 3, value: 82, label: 'Bay 3 - 6PM' },
    { x: 3, y: 3, value: 75, label: 'Bay 4 - 6PM' },
  ],
  npsScore: 72,
  serviceTimeByType: [
    { type: 'Regular Service', time: 2.5, target: 3 },
    { type: 'Brake Repair', time: 1.8, target: 2 },
    { type: 'AC Service', time: 3.5, target: 4 },
    { type: 'Engine Repair', time: 5.2, target: 6 },
  ],
};

const ServiceDashboard: React.FC = () => {
  const data = mockServiceData;

  const summaryMetrics: SummaryMetric[] = [
    { label: 'Bay Util.', value: `${data.bayUtilization}%`, trend: 4.5, trendUp: true },
    { label: 'Efficiency', value: `${data.technicianEfficiency}%`, trend: 2.1, trendUp: true },
    { label: 'Revenue', value: `₹${(data.revenueToday / 1000).toFixed(0)}K`, trend: 8.3, trendUp: true },
    { label: 'NPS', value: data.npsScore, trend: 3, trendUp: true },
  ];

  return (
    <DashboardPanel
      engineType="service"
      title="Service Analytics Dashboard"
      summaryMetrics={summaryMetrics}
    >
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Bay Utilization"
          value={`${data.bayUtilization}%`}
          trend={4.5}
          trendUp={true}
          icon={<Wrench size={20} />}
          color="orange"
          sparklineData={[82, 85, 88, 86, 89, 91, 89]}
          subtitle="Target: 85%"
        />
        <KPICard
          title="Technician Efficiency"
          value={`${data.technicianEfficiency}%`}
          trend={2.1}
          trendUp={true}
          icon={<Users size={20} />}
          color="blue"
          sparklineData={[88, 90, 92, 91, 93, 94, 94]}
          subtitle="8 technicians active"
        />
        <KPICard
          title="Avg Service Time"
          value={`${data.avgServiceTime} hrs`}
          trend={15}
          trendUp={true}
          icon={<Clock size={20} />}
          color="green"
          sparklineData={[3.8, 3.6, 3.4, 3.3, 3.2, 3.2, 3.2]}
          subtitle="Target: 3.5 hrs"
        />
        <KPICard
          title="Today's Revenue"
          value={`₹${(data.revenueToday / 1000).toFixed(0)}K`}
          trend={8.3}
          trendUp={true}
          icon={<TrendingUp size={20} />}
          color="indigo"
          sparklineData={[245, 268, 252, 298, 285, 312, 285]}
          subtitle="12 jobs completed"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TrendChart
          title="Revenue vs Target"
          data={data.revenueTrend}
          lines={[
            { dataKey: 'revenue', color: '#f97316', name: 'Revenue', type: 'area' },
            { dataKey: 'target', color: '#94a3b8', name: 'Target', type: 'line' },
          ]}
          height={240}
          onTimeRangeChange={(range) => console.log('Range:', range)}
        />
        
        <HeatMap
          title="Bay Occupancy by Time"
          data={data.bayOccupancy}
          xLabels={['Bay 1', 'Bay 2', 'Bay 3', 'Bay 4']}
          yLabels={['9 AM', '12 PM', '3 PM', '6 PM']}
          colorScale={['#fef3c7', '#fcd34d', '#f97316', '#ea580c', '#c2410c']}
        />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* NPS Score */}
        <div className="bg-slate-50 rounded-xl p-5 flex items-center justify-center">
          <div className="text-center">
            <ProgressRing
              value={data.npsScore}
              maxValue={100}
              size={140}
              strokeWidth={12}
              color={data.npsScore >= 70 ? '#22c55e' : data.npsScore >= 50 ? '#f97316' : '#ef4444'}
              label="NPS Score"
            />
            <div className="mt-3 flex items-center justify-center gap-1">
              <Star size={16} className="text-yellow-500 fill-yellow-500" />
              <span className="text-sm text-slate-600">Customer Satisfaction</span>
            </div>
          </div>
        </div>

        {/* Service Time by Type */}
        <div className="lg:col-span-2 bg-slate-50 rounded-xl p-5">
          <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Box size={18} className="text-orange-600" />
            Service Time by Job Type
          </h4>
          <div className="space-y-3">
            {data.serviceTimeByType.map((item, index) => {
              const percentage = (item.time / item.target) * 100;
              const isUnderTarget = item.time <= item.target;
              
              return (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700">{item.type}</span>
                    <span className={`font-medium ${isUnderTarget ? 'text-green-600' : 'text-orange-600'}`}>
                      {item.time}h / {item.target}h target
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isUnderTarget ? 'bg-green-500' : 'bg-orange-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardPanel>
  );
};

export default ServiceDashboard;

import React from 'react';
import { Users, TrendingUp, Target, DollarSign, BarChart2 } from 'lucide-react';
import DashboardPanel from './DashboardPanel';
import KPICard from './KPICard';
import TrendChart from './TrendChart';
import FunnelChart from './FunnelChart';
import Leaderboard from './Leaderboard';
import { SalesDashboardData, SummaryMetric } from '../../types/dashboard';

const mockSalesData: SalesDashboardData = {
  totalLeads: 342,
  conversionRate: 24.5,
  revenueThisMonth: 4850000,
  avgDealSize: 485000,
  pipelineFunnel: [
    { name: 'New Leads', value: 342, color: '#6366f1', conversionRate: 100 },
    { name: 'Qualified', value: 186, color: '#8b5cf6', conversionRate: 54 },
    { name: 'Test Drive', value: 98, color: '#a855f7', conversionRate: 53 },
    { name: 'Negotiation', value: 52, color: '#d946ef', conversionRate: 53 },
    { name: 'Closed Won', value: 28, color: '#22c55e', conversionRate: 54 },
  ],
  leadSourcePerformance: [
    { name: 'Website', leads: 120, conversions: 32 },
    { name: 'Walk-in', leads: 85, conversions: 28 },
    { name: 'Referral', leads: 62, conversions: 24 },
    { name: 'Social', leads: 45, conversions: 8 },
    { name: 'Events', leads: 30, conversions: 6 },
  ],
  forecastVsActual: { forecast: 5200000, actual: 4850000, variance: -6.7 },
  salesLeaderboard: [
    { id: '1', name: 'Rahul Sharma', deals: 8, revenue: 1250000 },
    { id: '2', name: 'Priya Patel', deals: 7, revenue: 1180000 },
    { id: '3', name: 'Amit Kumar', deals: 6, revenue: 980000 },
    { id: '4', name: 'Sneha Reddy', deals: 5, revenue: 820000 },
    { id: '5', name: 'Vikram Singh', deals: 4, revenue: 620000 },
  ],
};

const SalesDashboard: React.FC = () => {
  const data = mockSalesData;

  const summaryMetrics: SummaryMetric[] = [
    { label: 'Leads', value: data.totalLeads, trend: 12.5, trendUp: true },
    { label: 'Conversion', value: `${data.conversionRate}%`, trend: 3.2, trendUp: true },
    { label: 'Revenue', value: `₹${(data.revenueThisMonth / 100000).toFixed(1)}L`, trend: 8.5, trendUp: true },
    { label: 'Avg Deal', value: `₹${(data.avgDealSize / 1000).toFixed(0)}K`, trend: 5.1, trendUp: true },
  ];

  return (
    <DashboardPanel
      engineType="sales"
      title="Sales Analytics Dashboard"
      summaryMetrics={summaryMetrics}
    >
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Total Leads"
          value={data.totalLeads}
          trend={12.5}
          trendUp={true}
          icon={<Users size={20} />}
          color="blue"
          sparklineData={[280, 295, 310, 325, 338, 342, 342]}
          subtitle="This month"
        />
        <KPICard
          title="Conversion Rate"
          value={`${data.conversionRate}%`}
          trend={3.2}
          trendUp={true}
          icon={<Target size={20} />}
          color="green"
          sparklineData={[21, 22, 23, 22.5, 24, 24.5, 24.5]}
          subtitle="Lead to sale"
        />
        <KPICard
          title="Monthly Revenue"
          value={`₹${(data.revenueThisMonth / 100000).toFixed(1)}L`}
          trend={8.5}
          trendUp={true}
          icon={<TrendingUp size={20} />}
          color="indigo"
          sparklineData={[38, 42, 45, 44, 47, 48.5, 48.5]}
          subtitle="vs ₹44.7L last month"
        />
        <KPICard
          title="Avg Deal Size"
          value={`₹${(data.avgDealSize / 1000).toFixed(0)}K`}
          trend={5.1}
          trendUp={true}
          icon={<DollarSign size={20} />}
          color="purple"
          sparklineData={[420, 435, 450, 465, 475, 485, 485]}
          subtitle="Per vehicle"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <FunnelChart
          title="Sales Pipeline"
          data={data.pipelineFunnel}
          height={280}
          showPercentage={true}
        />
        
        <TrendChart
          title="Lead Source Performance"
          data={data.leadSourcePerformance}
          lines={[
            { dataKey: 'leads', color: '#6366f1', name: 'Leads', type: 'area' },
            { dataKey: 'conversions', color: '#22c55e', name: 'Conversions', type: 'line' },
          ]}
          height={280}
          onTimeRangeChange={(range) => console.log('Range:', range)}
        />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Forecast vs Actual */}
        <div className="bg-slate-50 rounded-xl p-5">
          <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart2 size={18} className="text-blue-600" />
            Forecast vs Actual
          </h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Forecast</span>
                <span className="font-medium text-slate-900">₹{(data.forecastVsActual.forecast / 100000).toFixed(1)}L</span>
              </div>
              <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Actual</span>
                <span className="font-medium text-slate-900">₹{(data.forecastVsActual.actual / 100000).toFixed(1)}L</span>
              </div>
              <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${data.forecastVsActual.variance >= 0 ? 'bg-green-500' : 'bg-orange-500'}`}
                  style={{ width: `${(data.forecastVsActual.actual / data.forecastVsActual.forecast) * 100}%` }} 
                />
              </div>
            </div>
            <div className={`text-center py-2 rounded-lg ${data.forecastVsActual.variance >= 0 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
              <span className="text-sm font-medium">
                {data.forecastVsActual.variance >= 0 ? '+' : ''}{data.forecastVsActual.variance}% variance
              </span>
            </div>
          </div>
        </div>

        {/* Sales Leaderboard */}
        <div className="lg:col-span-2">
          <Leaderboard
            title="Top Sales Representatives"
            data={data.salesLeaderboard}
            columns={[
              { key: 'deals', label: 'Deals', format: 'number' },
              { key: 'revenue', label: 'Revenue', format: 'currency' },
            ]}
            maxItems={5}
          />
        </div>
      </div>
    </DashboardPanel>
  );
};

export default SalesDashboard;

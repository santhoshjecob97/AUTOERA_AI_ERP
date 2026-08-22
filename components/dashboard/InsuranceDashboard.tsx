import React from 'react';
import { Shield, AlertOctagon, Clock, FileCheck, RefreshCw } from 'lucide-react';
import DashboardPanel from './DashboardPanel';
import KPICard from './KPICard';
import TrendChart from './TrendChart';
import ProgressRing from './ProgressRing';
import { InsuranceDashboardData, SummaryMetric } from '../../types/dashboard';

const mockInsuranceData: InsuranceDashboardData = {
  activePolicies: 1842,
  claimsProcessed: 156,
  fraudDetectionRate: 4.2,
  avgSettlementTime: 5.8,
  claimsTimeline: [
    { name: 'Week 1', filed: 42, processed: 38, settled: 32 },
    { name: 'Week 2', filed: 38, processed: 35, settled: 30 },
    { name: 'Week 3', filed: 45, processed: 42, settled: 36 },
    { name: 'Week 4', filed: 31, processed: 41, settled: 38 },
  ],
  fraudBreakdown: [
    { name: 'Document Fraud', count: 8, color: '#ef4444' },
    { name: 'Staged Accidents', count: 5, color: '#f97316' },
    { name: 'Inflated Claims', count: 12, color: '#f59e0b' },
    { name: 'Identity Fraud', count: 3, color: '#eab308' },
  ],
  renewalRate: 78,
  settlementByType: [
    { name: 'Accident', avgTime: 8.2, avgAmount: 125000 },
    { name: 'Theft', avgTime: 12.5, avgAmount: 280000 },
    { name: 'Natural Disaster', avgTime: 6.8, avgAmount: 85000 },
    { name: 'Third Party', avgTime: 4.2, avgAmount: 45000 },
  ],
};

const InsuranceDashboard: React.FC = () => {
  const data = mockInsuranceData;

  const summaryMetrics: SummaryMetric[] = [
    { label: 'Policies', value: data.activePolicies, trend: 5.8, trendUp: true },
    { label: 'Claims', value: data.claimsProcessed, trend: 12.3, trendUp: true },
    { label: 'Fraud Rate', value: `${data.fraudDetectionRate}%`, trend: 0.5, trendUp: false },
    { label: 'Renewal', value: `${data.renewalRate}%`, trend: 2.1, trendUp: true },
  ];

  return (
    <DashboardPanel
      engineType="insurance"
      title="Insurance Analytics Dashboard"
      summaryMetrics={summaryMetrics}
    >
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Active Policies"
          value={data.activePolicies.toLocaleString()}
          trend={5.8}
          trendUp={true}
          icon={<Shield size={20} />}
          color="blue"
          sparklineData={[1720, 1755, 1780, 1805, 1825, 1842, 1842]}
          subtitle="Total portfolio"
        />
        <KPICard
          title="Claims Processed"
          value={data.claimsProcessed}
          trend={12.3}
          trendUp={true}
          icon={<FileCheck size={20} />}
          color="green"
          sparklineData={[128, 135, 142, 148, 152, 156, 156]}
          subtitle="This month"
        />
        <KPICard
          title="Fraud Detection"
          value={`${data.fraudDetectionRate}%`}
          trend={0.5}
          trendUp={false}
          icon={<AlertOctagon size={20} />}
          color="red"
          sparklineData={[5.2, 4.8, 4.6, 4.4, 4.3, 4.2, 4.2]}
          subtitle="Flagged claims"
        />
        <KPICard
          title="Avg Settlement Time"
          value={`${data.avgSettlementTime} days`}
          trend={8.5}
          trendUp={true}
          icon={<Clock size={20} />}
          color="purple"
          sparklineData={[7.2, 6.8, 6.5, 6.2, 6.0, 5.8, 5.8]}
          subtitle="Target: 7 days"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TrendChart
          title="Claims Processing Timeline"
          data={data.claimsTimeline}
          lines={[
            { dataKey: 'filed', color: '#6366f1', name: 'Filed', type: 'line' },
            { dataKey: 'processed', color: '#f59e0b', name: 'Processed', type: 'line' },
            { dataKey: 'settled', color: '#22c55e', name: 'Settled', type: 'area' },
          ]}
          height={280}
          onTimeRangeChange={(range) => console.log('Range:', range)}
        />
        
        {/* Fraud Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <AlertOctagon size={18} className="text-red-600" />
            Fraud Detection Breakdown
          </h4>
          <div className="space-y-4">
            {data.fraudBreakdown.map((item, index) => {
              const total = data.fraudBreakdown.reduce((sum, i) => sum + i.count, 0);
              const percentage = (item.count / total) * 100;
              return (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">{item.name}</span>
                    <span className="font-medium text-slate-900">{item.count} cases ({percentage.toFixed(0)}%)</span>
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
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Renewal Rate */}
        <div className="bg-slate-50 rounded-xl p-5 flex flex-col items-center justify-center">
          <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <RefreshCw size={18} className="text-rose-600" />
            Policy Renewal Rate
          </h4>
          <ProgressRing
            value={data.renewalRate}
            maxValue={100}
            size={140}
            strokeWidth={12}
            color={data.renewalRate >= 75 ? '#22c55e' : data.renewalRate >= 60 ? '#f59e0b' : '#ef4444'}
            label="Renewal Rate"
          />
          <p className="text-sm text-slate-500 mt-3 text-center">
            Target: 80%
          </p>
        </div>

        {/* Settlement by Type */}
        <div className="lg:col-span-2 bg-slate-50 rounded-xl p-5">
          <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <FileCheck size={18} className="text-rose-600" />
            Settlement by Claim Type
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 border-b border-slate-200">
                  <th className="text-left py-2 font-medium">Claim Type</th>
                  <th className="text-right py-2 font-medium">Avg Time</th>
                  <th className="text-right py-2 font-medium">Avg Amount</th>
                  <th className="text-right py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.settlementByType.map((item, index) => (
                  <tr key={index} className="border-b border-slate-100">
                    <td className="py-3 font-medium text-slate-900">{item.name}</td>
                    <td className="py-3 text-right text-slate-600">{item.avgTime} days</td>
                    <td className="py-3 text-right text-slate-600">₹{(item.avgAmount / 1000).toFixed(0)}K</td>
                    <td className="py-3 text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.avgTime <= 7 ? 'bg-green-100 text-green-700' : 
                        item.avgTime <= 10 ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-red-100 text-red-700'
                      }`}>
                        {item.avgTime <= 7 ? 'On Track' : item.avgTime <= 10 ? 'Delayed' : 'Critical'}
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

export default InsuranceDashboard;

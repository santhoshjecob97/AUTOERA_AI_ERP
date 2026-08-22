import React from 'react';
import { Banknote, Percent, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import DashboardPanel from './DashboardPanel';
import KPICard from './KPICard';
import TrendChart from './TrendChart';
import FunnelChart from './FunnelChart';
import ProgressRing from './ProgressRing';
import { FinanceDashboardData, SummaryMetric } from '../../types/dashboard';

const mockFinanceData: FinanceDashboardData = {
  totalDisbursement: 12500000,
  approvalRate: 68,
  avgLoanAmount: 485000,
  defaultRate: 2.3,
  loanDistribution: [
    { name: '< 3L', count: 45 },
    { name: '3-5L', count: 82 },
    { name: '5-8L', count: 56 },
    { name: '8-12L', count: 28 },
    { name: '> 12L', count: 12 },
  ],
  creditScoreDistribution: [
    { name: 'Excellent (750+)', count: 42, color: '#22c55e' },
    { name: 'Good (700-749)', count: 68, color: '#84cc16' },
    { name: 'Fair (650-699)', count: 45, color: '#f59e0b' },
    { name: 'Poor (<650)', count: 18, color: '#ef4444' },
  ],
  approvalFunnel: [
    { name: 'Applications', value: 245, color: '#6366f1' },
    { name: 'Documents Verified', value: 198, color: '#8b5cf6' },
    { name: 'Credit Approved', value: 142, color: '#a855f7' },
    { name: 'Disbursed', value: 128, color: '#22c55e' },
  ],
  emiCollectionTrend: [
    { name: 'Jan', collected: 2800000, due: 3000000 },
    { name: 'Feb', collected: 2950000, due: 3100000 },
    { name: 'Mar', collected: 3100000, due: 3200000 },
    { name: 'Apr', collected: 3050000, due: 3150000 },
  ],
};

const FinanceDashboard: React.FC = () => {
  const data = mockFinanceData;

  const summaryMetrics: SummaryMetric[] = [
    { label: 'Disbursed', value: `₹${(data.totalDisbursement / 100000).toFixed(0)}L`, trend: 15.2, trendUp: true },
    { label: 'Approval', value: `${data.approvalRate}%`, trend: 2.5, trendUp: true },
    { label: 'Avg Loan', value: `₹${(data.avgLoanAmount / 1000).toFixed(0)}K`, trend: 8.3, trendUp: true },
    { label: 'Default', value: `${data.defaultRate}%`, trend: 0.3, trendUp: false },
  ];

  return (
    <DashboardPanel
      engineType="finance"
      title="Finance Analytics Dashboard"
      summaryMetrics={summaryMetrics}
    >
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Total Disbursement"
          value={`₹${(data.totalDisbursement / 100000).toFixed(0)}L`}
          trend={15.2}
          trendUp={true}
          icon={<Banknote size={20} />}
          color="green"
          sparklineData={[95, 102, 108, 115, 120, 125, 125]}
          subtitle="This month"
        />
        <KPICard
          title="Approval Rate"
          value={`${data.approvalRate}%`}
          trend={2.5}
          trendUp={true}
          icon={<CheckCircle size={20} />}
          color="blue"
          sparklineData={[62, 64, 65, 66, 67, 68, 68]}
          subtitle="Applications approved"
        />
        <KPICard
          title="Avg Loan Amount"
          value={`₹${(data.avgLoanAmount / 1000).toFixed(0)}K`}
          trend={8.3}
          trendUp={true}
          icon={<TrendingUp size={20} />}
          color="indigo"
          sparklineData={[420, 435, 450, 465, 475, 485, 485]}
          subtitle="Per application"
        />
        <KPICard
          title="Default Rate"
          value={`${data.defaultRate}%`}
          trend={0.3}
          trendUp={false}
          icon={<AlertTriangle size={20} />}
          color="red"
          sparklineData={[2.8, 2.6, 2.5, 2.4, 2.3, 2.3, 2.3]}
          subtitle="Portfolio risk"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <FunnelChart
          title="Loan Approval Pipeline"
          data={data.approvalFunnel}
          height={280}
          showPercentage={true}
        />
        
        <TrendChart
          title="EMI Collection Trend"
          data={data.emiCollectionTrend}
          lines={[
            { dataKey: 'due', color: '#94a3b8', name: 'Due Amount', type: 'line' },
            { dataKey: 'collected', color: '#22c55e', name: 'Collected', type: 'area' },
          ]}
          height={280}
          onTimeRangeChange={(range) => console.log('Range:', range)}
        />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Credit Score Distribution */}
        <div className="bg-slate-50 rounded-xl p-5">
          <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Percent size={18} className="text-emerald-600" />
            Credit Score Distribution
          </h4>
          <div className="space-y-3">
            {data.creditScoreDistribution.map((item, index) => {
              const total = data.creditScoreDistribution.reduce((sum, i) => sum + i.count, 0);
              const percentage = (item.count / total) * 100;
              return (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">{item.name}</span>
                    <span className="font-medium text-slate-900">{item.count} ({percentage.toFixed(0)}%)</span>
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

        {/* Loan Distribution */}
        <div className="bg-slate-50 rounded-xl p-5">
          <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Banknote size={18} className="text-emerald-600" />
            Loan Amount Distribution
          </h4>
          <div className="space-y-3">
            {data.loanDistribution.map((item, index) => {
              const maxCount = Math.max(...data.loanDistribution.map(i => i.count));
              const percentage = (item.count / maxCount) * 100;
              return (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">{item.name}</span>
                    <span className="font-medium text-slate-900">{item.count} loans</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Portfolio Health */}
        <div className="bg-slate-50 rounded-xl p-5 flex flex-col items-center justify-center">
          <h4 className="font-semibold text-slate-900 mb-4">Portfolio Health</h4>
          <ProgressRing
            value={100 - data.defaultRate}
            maxValue={100}
            size={140}
            strokeWidth={12}
            color={data.defaultRate < 3 ? '#22c55e' : data.defaultRate < 5 ? '#f59e0b' : '#ef4444'}
            label="Healthy Loans"
          />
          <p className="text-sm text-slate-500 mt-3 text-center">
            {data.defaultRate}% default rate
          </p>
        </div>
      </div>
    </DashboardPanel>
  );
};

export default FinanceDashboard;

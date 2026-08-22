import React from 'react';
import { Users, Calendar, Award, BookOpen, TrendingUp } from 'lucide-react';
import DashboardPanel from './DashboardPanel';
import KPICard from './KPICard';
import TrendChart from './TrendChart';
import HeatMap from './HeatMap';
import Leaderboard from './Leaderboard';
import ProgressRing from './ProgressRing';
import { WorkforceDashboardData, SummaryMetric } from '../../types/dashboard';

const mockWorkforceData: WorkforceDashboardData = {
  totalEmployees: 86,
  attendanceRate: 94.2,
  avgPerformanceScore: 4.1,
  trainingCompletion: 78,
  attendanceTrend: [
    { name: 'Mon', present: 82, absent: 4 },
    { name: 'Tue', present: 84, absent: 2 },
    { name: 'Wed', present: 80, absent: 6 },
    { name: 'Thu', present: 83, absent: 3 },
    { name: 'Fri', present: 78, absent: 8 },
  ],
  skillMatrix: [
    { x: 0, y: 0, value: 18, label: 'Mechanical - Junior' },
    { x: 1, y: 0, value: 12, label: 'Electrical - Junior' },
    { x: 2, y: 0, value: 8, label: 'Diagnostics - Junior' },
    { x: 3, y: 0, value: 15, label: 'Customer - Junior' },
    { x: 0, y: 1, value: 22, label: 'Mechanical - Mid' },
    { x: 1, y: 1, value: 16, label: 'Electrical - Mid' },
    { x: 2, y: 1, value: 14, label: 'Diagnostics - Mid' },
    { x: 3, y: 1, value: 18, label: 'Customer - Mid' },
    { x: 0, y: 2, value: 15, label: 'Mechanical - Senior' },
    { x: 1, y: 2, value: 10, label: 'Electrical - Senior' },
    { x: 2, y: 2, value: 12, label: 'Diagnostics - Senior' },
    { x: 3, y: 2, value: 8, label: 'Customer - Senior' },
    { x: 0, y: 3, value: 6, label: 'Mechanical - Expert' },
    { x: 1, y: 3, value: 4, label: 'Electrical - Expert' },
    { x: 2, y: 3, value: 5, label: 'Diagnostics - Expert' },
    { x: 3, y: 3, value: 3, label: 'Customer - Expert' },
  ],
  trainingByProgram: [
    { name: 'Safety', completed: 82, total: 86 },
    { name: 'Technical', completed: 68, total: 86 },
    { name: 'Customer Service', completed: 72, total: 86 },
    { name: 'Leadership', completed: 24, total: 32 },
  ],
  utilizationScores: [
    { id: '1', name: 'Amit Kumar', utilization: 96, efficiency: 94 },
    { id: '2', name: 'Rajesh Singh', utilization: 94, efficiency: 92 },
    { id: '3', name: 'Suresh Patel', utilization: 92, efficiency: 88 },
    { id: '4', name: 'Vikram Reddy', utilization: 88, efficiency: 90 },
    { id: '5', name: 'Priya Sharma', utilization: 85, efficiency: 86 },
  ],
};

const WorkforceDashboard: React.FC = () => {
  const data = mockWorkforceData;

  const summaryMetrics: SummaryMetric[] = [
    { label: 'Employees', value: data.totalEmployees, trend: 2.4, trendUp: true },
    { label: 'Attendance', value: `${data.attendanceRate}%`, trend: 1.2, trendUp: true },
    { label: 'Performance', value: `${data.avgPerformanceScore}/5`, trend: 0.3, trendUp: true },
    { label: 'Training', value: `${data.trainingCompletion}%`, trend: 5.5, trendUp: true },
  ];

  return (
    <DashboardPanel
      engineType="workforce"
      title="Workforce Analytics Dashboard"
      summaryMetrics={summaryMetrics}
    >
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Total Employees"
          value={data.totalEmployees}
          trend={2.4}
          trendUp={true}
          icon={<Users size={20} />}
          color="purple"
          sparklineData={[78, 80, 82, 84, 85, 86, 86]}
          subtitle="Active workforce"
        />
        <KPICard
          title="Attendance Rate"
          value={`${data.attendanceRate}%`}
          trend={1.2}
          trendUp={true}
          icon={<Calendar size={20} />}
          color="green"
          sparklineData={[91, 92, 93, 93.5, 94, 94.2, 94.2]}
          subtitle="This week"
        />
        <KPICard
          title="Avg Performance"
          value={`${data.avgPerformanceScore}/5`}
          trend={0.3}
          trendUp={true}
          icon={<Award size={20} />}
          color="blue"
          sparklineData={[3.6, 3.7, 3.8, 3.9, 4.0, 4.1, 4.1]}
          subtitle="Team average"
        />
        <KPICard
          title="Training Completion"
          value={`${data.trainingCompletion}%`}
          trend={5.5}
          trendUp={true}
          icon={<BookOpen size={20} />}
          color="indigo"
          sparklineData={[65, 68, 71, 74, 76, 78, 78]}
          subtitle="All programs"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TrendChart
          title="Weekly Attendance Trend"
          data={data.attendanceTrend}
          lines={[
            { dataKey: 'present', color: '#22c55e', name: 'Present', type: 'area' },
            { dataKey: 'absent', color: '#ef4444', name: 'Absent', type: 'line' },
          ]}
          height={280}
          onTimeRangeChange={(range) => console.log('Range:', range)}
        />
        
        <HeatMap
          title="Skill Matrix by Level"
          data={data.skillMatrix}
          xLabels={['Mechanical', 'Electrical', 'Diagnostics', 'Customer']}
          yLabels={['Junior', 'Mid', 'Senior', 'Expert']}
          colorScale={['#f1f5f9', '#c4b5fd', '#a78bfa', '#8b5cf6', '#7c3aed']}
        />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Training Progress */}
        <div className="bg-slate-50 rounded-xl p-5">
          <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <BookOpen size={18} className="text-purple-600" />
            Training by Program
          </h4>
          <div className="space-y-4">
            {data.trainingByProgram.map((program, index) => {
              const percentage = (program.completed / program.total) * 100;
              return (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">{program.name}</span>
                    <span className="font-medium text-slate-900">{program.completed}/{program.total}</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        percentage >= 90 ? 'bg-green-500' : 
                        percentage >= 70 ? 'bg-purple-500' : 
                        'bg-orange-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Overall Training Completion */}
        <div className="bg-slate-50 rounded-xl p-5 flex flex-col items-center justify-center">
          <h4 className="font-semibold text-slate-900 mb-4">Overall Completion</h4>
          <ProgressRing
            value={data.trainingCompletion}
            maxValue={100}
            size={140}
            strokeWidth={12}
            color={data.trainingCompletion >= 80 ? '#22c55e' : data.trainingCompletion >= 60 ? '#f59e0b' : '#ef4444'}
            label="Training Complete"
          />
          <p className="text-sm text-slate-500 mt-3 text-center">
            Target: 85%
          </p>
        </div>

        {/* Technician Utilization */}
        <Leaderboard
          title="Top Performers"
          data={data.utilizationScores}
          columns={[
            { key: 'utilization', label: 'Utilization', format: 'percentage' },
            { key: 'efficiency', label: 'Efficiency', format: 'percentage' },
          ]}
          maxItems={5}
        />
      </div>
    </DashboardPanel>
  );
};

export default WorkforceDashboard;

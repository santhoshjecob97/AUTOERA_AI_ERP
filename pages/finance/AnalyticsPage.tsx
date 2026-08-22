import React, { useState } from 'react';
import { TrendingUp, BarChart3, Download, Sparkles, Target, Clock, AlertCircle, ThumbsUp } from 'lucide-react';

interface KPI {
  name: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  color: string;
}

interface BenchmarkData {
  metric: string;
  ourValue: number;
  industryAvg: number;
  bestInClass: number;
}

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const kpis: KPI[] = [
    {
      name: 'Avg Approval Time',
      value: '2.3 sec',
      change: -15.2,
      trend: 'down',
      icon: <Clock size={24} />,
      color: 'purple'
    },
    {
      name: 'Default Rate',
      value: '2.8%',
      change: -8.5,
      trend: 'down',
      icon: <AlertCircle size={24} />,
      color: 'green'
    },
    {
      name: 'Fraud Detection Accuracy',
      value: '97.8%',
      change: 2.3,
      trend: 'up',
      icon: <Target size={24} />,
      color: 'blue'
    },
    {
      name: 'Customer Satisfaction',
      value: '4.8/5',
      change: 5.2,
      trend: 'up',
      icon: <ThumbsUp size={24} />,
      color: 'amber'
    }
  ];

  const benchmarkData: BenchmarkData[] = [
    { metric: 'Approval Time (seconds)', ourValue: 2.3, industryAvg: 45.0, bestInClass: 3.5 },
    { metric: 'Default Rate (%)', ourValue: 2.8, industryAvg: 4.5, bestInClass: 2.2 },
    { metric: 'Fraud Detection (%)', ourValue: 97.8, industryAvg: 85.0, bestInClass: 98.5 },
    { metric: 'Customer Satisfaction', ourValue: 4.8, industryAvg: 3.9, bestInClass: 4.9 },
    { metric: 'Processing Cost (₹)', ourValue: 125, industryAvg: 450, bestInClass: 100 }
  ];

  const monthlyTrends = [
    { month: 'Jun', loans: 142, approvals: 128, defaults: 4 },
    { month: 'Jul', loans: 156, approvals: 142, defaults: 5 },
    { month: 'Aug', loans: 168, approvals: 155, defaults: 4 },
    { month: 'Sep', loans: 175, approvals: 163, defaults: 3 },
    { month: 'Oct', loans: 189, approvals: 178, defaults: 5 },
    { month: 'Nov', loans: 198, approvals: 186, defaults: 4 }
  ];

  const maxLoans = Math.max(...monthlyTrends.map(t => t.loans));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 size={32} className="text-purple-600" />
              <h2 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h2>
            </div>
            <p className="text-slate-600">Comprehensive performance metrics and predictive insights</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === '7d'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === '30d'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeRange('90d')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === '90d'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              90 Days
            </button>
            <button
              onClick={() => setTimeRange('1y')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === '1y'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              1 Year
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className={`bg-${kpi.color}-50 rounded-xl shadow-sm border border-${kpi.color}-200 p-6`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 bg-${kpi.color}-100 rounded-lg`}>
                <div className={`text-${kpi.color}-600`}>{kpi.icon}</div>
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                kpi.trend === 'up' 
                  ? kpi.name.includes('Default') || kpi.name.includes('Approval Time')
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'
                  : kpi.name.includes('Default') || kpi.name.includes('Approval Time')
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
              }`}>
                <TrendingUp size={12} className={kpi.trend === 'down' ? 'rotate-180' : ''} />
                {Math.abs(kpi.change)}%
              </div>
            </div>
            <div className="text-sm text-slate-600 mb-1">{kpi.name}</div>
            <div className={`text-3xl font-bold text-${kpi.color}-600`}>{kpi.value}</div>
            <div className="text-xs text-slate-500 mt-2">vs previous period</div>
          </div>
        ))}
      </div>

      {/* Trend Charts */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Monthly Trends</h3>
            <p className="text-sm text-slate-500">Loan applications, approvals, and defaults over time</p>
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2">
            <Download size={16} />
            Export
          </button>
        </div>

        {/* Chart */}
        <div className="space-y-4">
          {monthlyTrends.map((trend, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-700 w-12">{trend.month}</span>
                <div className="flex-1 flex gap-2">
                  {/* Loans Bar */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-8 overflow-hidden">
                        <div
                          className="bg-purple-500 h-8 rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${(trend.loans / maxLoans) * 100}%` }}
                        >
                          <span className="text-white text-xs font-semibold">{trend.loans}</span>
                        </div>
                      </div>
                      <span className="text-xs text-slate-500 w-16">Loans</span>
                    </div>
                  </div>
                  
                  {/* Approvals Bar */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-8 overflow-hidden">
                        <div
                          className="bg-green-500 h-8 rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${(trend.approvals / maxLoans) * 100}%` }}
                        >
                          <span className="text-white text-xs font-semibold">{trend.approvals}</span>
                        </div>
                      </div>
                      <span className="text-xs text-slate-500 w-20">Approvals</span>
                    </div>
                  </div>
                  
                  {/* Defaults Bar */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-8 overflow-hidden">
                        <div
                          className="bg-red-500 h-8 rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${(trend.defaults / maxLoans) * 100}%` }}
                        >
                          <span className="text-white text-xs font-semibold">{trend.defaults}</span>
                        </div>
                      </div>
                      <span className="text-xs text-slate-500 w-16">Defaults</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex gap-6 mt-6 pt-4 border-t border-slate-200 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span className="text-sm text-slate-600">Total Loans</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-slate-600">Approvals</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-slate-600">Defaults</span>
          </div>
        </div>
      </div>

      {/* Benchmark Comparison */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Target size={24} className="text-purple-600" />
          <h3 className="text-xl font-bold text-slate-900">Industry Benchmark Comparison</h3>
        </div>

        <div className="space-y-6">
          {benchmarkData.map((data, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-900">{data.metric}</span>
                <div className="flex gap-4 text-sm">
                  <span className="text-purple-600 font-bold">Us: {data.ourValue}</span>
                  <span className="text-slate-500">Avg: {data.industryAvg}</span>
                  <span className="text-green-600">Best: {data.bestInClass}</span>
                </div>
              </div>
              
              <div className="relative h-8 bg-slate-100 rounded-lg overflow-hidden">
                {/* Industry Average Marker */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-slate-400"
                  style={{ 
                    left: data.metric.includes('Cost') || data.metric.includes('Default') || data.metric.includes('Approval Time')
                      ? `${100 - (data.industryAvg / Math.max(data.ourValue, data.industryAvg, data.bestInClass) * 100)}%`
                      : `${(data.industryAvg / Math.max(data.ourValue, data.industryAvg, data.bestInClass) * 100)}%`
                  }}
                ></div>
                
                {/* Best in Class Marker */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-green-500"
                  style={{ 
                    left: data.metric.includes('Cost') || data.metric.includes('Default') || data.metric.includes('Approval Time')
                      ? `${100 - (data.bestInClass / Math.max(data.ourValue, data.industryAvg, data.bestInClass) * 100)}%`
                      : `${(data.bestInClass / Math.max(data.ourValue, data.industryAvg, data.bestInClass) * 100)}%`
                  }}
                ></div>
                
                {/* Our Value Bar */}
                <div
                  className="absolute top-0 bottom-0 bg-purple-500 rounded-lg flex items-center justify-end pr-2"
                  style={{ 
                    width: data.metric.includes('Cost') || data.metric.includes('Default') || data.metric.includes('Approval Time')
                      ? `${100 - (data.ourValue / Math.max(data.ourValue, data.industryAvg, data.bestInClass) * 100)}%`
                      : `${(data.ourValue / Math.max(data.ourValue, data.industryAvg, data.bestInClass) * 100)}%`
                  }}
                >
                  <span className="text-white text-xs font-semibold">{data.ourValue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200">
          <div className="flex gap-6 justify-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span className="text-slate-600">Our Performance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-slate-400"></div>
              <span className="text-slate-600">Industry Average</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-green-500"></div>
              <span className="text-slate-600">Best in Class</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Predictive Insights */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={24} className="text-indigo-600" />
          <h3 className="text-xl font-bold text-slate-900">AI Predictive Insights</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-indigo-200">
            <div className="flex items-start gap-3">
              <TrendingUp size={20} className="text-green-600 mt-1" />
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Growth Forecast</h4>
                <p className="text-sm text-slate-700">
                  Based on current trends, loan applications are projected to increase by <strong>18%</strong> next month. 
                  Recommend increasing approval capacity.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-indigo-200">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-yellow-600 mt-1" />
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Risk Alert</h4>
                <p className="text-sm text-slate-700">
                  Default rate may increase by <strong>0.3%</strong> in Q1 2025 due to seasonal factors. 
                  Consider tightening credit criteria temporarily.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-indigo-200">
            <div className="flex items-start gap-3">
              <Target size={20} className="text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Optimization Opportunity</h4>
                <p className="text-sm text-slate-700">
                  Implementing AI-suggested payment schedules could improve collection rate by <strong>2.4%</strong> 
                  and reduce defaults by <strong>15%</strong>.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-indigo-200">
            <div className="flex items-start gap-3">
              <ThumbsUp size={20} className="text-purple-600 mt-1" />
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Customer Satisfaction</h4>
                <p className="text-sm text-slate-700">
                  Current satisfaction score of <strong>4.8/5</strong> is excellent. 
                  Maintain fast approval times and transparent pricing to sustain this.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-sm text-green-700 mb-1">Strengths</div>
            <ul className="text-sm text-slate-700 space-y-1">
              <li>• Lightning-fast approval times (2.3s)</li>
              <li>• Industry-leading fraud detection (97.8%)</li>
              <li>• Excellent customer satisfaction (4.8/5)</li>
              <li>• Low processing costs (₹125 per loan)</li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="text-sm text-yellow-700 mb-1">Areas for Improvement</div>
            <ul className="text-sm text-slate-700 space-y-1">
              <li>• Default rate slightly above best-in-class</li>
              <li>• Collection efficiency can be optimized</li>
              <li>• Seasonal demand fluctuations</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-sm text-blue-700 mb-1">Recommendations</div>
            <ul className="text-sm text-slate-700 space-y-1">
              <li>• Implement AI payment optimization</li>
              <li>• Enhance credit scoring models</li>
              <li>• Expand early payment incentives</li>
              <li>• Increase automation in collections</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;

import React, { useState } from 'react';
import { BarChart2, TrendingUp, Users, DollarSign, Target, Calendar, Download, Filter } from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState('month');

  const kpiData = {
    conversionRate: { value: 68, trend: 38, trendUp: true },
    avgDealValue: { value: '₹85L', trend: 15, trendUp: true },
    pipelineValue: { value: '₹12Cr', trend: 220, trendUp: true },
    aiImpact: { value: '+133%', trend: 0, trendUp: true },
  };

  const funnelData = [
    { stage: 'Leads', count: 500, conversion: 100 },
    { stage: 'Qualified', count: 350, conversion: 70 },
    { stage: 'Engaged', count: 210, conversion: 60 },
    { stage: 'Negotiation', count: 147, conversion: 70 },
    { stage: 'Closed', count: 103, conversion: 70 },
  ];

  const teamPerformance = [
    { name: 'Amit Sharma', leads: 52, conversions: 38, conversionRate: 73, revenue: 32000000 },
    { name: 'Priya Patel', leads: 48, conversions: 34, conversionRate: 71, revenue: 29000000 },
    { name: 'Rahul Singh', leads: 45, conversions: 29, conversionRate: 64, revenue: 25000000 },
    { name: 'Sneha Reddy', leads: 42, conversions: 26, conversionRate: 62, revenue: 22000000 },
  ];

  const aiModelMetrics = [
    { name: 'Lead Scoring Accuracy', value: 92, color: 'bg-green-500' },
    { name: 'Pricing Optimization Impact', value: 15, color: 'bg-blue-500', isPercent: false, suffix: '% revenue' },
    { name: 'Chatbot Resolution Rate', value: 78, color: 'bg-purple-500' },
    { name: 'Recommendation Acceptance', value: 84, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart2 className="text-orange-600" /> Sales Analytics
          </h1>
          <p className="text-slate-500">Comprehensive performance metrics and AI model effectiveness.</p>
        </div>

        <div className="flex gap-2">
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="text-green-600" size={24} />
            </div>
            <div className={`flex items-center gap-1 text-sm ${kpiData.conversionRate.trendUp ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp size={16} />
              <span>+{kpiData.conversionRate.trend}%</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{kpiData.conversionRate.value}%</div>
          <div className="text-sm text-slate-600">Conversion Rate</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="text-blue-600" size={24} />
            </div>
            <div className={`flex items-center gap-1 text-sm ${kpiData.avgDealValue.trendUp ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp size={16} />
              <span>+{kpiData.avgDealValue.trend}%</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{kpiData.avgDealValue.value}</div>
          <div className="text-sm text-slate-600">Avg Deal Value</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart2 className="text-purple-600" size={24} />
            </div>
            <div className={`flex items-center gap-1 text-sm ${kpiData.pipelineValue.trendUp ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp size={16} />
              <span>+{kpiData.pipelineValue.trend}%</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{kpiData.pipelineValue.value}</div>
          <div className="text-sm text-slate-600">Pipeline Value</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Target className="text-white" size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">{kpiData.aiImpact.value}</div>
          <div className="text-orange-100 text-sm">AI Impact on Sales</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-bold text-slate-900 mb-6">Conversion Funnel</h3>
          <div className="space-y-4">
            {funnelData.map((stage, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">{stage.stage}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600">{stage.count} leads</span>
                    <span className="text-sm font-bold text-green-600">{stage.conversion}%</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-full bg-slate-200 rounded-full h-8 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-orange-400 to-orange-600 h-8 rounded-full flex items-center justify-end pr-3 text-white text-sm font-medium transition-all duration-500"
                      style={{ width: `${stage.conversion}%` }}
                    >
                      {stage.count}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-bold text-slate-900 mb-6">Sales Trend</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {[45, 52, 48, 61, 55, 68, 72].map((value, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg relative group cursor-pointer hover:from-orange-600 hover:to-orange-500 transition-all"
                     style={{ height: `${value}%` }}>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ₹{value}L
                  </div>
                </div>
                <span className="text-xs text-slate-600">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">Team Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">Rank</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">Leads</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">Conversions</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">Conversion Rate</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teamPerformance.map((member, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                      idx === 1 ? 'bg-slate-200 text-slate-700' :
                      idx === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {idx + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium text-slate-900">{member.name}</span>
                      {idx === 0 && <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">⭐ Top Performer</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-900">{member.leads}</td>
                  <td className="px-6 py-4 text-slate-900">{member.conversions}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{member.conversionRate}%</span>
                      <div className="w-20 bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${member.conversionRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">₹{(member.revenue / 10000000).toFixed(1)}Cr</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Model Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="font-bold text-slate-900 mb-6">AI Model Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {aiModelMetrics.map((metric, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">{metric.name}</span>
                <span className="text-lg font-bold text-slate-900">
                  {metric.value}{metric.isPercent !== false ? '%' : metric.suffix || ''}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`${metric.color} h-3 rounded-full transition-all duration-500`}
                  style={{ width: `${metric.isPercent !== false ? metric.value : (metric.value / 20) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;

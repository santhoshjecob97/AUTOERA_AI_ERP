import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendChartProps } from '../../types/dashboard';

const TrendChart: React.FC<TrendChartProps> = ({
  title,
  data,
  lines,
  height = 280,
  showLegend = true,
  timeRange = 'week',
  onTimeRangeChange,
}) => {
  const [activeRange, setActiveRange] = useState(timeRange);

  const handleRangeChange = (range: 'day' | 'week' | 'month') => {
    setActiveRange(range);
    onTimeRangeChange?.(range);
  };

  const hasAreaType = lines.some(l => l.type === 'area');

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-slate-900">{title}</h4>
        
        {onTimeRangeChange && (
          <div className="flex bg-slate-100 rounded-lg p-1">
            {(['day', 'week', 'month'] as const).map((range) => (
              <button
                key={range}
                onClick={() => handleRangeChange(range)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  activeRange === range
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {hasAreaType ? (
            <AreaChart data={data}>
              <defs>
                {lines.map((line, index) => (
                  <linearGradient key={index} id={`gradient-${line.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={line.color} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={line.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              {showLegend && <Legend />}
              {lines.map((line, index) => (
                line.type === 'area' ? (
                  <Area
                    key={index}
                    type="monotone"
                    dataKey={line.dataKey}
                    stroke={line.color}
                    fill={`url(#gradient-${line.dataKey})`}
                    strokeWidth={2}
                    name={line.name}
                  />
                ) : (
                  <Line
                    key={index}
                    type="monotone"
                    dataKey={line.dataKey}
                    stroke={line.color}
                    strokeWidth={2}
                    dot={false}
                    name={line.name}
                  />
                )
              ))}
            </AreaChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              {showLegend && <Legend />}
              {lines.map((line, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={line.dataKey}
                  stroke={line.color}
                  strokeWidth={2}
                  dot={{ fill: line.color, strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5 }}
                  name={line.name}
                />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;

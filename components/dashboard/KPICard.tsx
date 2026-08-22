import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { KPICardProps } from '../../types/dashboard';

const colorClasses = {
  indigo: { bg: 'bg-indigo-50', icon: 'bg-indigo-100 text-indigo-600', accent: '#6366f1' },
  green: { bg: 'bg-green-50', icon: 'bg-green-100 text-green-600', accent: '#22c55e' },
  orange: { bg: 'bg-orange-50', icon: 'bg-orange-100 text-orange-600', accent: '#f97316' },
  red: { bg: 'bg-red-50', icon: 'bg-red-100 text-red-600', accent: '#ef4444' },
  blue: { bg: 'bg-blue-50', icon: 'bg-blue-100 text-blue-600', accent: '#3b82f6' },
  purple: { bg: 'bg-purple-50', icon: 'bg-purple-100 text-purple-600', accent: '#a855f7' },
};

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  trend,
  trendUp,
  icon,
  color = 'indigo',
  sparklineData,
  subtitle,
  loading = false,
}) => {
  const colors = colorClasses[color];

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 bg-slate-200 rounded-lg" />
          <div className="w-16 h-4 bg-slate-200 rounded" />
        </div>
        <div className="w-24 h-8 bg-slate-200 rounded mb-2" />
        <div className="w-32 h-4 bg-slate-200 rounded" />
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg transition-all duration-300 relative overflow-hidden`}>
      {/* Background sparkline */}
      {sparklineData && sparklineData.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-16 opacity-20">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData.map((v, i) => ({ value: v, index: i }))}>
              <Area
                type="monotone"
                dataKey="value"
                stroke={colors.accent}
                fill={colors.accent}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          {icon && (
            <div className={`p-2.5 rounded-lg ${colors.icon}`}>
              {icon}
            </div>
          )}
          
          {trend !== undefined && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
              trendUp 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-medium text-slate-500">{title}</h4>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-400">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default KPICard;

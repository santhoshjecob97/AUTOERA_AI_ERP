import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  trend?: string | { value: string | number; isPositive?: boolean };
  trendUp?: boolean;
  description?: string;
  icon: React.ReactNode;
  color?: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, trendUp, description, icon, color = "blue", onClick }) => {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/40",
    green: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40",
    purple: "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/40",
    orange: "bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200/50 dark:border-orange-800/40",
    indigo: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/40",
    red: "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-800/40",
  };

  const isObjectTrend = trend && typeof trend === 'object';
  const trendText = isObjectTrend ? String(trend.value) : trend;
  const isUp = isObjectTrend ? (trend.isPositive ?? true) : (trendUp ?? true);

  return (
    <div 
      onClick={onClick}
      className={`bg-white dark:bg-[#0c121e] rounded-2xl p-5 shadow-xs border border-slate-200/80 dark:border-slate-800/80 hover:shadow-md transition-all ${onClick ? 'cursor-pointer hover:border-orange-500/50 dark:hover:border-orange-500/50' : ''}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1.5 font-['Outfit'] tracking-tight">{value}</h3>
        </div>
        <div className={`p-2.5 rounded-xl ${colorClasses[color] || colorClasses.blue}`}>
          {icon}
        </div>
      </div>
      {trendText && (
        <div className="mt-3.5 flex items-center gap-1.5 text-xs">
          <span className={`font-bold flex items-center gap-0.5 ${isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            {isUp ? '↑' : '↓'} {trendText}
          </span>
          <span className="text-slate-400 dark:text-slate-500">{description || 'vs last month'}</span>
        </div>
      )}
      {!trendText && description && (
        <p className="mt-3.5 text-xs text-slate-400 dark:text-slate-500 truncate">{description}</p>
      )}
    </div>
  );
};

export default StatCard;
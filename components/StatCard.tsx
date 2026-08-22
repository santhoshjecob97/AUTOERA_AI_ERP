import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: React.ReactNode;
  color?: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, trendUp, icon, color = "blue", onClick }) => {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
    indigo: "bg-indigo-50 text-indigo-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all ${onClick ? 'cursor-pointer hover:border-indigo-200' : ''}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-2">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color] || colorClasses.blue}`}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <span className={`text-sm font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
          <span className="text-sm text-slate-400 ml-2">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { LeaderboardProps } from '../../types/dashboard';

const formatValue = (value: any, format?: 'number' | 'currency' | 'percentage') => {
  if (value === undefined || value === null) return '-';
  
  switch (format) {
    case 'currency':
      return `₹${Number(value).toLocaleString('en-IN')}`;
    case 'percentage':
      return `${value}%`;
    case 'number':
    default:
      return Number(value).toLocaleString();
  }
};

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy size={16} className="text-yellow-500" />;
    case 2:
      return <Medal size={16} className="text-slate-400" />;
    case 3:
      return <Award size={16} className="text-amber-600" />;
    default:
      return <span className="text-xs font-bold text-slate-400 w-4 text-center">{rank}</span>;
  }
};

const Leaderboard: React.FC<LeaderboardProps> = ({
  title,
  data,
  columns,
  maxItems = 5,
}) => {
  const displayData = data.slice(0, maxItems);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h4 className="font-semibold text-slate-900 mb-4">{title}</h4>
      
      <div className="space-y-3">
        {displayData.map((entry, index) => (
          <div
            key={entry.id}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              index === 0 
                ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200' 
                : 'bg-slate-50 hover:bg-slate-100'
            }`}
          >
            {/* Rank */}
            <div className="w-6 flex items-center justify-center">
              {getRankIcon(index + 1)}
            </div>

            {/* Avatar */}
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white ${
              index === 0 ? 'bg-yellow-500' : 
              index === 1 ? 'bg-slate-400' : 
              index === 2 ? 'bg-amber-600' : 'bg-indigo-500'
            }`}>
              {entry.avatar || entry.name.charAt(0).toUpperCase()}
            </div>

            {/* Name */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900 truncate">{entry.name}</p>
            </div>

            {/* Metrics */}
            <div className="flex items-center gap-4">
              {columns.map((col) => (
                <div key={col.key} className="text-right">
                  <p className="text-xs text-slate-500">{col.label}</p>
                  <p className="font-semibold text-slate-900">
                    {formatValue(entry[col.key], col.format)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {data.length > maxItems && (
          <button className="w-full py-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            View all {data.length} entries →
          </button>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;

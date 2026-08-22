import React from 'react';
import { Activity, TrendingUp, Clock, Settings, Sparkles } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export interface AIModelCardProps {
  modelName: string;
  modelId: string;
  accuracy: number;
  status: 'active' | 'training' | 'idle' | 'error';
  predictions: number;
  lastUpdated: string;
  description: string;
  category?: string;
  onPredict?: () => void;
  onViewDetails?: () => void;
  onConfigure?: () => void;
}

const AIModelCard: React.FC<AIModelCardProps> = ({
  modelName,
  modelId,
  accuracy,
  status,
  predictions,
  lastUpdated,
  description,
  category,
  onPredict,
  onViewDetails,
  onConfigure,
}) => {
  // Status color mapping
  const statusConfig = {
    active: {
      color: 'border-green-200 bg-green-50',
      badge: 'bg-green-100 text-green-700',
      indicator: 'bg-green-500',
      glow: 'shadow-green-200/50',
    },
    training: {
      color: 'border-yellow-200 bg-yellow-50',
      badge: 'bg-yellow-100 text-yellow-700',
      indicator: 'bg-yellow-500',
      glow: 'shadow-yellow-200/50',
    },
    idle: {
      color: 'border-slate-200 bg-slate-50',
      badge: 'bg-slate-100 text-slate-700',
      indicator: 'bg-slate-400',
      glow: '',
    },
    error: {
      color: 'border-red-200 bg-red-50',
      badge: 'bg-red-100 text-red-700',
      indicator: 'bg-red-500',
      glow: 'shadow-red-200/50',
    },
  };

  const config = statusConfig[status];

  // Accuracy gauge data for pie chart
  const gaugeData = [
    { name: 'accuracy', value: accuracy },
    { name: 'remaining', value: 100 - accuracy },
  ];

  const getAccuracyColor = (acc: number) => {
    if (acc >= 90) return '#10b981'; // green
    if (acc >= 75) return '#3b82f6'; // blue
    if (acc >= 60) return '#f59e0b'; // orange
    return '#ef4444'; // red
  };

  const formatLastUpdated = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
      return `${Math.floor(diffMins / 1440)}d ago`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className={`relative bg-white rounded-xl border-2 ${config.color} p-6 transition-all duration-300 hover:shadow-lg ${config.glow} hover:scale-[1.02] cursor-pointer group`}
    >
      {/* Status Indicator - Top Right */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${config.indicator} ${
            status === 'active' ? 'animate-pulse' : ''
          }`}
        ></span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.badge}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      {/* Header */}
      <div className="mb-4">
        {category && (
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            {category}
          </span>
        )}
        <h3 className="text-lg font-bold text-slate-900 mt-1 pr-20">{modelName}</h3>
        <p className="text-sm text-slate-600 mt-1 line-clamp-2">{description}</p>
      </div>

      {/* Accuracy Gauge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{accuracy}%</span>
            <span className="text-sm text-slate-500">Accuracy</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${accuracy}%`,
                backgroundColor: getAccuracyColor(accuracy),
              }}
            ></div>
          </div>
        </div>
        
        <div className="w-16 h-16 ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={gaugeData}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius="60%"
                outerRadius="100%"
                dataKey="value"
              >
                <Cell fill={getAccuracyColor(accuracy)} />
                <Cell fill="#e2e8f0" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-1 text-slate-500 text-xs mb-1">
            <Activity size={12} />
            <span>Predictions</span>
          </div>
          <div className="text-lg font-bold text-slate-900">
            {predictions >= 1000 ? `${(predictions / 1000).toFixed(1)}k` : predictions}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1 text-slate-500 text-xs mb-1">
            <Clock size={12} />
            <span>Updated</span>
          </div>
          <div className="text-sm font-semibold text-slate-700">
            {formatLastUpdated(lastUpdated)}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {onPredict && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPredict();
            }}
            className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Sparkles size={14} />
            Predict
          </button>
        )}
        {onViewDetails && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            className="flex-1 flex items-center justify-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <TrendingUp size={14} />
            Details
          </button>
        )}
        {onConfigure && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onConfigure();
            }}
            className="flex items-center justify-center bg-white border border-slate-200 text-slate-600 p-2 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Settings size={16} />
          </button>
        )}
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none"></div>
    </div>
  );
};

export default AIModelCard;

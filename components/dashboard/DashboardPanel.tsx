import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, RefreshCw, BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { DashboardPanelProps, SummaryMetric } from '../../types/dashboard';

const STORAGE_KEY_PREFIX = 'autoera_dashboard_expanded_';

const DashboardPanel: React.FC<DashboardPanelProps> = ({
  engineType,
  title,
  children,
  summaryMetrics = [],
  onRefresh,
  isLoading = false,
}) => {
  const storageKey = `${STORAGE_KEY_PREFIX}${engineType}`;
  
  const [isExpanded, setIsExpanded] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored !== null ? JSON.parse(stored) : true;
    } catch {
      return true;
    }
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(isExpanded));
    } catch {
      // localStorage unavailable, continue with in-memory state
    }
  }, [isExpanded, storageKey]);

  const handleRefresh = async () => {
    if (onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      await onRefresh();
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const getEngineColor = () => {
    const colors = {
      service: 'orange',
      sales: 'blue',
      finance: 'emerald',
      insurance: 'rose',
      workforce: 'purple',
      fleet: 'green',
    };
    return colors[engineType] || 'indigo';
  };

  const color = getEngineColor();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className={`px-6 py-4 bg-gradient-to-r from-${color}-50 to-white border-b border-slate-100`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 bg-${color}-100 rounded-lg`}>
              <BarChart3 size={20} className={`text-${color}-600`} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500">Real-time analytics & insights</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
              className={`p-2 rounded-lg transition-all ${
                isRefreshing || isLoading
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
              title="Refresh data"
            >
              <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
              title={isExpanded ? 'Collapse dashboard' : 'Expand dashboard'}
            >
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
        </div>

        {/* Collapsed Summary Bar */}
        {!isExpanded && summaryMetrics.length > 0 && (
          <div className="mt-4 flex items-center gap-6 overflow-x-auto pb-2">
            {summaryMetrics.slice(0, 4).map((metric, index) => (
              <SummaryMetricItem key={index} metric={metric} />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-6">
          {isLoading ? (
            <DashboardSkeleton />
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
};

const SummaryMetricItem: React.FC<{ metric: SummaryMetric }> = ({ metric }) => (
  <div className="flex items-center gap-2 whitespace-nowrap group relative">
    <span className="text-sm text-slate-500">{metric.label}:</span>
    <span className="font-bold text-slate-900">{metric.value}</span>
    {metric.trend !== undefined && (
      <span className={`flex items-center text-xs font-medium ${
        metric.trendUp ? 'text-green-600' : 'text-red-600'
      }`}>
        {metric.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {Math.abs(metric.trend)}%
      </span>
    )}
    
    {/* Tooltip */}
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
      {metric.label}: {metric.value}
      {metric.trend !== undefined && (
        <span className={metric.trendUp ? ' text-green-400' : ' text-red-400'}>
          {' '}({metric.trendUp ? '+' : '-'}{Math.abs(metric.trend)}%)
        </span>
      )}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
    </div>
  </div>
);

const DashboardSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-slate-100 rounded-xl h-32" />
    ))}
    <div className="col-span-full md:col-span-2 bg-slate-100 rounded-xl h-64" />
    <div className="col-span-full md:col-span-2 bg-slate-100 rounded-xl h-64" />
  </div>
);

export default DashboardPanel;

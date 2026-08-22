import React from 'react';
import { FunnelChartProps } from '../../types/dashboard';

const FunnelChart: React.FC<FunnelChartProps> = ({
  title,
  data,
  height = 280,
  showPercentage = true,
}) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h4 className="font-semibold text-slate-900 mb-4">{title}</h4>
      
      <div style={{ height }} className="flex flex-col justify-center gap-2">
        {data.map((stage, index) => {
          const widthPercent = (stage.value / maxValue) * 100;
          const isLast = index === data.length - 1;
          
          return (
            <div key={index} className="relative">
              <div className="flex items-center gap-3">
                {/* Funnel bar */}
                <div 
                  className="relative h-10 rounded-lg transition-all duration-500 flex items-center justify-end pr-3"
                  style={{ 
                    width: `${widthPercent}%`,
                    backgroundColor: stage.color,
                    minWidth: '80px'
                  }}
                >
                  <span className="text-white font-bold text-sm">
                    {stage.value.toLocaleString()}
                  </span>
                </div>
                
                {/* Label */}
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-slate-700 truncate block">
                    {stage.name}
                  </span>
                  {showPercentage && stage.conversionRate !== undefined && (
                    <span className="text-xs text-slate-500">
                      {stage.conversionRate}% conversion
                    </span>
                  )}
                </div>
              </div>
              
              {/* Conversion arrow */}
              {!isLast && showPercentage && (
                <div className="absolute -bottom-1 left-8 text-slate-400">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M6 8L0 0H12L6 8Z" fill="currentColor" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FunnelChart;

import React, { useState } from 'react';
import { HeatMapProps } from '../../types/dashboard';

const defaultColorScale = ['#f1f5f9', '#c7d2fe', '#818cf8', '#6366f1', '#4f46e5'];

const HeatMap: React.FC<HeatMapProps> = ({
  title,
  data,
  xLabels,
  yLabels,
  colorScale = defaultColorScale,
}) => {
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));

  const getColor = (value: number) => {
    if (maxValue === minValue) return colorScale[Math.floor(colorScale.length / 2)];
    const ratio = (value - minValue) / (maxValue - minValue);
    const index = Math.min(Math.floor(ratio * colorScale.length), colorScale.length - 1);
    return colorScale[index];
  };

  const getCellData = (x: number, y: number) => {
    return data.find(d => d.x === x && d.y === y);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h4 className="font-semibold text-slate-900 mb-4">{title}</h4>
      
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* X-axis labels */}
          <div className="flex mb-2">
            <div className="w-20 flex-shrink-0" /> {/* Spacer for Y labels */}
            {xLabels.map((label, i) => (
              <div 
                key={i} 
                className="flex-1 text-center text-xs font-medium text-slate-500 px-1 truncate"
                style={{ minWidth: '40px' }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Grid */}
          {yLabels.map((yLabel, y) => (
            <div key={y} className="flex items-center mb-1">
              {/* Y-axis label */}
              <div className="w-20 flex-shrink-0 text-xs font-medium text-slate-500 pr-2 truncate text-right">
                {yLabel}
              </div>
              
              {/* Cells */}
              {xLabels.map((_, x) => {
                const cellData = getCellData(x, y);
                const isHovered = hoveredCell?.x === x && hoveredCell?.y === y;
                
                return (
                  <div
                    key={x}
                    className="flex-1 relative group"
                    style={{ minWidth: '40px' }}
                    onMouseEnter={() => setHoveredCell({ x, y })}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    <div
                      className={`h-8 rounded transition-all duration-200 mx-0.5 ${
                        isHovered ? 'ring-2 ring-indigo-500 ring-offset-1' : ''
                      }`}
                      style={{ backgroundColor: cellData ? getColor(cellData.value) : colorScale[0] }}
                    />
                    
                    {/* Tooltip */}
                    {isHovered && cellData && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap z-10 shadow-lg">
                        <div className="font-semibold">{cellData.label || `${xLabels[x]}, ${yLabel}`}</div>
                        <div>Value: {cellData.value}</div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center justify-end mt-4 gap-2">
            <span className="text-xs text-slate-500">Low</span>
            <div className="flex">
              {colorScale.map((color, i) => (
                <div
                  key={i}
                  className="w-6 h-3"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span className="text-xs text-slate-500">High</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatMap;

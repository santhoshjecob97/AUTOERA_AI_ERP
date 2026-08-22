import React from 'react';
import { ProgressRingProps } from '../../types/dashboard';

const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  maxValue = 100,
  size = 120,
  strokeWidth = 10,
  color = '#6366f1',
  label,
  showPercentage = true,
}) => {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500 ease-out"
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showPercentage && (
            <span className="text-2xl font-bold text-slate-900">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      </div>
      
      {label && (
        <span className="mt-2 text-sm font-medium text-slate-600">{label}</span>
      )}
    </div>
  );
};

export default ProgressRing;

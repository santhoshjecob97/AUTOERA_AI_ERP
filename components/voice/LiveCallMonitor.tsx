import React, { useState, useEffect } from 'react';
import { Clock, User, Phone } from 'lucide-react';
import { CallSession } from '../../types/voice';

interface LiveCallMonitorProps {
  call: CallSession;
}

const LiveCallMonitor: React.FC<LiveCallMonitorProps> = ({ call }) => {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (call.status === 'active') {
      const interval = setInterval(() => {
        const elapsed = Math.floor((new Date().getTime() - call.startTime.getTime()) / 1000);
        setDuration(elapsed);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [call.status, call.startTime]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Phone size={20} className="text-blue-600" />
        Live Call Monitor
      </h3>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-slate-600 mb-2">
            <Clock size={16} />
            <span className="text-sm font-medium">Duration</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{formatDuration(duration)}</p>
        </div>

        <div className="bg-slate-50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-slate-600 mb-2">
            <User size={16} />
            <span className="text-sm font-medium">Customer</span>
          </div>
          <p className="text-lg font-semibold text-slate-900 truncate">{call.customerName}</p>
        </div>

        <div className="bg-slate-50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-slate-600 mb-2">
            <Phone size={16} />
            <span className="text-sm font-medium">Status</span>
          </div>
          <p className="text-lg font-semibold text-green-600 capitalize">{call.status}</p>
        </div>
      </div>
    </div>
  );
};

export default LiveCallMonitor;

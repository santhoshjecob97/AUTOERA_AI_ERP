import React from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Notification } from '../types';

interface NotificationToastProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notifications, onDismiss }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-3 w-80 pointer-events-none">
      {notifications.map((notification) => (
        <div 
          key={notification.id}
          className="pointer-events-auto bg-white rounded-lg shadow-lg border border-slate-100 p-4 flex items-start gap-3 animate-in slide-in-from-right duration-300"
        >
          <div className={`mt-0.5 p-1 rounded-full ${
            notification.type === 'success' ? 'bg-green-100 text-green-600' :
            notification.type === 'warning' ? 'bg-orange-100 text-orange-600' :
            notification.type === 'error' ? 'bg-red-100 text-red-600' :
            'bg-blue-100 text-blue-600'
          }`}>
            {notification.type === 'success' && <CheckCircle size={16} />}
            {notification.type === 'warning' && <AlertTriangle size={16} />}
            {notification.type === 'error' && <AlertTriangle size={16} />}
            {notification.type === 'info' && <Info size={16} />}
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-slate-900">{notification.title}</h4>
            <p className="text-xs text-slate-500 mt-1">{notification.message}</p>
            <p className="text-[10px] text-slate-400 mt-2 text-right">
              {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <button 
            onClick={() => onDismiss(notification.id)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;
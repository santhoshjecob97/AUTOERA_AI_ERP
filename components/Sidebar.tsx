import React from 'react';
import { ViewState, User } from '../types';
import { 
  LayoutDashboard, 
  Car, 
  Wrench, 
  DollarSign, 
  ShieldCheck, 
  Users, 
  Zap, 
  LogOut,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  isOpen: boolean;
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isOpen, user, onLogout }) => {
  const allMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sales', label: 'Sales Engine', icon: Car },
    { id: 'service', label: 'Service Engine', icon: Wrench },
    { id: 'finance', label: 'Finance Engine', icon: DollarSign },
    { id: 'insurance', label: 'Insurance Engine', icon: ShieldCheck },
    { id: 'workforce', label: 'Workforce Engine', icon: Users },
    { id: 'fleet', label: 'Fleet EV Engine', icon: Zap },
    { id: 'plans', label: 'Plans & Pricing', icon: DollarSign },
  ];

  // Filter menu items based on user permissions
  const menuItems = allMenuItems.filter(item => user.permissions.includes(item.id as ViewState));

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:flex-shrink-0
    `}>
      <div className="flex flex-col h-full">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-900">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-indigo-500/20">
            <span className="font-bold text-white">A</span>
          </div>
          <span className="text-xl font-bold tracking-tight">AUTOERA</span>
        </div>

        <div className="p-4">
            <div className="bg-slate-800 rounded-xl p-3 flex items-center gap-3 border border-slate-700">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md bg-indigo-500">
                    {user.avatar}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-bold text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user.role}</p>
                </div>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2 space-y-1">
          <div className="px-6 mb-2 mt-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Engine Operations</p>
          </div>
          
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id as ViewState)}
              className={`w-full flex items-center justify-between px-6 py-3 text-sm font-medium transition-all border-l-4
                ${currentView === item.id 
                  ? 'bg-slate-800 border-indigo-500 text-white' 
                  : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/50'}
              `}
            >
              <div className="flex items-center">
                <item.icon size={18} className={`mr-3 ${currentView === item.id ? 'text-indigo-400' : 'text-slate-500'}`} />
                {item.label}
              </div>
              {currentView === item.id && <ChevronRight size={14} className="text-indigo-500" />}
            </button>
          ))}


        </div>

        <div className="p-6 border-t border-slate-800">
          <button 
            onClick={onLogout}
            className="flex items-center w-full text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 p-2 rounded-lg transition-colors group"
          >
            <LogOut size={18} className="mr-3 group-hover:text-red-400 transition-colors" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
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
  ChevronRight,
  Bot,
  Layers
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
    { id: 'service-ai', label: 'AI Copilot Hub', icon: Bot },
    { id: 'finance', label: 'Finance Engine', icon: DollarSign },
    { id: 'insurance', label: 'Insurance Engine', icon: ShieldCheck },
    { id: 'workforce', label: 'Workforce Engine', icon: Users },
    { id: 'fleet', label: 'Fleet EV Engine', icon: Zap },
    { id: 'plans', label: 'Plans & Pricing', icon: Layers },
  ];

  // Filter menu items based on user permissions
  const menuItems = allMenuItems.filter(item => {
    if (item.id === 'service-ai') return true;
    return user.permissions.includes(item.id as ViewState);
  });

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-40 w-64 bg-[#090d16] text-white border-r border-slate-800/80 transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:flex-shrink-0
    `}>
      <div className="flex flex-col h-full justify-between">
        
        {/* Brand Header */}
        <div>
          <div className="h-18 flex items-center px-5 border-b border-slate-800/80 bg-[#090d16]">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/autoera-ai-logo.png" 
                alt="AutoEra AI" 
                className="h-9 w-auto object-contain drop-shadow-[0_2px_8px_rgba(249,115,22,0.25)]"
                style={{ maxHeight: '36px' }}
              />
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-white font-['Outfit']">
                  AUTOERA <span className="text-orange-500 font-black">AI</span>
                </span>
                <span className="text-[9px] tracking-wider uppercase text-slate-400 font-medium">
                  Dealership ERP 2026
                </span>
              </div>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="p-3.5">
            <div className="bg-slate-900/90 rounded-xl p-3 flex items-center gap-3 border border-slate-800">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white shadow bg-gradient-to-br from-orange-500 to-orange-600 text-sm">
                {user.name.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden min-w-0">
                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                <p className="text-[11px] text-orange-400 font-medium truncate">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="py-2 space-y-1">
            <div className="px-5 mb-2 mt-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                ERP Modules
              </p>
            </div>
            
            {menuItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onChangeView(item.id as ViewState)}
                  className={`w-full flex items-center justify-between px-5 py-2.5 text-xs font-semibold transition-all border-l-3
                    ${isActive 
                      ? 'bg-orange-500/10 border-orange-500 text-orange-400 font-bold' 
                      : 'border-transparent text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={17} className={isActive ? 'text-orange-400' : 'text-slate-500'} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight size={14} className="text-orange-500" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer / Sign Out */}
        <div className="p-4 border-t border-slate-800/80 bg-[#090d16]">
          <button 
            onClick={onLogout}
            className="flex items-center justify-center gap-2 w-full text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/10 py-2.5 px-3 rounded-lg transition-all border border-transparent hover:border-red-500/20 font-medium group"
          >
            <LogOut size={16} className="group-hover:text-red-400 transition-colors" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;
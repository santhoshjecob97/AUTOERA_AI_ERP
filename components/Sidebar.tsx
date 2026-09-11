import React, { useState } from 'react';
import { ViewState, User } from '../types';
import { 
  LayoutDashboard, 
  Car, 
  Wrench, 
  DollarSign, 
  ShieldCheck, 
  Users, 
  Zap, 
  Truck,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Bot,
  Layers,
  Building2,
  Code,
  Cpu,
  Database,
  Network,
  Calculator,
  BookOpen,
  CheckSquare,
  Target,
  ShieldAlert
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  isOpen: boolean;
  user: User;
  onLogout: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onChangeView, 
  isOpen, 
  user, 
  onLogout,
  isCollapsed: controlledCollapsed,
  onToggleCollapse
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  const toggleCollapse = onToggleCollapse || (() => setInternalCollapsed(prev => !prev));
  const { resolvedTheme } = useTheme();

  const allMenuItems = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'daily-checklists', label: 'Daily Dealership SOP', icon: CheckSquare },
    { id: 'customer-360', label: 'Customer 360', icon: Users },
    { id: 'complaints', label: 'Grievance Desk (Area 22)', icon: ShieldAlert },
    { id: 'vehicle-360', label: 'Vehicle 360', icon: Car },
    { id: 'sales', label: 'Sales Engine', icon: Car },
    { id: 'desking', label: 'Sales Desking', icon: Calculator },
    { id: 'sales-targets', label: 'Targets & Incentives', icon: Target },
    { id: 'used-cars', label: 'Used Car Engine', icon: Car },
    { id: 'service', label: 'Service Engine', icon: Wrench },
    { id: 'workshop-command', label: 'Workshop Command', icon: Wrench },
    { id: 'ai-os', label: 'AI Operating System', icon: Cpu },
    { id: 'service-ai', label: 'AI Copilot Hub', icon: Bot },
    { id: 'finance', label: 'Finance Engine', icon: DollarSign },
    { id: 'general-ledger', label: 'General Ledger', icon: BookOpen },
    { id: 'insurance', label: 'Insurance Engine', icon: ShieldCheck },
    { id: 'fleet', label: 'Fleet Telemetry', icon: Truck },
    { id: 'ev', label: 'EV Intelligence', icon: Zap },
    { id: 'oem', label: 'OEM Portal', icon: Building2 },
    { id: 'developer', label: 'Developer Portal', icon: Code },
    { id: 'database-arch', label: 'Database & ER Schema', icon: Database },
    { id: 'backend-arch', label: 'Backend Architecture', icon: Network },
    { id: 'tech-stack', label: 'Technology Stack', icon: Layers },
    { id: 'security', label: 'Security & Compliance', icon: ShieldCheck },
    { id: 'mobile-app', label: 'Mobile App Design', icon: Zap },
    { id: 'workforce', label: 'Workforce Engine', icon: Users },
    { id: 'plans', label: 'Plans & Pricing', icon: Layers },
  ];

  // Filter menu items based on user permissions
  const menuItems = allMenuItems.filter(item => {
    if (item.id === 'service-ai') return true;
    return user.permissions?.includes(item.id as ViewState) ?? true;
  });

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-40 
      ${isCollapsed ? 'w-18' : 'w-60'}
      bg-[#090d16] dark:bg-[#070a13] text-white border-r border-slate-800/80 
      transform transition-all duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:flex-shrink-0
    `}>
      <div className="flex flex-col h-full justify-between">
        
        {/* Brand Header */}
        <div>
          <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-4'} border-b border-slate-800/80 bg-[#090d16] dark:bg-[#070a13]`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <img 
                src="/assets/autoera-ai-logo.png" 
                alt="AutoEra AI" 
                className="h-8 w-auto object-contain flex-shrink-0 drop-shadow-[0_2px_8px_rgba(249,115,22,0.3)]"
                style={{ maxHeight: '32px' }}
              />
              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="font-extrabold text-base tracking-tight text-white font-['Outfit'] whitespace-nowrap">
                    AUTOERA <span className="text-orange-500 font-black">AI</span>
                  </span>
                  <span className="text-[9px] tracking-wider uppercase text-slate-400 font-medium whitespace-nowrap">
                    Dealership ERP 2026
                  </span>
                </div>
              )}
            </div>

            {/* Desktop Collapse Toggle */}
            {!isCollapsed && (
              <button 
                onClick={toggleCollapse}
                className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
                title="Collapse sidebar"
              >
                <ChevronLeft size={16} />
              </button>
            )}
          </div>

          {/* User Profile Card */}
          <div className="p-2.5">
            {isCollapsed ? (
              <div 
                className="w-11 h-11 mx-auto rounded-xl flex items-center justify-center font-bold text-white shadow bg-gradient-to-br from-orange-500 to-orange-600 text-sm cursor-pointer"
                title={`${user.name} (${user.role})`}
                onClick={toggleCollapse}
              >
                {user.name.charAt(0) || 'U'}
              </div>
            ) : (
              <div className="bg-slate-900/90 dark:bg-slate-950/80 rounded-xl p-3 flex items-center gap-3 border border-slate-800">
                <div className="w-9 h-9 flex-shrink-0 rounded-lg flex items-center justify-center font-bold text-white shadow bg-gradient-to-br from-orange-500 to-orange-600 text-sm">
                  {user.name.charAt(0) || 'U'}
                </div>
                <div className="overflow-hidden min-w-0">
                  <p className="text-xs font-bold text-white truncate">{user.name}</p>
                  <p className="text-[11px] text-orange-400 font-medium truncate">{user.role}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user.branchName || user.department || 'Main Branch'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Section */}
          <div className="py-2 space-y-1">
            {!isCollapsed && (
              <div className="px-4 mb-2 mt-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  ERP Modules
                </p>
              </div>
            )}
            
            {menuItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onChangeView(item.id as ViewState)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0 py-3' : 'justify-between px-4 py-2.5'} text-xs font-semibold transition-all border-l-3
                    ${isActive 
                      ? 'bg-orange-500/10 border-orange-500 text-orange-400 font-bold shadow-[inset_0_0_12px_rgba(249,115,22,0.08)]' 
                      : 'border-transparent text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'}
                  `}
                >
                  <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                    <item.icon size={18} className={isActive ? 'text-orange-400' : 'text-slate-400 group-hover:text-slate-200'} />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>
                  {!isCollapsed && isActive && <ChevronRight size={14} className="text-orange-500" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer / Sign Out & Expand */}
        <div className="p-3 border-t border-slate-800/80 bg-[#090d16] dark:bg-[#070a13] space-y-2">
          {isCollapsed && (
            <button 
              onClick={toggleCollapse}
              className="flex items-center justify-center w-full p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
              title="Expand sidebar"
            >
              <ChevronRight size={18} />
            </button>
          )}

          <button 
            onClick={onLogout}
            title={isCollapsed ? "Sign Out" : undefined}
            className={`flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'justify-center gap-2 py-2.5 px-3'} w-full text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all border border-transparent hover:border-red-500/20 font-medium group`}
          >
            <LogOut size={16} className="group-hover:text-red-400 transition-colors" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;
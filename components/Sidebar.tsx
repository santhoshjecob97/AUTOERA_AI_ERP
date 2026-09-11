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
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  isOpen: boolean;
  user: User;
  onLogout: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface MenuGroup {
  title: string;
  items: {
    id: ViewState;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    badge?: string;
    badgeColor?: string;
  }[];
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

  const menuGroups: MenuGroup[] = [
    {
      title: 'Executive & Operations',
      items: [
        { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
        { id: 'daily-checklists', label: 'Daily Dealership SOP', icon: CheckSquare, badge: 'Daily', badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
        { id: 'customer-360', label: 'Customer 360', icon: Users },
        { id: 'vehicle-360', label: 'Vehicle 360', icon: Car },
        { id: 'complaints', label: 'Grievance Desk', icon: ShieldAlert, badge: 'Area 22', badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30' },
      ]
    },
    {
      title: 'Sales & Showroom',
      items: [
        { id: 'sales', label: 'Sales AI Engine', icon: Car },
        { id: 'desking', label: 'Sales Desking', icon: Calculator },
        { id: 'sales-targets', label: 'Targets & Incentives', icon: Target },
        { id: 'used-cars', label: 'Used Car Engine', icon: Car },
      ]
    },
    {
      title: 'Service & Workshop',
      items: [
        { id: 'service', label: 'Service AI Engine', icon: Wrench },
        { id: 'workshop-command', label: 'Workshop Command', icon: Wrench, badge: 'WIP Tower', badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
        { id: 'fleet', label: 'Fleet Telemetry', icon: Truck },
        { id: 'ev', label: 'EV Intelligence', icon: Zap, badge: 'EV', badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
      ]
    },
    {
      title: 'Finance & Insurance (F&I)',
      items: [
        { id: 'finance', label: 'Finance Engine', icon: DollarSign },
        { id: 'general-ledger', label: 'General Ledger', icon: BookOpen },
        { id: 'insurance', label: 'Insurance Engine', icon: ShieldCheck },
      ]
    },
    {
      title: 'Workforce & HR',
      items: [
        { id: 'workforce', label: 'Workforce Engine', icon: Users },
      ]
    },
    {
      title: 'AI Engines & Copilots Hub',
      items: [
        { id: 'ai-os', label: 'AI Operating System', icon: Cpu, badge: '10 Agents', badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
        { id: 'service-ai', label: 'AI Copilot Control', icon: Bot, badge: 'Specialists', badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
      ]
    },
    {
      title: 'Enterprise & Platform',
      items: [
        { id: 'oem', label: 'OEM Portal', icon: Building2 },
        { id: 'developer', label: 'Developer Portal', icon: Code },
        { id: 'database-arch', label: 'Database & ER Schema', icon: Database },
        { id: 'backend-arch', label: 'Backend Architecture', icon: Network },
        { id: 'tech-stack', label: 'Technology Stack', icon: Layers },
        { id: 'security', label: 'Security & Compliance', icon: ShieldCheck },
        { id: 'mobile-app', label: 'Mobile App Design', icon: Zap },
        { id: 'plans', label: 'Plans & Pricing', icon: Layers },
      ]
    }
  ];

  // Filter menu groups and items based on user permissions
  const filteredGroups = menuGroups.map(group => ({
    ...group,
    items: group.items.filter(item => {
      if (item.id === 'service-ai' || item.id === 'ai-os' || item.id === 'dashboard') return true;
      return user.permissions?.includes(item.id) ?? true;
    })
  })).filter(group => group.items.length > 0);

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-40 
      ${isCollapsed ? 'w-20' : 'w-64'}
      bg-[#090d16] dark:bg-[#070a13] text-white border-r border-slate-800/80 
      transform transition-all duration-300 ease-in-out flex flex-col h-full
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:flex-shrink-0
    `}>
      {/* Brand Header */}
      <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-4'} border-b border-slate-800/80 bg-[#090d16] dark:bg-[#070a13] shrink-0`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-black shadow-md shadow-orange-500/20 shrink-0">
            <Sparkles size={18} />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-base tracking-tight text-white font-['Outfit'] whitespace-nowrap">
                AUTOERA <span className="text-orange-500 font-black">AI</span>
              </span>
              <span className="text-[9px] tracking-widest uppercase text-slate-400 font-bold whitespace-nowrap">
                Dealership OS 2026
              </span>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <button 
            onClick={toggleCollapse}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
            title="Collapse sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* User Context Card */}
      <div className="p-3 border-b border-slate-800/60 shrink-0">
        {isCollapsed ? (
          <div 
            className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center font-bold text-white shadow bg-gradient-to-br from-orange-500 to-orange-600 text-xs cursor-pointer"
            title={`${user.name} (${user.role}) — Click to expand`}
            onClick={toggleCollapse}
          >
            {user.name.charAt(0) || 'U'}
          </div>
        ) : (
          <div className="bg-slate-900/90 rounded-xl p-2.5 flex items-center gap-2.5 border border-slate-800/80">
            <div className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center font-bold text-white shadow bg-gradient-to-br from-orange-500 to-orange-600 text-xs">
              {user.name.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate leading-tight">{user.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-[10px] text-orange-400 font-semibold truncate leading-tight">{user.role}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Section with Clean Scrollbar */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4 select-none scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {filteredGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!isCollapsed && (
              <div className="px-2.5 pt-1 pb-1">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 font-mono">
                  {group.title}
                </p>
              </div>
            )}

            {group.items.map((item) => {
              const isActive = currentView === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => onChangeView(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'} rounded-xl text-xs font-semibold transition-all group cursor-pointer
                    ${isActive 
                      ? 'bg-gradient-to-r from-orange-500/20 to-orange-500/10 text-orange-400 font-bold border border-orange-500/30 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border border-transparent'}
                  `}
                >
                  <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'} min-w-0`}>
                    <Icon size={16} className={`shrink-0 transition-colors ${isActive ? 'text-orange-400' : 'text-slate-400 group-hover:text-orange-400'}`} />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!isCollapsed && (
                    <div className="flex items-center gap-1.5 shrink-0 ml-1.5">
                      {item.badge && (
                        <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono font-bold ${item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                          {item.badge}
                        </span>
                      )}
                      {isActive && <ChevronRight size={13} className="text-orange-400" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Section */}
      <div className="p-3 border-t border-slate-800/80 bg-[#090d16] dark:bg-[#070a13] space-y-2 shrink-0">
        {isCollapsed && (
          <button 
            onClick={toggleCollapse}
            className="flex items-center justify-center w-full p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
            title="Expand sidebar"
          >
            <ChevronRight size={16} />
          </button>
        )}

        <button 
          onClick={onLogout}
          title={isCollapsed ? "Sign Out" : undefined}
          className={`flex items-center ${isCollapsed ? 'justify-center p-2' : 'justify-center gap-2 py-2 px-3'} w-full text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all border border-transparent hover:border-red-500/20 font-medium group cursor-pointer`}
        >
          <LogOut size={15} className="group-hover:text-red-400 transition-colors" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
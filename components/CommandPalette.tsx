import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  LayoutDashboard,
  TrendingUp,
  Wrench,
  DollarSign,
  Shield,
  Truck,
  BatteryCharging,
  Users,
  CreditCard,
  PlusCircle,
  FileText,
  Sparkles,
  ArrowRight,
  Zap,
  Activity,
  Compass,
  CornerDownLeft,
  X,
  Building2,
  Code
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAICopilot?: (prompt?: string) => void;
}

interface CommandItem {
  id: string;
  category: 'Navigation' | 'Actions' | 'Specialist Agents';
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenAICopilot
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Command items catalog
  const commands: CommandItem[] = [
    // Navigation
    {
      id: 'nav-dashboard',
      category: 'Navigation',
      title: 'Executive Overview Dashboard',
      subtitle: 'Real-time telemetry, 360 profitability & live workshop bays',
      icon: <LayoutDashboard size={18} className="text-orange-500" />,
      shortcut: 'G D',
      action: () => { navigate('/'); onClose(); }
    },
    {
      id: 'nav-sales',
      category: 'Navigation',
      title: 'Sales Engine & Lead Pipeline',
      subtitle: 'Lead state machine, Margin Guard price floor & WhatsApp follow-ups',
      icon: <TrendingUp size={18} className="text-emerald-500" />,
      shortcut: 'G S',
      action: () => { navigate('/sales'); onClose(); }
    },
    {
      id: 'nav-service',
      category: 'Navigation',
      title: 'Service & Workshop Engine',
      subtitle: 'Active job cards, bay utilization & L1/L2/L3 skill dispatch',
      icon: <Wrench size={18} className="text-blue-500" />,
      shortcut: 'G W',
      action: () => { navigate('/service'); onClose(); }
    },
    {
      id: 'nav-finance',
      category: 'Navigation',
      title: 'Finance & Credit Engine',
      subtitle: 'Multi-bank EMI comparison, risk scoring & payout disbursement',
      icon: <DollarSign size={18} className="text-amber-500" />,
      shortcut: 'G F',
      action: () => { navigate('/finance'); onClose(); }
    },
    {
      id: 'nav-insurance',
      category: 'Navigation',
      title: 'Insurance Engine & Renewals',
      subtitle: '90/60/30-day sequence automation & claim settlements',
      icon: <Shield size={18} className="text-indigo-500" />,
      shortcut: 'G I',
      action: () => { navigate('/insurance'); onClose(); }
    },
    {
      id: 'nav-fleet',
      category: 'Navigation',
      title: 'Fleet IoT & OBD Telemetry',
      subtitle: 'Live GPS geofences, speed alerts & CAN-bus diagnostic health',
      icon: <Truck size={18} className="text-purple-500" />,
      action: () => { navigate('/fleet'); onClose(); }
    },
    {
      id: 'nav-ev',
      category: 'Navigation',
      title: 'EV Battery Intelligence',
      subtitle: 'State-of-Health (SOH), degradation forecasting & fast charging logs',
      icon: <BatteryCharging size={18} className="text-teal-500" />,
      action: () => { navigate('/ev'); onClose(); }
    },
    {
      id: 'nav-oem',
      category: 'Navigation',
      title: 'OEM Master Control & Dealer Benchmarking',
      subtitle: 'Cross-dealership rankings, warranty defect clusters & central parts supply chain',
      icon: <Building2 size={18} className="text-orange-400" />,
      action: () => { navigate('/oem'); onClose(); }
    },
    {
      id: 'nav-developer',
      category: 'Navigation',
      title: 'API Developer Platform & Webhooks',
      subtitle: 'API key credentials, HMAC-SHA256 webhooks & interactive code documentation',
      icon: <Code size={18} className="text-blue-400" />,
      action: () => { navigate('/developer'); onClose(); }
    },
    {
      id: 'nav-workforce',
      category: 'Navigation',
      title: 'Workforce & Technician Roster',
      subtitle: 'Mechanic certification levels, shift management & incentive payouts',
      icon: <Users size={18} className="text-cyan-500" />,
      action: () => { navigate('/workforce'); onClose(); }
    },
    {
      id: 'nav-plans',
      category: 'Navigation',
      title: 'SaaS Subscription Plans',
      subtitle: 'Multi-tenant licensing, add-ons and Razorpay recurring billing',
      icon: <CreditCard size={18} className="text-pink-500" />,
      action: () => { navigate('/plans'); onClose(); }
    },

    // Actions
    {
      id: 'action-new-lead',
      category: 'Actions',
      title: 'Create New Customer Lead',
      subtitle: 'Capture prospect inquiry, test drive interest and auto-score lead',
      icon: <PlusCircle size={18} className="text-orange-500" />,
      action: () => { navigate('/sales/leads'); onClose(); }
    },
    {
      id: 'action-new-jobcard',
      category: 'Actions',
      title: 'Open Service Job Card',
      subtitle: 'Vehicle check-in, customer complaint record & AI initial diagnosis',
      icon: <FileText size={18} className="text-blue-500" />,
      action: () => { navigate('/service/operations'); onClose(); }
    },
    {
      id: 'action-check-margin',
      category: 'Actions',
      title: 'Margin Guard Verification',
      subtitle: 'Check minimum floor price against branch manager permissions',
      icon: <Zap size={18} className="text-emerald-500" />,
      action: () => { navigate('/sales/pricing'); onClose(); }
    },
    {
      id: 'action-ev-health',
      category: 'Actions',
      title: 'Run EV Battery Diagnostic Sweep',
      subtitle: 'Query BMS impedance, cell voltage balance and thermal runaways',
      icon: <Activity size={18} className="text-teal-500" />,
      action: () => { navigate('/ev'); onClose(); }
    },

    // Specialist Agents
    {
      id: 'agent-executive',
      category: 'Specialist Agents',
      title: 'Ask Executive Management Agent',
      subtitle: 'Dealership gross profit, target pacing, and cross-department bottlenecks',
      icon: <Sparkles size={18} className="text-orange-500" />,
      action: () => {
        onClose();
        if (onOpenAICopilot) onOpenAICopilot('Provide an executive performance update for today.');
      }
    },
    {
      id: 'agent-service-advisor',
      category: 'Specialist Agents',
      title: 'Ask Service Advisor Agent',
      subtitle: 'Symptom matching, labour rate estimate and WhatsApp customer update',
      icon: <Sparkles size={18} className="text-blue-500" />,
      action: () => {
        onClose();
        if (onOpenAICopilot) onOpenAICopilot('What are the active open job cards requiring attention?');
      }
    },
    {
      id: 'agent-sales',
      category: 'Specialist Agents',
      title: 'Ask Sales Specialist Agent',
      subtitle: 'Hot lead conversion tactics, inventory aging & price discount rules',
      icon: <Sparkles size={18} className="text-emerald-500" />,
      action: () => {
        onClose();
        if (onOpenAICopilot) onOpenAICopilot('Show hot leads nearing SLA breach.');
      }
    }
  ];

  // Filter commands
  const filteredCommands = commands.filter((item) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.title.toLowerCase().includes(term) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(term)) ||
      item.category.toLowerCase().includes(term)
    );
  });

  // Handle keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open triggered by parent or caller
        }
      }

      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        } else if (searchTerm.trim() && onOpenAICopilot) {
          onClose();
          onOpenAICopilot(searchTerm);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, searchTerm, onClose, onOpenAICopilot]);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#0d131f] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#0a0e17]">
          <Search size={20} className="text-orange-500 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, search pages, or ask AutoEra Copilot..."
            className="w-full bg-transparent text-sm md:text-base text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none font-sans"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
            >
              <X size={16} />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 ml-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/40">
          {searchTerm.trim().length > 0 && (
            <div
              onClick={() => {
                onClose();
                if (onOpenAICopilot) onOpenAICopilot(searchTerm);
              }}
              className="mb-2 mx-1 p-3 rounded-xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent border border-orange-500/20 hover:border-orange-500/40 cursor-pointer flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500 text-white shadow-sm shadow-orange-500/30">
                  <Sparkles size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                    Ask AutoEra Copilot AI
                  </div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    "{searchTerm}"
                  </div>
                </div>
              </div>
              <div className="flex items-center text-xs font-medium text-orange-600 dark:text-orange-400 gap-1">
                <span>Run with Agent Supervisor</span>
                <CornerDownLeft size={14} />
              </div>
            </div>
          )}

          {filteredCommands.length === 0 && !searchTerm.trim() ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              Type to search dealership workflows, engines, or triggers...
            </div>
          ) : filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No matching modules found. Press Enter to dispatch query directly to Copilot AI.
            </div>
          ) : (
            filteredCommands.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-500/30 text-slate-900 dark:text-white'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isSelected
                          ? 'bg-white dark:bg-slate-800 shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800/70'
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold truncate font-['Outfit']">
                          {item.title}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {item.category}
                        </span>
                      </div>
                      {item.subtitle && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {item.shortcut && (
                      <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                        {item.shortcut}
                      </kbd>
                    )}
                    {isSelected && (
                      <ArrowRight size={16} className="text-orange-500 animate-pulse" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0a0e17] flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-slate-200 dark:bg-slate-800 rounded text-[10px]">↑↓</kbd> to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-slate-200 dark:bg-slate-800 rounded text-[10px]">↵</kbd> to select
            </span>
          </div>
          <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400 font-medium">
            <Sparkles size={12} /> AutoEra Supervisor Agent System
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;

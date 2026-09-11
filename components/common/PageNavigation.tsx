import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';

interface NavigationTab {
  id: string;
  label: string;
  path: string;
}

interface PageNavigationProps {
  tabs: NavigationTab[];
  engineName: string;
  enginePath: string;
  className?: string;
}

const PageNavigation: React.FC<PageNavigationProps> = ({ 
  tabs, 
  engineName, 
  enginePath,
  className = '' 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Find current tab index
  const currentTabIndex = tabs.findIndex(tab => location.pathname === tab.path);
  const currentTab = tabs[currentTabIndex];

  // Get previous and next tabs
  const previousTab = currentTabIndex > 0 ? tabs[currentTabIndex - 1] : null;
  const nextTab = currentTabIndex < tabs.length - 1 ? tabs[currentTabIndex + 1] : null;

  // Check if we're on the main engine page (overview)
  const isOnOverview = location.pathname === enginePath;

  return (
    <div className={`flex items-center justify-between bg-white dark:bg-[#0c121e] rounded-2xl shadow-xs border border-slate-200/80 dark:border-slate-800/80 p-3 transition-colors ${className}`}>
      {/* Left Navigation */}
      <div className="flex items-center gap-2">
        {/* Home Button - Always visible */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-xl transition-all text-xs font-semibold cursor-pointer"
          title="Go to Dealership Command Center"
        >
          <Home size={15} />
          <span className="hidden sm:inline font-['Outfit']">Command Center</span>
        </button>

        {/* Engine Home Button - Show when not on overview */}
        {!isOnOverview && (
          <button
            onClick={() => navigate(enginePath)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-xl transition-all text-xs font-semibold cursor-pointer"
            title={`Go to ${engineName} Overview`}
          >
            <span className="hidden sm:inline">{engineName}</span>
            <span className="sm:hidden">Overview</span>
          </button>
        )}

        {/* Previous Page Button */}
        {previousTab && (
          <button
            onClick={() => navigate(previousTab.path)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-xl transition-all text-xs font-medium cursor-pointer"
            title={`Previous: ${previousTab.label}`}
          >
            <ChevronLeft size={14} />
            <span className="hidden md:inline">{previousTab.label}</span>
          </button>
        )}
      </div>

      {/* Current Page Indicator */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl">
        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
        <span className="text-xs font-bold text-slate-800 dark:text-white font-['Outfit']">
          {currentTab ? currentTab.label : engineName}
        </span>
        <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
          ({currentTabIndex + 1}/{tabs.length})
        </span>
      </div>

      {/* Right Navigation */}
      <div className="flex items-center gap-2">
        {/* Next Page Button */}
        {nextTab && (
          <button
            onClick={() => navigate(nextTab.path)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-xl transition-all text-xs font-medium cursor-pointer"
            title={`Next: ${nextTab.label}`}
          >
            <span className="hidden md:inline">{nextTab.label}</span>
            <ChevronRight size={14} />
          </button>
        )}

        {/* Page Counter - Mobile */}
        <div className="sm:hidden flex items-center gap-1 text-[10px] font-mono text-slate-500">
          <span>{currentTabIndex + 1}</span>
          <span>/</span>
          <span>{tabs.length}</span>
        </div>
      </div>
    </div>
  );
};

export default PageNavigation;
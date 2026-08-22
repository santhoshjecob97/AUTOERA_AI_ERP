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
    <div className={`flex items-center justify-between bg-white rounded-xl shadow-sm border border-slate-100 p-4 ${className}`}>
      {/* Left Navigation */}
      <div className="flex items-center gap-3">
        {/* Home Button - Always visible */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all text-sm font-medium"
          title="Go to Dashboard"
        >
          <Home size={16} />
          <span className="hidden sm:inline">Dashboard</span>
        </button>

        {/* Engine Home Button - Show when not on overview */}
        {!isOnOverview && (
          <button
            onClick={() => navigate(enginePath)}
            className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all text-sm font-medium"
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
            className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all text-sm font-medium"
            title={`Previous: ${previousTab.label}`}
          >
            <ChevronLeft size={16} />
            <span className="hidden md:inline">{previousTab.label}</span>
            <span className="md:hidden">Previous</span>
          </button>
        )}
      </div>

      {/* Current Page Indicator */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <span className="text-sm font-semibold text-slate-700">
          {currentTab ? currentTab.label : engineName}
        </span>
        <span className="text-xs text-slate-500 hidden sm:inline">
          ({currentTabIndex + 1} of {tabs.length})
        </span>
      </div>

      {/* Right Navigation */}
      <div className="flex items-center gap-3">
        {/* Next Page Button */}
        {nextTab && (
          <button
            onClick={() => navigate(nextTab.path)}
            className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all text-sm font-medium"
            title={`Next: ${nextTab.label}`}
          >
            <span className="hidden md:inline">{nextTab.label}</span>
            <span className="md:hidden">Next</span>
            <ChevronRight size={16} />
          </button>
        )}

        {/* Page Counter - Mobile */}
        <div className="sm:hidden flex items-center gap-1 text-xs text-slate-500">
          <span>{currentTabIndex + 1}</span>
          <span>/</span>
          <span>{tabs.length}</span>
        </div>
      </div>
    </div>
  );
};

export default PageNavigation;
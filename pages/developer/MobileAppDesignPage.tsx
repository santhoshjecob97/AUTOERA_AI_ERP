import React from 'react';
import Section16MobileWorkspace from '../../components/mobile/Section16MobileWorkspace';

const MobileAppDesignPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#07090F] text-slate-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
              <span>PLATFORM SPECIFICATION 16</span>
              <span>/</span>
              <span>MOBILE APP DESIGN</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] tracking-tight flex items-center gap-3">
              5-App Mobile Platform Design
              <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 font-mono font-medium">
                React Native + Expo · 30 Screens · 18 AI-Powered
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Customer, Service Advisor, Fleet Manager, Dealer Executive, and Technician apps — one shared React Native + Expo codebase, role-based screen routing, Expo EAS OTA updates, WatermelonDB offline-first sync, and Tamil/Hindi/English voice support.
            </p>
          </div>
        </div>
        <Section16MobileWorkspace />
      </div>
    </div>
  );
};

export default MobileAppDesignPage;

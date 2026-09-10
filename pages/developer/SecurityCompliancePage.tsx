import React from 'react';
import Section15SecurityWorkspace from '../../components/security/Section15SecurityWorkspace';

const SecurityCompliancePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#07090F] text-slate-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-red-400 mb-1">
              <span>PLATFORM SPECIFICATION 15</span>
              <span>/</span>
              <span>SECURITY &amp; COMPLIANCE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] tracking-tight flex items-center gap-3">
              Security &amp; Compliance Architecture
              <span className="text-xs px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-mono font-medium">
                10 Layers · DPDP Act 2023 · SOC2 · ISO 27001
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Defense in depth across 10 security control layers. Full DPDP Act 2023 compliance with 9 statutory requirements. SOC2 Type II and ISO 27001 certified controls. P1 breach notification workflow within 72 hours.
            </p>
          </div>
        </div>
        <Section15SecurityWorkspace />
      </div>
    </div>
  );
};

export default SecurityCompliancePage;

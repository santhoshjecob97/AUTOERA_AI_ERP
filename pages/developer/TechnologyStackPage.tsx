import React from 'react';
import Section14TechStackWorkspace from '../../components/tech-stack/Section14TechStackWorkspace';

const TechnologyStackPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#07090F] text-slate-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb and Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-orange-400 mb-1">
              <span>PLATFORM SPECIFICATION 14</span>
              <span>/</span>
              <span>TECHNOLOGY STACK</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] tracking-tight flex items-center gap-3">
              Full Technology Stack Decision Matrix
              <span className="text-xs px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 font-mono font-medium">
                18 Layers · DPDP Act 2023 · All ADOPTED
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Complete 18-layer technology stack with rationale, alternatives formally evaluated, trade-off scorecards, India data sovereignty compliance, and full stack health overview.
            </p>
          </div>
        </div>

        {/* Section 14 Interactive Workspace Component */}
        <Section14TechStackWorkspace />
      </div>
    </div>
  );
};

export default TechnologyStackPage;

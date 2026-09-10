import React from 'react';
import Section12DatabaseWorkspace from '../../components/database/Section12DatabaseWorkspace';

const DatabaseArchitecturePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#07090F] text-slate-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb and Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-orange-400 mb-1">
              <span>PLATFORM SPECIFICATION 12</span>
              <span>/</span>
              <span>DATABASE ARCHITECTURE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] tracking-tight flex items-center gap-3">
              Core Database Architecture &amp; ER Topology
              <span className="text-xs px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 font-mono font-medium">
                35 Master Tables · TimescaleDB
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              PostgreSQL 16 hybrid multi-tenant relational engine (Enterprise dedicated schema &amp; SMB Row-Level Security), TimescaleDB IoT &amp; EV battery hypertables, GIN / BRIN indexing, and monthly partitioned audit compliance.
            </p>
          </div>
        </div>

        {/* Section 12 Interactive Workspace Component */}
        <Section12DatabaseWorkspace />
      </div>
    </div>
  );
};

export default DatabaseArchitecturePage;

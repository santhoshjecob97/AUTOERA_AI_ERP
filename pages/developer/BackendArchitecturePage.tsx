import React from 'react';
import Section13BackendWorkspace from '../../components/backend/Section13BackendWorkspace';

const BackendArchitecturePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#07090F] text-slate-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb and Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <span>PLATFORM SPECIFICATION 13</span>
              <span>/</span>
              <span>BACKEND ARCHITECTURE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] tracking-tight flex items-center gap-3">
              Microservices Mesh &amp; Event-Driven Architecture
              <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-mono font-medium">
                16 Services · Apache Kafka (AWS MSK) · REST + GraphQL
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              16 distributed microservices, Apache Kafka event streaming across 9 core topics with multi-tenant partitioning, Kong API Gateway with circuit breakers, and standardized REST envelope &amp; GraphQL design standards.
            </p>
          </div>
        </div>

        {/* Section 13 Interactive Workspace Component */}
        <Section13BackendWorkspace />
      </div>
    </div>
  );
};

export default BackendArchitecturePage;

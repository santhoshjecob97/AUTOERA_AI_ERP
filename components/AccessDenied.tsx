import React from 'react';
import { ShieldAlert, ArrowLeft, Home, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AccessDeniedProps {
  requiredPermission?: string;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({ requiredPermission }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-slate-100 font-sans">
      <div className="max-w-md w-full text-center bg-[#0d1424] border border-red-900/40 rounded-2xl p-8 shadow-2xl space-y-6 animate-fade-in">
        
        <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-800/60 flex items-center justify-center mx-auto text-red-400 shadow-lg shadow-red-950/50">
          <ShieldAlert size={32} />
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-red-400 bg-red-950/60 px-3 py-1 rounded-full border border-red-800/40">
            HTTP 403 &bull; Access Denied
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-3 font-['Outfit']">
            Departmental Restriction
          </h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Your current assigned role ({user?.role || 'User'}) in department <strong className="text-slate-200">{user?.department || 'Operations'}</strong> does not have authorization to access {requiredPermission ? `the "${requiredPermission}" module` : 'this resource'}.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-left space-y-1.5 text-xs text-slate-300">
          <div className="flex justify-between">
            <span className="text-slate-400">Authenticated User:</span>
            <span className="font-semibold text-white">{user?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Tenant Organization:</span>
            <span className="font-semibold text-white">{user?.organizationName || 'Apex Mobility'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Dealership Branch:</span>
            <span className="font-semibold text-white">{user?.branchName || 'Indiranagar Main'}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Go Back</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-xs font-bold text-white shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Home size={14} />
            <span>Authorized Dashboard</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default AccessDenied;

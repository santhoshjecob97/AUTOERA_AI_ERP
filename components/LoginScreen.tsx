import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ShieldCheck, Cpu, ArrowRight, AlertCircle, Sparkles, Building, UserCheck } from 'lucide-react';
import { getDashboardForUser } from '../services/roleRouter';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form States
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const enteredPwd = password.trim();
    const effectivePwd = (enteredPwd === 'AutoEra2026!') ? 'AutoEra2026!Secure' : enteredPwd;

    try {
      const authUser = await login(identifier.trim(), effectivePwd);
      const targetDashboard = getDashboardForUser(authUser);
      navigate(targetDashboard);
    } catch (error: any) {
      setErrorMessage(
        error?.message ||
        error?.details?.error ||
        'Authentication failed. Please verify your credentials or use 1-Click Instant Demo Access.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = async (role: 'gm' | 'sa' | 'tech' | 'sales' | 'fin' | 'ins') => {
    const roleUsernames: Record<string, string> = {
      gm: 'gm_apex',
      sa: 'sa_apex',
      tech: 'tech_apex',
      sales: 'salesm_apex',
      fin: 'fin_apex',
      ins: 'ins_apex',
    };

    const targetUser = roleUsernames[role];
    if (targetUser) {
      setIdentifier(targetUser);
      setPassword('AutoEra2026!Secure');
      setErrorMessage(null);
      setIsLoading(true);
      try {
        const authUser = await login(targetUser, 'AutoEra2026!Secure');
        const targetDashboard = getDashboardForUser(authUser);
        navigate(targetDashboard);
      } catch (error: any) {
        setErrorMessage(error?.message || 'Authentication error.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#070a13] flex flex-col lg:flex-row text-slate-100 font-sans selection:bg-orange-500 selection:text-white">
      
      {/* ─── Left Panel: Branding & Automotive AI Heritage ─── */}
      <div className="lg:w-7/12 bg-gradient-to-br from-[#0c1222] via-[#090d18] to-[#05070d] p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800/60">
        
        {/* Ambient Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute top-1/2 -right-32 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
          
          <div 
            className="absolute inset-0 opacity-[0.03]" 
            style={{ 
              backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, 
              backgroundSize: '24px 24px' 
            }} 
          />
        </div>

        {/* Top Header / Logo Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <img 
              src="/assets/autoera-ai-logo.png" 
              alt="AutoEra AI" 
              className="h-12 w-auto object-contain drop-shadow-[0_4px_12px_rgba(249,115,22,0.25)]"
              style={{ maxHeight: '48px' }}
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-white font-['Outfit']">
                AUTOERA <span className="text-orange-500 font-black">AI</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase text-slate-400 font-semibold">
                Enterprise Dealership ERP
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Pilot Release 2026.1</span>
          </div>
        </div>

        {/* Hero Value Proposition */}
        <div className="relative z-10 my-auto py-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles size={14} className="text-orange-500 flex-shrink-0" />
            The Intelligence Behind Every Drive
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-white mb-6 font-['Outfit']">
            Autonomous AI for <br />
            <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-amber-300 bg-clip-text text-transparent">
              Modern Dealerships
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 font-normal">
            Unified multi-tenant dealership management platform powered by Google Gemini AI, pgvector RAG, and real-time automotive service intelligence.
          </p>

          {/* Value Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 mb-2.5">
                <Cpu size={18} />
              </div>
              <h4 className="font-semibold text-white text-sm">Customer & Vehicle 360</h4>
              <p className="text-xs text-slate-400 mt-1">Unified lifecycle intelligence from booking to workshop delivery.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-2.5">
                <ShieldCheck size={18} />
              </div>
              <h4 className="font-semibold text-white text-sm">Enterprise Multi-Tenancy</h4>
              <p className="text-xs text-slate-400 mt-1">Strict row-level partition, JWT authorization, and action audit logs.</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>&copy; 2026 AutoEra AI Inc. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span>&bull;</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Dealership Security</span>
            <span>&bull;</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Status</span>
          </div>
        </div>
      </div>

      {/* ─── Right Panel: Secure Login Form ─── */}
      <div className="lg:w-5/12 bg-[#090d16] p-8 lg:p-14 flex flex-col justify-center relative overflow-y-auto">
        <div className="max-w-md w-full mx-auto py-6">
          
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2 font-['Outfit']">
              Sign in to AutoEra
            </h2>
            <p className="text-sm text-slate-400">
              Access your dealership operations console and AI copilot.
            </p>
          </div>

          {/* Error Alert Box */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-sm flex items-start gap-3 animate-fade-in">
              <AlertCircle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
              <div className="leading-snug">{errorMessage}</div>
            </div>
          )}

          {/* Instant 1-Click Demo Login Banner */}
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 border border-orange-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-orange-400 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                <Sparkles size={14} className="text-orange-400" />
                Instant Demo Access
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                1-Click Active
              </span>
            </div>
            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              Experience the full AutoEra AI Dealership ERP with General Manager operational permissions:
            </p>
            <button
              type="button"
              onClick={() => handleQuickFill('gm')}
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 active:scale-[0.99] text-white font-bold text-xs rounded-lg shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserCheck size={16} />
              <span>Launch Dealership as General Manager (Instant)</span>
            </button>
            <div className="mt-2.5 text-[11px] text-slate-400 font-mono text-center flex items-center justify-center gap-2">
              <span>Demo Login:</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-semibold border border-slate-700">gm_apex</span>
              <span>/</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-semibold border border-slate-700">AutoEra2026!Secure</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email / Username Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Work Email or Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} style={{ width: '18px', height: '18px' }} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. gm_apex or user@dealership.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm text-white placeholder-slate-500"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert("Please contact your Dealership Administrator or General Manager to reset your password.")}
                  className="text-xs text-orange-400 hover:text-orange-300 transition-colors font-medium"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} style={{ width: '18px', height: '18px' }} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter AutoEra2026!Secure (or click instant access)"
                  className="w-full pl-10 pr-12 py-3 bg-slate-900/90 border border-slate-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm text-white placeholder-slate-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff size={18} style={{ width: '18px', height: '18px' }} />
                  ) : (
                    <Eye size={18} style={{ width: '18px', height: '18px' }} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-sm py-1">
              <label className="flex items-center gap-2.5 cursor-pointer text-slate-300 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-orange-500 focus:ring-orange-500/20"
                />
                <span className="text-xs">Remember this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>

            {/* Dealership Role Quick-Fill Buttons */}
            <div className="pt-6 mt-6 border-t border-slate-800/80">
              <div className="text-center mb-3 flex items-center justify-center gap-2">
                <Building size={14} className="text-orange-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Select Dealership Pilot Role
                </span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('gm')}
                  className="p-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-left transition-all hover:border-orange-500/30 group"
                >
                  <p className="text-xs font-bold text-white group-hover:text-orange-400 truncate">General Manager</p>
                  <p className="text-[10px] text-slate-400">Executive / All</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('sa')}
                  className="p-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-left transition-all hover:border-orange-500/30 group"
                >
                  <p className="text-xs font-bold text-white group-hover:text-orange-400 truncate">Service Advisor</p>
                  <p className="text-[10px] text-slate-400">Job Cards / 360</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('tech')}
                  className="p-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-left transition-all hover:border-orange-500/30 group"
                >
                  <p className="text-xs font-bold text-white group-hover:text-orange-400 truncate">Technician</p>
                  <p className="text-[10px] text-slate-400">Workshop / QC</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('sales')}
                  className="p-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-left transition-all hover:border-orange-500/30 group"
                >
                  <p className="text-xs font-bold text-white group-hover:text-orange-400 truncate">Sales Manager</p>
                  <p className="text-[10px] text-slate-400">Leads / Deals</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('fin')}
                  className="p-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-left transition-all hover:border-orange-500/30 group"
                >
                  <p className="text-xs font-bold text-white group-hover:text-orange-400 truncate">Finance Officer</p>
                  <p className="text-[10px] text-slate-400">Invoices / Ledger</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('ins')}
                  className="p-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-left transition-all hover:border-orange-500/30 group"
                >
                  <p className="text-xs font-bold text-white group-hover:text-orange-400 truncate">Insurance Officer</p>
                  <p className="text-[10px] text-slate-400">Claims / Renewals</p>
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;

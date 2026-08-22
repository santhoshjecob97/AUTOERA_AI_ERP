import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Zap, User as UserIcon, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        // For now, just alert that registration requires Admin setup or implement Supabase SignUp
        // We'll treat registration as 'contact sales' or just try login for prototype flow
        alert("Registration is currently invite-only. Please contact support.");
        // Alternatively, call supabase.auth.signUp() if we implemented it in AuthContext
      }
    } catch (error: any) {
      alert(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">

      {/* Left Panel - Branding */}
      <div className="w-full md:w-5/12 bg-slate-900 text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute left-0 bottom-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
          {/* Soundwave pattern simulation */}
          <div className="absolute top-1/2 left-0 w-full h-32 flex items-center justify-center space-x-1 opacity-20 transform -translate-y-1/2">
            {[...Array(40)].map((_, i) => (
              <div key={i} className="w-1 bg-white rounded-full animate-pulse" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }}></div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Zap size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">AUTOERA AI</span>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Your AI-Powered <br />
            <span className="text-indigo-400">Dealership Engine</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            Streamline operations, boost sales, and automate service workflows with the world's first comprehensive automotive SaaS platform.
          </p>

          <div className="flex gap-2">
            <span className="w-2 h-2 rounded-full bg-white"></span>
            <span className="w-2 h-2 rounded-full bg-slate-600"></span>
            <span className="w-2 h-2 rounded-full bg-slate-600"></span>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          © 2024 AutoEra AI Inc. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full md:w-7/12 bg-white p-8 md:p-12 flex flex-col justify-center overflow-y-auto">
        <div className="max-w-md w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">

          <div className="mb-10 text-center md:text-left">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-4 md:hidden">
              <Zap size={24} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              {isLogin ? 'Log in to your Account' : 'Create Your Account'}
            </h2>
            <p className="text-slate-500">
              {isLogin ? 'Welcome back! Please enter your details.' : 'Get started with your AI Dealership CRM.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {!isLogin && (
              <>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 block">Full Name</label>
                  <div className="relative">
                    <UserIcon size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 block">Company Name</label>
                  <div className="relative">
                    <Briefcase size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Global Motors Inc."
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 block">{isLogin ? 'Email Address' : 'Work Email'}</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder={isLogin ? "Enter your email" : "you@company.com"}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 block">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder={isLogin ? "Enter your password" : "Create a password"}
                  className="w-full pl-10 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 block">Confirm Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                  />
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="text-slate-600">Remember Me</span>
                </label>
                <a href="#" className="text-indigo-600 font-medium hover:text-indigo-700">Forgot Password?</a>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                isLogin ? 'Login' : 'Register'
              )}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500">or</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button type="button" className="flex items-center justify-center gap-3 w-full py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-700 font-medium text-sm">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                Sign in with Google
              </button>
              <button type="button" className="flex items-center justify-center gap-3 w-full py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-700 font-medium text-sm">
                <img src="https://www.svgrepo.com/show/452269/microsoft.svg" className="w-5 h-5" alt="Microsoft" />
                Sign in with Microsoft
              </button>
            </div>

            <div className="text-center mt-6">
              <p className="text-sm text-slate-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"} {' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
                >
                  {isLogin ? 'Register Now' : 'Login'}
                </button>
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;

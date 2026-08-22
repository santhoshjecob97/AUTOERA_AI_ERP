import React, { useState } from 'react';
import { X, Globe, Layout, Palette, Image as ImageIcon, CheckCircle, Save } from 'lucide-react';
import { TenantConfig } from '../types';

interface TenantConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TenantConfigModal: React.FC<TenantConfigModalProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<TenantConfig>({
    id: 'TNT-001',
    companyName: 'Apex Auto Group',
    domain: 'portal.apexauto.com',
    primaryColor: '#4f46e5',
    logoUrl: '',
    status: 'Configuring'
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Layout className="text-blue-400" size={20} />
            <div>
              <h3 className="font-bold">Tenant Configuration</h3>
              <p className="text-xs text-slate-400">White-Label Branding & Domain Settings</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                    <input 
                        type="text" 
                        value={config.companyName}
                        onChange={(e) => setConfig({...config, companyName: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Custom Domain (CNAME)</label>
                    <div className="relative">
                        <Globe size={16} className="absolute left-3 top-2.5 text-slate-400" />
                        <input 
                            type="text" 
                            value={config.domain}
                            onChange={(e) => setConfig({...config, domain: e.target.value})}
                            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono text-slate-600"
                        />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        <CheckCircle size={10} className="text-green-500" /> DNS Validated
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Brand Primary Color</label>
                    <div className="flex items-center gap-2">
                        <input 
                            type="color" 
                            value={config.primaryColor}
                            onChange={(e) => setConfig({...config, primaryColor: e.target.value})}
                            className="h-9 w-9 p-1 rounded cursor-pointer border border-slate-200"
                        />
                        <input 
                            type="text" 
                            value={config.primaryColor}
                            onChange={(e) => setConfig({...config, primaryColor: e.target.value})}
                            className="w-24 px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-mono uppercase"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Upload Logo</label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer">
                        <ImageIcon className="text-slate-400 mb-2" size={24} />
                        <p className="text-xs text-slate-500">Drag & drop or click to upload</p>
                    </div>
                </div>
            </div>

            {/* Live Preview */}
            <div className="bg-slate-100 rounded-xl p-4 border border-slate-200">
                <p className="text-xs font-bold text-slate-500 uppercase mb-3">Live Tenant Preview</p>
                
                {/* Mock Tenant UI */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden h-64 flex flex-col">
                    {/* Header */}
                    <div className="h-10 border-b flex items-center justify-between px-3" style={{ borderBottomColor: '#f1f5f9' }}>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: config.primaryColor }}>
                                {config.companyName.charAt(0)}
                            </div>
                            <span className="text-xs font-bold text-slate-800">{config.companyName}</span>
                        </div>
                        <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                            <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                        </div>
                    </div>
                    
                    {/* Body */}
                    <div className="flex-1 p-3 flex gap-2">
                        <div className="w-12 bg-slate-50 rounded h-full"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-20 rounded bg-slate-50 border border-slate-100 p-2">
                                <div className="text-[10px] text-slate-400">Total Revenue</div>
                                <div className="text-sm font-bold" style={{ color: config.primaryColor }}>₹1.2 Cr</div>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex-1 h-16 rounded bg-slate-50"></div>
                                <div className="flex-1 h-16 rounded bg-slate-50"></div>
                            </div>
                            <button 
                                className="w-full py-1.5 rounded text-[10px] text-white font-medium mt-auto"
                                style={{ backgroundColor: config.primaryColor }}
                            >
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                Cancel
            </button>
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors flex items-center gap-2">
                <Save size={16} /> Save Configuration
            </button>
        </div>
      </div>
    </div>
  );
};

export default TenantConfigModal;
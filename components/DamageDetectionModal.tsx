import React, { useState } from 'react';
import { X, Camera, Scan, AlertTriangle, CheckCircle, Search, FileText } from 'lucide-react';

interface DamageDetectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DamageDetectionModal: React.FC<DamageDetectionModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'upload' | 'scanning' | 'results'>('upload');

  if (!isOpen) return null;

  const handleScan = () => {
    setStep('scanning');
    setTimeout(() => {
        setStep('results');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Scan className="text-blue-400" size={20} />
            <h3 className="font-bold">Deep Scan Damage Detection</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
            {step === 'upload' && (
                <div className="flex flex-col items-center justify-center h-full space-y-6 py-12">
                    <div 
                        onClick={handleScan}
                        className="w-full max-w-lg border-2 border-dashed border-slate-300 rounded-2xl p-12 flex flex-col items-center justify-center bg-white hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                            <Camera size={40} className="text-blue-600" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-800">Upload Vehicle Photos</h4>
                        <p className="text-slate-500 text-sm mt-2">Drag & drop or click to capture 360° view</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
                        <div className="h-24 bg-slate-200 rounded-lg animate-pulse"></div>
                        <div className="h-24 bg-slate-200 rounded-lg animate-pulse"></div>
                        <div className="h-24 bg-slate-200 rounded-lg animate-pulse"></div>
                    </div>
                </div>
            )}

            {step === 'scanning' && (
                <div className="flex flex-col items-center justify-center h-full space-y-6 py-20">
                    <div className="relative">
                        <div className="w-32 h-32 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                        <Scan className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600" size={40} />
                    </div>
                    <div className="text-center">
                        <h4 className="text-lg font-bold text-slate-800">Analyzing Surface Topology...</h4>
                        <p className="text-sm text-slate-500">Detecting dents, scratches, and paint inconsistencies</p>
                    </div>
                </div>
            )}

            {step === 'results' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Visual Result */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                        <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Search size={18} className="text-blue-600"/> Damage Heatmap
                        </h4>
                        <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden group">
                            <img 
                                src="https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&q=80" 
                                alt="Car Analysis" 
                                className="w-full h-full object-cover opacity-60"
                            />
                            {/* Annotations */}
                            <div className="absolute top-1/3 left-1/4 w-8 h-8 bg-red-500/50 rounded-full border-2 border-red-500 animate-ping"></div>
                            <div className="absolute top-1/3 left-1/4 w-8 h-8 bg-red-500/20 rounded-full border border-red-500 flex items-center justify-center text-white text-xs font-bold">1</div>
                            
                            <div className="absolute bottom-1/4 right-1/3 w-6 h-6 bg-orange-500/50 rounded-full border-2 border-orange-500 animate-ping" style={{animationDelay: '0.5s'}}></div>
                            <div className="absolute bottom-1/4 right-1/3 w-6 h-6 bg-orange-500/20 rounded-full border border-orange-500 flex items-center justify-center text-white text-xs font-bold">2</div>
                        </div>
                        <div className="mt-4 flex gap-4 text-xs font-medium">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-red-500 rounded-full"></span> Critical
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-orange-500 rounded-full"></span> Major
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span> Cosmetic
                            </div>
                        </div>
                    </div>

                    {/* Report */}
                    <div className="space-y-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <FileText size={18} className="text-slate-600"/> Damage Report
                            </h4>
                            <div className="space-y-3">
                                <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-bold text-red-900">1. Left Front Fender Dent</p>
                                        <p className="text-xs text-red-700">Deep impact {'>'} 5mm depth. Paint cracked.</p>
                                    </div>
                                    <span className="text-xs font-bold bg-white px-2 py-1 rounded border border-red-200 text-red-800">₹8,500</span>
                                </div>
                                <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-bold text-orange-900">2. Side Skirt Scratches</p>
                                        <p className="text-xs text-orange-700">Surface abrasion. Buffing recommended.</p>
                                    </div>
                                    <span className="text-xs font-bold bg-white px-2 py-1 rounded border border-orange-200 text-orange-800">₹2,200</span>
                                </div>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                                <span className="text-sm text-slate-500">Estimated Total</span>
                                <span className="text-xl font-bold text-slate-900">₹10,700</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">
                                Rescan
                            </button>
                            <button className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                                <CheckCircle size={18} /> Generate Quote
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default DamageDetectionModal;

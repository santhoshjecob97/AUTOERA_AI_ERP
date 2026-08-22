import React from 'react';
import { X, Play, RefreshCw, Layers, Info, ChevronRight } from 'lucide-react';

interface VirtualShowroomModalProps {
  isOpen: boolean;
  onClose: () => void;
  carModel?: string;
}

const VirtualShowroomModal: React.FC<VirtualShowroomModalProps> = ({ isOpen, onClose, carModel = "2024 Tata Nexon EV" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-slate-900 w-full max-w-5xl aspect-video rounded-2xl shadow-2xl overflow-hidden relative flex flex-col">
        
        {/* Header Overlay */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-10 bg-gradient-to-b from-black/60 to-transparent">
          <div>
            <div className="flex items-center gap-2">
               <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500 text-white uppercase tracking-wider">360° Showroom Engine</span>
               <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500 text-white uppercase tracking-wider">Live Inventory</span>
            </div>
            <h2 className="text-3xl font-bold text-white mt-2">{carModel}</h2>
            <p className="text-slate-300 text-sm">Fearless Purple • XZ+ Lux • 45kWh Battery</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* 3D Viewport Placeholder */}
        <div className="flex-1 bg-gradient-to-br from-slate-800 to-slate-900 relative flex items-center justify-center overflow-hidden group">
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-20" 
                 style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px', transform: 'perspective(500px) rotateX(60deg) scale(2)' }}>
            </div>
            
            <div className="relative z-0 transform transition-transform duration-700 group-hover:scale-105">
                <div className="w-[600px] h-[300px] bg-indigo-500/20 rounded-full blur-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="text-white text-center">
                    <RefreshCw size={64} className="mx-auto text-indigo-400 opacity-50 mb-4 animate-spin-slow" />
                    <p className="text-lg font-light tracking-widest uppercase">Interactive 3D Model Loading</p>
                </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
                 <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 flex items-center justify-center text-white transition-all">
                    <RefreshCw size={20} />
                 </button>
                 <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 flex items-center justify-center text-white transition-all">
                    <Layers size={20} />
                 </button>
                 <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 flex items-center justify-center text-white transition-all">
                    <Info size={20} />
                 </button>
            </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-slate-900 p-6 border-t border-slate-800 flex justify-between items-center">
             <div className="flex gap-6">
                <div className="text-center">
                    <p className="text-xs text-slate-500 uppercase">Range</p>
                    <p className="text-xl font-bold text-white">453 km</p>
                </div>
                <div className="text-center border-l border-slate-700 pl-6">
                    <p className="text-xs text-slate-500 uppercase">0-100 km/h</p>
                    <p className="text-xl font-bold text-white">8.9s</p>
                </div>
                <div className="text-center border-l border-slate-700 pl-6">
                    <p className="text-xs text-slate-500 uppercase">Charging</p>
                    <p className="text-xl font-bold text-white">56 min</p>
                </div>
             </div>

             <div className="flex gap-4">
                 <button className="px-6 py-3 rounded-xl border border-indigo-500 text-indigo-400 font-bold hover:bg-indigo-950 transition-colors uppercase text-sm tracking-wide">
                    Customize Config
                 </button>
                 <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center gap-2 uppercase text-sm tracking-wide group">
                    <Play size={18} className="fill-current" />
                    Start Virtual Test Drive
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                 </button>
             </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualShowroomModal;
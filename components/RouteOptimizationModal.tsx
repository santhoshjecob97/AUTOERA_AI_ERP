import React, { useState } from 'react';
import { X, MapPin, Navigation, Zap, Clock, Leaf } from 'lucide-react';
import { FleetVehicle } from '../types';

interface RouteOptimizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: FleetVehicle | null;
}

const RouteOptimizationModal: React.FC<RouteOptimizationModalProps> = ({ isOpen, onClose, vehicle }) => {
  const [calculating, setCalculating] = useState(false);
  const [routeFound, setRouteFound] = useState(false);

  if (!isOpen || !vehicle) return null;

  const handleOptimize = () => {
    setCalculating(true);
    setTimeout(() => {
        setCalculating(false);
        setRouteFound(true);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Navigation className="text-blue-400" size={24} />
            <div>
              <h3 className="font-bold text-lg">EV Range & Route Optimizer</h3>
              <p className="text-xs text-blue-200 opacity-90">{vehicle.model} (Range: {vehicle.range}km)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-4">
                <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-3 text-green-600" />
                    <input type="text" value="Current Location (Warehouse A)" readOnly className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600" />
                </div>
                <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-3 text-red-600" />
                    <input type="text" placeholder="Enter Destination" className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" defaultValue="Distribution Center B, Mumbai" />
                </div>
            </div>

            {!routeFound && !calculating && (
                 <button onClick={handleOptimize} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                    <Zap size={18} /> Calculate Optimized Route
                 </button>
            )}

            {calculating && (
                <div className="py-8 text-center space-y-3">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                    <p className="text-sm font-bold text-slate-700">AI Analyzing Topography & Traffic...</p>
                    <p className="text-xs text-slate-500">Optimizing for minimal energy consumption</p>
                </div>
            )}

            {routeFound && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-slate-100 rounded-xl h-48 w-full flex items-center justify-center relative overflow-hidden border border-slate-200">
                        {/* Mock Map View */}
                        <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/OpenStreetMap_Logo_2011.svg/1024px-OpenStreetMap_Logo_2011.svg.png')] bg-cover bg-center grayscale"></div>
                        <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-md z-10"></div>
                        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-md z-10"></div>
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <path d="M 150 120 Q 300 150 450 80" stroke="#3b82f6" strokeWidth="4" fill="none" strokeDasharray="5,5" className="animate-pulse" />
                        </svg>
                        <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm z-10 absolute top-[40%] left-[45%]">
                            142 km • 2h 15m
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-green-50 p-3 rounded-lg border border-green-100 text-center">
                            <Leaf size={18} className="mx-auto text-green-600 mb-1" />
                            <p className="text-xs text-slate-500 uppercase font-semibold">CO2 Saved</p>
                            <p className="text-lg font-bold text-green-700">12.5 kg</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-center">
                            <Zap size={18} className="mx-auto text-blue-600 mb-1" />
                            <p className="text-xs text-slate-500 uppercase font-semibold">Energy</p>
                            <p className="text-lg font-bold text-blue-700">24 kWh</p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg border border-purple-100 text-center">
                            <Clock size={18} className="mx-auto text-purple-600 mb-1" />
                            <p className="text-xs text-slate-500 uppercase font-semibold">ETA</p>
                            <p className="text-lg font-bold text-purple-700">14:30</p>
                        </div>
                    </div>

                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 flex items-start gap-3">
                         <MapPin size={18} className="text-orange-600 mt-0.5" />
                         <div>
                            <p className="text-sm font-bold text-orange-900">Charging Stop Recommended</p>
                            <p className="text-xs text-orange-700">Stop at 'Tata Power Station - Highway 4' for 15 mins to ensure 20% buffer on arrival.</p>
                         </div>
                    </div>
                    
                    <button className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                        <Navigation size={18} /> Start Navigation
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default RouteOptimizationModal;
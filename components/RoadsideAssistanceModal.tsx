import React, { useState } from 'react';
import { X, MapPin, Truck, Phone, Navigation, Clock, User, AlertCircle } from 'lucide-react';
import { RoadsideRequest } from '../types';

interface RoadsideAssistanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockRequests: RoadsideRequest[] = [
    { id: 'RSA-001', customer: 'Anjali D.', location: 'Mumbai-Pune Expressway, km 42', issue: 'Flat Tire', status: 'Searching', eta: '--', vehicleType: 'SUV' },
    { id: 'RSA-002', customer: 'Vikram S.', location: 'MG Road, Pune', issue: 'Battery Dead', status: 'En Route', eta: '12 mins', technician: 'Raju Mechanic', vehicleType: 'Sedan' },
];

const RoadsideAssistanceModal: React.FC<RoadsideAssistanceModalProps> = ({ isOpen, onClose }) => {
  const [requests, setRequests] = useState(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<RoadsideRequest | null>(null);

  if (!isOpen) return null;

  const handleDispatch = (id: string) => {
      setRequests(prev => prev.map(req => 
          req.id === id ? { ...req, status: 'Dispatched', technician: 'Auto-Assigned Tech', eta: '15 mins' } : req
      ));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 h-[85vh] flex flex-col">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-red-600 text-white">
          <div className="flex items-center gap-2">
            <Truck className="text-white" size={24} />
            <div>
              <h3 className="font-bold text-lg">Roadside Assistance Dispatch</h3>
              <p className="text-xs text-red-100 opacity-90">Emergency Response Engine</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
            {/* Sidebar List */}
            <div className="w-1/3 border-r border-slate-200 bg-slate-50 overflow-y-auto">
                <div className="p-4">
                    <h4 className="font-bold text-slate-700 mb-3 flex items-center justify-between">
                        Active Requests
                        <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">{requests.length}</span>
                    </h4>
                    <div className="space-y-3">
                        {requests.map(req => (
                            <div 
                                key={req.id} 
                                onClick={() => setSelectedRequest(req)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedRequest?.id === req.id ? 'bg-white border-red-500 shadow-md' : 'bg-white border-slate-200 hover:border-red-300'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-slate-900">{req.customer}</span>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${
                                        req.status === 'Searching' ? 'bg-red-100 text-red-700 animate-pulse' : 
                                        req.status === 'En Route' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                    }`}>
                                        {req.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                                    <AlertCircle size={12} className="text-red-500"/>
                                    {req.issue} • {req.vehicleType}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <MapPin size={12} />
                                    <span className="truncate">{req.location}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Map Area */}
            <div className="flex-1 bg-slate-200 relative flex flex-col">
                {/* Mock Map Background */}
                <div className="absolute inset-0 opacity-40 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/OpenStreetMap_Logo_2011.svg/1024px-OpenStreetMap_Logo_2011.svg.png')] bg-cover bg-center grayscale"></div>
                
                {selectedRequest ? (
                    <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
                        {/* Location Pin */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce pointer-events-auto">
                            <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg mb-2 whitespace-nowrap">
                                {selectedRequest.customer}
                            </div>
                            <MapPin size={40} className="text-red-600 drop-shadow-xl fill-white" />
                        </div>

                        {/* Dispatch Panel */}
                        <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-6 pointer-events-auto mt-auto mx-auto w-full max-w-2xl">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">{selectedRequest.issue}</h2>
                                    <p className="text-sm text-slate-500 flex items-center gap-1">
                                        <Navigation size={14}/> {selectedRequest.location}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500 uppercase font-semibold">ETA</p>
                                    <p className="text-2xl font-bold text-slate-900">{selectedRequest.eta}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                                    <p className="text-xs text-slate-500">Tech Availability</p>
                                    <p className="font-bold text-green-600">3 Nearby</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                                    <p className="text-xs text-slate-500">Traffic Status</p>
                                    <p className="font-bold text-orange-600">Moderate</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                                    <p className="text-xs text-slate-500">Towing Needed</p>
                                    <p className="font-bold text-slate-900">{selectedRequest.issue.includes('Flat') ? 'No' : 'Check'}</p>
                                </div>
                            </div>

                            {selectedRequest.status === 'Searching' ? (
                                <button 
                                    onClick={() => handleDispatch(selectedRequest.id)}
                                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-200"
                                >
                                    <Truck size={18} /> Auto-Dispatch Nearest Technician
                                </button>
                            ) : (
                                <div className="flex gap-3">
                                    <button className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                                        <Phone size={18} /> Call Technician
                                    </button>
                                    <button className="flex-1 py-3 border border-slate-200 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 bg-white">
                                        Update Status
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-500">
                        <p>Select a request to view live dispatch map</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default RoadsideAssistanceModal;

import React, { useState } from 'react';
import { Calendar, Clock, User, Filter, ChevronLeft, ChevronRight, Plus, Check } from 'lucide-react';
import { Appointment } from '../types';

const mockAppointments: Appointment[] = [
    { id: '1', customerName: 'John Doe', vehicle: 'Toyota Camry', serviceType: 'Oil Change', date: new Date(), startTime: '09:00', duration: 60, technicianId: 'Tech1', status: 'Completed' },
    { id: '2', customerName: 'Maria Garcia', vehicle: 'Honda CR-V', serviceType: 'Brake Inspection', date: new Date(), startTime: '10:00', duration: 90, technicianId: 'Tech2', status: 'In Progress' },
    { id: '3', customerName: 'Robert Smith', vehicle: 'Ford F-150', serviceType: 'Tire Rotation', date: new Date(), startTime: '11:30', duration: 45, technicianId: 'Tech1', status: 'Scheduled' },
    { id: '4', customerName: 'Alice Johnson', vehicle: 'Tesla Model 3', serviceType: 'General Service', date: new Date(), startTime: '13:00', duration: 120, technicianId: 'Tech3', status: 'Scheduled' },
];

const technicians = ['John Davis', 'Sarah Miller', 'Mike Wilson'];

const ServiceScheduler: React.FC = () => {
    const [view, setView] = useState<'Day' | 'Week'>('Day');
    
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full flex flex-col">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <Calendar size={18} className="text-orange-600"/> Appointments Calendar
                    </h3>
                    <div className="flex bg-slate-100 rounded-lg p-1">
                        <button 
                            onClick={() => setView('Day')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${view === 'Day' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Day
                        </button>
                        <button 
                            onClick={() => setView('Week')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${view === 'Week' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Week
                        </button>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
                        <ChevronLeft size={16} />
                    </button>
                    <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
                        <ChevronRight size={16} />
                    </button>
                    <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                        <Plus size={16} /> Quick Book
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Filter */}
                <div className="w-64 border-r border-slate-100 p-4 bg-slate-50 overflow-y-auto hidden md:block">
                    <div className="mb-6">
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Technicians</h4>
                        <div className="space-y-2">
                            {technicians.map((tech, i) => (
                                <label key={i} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:bg-slate-100 p-2 rounded">
                                    <input type="checkbox" defaultChecked className="rounded text-orange-600 focus:ring-orange-500" />
                                    {tech}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Status Legend</h4>
                        <div className="space-y-2 text-xs">
                            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span> Confirmed</div>
                            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span> In Service</div>
                            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-400"></span> Completed</div>
                            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span> No-Show</div>
                        </div>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="flex-1 p-4 overflow-y-auto">
                    <div className="grid grid-cols-1 gap-4">
                        {/* Time slots */}
                        {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM'].map((time) => (
                            <div key={time} className="flex border-t border-slate-100 py-4 min-h-[100px]">
                                <div className="w-20 text-xs text-slate-400 font-medium pt-1">{time}</div>
                                <div className="flex-1 relative">
                                    {/* Mock placement of appointments */}
                                    {mockAppointments.filter(app => app.startTime + (parseInt(app.startTime) < 12 ? ' AM' : ' PM') === time || (parseInt(app.startTime) === 13 && time === '01:00 PM')).map(app => (
                                        <div key={app.id} className={`absolute top-0 left-0 w-[90%] p-3 rounded-lg border-l-4 shadow-sm text-xs transition-all hover:scale-[1.01] cursor-pointer
                                            ${app.status === 'Completed' ? 'bg-slate-100 border-slate-400 text-slate-600' :
                                              app.status === 'In Progress' ? 'bg-blue-50 border-blue-500 text-blue-700' :
                                              'bg-green-50 border-green-500 text-green-700'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-bold">{app.customerName}</span>
                                                <span className="opacity-75">{app.duration} min</span>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-90 mb-1">
                                                <User size={12}/> {app.vehicle}
                                            </div>
                                            <div className="opacity-75 italic">{app.serviceType}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceScheduler;
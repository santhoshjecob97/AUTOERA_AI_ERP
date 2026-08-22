import React, { useState } from 'react';
import { User, Award, Activity, MessageSquare, Phone, Star, Wrench } from 'lucide-react';
import StatCard from '../../components/StatCard';

interface Technician {
    id: string;
    name: string;
    role: string;
    status: 'active' | 'break' | 'leave';
    currentJob?: string;
    skills: string[];
    efficiency: number;
    certifications: number;
    rating: number;
}

const technicians: Technician[] = [
    { id: 'T-1', name: 'Amit Kumar', role: 'Senior Technician', status: 'active', currentJob: 'Innova - Brake Pad Replacement', skills: ['Brakes', 'Suspension', 'Diagnostics'], efficiency: 95, certifications: 8, rating: 4.9 },
    { id: 'T-2', name: 'Rajesh Singh', role: 'Lead Mechanic', status: 'active', currentJob: 'City - Oil Change', skills: ['Engine', 'Transmission', 'HVAC'], efficiency: 92, certifications: 12, rating: 4.8 },
    { id: 'T-3', name: 'Suresh Menon', role: 'Diagnostic Specialist', status: 'active', currentJob: 'Creta - Engine Diagnosis', skills: ['Electrical', 'ECU', 'Diagnostics'], efficiency: 90, certifications: 15, rating: 5.0 },
    { id: 'T-4', name: 'Vikram Das', role: 'Junior Technician', status: 'break', skills: ['Tires', 'Lube', 'Basic Service'], efficiency: 85, certifications: 3, rating: 4.5 },
    { id: 'T-5', name: 'Anjali P.', role: 'EV Specialist', status: 'active', currentJob: 'Nexon EV - Battery Check', skills: ['EV Battery', 'High Voltage', 'Software'], efficiency: 98, certifications: 10, rating: 4.9 },
    { id: 'T-6', name: 'Rahul V.', role: 'Body Shop', status: 'leave', skills: ['Dent', 'Paint', 'Welding'], efficiency: 88, certifications: 5, rating: 4.6 },
];

const ServiceTechniciansPage: React.FC = () => {
    const [filter, setFilter] = useState('all');

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700';
            case 'break': return 'bg-orange-100 text-orange-700';
            case 'leave': return 'bg-slate-100 text-slate-600';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Active Techs" value="4" trend="/6 Total" icon={<User size={20} />} color="blue" />
                <StatCard title="Avg Efficiency" value="92%" trend="+2.4%" trendUp={true} icon={<Activity size={20} />} color="green" />
                <StatCard title="Avg Rating" value="4.8" icon={<Star size={20} />} color="orange" />
                <StatCard title="Certifications" value="53" icon={<Award size={20} />} color="purple" />
            </div>

            {/* Filter Bar */}
            <div className="flex gap-2 bg-white p-2 rounded-lg border border-slate-200 w-fit">
                {['all', 'active', 'break'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${filter === f ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {technicians.filter(t => filter === 'all' || t.status === filter).map(tech => (
                    <div key={tech.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-lg">
                                    {tech.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{tech.name}</h3>
                                    <div className="text-xs text-slate-500">{tech.role}</div>
                                </div>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusColor(tech.status)}`}>
                                {tech.status}
                            </span>
                        </div>

                        <div className="space-y-4">
                            {/* Current Job */}
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                                    <Wrench size={12} /> Current Assignment
                                </div>
                                <div className="text-sm font-medium text-slate-800 line-clamp-1">
                                    {tech.currentJob || 'No active assignment'}
                                </div>
                            </div>

                            {/* Skills */}
                            <div>
                                <div className="text-xs text-slate-400 mb-2">Skills & Certifications</div>
                                <div className="flex flex-wrap gap-1.5">
                                    {tech.skills.map(skill => (
                                        <span key={skill} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-100">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Metrics */}
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                                <div className="text-center">
                                    <div className="text-xs text-slate-400">Efficiency</div>
                                    <div className="font-bold text-slate-700">{tech.efficiency}%</div>
                                </div>
                                <div className="text-center border-l border-slate-100">
                                    <div className="text-xs text-slate-400">Rating</div>
                                    <div className="font-bold text-slate-700 flex items-center justify-center gap-1">
                                        {tech.rating} <Star size={10} className="fill-orange-400 text-orange-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button className="flex-1 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2 text-sm font-medium">
                                    <MessageSquare size={16} /> Chat
                                </button>
                                <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                                    View Profile
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServiceTechniciansPage;

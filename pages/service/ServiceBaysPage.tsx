import React, { useState } from 'react';
import { LayoutGrid, Timer, Wrench, AlertCircle, CheckCircle, Plus, MoreVertical, X } from 'lucide-react';
import StatCard from '../../components/StatCard';
import PageNavigation from '../../components/common/PageNavigation';

interface Job {
    id: string;
    vehicle: string;
    service: string;
    duration: string;
}

interface Bay {
    id: string;
    name: string;
    status: 'free' | 'occupied' | 'maintenance';
    currentJob?: Job;
    technician?: string;
    startTime?: string;
    efficiency: number;
}

const initialBays: Bay[] = [
    { id: '1', name: 'Bay 1 (General)', status: 'occupied', currentJob: { id: 'J-101', vehicle: 'Honda City', service: 'Oil Change', duration: '45m' }, technician: 'Amit K.', startTime: '10:00 AM', efficiency: 95 },
    { id: '2', name: 'Bay 2 (General)', status: 'free', efficiency: 88 },
    { id: '3', name: 'Bay 3 (Lift)', status: 'occupied', currentJob: { id: 'J-102', vehicle: 'Toyota Innova', service: 'Brake Pad Replacement', duration: '2h' }, technician: 'Rajesh S.', startTime: '09:30 AM', efficiency: 92 },
    { id: '4', name: 'Bay 4 (Lift)', status: 'maintenance', efficiency: 0 },
    { id: '5', name: 'Bay 5 (Express)', status: 'free', efficiency: 98 },
    { id: '6', name: 'Bay 6 (Diagnostic)', status: 'occupied', currentJob: { id: 'J-103', vehicle: 'Hyundai Creta', service: 'Engine Diagnosis', duration: '1.5h' }, technician: 'Suresh M.', startTime: '10:15 AM', efficiency: 90 },
];

const pendingJobs: Job[] = [
    { id: 'J-104', vehicle: 'Maruti WagorR', service: 'General Service', duration: '3h' },
    { id: 'J-105', vehicle: 'Tata Nexon', service: 'AC Repair', duration: '1h' },
    { id: 'J-106', vehicle: 'Mahindra Thar', service: 'Wheel Alignment', duration: '45m' },
];

const ServiceBaysPage: React.FC = () => {
    const [bays, setBays] = useState<Bay[]>(initialBays);
    const [queue, setQueue] = useState<Job[]>(pendingJobs);
    const [selectedBay, setSelectedBay] = useState<Bay | null>(null);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

    const stats = {
        total: bays.length,
        occupied: bays.filter(b => b.status === 'occupied').length,
        free: bays.filter(b => b.status === 'free').length,
        maintenance: bays.filter(b => b.status === 'maintenance').length,
    };

    const handleBayClick = (bay: Bay) => {
        if (bay.status === 'free') {
            setSelectedBay(bay);
            setIsAssignModalOpen(true);
        } else if (bay.status === 'occupied') {
            // Option to complete job
            if (confirm(`Complete job ${bay.currentJob?.vehicle} at ${bay.name}?`)) {
                setBays(bays.map(b => b.id === bay.id ? { ...b, status: 'free', currentJob: undefined, technician: undefined, startTime: undefined } : b));
            }
        }
    };

    const assignJob = (job: Job) => {
        if (!selectedBay) return;

        setBays(bays.map(b => b.id === selectedBay.id ? {
            ...b,
            status: 'occupied',
            currentJob: job,
            technician: 'Auto-Assigned', // specific tech assignment logic can be added
            startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        } : b));

        setQueue(queue.filter(q => q.id !== job.id));
        setIsAssignModalOpen(false);
        setSelectedBay(null);
    };

    // Define tabs for navigation
    const tabs = [
        { id: 'overview', label: 'Overview', path: '/service' },
        { id: 'bays', label: 'Service Bays', path: '/service/bays' },
        { id: 'maintenance', label: 'Maintenance', path: '/service/maintenance' },
        { id: 'technicians', label: 'Technicians', path: '/service/technicians' },
        { id: 'inventory', label: 'Inventory', path: '/service/inventory' },
        { id: 'operations', label: 'Operations', path: '/service/operations' },
        { id: 'scheduler', label: 'Scheduler', path: '/service/scheduler' },
        { id: 'communication', label: 'Communication', path: '/service/communication' },
        { id: 'quality', label: 'Quality', path: '/service/quality' },
        { id: 'emergency', label: 'Emergency', path: '/service/emergency' },
        { id: 'analytics', label: 'Analytics', path: '/service/analytics' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Page Navigation */}
            <PageNavigation
                tabs={tabs}
                engineName="Service AI Engine"
                enginePath="/service"
            />

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Total Bays" value={stats.total.toString()} icon={<LayoutGrid size={20} />} color="blue" />
                <StatCard title="Occupied" value={stats.occupied.toString()} trend={`${Math.round((stats.occupied / stats.total) * 100)}%`} trendUp={true} icon={<Wrench size={20} />} color="orange" />
                <StatCard title="Available" value={stats.free.toString()} icon={<CheckCircle size={20} />} color="green" />
                <StatCard title="Maintenance" value={stats.maintenance.toString()} icon={<AlertCircle size={20} />} color="red" />
            </div>

            <div className="flex flex-col lg:flex-row gap-6">

                {/* Main Bay Grid */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800 text-lg">Bay Overview</h3>
                        <div className="flex gap-2 text-sm text-slate-500">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Free</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span> Occupied</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Maintenance</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {bays.map(bay => (
                            <div
                                key={bay.id}
                                onClick={() => handleBayClick(bay)}
                                className={`
                            relative h-48 rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-md group
                            ${bay.status === 'free' ? 'border-green-100 bg-green-50/30 hover:border-green-300' : ''}
                            ${bay.status === 'occupied' ? 'border-orange-100 bg-orange-50/30 hover:border-orange-300' : ''}
                            ${bay.status === 'maintenance' ? 'border-red-100 bg-red-50/30 hover:border-red-300' : ''}
                        `}
                            >
                                {/* Header */}
                                <div className="flex justify-between items-start mb-3">
                                    <span className="font-bold text-slate-700">{bay.name}</span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase
                                ${bay.status === 'free' ? 'bg-green-100 text-green-700' : ''}
                                ${bay.status === 'occupied' ? 'bg-orange-100 text-orange-700' : ''}
                                ${bay.status === 'maintenance' ? 'bg-red-100 text-red-700' : ''}
                            `}>
                                        {bay.status}
                                    </span>
                                </div>

                                {/* Content */}
                                {bay.status === 'occupied' && bay.currentJob ? (
                                    <div className="space-y-2">
                                        <div>
                                            <div className="text-xs text-slate-500">Vehicle</div>
                                            <div className="font-semibold text-slate-900">{bay.currentJob.vehicle}</div>
                                        </div>
                                        <div className="flex justify-between">
                                            <div>
                                                <div className="text-xs text-slate-500">Service</div>
                                                <div className="text-sm text-slate-800">{bay.currentJob.service}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-slate-500">Tech</div>
                                                <div className="text-sm text-slate-800">{bay.technician}</div>
                                            </div>
                                        </div>
                                        <div className="pt-2 flex items-center gap-2 text-xs text-orange-600 font-medium bg-orange-50 p-2 rounded">
                                            <Timer size={14} /> Started: {bay.startTime || '10:00 AM'}
                                        </div>
                                    </div>
                                ) : bay.status === 'free' ? (
                                    <div className="h-full flex flex-col items-center justify-center text-green-600 opacity-60 group-hover:opacity-100 transition-opacity pb-6">
                                        <Plus size={32} />
                                        <span className="text-sm font-medium mt-1">Assign Job</span>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-red-400 pb-6">
                                        <Wrench size={32} />
                                        <span className="text-sm font-medium mt-1">Under Maintenance</span>
                                    </div>
                                )}

                                {/* Efficiency Bar at bottom */}
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                                        <span>Efficiency</span>
                                        <span>{bay.efficiency}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${bay.efficiency}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Sidebar: Job Queue */}
                <div className="w-full lg:w-80 shrink-0">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 h-full">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Timer size={18} className="text-slate-500" /> Pending Queue ({queue.length})
                        </h3>
                        <div className="space-y-3">
                            {queue.length === 0 ? (
                                <div className="text-center text-slate-400 py-8 text-sm">No jobs in queue</div>
                            ) : (
                                queue.map(job => (
                                    <div key={job.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-indigo-200 transition-colors group cursor-grab active:cursor-grabbing">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-semibold text-slate-800 text-sm">{job.vehicle}</span>
                                            <span className="text-xs bg-white border px-1.5 rounded text-slate-500">{job.duration}</span>
                                        </div>
                                        <div className="text-xs text-slate-500 mb-2">{job.service}</div>
                                        <button
                                            onClick={() => {
                                                // Auto-find first free bay
                                                const freeBay = bays.find(b => b.status === 'free');
                                                if (freeBay) {
                                                    setSelectedBay(freeBay);
                                                    assignJob(job);
                                                    // hack to trigger assign logic immediately correctly
                                                    // Ideally we'd reuse the assignJob function differently
                                                } else {
                                                    alert("No free bays available!");
                                                }
                                            }}
                                            className="w-full py-1 text-xs bg-white border border-slate-200 text-indigo-600 rounded hover:bg-indigo-50 font-medium"
                                        >
                                            Quick Assign
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Assign Modal (Simple) */}
            {isAssignModalOpen && selectedBay && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h3 className="font-bold text-lg mb-4">Assign Job to {selectedBay?.name}</h3>
                        <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">
                            {queue.map(job => (
                                <button
                                    key={job.id}
                                    onClick={() => assignJob(job)}
                                    className="w-full text-left p-3 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-indigo-300 transition-all"
                                >
                                    <div className="font-bold text-slate-800">{job.vehicle}</div>
                                    <div className="text-sm text-slate-500">{job.service} • {job.duration}</div>
                                </button>
                            ))}
                            {queue.length === 0 && <p className="text-slate-500 text-center py-4">No pending jobs.</p>}
                        </div>
                        <div className="flex justify-end">
                            <button onClick={() => setIsAssignModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ServiceBaysPage;

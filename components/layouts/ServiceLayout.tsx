import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    Wrench, LayoutGrid, AlertTriangle, User, Box, Calendar,
    MessageSquare, ShieldCheck, Truck, BarChart2, Activity
} from 'lucide-react';

const ServiceLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname;

    // Determine active tab based on current path
    const getActiveTab = () => {
        if (path === '/service') return 'overview';
        if (path.includes('/service/bays')) return 'bays';
        if (path.includes('/service/maintenance')) return 'maintenance';
        if (path.includes('/service/technicians')) return 'technicians';
        if (path.includes('/service/inventory')) return 'partsInventory';
        if (path.includes('/service/operations')) return 'operations';
        if (path.includes('/service/scheduler')) return 'scheduling';
        if (path.includes('/service/communication')) return 'communication';
        if (path.includes('/service/quality')) return 'quality';
        if (path.includes('/service/emergency')) return 'emergency';
        if (path.includes('/service/analytics')) return 'analytics';
        return 'overview';
    };

    const activeTab = getActiveTab();

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Activity, path: '/service' },
        { id: 'bays', label: 'Service Bays', icon: LayoutGrid, path: '/service/bays' },
        { id: 'maintenance', label: 'Predictive Maintenance', icon: AlertTriangle, path: '/service/maintenance' },
        { id: 'technicians', label: 'Technicians', icon: User, path: '/service/technicians' },
        { id: 'partsInventory', label: 'Parts Inventory', icon: Box, path: '/service/inventory' },
        { id: 'operations', label: 'Operations', icon: Wrench, path: '/service/operations' },
        { id: 'scheduling', label: 'Scheduler', icon: Calendar, path: '/service/scheduler' },
        { id: 'communication', label: 'Comm. & Voice', icon: MessageSquare, path: '/service/communication' },
        { id: 'quality', label: 'Quality & CX', icon: ShieldCheck, path: '/service/quality' },
        { id: 'emergency', label: 'Emergency', icon: Truck, path: '/service/emergency' },
        { id: 'analytics', label: 'Analytics', icon: BarChart2, path: '/service/analytics' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col p-6">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Wrench className="text-orange-600" /> Service AI Engine
                    </h1>
                    <p className="text-slate-500">Unified Operations: Predictive Maintenance, Scheduling & Quality.</p>
                </div>

                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200 w-full xl:w-auto overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => navigate(tab.path)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-orange-600 text-white shadow-md'
                                    : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <tab.icon size={16} /> {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 min-h-0 overflow-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default ServiceLayout;

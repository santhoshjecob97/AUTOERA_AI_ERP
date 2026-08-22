import React, { useState } from 'react';
import { Truck, Clock, AlertTriangle, User } from 'lucide-react';
import StatCard from '../../components/StatCard';
import RoadsideAssistanceModal from '../../components/RoadsideAssistanceModal';

const ServiceEmergencyPage: React.FC = () => {
    const [isRoadsideModalOpen, setIsRoadsideModalOpen] = useState(false);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-red-50 border border-red-100 rounded-xl p-6 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-xl text-red-900">Roadside Assistance Dispatch</h3>
                    <p className="text-red-700 mt-1">Manage emergency requests, track technician location, and ensure rapid response.</p>
                </div>
                <button
                    onClick={() => setIsRoadsideModalOpen(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-red-200 flex items-center gap-2"
                >
                    <Truck size={20} /> Open Dispatch Console
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Avg Response Time" value="12 mins" trend="-2 mins" trendUp={true} icon={<Clock size={24} />} color="green" />
                <StatCard title="Active Requests" value="3" trend="High Demand" icon={<AlertTriangle size={24} />} color="red" />
                <StatCard title="Technicians Available" value="8" icon={<User size={24} />} color="blue" />
            </div>

            <RoadsideAssistanceModal
                isOpen={isRoadsideModalOpen}
                onClose={() => setIsRoadsideModalOpen(false)}
            />
        </div>
    );
};

export default ServiceEmergencyPage;

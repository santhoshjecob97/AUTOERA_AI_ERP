import React from 'react';
import ServiceInventory from '../../components/ServiceInventory';

const ServiceInventoryPage: React.FC = () => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ServiceInventory />
        </div>
    );
};

export default ServiceInventoryPage;

import React from 'react';
import { Box, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ServiceInventory from '../../components/ServiceInventory';

const InventoryPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <div className="flex items-center gap-4 shrink-0">
        <button 
          onClick={() => navigate('/service')}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Box className="text-orange-600" /> Parts Inventory
          </h1>
          <p className="text-slate-500">Stock Management & AI Demand Forecasting</p>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ServiceInventory />
      </div>
    </div>
  );
};

export default InventoryPage;

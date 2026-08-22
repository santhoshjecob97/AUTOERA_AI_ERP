import React from 'react';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ServiceCommunication from '../../components/ServiceCommunication';

const CommunicationPage: React.FC = () => {
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
            <MessageSquare className="text-orange-600" /> Communication & Voice AI
          </h1>
          <p className="text-slate-500">Voice Agent, Bulk Campaigns, Email & Automation</p>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ServiceCommunication />
      </div>
    </div>
  );
};

export default CommunicationPage;

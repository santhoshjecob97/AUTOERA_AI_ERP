import React, { useState } from 'react';
import { Phone, Users, Upload, FileSpreadsheet, TrendingUp, Play } from 'lucide-react';
import VoiceCampaignManager from './VoiceCampaignManager';

interface UniversalVoiceCampaignSectionProps {
  engineType: 'sales' | 'service' | 'finance' | 'insurance' | 'fleet' | 'workforce';
  title?: string;
  description?: string;
}

const UniversalVoiceCampaignSection: React.FC<UniversalVoiceCampaignSectionProps> = ({
  engineType,
  title,
  description
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const defaultTitles = {
    sales: 'Voice AI - Lead Outreach Campaigns',
    service: 'Voice AI - Customer Service Campaigns',
    finance: 'Voice AI - Loan Follow-up Campaigns',
    insurance: 'Voice AI - Policy Renewal Campaigns',
    fleet: 'Voice AI - Driver Communication Campaigns',
    workforce: 'Voice AI - Employee Engagement Campaigns'
  };

  const defaultDescriptions = {
    sales: 'Automated voice campaigns for lead qualification, follow-ups, and appointment scheduling',
    service: 'Bulk voice campaigns for service reminders, appointment confirmations, and feedback collection',
    finance: 'Automated loan application follow-ups, payment reminders, and approval notifications',
    insurance: 'Policy renewal reminders, claim status updates, and customer retention campaigns',
    fleet: 'Driver check-ins, vehicle status updates, and route optimization communications',
    workforce: 'Employee surveys, shift reminders, and important announcements'
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div 
        className="p-6 cursor-pointer hover:bg-white/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-lg">
              <Phone size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                {title || defaultTitles[engineType]}
                <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full font-bold">
                  AI POWERED
                </span>
              </h3>
              <p className="text-sm text-slate-600 mb-3">
                {description || defaultDescriptions[engineType]}
              </p>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                  <Upload size={14} />
                  <span className="font-semibold">Bulk CSV Upload</span>
                </div>
                <div className="flex items-center gap-1.5 text-green-700 bg-green-100 px-3 py-1 rounded-full">
                  <FileSpreadsheet size={14} />
                  <span className="font-semibold">Google Sheets Sync</span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                  <TrendingUp size={14} />
                  <span className="font-semibold">Real-time Analytics</span>
                </div>
              </div>
            </div>
          </div>
          <button 
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            {isExpanded ? (
              <>
                <Users size={16} />
                Hide Campaigns
              </>
            ) : (
              <>
                <Play size={16} />
                Launch Campaign
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="p-6 pt-0 animate-in slide-in-from-top-4 duration-300">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <VoiceCampaignManager />
          </div>
        </div>
      )}

      {/* Quick Stats Preview (when collapsed) */}
      {!isExpanded && (
        <div className="px-6 pb-6 grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-3 border border-purple-100">
            <p className="text-xs text-slate-500 mb-1">Active Campaigns</p>
            <p className="text-xl font-bold text-slate-900">0</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-purple-100">
            <p className="text-xs text-slate-500 mb-1">Total Leads</p>
            <p className="text-xl font-bold text-slate-900">0</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-purple-100">
            <p className="text-xs text-slate-500 mb-1">Calls Completed</p>
            <p className="text-xl font-bold text-slate-900">0</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-purple-100">
            <p className="text-xs text-slate-500 mb-1">Success Rate</p>
            <p className="text-xl font-bold text-green-600">0%</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversalVoiceCampaignSection;

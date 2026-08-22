import React, { useState } from 'react';
import { Upload, FileSpreadsheet, Play, Pause, Settings, Users, Phone, Clock, TrendingUp, Download, RefreshCw } from 'lucide-react';
import CsvImportModal, { CsvColumn } from '../common/CsvImportModal';

interface CampaignLead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  status: 'pending' | 'calling' | 'completed' | 'failed' | 'scheduled';
  attempts: number;
  lastCallTime?: Date;
  notes?: string;
  customData?: Record<string, any>;
}

interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  leads: CampaignLead[];
  totalLeads: number;
  completed: number;
  successful: number;
  failed: number;
  createdAt: Date;
  googleSheetUrl?: string;
}

const leadCsvColumns: CsvColumn[] = [
  { key: 'name', label: 'Lead full name', required: true },
  { key: 'phone', label: 'Phone number with country code', required: true },
  { key: 'email', label: 'Email address' },
  { key: 'vehicleInterest', label: 'Vehicle interest' },
  { key: 'budget', label: 'Budget range' },
  { key: 'notes', label: 'Additional notes' },
];

const leadSampleRows = [
  {
    name: 'Rajesh Kumar',
    phone: '+91-9876543210',
    email: 'rajesh@example.com',
    vehicleInterest: 'SUV',
    budget: '15-20L',
    notes: 'Interested in Tata Harrier',
  },
  {
    name: 'Priya Sharma',
    phone: '+91-9876543211',
    email: 'priya@example.com',
    vehicleInterest: 'Sedan',
    budget: '10-15L',
    notes: 'Looking for Honda City',
  },
];

const VoiceCampaignManager: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isGoogleSheetModalOpen, setIsGoogleSheetModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [googleSheetUrl, setGoogleSheetUrl] = useState('');

  const handleBulkUpload = (rows: any[]) => {
    const leads: CampaignLead[] = rows.map((row, idx) => ({
      id: `lead-${Date.now()}-${idx}`,
      name: row.name,
      phone: row.phone,
      email: row.email,
      status: 'pending',
      attempts: 0,
      customData: {
        vehicleInterest: row.vehicleInterest,
        budget: row.budget,
        notes: row.notes,
      },
    }));

    const newCampaign: Campaign = {
      id: `campaign-${Date.now()}`,
      name: `Campaign ${new Date().toLocaleDateString()}`,
      status: 'draft',
      leads,
      totalLeads: leads.length,
      completed: 0,
      successful: 0,
      failed: 0,
      createdAt: new Date(),
    };

    setCampaigns([newCampaign, ...campaigns]);
    setIsImportOpen(false);
  };

  const handleGoogleSheetConnect = () => {
    if (!googleSheetUrl.trim()) return;

    // Simulate Google Sheets integration
    const mockLeads: CampaignLead[] = Array.from({ length: 50 }, (_, idx) => ({
      id: `gs-lead-${Date.now()}-${idx}`,
      name: `Lead ${idx + 1}`,
      phone: `+91-98765432${String(idx).padStart(2, '0')}`,
      email: `lead${idx + 1}@example.com`,
      status: 'pending',
      attempts: 0,
      customData: {
        source: 'Google Sheets',
      },
    }));

    const newCampaign: Campaign = {
      id: `campaign-gs-${Date.now()}`,
      name: `Google Sheets Campaign`,
      status: 'draft',
      leads: mockLeads,
      totalLeads: mockLeads.length,
      completed: 0,
      successful: 0,
      failed: 0,
      createdAt: new Date(),
      googleSheetUrl,
    };

    setCampaigns([newCampaign, ...campaigns]);
    setIsGoogleSheetModalOpen(false);
    setGoogleSheetUrl('');
  };

  const startCampaign = (campaignId: string) => {
    setCampaigns(campaigns.map(c => 
      c.id === campaignId ? { ...c, status: 'active' } : c
    ));
    // Here you would trigger the automated calling logic
    console.log('Starting campaign:', campaignId);
  };

  const pauseCampaign = (campaignId: string) => {
    setCampaigns(campaigns.map(c => 
      c.id === campaignId ? { ...c, status: 'paused' } : c
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setIsImportOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Upload size={16} />
          Bulk Upload CSV
        </button>
        <button
          onClick={() => setIsGoogleSheetModalOpen(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <FileSpreadsheet size={16} />
          Connect Google Sheets
        </button>
        <button
          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
        >
          <Download size={16} />
          Download Template
        </button>
      </div>

      {/* Campaign Stats */}
      {campaigns.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">Total Campaigns</span>
              <Users size={18} className="text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{campaigns.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">Total Leads</span>
              <Phone size={18} className="text-green-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {campaigns.reduce((sum, c) => sum + c.totalLeads, 0)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">Completed Calls</span>
              <Clock size={18} className="text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {campaigns.reduce((sum, c) => sum + c.completed, 0)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">Success Rate</span>
              <TrendingUp size={18} className="text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {campaigns.length > 0
                ? Math.round(
                    (campaigns.reduce((sum, c) => sum + c.successful, 0) /
                      Math.max(campaigns.reduce((sum, c) => sum + c.completed, 0), 1)) *
                      100
                  )
                : 0}
              %
            </p>
          </div>
        </div>
      )}

      {/* Campaigns List */}
      {campaigns.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone size={32} className="text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No Campaigns Yet</h3>
          <p className="text-slate-500 mb-6">
            Upload a CSV file or connect Google Sheets to start your first automated calling campaign
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setIsImportOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Upload CSV
            </button>
            <button
              onClick={() => setIsGoogleSheetModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Connect Sheets
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{campaign.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span>{campaign.totalLeads} leads</span>
                      <span>•</span>
                      <span>Created {campaign.createdAt.toLocaleDateString()}</span>
                      {campaign.googleSheetUrl && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <FileSpreadsheet size={14} className="text-green-600" />
                            Google Sheets
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        campaign.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : campaign.status === 'paused'
                          ? 'bg-orange-100 text-orange-700'
                          : campaign.status === 'completed'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {campaign.status}
                    </span>
                    {campaign.status === 'draft' || campaign.status === 'paused' ? (
                      <button
                        onClick={() => startCampaign(campaign.id)}
                        className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        title="Start Campaign"
                      >
                        <Play size={16} />
                      </button>
                    ) : campaign.status === 'active' ? (
                      <button
                        onClick={() => pauseCampaign(campaign.id)}
                        className="p-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                        title="Pause Campaign"
                      >
                        <Pause size={16} />
                      </button>
                    ) : null}
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                      <Settings size={16} className="text-slate-600" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">Progress</span>
                    <span className="font-medium text-slate-900">
                      {campaign.completed} / {campaign.totalLeads}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-500"
                      style={{
                        width: `${(campaign.completed / campaign.totalLeads) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Successful</p>
                    <p className="text-lg font-bold text-green-600">{campaign.successful}</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Failed</p>
                    <p className="text-lg font-bold text-red-600">{campaign.failed}</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Pending</p>
                    <p className="text-lg font-bold text-slate-900">
                      {campaign.totalLeads - campaign.completed}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CSV Import Modal */}
      {isImportOpen && (
        <CsvImportModal
          isOpen={isImportOpen}
          title="Bulk Upload Leads for Voice Campaign"
          description="Upload a CSV file with lead information. The system will automatically call each lead."
          columns={leadCsvColumns}
          sampleRows={leadSampleRows}
          mapRow={(raw) => {
            const trim = (v: unknown) => (v == null ? '' : String(v).trim());
            const name = trim((raw as any).name);
            const phone = trim((raw as any).phone);

            if (!name) return { error: 'name is required' };
            if (!phone) return { error: 'phone is required' };

            const phoneClean = phone.replace(/\s+/g, '');
            if (!/^\+?[0-9\-]+$/.test(phoneClean)) {
              return { error: 'Invalid phone format. Use country code, e.g. +91-9876543210' };
            }

            return {
              value: {
                name,
                phone,
                email: trim((raw as any).email) || undefined,
                vehicleInterest: trim((raw as any).vehicleInterest) || undefined,
                budget: trim((raw as any).budget) || undefined,
                notes: trim((raw as any).notes) || undefined,
              },
            };
          }}
          onImport={handleBulkUpload}
          onClose={() => setIsImportOpen(false)}
        />
      )}

      {/* Google Sheets Modal */}
      {isGoogleSheetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-green-600 text-white">
              <div className="flex items-center gap-2">
                <FileSpreadsheet size={20} />
                <h3 className="font-bold">Connect Google Sheets</h3>
              </div>
              <button
                onClick={() => setIsGoogleSheetModalOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-600 mb-4">
                Enter your Google Sheets URL to automatically sync leads for calling campaigns.
              </p>
              <input
                type="url"
                value={googleSheetUrl}
                onChange={(e) => setGoogleSheetUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/..."
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
              />
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
                <p className="text-xs text-blue-800">
                  <strong>Note:</strong> Make sure your Google Sheet is shared with view access and
                  contains columns: Name, Phone, Email (optional)
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsGoogleSheetModalOpen(false)}
                  className="flex-1 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGoogleSheetConnect}
                  disabled={!googleSheetUrl.trim()}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Connect
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceCampaignManager;

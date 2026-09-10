import React, { useState } from 'react';
import { 
  FileCheck, Upload, Search, Download, ShieldCheck, CheckCircle2, 
  AlertTriangle, FileText, Camera, RefreshCw, Sparkles, ExternalLink,
  ChevronRight, Lock
} from 'lucide-react';
import PageNavigation from '../../components/common/PageNavigation';

interface InsuranceDossier {
  claimId: string;
  policyNumber: string;
  insurer: string;
  customerName: string;
  vehicle: string;
  plateNumber: string;
  status: 'VERIFIED' | 'PENDING_DOCS' | 'UNDER_SURVEYOR_REVIEW' | 'APPROVED';
  documents: {
    name: string;
    type: string;
    verifiedVia: 'DigiLocker Govt API' | 'Insurer Portal API' | 'High-Res AI Vision' | 'Manual Upload';
    date: string;
    status: 'Valid' | 'Missing';
  }[];
}

const pilotDossiers: InsuranceDossier[] = [
  {
    claimId: 'CLM-TN-8821',
    policyNumber: 'HDFC-ERGO-MOT-2026-9901',
    insurer: 'HDFC ERGO General Insurance',
    customerName: 'Senthil Kumaran',
    vehicle: 'Tata Nexon EV Max (Empowered+)',
    plateNumber: 'TN-09-EV-8421',
    status: 'VERIFIED',
    documents: [
      { name: 'DigiLocker Vehicle Registration Certificate (RC)', type: 'PDF (Govt Auth)', verifiedVia: 'DigiLocker Govt API', date: '2026-09-02', status: 'Valid' },
      { name: 'Customer Driving Licence (Smart Card OCR)', type: 'PDF', verifiedVia: 'DigiLocker Govt API', date: '2026-09-02', status: 'Valid' },
      { name: '6-Angle High-Resolution Crash Evidence Photos', type: 'JPG (6 Files)', verifiedVia: 'High-Res AI Vision', date: '2026-09-02', status: 'Valid' },
      { name: 'AI Surveyor Assessment & Part Breakdown', type: 'PDF Dossier', verifiedVia: 'High-Res AI Vision', date: '2026-09-03', status: 'Valid' },
      { name: 'Workshop Authorized Repair Estimate (Apex Mobility)', type: 'Signed PDF', verifiedVia: 'Insurer Portal API', date: '2026-09-03', status: 'Valid' }
    ]
  },
  {
    claimId: 'CLM-TN-8822',
    policyNumber: 'ICICI-LOMB-CAR-7712',
    insurer: 'ICICI Lombard GIC',
    customerName: 'Anitha Narayanan',
    vehicle: 'Mahindra XUV700 AX7 Luxury',
    plateNumber: 'TN-14-AX-5511',
    status: 'UNDER_SURVEYOR_REVIEW',
    documents: [
      { name: 'DigiLocker Vehicle RC', type: 'PDF (Govt Auth)', verifiedVia: 'DigiLocker Govt API', date: '2026-09-05', status: 'Valid' },
      { name: 'Customer DL', type: 'PDF', verifiedVia: 'DigiLocker Govt API', date: '2026-09-05', status: 'Valid' },
      { name: 'Police FIR Copy / General Diary Entry', type: 'Scanned PDF', verifiedVia: 'Manual Upload', date: '2026-09-05', status: 'Valid' },
      { name: 'Rear Bumper & Tailgate Photos', type: 'JPG (4 Files)', verifiedVia: 'High-Res AI Vision', date: '2026-09-06', status: 'Valid' },
      { name: 'Original Repair Invoices', type: 'PDF', verifiedVia: 'Insurer Portal API', date: 'Pending', status: 'Missing' }
    ]
  },
  {
    claimId: 'CLM-TN-8823',
    policyNumber: 'BAJAJ-ALLZ-DRV-3310',
    insurer: 'Bajaj Allianz General Insurance',
    customerName: 'Dr. R. Vignesh',
    vehicle: 'Hyundai Creta SX(O)',
    plateNumber: 'TN-10-CR-1199',
    status: 'APPROVED',
    documents: [
      { name: 'DigiLocker Vehicle RC', type: 'PDF (Govt Auth)', verifiedVia: 'DigiLocker Govt API', date: '2026-08-28', status: 'Valid' },
      { name: 'Surveyor Final Approval Order', type: 'Digital PDF', verifiedVia: 'Insurer Portal API', date: '2026-08-30', status: 'Valid' },
      { name: 'Zero-Depreciation Discharge Voucher', type: 'Signed PDF', verifiedVia: 'Insurer Portal API', date: '2026-08-30', status: 'Valid' },
      { name: 'Satisfactory Delivery Confirmation', type: 'PDF', verifiedVia: 'Insurer Portal API', date: '2026-08-31', status: 'Valid' }
    ]
  }
];

const DocumentManagementPage: React.FC = () => {
  const [dossiers] = useState<InsuranceDossier[]>(pilotDossiers);
  const [selectedDossier, setSelectedDossier] = useState<InsuranceDossier>(pilotDossiers[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDownloadMessage, setActiveDownloadMessage] = useState<string | null>(null);

  const tabs = [
    { id: 'overview', label: 'Overview', path: '/insurance' },
    { id: 'claims', label: 'Claim Processing', path: '/insurance/claims' },
    { id: 'damage', label: 'Damage Assessment', path: '/insurance/damage-assessment' },
    { id: 'fraud', label: 'Fraud Detection', path: '/insurance/fraud-detection' },
    { id: 'policies', label: 'Policy Recommendations', path: '/insurance/policies' },
    { id: 'settlement', label: 'Settlement Calculator', path: '/insurance/settlement' },
    { id: 'documents', label: 'Documents', path: '/insurance/documents' },
    { id: 'analytics', label: 'Analytics', path: '/insurance/analytics' },
  ];

  const handleDownloadDossier = (d: InsuranceDossier) => {
    setActiveDownloadMessage(`Compiling encrypted claim package for ${d.claimId} (${d.insurer})... Ready for download.`);
    setTimeout(() => setActiveDownloadMessage(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageNavigation
        tabs={tabs}
        engineName="Insurance AI Engine"
        enginePath="/insurance"
      />

      {/* Header Banner */}
      <div className="bg-[#0D1117] border border-slate-800/90 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={13} className="text-cyan-400" />
              Section 07 &bull; DigiLocker &amp; Insurer Claims Vault
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit'] flex items-center gap-3">
              Insurance Policy &amp; Claims Document Repository
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl">
              Govt-authenticated DigiLocker verification (RC, DL), 6-angle damage photographic evidence, surveyor orders &amp; 1-click cashless claim packages.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all">
              <RefreshCw size={13} className="text-cyan-400" />
              <span>Poll Insurer APIs</span>
            </button>
            <button className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-orange-500/20 transition-all cursor-pointer">
              <Upload size={15} />
              <span>Upload Document</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notification */}
      {activeDownloadMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 size={16} />
          <span>{activeDownloadMessage}</span>
        </div>
      )}

      {/* Main Dossier Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 5 Cols: Active Claims Dossier List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-[#0D1117] border border-slate-800/90 rounded-xl p-4">
            <div className="relative mb-3">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text"
                placeholder="Search claim, policy or plate..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-2">
              {dossiers.map(d => {
                const isSelected = selectedDossier.claimId === d.claimId;
                return (
                  <div
                    key={d.claimId}
                    onClick={() => setSelectedDossier(d)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-slate-900 border-cyan-500 shadow-md ring-1 ring-cyan-500/30' 
                        : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-bold text-cyan-400">{d.claimId}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${
                        d.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
                        d.status === 'VERIFIED' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' :
                        'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      }`}>
                        {d.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white font-['Outfit']">{d.vehicle}</h4>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{d.plateNumber} &bull; {d.customerName}</p>
                    <p className="text-[11px] text-orange-400 font-medium mt-1">{d.insurer}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Selected Dossier Document Checklist */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#0D1117] border border-slate-800/90 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white font-['Outfit']">{selectedDossier.claimId} Dossier</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    {selectedDossier.documents.length} Files Attached
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">Policy: {selectedDossier.policyNumber}</p>
              </div>

              <button
                onClick={() => handleDownloadDossier(selectedDossier)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-900/30 cursor-pointer"
              >
                <Download size={14} />
                <span>Export Cashless Package</span>
              </button>
            </div>

            {/* Document Checklist Items */}
            <div className="mt-4 space-y-2.5">
              {selectedDossier.documents.map((doc, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 shrink-0">
                      <FileText size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{doc.name}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="text-emerald-400 font-medium flex items-center gap-1">
                          <ShieldCheck size={12} /> {doc.verifiedVia}
                        </span>
                        &bull;
                        <span>{doc.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                      doc.status === 'Valid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {doc.status}
                    </span>
                    <button className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">
                      <Download size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* DigiLocker Certification Footer */}
            <div className="mt-5 p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Lock size={14} className="text-cyan-400" />
                <span>Encrypted with AES-256 &bull; Compliant with DPDP Act 2023</span>
              </div>
              <span className="text-cyan-400 font-mono text-[11px]">Direct Insurer Gateway</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default DocumentManagementPage;

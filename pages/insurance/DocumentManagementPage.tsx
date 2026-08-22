import React from 'react';
import { FileCheck, Upload, Search, Download } from 'lucide-react';
import PageNavigation from '../../components/common/PageNavigation';

const DocumentManagementPage: React.FC = () => {
  const documents = [
    { name: 'Damage Photos', type: 'Photos', count: 6, status: 'complete' },
    { name: 'Police Report', type: 'PDF', count: 1, status: 'complete' },
    { name: 'Repair Estimate', type: 'PDF', count: 1, status: 'complete' },
    { name: 'Insurance Policy', type: 'PDF', count: 1, status: 'complete' },
    { name: 'ID Proof', type: 'PDF', count: 1, status: 'missing' },
    { name: 'Vehicle RC', type: 'PDF', count: 1, status: 'complete' }
  ];

  // Define tabs for navigation
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

  return (
    <div className="space-y-6">
      {/* Page Navigation */}
      <PageNavigation
        tabs={tabs}
        engineName="Insurance AI Engine"
        enginePath="/insurance"
      />

      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FileCheck size={32} className="text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-900">Document Management</h2>
            </div>
            <p className="text-slate-600">AI-powered document classification and storage</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
            <Upload size={18} />
            Upload Documents
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors">
            Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-slate-900">{doc.name}</h3>
                <p className="text-sm text-slate-500">{doc.type} • {doc.count} file(s)</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                doc.status === 'complete' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {doc.status}
              </span>
            </div>
            <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              <Download size={16} />
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentManagementPage;

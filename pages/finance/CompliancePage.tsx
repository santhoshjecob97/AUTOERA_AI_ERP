import React, { useState } from 'react';
import { Shield, CheckCircle, AlertTriangle, FileText, Download, Search, Award } from 'lucide-react';

interface ComplianceStandard {
  id: string;
  name: string;
  fullName: string;
  status: 'compliant' | 'warning' | 'non-compliant';
  lastAudit: string;
  nextAudit: string;
  score: number;
  violations: number;
}

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  category: string;
  status: 'success' | 'warning' | 'error';
  details: string;
}

const complianceStandards: ComplianceStandard[] = [
  {
    id: 'RBI',
    name: 'RBI',
    fullName: 'Reserve Bank of India Guidelines',
    status: 'compliant',
    lastAudit: '2024-11-15',
    nextAudit: '2025-02-15',
    score: 98,
    violations: 0
  },
  {
    id: 'SEBI',
    name: 'SEBI',
    fullName: 'Securities and Exchange Board of India',
    status: 'compliant',
    lastAudit: '2024-10-20',
    nextAudit: '2025-01-20',
    score: 96,
    violations: 0
  },
  {
    id: 'GDPR',
    name: 'GDPR',
    fullName: 'General Data Protection Regulation',
    status: 'warning',
    lastAudit: '2024-11-01',
    nextAudit: '2025-02-01',
    score: 92,
    violations: 2
  },
  {
    id: 'PCI-DSS',
    name: 'PCI DSS',
    fullName: 'Payment Card Industry Data Security Standard',
    status: 'compliant',
    lastAudit: '2024-11-10',
    nextAudit: '2025-02-10',
    score: 99,
    violations: 0
  }
];

const mockAuditLogs: AuditLog[] = [
  {
    id: 'AUD-001',
    timestamp: '2024-12-06 10:23:15',
    action: 'Loan Approval',
    user: 'admin@autoera.com',
    category: 'Transaction',
    status: 'success',
    details: 'Loan FIN-101 approved for ₹15,00,000'
  },
  {
    id: 'AUD-002',
    timestamp: '2024-12-06 10:15:42',
    action: 'Credit Score Access',
    user: 'analyst@autoera.com',
    category: 'Data Access',
    status: 'success',
    details: 'Credit score accessed for applicant ID: APP-2345'
  },
  {
    id: 'AUD-003',
    timestamp: '2024-12-06 09:58:30',
    action: 'Fraud Alert',
    user: 'system',
    category: 'Security',
    status: 'warning',
    details: 'High fraud score detected for application FIN-301'
  },
  {
    id: 'AUD-004',
    timestamp: '2024-12-06 09:45:18',
    action: 'Data Export',
    user: 'manager@autoera.com',
    category: 'Data Access',
    status: 'success',
    details: 'Customer data exported for compliance report'
  },
  {
    id: 'AUD-005',
    timestamp: '2024-12-06 09:30:05',
    action: 'Failed Login Attempt',
    user: 'unknown',
    category: 'Security',
    status: 'error',
    details: 'Multiple failed login attempts from IP: 192.168.1.100'
  }
];

const CompliancePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || log.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-700 border-green-300';
      case 'warning': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'non-compliant': return 'bg-red-100 text-red-700 border-red-300';
      case 'success': return 'bg-green-100 text-green-700 border-green-300';
      case 'error': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'success':
        return <CheckCircle size={16} />;
      case 'warning':
        return <AlertTriangle size={16} />;
      case 'non-compliant':
      case 'error':
        return <AlertTriangle size={16} />;
      default:
        return null;
    }
  };

  const overallCompliance = Math.round(
    complianceStandards.reduce((sum, std) => sum + std.score, 0) / complianceStandards.length
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield size={32} className="text-purple-600" />
          <h2 className="text-2xl font-bold text-slate-900">Compliance Dashboard</h2>
        </div>
        <p className="text-slate-600">Regulatory compliance monitoring and audit trail management</p>
      </div>

      {/* Overall Compliance Score */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Overall Compliance Score</h3>
            <p className="text-sm text-slate-500">Aggregate compliance across all standards</p>
          </div>
          <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg">
            <CheckCircle size={16} />
            <span className="text-sm font-semibold">Fully Compliant</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Score Display */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <div className="text-center">
              <div className="text-6xl font-bold text-green-600 mb-2">{overallCompliance}</div>
              <div className="text-slate-600 font-medium mb-4">/ 100</div>
              
              <div className="w-full bg-slate-200 rounded-full h-4 mb-4">
                <div
                  className="bg-green-500 h-4 rounded-full transition-all"
                  style={{ width: `${overallCompliance}%` }}
                ></div>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border border-green-300">
                <Shield size={16} className="text-green-600" />
                <span className="font-bold text-green-600">Excellent</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="text-sm text-slate-600 mb-1">Total Standards</div>
              <div className="text-3xl font-bold text-slate-900">{complianceStandards.length}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="text-sm text-green-700 mb-1">Compliant</div>
              <div className="text-3xl font-bold text-green-600">
                {complianceStandards.filter(s => s.status === 'compliant').length}
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="text-sm text-yellow-700 mb-1">Warnings</div>
              <div className="text-3xl font-bold text-yellow-600">
                {complianceStandards.filter(s => s.status === 'warning').length}
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="text-sm text-red-700 mb-1">Violations</div>
              <div className="text-3xl font-bold text-red-600">
                {complianceStandards.reduce((sum, s) => sum + s.violations, 0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Standards Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Regulatory Standards</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {complianceStandards.map((standard) => (
            <div
              key={standard.id}
              className="bg-slate-50 rounded-xl p-5 border-2 border-slate-200 hover:border-purple-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-bold text-slate-900">{standard.name}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(standard.status)}`}>
                      {getStatusIcon(standard.status)}
                      {standard.status === 'compliant' && 'Compliant'}
                      {standard.status === 'warning' && 'Warning'}
                      {standard.status === 'non-compliant' && 'Non-Compliant'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{standard.fullName}</p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Compliance Score */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Compliance Score</span>
                    <span className="font-bold text-slate-900">{standard.score}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        standard.score >= 95 ? 'bg-green-500' :
                        standard.score >= 90 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${standard.score}%` }}
                    ></div>
                  </div>
                </div>

                {/* Audit Dates */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-slate-500">Last Audit:</span>
                    <div className="font-semibold text-slate-900">{standard.lastAudit}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Next Audit:</span>
                    <div className="font-semibold text-slate-900">{standard.nextAudit}</div>
                  </div>
                </div>

                {/* Violations */}
                {standard.violations > 0 && (
                  <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                    <div className="flex items-center gap-2 text-sm">
                      <AlertTriangle size={14} className="text-yellow-600" />
                      <span className="font-semibold text-yellow-700">
                        {standard.violations} violation{standard.violations > 1 ? 's' : ''} detected
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200">
                <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors">
                  View Details
                </button>
                <button className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1">
                  <Download size={14} />
                  Report
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Certifications */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Award size={24} className="text-purple-600" />
          <h3 className="text-xl font-bold text-slate-900">Security Certifications</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'ISO 27001', status: 'Certified', color: 'green' },
            { name: 'SOC 2 Type II', status: 'Certified', color: 'green' },
            { name: 'PCI DSS Level 1', status: 'Certified', color: 'green' },
            { name: 'GDPR Compliant', status: 'Verified', color: 'blue' }
          ].map((cert, idx) => (
            <div key={idx} className={`bg-${cert.color}-50 rounded-lg p-4 border border-${cert.color}-200 text-center`}>
              <Shield size={32} className={`text-${cert.color}-600 mx-auto mb-2`} />
              <div className="font-bold text-slate-900 mb-1">{cert.name}</div>
              <div className={`text-sm text-${cert.color}-600 font-semibold`}>{cert.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Trail */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileText size={24} className="text-purple-600" />
            <h3 className="text-xl font-bold text-slate-900">Audit Trail</h3>
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2">
            <Download size={16} />
            Export Logs
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-4 flex-wrap">
          <div className="flex-1 min-w-[250px] relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search audit logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedCategory('Transaction')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === 'Transaction'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => setSelectedCategory('Security')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === 'Security'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Security
            </button>
            <button
              onClick={() => setSelectedCategory('Data Access')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === 'Data Access'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Data Access
            </button>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">Timestamp</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">Action</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">User</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">Category</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">Status</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-3 text-sm text-slate-600 font-mono">{log.timestamp}</td>
                  <td className="p-3 text-sm font-semibold text-slate-900">{log.action}</td>
                  <td className="p-3 text-sm text-slate-600">{log.user}</td>
                  <td className="p-3 text-sm">
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                      {log.category}
                    </span>
                  </td>
                  <td className="p-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-semibold border flex items-center gap-1 w-fit ${getStatusColor(log.status)}`}>
                      {getStatusIcon(log.status)}
                      {log.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-slate-600">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            No audit logs found matching your criteria
          </div>
        )}
      </div>

      {/* Regulatory Reports */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Regulatory Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Monthly Compliance Report', date: 'November 2024', size: '2.4 MB' },
            { name: 'Quarterly Audit Summary', date: 'Q3 2024', size: '5.1 MB' },
            { name: 'Annual Compliance Review', date: '2023-2024', size: '12.8 MB' }
          ].map((report, idx) => (
            <div key={idx} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="flex items-start gap-3">
                <FileText size={24} className="text-purple-600" />
                <div className="flex-1">
                  <div className="font-semibold text-slate-900 mb-1">{report.name}</div>
                  <div className="text-sm text-slate-600 mb-2">{report.date} • {report.size}</div>
                  <button className="text-sm text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1">
                    <Download size={14} />
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompliancePage;

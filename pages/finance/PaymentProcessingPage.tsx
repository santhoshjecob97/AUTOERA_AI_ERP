import React, { useState } from 'react';
import { DollarSign, Sparkles, AlertCircle, TrendingUp, Calendar, Phone, Mail, CheckCircle } from 'lucide-react';
import PageNavigation from '../../components/common/PageNavigation';

interface Payment {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  loanId: string;
  amount: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  daysOverdue?: number;
  optimizedDate?: string;
  potentialSavings?: string;
}

const mockPayments: Payment[] = [
  {
    id: 'PAY-001',
    customerName: 'Rajesh Kumar',
    phone: '+91-9876543210',
    email: 'rajesh@example.com',
    loanId: 'FIN-101',
    amount: '₹30,750',
    dueDate: '2024-12-15',
    status: 'paid'
  },
  {
    id: 'PAY-002',
    customerName: 'Priya Sharma',
    phone: '+91-9876543211',
    email: 'priya@example.com',
    loanId: 'FIN-102',
    amount: '₹28,500',
    dueDate: '2024-12-18',
    status: 'pending',
    optimizedDate: '2024-12-10',
    potentialSavings: '₹450'
  },
  {
    id: 'PAY-003',
    customerName: 'Amit Singh',
    phone: '+91-9876543212',
    email: 'amit@example.com',
    loanId: 'FIN-103',
    amount: '₹42,000',
    dueDate: '2024-11-28',
    status: 'overdue',
    daysOverdue: 8
  },
  {
    id: 'PAY-004',
    customerName: 'Neha Gupta',
    phone: '+91-9876543213',
    email: 'neha@example.com',
    loanId: 'FIN-104',
    amount: '₹35,200',
    dueDate: '2024-11-25',
    status: 'overdue',
    daysOverdue: 11
  },
  {
    id: 'PAY-005',
    customerName: 'Vikram Patel',
    phone: '+91-9876543214',
    email: 'vikram@example.com',
    loanId: 'FIN-105',
    amount: '₹25,800',
    dueDate: '2024-12-20',
    status: 'pending',
    optimizedDate: '2024-12-12',
    potentialSavings: '₹380'
  }
];

const PaymentProcessingPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [earlyPaymentAmount, setEarlyPaymentAmount] = useState<number>(30000);
  const [earlyPaymentDays, setEarlyPaymentDays] = useState<number>(15);

  const stats = {
    totalPayments: mockPayments.length,
    paidPayments: mockPayments.filter(p => p.status === 'paid').length,
    pendingPayments: mockPayments.filter(p => p.status === 'pending').length,
    overduePayments: mockPayments.filter(p => p.status === 'overdue').length,
    totalCollected: '₹4.2 Cr',
    collectionRate: '94.5%'
  };

  const filteredPayments = selectedTab === 'all' 
    ? mockPayments 
    : mockPayments.filter(p => p.status === selectedTab);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700 border-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'overdue': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle size={16} />;
      case 'pending': return <Calendar size={16} />;
      case 'overdue': return <AlertCircle size={16} />;
      default: return null;
    }
  };

  // Calculate early payment savings
  const calculateSavings = () => {
    const interestRate = 0.10; // 10% annual
    const dailyRate = interestRate / 365;
    const savings = earlyPaymentAmount * dailyRate * earlyPaymentDays;
    return savings.toFixed(0);
  };

  // Define tabs for navigation
  const tabs = [
    { id: 'overview', label: 'Overview', path: '/finance' },
    { id: 'credit-scoring', label: 'Credit Scoring', path: '/finance/credit-scoring' },
    { id: 'loan-approval', label: 'Loan Approval', path: '/finance/loan-approval' },
    { id: 'risk-assessment', label: 'Risk Assessment', path: '/finance/risk-assessment' },
    { id: 'payments', label: 'Payments', path: '/finance/payments' },
    { id: 'fraud-detection', label: 'Fraud Detection', path: '/finance/fraud-detection' },
    { id: 'calculator', label: 'Calculator', path: '/finance/calculator' },
    { id: 'compliance', label: 'Compliance', path: '/finance/compliance' },
    { id: 'analytics', label: 'Analytics', path: '/finance/analytics' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Navigation */}
      <PageNavigation
        tabs={tabs}
        engineName="Finance AI Engine"
        enginePath="/finance"
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <DollarSign size={32} className="text-purple-600" />
          <h2 className="text-2xl font-bold text-slate-900">Payment Processing</h2>
        </div>
        <p className="text-slate-600">AI-optimized payment scheduling and collection management</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <div className="text-sm text-slate-600 mb-1">Total Payments</div>
          <div className="text-2xl font-bold text-slate-900">{stats.totalPayments}</div>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4">
          <div className="text-sm text-green-700 mb-1">Paid</div>
          <div className="text-2xl font-bold text-green-600">{stats.paidPayments}</div>
        </div>
        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
          <div className="text-sm text-yellow-700 mb-1">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.pendingPayments}</div>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-4">
          <div className="text-sm text-red-700 mb-1">Overdue</div>
          <div className="text-2xl font-bold text-red-600">{stats.overduePayments}</div>
        </div>
        <div className="bg-purple-50 rounded-xl border border-purple-200 p-4">
          <div className="text-sm text-purple-700 mb-1">Total Collected</div>
          <div className="text-2xl font-bold text-purple-600">{stats.totalCollected}</div>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
          <div className="text-sm text-blue-700 mb-1">Collection Rate</div>
          <div className="text-2xl font-bold text-blue-600">{stats.collectionRate}</div>
        </div>
      </div>

      {/* AI Payment Optimization */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={24} className="text-indigo-600" />
          <h3 className="text-xl font-bold text-slate-900">AI Payment Optimization</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-indigo-200">
            <div className="text-sm text-slate-600 mb-2">Optimal Payment Window</div>
            <div className="text-lg font-bold text-indigo-600">10th-15th of Month</div>
            <div className="text-xs text-slate-500 mt-1">Based on customer cash flow patterns</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-indigo-200">
            <div className="text-sm text-slate-600 mb-2">Predicted Collection Rate</div>
            <div className="text-lg font-bold text-green-600">96.2%</div>
            <div className="text-xs text-slate-500 mt-1">+1.7% improvement with AI scheduling</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-indigo-200">
            <div className="text-sm text-slate-600 mb-2">Potential Savings</div>
            <div className="text-lg font-bold text-purple-600">₹2.4 Lakhs</div>
            <div className="text-xs text-slate-500 mt-1">Through early payment incentives</div>
          </div>
        </div>
      </div>

      {/* Payment Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedTab('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedTab === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All ({mockPayments.length})
          </button>
          <button
            onClick={() => setSelectedTab('paid')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedTab === 'paid'
                ? 'bg-green-600 text-white'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            Paid ({stats.paidPayments})
          </button>
          <button
            onClick={() => setSelectedTab('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedTab === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
            }`}
          >
            Pending ({stats.pendingPayments})
          </button>
          <button
            onClick={() => setSelectedTab('overdue')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedTab === 'overdue'
                ? 'bg-red-600 text-white'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            Overdue ({stats.overduePayments})
          </button>
        </div>
      </div>

      {/* Payments List */}
      <div className="space-y-4">
        {filteredPayments.map((payment) => (
          <div
            key={payment.id}
            className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              {/* Payment Info */}
              <div className="flex-1 min-w-[250px]">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-slate-900">{payment.customerName}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(payment.status)}`}>
                    {getStatusIcon(payment.status)}
                    {payment.status.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-slate-500">Payment ID:</span>
                    <span className="ml-2 font-semibold text-slate-900">{payment.id}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Loan ID:</span>
                    <span className="ml-2 font-semibold text-slate-900">{payment.loanId}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Amount:</span>
                    <span className="ml-2 font-semibold text-purple-600">{payment.amount}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Due Date:</span>
                    <span className="ml-2 font-semibold text-slate-900">{payment.dueDate}</span>
                  </div>
                </div>
              </div>

              {/* Status-specific Info */}
              {payment.status === 'overdue' && payment.daysOverdue && (
                <div className="bg-red-50 rounded-lg p-4 border border-red-200 min-w-[150px] text-center">
                  <div className="text-sm text-red-700 mb-1">Days Overdue</div>
                  <div className="text-3xl font-bold text-red-600">{payment.daysOverdue}</div>
                  <div className="text-xs text-red-600 mt-1">Immediate action required</div>
                </div>
              )}

              {payment.status === 'pending' && payment.optimizedDate && (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200 min-w-[180px]">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={14} className="text-indigo-600" />
                    <span className="text-xs font-semibold text-slate-700">AI Optimized Date</span>
                  </div>
                  <div className="text-lg font-bold text-indigo-600 mb-1">{payment.optimizedDate}</div>
                  <div className="text-xs text-green-600 font-semibold">Save {payment.potentialSavings}</div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
              {payment.status === 'paid' && (
                <>
                  <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-semibold transition-colors">
                    View Receipt
                  </button>
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                    Download Invoice
                  </button>
                </>
              )}
              {payment.status === 'pending' && (
                <>
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                    Send Reminder
                  </button>
                  <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                    <Sparkles size={16} />
                    Apply AI Schedule
                  </button>
                </>
              )}
              {payment.status === 'overdue' && (
                <>
                  <button className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                    <Phone size={16} />
                    Call Customer
                  </button>
                  <button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                    <Mail size={16} />
                    Send Notice
                  </button>
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                    Restructure
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Early Payment Savings Calculator */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={24} className="text-green-600" />
          <h3 className="text-xl font-bold text-slate-900">Early Payment Savings Calculator</h3>
        </div>
        <p className="text-sm text-slate-600 mb-4">Calculate potential savings for early loan payments</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Payment Amount (₹)
              </label>
              <input
                type="range"
                min="10000"
                max="100000"
                step="1000"
                value={earlyPaymentAmount}
                onChange={(e) => setEarlyPaymentAmount(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-right text-lg font-bold text-purple-600 mt-1">
                ₹{earlyPaymentAmount.toLocaleString()}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Days Early
              </label>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={earlyPaymentDays}
                onChange={(e) => setEarlyPaymentDays(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-right text-lg font-bold text-blue-600 mt-1">
                {earlyPaymentDays} days
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 flex flex-col justify-center">
            <div className="text-center">
              <div className="text-sm text-slate-600 mb-2">Estimated Savings</div>
              <div className="text-5xl font-bold text-green-600 mb-2">₹{calculateSavings()}</div>
              <div className="text-sm text-slate-600">Interest saved on early payment</div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-start gap-2">
            <Sparkles size={16} className="text-blue-600 mt-1" />
            <div className="text-sm text-slate-700">
              <strong>AI Recommendation:</strong> Encourage customers to pay 10-15 days early with a 0.5% discount. 
              This improves cash flow and reduces default risk while providing tangible savings to customers.
            </div>
          </div>
        </div>
      </div>

      {/* Payment Analytics */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Payment Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="text-sm text-slate-600 mb-2">Average Payment Time</div>
            <div className="text-2xl font-bold text-slate-900">12.3 days</div>
            <div className="text-xs text-green-600 mt-1">↓ 2.1 days from last month</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="text-sm text-slate-600 mb-2">On-Time Payment Rate</div>
            <div className="text-2xl font-bold text-green-600">91.5%</div>
            <div className="text-xs text-green-600 mt-1">↑ 3.2% from last month</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="text-sm text-slate-600 mb-2">Early Payment Rate</div>
            <div className="text-2xl font-bold text-blue-600">24.8%</div>
            <div className="text-xs text-blue-600 mt-1">↑ 5.4% from last month</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessingPage;

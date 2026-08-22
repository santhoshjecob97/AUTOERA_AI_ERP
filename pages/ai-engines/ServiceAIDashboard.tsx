import React, { useState, useEffect } from 'react';
import { Wrench, Search, Upload, TrendingUp, Activity } from 'lucide-react';
import AIModelCard from '../../components/ai/AIModelCard';
import BulkUpload from '../../components/ai/BulkUpload';
import PredictionWidget from '../../components/ai/PredictionWidget';
import aiEngineApi, { AIModel } from '../../services/aiEngineApi';

const ServiceAIDashboard: React.FC = () => {
  const [models, setModels] = useState<AIModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);

  // Mock data for Service AI models (15 models)
  const mockModels: AIModel[] = [
    {
      id: 'svc-001',
      name: 'Battery Failure Prediction',
      engineType: 'service',
      category: 'Predictive Maintenance',
      description: 'Predicts battery failure probability based on age, voltage, temperature, and charge cycles',
      version: '2.1.0',
      status: 'active',
      accuracy: 92,
      totalPredictions: 15420,
      predictions24h: 342,
      lastUpdated: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      inputSchema: {},
      outputSchema: {},
    },
    {
      id: 'svc-002',
      name: 'Brake Wear Detection',
      engineType: 'service',
      category: 'Predictive Maintenance',
      description: 'Analyzes brake pad thickness, mileage, and driving patterns to predict wear level',
      version: '1.8.2',
      status: 'active',
      accuracy: 95,
      totalPredictions: 12890,
      predictions24h: 289,
      lastUpdated: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
      inputSchema: {},
      outputSchema: {},
    },
    {
      id: 'svc-003',
      name: 'Engine Diagnostics',
      engineType: 'service',
      category: 'Predictive Maintenance',
      description: 'Diagnoses engine issues from OBD-II codes and sensor readings',
      version: '3.0.1',
      status: 'active',
      accuracy: 88,
      totalPredictions: 23450,
      predictions24h: 512,
      lastUpdated: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
      inputSchema: {},
      outputSchema: {},
    },
    {
      id: 'svc-004',
      name: 'AC System Analysis',
      engineType: 'service',
      category: 'Predictive Maintenance',
      description: 'Evaluates AC system health from pressure, temperature, and compressor status',
      version: '1.5.0',
      status: 'active',
      accuracy: 90,
      totalPredictions: 8920,
      predictions24h: 178,
      lastUpdated: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      inputSchema: {},
      outputSchema: {},
    },
    {
      id: 'svc-005',
      name: 'Tire Pressure Monitoring',
      engineType: 'service',
      category: 'Predictive Maintenance',
      description: 'Monitors tire pressure and detects leaks based on readings and vehicle load',
      version: '2.3.1',
      status: 'active',
      accuracy: 96,
      totalPredictions: 19230,
      predictions24h: 421,
      lastUpdated: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      inputSchema: {},
      outputSchema: {},
    },
    {
      id: 'svc-006',
      name: 'Service Time Estimation',
      engineType: 'service',
      category: 'Service Scheduling',
      description: 'Estimates service completion time based on job type, vehicle, and technician skill',
      version: '1.9.0',
      status: 'active',
      accuracy: 85,
      totalPredictions: 31240,
      predictions24h: 687,
      lastUpdated: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      inputSchema: {},
      outputSchema: {},
    },
    {
      id: 'svc-007',
      name: 'Bay Utilization Optimizer',
      engineType: 'service',
      category: 'Service Scheduling',
      description: 'Optimizes bay assignments based on current jobs and technician availability',
      version: '2.0.0',
      status: 'active',
      accuracy: 91,
      totalPredictions: 8450,
      predictions24h: 156,
      lastUpdated: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      inputSchema: {},
      outputSchema: {},
    },
    {
      id: 'svc-008',
      name: 'Appointment Scheduler',
      engineType: 'service',
      category: 'Service Scheduling',
      description: 'Finds optimal appointment slots considering schedules and bay availability',
      version: '1.7.3',
      status: 'active',
      accuracy: 93,
      totalPredictions: 14560,
      predictions24h: 298,
      lastUpdated: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
      inputSchema: {},
      outputSchema: {},
    },
    {
      id: 'svc-009',
      name: 'Quality Score Predictor',
      engineType: 'service',
      category: 'Quality Prediction',
      description: 'Predicts service quality score based on technician history and job complexity',
      version: '1.4.2',
      status: 'training',
      accuracy: 87,
      totalPredictions: 9870,
      predictions24h: 0,
      lastUpdated: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      inputSchema: {},
      outputSchema: {},
    },
    {
      id: 'svc-010',
      name: 'Customer Satisfaction Forecaster',
      engineType: 'service',
      category: 'Quality Prediction',
      description: 'Forecasts customer satisfaction and NPS based on service history',
      version: '2.1.1',
      status: 'active',
      accuracy: 89,
      totalPredictions: 11230,
      predictions24h: 234,
      lastUpdated: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
      inputSchema: {},
      outputSchema: {},
    },
    {
      id: 'svc-011',
      name: 'Parts Demand Prediction',
      engineType: 'service',
      category: 'Parts Forecasting',
      description: 'Forecasts parts demand for next 30/60/90 days based on historical usage',
      version: '1.6.0',
      status: 'active',
      accuracy: 84,
      totalPredictions: 6780,
      predictions24h: 142,
      lastUpdated: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      inputSchema: {},
      outputSchema: {},
    },
    {
      id: 'svc-012',
      name: 'Inventory Optimizer',
      engineType: 'service',
      category: 'Parts Forecasting',
      description: 'Optimizes inventory levels and reorder points based on demand forecasts',
      version: '2.2.0',
      status: 'active',
      accuracy: 88,
      totalPredictions: 5420,
      predictions24h: 98,
      lastUpdated: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      inputSchema: {},
      outputSchema: {},
    },
    {
      id: 'svc-013',
      name: 'Skill Matching Engine',
      engineType: 'service',
      category: 'Technician Assignment',
      description: 'Matches technicians to jobs based on skills, certifications, and availability',
      version: '1.8.0',
      status: 'active',
      accuracy: 94,
      totalPredictions: 18920,
      predictions24h: 412,
      lastUpdated: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
      inputSchema: {},
      outputSchema: {},
    },
    {
      id: 'svc-014',
      name: 'Workload Balancer',
      engineType: 'service',
      category: 'Technician Assignment',
      description: 'Balances workload across technicians considering complexity and deadlines',
      version: '1.5.1',
      status: 'active',
      accuracy: 90,
      totalPredictions: 12340,
      predictions24h: 267,
      lastUpdated: new Date(Date.now() - 1000 * 60 * 11).toISOString(),
      inputSchema: {},
      outputSchema: {},
    },
    {
      id: 'svc-015',
      name: 'Damage Detection (Vision AI)',
      engineType: 'service',
      category: 'Damage Detection',
      description: 'Detects vehicle damage from images and estimates repair costs',
      version: '3.1.0',
      status: 'active',
      accuracy: 86,
      totalPredictions: 7650,
      predictions24h: 189,
      lastUpdated: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
      inputSchema: {},
      outputSchema: {},
    },
  ];

  useEffect(() => {
    // In production, fetch from API
    // aiEngineApi.getModels('service').then(data => setModels(data.models));
    
    // For now, use mock data
    setTimeout(() => {
      setModels(mockModels);
      setIsLoading(false);
    }, 500);
  }, []);

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(models.map((m) => m.category)))];

  // Filter models
  const filteredModels = models.filter((model) => {
    const matchesSearch =
      searchQuery === '' ||
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || model.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || model.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate summary stats
  const totalPredictions24h = models.reduce((sum, m) => sum + m.predictions24h, 0);
  const avgAccuracy = models.length > 0
    ? Math.round(models.reduce((sum, m) => sum + m.accuracy, 0) / models.length)
    : 0;
  const activeModels = models.filter((m) => m.status === 'active').length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Wrench className="text-orange-600" /> Service AI Dashboard
          </h1>
          <p className="text-slate-500 mt-1">
            15 AI models for predictive maintenance, scheduling, and quality optimization
          </p>
        </div>
        <button
          onClick={() => setIsBulkUploadOpen(true)}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Upload size={16} />
          Bulk Upload
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Total Models</span>
            <Activity size={20} className="text-orange-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900">{models.length}</div>
          <div className="text-xs text-green-600 mt-1">{activeModels} active</div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Avg Accuracy</span>
            <TrendingUp size={20} className="text-green-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900">{avgAccuracy}%</div>
          <div className="text-xs text-slate-500 mt-1">Across all models</div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Predictions (24h)</span>
            <Activity size={20} className="text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {totalPredictions24h >= 1000
              ? `${(totalPredictions24h / 1000).toFixed(1)}k`
              : totalPredictions24h}
          </div>
          <div className="text-xs text-slate-500 mt-1">Last 24 hours</div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">System Status</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div className="text-xl font-bold text-green-600">Operational</div>
          <div className="text-xs text-slate-500 mt-1">All systems running</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="training">Training</option>
            <option value="idle">Idle</option>
            <option value="error">Error</option>
          </select>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Models Grid */}
        <div className="xl:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-slate-100 rounded-xl h-64 animate-pulse"></div>
              ))}
            </div>
          ) : filteredModels.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <p className="text-slate-500">No models found matching your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModels.map((model) => (
                <AIModelCard
                  key={model.id}
                  modelId={model.id}
                  modelName={model.name}
                  accuracy={model.accuracy}
                  status={model.status}
                  predictions={model.totalPredictions}
                  lastUpdated={model.lastUpdated}
                  description={model.description}
                  category={model.category}
                  onPredict={() => {
                    setSelectedModel(model);
                    // Open prediction modal
                  }}
                  onViewDetails={() => {
                    // Navigate to model details
                    console.log('View details:', model.id);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Real-time Predictions Sidebar */}
        <div className="xl:col-span-1">
          <div className="sticky top-6">
            <PredictionWidget
              engineType="service"
              title="Live Service Predictions"
              maxPredictions={30}
            />
          </div>
        </div>
      </div>

      {/* Bulk Upload Modal */}
      {isBulkUploadOpen && (
        <BulkUpload
          modelId={selectedModel?.id || 'svc-001'}
          modelName={selectedModel?.name || 'Service AI'}
          acceptedColumns={['vehicle_id', 'mileage', 'last_service_date', 'issue_description']}
          onUploadComplete={(results) => {
            console.log('Upload complete:', results);
            setIsBulkUploadOpen(false);
          }}
          onError={(error) => {
            console.error('Upload error:', error);
          }}
          onClose={() => setIsBulkUploadOpen(false)}
        />
      )}
    </div>
  );
};

export default ServiceAIDashboard;

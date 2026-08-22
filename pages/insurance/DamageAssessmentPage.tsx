import React, { useState } from 'react';
import { Camera, Sparkles, ZoomIn, Upload, Grid, Image as ImageIcon } from 'lucide-react';
import PageNavigation from '../../components/common/PageNavigation';

interface DamagedPart {
  part: string;
  severity: number;
  action: string;
  cost: string;
  labor: string;
  confidence: number;
}

const DamageAssessmentPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showOverlay, setShowOverlay] = useState(true);

  const images = [
    { id: 1, angle: 'Rear View', url: '/damage-rear.jpg' },
    { id: 2, angle: 'Right Side', url: '/damage-right.jpg' },
    { id: 3, angle: 'Close-up Bumper', url: '/damage-bumper.jpg' },
    { id: 4, angle: 'Taillight', url: '/damage-light.jpg' },
    { id: 5, angle: 'Trunk', url: '/damage-trunk.jpg' },
    { id: 6, angle: 'Overall', url: '/damage-overall.jpg' }
  ];

  const damagedParts: DamagedPart[] = [
    { part: 'Rear Bumper', severity: 85, action: 'Replace', cost: '₹45,000', labor: '4 hours', confidence: 96 },
    { part: 'Right Taillight', severity: 62, action: 'Replace', cost: '₹18,000', labor: '1 hour', confidence: 94 },
    { part: 'Trunk Panel', severity: 35, action: 'Repair', cost: '₹12,000', labor: '2 hours', confidence: 91 },
    { part: 'Paint (2 panels)', severity: 45, action: 'Repaint', cost: '₹15,000', labor: '3 hours', confidence: 89 }
  ];

  const getSeverityColor = (severity: number) => {
    if (severity <= 30) return 'text-green-600';
    if (severity <= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityBg = (severity: number) => {
    if (severity <= 30) return 'bg-green-500';
    if (severity <= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const totalCost = damagedParts.reduce((sum, part) => {
    const cost = parseInt(part.cost.replace(/[₹,]/g, ''));
    return sum + cost;
  }, 0);

  const avgSeverity = Math.round(
    damagedParts.reduce((sum, part) => sum + part.severity, 0) / damagedParts.length
  );

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

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Camera size={32} className="text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-900">AI Damage Assessment</h2>
            </div>
            <p className="text-slate-600">YOLOv8 + EfficientNet computer vision damage analysis</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
              <Upload size={18} />
              Upload Photos
            </button>
            <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-semibold transition-colors">
              <Grid size={18} />
              3D View
            </button>
          </div>
        </div>
      </div>

      {/* AI Processing Status */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles size={24} className="text-indigo-600" />
            <div>
              <p className="font-bold text-slate-900">AI Analysis Complete</p>
              <p className="text-sm text-slate-600">Processed 6 photos in 4.2 seconds</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-sm text-slate-600">Parts Detected</p>
              <p className="text-2xl font-bold text-indigo-600">{damagedParts.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-600">Avg Confidence</p>
              <p className="text-2xl font-bold text-green-600">93%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-600">Severity</p>
              <p className={`text-2xl font-bold ${getSeverityColor(avgSeverity)}`}>{avgSeverity}/100</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Photo Viewer */}
        <div className="lg:col-span-2 space-y-4">
          {/* Main Image */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">{images[selectedImage].angle}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowOverlay(!showOverlay)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    showOverlay
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  AI Overlay
                </button>
                <button className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                  <ZoomIn size={18} className="text-slate-700" />
                </button>
              </div>
            </div>

            {/* Image Display */}
            <div className="relative aspect-video bg-slate-200 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera size={64} className="text-slate-400" />
              </div>
              
              {/* AI Overlay Indicators */}
              {showOverlay && (
                <>
                  {/* Rear Bumper - Severe */}
                  <div className="absolute bottom-1/4 left-1/3 w-32 h-24 border-4 border-red-500 rounded-lg animate-pulse">
                    <div className="absolute -top-8 left-0 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                      Bumper (Severe)
                    </div>
                  </div>
                  
                  {/* Taillight - Moderate */}
                  <div className="absolute bottom-1/3 right-1/4 w-20 h-16 border-4 border-yellow-500 rounded-lg">
                    <div className="absolute -top-8 left-0 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
                      Taillight (Moderate)
                    </div>
                  </div>
                  
                  {/* Trunk - Minor */}
                  <div className="absolute top-1/4 left-1/2 w-24 h-20 border-4 border-green-500 rounded-lg">
                    <div className="absolute -top-8 left-0 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                      Trunk (Minor)
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-6 gap-2 mt-4">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-video bg-slate-200 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === idx
                      ? 'border-blue-600 ring-2 ring-blue-200'
                      : 'border-slate-300 hover:border-blue-400'
                  }`}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={20} className="text-slate-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Damage Details */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-slate-900 mb-4">AI Detected Damage</h3>
            <div className="space-y-4">
              {damagedParts.map((part, idx) => (
                <div key={idx} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getSeverityBg(part.severity)}`}></div>
                      <span className="font-bold text-slate-900">{part.part}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        part.severity <= 30 ? 'bg-green-100 text-green-700' :
                        part.severity <= 70 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {part.severity}/100
                      </span>
                      <span className="text-xs text-slate-500">
                        {part.confidence}% confidence
                      </span>
                    </div>
                  </div>

                  {/* Severity Bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
                    <div
                      className={`h-2 rounded-full ${getSeverityBg(part.severity)}`}
                      style={{ width: `${part.severity}%` }}
                    ></div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Action</p>
                      <p className="font-semibold text-slate-900">{part.action}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Cost</p>
                      <p className="font-semibold text-slate-900">{part.cost}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Labor</p>
                      <p className="font-semibold text-slate-900">{part.labor}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-4">
          {/* Repair Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-slate-900 mb-4">Repair Summary</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">Parts Affected</p>
                <p className="text-2xl font-bold text-slate-900">{damagedParts.length}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Overall Severity</p>
                <p className={`text-2xl font-bold ${getSeverityColor(avgSeverity)}`}>
                  {avgSeverity <= 30 ? 'Minor' : avgSeverity <= 70 ? 'Moderate' : 'Severe'}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Repair Time</p>
                <p className="text-2xl font-bold text-slate-900">2 days</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Complexity</p>
                <p className="text-2xl font-bold text-slate-900">Medium</p>
              </div>
            </div>
            <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
              Generate Report
            </button>
          </div>

          {/* Cost Estimate */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-6">
            <h3 className="font-bold text-slate-900 mb-4">Cost Estimate</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Parts Total</span>
                <span className="font-semibold text-slate-900">₹{totalCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Labor Total</span>
                <span className="font-semibold text-slate-900">₹20,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Paint/Finish</span>
                <span className="font-semibold text-slate-900">₹10,000</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-purple-300">
                <span className="font-bold text-slate-900">Total Estimate</span>
                <span className="text-xl font-bold text-purple-600">
                  ₹{(totalCost + 30000).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-600">AI Confidence</span>
                <span className="text-sm font-bold text-green-600">94%</span>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-indigo-600" />
              <span className="font-semibold text-slate-900">AI Insights</span>
            </div>
            <p className="text-sm text-slate-700">
              Damage consistent with rear-end collision at low speed. All affected parts are standard replacements. 
              Estimated repair time is accurate based on similar claims.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DamageAssessmentPage;

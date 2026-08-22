import React, { useState, useEffect, useRef } from 'react';
import { Activity, TrendingUp, Filter, Download, Clock } from 'lucide-react';
import { useWebSocket, WS_CHANNELS } from '../../context/WebSocketContext';
import Papa from 'papaparse';

export interface PredictionWidgetProps {
  modelId?: string;
  engineType?: string;
  title?: string;
  maxPredictions?: number;
  refreshInterval?: number;
}

interface Prediction {
  id: string;
  timestamp: Date;
  modelName: string;
  engineType: string;
  input: Record<string, any>;
  output: any;
  confidence: number;
  modelVersion: string;
}

const PredictionWidget: React.FC<PredictionWidgetProps> = ({
  modelId,
  engineType,
  title = 'Live Predictions',
  maxPredictions = 50,
  refreshInterval,
}) => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [filter, setFilter] = useState<{
    minConfidence: number;
    engineType: string;
  }>({
    minConfidence: 0,
    engineType: engineType || 'all',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { subscribe, isConnected } = useWebSocket();

  // Subscribe to real-time predictions
  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = subscribe(WS_CHANNELS.AI_PREDICTIONS, (data: any) => {
      // Filter by modelId if specified
      if (modelId && data.modelId !== modelId) return;

      // Filter by engineType if specified
      if (engineType && data.engineType !== engineType) return;

      const newPrediction: Prediction = {
        id: data.id || `pred-${Date.now()}-${Math.random()}`,
        timestamp: new Date(data.timestamp || Date.now()),
        modelName: data.modelName,
        engineType: data.engineType,
        input: data.input,
        output: data.output,
        confidence: data.confidence,
        modelVersion: data.modelVersion,
      };

      setPredictions((prev) => {
        const updated = [newPrediction, ...prev];
        return updated.slice(0, maxPredictions);
      });
    });

    return () => {
      unsubscribe();
    };
  }, [isConnected, subscribe, modelId, engineType, maxPredictions]);

  // Auto-scroll to newest prediction
  useEffect(() => {
    if (containerRef.current && predictions.length > 0) {
      containerRef.current.scrollTop = 0;
    }
  }, [predictions]);

  // Filter predictions
  const filteredPredictions = predictions.filter((pred) => {
    if (pred.confidence < filter.minConfidence) return false;
    if (filter.engineType !== 'all' && pred.engineType !== filter.engineType) return false;
    return true;
  });

  // Export predictions to CSV
  const handleExport = () => {
    const exportData = filteredPredictions.map((pred) => ({
      timestamp: pred.timestamp.toISOString(),
      modelName: pred.modelName,
      engineType: pred.engineType,
      confidence: pred.confidence,
      output: JSON.stringify(pred.output),
      input: JSON.stringify(pred.input),
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `predictions_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-500';
    if (confidence >= 75) return 'bg-blue-500';
    if (confidence >= 60) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getEngineColor = (engine: string) => {
    const colors: Record<string, string> = {
      service: 'bg-orange-100 text-orange-700',
      sales: 'bg-blue-100 text-blue-700',
      finance: 'bg-green-100 text-green-700',
      insurance: 'bg-purple-100 text-purple-700',
      fleet: 'bg-indigo-100 text-indigo-700',
      workforce: 'bg-pink-100 text-pink-700',
      voice: 'bg-teal-100 text-teal-700',
    };
    return colors[engine] || 'bg-slate-100 text-slate-700';
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);

    if (diffSecs < 10) return 'Just now';
    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;
    return date.toLocaleTimeString();
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Activity size={20} className="text-indigo-600" />
          <h3 className="font-bold text-slate-900">{title}</h3>
          {isConnected && (
            <span className="flex items-center gap-1 text-xs text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-colors ${
              showFilters ? 'bg-indigo-100 text-indigo-700' : 'text-slate-400 hover:bg-slate-100'
            }`}
          >
            <Filter size={16} />
          </button>
          <button
            onClick={handleExport}
            disabled={filteredPredictions.length === 0}
            className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-700 mb-1 block">
              Min Confidence: {filter.minConfidence}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={filter.minConfidence}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, minConfidence: parseInt(e.target.value) }))
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700 mb-1 block">Engine Type</label>
            <select
              value={filter.engineType}
              onChange={(e) => setFilter((prev) => ({ ...prev, engineType: e.target.value }))}
              className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Engines</option>
              <option value="service">Service</option>
              <option value="sales">Sales</option>
              <option value="finance">Finance</option>
              <option value="insurance">Insurance</option>
              <option value="fleet">Fleet</option>
              <option value="workforce">Workforce</option>
              <option value="voice">Voice</option>
            </select>
          </div>
        </div>
      )}

      {/* Predictions List */}
      <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {filteredPredictions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <Activity size={48} className="text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">No predictions yet</p>
            <p className="text-sm text-slate-400 mt-1">
              {isConnected ? 'Waiting for live predictions...' : 'Connecting to server...'}
            </p>
          </div>
        ) : (
          filteredPredictions.map((pred) => (
            <div
              key={pred.id}
              className="border border-slate-200 rounded-lg p-3 hover:shadow-md transition-all cursor-pointer bg-white"
              onClick={() => setExpandedId(expandedId === pred.id ? null : pred.id)}
            >
              {/* Prediction Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${getEngineColor(pred.engineType)}`}>
                      {pred.engineType}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock size={12} />
                      {formatTimestamp(pred.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{pred.modelName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Confidence</div>
                    <div className="text-sm font-bold text-slate-900">{pred.confidence}%</div>
                  </div>
                  <div className={`w-1 h-12 rounded-full ${getConfidenceColor(pred.confidence)}`}></div>
                </div>
              </div>

              {/* Confidence Bar */}
              <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getConfidenceColor(pred.confidence)}`}
                  style={{ width: `${pred.confidence}%` }}
                ></div>
              </div>

              {/* Output Preview */}
              <div className="text-sm text-slate-700">
                <span className="font-medium">Output: </span>
                <span className="text-slate-600">
                  {typeof pred.output === 'object'
                    ? JSON.stringify(pred.output).substring(0, 50) + '...'
                    : String(pred.output).substring(0, 50)}
                </span>
              </div>

              {/* Expanded Details */}
              {expandedId === pred.id && (
                <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
                  <div>
                    <p className="text-xs font-semibold text-slate-700 mb-1">Full Output:</p>
                    <pre className="text-xs bg-slate-50 p-2 rounded border border-slate-200 overflow-x-auto">
                      {JSON.stringify(pred.output, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700 mb-1">Input Data:</p>
                    <pre className="text-xs bg-slate-50 p-2 rounded border border-slate-200 overflow-x-auto">
                      {JSON.stringify(pred.input, null, 2)}
                    </pre>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Model Version: {pred.modelVersion}</span>
                    <span>ID: {pred.id}</span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>
            Showing {filteredPredictions.length} of {predictions.length} predictions
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp size={12} />
            Max: {maxPredictions}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PredictionWidget;

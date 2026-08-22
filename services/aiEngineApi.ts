import apiService from './api';

export interface AIModel {
  id: string;
  name: string;
  engineType: 'service' | 'sales' | 'finance' | 'insurance' | 'fleet' | 'workforce' | 'voice';
  category: string;
  description: string;
  version: string;
  status: 'active' | 'training' | 'idle' | 'error';
  accuracy: number;
  totalPredictions: number;
  predictions24h: number;
  lastUpdated: string;
  inputSchema: Record<string, any>;
  outputSchema: Record<string, any>;
}

export interface PredictionRequest {
  input: Record<string, any>;
}

export interface PredictionResponse {
  prediction: any;
  confidence: number;
  modelVersion: string;
  timestamp: string;
}

export interface BatchPredictionRequest {
  modelId: string;
  data: Record<string, any>[];
}

export interface BatchPredictionResponse {
  jobId: string;
  status: 'processing' | 'completed' | 'failed';
  progress?: number;
}

export interface BatchJobStatus {
  jobId: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  totalRecords: number;
  processedRecords: number;
  successfulRecords: number;
  failedRecords: number;
  results?: any[];
  errors?: any[];
}

class AIEngineAPI {
  // Get all models for a specific engine type
  async getModels(engineType: string): Promise<{ models: AIModel[] }> {
    return apiService.get(`/api/ai-engine/models/?engine=${engineType}`);
  }

  // Get single model details
  async getModel(modelId: string): Promise<AIModel> {
    return apiService.get(`/api/ai-engine/models/${modelId}/`);
  }

  // Make single prediction
  async predict(modelName: string, input: Record<string, any>): Promise<PredictionResponse> {
    return apiService.post(`/api/ai-engine/predict/${modelName}/`, { input });
  }

  // Submit batch prediction job
  async batchPredict(modelId: string, data: Record<string, any>[]): Promise<BatchPredictionResponse> {
    return apiService.post('/api/ai-engine/batch-predict/', { modelId, data });
  }

  // Get batch job status
  async getBatchJob(jobId: string): Promise<BatchJobStatus> {
    return apiService.get(`/api/ai-engine/batch-jobs/${jobId}/`);
  }

  // Get model performance metrics
  async getModelMetrics(modelId: string, dateRange?: { start: string; end: string }) {
    const params = dateRange ? `?start_date=${dateRange.start}&end_date=${dateRange.end}` : '';
    return apiService.get(`/api/ai-engine/models/${modelId}/metrics/${params}`);
  }

  // Get prediction history
  async getPredictionHistory(modelId: string, limit: number = 50) {
    return apiService.get(`/api/ai-engine/models/${modelId}/predictions/?limit=${limit}`);
  }
}

export const aiEngineApi = new AIEngineAPI();
export default aiEngineApi;

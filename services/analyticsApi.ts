import apiService from './api';

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface RevenueMetrics {
  mrr: number;
  arr: number;
  arpu: number;
  cac: number;
  ltv: number;
  trends: Array<{ date: string; value: number }>;
  breakdown: {
    sales: number;
    service: number;
    finance: number;
    insurance: number;
  };
}

export interface CustomerMetrics {
  totalCustomers: number;
  activeCustomers: number;
  newCustomers: number;
  churnedCustomers: number;
  churnRate: number;
  acquisitionFunnel: Array<{ stage: string; count: number }>;
  cohortAnalysis: Array<{ cohort: string; retention: number }>;
}

export interface UtilizationMetrics {
  bayUtilization: number;
  technicianUtilization: number;
  partsInventoryTurnover: number;
  averageServiceTime: number;
  completionRate: number;
  trends: Array<{ date: string; utilization: number }>;
}

export interface VoiceMetrics {
  totalCalls: number;
  averageDuration: number;
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  conversionRate: number;
  topAgents: Array<{
    agentId: string;
    agentName: string;
    callCount: number;
    avgDuration: number;
    conversionRate: number;
  }>;
  callVolumeTrends: Array<{ date: string; count: number }>;
}

class AnalyticsAPI {
  // Get revenue analytics
  async getRevenue(dateRange: DateRange): Promise<RevenueMetrics> {
    return apiService.get(
      `/api/analytics/revenue/?start_date=${dateRange.startDate}&end_date=${dateRange.endDate}`
    );
  }

  // Get customer analytics
  async getCustomers(dateRange: DateRange): Promise<CustomerMetrics> {
    return apiService.get(
      `/api/analytics/customers/?start_date=${dateRange.startDate}&end_date=${dateRange.endDate}`
    );
  }

  // Get utilization analytics
  async getUtilization(dateRange: DateRange): Promise<UtilizationMetrics> {
    return apiService.get(
      `/api/analytics/utilization/?start_date=${dateRange.startDate}&end_date=${dateRange.endDate}`
    );
  }

  // Get voice analytics
  async getVoice(dateRange: DateRange): Promise<VoiceMetrics> {
    return apiService.get(
      `/api/analytics/voice/?start_date=${dateRange.startDate}&end_date=${dateRange.endDate}`
    );
  }

  // Get AI engine performance
  async getEnginePerformance(dateRange: DateRange) {
    return apiService.get(
      `/api/analytics/ai-performance/?start_date=${dateRange.startDate}&end_date=${dateRange.endDate}`
    );
  }

  // Export analytics report
  async exportReport(reportType: string, dateRange: DateRange, format: 'pdf' | 'excel') {
    return apiService.post('/api/analytics/export/', {
      reportType,
      dateRange,
      format,
    });
  }
}

export const analyticsApi = new AnalyticsAPI();
export default analyticsApi;

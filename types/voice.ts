// Voice AI Agent Types
export type EngineType = 'service' | 'sales' | 'finance' | 'insurance' | 'workforce' | 'fleet';

export type CallStatus = 'idle' | 'initiating' | 'ringing' | 'active' | 'on-hold' | 'ended' | 'failed';

export type CallIntent = 
  | 'appointment_booking'
  | 'status_inquiry'
  | 'parts_availability'
  | 'lead_qualification'
  | 'test_drive_booking'
  | 'inventory_inquiry'
  | 'loan_inquiry'
  | 'emi_calculation'
  | 'document_collection'
  | 'claim_filing'
  | 'renewal_inquiry'
  | 'coverage_check'
  | 'schedule_coordination'
  | 'performance_review'
  | 'training_inquiry'
  | 'route_optimization'
  | 'emergency_assistance'
  | 'status_check'
  | 'general_inquiry';

export interface VoiceCallContext {
  engineType: EngineType;
  customer: {
    id?: string;
    name: string;
    phone: string;
    email?: string;
  };
  context: Record<string, any>; // Engine-specific data
  intents: CallIntent[];
  metadata?: Record<string, any>;
}

export interface CallSession {
  callId: string;
  sessionId: string;
  status: CallStatus;
  startTime: Date;
  endTime?: Date;
  duration: number;
  engineType: EngineType;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  transcription: TranscriptionSegment[];
  sentiment: SentimentAnalysis;
  outcome?: string;
  recordingUrl?: string;
}

export interface TranscriptionSegment {
  speaker: 'agent' | 'customer';
  text: string;
  timestamp: number;
  confidence: number;
}

export interface SentimentAnalysis {
  overall: 'positive' | 'neutral' | 'negative';
  score: number;
  timeline: Array<{
    timestamp: number;
    sentiment: 'positive' | 'neutral' | 'negative';
    score: number;
  }>;
  emotions: Array<{
    emotion: 'joy' | 'anger' | 'sadness' | 'fear' | 'surprise' | 'neutral';
    score: number;
  }>;
}

export interface InitiateCallRequest {
  recipientPhone: string;
  engineType: EngineType;
  contextData: any;
  callPurpose?: string;
}

export interface VoiceCallState {
  callStatus: CallStatus;
  callId: string | null;
  duration: number;
  transcription: TranscriptionSegment[];
  sentiment: SentimentAnalysis;
  error: string | null;
}

// Engine-Specific Context Types
export interface ServiceCallContext {
  jobId?: string;
  vehicle: string;
  issue?: string;
  status?: string;
  bay?: string;
  technician?: string;
  estimatedCompletion?: string;
  serviceHistory?: any[];
}

export interface SalesCallContext {
  leadId: string;
  vehicleInterest: string;
  budget?: string;
  aiScore: number;
  status: string;
  lastAction?: string;
  interactionHistory?: any[];
}

export interface FinanceCallContext {
  applicationId: string;
  loanAmount: string;
  creditScore: number;
  status: string;
  riskLevel: string;
  monthlyEMI?: string;
  requiredDocuments?: string[];
}

export interface InsuranceCallContext {
  policyId?: string;
  claimId?: string;
  policyHolder: string;
  vehicle: string;
  policyType?: string;
  expiryDate?: string;
  claimStatus?: string;
}

export interface WorkforceCallContext {
  employeeId: string;
  name: string;
  role: string;
  department: string;
  schedule?: any;
  performanceScore?: number;
  trainingStatus?: string;
}

export interface FleetCallContext {
  vehicleId: string;
  model: string;
  plateNumber: string;
  driver: string;
  location: string;
  batteryLevel?: number;
  status: string;
  route?: string;
}

// Voice Context Adapter Interface
export interface VoiceContextAdapter {
  getCallContext(data: any): VoiceCallContext;
  getGreeting(customer: { name: string; [key: string]: any }): string;
  getIntents(): CallIntent[];
  handleCallEnd(callData: any): Promise<void>;
}

// Call History and Analytics
export interface CallHistoryFilter {
  engineType?: EngineType;
  startDate?: string;
  endDate?: string;
  status?: CallStatus;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface CallMetrics {
  totalCalls: number;
  averageDuration: number;
  resolutionRate: number;
  satisfactionScore: number;
  byEngine: Record<EngineType, number>;
  byStatus: Record<CallStatus, number>;
}

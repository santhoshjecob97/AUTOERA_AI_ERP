# Design Document

## Overview

The Complete Frontend Integration transforms the AutoEra AI SaaS platform into a comprehensive multi-engine system integrating 65+ AI models across 8 specialized domains (Service, Sales, Finance, Insurance, Fleet, Workforce, Voice, and Guide). The design follows a modular architecture with dedicated dashboards, real-time communication via WebSocket, voice integration through WebRTC, and a unified design system.

### Current Implementation Status

**Existing Pages:**
- Dashboard.tsx (Main overview with role-based access)
- ServiceEngine.tsx (15+ AI models with operations, scheduling, inventory, quality, emergency, analytics)
- SalesEngine.tsx (12+ AI models with lead scoring, OCR, virtual showroom)
- FinanceEngine.tsx (10+ AI models)
- InsuranceEngine.tsx (8+ AI models)
- FleetEngine.tsx (10+ AI models for EV/fleet management)
- WorkforceEngine.tsx (HR and workforce optimization)
- GuideEngine.tsx (Onboarding and implementation guidance)

**Existing Components:**
- 30+ specialized modals and components
- Role-based authentication system
- AI chat integration with Gemini
- Real-time notification system

### Technology Stack

**Frontend Framework:**
- React 19.2.0 with TypeScript 5.8.2
- Vite 6.2.0 for build tooling and development server
- Lucide React for iconography

**UI & Styling:**
- Inline Tailwind-style classes (utility-first approach)
- Custom gradient theme (indigo/purple/blue/orange color scheme)
- Recharts 3.5.1 for data visualization

**State Management:**
- React useState/useEffect hooks for local state
- Props drilling for cross-component communication
- Real-time state synchronization via WebSocket (to be implemented)

**Communication:**
- Gemini AI service (existing in services/geminiService.ts)
- Axios (to be added) for REST API calls
- Socket.io-client (to be added) for WebSocket connections
- Simple-peer (to be added) for WebRTC voice calls

**Data Handling:**
- Papa Parse (to be added) for CSV processing
- Date-fns (to be added) for date manipulation
- React Query (to be added) for server state management


## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     AutoEra Frontend                         │
├─────────────────────────────────────────────────────────────┤
│  App.tsx (Main Router & Layout)                             │
│  ├── Sidebar Navigation (Role-based)                        │
│  ├── Header (Search, Notifications, AI Chat)                │
│  └── Main Content Area                                       │
│      ├── Dashboard (Enhanced with AI summaries)             │
│      ├── AI Engine Dashboards (8)                            │
│      │   ├── ServiceAI (15+ models) ✓ IMPLEMENTED           │
│      │   ├── SalesAI (12+ models) ✓ IMPLEMENTED             │
│      │   ├── FinanceAI (10+ models) ✓ IMPLEMENTED           │
│      │   ├── InsuranceAI (8+ models) ✓ IMPLEMENTED          │
│      │   ├── FleetAI (10+ models) ✓ IMPLEMENTED             │
│      │   ├── WorkforceAI (8+ models) ✓ IMPLEMENTED          │
│      │   ├── VoiceAI (10 models) ⚠ PARTIAL                  │
│      │   └── GuideAI (Onboarding) ✓ IMPLEMENTED             │
│      ├── Analytics Dashboard ⚠ TO BE ENHANCED               │
│      └── Voice Dashboard ⚠ TO BE CREATED                    │
├─────────────────────────────────────────────────────────────┤
│  Services Layer                                              │
│  ├── geminiService.ts (AI Chat) ✓ IMPLEMENTED               │
│  ├── apiService.ts (REST API) ⚠ TO BE CREATED               │
│  ├── websocketService.ts (Real-time) ⚠ TO BE CREATED        │
│  └── webrtcService.ts (Voice) ⚠ TO BE CREATED               │
├─────────────────────────────────────────────────────────────┤
│  Component Library                                           │
│  ├── Existing Modals (30+) ✓ IMPLEMENTED                    │
│  ├── AI Components ⚠ TO BE CREATED                          │
│  │   ├── AIModelCard.tsx                                    │
│  │   ├── BulkUpload.tsx                                     │
│  │   └── PredictionWidget.tsx                               │
│  ├── Voice Components ⚠ TO BE CREATED                       │
│  │   ├── CallInterface.tsx                                  │
│  │   ├── CallMonitoring.tsx                                 │
│  │   └── Transcription.tsx                                  │
│  ├── Analytics Components ⚠ TO BE ENHANCED                  │
│  │   ├── RevenueChart.tsx                                   │
│  │   ├── CustomerMetrics.tsx                                │
│  │   └── UtilizationGauge.tsx                               │
│  └── Common Components ✓ PARTIAL                            │
│      ├── StatCard.tsx ✓                                     │
│      ├── Sidebar.tsx ✓                                      │
│      └── NotificationToast.tsx ✓                            │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    Backend Services                          │
│  ├── REST API (Django/FastAPI)                              │
│  ├── WebSocket Server (Socket.io)                           │
│  ├── AI Model Inference Engine (65+ models)                 │
│  └── Database (PostgreSQL)                                   │
└─────────────────────────────────────────────────────────────┘
```

### Missing Features Analysis

**Critical Missing Features:**
1. **Dedicated AI Engine Dashboard Pages** - Need individual pages for each AI engine showing all models
2. **AI Model Card Component** - Reusable component to display model status, accuracy, predictions
3. **Bulk Upload System** - CSV upload with validation and batch processing
4. **Real-time WebSocket Integration** - Live updates for predictions and notifications
5. **Voice AI Dashboard** - Dedicated page for voice call management
6. **WebRTC Call Interface** - Live calling with transcription and sentiment
7. **Analytics Dashboard** - Unified analytics aggregating all engines
8. **API Service Layer** - Centralized REST API client
9. **Export Functionality** - PDF/Excel report generation
10. **Enhanced Notification System** - Push notifications and notification center

### Directory Structure

```
frontend/
├── pages/
│   ├── Dashboard.tsx ✓ (Enhanced with AI summaries needed)
│   ├── ServiceEngine.tsx ✓ (15+ models, multi-tab interface)
│   ├── SalesEngine.tsx ✓ (12+ models, lead scoring, OCR)
│   ├── FinanceEngine.tsx ✓ (10+ models, loan processing)
│   ├── InsuranceEngine.tsx ✓ (8+ models, claims, policies)
│   ├── FleetEngine.tsx ✓ (10+ models, EV management)
│   ├── WorkforceEngine.tsx ✓ (8+ models, HR optimization)
│   ├── GuideEngine.tsx ✓ (Onboarding & implementation)
│   ├── ai-engines/ ⚠ NEW DIRECTORY NEEDED
│   │   ├── ServiceAIDashboard.tsx (Dedicated AI model view)
│   │   ├── SalesAIDashboard.tsx (Dedicated AI model view)
│   │   ├── FinanceAIDashboard.tsx (Dedicated AI model view)
│   │   ├── InsuranceAIDashboard.tsx (Dedicated AI model view)
│   │   ├── FleetAIDashboard.tsx (Dedicated AI model view)
│   │   ├── WorkforceAIDashboard.tsx (Dedicated AI model view)
│   │   └── VoiceAIDashboard.tsx (Dedicated AI model view)
│   ├── VoiceDashboard.tsx ⚠ NEW (Call management)
│   └── AnalyticsDashboard.tsx ⚠ NEW (Unified analytics)
├── components/
│   ├── [30+ existing modals] ✓
│   ├── Sidebar.tsx ✓
│   ├── StatCard.tsx ✓
│   ├── NotificationToast.tsx ✓
│   ├── LoginScreen.tsx ✓
│   ├── AIChatModal.tsx ✓
│   ├── ai/ ⚠ NEW DIRECTORY
│   │   ├── AIModelCard.tsx (Display model status/metrics)
│   │   ├── BulkUpload.tsx (CSV upload with progress)
│   │   ├── PredictionWidget.tsx (Real-time predictions)
│   │   ├── ModelPerformance.tsx (Charts and metrics)
│   │   └── AIEngineHeader.tsx (Consistent header)
│   ├── voice/ ⚠ NEW DIRECTORY
│   │   ├── CallInterface.tsx (WebRTC controls)
│   │   ├── CallMonitoring.tsx (Live call dashboard)
│   │   ├── Transcription.tsx (Live transcription view)
│   │   ├── SentimentIndicator.tsx (Emotion display)
│   │   └── CallHistory.tsx (Past calls list)
│   ├── analytics/ ⚠ NEW DIRECTORY
│   │   ├── RevenueChart.tsx (Revenue trends)
│   │   ├── CustomerMetrics.tsx (Acquisition/retention)
│   │   ├── UtilizationGauge.tsx (Bay/resource usage)
│   │   ├── VoiceMetrics.tsx (Call analytics)
│   │   ├── EnginePerformance.tsx (AI engine stats)
│   │   └── ExportButton.tsx (PDF/Excel export)
│   └── common/ ⚠ NEW DIRECTORY
│       ├── DataTable.tsx (Reusable table)
│       ├── LoadingSpinner.tsx (Loading states)
│       ├── NotificationCenter.tsx (Notification panel)
│       ├── DateRangePicker.tsx (Date selection)
│       └── ConfidenceBar.tsx (Visual confidence score)
├── services/
│   ├── geminiService.ts ✓ (Existing AI chat)
│   ├── api.ts ⚠ NEW (REST API client)
│   ├── websocket.ts ⚠ NEW (Real-time updates)
│   ├── webrtc.ts ⚠ NEW (Voice calls)
│   └── auth.ts ⚠ NEW (Token management)
├── hooks/ ⚠ NEW DIRECTORY
│   ├── useWebSocket.ts (WebSocket connection)
│   ├── useAIModel.ts (AI model data fetching)
│   ├── useVoiceCall.ts (Call management)
│   ├── useNotifications.ts (Notification state)
│   └── useAnalytics.ts (Analytics data)
├── context/ ⚠ NEW DIRECTORY
│   ├── AuthContext.tsx (User authentication)
│   ├── NotificationContext.tsx (Global notifications)
│   └── WebSocketContext.tsx (WebSocket provider)
├── utils/ ⚠ NEW DIRECTORY
│   ├── csvParser.ts (CSV processing)
│   ├── dateFormatter.ts (Date utilities)
│   ├── chartHelpers.ts (Chart data transformation)
│   ├── validators.ts (Input validation)
│   └── exportHelpers.ts (PDF/Excel generation)
├── types.ts ✓ (Comprehensive type definitions)
├── App.tsx ✓ (Main app with routing)
├── index.tsx ✓
├── index.html ✓
├── package.json ✓
├── tsconfig.json ✓
├── vite.config.ts ✓
└── tailwind.config.js ⚠ NEW (Tailwind configuration)
```

**Legend:**
- ✓ = Implemented
- ⚠ = Missing or needs enhancement
- NEW = Completely new file/directory needed


## Missing Features Detailed Design

### Phase 1: Core AI Engine Dashboards (HIGH PRIORITY)

**1.1 Dedicated AI Engine Dashboard Pages**

Each AI engine needs a dedicated dashboard page that displays all its AI models in a grid layout with filtering and search capabilities.

**Common Structure for All AI Engine Dashboards:**
```typescript
// Pattern: pages/ai-engines/[Engine]AIDashboard.tsx
interface AIEngineDashboardProps {
  engineType: 'service' | 'sales' | 'finance' | 'insurance' | 'fleet' | 'workforce' | 'voice';
  models: AIModel[];
}

// Layout:
// - Header with engine name, description, and bulk actions
// - Filter bar (by category, status, accuracy range)
// - Grid of AI Model Cards (3-4 columns)
// - Bulk prediction upload button
// - Real-time prediction feed sidebar
```

**Service AI Dashboard** (15 models):
- Categories: Predictive Maintenance, Service Scheduling, Quality Prediction, Parts Forecasting, Technician Assignment
- Models: Battery Failure Prediction, Brake Wear Detection, Engine Diagnostics, AC System Analysis, Tire Pressure Monitoring, Service Time Estimation, Bay Utilization Optimizer, Appointment Scheduler, Quality Score Predictor, Customer Satisfaction Forecaster, Parts Demand Prediction, Inventory Optimizer, Skill Matching Engine, Workload Balancer, Damage Detection

**Sales AI Dashboard** (12 models):
- Categories: Lead Scoring, Price Optimization, Demand Forecasting, Customer Segmentation
- Models: Lead Conversion Predictor, Hot Lead Identifier, Price Recommendation Engine, Discount Optimizer, Vehicle Demand Forecaster, Seasonal Trend Analyzer, Customer Lifetime Value, Churn Predictor, Upsell Opportunity Detector, Test Drive Scheduler, Financing Eligibility, Trade-in Valuator

**Finance AI Dashboard** (10 models):
- Categories: Credit Scoring, Fraud Detection, Revenue Forecasting, Risk Assessment
- Models: Credit Score Predictor, Loan Approval Engine, Fraud Detection System, Transaction Anomaly Detector, Revenue Forecaster, Cash Flow Predictor, Payment Default Risk, EMI Calculator, Interest Rate Optimizer, Collection Priority Ranker

**Insurance AI Dashboard** (8 models):
- Categories: Claim Prediction, Risk Assessment, Premium Optimization, Fraud Detection
- Models: Claim Probability Predictor, Damage Severity Estimator, Fraud Detection Engine, Risk Score Calculator, Premium Optimizer, Policy Renewal Predictor, Claim Cost Estimator, Underwriting Assistant

**Fleet AI Dashboard** (10 models):
- Categories: Route Optimization, Fuel Prediction, Maintenance Scheduling, Battery Health
- Models: Route Optimizer, Fuel Consumption Predictor, Range Estimator, Charging Station Recommender, Battery Health Monitor, Maintenance Scheduler, Driver Behavior Analyzer, Vehicle Utilization Optimizer, Energy Cost Forecaster, Fleet Efficiency Scorer

**Workforce AI Dashboard** (8 models):
- Categories: Performance Prediction, Training Recommendation, Shift Optimization, Attrition Risk
- Models: Performance Predictor, Skill Gap Analyzer, Training Recommender, Shift Optimizer, Attrition Risk Predictor, Hiring Success Predictor, Productivity Forecaster, Team Composition Optimizer

**Voice AI Dashboard** (10 models):
- Categories: Call Transcription, Sentiment Analysis, Conversion Prediction, Quality Scoring
- Models: Real-time Transcriber, Sentiment Analyzer, Emotion Detector, Intent Classifier, Conversion Predictor, Call Quality Scorer, Agent Performance Analyzer, Customer Satisfaction Predictor, Objection Handler, Upsell Opportunity Detector

**1.2 AI Model Card Component Design**

The AI Model Card is the core reusable component for displaying individual AI models across all dashboards.

**Visual Design:**
- Card with gradient border (color based on status)
- Top section: Model name, category badge, status indicator
- Middle section: Circular accuracy gauge, prediction count, last updated
- Bottom section: Quick action buttons (Predict, View Details, Configure)
- Hover effect: Elevation shadow, subtle scale transform

**States:**
- Active: Green border, pulsing indicator
- Training: Yellow border, progress animation
- Idle: Gray border, static
- Error: Red border, error icon

**Interactions:**
- Click card → Open detailed model view modal
- Click "Predict" → Open prediction input form
- Click "View Details" → Navigate to model performance page
- Real-time updates via WebSocket for accuracy and prediction count

### Phase 2: Real-time Features (HIGH PRIORITY)

**2.1 WebSocket Service Implementation**

**Purpose:** Enable real-time updates for AI predictions, notifications, and live data across all dashboards.

**Architecture:**
```typescript
// services/websocket.ts
class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  
  connect(userId: string): void
  disconnect(): void
  subscribe(channel: string, callback: (data: any) => void): void
  unsubscribe(channel: string): void
  emit(event: string, data: any): void
}

// Channels:
// - 'ai-predictions' → New AI model predictions
// - 'notifications' → System notifications
// - 'voice-calls' → Live call updates
// - 'analytics-updates' → Real-time metrics
// - 'model-status' → AI model status changes
```

**Connection Flow:**
1. User logs in → Establish WebSocket connection with auth token
2. Subscribe to relevant channels based on user role/permissions
3. Listen for events and update UI components
4. Handle disconnection with exponential backoff reconnection
5. Queue messages during disconnection, sync on reconnection

**2.2 Real-time Prediction Widget**

**Purpose:** Display live AI predictions as they occur across the platform.

**Features:**
- Scrollable list of recent predictions (last 50)
- Filter by engine type, model, confidence threshold
- Color-coded confidence bars
- Click to expand full prediction details
- Auto-scroll to newest prediction
- Export predictions to CSV

**Integration Points:**
- Dashboard sidebar (global predictions)
- Individual AI engine dashboards (engine-specific)
- AI Model detail pages (model-specific)

### Phase 3: Bulk Upload System (MEDIUM PRIORITY)

**3.1 Bulk Upload Component**

**Purpose:** Allow users to upload CSV files for batch AI predictions across multiple records.

**Features:**
- Drag-and-drop file upload zone
- File validation (format, size, column matching)
- Column mapping interface (CSV columns → Model input fields)
- Real-time progress tracking with percentage and ETA
- Error handling with row-level error reporting
- Results preview table with download option
- Support for files up to 50MB (configurable)

**User Flow:**
1. User clicks "Bulk Upload" on AI Model Card
2. Modal opens with drag-and-drop zone
3. User uploads CSV file
4. System validates file structure
5. User maps CSV columns to model input fields
6. User confirms and starts batch processing
7. Progress bar shows real-time status
8. On completion, results table displays with download button
9. User can download results CSV with predictions added

**Technical Implementation:**
- Use Papa Parse for CSV parsing
- Stream processing for large files (chunk-based)
- Backend API: POST /api/ai-engine/batch-predict/
- WebSocket updates for progress tracking
- Result caching for 24 hours

### Phase 4: Voice AI Integration (MEDIUM PRIORITY)

**4.1 Voice Dashboard Page**

**Purpose:** Centralized dashboard for managing voice calls, viewing transcriptions, and analyzing call performance.

**Layout:**
- Top metrics: Active calls, total calls today, avg duration, conversion rate
- Live calls section: Grid of active call cards with real-time status
- Call history table: Past calls with filters (date, agent, sentiment, outcome)
- Analytics section: Call volume trends, sentiment distribution, agent performance
- Quick actions: Initiate new call, view call recordings, export reports

**4.2 WebRTC Call Interface**

**Purpose:** Enable voice calls with live transcription and sentiment analysis.

**Features:**
- WebRTC peer connection setup
- Call controls: Mute, hold, transfer, end call
- Live transcription panel with speaker identification
- Real-time sentiment indicator (color-coded emotion)
- Call timer and quality indicator
- Recording indicator
- Post-call summary with action items

**Technical Stack:**
- Simple-peer for WebRTC connections
- Backend signaling server for peer discovery
- Audio streaming to backend for transcription
- Real-time sentiment analysis every 10 seconds

**4.3 Call Monitoring Dashboard**

**Purpose:** Allow supervisors to monitor all active calls in real-time.

**Features:**
- Grid view of all active calls
- Agent name, customer name, duration, sentiment
- Click to listen in (supervisor mode)
- Whisper mode (speak to agent only)
- Barge-in mode (join call as participant)
- Real-time alerts for negative sentiment or long call duration

### Phase 5: Analytics Dashboard (MEDIUM PRIORITY)

**5.1 Unified Analytics Dashboard**

**Purpose:** Aggregate metrics from all AI engines into a single comprehensive view.

**Sections:**

**Revenue Analytics:**
- MRR, ARR, ARPU, CAC, LTV metrics
- Revenue trends by engine (Sales, Service, Finance)
- Revenue forecasting chart
- Top revenue sources breakdown

**Customer Analytics:**
- Total customers, active customers, new customers
- Acquisition funnel visualization
- Retention cohort analysis
- Churn rate trends
- Customer satisfaction scores

**Utilization Analytics:**
- Service bay utilization gauge
- Technician productivity metrics
- Fleet vehicle utilization
- Parts inventory turnover
- Equipment usage rates

**Voice Analytics:**
- Call volume trends
- Average call duration
- Sentiment distribution (positive/neutral/negative)
- Conversion rates by agent
- Top performing agents leaderboard

**AI Engine Performance:**
- Predictions per engine (last 24h, 7d, 30d)
- Average accuracy by engine
- Model health status overview
- API response times
- Error rates

**5.2 Export Functionality**

**Purpose:** Generate downloadable reports in PDF and Excel formats.

**Features:**
- Date range selection
- Report type selection (Revenue, Customer, Utilization, Voice, AI Performance)
- Include/exclude specific metrics
- Chart image embedding in PDF
- Formatted Excel with multiple sheets
- Scheduled report generation (daily, weekly, monthly)
- Email delivery option

**Technical Implementation:**
- jsPDF for PDF generation
- xlsx library for Excel generation
- Chart.js toBase64Image() for chart embedding
- Backend API for scheduled reports

### Phase 6: Enhanced Notification System (LOW PRIORITY)

**6.1 Notification Center Component**

**Purpose:** Centralized panel for viewing all notifications with filtering and actions.

**Features:**
- Slide-out panel from header bell icon
- Notification list with timestamps
- Filter by type (info, success, warning, error, ai-prediction)
- Mark as read/unread
- Clear all notifications
- Notification settings (enable/disable by type)
- Unread count badge

**6.2 Push Notifications**

**Purpose:** Browser push notifications for critical events.

**Implementation:**
- Request notification permission on login
- Service worker for background notifications
- Notification triggers: High-value lead, fraud alert, predictive maintenance warning, negative sentiment call
- Click notification → Navigate to relevant page

### Phase 7: API Service Layer (HIGH PRIORITY)

**7.1 Centralized API Client**

**Purpose:** Unified service for all backend API calls with error handling and retry logic.

**Features:**
- Axios-based HTTP client
- Request/response interceptors
- Automatic token refresh
- Retry logic with exponential backoff (3 attempts)
- Request cancellation support
- Loading state management
- Error normalization

**Endpoint Categories:**
```typescript
// AI Engine APIs
aiEngine.getModels(engineType)
aiEngine.getModel(modelId)
aiEngine.predict(modelName, input)
aiEngine.batchPredict(modelId, data)
aiEngine.getBatchJob(jobId)

// Analytics APIs
analytics.getRevenue(dateRange)
analytics.getCustomers(dateRange)
analytics.getUtilization(dateRange)
analytics.getVoice(dateRange)

// Voice APIs
voice.getCalls(filters)
voice.getCall(callId)
voice.getTranscription(callId)
voice.getSentiment(callId)
voice.initiateCall(recipientPhone, agentId)

// Communication APIs
communication.getTemplates()
communication.sendEmail(templateId, recipients, data)
communication.getPreferences(userId)
```

## Components and Interfaces

### 1. AI Model Card Component

**Purpose:** Display individual AI model status, metrics, and controls

**Interface:**
```typescript
interface AIModelCardProps {
  modelName: string;
  modelId: string;
  accuracy: number; // 0-100
  status: 'active' | 'training' | 'idle' | 'error';
  predictions: number; // Total predictions count
  lastUpdated: string; // ISO timestamp
  description: string;
  category?: string;
  onPredict?: () => void;
  onViewDetails?: () => void;
}
```

**Visual Design:**
- Card layout with gradient border based on status
- Circular progress indicator for accuracy
- Status badge with color coding (green=active, yellow=training, gray=idle, red=error)
- Action buttons for prediction and details
- Hover effect with shadow elevation

**Behavior:**
- Real-time accuracy updates via WebSocket
- Click to expand detailed metrics
- Prediction button triggers model-specific prediction modal

### 2. Bulk Upload Component

**Purpose:** Handle CSV file uploads for batch AI predictions

**Interface:**
```typescript
interface BulkUploadProps {
  modelId: string;
  modelName: string;
  acceptedColumns: string[];
  maxFileSize: number; // in MB
  onUploadComplete: (results: BatchPredictionResult[]) => void;
  onError: (error: UploadError) => void;
}

interface BatchPredictionResult {
  rowNumber: number;
  originalData: Record<string, any>;
  prediction: any;
  confidence: number;
  success: boolean;
  error?: string;
}
```

**Visual Design:**
- Drag-and-drop zone with dashed border
- File preview with column mapping
- Progress bar with percentage and ETA
- Results table with download button

**Behavior:**
- Validate CSV structure before upload
- Stream processing for large files
- Real-time progress updates
- Error highlighting with row numbers


### 3. Voice Call Interface Component

**Purpose:** WebRTC-based voice calling with live transcription

**Interface:**
```typescript
interface CallInterfaceProps {
  callId: string;
  recipientName: string;
  recipientPhone: string;
  onCallEnd: (callData: CallSummary) => void;
}

interface CallSummary {
  duration: number; // seconds
  transcription: TranscriptionSegment[];
  sentimentAnalysis: SentimentData;
  keyTopics: string[];
  actionItems: string[];
}

interface TranscriptionSegment {
  speaker: 'agent' | 'customer';
  text: string;
  timestamp: number;
  confidence: number;
}
```

**Visual Design:**
- Centered call card with contact info
- Large call control buttons (mute, hold, transfer, end)
- Live transcription panel with auto-scroll
- Sentiment indicator with color-coded emotion
- Timer display

**Behavior:**
- Establish WebRTC peer connection
- Stream audio to backend for transcription
- Update transcription every 3 seconds
- Calculate sentiment every 10 seconds
- Save complete call data on end

### 4. Real-time Prediction Widget

**Purpose:** Display live AI predictions with confidence scores

**Interface:**
```typescript
interface PredictionWidgetProps {
  modelId: string;
  title: string;
  maxPredictions: number; // Display limit
  refreshInterval?: number; // ms
}

interface Prediction {
  id: string;
  timestamp: Date;
  input: Record<string, any>;
  output: any;
  confidence: number;
  modelVersion: string;
}
```

**Visual Design:**
- Scrollable list of recent predictions
- Confidence bar with color gradient
- Timestamp with relative time
- Expandable details view

**Behavior:**
- Subscribe to WebSocket for model-specific predictions
- Auto-scroll to newest prediction
- Limit display to maxPredictions count
- Cache predictions in local state


### 5. Enhanced Dashboard Components

**Revenue Metrics Card:**
```typescript
interface RevenueMetricsProps {
  mrr: number; // Monthly Recurring Revenue
  arr: number; // Annual Recurring Revenue
  arpu: number; // Average Revenue Per User
  cac: number; // Customer Acquisition Cost
  dateRange: DateRange;
}
```

**Bay Utilization Gauge:**
```typescript
interface BayUtilizationProps {
  currentUtilization: number; // 0-100
  targetUtilization: number; // Target threshold
  totalBays: number;
  occupiedBays: number;
  bayDetails: BayStatus[];
}

interface BayStatus {
  bayId: string;
  bayName: string;
  status: 'occupied' | 'available' | 'maintenance';
  currentJob?: ServiceJob;
}
```

**AI Predictions Summary:**
```typescript
interface AIPredictionsSummaryProps {
  engines: EngineMetrics[];
  totalPredictions: number;
  averageAccuracy: number;
}

interface EngineMetrics {
  engineName: string;
  modelCount: number;
  predictions24h: number;
  averageAccuracy: number;
  status: 'healthy' | 'degraded' | 'offline';
}
```

### 6. Analytics Dashboard Components

**Revenue Chart:**
- Line/Area chart showing revenue trends
- Multiple series (Sales, Service, Finance)
- Date range selector
- Export to image/CSV

**Customer Metrics:**
- Acquisition funnel visualization
- Retention cohort analysis
- Churn rate trends
- LTV calculations

**Utilization Gauge:**
- Service bay utilization over time
- Technician productivity metrics
- Parts inventory turnover
- Equipment usage rates

**Voice Metrics:**
- Call volume trends
- Average call duration
- Sentiment distribution
- Conversion rates by agent


## Data Models

### AI Model Data Structure

```typescript
interface AIModel {
  id: string;
  name: string;
  engineType: 'service' | 'sales' | 'finance' | 'insurance' | 'fleet' | 'voice';
  category: string;
  description: string;
  version: string;
  status: 'active' | 'training' | 'idle' | 'error';
  accuracy: number; // 0-100
  totalPredictions: number;
  predictions24h: number;
  lastUpdated: Date;
  inputSchema: Record<string, FieldSchema>;
  outputSchema: Record<string, FieldSchema>;
  metadata: {
    trainingDate: Date;
    datasetSize: number;
    features: string[];
    hyperparameters: Record<string, any>;
  };
}

interface FieldSchema {
  type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
  required: boolean;
  description: string;
  validation?: ValidationRule[];
}
```

### Voice Call Data Structure

```typescript
interface VoiceCall {
  id: string;
  agentId: string;
  agentName: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // seconds
  status: 'ringing' | 'active' | 'on-hold' | 'completed' | 'missed' | 'failed';
  transcription: TranscriptionSegment[];
  sentimentAnalysis: {
    overall: 'positive' | 'neutral' | 'negative';
    timeline: SentimentPoint[];
    emotions: EmotionScore[];
  };
  metadata: {
    callType: 'inbound' | 'outbound';
    callPurpose: string;
    outcome: string;
    followUpRequired: boolean;
    recordingUrl?: string;
  };
}

interface SentimentPoint {
  timestamp: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number; // -1 to 1
}

interface EmotionScore {
  emotion: 'joy' | 'anger' | 'sadness' | 'fear' | 'surprise' | 'neutral';
  score: number; // 0-1
}
```

### Analytics Data Structure

```typescript
interface AnalyticsData {
  revenue: RevenueMetrics;
  customers: CustomerMetrics;
  utilization: UtilizationMetrics;
  voice: VoiceMetrics;
  dateRange: DateRange;
}

interface RevenueMetrics {
  mrr: number;
  arr: number;
  arpu: number;
  cac: number;
  ltv: number;
  trends: TimeSeries[];
  breakdown: {
    sales: number;
    service: number;
    finance: number;
    insurance: number;
  };
}

interface CustomerMetrics {
  totalCustomers: number;
  activeCustomers: number;
  newCustomers: number;
  churnedCustomers: number;
  churnRate: number;
  acquisitionFunnel: FunnelStage[];
  cohortAnalysis: CohortData[];
}

interface UtilizationMetrics {
  bayUtilization: number;
  technicianUtilization: number;
  partsInventoryTurnover: number;
  averageServiceTime: number;
  completionRate: number;
  trends: TimeSeries[];
}

interface VoiceMetrics {
  totalCalls: number;
  averageDuration: number;
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  conversionRate: number;
  topAgents: AgentPerformance[];
  callVolumeTrends: TimeSeries[];
}
```


### Notification Data Structure

```typescript
interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'ai-prediction';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: {
    engineType?: string;
    modelId?: string;
    priority?: 'low' | 'medium' | 'high' | 'critical';
  };
}
```

### Multi-tenant Configuration

```typescript
interface TenantConfig {
  tenantId: string;
  companyName: string;
  domain: string;
  branding: {
    logoUrl: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
  features: {
    enabledEngines: EngineType[];
    enabledModels: string[];
    maxUsers: number;
    storageLimit: number; // GB
  };
  settings: {
    timezone: string;
    currency: string;
    dateFormat: string;
    language: string;
  };
}
```

## Error Handling

### Error Types and Handling Strategy

**1. Network Errors**
- **Scenario:** API request fails due to network issues
- **Handling:** 
  - Display toast notification with retry option
  - Implement exponential backoff (1s, 2s, 4s)
  - Cache last successful data for offline viewing
  - Show connection status indicator in header

**2. Validation Errors**
- **Scenario:** User input fails validation
- **Handling:**
  - Inline error messages below form fields
  - Highlight invalid fields with red border
  - Prevent form submission until resolved
  - Provide helpful error messages with examples

**3. AI Model Errors**
- **Scenario:** AI prediction fails or returns low confidence
- **Handling:**
  - Display error state in AI Model Card
  - Log error details for debugging
  - Provide fallback to manual processing
  - Notify administrators for critical models

**4. WebSocket Connection Errors**
- **Scenario:** Real-time connection drops
- **Handling:**
  - Automatic reconnection with exponential backoff
  - Display "Reconnecting..." indicator
  - Queue updates during disconnection
  - Sync state on reconnection

**5. WebRTC Call Errors**
- **Scenario:** Voice call fails to establish or drops
- **Handling:**
  - Display clear error message with reason
  - Provide retry option
  - Fall back to phone call option
  - Log call quality metrics


### Error Boundary Implementation

```typescript
class ErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error tracking service (e.g., Sentry)
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

### API Error Response Format

```typescript
interface APIError {
  status: number;
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

// Example error responses:
// 400 Bad Request: { status: 400, code: 'VALIDATION_ERROR', message: 'Invalid input data' }
// 401 Unauthorized: { status: 401, code: 'AUTH_REQUIRED', message: 'Authentication required' }
// 403 Forbidden: { status: 403, code: 'PERMISSION_DENIED', message: 'Insufficient permissions' }
// 404 Not Found: { status: 404, code: 'RESOURCE_NOT_FOUND', message: 'Resource not found' }
// 500 Server Error: { status: 500, code: 'INTERNAL_ERROR', message: 'Internal server error' }
```

## Implementation Priority Matrix

### High Priority (Week 1) - Core Functionality

**Must-Have Features:**
1. **AI Model Card Component** - Foundation for all AI dashboards
2. **API Service Layer** - Required for backend integration
3. **Service AI Dashboard** - Most complex engine, template for others
4. **Sales AI Dashboard** - High business value
5. **WebSocket Service** - Enables real-time features
6. **Enhanced Dashboard** - Central hub improvements

**Deliverables:**
- Functional AI Model Cards displaying model status
- REST API integration for all endpoints
- 2 complete AI engine dashboards
- Real-time prediction updates
- Enhanced main dashboard with AI summaries

### Medium Priority (Week 2) - Extended Features

**Should-Have Features:**
1. **Remaining AI Engine Dashboards** (Finance, Insurance, Fleet, Workforce, Voice)
2. **Bulk Upload Component** - Batch processing capability
3. **Analytics Dashboard** - Unified metrics view
4. **Real-time Prediction Widget** - Live prediction feed
5. **Notification Center** - Centralized notifications

**Deliverables:**
- All 7 AI engine dashboards complete
- CSV bulk upload with progress tracking
- Comprehensive analytics dashboard
- Real-time updates across all pages
- Enhanced notification system

### Low Priority (Week 3) - Advanced Features

**Nice-to-Have Features:**
1. **Voice Dashboard** - Call management interface
2. **WebRTC Call Interface** - Live calling with transcription
3. **Call Monitoring Dashboard** - Supervisor features
4. **Export Functionality** - PDF/Excel reports
5. **Push Notifications** - Browser notifications
6. **UI Polish** - Animations, transitions, micro-interactions

**Deliverables:**
- Complete voice AI integration
- WebRTC calling functionality
- Report export in multiple formats
- Push notification support
- Polished UI with smooth animations

## Technical Debt and Refactoring Needs

### Current Issues to Address

**1. State Management:**
- **Issue:** Props drilling across multiple component levels
- **Solution:** Implement Context API for global state (Auth, Notifications, WebSocket)
- **Impact:** Cleaner code, easier maintenance

**2. Code Duplication:**
- **Issue:** Similar patterns repeated across engine pages
- **Solution:** Create reusable layout components and hooks
- **Impact:** Reduced bundle size, consistent UX

**3. Type Safety:**
- **Issue:** Some components use 'any' types
- **Solution:** Define strict TypeScript interfaces for all data structures
- **Impact:** Better IDE support, fewer runtime errors

**4. Performance:**
- **Issue:** Large components re-rendering unnecessarily
- **Solution:** Implement React.memo, useMemo, useCallback strategically
- **Impact:** Improved performance, smoother interactions

**5. Testing:**
- **Issue:** No test coverage currently
- **Solution:** Add unit tests for utilities, integration tests for components
- **Impact:** Confidence in refactoring, fewer bugs

### Recommended Refactoring

**Phase 1: Extract Common Patterns**
```typescript
// Create reusable engine dashboard layout
components/layouts/EngineLayout.tsx
components/layouts/AIEngineDashboardLayout.tsx

// Create reusable hooks
hooks/useEngineData.ts
hooks/usePagination.ts
hooks/useFilters.ts
hooks/useSort.ts
```

**Phase 2: Implement Context Providers**
```typescript
context/AuthContext.tsx - User authentication state
context/NotificationContext.tsx - Global notifications
context/WebSocketContext.tsx - WebSocket connection
context/ThemeContext.tsx - Theme customization
```

**Phase 3: Optimize Bundle Size**
```typescript
// Implement code splitting
const ServiceEngine = lazy(() => import('./pages/ServiceEngine'))
const SalesEngine = lazy(() => import('./pages/SalesEngine'))

// Tree-shake unused Recharts components
// Lazy load heavy modals
// Optimize images and assets
```

## Migration Strategy

### Incremental Implementation Approach

**Step 1: Foundation (Days 1-2)**
- Set up new directory structure (components/ai, components/voice, etc.)
- Create API service layer
- Implement WebSocket service
- Create AI Model Card component
- Add necessary dependencies to package.json

**Step 2: First AI Dashboard (Days 3-4)**
- Create ServiceAIDashboard.tsx as template
- Integrate AI Model Cards
- Connect to API endpoints
- Test real-time updates
- Document patterns for other dashboards

**Step 3: Replicate Pattern (Days 5-7)**
- Create remaining AI engine dashboards using template
- Customize each for specific engine needs
- Ensure consistent UX across all dashboards
- Add filtering and search capabilities

**Step 4: Bulk Upload (Days 8-9)**
- Implement BulkUpload component
- Add CSV parsing and validation
- Create progress tracking UI
- Test with large files
- Add error handling

**Step 5: Analytics (Days 10-11)**
- Create AnalyticsDashboard page
- Implement chart components
- Integrate with analytics APIs
- Add date range selection
- Create export functionality

**Step 6: Voice Integration (Days 12-14)**
- Create VoiceDashboard page
- Implement WebRTC service
- Build CallInterface component
- Add transcription display
- Implement sentiment analysis UI

**Step 7: Polish & Testing (Days 15-16)**
- Add loading states and error boundaries
- Implement animations and transitions
- Test across browsers and devices
- Fix bugs and edge cases
- Performance optimization

**Step 8: Documentation (Day 17)**
- Document component APIs
- Create usage examples
- Write deployment guide
- Update README

### Backward Compatibility

**Maintaining Existing Functionality:**
- All existing pages remain functional during migration
- New features added incrementally without breaking changes
- Gradual migration of existing components to new patterns
- Feature flags for enabling new features per tenant

**Data Migration:**
- No database schema changes required
- API endpoints remain backward compatible
- New endpoints added alongside existing ones
- Graceful degradation if backend features unavailable

## Testing Strategy

### Unit Testing

**Tools:** Vitest, React Testing Library

**Coverage Areas:**
- Component rendering and props
- User interactions (clicks, inputs)
- State management logic
- Utility functions
- Data transformations

**Example Test Cases:**
```typescript
describe('AIModelCard', () => {
  it('should render model name and accuracy', () => {
    render(<AIModelCard modelName="Lead Scoring" accuracy={95} />);
    expect(screen.getByText('Lead Scoring')).toBeInTheDocument();
    expect(screen.getByText('95%')).toBeInTheDocument();
  });

  it('should call onPredict when predict button clicked', () => {
    const onPredict = vi.fn();
    render(<AIModelCard onPredict={onPredict} />);
    fireEvent.click(screen.getByText('Predict'));
    expect(onPredict).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Testing

**Tools:** Vitest, MSW (Mock Service Worker)

**Coverage Areas:**
- API integration flows
- WebSocket message handling
- Multi-component interactions
- Navigation and routing
- Authentication flows

**Example Test Cases:**
```typescript
describe('AI Engine Dashboard Integration', () => {
  it('should load and display AI models from API', async () => {
    server.use(
      rest.get('/api/ai-engine/models/', (req, res, ctx) => {
        return res(ctx.json({ models: mockModels }));
      })
    );

    render(<ServiceAI />);
    await waitFor(() => {
      expect(screen.getByText('Predictive Maintenance')).toBeInTheDocument();
    });
  });
});
```


### End-to-End Testing

**Tools:** Playwright or Cypress

**Coverage Areas:**
- Complete user workflows
- Cross-browser compatibility
- Performance benchmarks
- Accessibility compliance

**Example Test Scenarios:**
1. User logs in → navigates to Service AI → triggers prediction → views results
2. User uploads CSV → monitors progress → downloads results
3. User initiates voice call → views transcription → ends call → reviews summary
4. User generates analytics report → exports to PDF → verifies data accuracy

### Performance Testing

**Metrics to Monitor:**
- Initial page load time (target: < 2s)
- Time to interactive (target: < 3s)
- API response times (target: < 500ms)
- WebSocket latency (target: < 100ms)
- Memory usage (target: < 100MB)
- Bundle size (target: < 500KB gzipped)

**Tools:**
- Lighthouse for performance audits
- Chrome DevTools for profiling
- React DevTools Profiler for component performance
- Bundle analyzer for code splitting optimization

## AI Models Specification

### Complete AI Model Inventory (65+ Models)

**Service AI Engine (15 Models)**

1. **Battery Failure Prediction**
   - Input: Battery age, voltage, temperature, charge cycles
   - Output: Failure probability (0-100%), estimated days until failure
   - Accuracy Target: 92%

2. **Brake Wear Detection**
   - Input: Brake pad thickness, vehicle mileage, driving patterns
   - Output: Wear level (%), replacement recommendation
   - Accuracy Target: 95%

3. **Engine Diagnostics**
   - Input: OBD-II codes, sensor readings, vehicle history
   - Output: Issue diagnosis, severity, repair recommendations
   - Accuracy Target: 88%

4. **AC System Analysis**
   - Input: Refrigerant pressure, temperature differential, compressor status
   - Output: System health score, issue identification
   - Accuracy Target: 90%

5. **Tire Pressure Monitoring**
   - Input: Tire pressure readings, temperature, vehicle load
   - Output: Optimal pressure recommendations, leak detection
   - Accuracy Target: 96%

6. **Service Time Estimation**
   - Input: Service type, vehicle model, technician skill, parts availability
   - Output: Estimated completion time (minutes)
   - Accuracy Target: 85%

7. **Bay Utilization Optimizer**
   - Input: Current jobs, bay capabilities, technician availability
   - Output: Optimal bay assignments, utilization percentage
   - Accuracy Target: 91%

8. **Appointment Scheduler**
   - Input: Service requests, technician schedules, bay availability
   - Output: Optimal appointment slots, conflict resolution
   - Accuracy Target: 93%

9. **Quality Score Predictor**
   - Input: Technician history, service complexity, time pressure
   - Output: Expected quality score (0-100)
   - Accuracy Target: 87%

10. **Customer Satisfaction Forecaster**
    - Input: Service history, wait time, issue resolution, pricing
    - Output: Satisfaction probability, NPS prediction
    - Accuracy Target: 89%

11. **Parts Demand Prediction**
    - Input: Historical usage, seasonal trends, vehicle population
    - Output: Forecasted demand by part (next 30/60/90 days)
    - Accuracy Target: 84%

12. **Inventory Optimizer**
    - Input: Current stock, demand forecast, lead times, storage costs
    - Output: Optimal reorder points, quantities
    - Accuracy Target: 88%

13. **Skill Matching Engine**
    - Input: Job requirements, technician skills, certifications, availability
    - Output: Best technician match score (0-100)
    - Accuracy Target: 94%

14. **Workload Balancer**
    - Input: Technician current load, job complexity, deadlines
    - Output: Optimal job distribution, load percentages
    - Accuracy Target: 90%

15. **Damage Detection (Vision AI)**
    - Input: Vehicle images (multiple angles)
    - Output: Damage locations, severity, repair cost estimate
    - Accuracy Target: 86%

**Sales AI Engine (12 Models)**

1. **Lead Conversion Predictor**
   - Input: Lead source, demographics, engagement history, budget
   - Output: Conversion probability (0-100%)
   - Accuracy Target: 91%

2. **Hot Lead Identifier**
   - Input: Website behavior, inquiry details, response time
   - Output: Lead temperature (hot/warm/cold), priority score
   - Accuracy Target: 93%

3. **Price Recommendation Engine**
   - Input: Vehicle details, market conditions, competitor pricing, customer budget
   - Output: Optimal price point, discount recommendations
   - Accuracy Target: 87%

4. **Discount Optimizer**
   - Input: Customer profile, negotiation history, inventory age, sales targets
   - Output: Maximum discount threshold, approval requirements
   - Accuracy Target: 89%

5. **Vehicle Demand Forecaster**
   - Input: Historical sales, market trends, economic indicators, seasonality
   - Output: Demand forecast by model (next 30/60/90 days)
   - Accuracy Target: 85%

6. **Seasonal Trend Analyzer**
   - Input: Multi-year sales data, regional factors, festivals
   - Output: Seasonal patterns, optimal inventory timing
   - Accuracy Target: 88%

7. **Customer Lifetime Value**
   - Input: Purchase history, service frequency, referrals, demographics
   - Output: Predicted LTV ($), customer segment
   - Accuracy Target: 86%

8. **Churn Predictor**
   - Input: Engagement metrics, service satisfaction, competitor activity
   - Output: Churn probability (0-100%), retention recommendations
   - Accuracy Target: 84%

9. **Upsell Opportunity Detector**
   - Input: Customer profile, current vehicle, financial capacity
   - Output: Upsell products, probability of acceptance
   - Accuracy Target: 82%

10. **Test Drive Scheduler**
    - Input: Customer availability, vehicle availability, sales rep schedules
    - Output: Optimal test drive slots, route recommendations
    - Accuracy Target: 92%

11. **Financing Eligibility**
    - Input: Customer income, credit history, employment, existing loans
    - Output: Eligibility score, loan amount range, interest rate estimate
    - Accuracy Target: 90%

12. **Trade-in Valuator**
    - Input: Vehicle details, condition, mileage, market data
    - Output: Trade-in value range, depreciation analysis
    - Accuracy Target: 88%

**Finance AI Engine (10 Models)**

1. **Credit Score Predictor**
   - Input: Income, employment history, existing debts, payment history
   - Output: Predicted credit score (300-850)
   - Accuracy Target: 89%

2. **Loan Approval Engine**
   - Input: Application details, credit score, debt-to-income ratio
   - Output: Approval/rejection, confidence level, conditions
   - Accuracy Target: 94%

3. **Fraud Detection System**
   - Input: Transaction details, device fingerprint, location, behavior patterns
   - Output: Fraud risk score (0-100), flagged anomalies
   - Accuracy Target: 96%

4. **Transaction Anomaly Detector**
   - Input: Transaction amount, frequency, location, time
   - Output: Anomaly score, investigation priority
   - Accuracy Target: 93%

5. **Revenue Forecaster**
   - Input: Historical revenue, pipeline, market conditions, seasonality
   - Output: Revenue forecast (next 30/60/90 days), confidence intervals
   - Accuracy Target: 87%

6. **Cash Flow Predictor**
   - Input: Receivables, payables, seasonal patterns, payment terms
   - Output: Cash flow forecast, liquidity alerts
   - Accuracy Target: 85%

7. **Payment Default Risk**
   - Input: Customer payment history, financial health, economic indicators
   - Output: Default probability (0-100%), recommended actions
   - Accuracy Target: 91%

8. **EMI Calculator (AI-Enhanced)**
   - Input: Loan amount, tenure, customer profile, market rates
   - Output: Optimal EMI structure, affordability score
   - Accuracy Target: 95%

9. **Interest Rate Optimizer**
   - Input: Customer risk profile, market rates, competition, profit targets
   - Output: Optimal interest rate, approval probability
   - Accuracy Target: 88%

10. **Collection Priority Ranker**
    - Input: Outstanding amounts, customer history, contact attempts
    - Output: Collection priority ranking, optimal contact strategy
    - Accuracy Target: 86%

**Insurance AI Engine (8 Models)**

1. **Claim Probability Predictor**
   - Input: Driver profile, vehicle type, location, driving patterns
   - Output: Claim probability (next 12 months)
   - Accuracy Target: 87%

2. **Damage Severity Estimator**
   - Input: Accident images, vehicle details, impact description
   - Output: Damage severity (minor/moderate/severe/total loss), repair cost
   - Accuracy Target: 89%

3. **Fraud Detection Engine**
   - Input: Claim details, claimant history, incident patterns
   - Output: Fraud probability (0-100%), investigation triggers
   - Accuracy Target: 94%

4. **Risk Score Calculator**
   - Input: Driver age, history, vehicle type, location, usage
   - Output: Risk score (0-100), rating factors
   - Accuracy Target: 91%

5. **Premium Optimizer**
   - Input: Risk score, market rates, customer retention, competition
   - Output: Optimal premium amount, discount eligibility
   - Accuracy Target: 88%

6. **Policy Renewal Predictor**
   - Input: Customer satisfaction, claim history, premium changes, competition
   - Output: Renewal probability (0-100%), retention strategies
   - Accuracy Target: 86%

7. **Claim Cost Estimator**
   - Input: Damage assessment, repair quotes, parts costs, labor rates
   - Output: Estimated claim payout, approval recommendations
   - Accuracy Target: 90%

8. **Underwriting Assistant**
   - Input: Application details, risk factors, medical history (if applicable)
   - Output: Underwriting decision, premium recommendations, conditions
   - Accuracy Target: 92%

**Fleet AI Engine (10 Models)**

1. **Route Optimizer**
   - Input: Destinations, traffic data, vehicle range, charging stations
   - Output: Optimal route, estimated time, energy consumption
   - Accuracy Target: 93%

2. **Fuel/Energy Consumption Predictor**
   - Input: Route, vehicle type, driving style, weather, load
   - Output: Predicted consumption, cost estimate
   - Accuracy Target: 89%

3. **Range Estimator**
   - Input: Battery level, route, weather, driving patterns
   - Output: Realistic range estimate, charging recommendations
   - Accuracy Target: 91%

4. **Charging Station Recommender**
   - Input: Current location, destination, battery level, station availability
   - Output: Optimal charging stops, timing, cost
   - Accuracy Target: 94%

5. **Battery Health Monitor**
   - Input: Charge cycles, temperature history, voltage patterns, age
   - Output: State of Health (SOH %), degradation rate, replacement timeline
   - Accuracy Target: 92%

6. **Maintenance Scheduler**
   - Input: Vehicle mileage, usage patterns, component health, manufacturer guidelines
   - Output: Optimal maintenance schedule, priority ranking
   - Accuracy Target: 88%

7. **Driver Behavior Analyzer**
   - Input: Acceleration, braking, speed, route efficiency
   - Output: Driver score (0-100), coaching recommendations
   - Accuracy Target: 90%

8. **Vehicle Utilization Optimizer**
   - Input: Fleet size, demand patterns, vehicle locations, availability
   - Output: Optimal vehicle assignments, utilization percentages
   - Accuracy Target: 87%

9. **Energy Cost Forecaster**
   - Input: Usage patterns, electricity rates, charging schedules
   - Output: Cost forecast (next 30/60/90 days), optimization recommendations
   - Accuracy Target: 86%

10. **Fleet Efficiency Scorer**
    - Input: All fleet metrics (utilization, costs, maintenance, driver performance)
    - Output: Overall efficiency score (0-100), improvement areas
    - Accuracy Target: 89%

**Workforce AI Engine (8 Models)**

1. **Performance Predictor**
   - Input: Historical performance, training, workload, tenure
   - Output: Predicted performance score (next quarter)
   - Accuracy Target: 85%

2. **Skill Gap Analyzer**
   - Input: Current skills, job requirements, industry benchmarks
   - Output: Skill gaps, proficiency levels, priority areas
   - Accuracy Target: 91%

3. **Training Recommender**
   - Input: Skill gaps, learning style, career goals, budget
   - Output: Personalized training plan, ROI estimates
   - Accuracy Target: 88%

4. **Shift Optimizer**
   - Input: Employee availability, workload forecast, labor laws, preferences
   - Output: Optimal shift schedules, coverage analysis
   - Accuracy Target: 92%

5. **Attrition Risk Predictor**
   - Input: Engagement metrics, compensation, performance, tenure
   - Output: Attrition probability (0-100%), retention strategies
   - Accuracy Target: 87%

6. **Hiring Success Predictor**
   - Input: Candidate profile, interview scores, assessments, role requirements
   - Output: Success probability, cultural fit score
   - Accuracy Target: 84%

7. **Productivity Forecaster**
   - Input: Historical productivity, workload, team composition, tools
   - Output: Productivity forecast, bottleneck identification
   - Accuracy Target: 86%

8. **Team Composition Optimizer**
   - Input: Project requirements, employee skills, availability, team dynamics
   - Output: Optimal team composition, collaboration score
   - Accuracy Target: 89%

**Voice AI Engine (10 Models)**

1. **Real-time Transcriber**
   - Input: Audio stream
   - Output: Text transcription with timestamps, speaker identification
   - Accuracy Target: 94%

2. **Sentiment Analyzer**
   - Input: Transcribed text, audio tone
   - Output: Sentiment (positive/neutral/negative), confidence score
   - Accuracy Target: 91%

3. **Emotion Detector**
   - Input: Audio features, transcribed text
   - Output: Emotion classification (joy/anger/sadness/fear/surprise/neutral)
   - Accuracy Target: 88%

4. **Intent Classifier**
   - Input: Customer utterances, conversation context
   - Output: Intent category (inquiry/complaint/purchase/support), confidence
   - Accuracy Target: 92%

5. **Conversion Predictor**
   - Input: Call transcript, sentiment, customer profile, agent performance
   - Output: Conversion probability (0-100%)
   - Accuracy Target: 86%

6. **Call Quality Scorer**
   - Input: Transcript, adherence to script, resolution time, customer satisfaction
   - Output: Quality score (0-100), improvement areas
   - Accuracy Target: 89%

7. **Agent Performance Analyzer**
   - Input: Call metrics, conversion rates, customer feedback, adherence
   - Output: Performance score (0-100), coaching recommendations
   - Accuracy Target: 87%

8. **Customer Satisfaction Predictor**
   - Input: Call sentiment, resolution status, wait time, agent behavior
   - Output: Predicted CSAT score (1-5), NPS likelihood
   - Accuracy Target: 85%

9. **Objection Handler**
   - Input: Customer objection text, context
   - Output: Recommended response, success probability
   - Accuracy Target: 83%

10. **Upsell Opportunity Detector**
    - Input: Customer needs, current products, conversation flow
    - Output: Upsell opportunities, optimal timing, script suggestions
    - Accuracy Target: 81%

## Design System

### Color Palette

**Primary Colors:**
```css
--primary-50: #f5f3ff;
--primary-100: #ede9fe;
--primary-200: #ddd6fe;
--primary-300: #c4b5fd;
--primary-400: #a78bfa;
--primary-500: #8b5cf6; /* Main purple */
--primary-600: #7c3aed;
--primary-700: #6d28d9;
--primary-800: #5b21b6;
--primary-900: #4c1d95;
```

**Semantic Colors:**
```css
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
--info: #3b82f6;
```

**Neutral Colors:**
```css
--slate-50: #f8fafc;
--slate-100: #f1f5f9;
--slate-200: #e2e8f0;
--slate-300: #cbd5e1;
--slate-400: #94a3b8;
--slate-500: #64748b;
--slate-600: #475569;
--slate-700: #334155;
--slate-800: #1e293b;
--slate-900: #0f172a;
```

### Typography

**Font Family:**
- Primary: Inter, system-ui, sans-serif
- Monospace: 'Fira Code', monospace (for code/data)

**Font Sizes:**
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

**Font Weights:**
```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```


### Spacing System

```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
```

### Border Radius

```css
--radius-sm: 0.375rem;  /* 6px */
--radius-md: 0.5rem;    /* 8px */
--radius-lg: 0.75rem;   /* 12px */
--radius-xl: 1rem;      /* 16px */
--radius-full: 9999px;  /* Circular */
```

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
```

### Animation Durations

```css
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
```

### Component Patterns

**Button Variants:**
```typescript
// Primary Button
className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"

// Secondary Button
className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors"

// Danger Button
className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"

// Ghost Button
className="text-slate-600 hover:bg-slate-100 px-4 py-2 rounded-lg font-medium transition-colors"
```

**Card Pattern:**
```typescript
className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all"
```

**Input Pattern:**
```typescript
className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
```

**Modal Pattern:**
```typescript
// Overlay
className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"

// Modal Content
className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto"
```


## API Integration Design

### REST API Service Layer

**Base Configuration:**
```typescript
// services/api.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class APIService {
  private client: AxiosInstance;
  
  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for auth token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error)
    );
  }

  private async handleError(error: any) {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    throw error;
  }
}
```

### API Endpoints

**AI Engine Endpoints:**
```typescript
// Get all models for an engine
GET /api/ai-engine/models/?engine={engineType}
Response: { models: AIModel[] }

// Get single model details
GET /api/ai-engine/models/{modelId}/
Response: AIModel

// Make single prediction
POST /api/ai-engine/predict/{modelName}/
Body: { input: Record<string, any> }
Response: { prediction: any, confidence: number, modelVersion: string }

// Batch predictions
POST /api/ai-engine/batch-predict/
Body: { modelId: string, data: Record<string, any>[] }
Response: { jobId: string, status: 'processing' }

// Get batch job status
GET /api/ai-engine/batch-jobs/{jobId}/
Response: { status: string, progress: number, results?: any[] }
```

**Analytics Endpoints:**
```typescript
// Revenue analytics
GET /api/analytics/revenue/?start_date={date}&end_date={date}
Response: RevenueMetrics

// Customer analytics
GET /api/analytics/customers/?start_date={date}&end_date={date}
Response: CustomerMetrics

// Utilization analytics
GET /api/analytics/utilization/?start_date={date}&end_date={date}
Response: UtilizationMetrics

// Voice analytics
GET /api/analytics/voice/?start_date={date}&end_date={date}
Response: VoiceMetrics
```

**Voice Endpoints:**
```typescript
// Get all calls
GET /api/voice/calls/?status={status}&limit={limit}
Response: { calls: VoiceCall[], total: number }

// Get call details
GET /api/voice/calls/{callId}/
Response: VoiceCall

// Get transcription
GET /api/voice/transcriptions/{callId}/
Response: { segments: TranscriptionSegment[] }

// Get sentiment analysis
GET /api/voice/sentiment/{callId}/
Response: SentimentAnalysis

// Initiate call
POST /api/voice/calls/
Body: { recipientPhone: string, agentId: string }
Response: { callId: string, webrtcConfig: WebRTCConfig }
```


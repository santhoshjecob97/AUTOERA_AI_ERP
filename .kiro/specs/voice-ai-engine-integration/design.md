# Design Document

## Overview

The Voice AI Engine Integration feature adds comprehensive voice calling capabilities to all six AI Engine pages (Service, Sales, Finance, Insurance, Workforce, and Fleet) in the AutoEra platform. This integration leverages the existing Twilio Voice API and Retell AI infrastructure to provide intelligent, context-aware voice interactions that enhance customer engagement and operational efficiency.

### Key Design Goals

1. **Unified Voice Interface**: Provide a consistent voice calling experience across all engine pages
2. **Context-Aware Conversations**: Enable AI agents to access engine-specific data for personalized interactions
3. **Real-Time Monitoring**: Display live call status, transcription, and sentiment analysis
4. **Seamless Integration**: Work harmoniously with existing features without disrupting current workflows
5. **Scalable Architecture**: Support concurrent calls and future expansion

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React/TypeScript)               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Service      │  │ Sales        │  │ Finance      │     │
│  │ Engine       │  │ Engine       │  │ Engine       │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                  │                  │              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Insurance    │  │ Workforce    │  │ Fleet        │     │
│  │ Engine       │  │ Engine       │  │ Engine       │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                   ┌────────▼────────┐                       │
│                   │  Voice AI       │                       │
│                   │  Components     │                       │
│                   └────────┬────────┘                       │
└────────────────────────────┼──────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  Voice API      │
                    │  Service Layer  │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌───────▼────────┐  ┌───────▼────────┐
│ Twilio Voice   │  │ Retell AI      │  │ Backend API    │
│ API            │  │ Platform       │  │ (Django)       │
└────────────────┘  └────────────────┘  └────────────────┘
```

### Component Architecture

```
Voice AI Components
├── VoiceCallButton (Shared)
│   └── Renders call action button on engine pages
├── VoiceCallModal (Shared)
│   ├── CallInitiator
│   ├── LiveCallMonitor
│   ├── TranscriptionViewer
│   └── SentimentDisplay
├── CallHistoryPanel (Shared)
│   ├── CallList
│   ├── CallDetails
│   └── CallFilters
├── Engine-Specific Adapters
│   ├── ServiceVoiceAdapter
│   ├── SalesVoiceAdapter
│   ├── FinanceVoiceAdapter
│   ├── InsuranceVoiceAdapter
│   ├── WorkforceVoiceAdapter
│   └── FleetVoiceAdapter
└── Voice Context Provider
    └── Manages call state and engine context
```


## Components and Interfaces

### 1. VoiceCallButton Component

**Purpose**: Provides a consistent call action button across all engine pages

**Props Interface**:
```typescript
interface VoiceCallButtonProps {
  engineType: 'service' | 'sales' | 'finance' | 'insurance' | 'workforce' | 'fleet';
  contextData: EngineContextData;
  customerId?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'icon';
  onCallStart?: (callId: string) => void;
}
```

**Behavior**:
- Renders a prominent button with phone icon
- Opens VoiceCallModal when clicked
- Passes engine-specific context to modal
- Disabled state when no customer selected

### 2. VoiceCallModal Component

**Purpose**: Main interface for initiating and monitoring voice calls

**Props Interface**:
```typescript
interface VoiceCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  engineType: EngineType;
  contextData: EngineContextData;
  customerId?: string;
}
```

**State Management**:
```typescript
interface VoiceCallState {
  callStatus: 'idle' | 'initiating' | 'ringing' | 'active' | 'ended';
  callId: string | null;
  duration: number;
  transcription: TranscriptionSegment[];
  sentiment: SentimentAnalysis;
  error: string | null;
}
```

### 3. Engine Context Adapters

**Purpose**: Transform engine-specific data into voice call context

**Base Interface**:
```typescript
interface VoiceContextAdapter {
  getCallContext(data: any): VoiceCallContext;
  getGreeting(customer: Customer): string;
  getIntents(): CallIntent[];
  handleCallEnd(callData: CallEndData): Promise<void>;
}
```

**Service Engine Adapter**:
```typescript
class ServiceVoiceAdapter implements VoiceContextAdapter {
  getCallContext(job: ServiceJob): VoiceCallContext {
    return {
      engineType: 'service',
      customer: {
        name: job.customer,
        phone: job.customerPhone,
        vehicle: job.vehicle,
      },
      context: {
        jobId: job.id,
        issue: job.issue,
        status: job.status,
        bay: job.bay,
        technician: job.technician,
        estimatedCompletion: job.predictedCompletion,
      },
      intents: ['appointment_booking', 'status_inquiry', 'parts_availability'],
    };
  }
}
```

### 4. Voice API Service Integration

**Interface**:
```typescript
interface VoiceCallService {
  initiateCall(request: InitiateCallRequest): Promise<CallSession>;
  getCallStatus(callId: string): Promise<CallStatus>;
  endCall(callId: string): Promise<void>;
  getTranscription(callId: string): Promise<TranscriptionSegment[]>;
  getSentiment(callId: string): Promise<SentimentAnalysis>;
}
```

**Implementation**:
```typescript
class VoiceCallServiceImpl implements VoiceCallService {
  constructor(private voiceApi: VoiceAPI) {}
  
  async initiateCall(request: InitiateCallRequest): Promise<CallSession> {
    const response = await this.voiceApi.initiateCall({
      recipientPhone: request.phone,
      agentId: 'priya-ai',
      callPurpose: request.purpose,
    });
    
    return {
      callId: response.callId,
      sessionId: response.sessionId,
      status: 'ringing',
    };
  }
}
```


## Data Models

### VoiceCallContext

```typescript
interface VoiceCallContext {
  engineType: EngineType;
  customer: {
    id?: string;
    name: string;
    phone: string;
    email?: string;
  };
  context: Record<string, any>; // Engine-specific data
  intents: string[];
  metadata?: Record<string, any>;
}
```

### CallSession

```typescript
interface CallSession {
  callId: string;
  sessionId: string;
  status: CallStatus;
  startTime: Date;
  endTime?: Date;
  duration: number;
  engineType: EngineType;
  customerId?: string;
  transcription: TranscriptionSegment[];
  sentiment: SentimentAnalysis;
  outcome?: string;
  recordingUrl?: string;
}
```

### TranscriptionSegment

```typescript
interface TranscriptionSegment {
  speaker: 'agent' | 'customer';
  text: string;
  timestamp: number;
  confidence: number;
}
```

### SentimentAnalysis

```typescript
interface SentimentAnalysis {
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
```

### Engine-Specific Context Models

**Service Engine Context**:
```typescript
interface ServiceCallContext {
  jobId?: string;
  vehicle: string;
  issue?: string;
  status?: string;
  bay?: string;
  technician?: string;
  estimatedCompletion?: string;
  serviceHistory?: ServiceRecord[];
}
```

**Sales Engine Context**:
```typescript
interface SalesCallContext {
  leadId: string;
  vehicleInterest: string;
  budget?: string;
  aiScore: number;
  status: string;
  lastAction?: string;
  interactionHistory?: Interaction[];
}
```

**Finance Engine Context**:
```typescript
interface FinanceCallContext {
  applicationId: string;
  loanAmount: string;
  creditScore: number;
  status: string;
  riskLevel: string;
  monthlyEMI?: string;
  requiredDocuments?: string[];
}
```

**Insurance Engine Context**:
```typescript
interface InsuranceCallContext {
  policyId?: string;
  claimId?: string;
  policyHolder: string;
  vehicle: string;
  policyType?: string;
  expiryDate?: string;
  claimStatus?: string;
}
```

**Workforce Engine Context**:
```typescript
interface WorkforceCallContext {
  employeeId: string;
  name: string;
  role: string;
  department: string;
  schedule?: ShiftSchedule;
  performanceScore?: number;
  trainingStatus?: string;
}
```

**Fleet Engine Context**:
```typescript
interface FleetCallContext {
  vehicleId: string;
  model: string;
  plateNumber: string;
  driver: string;
  location: string;
  batteryLevel?: number;
  status: string;
  route?: string;
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Voice Button Rendering
*For any* AI engine page component, when the component mounts, it should render a voice call button element with appropriate styling and accessibility attributes.
**Validates: Requirements 1.1**

### Property 2: Modal Opening with Context
*For any* engine page and customer selection, clicking the voice call button should open the voice modal and pass the correct engine-specific context data.
**Validates: Requirements 1.2, 1.3**

### Property 3: API Connection on Call Initiation
*For any* valid call initiation request, the system should make a POST request to the Twilio Voice API with correct authentication and parameters.
**Validates: Requirements 1.4**

### Property 4: Real-Time UI Updates
*For any* active call session, the UI should continuously update call status, duration, and transcription in real-time without manual refresh.
**Validates: Requirements 1.5**

### Property 5: Service Context Completeness
*For any* service call initiation, the context object should contain customer name, vehicle details, service history, and current job status fields.
**Validates: Requirements 2.1**

### Property 6: Service Greeting Generation
*For any* service call, the AI greeting should include the customer's name and vehicle model in the message text.
**Validates: Requirements 2.2**

### Property 7: Bay Availability Access
*For any* appointment discussion during a service call, the system should query and return current bay availability data from the service database.
**Validates: Requirements 2.3**

### Property 8: Service Status Retrieval
*For any* valid job ID, requesting service status should return current progress percentage and estimated completion time.
**Validates: Requirements 2.4**

### Property 9: Appointment Booking Workflow
*For any* valid appointment booking request, the system should validate availability, create the appointment record, and send confirmation notification in sequence.
**Validates: Requirements 2.5**

### Property 10: Service Call Logging
*For any* completed service call, the system should create a call log record and update related service job records automatically.
**Validates: Requirements 2.6**

### Property 11: Sales Context Completeness
*For any* sales call initiation, the context object should contain lead score, vehicle interest, budget, and interaction history fields.
**Validates: Requirements 3.1**

### Property 12: Sales Greeting Generation
*For any* sales call, the AI greeting should mention the customer's vehicle preferences in the message text.
**Validates: Requirements 3.2**

### Property 13: Inventory Data Access
*For any* vehicle discussion during a sales call, the system should query and return current inventory data and specifications.
**Validates: Requirements 3.3**

### Property 14: Test Drive Scheduling
*For any* customer interest signal during a sales call, the system should offer test drive scheduling options with available time slots.
**Validates: Requirements 3.4**

### Property 15: Lead Score Updates
*For any* completed sales call with sentiment data, the lead score should be recalculated and updated based on conversation sentiment.
**Validates: Requirements 3.5**

### Property 16: CRM Record Updates
*For any* completed sales call, the system should create follow-up tasks and update CRM records automatically.
**Validates: Requirements 3.6**

### Property 17: Finance Context Completeness
*For any* finance call initiation, the context object should contain application status, credit score, loan amount, and required documents fields.
**Validates: Requirements 4.1**

### Property 18: Finance Greeting Generation
*For any* finance call, the AI greeting should mention the loan application ID in the message text.
**Validates: Requirements 4.2**

### Property 19: EMI Calculation
*For any* loan amount, tenure, and interest rate combination, the system should calculate and return the correct monthly EMI value.
**Validates: Requirements 4.3**

### Property 20: Applicant Data Validation
*For any* applicant information collected during a finance call, the system should validate completeness against required document checklist.
**Validates: Requirements 4.4**

### Property 21: Loan Approval Workflow
*For any* approved loan application, the system should update application status to "Approved" and trigger disbursement workflow.
**Validates: Requirements 4.5**

### Property 22: Compliance Logging
*For any* completed finance call, the system should record compliance information including consent and disclosures.
**Validates: Requirements 4.6**

### Property 23: Insurance Context Completeness
*For any* insurance call initiation, the context object should contain policy details, claim history, coverage terms, and renewal dates fields.
**Validates: Requirements 5.1**

### Property 24: Insurance Greeting Generation
*For any* insurance call, the AI greeting should mention either the policy ID or claim ID in the message text.
**Validates: Requirements 5.2**

### Property 25: Claims Process Guidance
*For any* claim discussion during an insurance call, the system should follow the defined claims process steps in sequence.
**Validates: Requirements 5.3**

### Property 26: Renewal Quote Generation
*For any* policy renewal request, the system should calculate and present premium quotes with coverage options.
**Validates: Requirements 5.4**

### Property 27: Policy Data Access
*For any* coverage verification request, the system should retrieve and explain policy terms and benefits.
**Validates: Requirements 5.5**

### Property 28: Insurance Record Updates
*For any* completed insurance call, the system should update claim status or renewal records automatically.
**Validates: Requirements 5.6**

### Property 29: Workforce Context Completeness
*For any* workforce call initiation, the context object should contain employee details, schedule, performance metrics, and training status fields.
**Validates: Requirements 6.1**

### Property 30: Workforce Greeting Generation
*For any* workforce call, the AI greeting should mention the employee's name and department in the message text.
**Validates: Requirements 6.2**

### Property 31: Schedule Data Access
*For any* schedule discussion during a workforce call, the system should query and return shift calendar and availability data.
**Validates: Requirements 6.3**

### Property 32: Shift Conflict Detection
*For any* shift change request, the system should check for scheduling conflicts and update schedules if no conflicts exist.
**Validates: Requirements 6.4**

### Property 33: Performance Data Access
*For any* performance review discussion, the system should retrieve and reference performance metrics and skill assessments.
**Validates: Requirements 6.5**

### Property 34: HR Record Updates
*For any* completed workforce call, the system should log HR interactions and update employee records automatically.
**Validates: Requirements 6.6**

### Property 35: Fleet Context Completeness
*For any* fleet call initiation, the context object should contain vehicle location, battery status, route information, and driver details fields.
**Validates: Requirements 7.1**

### Property 36: Fleet Greeting Generation
*For any* fleet call, the AI greeting should mention the vehicle ID and current status in the message text.
**Validates: Requirements 7.2**

### Property 37: GPS Data Access
*For any* route discussion during a fleet call, the system should query and return real-time GPS coordinates and traffic information.
**Validates: Requirements 7.3**

### Property 38: Emergency Prioritization
*For any* call marked as emergency, the system should elevate its priority in the call queue above non-emergency calls.
**Validates: Requirements 7.4**

### Property 39: Vehicle Status Retrieval
*For any* vehicle status request, the system should retrieve and return battery level, maintenance alerts, and health score.
**Validates: Requirements 7.5**

### Property 40: Fleet Record Updates
*For any* completed fleet call, the system should log fleet interactions and update vehicle records automatically.
**Validates: Requirements 7.6**

### Property 41: Live Call Monitor Display
*For any* active call, the live monitor should display current call duration, status, and participant information.
**Validates: Requirements 8.1**

### Property 42: Real-Time Transcription Display
*For any* speech input during a call, the transcription should appear in the UI with correct speaker identification.
**Validates: Requirements 8.2**

### Property 43: Sentiment Indicator Display
*For any* sentiment analysis data received, the UI should display emotional indicators and sentiment scores.
**Validates: Requirements 8.3**

### Property 44: Multi-Call Dashboard
*For any* number of active calls, the dashboard should display all ongoing conversations with their current status.
**Validates: Requirements 8.4**

### Property 45: Silent Supervisor Monitoring
*For any* active call, a supervisor should be able to join and monitor without the customer hearing or being notified.
**Validates: Requirements 8.5**

### Property 46: Call History Filtering
*For any* combination of filter parameters (date, engine, status, outcome), the system should return only matching call records.
**Validates: Requirements 9.1**

### Property 47: Call Record Completeness
*For any* call ID, the call record should contain complete transcription, sentiment analysis, and metadata.
**Validates: Requirements 9.2**

### Property 48: Performance Metrics Calculation
*For any* time period, the system should calculate correct metrics including average call duration, resolution rate, and satisfaction score.
**Validates: Requirements 9.3**

### Property 49: Report Aggregation
*For any* aggregation parameters (engine, agent, time period, purpose), the system should produce a report with correct aggregated data.
**Validates: Requirements 9.4**

### Property 50: Data Export Formats
*For any* export request, the system should generate files in the requested format (CSV or PDF) with all specified fields.
**Validates: Requirements 9.5**


### Property 51: Workflow Configuration Storage
*For any* workflow definition (scripts, intents, templates), the system should save and retrieve the configuration correctly.
**Validates: Requirements 10.1**

### Property 52: Workflow Selection Logic
*For any* engine type and call purpose combination, the system should select the appropriate workflow configuration.
**Validates: Requirements 10.2**

### Property 53: Intent Recognition and Routing
*For any* customer utterance, the system should identify the intent and route to the correct handler function.
**Validates: Requirements 10.3**

### Property 54: Objection Handling
*For any* recognized objection type, the system should respond with the predefined response or escalation path.
**Validates: Requirements 10.4**

### Property 55: Workflow Completion Actions
*For any* completed workflow, the system should execute all defined post-call actions (record creation, notifications).
**Validates: Requirements 10.5**

### Property 56: Language Detection and Selection
*For any* customer, the system should detect preferred language or allow manual selection before call initiation.
**Validates: Requirements 11.1**

### Property 57: Language-Specific Responses
*For any* selected language, all AI responses and greetings should be generated in that language.
**Validates: Requirements 11.2**

### Property 58: Multi-Language Transcription
*For any* supported language (English, Hindi, regional), the transcription engine should accurately convert speech to text.
**Validates: Requirements 11.3**

### Property 59: Language Switching Context Preservation
*For any* mid-call language change, the conversation context and history should be maintained.
**Validates: Requirements 11.4**

### Property 60: Language-Aware Sentiment Analysis
*For any* language, sentiment analysis should account for language-specific expressions and cultural context.
**Validates: Requirements 11.5**

### Property 61: Recording Initiation with Consent
*For any* call start, audio recording should begin automatically and customer consent notification should be played.
**Validates: Requirements 12.1**

### Property 62: Recording Encryption
*For any* recorded audio file, encryption should be applied both at rest (storage) and in transit (transmission).
**Validates: Requirements 12.2**

### Property 63: Access Control Enforcement
*For any* recording access attempt, the system should verify user permissions and log the access event.
**Validates: Requirements 12.3**

### Property 64: Retention Policy Enforcement
*For any* recording past its retention period, the system should automatically delete the file and associated data.
**Validates: Requirements 12.4**

### Property 65: Recording Export Completeness
*For any* recording export request, the exported package should include audio file, metadata, transcription, and compliance markers.
**Validates: Requirements 12.5**

### Property 66: Escalation Keyword Detection
*For any* customer utterance containing escalation keywords ("speak to human", "manager", "help"), the system should recognize escalation intent.
**Validates: Requirements 13.1**

### Property 67: Call Transfer with Context
*For any* escalation to human agent, the transfer should occur with complete call history and customer context data.
**Validates: Requirements 13.2**

### Property 68: Fallback Options When No Agents Available
*For any* escalation attempt when no agents are available, the system should offer callback scheduling or emergency contact alternatives.
**Validates: Requirements 13.3**

### Property 69: Emergency Call Prioritization
*For any* call marked as emergency, it should be placed at the front of the call queue ahead of non-emergency calls.
**Validates: Requirements 13.4**

### Property 70: Agent Context Transfer
*For any* call transfer to human agent, the agent interface should display complete call history and customer data.
**Validates: Requirements 13.5**

### Property 71: Network Failure Graceful Degradation
*For any* network connectivity issue during a call, the system should implement fallback mechanisms and maintain call quality.
**Validates: Requirements 14.3**

### Property 72: Performance Metrics Tracking
*For any* call session, the system should record performance metrics including latency, call quality score, and error count.
**Validates: Requirements 14.5**

### Property 73: Engine Database Access
*For any* call initiated from an engine page, the system should access data from that engine's specific database tables.
**Validates: Requirements 15.1**

### Property 74: Cross-Module Data Synchronization
*For any* record update during a call, changes should propagate to all related modules in real-time.
**Validates: Requirements 15.2**

### Property 75: Existing Workflow Integration
*For any* action triggered during a call (appointment booking, lead creation), existing workflow functions should execute correctly.
**Validates: Requirements 15.3**

### Property 76: Notification System Integration
*For any* call event (start, end, escalation), notifications should appear using the existing notification system.
**Validates: Requirements 15.4**

### Property 77: Export Feature Integration
*For any* data export from an engine page, voice call information should be included in the exported data.
**Validates: Requirements 15.5**


## Error Handling

### Error Categories

1. **Network Errors**
   - Connection timeout to Twilio API
   - WebSocket disconnection during active call
   - API rate limiting

2. **Authentication Errors**
   - Invalid API credentials
   - Expired authentication tokens
   - Insufficient permissions

3. **Call Errors**
   - Customer phone number invalid or unreachable
   - Call dropped unexpectedly
   - Audio quality degradation

4. **Data Errors**
   - Missing required context data
   - Invalid engine type
   - Customer record not found

### Error Handling Strategies

**Network Errors**:
- Implement exponential backoff retry logic (3 attempts)
- Display user-friendly error messages
- Offer manual retry option
- Log errors for monitoring

**Authentication Errors**:
- Automatically refresh tokens when expired
- Redirect to login if refresh fails
- Display clear authentication error messages

**Call Errors**:
- Validate phone numbers before initiating calls
- Implement call quality monitoring
- Offer alternative contact methods on failure
- Automatically log failed call attempts

**Data Errors**:
- Validate context data before call initiation
- Provide default values for optional fields
- Display clear validation error messages
- Prevent call initiation with incomplete data

### Error Recovery

```typescript
class VoiceErrorHandler {
  async handleCallError(error: VoiceCallError): Promise<void> {
    switch (error.type) {
      case 'NETWORK_ERROR':
        await this.retryWithBackoff(error.operation);
        break;
      case 'INVALID_PHONE':
        this.showPhoneValidationError(error.phone);
        break;
      case 'CALL_DROPPED':
        await this.logDroppedCall(error.callId);
        this.offerCallback(error.customerId);
        break;
      case 'MISSING_CONTEXT':
        this.showContextError(error.missingFields);
        break;
      default:
        this.showGenericError(error);
    }
  }
}
```

## Testing Strategy

### Unit Testing

**Component Tests**:
- Test VoiceCallButton renders correctly for each engine type
- Test VoiceCallModal state transitions
- Test context adapter transformations
- Test error handling in voice service

**Service Tests**:
- Test Voice API service methods
- Test context data validation
- Test call state management
- Test error recovery logic

### Property-Based Testing

The testing strategy will use **fast-check** (for TypeScript/JavaScript) as the property-based testing library.

**Configuration**:
- Each property test should run a minimum of 100 iterations
- Tests should use appropriate generators for domain-specific data
- Failed tests should shrink to minimal failing examples

**Test Organization**:
- Each correctness property will be implemented as a separate property-based test
- Tests will be tagged with feature name and property number
- Tests will reference the design document property they validate

**Example Property Test Structure**:
```typescript
import fc from 'fast-check';

describe('Voice AI Engine Integration - Property Tests', () => {
  it('Property 2: Modal Opening with Context', () => {
    /**
     * Feature: voice-ai-engine-integration
     * Property 2: Modal Opening with Context
     * Validates: Requirements 1.2, 1.3
     */
    fc.assert(
      fc.property(
        fc.record({
          engineType: fc.constantFrom('service', 'sales', 'finance', 'insurance', 'workforce', 'fleet'),
          customerId: fc.string(),
          contextData: fc.object(),
        }),
        (testCase) => {
          // Test that clicking voice button opens modal with correct context
          const result = openVoiceModal(testCase.engineType, testCase.contextData);
          expect(result.isOpen).toBe(true);
          expect(result.context.engineType).toBe(testCase.engineType);
          expect(result.context).toMatchObject(testCase.contextData);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Integration Testing

**API Integration Tests**:
- Test Twilio Voice API connection
- Test Retell AI integration
- Test backend API endpoints
- Test WebSocket real-time updates

**End-to-End Tests**:
- Test complete call flow from initiation to completion
- Test call recording and transcription
- Test sentiment analysis pipeline
- Test cross-engine data synchronization

### Manual Testing

**User Acceptance Testing**:
- Test voice quality and clarity
- Test AI response accuracy
- Test UI responsiveness
- Test accessibility features

**Performance Testing**:
- Test concurrent call handling (100+ calls)
- Test response time under load
- Test memory usage during long calls
- Test network resilience


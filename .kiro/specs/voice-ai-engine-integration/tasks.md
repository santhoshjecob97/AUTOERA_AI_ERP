# Implementation Plan

## Phase 1: Foundation and Shared Components

- [x] 1. Set up Voice AI infrastructure and types


  - Create TypeScript interfaces for voice call data models
  - Set up voice context provider with React Context API
  - Configure voice API service integration with existing API layer
  - Create utility functions for phone number validation and formatting
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ]* 1.1 Write property test for phone number validation
  - **Property 77: Phone Number Validation**
  - **Validates: Requirements 1.4**



- [x] 2. Create VoiceCallButton shared component

  - Implement button component with engine type prop
  - Add phone icon and styling variants (primary, secondary, icon)
  - Implement disabled state logic
  - Add accessibility attributes (aria-label, role)
  - Handle click event to open voice modal
  - _Requirements: 1.1_

- [ ]* 2.1 Write property test for button rendering


  - **Property 1: Voice Button Rendering**
  - **Validates: Requirements 1.1**


- [x] 3. Create VoiceCallModal shared component

  - Implement modal container with open/close state
  - Create modal header with engine-specific branding
  - Add call status indicator (idle, initiating, ringing, active, ended)
  - Implement modal close handler with cleanup
  - Add responsive design for mobile and desktop
  - _Requirements: 1.2, 1.3_

- [ ]* 3.1 Write property test for modal opening with context
  - **Property 2: Modal Opening with Context**
  - **Validates: Requirements 1.2, 1.3**



- [ ] 4. Implement CallInitiator component
  - Create phone number input with validation
  - Add call purpose selector dropdown
  - Implement initiate call button with loading state
  - Display customer information preview
  - Handle call initiation API request
  - _Requirements: 1.4_

- [x]* 4.1 Write property test for API connection

  - **Property 3: API Connection on Call Initiation**
  - **Validates: Requirements 1.4**

- [ ] 5. Implement LiveCallMonitor component
  - Display real-time call duration timer
  - Show call status with visual indicators
  - Display participant information (customer name, phone)
  - Add end call button with confirmation
  - Implement WebSocket connection for real-time updates
  - _Requirements: 1.5, 8.1_

- [ ]* 5.1 Write property test for real-time UI updates
  - **Property 4: Real-Time UI Updates**
  - **Validates: Requirements 1.5**


- [ ]* 5.2 Write property test for live call monitor display
  - **Property 41: Live Call Monitor Display**
  - **Validates: Requirements 8.1**

- [ ] 6. Implement TranscriptionViewer component
  - Create scrollable transcription container
  - Display transcription segments with speaker labels
  - Add timestamp for each segment
  - Implement auto-scroll to latest transcription
  - Show confidence scores for each segment
  - _Requirements: 8.2_


- [ ]* 6.1 Write property test for transcription display
  - **Property 42: Real-Time Transcription Display**
  - **Validates: Requirements 8.2**

- [ ] 7. Implement SentimentDisplay component
  - Create sentiment indicator with color coding (positive/neutral/negative)
  - Display overall sentiment score
  - Show sentiment timeline chart
  - Display emotion breakdown (joy, anger, sadness, etc.)
  - Add tooltips for sentiment explanations
  - _Requirements: 8.3_

- [ ]* 7.1 Write property test for sentiment indicator display
  - **Property 43: Sentiment Indicator Display**
  - **Validates: Requirements 8.3**



- [ ] 8. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.


## Phase 2: Engine-Specific Adapters




- [ ] 9. Create base VoiceContextAdapter interface
  - Define adapter interface with required methods
  - Create abstract base class with common functionality
  - Implement context validation logic
  - Add error handling for missing data
  - _Requirements: 2.1, 3.1, 4.1, 5.1, 6.1, 7.1_


- [ ] 10. Implement ServiceVoiceAdapter
  - Transform ServiceJob data to VoiceCallContext
  - Generate service-focused greeting with vehicle details
  - Define service-specific intents (appointment_booking, status_inquiry, parts_availability)
  - Implement handleCallEnd to update service records
  - _Requirements: 2.1, 2.2, 2.6_

- [ ]* 10.1 Write property test for service context completeness
  - **Property 5: Service Context Completeness**

  - **Validates: Requirements 2.1**

- [ ]* 10.2 Write property test for service greeting generation
  - **Property 6: Service Greeting Generation**
  - **Validates: Requirements 2.2**

- [ ]* 10.3 Write property test for service call logging
  - **Property 10: Service Call Logging**

  - **Validates: Requirements 2.6**

- [ ] 11. Implement SalesVoiceAdapter
  - Transform Lead data to VoiceCallContext
  - Generate sales-focused greeting with vehicle preferences
  - Define sales-specific intents (lead_qualification, test_drive_booking, inventory_inquiry)
  - Implement handleCallEnd to update CRM records
  - _Requirements: 3.1, 3.2, 3.6_

- [x]* 11.1 Write property test for sales context completeness

  - **Property 11: Sales Context Completeness**
  - **Validates: Requirements 3.1**

- [ ]* 11.2 Write property test for sales greeting generation
  - **Property 12: Sales Greeting Generation**
  - **Validates: Requirements 3.2**

- [x]* 11.3 Write property test for CRM record updates

  - **Property 16: CRM Record Updates**
  - **Validates: Requirements 3.6**

- [ ] 12. Implement FinanceVoiceAdapter
  - Transform LoanApplication data to VoiceCallContext
  - Generate finance-focused greeting with application details
  - Define finance-specific intents (loan_inquiry, emi_calculation, document_collection)
  - Implement handleCallEnd to update loan records and log compliance
  - _Requirements: 4.1, 4.2, 4.6_


- [ ]* 12.1 Write property test for finance context completeness
  - **Property 17: Finance Context Completeness**
  - **Validates: Requirements 4.1**

- [ ]* 12.2 Write property test for finance greeting generation
  - **Property 18: Finance Greeting Generation**
  - **Validates: Requirements 4.2**


- [ ]* 12.3 Write property test for compliance logging
  - **Property 22: Compliance Logging**
  - **Validates: Requirements 4.6**

- [ ] 13. Implement InsuranceVoiceAdapter
  - Transform InsurancePolicy/Claim data to VoiceCallContext
  - Generate insurance-focused greeting with policy/claim details
  - Define insurance-specific intents (claim_filing, renewal_inquiry, coverage_check)
  - Implement handleCallEnd to update insurance records
  - _Requirements: 5.1, 5.2, 5.6_


- [ ]* 13.1 Write property test for insurance context completeness
  - **Property 23: Insurance Context Completeness**
  - **Validates: Requirements 5.1**

- [ ]* 13.2 Write property test for insurance greeting generation
  - **Property 24: Insurance Greeting Generation**
  - **Validates: Requirements 5.2**


- [ ]* 13.3 Write property test for insurance record updates
  - **Property 28: Insurance Record Updates**
  - **Validates: Requirements 5.6**

- [ ] 14. Implement WorkforceVoiceAdapter
  - Transform Employee data to VoiceCallContext
  - Generate workforce-focused greeting with employee details
  - Define workforce-specific intents (schedule_coordination, performance_review, training_inquiry)
  - Implement handleCallEnd to update HR records

  - _Requirements: 6.1, 6.2, 6.6_

- [ ]* 14.1 Write property test for workforce context completeness
  - **Property 29: Workforce Context Completeness**
  - **Validates: Requirements 6.1**

- [ ]* 14.2 Write property test for workforce greeting generation
  - **Property 30: Workforce Greeting Generation**

  - **Validates: Requirements 6.2**

- [ ]* 14.3 Write property test for HR record updates
  - **Property 34: HR Record Updates**
  - **Validates: Requirements 6.6**

- [ ] 15. Implement FleetVoiceAdapter
  - Transform FleetVehicle data to VoiceCallContext
  - Generate fleet-focused greeting with vehicle status
  - Define fleet-specific intents (route_optimization, emergency_assistance, status_check)
  - Implement handleCallEnd to update fleet records
  - _Requirements: 7.1, 7.2, 7.6_

- [ ]* 15.1 Write property test for fleet context completeness
  - **Property 35: Fleet Context Completeness**
  - **Validates: Requirements 7.1**



- [ ]* 15.2 Write property test for fleet greeting generation
  - **Property 36: Fleet Greeting Generation**
  - **Validates: Requirements 7.2**

- [ ]* 15.3 Write property test for fleet record updates
  - **Property 40: Fleet Record Updates**
  - **Validates: Requirements 7.6**


- [ ] 16. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.


## Phase 3: Engine Page Integration

- [ ] 17. Integrate Voice AI into Service Engine page
  - Add VoiceCallButton to Service Engine toolbar
  - Pass service job context to voice modal
  - Implement service-specific call handlers
  - Connect to ServiceVoiceAdapter
  - Test voice calling from service operations view
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [ ]* 17.1 Write property test for bay availability access
  - **Property 7: Bay Availability Access**
  - **Validates: Requirements 2.3**


- [ ]* 17.2 Write property test for service status retrieval
  - **Property 8: Service Status Retrieval**
  - **Validates: Requirements 2.4**

- [ ]* 17.3 Write property test for appointment booking workflow
  - **Property 9: Appointment Booking Workflow**
  - **Validates: Requirements 2.5**

- [-] 18. Integrate Voice AI into Sales Engine page

  - Add VoiceCallButton to Sales Engine toolbar
  - Pass lead context to voice modal
  - Implement sales-specific call handlers
  - Connect to SalesVoiceAdapter
  - Test voice calling from leads table
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [ ]* 18.1 Write property test for inventory data access
  - **Property 13: Inventory Data Access**

  - **Validates: Requirements 3.3**

- [ ]* 18.2 Write property test for test drive scheduling
  - **Property 14: Test Drive Scheduling**
  - **Validates: Requirements 3.4**

- [ ]* 18.3 Write property test for lead score updates
  - **Property 15: Lead Score Updates**
  - **Validates: Requirements 3.5**

- [ ] 19. Integrate Voice AI into Finance Engine page
  - Add VoiceCallButton to Finance Engine toolbar
  - Pass loan application context to voice modal
  - Implement finance-specific call handlers
  - Connect to FinanceVoiceAdapter
  - Test voice calling from loan applications table
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [x]* 19.1 Write property test for EMI calculation

  - **Property 19: EMI Calculation**
  - **Validates: Requirements 4.3**

- [ ]* 19.2 Write property test for applicant data validation
  - **Property 20: Applicant Data Validation**
  - **Validates: Requirements 4.4**

- [ ]* 19.3 Write property test for loan approval workflow
  - **Property 21: Loan Approval Workflow**
  - **Validates: Requirements 4.5**

- [ ] 20. Integrate Voice AI into Insurance Engine page
  - Add VoiceCallButton to Insurance Engine toolbar
  - Pass policy/claim context to voice modal
  - Implement insurance-specific call handlers
  - Connect to InsuranceVoiceAdapter
  - Test voice calling from claims and policies tables
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_


- [ ]* 20.1 Write property test for claims process guidance
  - **Property 25: Claims Process Guidance**
  - **Validates: Requirements 5.3**

- [ ]* 20.2 Write property test for renewal quote generation
  - **Property 26: Renewal Quote Generation**
  - **Validates: Requirements 5.4**

- [ ]* 20.3 Write property test for policy data access
  - **Property 27: Policy Data Access**
  - **Validates: Requirements 5.5**

- [ ] 21. Integrate Voice AI into Workforce Engine page
  - Add VoiceCallButton to Workforce Engine toolbar
  - Pass employee context to voice modal
  - Implement workforce-specific call handlers
  - Connect to WorkforceVoiceAdapter
  - Test voice calling from employee directory
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_



- [ ]* 21.1 Write property test for schedule data access
  - **Property 31: Schedule Data Access**
  - **Validates: Requirements 6.3**

- [ ]* 21.2 Write property test for shift conflict detection
  - **Property 32: Shift Conflict Detection**
  - **Validates: Requirements 6.4**

- [ ]* 21.3 Write property test for performance data access
  - **Property 33: Performance Data Access**
  - **Validates: Requirements 6.5**

- [ ] 22. Integrate Voice AI into Fleet Engine page
  - Add VoiceCallButton to Fleet Engine toolbar
  - Pass vehicle context to voice modal
  - Implement fleet-specific call handlers
  - Connect to FleetVoiceAdapter
  - Test voice calling from fleet tracking table
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [ ]* 22.1 Write property test for GPS data access
  - **Property 37: GPS Data Access**
  - **Validates: Requirements 7.3**

- [ ]* 22.2 Write property test for emergency prioritization
  - **Property 38: Emergency Prioritization**
  - **Validates: Requirements 7.4**

- [ ]* 22.3 Write property test for vehicle status retrieval
  - **Property 39: Vehicle Status Retrieval**
  - **Validates: Requirements 7.5**

- [ ] 23. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.


## Phase 4: Advanced Features

- [ ] 24. Implement CallHistoryPanel component
  - Create call history list with pagination
  - Add filters for date range, engine type, status, outcome
  - Implement call details view with full transcription
  - Add search functionality for customer name/phone
  - Display call analytics and metrics
  - _Requirements: 9.1, 9.2_

- [ ]* 24.1 Write property test for call history filtering
  - **Property 46: Call History Filtering**
  - **Validates: Requirements 9.1**

- [ ]* 24.2 Write property test for call record completeness
  - **Property 47: Call Record Completeness**
  - **Validates: Requirements 9.2**

- [ ] 25. Implement call analytics and reporting
  - Create analytics dashboard with key metrics
  - Calculate performance metrics (duration, resolution rate, satisfaction)
  - Implement report generation with aggregation
  - Add data export functionality (CSV, PDF)
  - Display charts for call trends and sentiment
  - _Requirements: 9.3, 9.4, 9.5_

- [ ]* 25.1 Write property test for performance metrics calculation
  - **Property 48: Performance Metrics Calculation**
  - **Validates: Requirements 9.3**

- [ ]* 25.2 Write property test for report aggregation
  - **Property 49: Report Aggregation**
  - **Validates: Requirements 9.4**

- [ ]* 25.3 Write property test for data export formats
  - **Property 50: Data Export Formats**
  - **Validates: Requirements 9.5**

- [ ] 26. Implement multi-call dashboard
  - Create dashboard view for all active calls
  - Display call cards with status and duration
  - Add supervisor monitoring capability
  - Implement silent join functionality
  - Show real-time call queue
  - _Requirements: 8.4, 8.5_

- [ ]* 26.1 Write property test for multi-call dashboard
  - **Property 44: Multi-Call Dashboard**
  - **Validates: Requirements 8.4**

- [ ]* 26.2 Write property test for silent supervisor monitoring
  - **Property 45: Silent Supervisor Monitoring**
  - **Validates: Requirements 8.5**

- [ ] 27. Implement workflow configuration system
  - Create workflow editor UI for scripts and intents
  - Implement workflow storage and retrieval
  - Add workflow selection logic based on engine and purpose
  - Create intent recognition and routing system
  - Implement objection handling with predefined responses
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ]* 27.1 Write property test for workflow configuration storage
  - **Property 51: Workflow Configuration Storage**
  - **Validates: Requirements 10.1**

- [ ]* 27.2 Write property test for workflow selection logic
  - **Property 52: Workflow Selection Logic**
  - **Validates: Requirements 10.2**

- [ ]* 27.3 Write property test for intent recognition and routing
  - **Property 53: Intent Recognition and Routing**
  - **Validates: Requirements 10.3**

- [ ]* 27.4 Write property test for objection handling
  - **Property 54: Objection Handling**
  - **Validates: Requirements 10.4**

- [ ]* 27.5 Write property test for workflow completion actions
  - **Property 55: Workflow Completion Actions**
  - **Validates: Requirements 10.5**

- [ ] 28. Implement multi-language support
  - Add language detection and selection UI
  - Implement language-specific response generation
  - Configure multi-language transcription (English, Hindi, regional)
  - Add language switching with context preservation
  - Implement language-aware sentiment analysis
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ]* 28.1 Write property test for language detection and selection
  - **Property 56: Language Detection and Selection**
  - **Validates: Requirements 11.1**

- [ ]* 28.2 Write property test for language-specific responses
  - **Property 57: Language-Specific Responses**
  - **Validates: Requirements 11.2**

- [ ]* 28.3 Write property test for multi-language transcription
  - **Property 58: Multi-Language Transcription**
  - **Validates: Requirements 11.3**

- [ ]* 28.4 Write property test for language switching context preservation
  - **Property 59: Language Switching Context Preservation**
  - **Validates: Requirements 11.4**

- [ ]* 28.5 Write property test for language-aware sentiment analysis
  - **Property 60: Language-Aware Sentiment Analysis**
  - **Validates: Requirements 11.5**

- [ ] 29. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.


## Phase 5: Security and Compliance

- [ ] 30. Implement call recording and compliance features
  - Add automatic recording initiation with consent notification
  - Implement audio file encryption (at rest and in transit)
  - Create role-based access control for recordings
  - Implement audit logging for recording access
  - Add retention policy enforcement with scheduled deletion
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ]* 30.1 Write property test for recording initiation with consent
  - **Property 61: Recording Initiation with Consent**
  - **Validates: Requirements 12.1**

- [ ]* 30.2 Write property test for recording encryption
  - **Property 62: Recording Encryption**
  - **Validates: Requirements 12.2**

- [ ]* 30.3 Write property test for access control enforcement
  - **Property 63: Access Control Enforcement**
  - **Validates: Requirements 12.3**

- [ ]* 30.4 Write property test for retention policy enforcement
  - **Property 64: Retention Policy Enforcement**
  - **Validates: Requirements 12.4**

- [ ]* 30.5 Write property test for recording export completeness
  - **Property 65: Recording Export Completeness**
  - **Validates: Requirements 12.5**

- [ ] 31. Implement emergency call handling and escalation
  - Add escalation keyword detection system
  - Implement call transfer to human agents with context
  - Create fallback options (callback scheduling, emergency contacts)
  - Add emergency call prioritization in queue
  - Implement agent context transfer interface
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [ ]* 31.1 Write property test for escalation keyword detection
  - **Property 66: Escalation Keyword Detection**
  - **Validates: Requirements 13.1**

- [ ]* 31.2 Write property test for call transfer with context
  - **Property 67: Call Transfer with Context**
  - **Validates: Requirements 13.2**

- [ ]* 31.3 Write property test for fallback options
  - **Property 68: Fallback Options When No Agents Available**
  - **Validates: Requirements 13.3**

- [ ]* 31.4 Write property test for emergency call prioritization
  - **Property 69: Emergency Call Prioritization**
  - **Validates: Requirements 13.4**

- [ ]* 31.5 Write property test for agent context transfer
  - **Property 70: Agent Context Transfer**
  - **Validates: Requirements 13.5**

- [ ] 32. Implement error handling and resilience
  - Add network failure detection and graceful degradation
  - Implement retry logic with exponential backoff
  - Create user-friendly error messages for all error types
  - Add performance metrics tracking (latency, quality, errors)
  - Implement call quality monitoring and alerts
  - _Requirements: 14.3, 14.5_

- [ ]* 32.1 Write property test for network failure graceful degradation
  - **Property 71: Network Failure Graceful Degradation**
  - **Validates: Requirements 14.3**

- [ ]* 32.2 Write property test for performance metrics tracking
  - **Property 72: Performance Metrics Tracking**
  - **Validates: Requirements 14.5**

- [ ] 33. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.


## Phase 6: Integration and Polish

- [ ] 34. Implement cross-module data synchronization
  - Add engine database access layer for voice calls
  - Implement real-time data synchronization across modules
  - Integrate with existing workflows (appointments, leads, loans, etc.)
  - Connect to existing notification system for call events
  - Add voice call data to existing export features
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

- [ ]* 34.1 Write property test for engine database access
  - **Property 73: Engine Database Access**
  - **Validates: Requirements 15.1**

- [ ]* 34.2 Write property test for cross-module data synchronization
  - **Property 74: Cross-Module Data Synchronization**
  - **Validates: Requirements 15.2**

- [ ]* 34.3 Write property test for existing workflow integration
  - **Property 75: Existing Workflow Integration**
  - **Validates: Requirements 15.3**

- [ ]* 34.4 Write property test for notification system integration
  - **Property 76: Notification System Integration**
  - **Validates: Requirements 15.4**

- [ ]* 34.5 Write property test for export feature integration
  - **Property 77: Export Feature Integration**
  - **Validates: Requirements 15.5**

- [ ] 35. Add voice call indicators to engine pages
  - Display call history count badges on customer records
  - Add "last called" timestamp to customer cards
  - Show active call indicators on relevant records
  - Implement quick call action from table rows
  - Add voice call filters to existing search/filter systems
  - _Requirements: 1.1, 9.1_

- [ ] 36. Implement mobile responsive design
  - Optimize VoiceCallModal for mobile screens
  - Add touch-friendly controls for call actions
  - Implement swipe gestures for transcription navigation
  - Optimize call history for mobile viewing
  - Test on various mobile devices and screen sizes
  - _Requirements: 1.1, 1.2, 1.5_

- [ ] 37. Add accessibility features
  - Implement keyboard navigation for all voice components
  - Add ARIA labels and roles for screen readers
  - Ensure color contrast meets WCAG standards
  - Add focus indicators for all interactive elements
  - Implement skip links for call transcription
  - _Requirements: 1.1, 1.2_

- [ ] 38. Create user documentation
  - Write user guide for voice calling features
  - Create video tutorials for each engine integration
  - Document voice command keywords and intents
  - Add troubleshooting guide for common issues
  - Create FAQ for voice AI features
  - _Requirements: All_

- [ ] 39. Implement analytics and monitoring
  - Set up call volume monitoring dashboard
  - Add real-time call quality metrics
  - Implement error rate tracking and alerts
  - Create performance reports for stakeholders
  - Add usage analytics by engine and user
  - _Requirements: 9.3, 14.5_

- [ ] 40. Final integration testing
  - Test complete call flow across all six engines
  - Verify data synchronization between modules
  - Test concurrent call handling (100+ calls)
  - Validate recording and compliance features
  - Test emergency escalation workflows
  - _Requirements: All_

- [ ] 41. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.


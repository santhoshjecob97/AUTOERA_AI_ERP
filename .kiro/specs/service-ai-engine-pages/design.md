# Design Document

## Overview

The Service AI Engine Pages feature adds tab-based navigation to the existing Service Engine, creating dedicated pages for each AI-powered service management module while preserving the current dashboard as the main overview. This design follows the established pattern from the Sales Engine implementation, providing a consistent user experience across all AI engines in the AUTOERA platform.

The system will include seven main tabs:
1. **Overview** - Current Service AI dashboard (existing functionality)
2. **Service Bays** - Visual bay management with real-time status
3. **Predictive Maintenance** - AI-powered maintenance forecasting
4. **Technicians** - Skill-based allocation and performance tracking
5. **Parts Inventory** - Stock management with demand forecasting
6. **Service Operations** - Diagnostic reports and customer workflows

## Architecture

### Component Structure

```
pages/
├── ServiceEngine.tsx (Main container with tab navigation)
└── service/
    ├── ServiceBaysPage.tsx
    ├── PredictiveMaintenancePage.tsx
    ├── TechniciansPage.tsx
    ├── PartsInventoryPage.tsx
    └── OperationsPage.tsx
```

### Navigation Flow

The Service Engine will use React Router for tab navigation, similar to the Sales Engine pattern:
- Main route: `/service` (Overview tab - existing dashboard)
- Sub-routes: `/service/bays`, `/service/maintenance`, `/service/technicians`, `/service/inventory`, `/service/operations`

### State Management

- Local state for tab selection and page-specific data
- Shared context for service job data across tabs
- Voice AI integration through existing VoiceContext
- Dashboard data through existing useDashboardData hook

## Components and Interfaces


### 1. Service Engine Main Container

The main ServiceEngine component will be refactored to include tab navigation while preserving all existing functionality.

```typescript
type ServiceView = 'overview' | 'bays' | 'maintenance' | 'technicians' | 'inventory' | 'operations';

interface ServiceEngineProps {
  // No props needed - standalone page
}
```

### 2. Service Bays Page Component

```typescript
interface ServiceBaysPageProps {
  // No props - uses shared service context
}

interface ServiceBay {
  id: string;
  number: number;
  status: 'available' | 'occupied' | 'maintenance';
  currentVehicle?: VehicleInService;
  assignedTechnician?: Technician;
  estimatedCompletion?: Date;
  utilizationRate: number;
}

interface VehicleInService {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  customerName: string;
  serviceType: string;
  progress: number; // 0-100
  startTime: Date;
  estimatedDuration: number; // minutes
}

interface BayUtilization {
  bayId: string;
  utilizationRate: number;
  avgServiceTime: number;
  jobsCompleted: number;
  revenue: number;
}
```

### 3. Predictive Maintenance Page Component

```typescript
interface PredictiveMaintenancePageProps {
  // No props - standalone page
}

interface MaintenancePrediction {
  vehicleId: string;
  customerName: string;
  vehicleMake: string;
  vehicleModel: string;
  mileage: number;
  predictedIssues: PredictedIssue[];
  nextServiceDue: Date;
  confidenceScore: number;
  estimatedCost: number;
  priority: 'urgent' | 'high' | 'medium' | 'low';
}

interface PredictedIssue {
  component: string;
  issueType: string;
  probability: number;
  estimatedTimeframe: string;
  recommendedAction: string;
  partsNeeded: string[];
  estimatedCost: number;
}

interface VehicleHealthTimeline {
  vehicleId: string;
  events: HealthEvent[];
  overallHealth: number; // 0-100
}

interface HealthEvent {
  date: Date;
  type: 'service' | 'prediction' | 'issue';
  description: string;
  severity: 'critical' | 'warning' | 'info';
}
```


### 4. Technicians Page Component

```typescript
interface TechniciansPageProps {
  // No props - standalone page
}

interface Technician {
  id: string;
  name: string;
  avatar?: string;
  status: 'available' | 'busy' | 'break' | 'off-duty';
  currentJob?: ServiceJob;
  skills: TechnicianSkill[];
  certifications: Certification[];
  performance: TechnicianPerformance;
  availability: AvailabilitySchedule;
}

interface TechnicianSkill {
  category: string;
  level: 'beginner' | 'intermediate' | 'expert' | 'master';
  certifications: string[];
}

interface Certification {
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  status: 'active' | 'expiring' | 'expired';
}

interface TechnicianPerformance {
  jobsCompleted: number;
  avgCompletionTime: number;
  qualityScore: number; // 0-5
  customerRating: number; // 0-5
  efficiencyRate: number; // percentage
  onTimeCompletion: number; // percentage
}

interface AvailabilitySchedule {
  currentShift: Shift;
  nextAvailable: Date;
  weeklyHours: number;
  overtimeHours: number;
}

interface Shift {
  start: Date;
  end: Date;
  breakTime: number; // minutes
}

interface JobAssignmentRecommendation {
  jobId: string;
  recommendedTechnician: Technician;
  matchScore: number;
  reasoning: string[];
  alternativeTechnicians: Technician[];
}
```

### 5. Parts Inventory Page Component

```typescript
interface PartsInventoryPageProps {
  // No props - standalone page
}

interface InventoryItem {
  id: string;
  partNumber: string;
  name: string;
  category: string;
  manufacturer: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  unitCost: number;
  location: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'on-order';
  lastRestocked: Date;
  turnoverRate: number;
}

interface StockAlert {
  itemId: string;
  partName: string;
  currentStock: number;
  reorderPoint: number;
  urgency: 'critical' | 'high' | 'medium';
  recommendedOrderQty: number;
  estimatedLeadTime: number; // days
  aiReasoning: string;
}

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplier: Supplier;
  items: OrderItem[];
  totalCost: number;
  orderDate: Date;
  expectedDelivery: Date;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
}

interface OrderItem {
  partId: string;
  partName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

interface Supplier {
  id: string;
  name: string;
  rating: number;
  avgDeliveryTime: number; // days
  reliability: number; // percentage
  priceCompetitiveness: 'low' | 'medium' | 'high';
}

interface DemandForecast {
  partId: string;
  partName: string;
  currentStock: number;
  predictedDemand: DemandPrediction[];
  recommendedAction: string;
  confidence: number;
}

interface DemandPrediction {
  period: string;
  predictedQuantity: number;
  confidence: number;
  factors: string[];
}
```


### 6. Service Operations Page Component

```typescript
interface OperationsPageProps {
  // No props - standalone page
}

interface DiagnosticReport {
  id: string;
  vehicleId: string;
  vehicleInfo: VehicleInfo;
  scanDate: Date;
  technician: string;
  systemsChecked: number;
  issuesFound: DiagnosticIssue[];
  overallHealth: number; // 0-100
  estimatedRepairCost: number;
  estimatedRepairTime: number; // hours
}

interface DiagnosticIssue {
  id: string;
  system: string;
  errorCode: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  aiAnalysis: string;
  recommendedActions: string[];
  partsNeeded: PartRequirement[];
  estimatedCost: number;
  estimatedTime: number; // hours
  confidence: number;
}

interface PartRequirement {
  partId: string;
  partName: string;
  quantity: number;
  inStock: boolean;
  cost: number;
}

interface VehicleInfo {
  vin: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  customerName: string;
  customerPhone: string;
}

interface CustomerApproval {
  id: string;
  serviceJobId: string;
  estimateAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'modified';
  sentDate: Date;
  responseDate?: Date;
  customerNotes?: string;
  approvalMethod: 'email' | 'sms' | 'phone' | 'in-person';
}

interface ServicePackage {
  id: string;
  name: string;
  description: string;
  services: string[];
  basePrice: number;
  discountedPrice: number;
  estimatedDuration: number; // hours
  popularity: number;
  aiRecommendation?: string;
}

interface CustomerFeedback {
  id: string;
  serviceJobId: string;
  customerName: string;
  rating: number; // 1-5
  comments: string;
  date: Date;
  sentiment: 'positive' | 'neutral' | 'negative';
  aiInsights: string[];
  improvementAreas: string[];
}
```

## Data Models

### Extended Service Job Interface

```typescript
interface ServiceJob {
  id: string;
  jobNumber: string;
  vehicle: VehicleInfo;
  customer: CustomerInfo;
  serviceType: string;
  description: string;
  status: 'scheduled' | 'in-progress' | 'waiting-parts' | 'waiting-approval' | 'completed' | 'cancelled';
  priority: 'urgent' | 'high' | 'normal' | 'low';
  assignedBay?: string;
  assignedTechnician?: string;
  scheduledStart: Date;
  actualStart?: Date;
  estimatedCompletion: Date;
  actualCompletion?: Date;
  estimatedCost: number;
  actualCost?: number;
  progress: number; // 0-100
  diagnosticReport?: DiagnosticReport;
  approvalStatus?: CustomerApproval;
  timeline: JobActivity[];
}

interface CustomerInfo {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  preferredContact: 'phone' | 'email' | 'sms' | 'whatsapp';
  serviceHistory: ServiceHistory[];
}

interface ServiceHistory {
  date: Date;
  serviceType: string;
  cost: number;
  mileage: number;
  notes: string;
}

interface JobActivity {
  id: string;
  timestamp: Date;
  type: 'created' | 'started' | 'updated' | 'completed' | 'note';
  description: string;
  user: string;
  photos?: string[];
}
```


### Warranty Models

```typescript
interface WarrantyInfo {
  vehicleId: string;
  warrantyType: 'manufacturer' | 'extended' | 'powertrain' | 'none';
  provider: string;
  startDate: Date;
  endDate: Date;
  mileageLimit: number;
  currentMileage: number;
  status: 'active' | 'expiring-soon' | 'expired';
  coverageDetails: CoverageItem[];
}

interface CoverageItem {
  component: string;
  covered: boolean;
  deductible: number;
  limitations: string[];
}

interface WarrantyClaim {
  id: string;
  claimNumber: string;
  vehicleId: string;
  serviceJobId: string;
  claimAmount: number;
  submittedDate: Date;
  status: 'submitted' | 'under-review' | 'approved' | 'rejected' | 'paid';
  approvalDate?: Date;
  reimbursementAmount?: number;
  rejectionReason?: string;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Tab navigation preserves state
*For any* tab navigation sequence, navigating between tabs and returning to a previous tab should preserve the state of that tab (filters, scroll position, form data).
**Validates: Requirements 1.3, 1.5**

### Property 2: Bay status accuracy
*For any* service bay, the displayed status should accurately reflect the current state: available (no vehicle assigned), occupied (vehicle assigned with technician), or maintenance (bay unavailable).
**Validates: Requirements 2.2**

### Property 3: Bay utilization calculation
*For any* service bay and time period, the utilization rate should be calculated as (occupied time / total available time) × 100, resulting in a value between 0-100.
**Validates: Requirements 2.4**

### Property 4: Queue priority ordering
*For any* set of waiting vehicles, the queue should be ordered by priority (urgent > high > normal > low) and within each priority level by wait time (longest first).
**Validates: Requirements 2.5**

### Property 5: Maintenance prediction confidence
*For any* maintenance prediction, the confidence score should be between 0-100, and predictions with confidence below 60 should be flagged as "low confidence".
**Validates: Requirements 3.2**

### Property 6: Parts prediction timeframe validity
*For any* predicted parts replacement, the estimated timeframe should be a positive number of days, and parts with timeframe < 30 days should be marked as "urgent".
**Validates: Requirements 3.3**

### Property 7: Cost estimation accuracy
*For any* maintenance prediction, the estimated cost should equal the sum of predicted parts costs plus estimated labor costs, with all values being non-negative.
**Validates: Requirements 3.4**

### Property 8: Service history completeness
*For any* vehicle in the system, the service history should include all completed service jobs ordered by date (most recent first), with no duplicate entries.
**Validates: Requirements 3.5**

### Property 9: Skill matrix consistency
*For any* technician, each skill category should have exactly one skill level assigned, and the level should be one of: beginner, intermediate, expert, or master.
**Validates: Requirements 4.1**

### Property 10: Job matching score validity
*For any* job assignment recommendation, the match score should be between 0-100, calculated based on technician skills, availability, and workload, with higher scores indicating better matches.
**Validates: Requirements 4.2**

### Property 11: Performance metrics calculation
*For any* technician, the efficiency rate should be calculated as (actual time / estimated time) × 100, and on-time completion should be (jobs completed on time / total jobs) × 100.
**Validates: Requirements 4.3**

### Property 12: Certification expiry tracking
*For any* certification with an expiry date, the status should be "expiring" if expiry is within 30 days, "expired" if past expiry date, otherwise "active".
**Validates: Requirements 4.4**

### Property 13: Workload balancing fairness
*For any* set of available technicians, the AI workload distribution should ensure no technician has more than 20% more assigned jobs than the average, unless skill requirements dictate otherwise.
**Validates: Requirements 4.5**

### Property 14: Stock status determination
*For any* inventory item, the status should be "out-of-stock" if current stock = 0, "low-stock" if current stock ≤ reorder point, otherwise "in-stock".
**Validates: Requirements 5.2**

### Property 15: Reorder quantity calculation
*For any* low-stock item, the recommended order quantity should be sufficient to reach max stock level: recommended qty = max stock - current stock + safety buffer.
**Validates: Requirements 5.2**

### Property 16: Purchase order total calculation
*For any* purchase order, the total cost should equal the sum of (quantity × unit cost) for all items in the order.
**Validates: Requirements 5.3**

### Property 17: Supplier rating validity
*For any* supplier, the rating should be between 0-5, and reliability percentage should be between 0-100, calculated from historical delivery performance.
**Validates: Requirements 5.4**

### Property 18: Demand forecast confidence
*For any* demand forecast, each prediction period should have a confidence score between 0-100, and the overall forecast confidence should be the average of all period confidences.
**Validates: Requirements 5.5**

### Property 19: Diagnostic issue severity ordering
*For any* diagnostic report, issues should be ordered by severity (critical > high > medium > low), and critical issues should always appear first in the list.
**Validates: Requirements 6.1**

### Property 20: Repair cost estimation
*For any* diagnostic issue, the estimated repair cost should equal the sum of all required parts costs plus estimated labor cost (labor hours × labor rate).
**Validates: Requirements 6.1**

### Property 21: Approval workflow state transitions
*For any* customer approval, valid state transitions are: pending → approved, pending → rejected, pending → modified, and no other transitions should be allowed.
**Validates: Requirements 6.2**

### Property 22: Service package pricing
*For any* service package, the discounted price should be less than or equal to the base price, and the discount percentage should be between 0-100.
**Validates: Requirements 6.3**

### Property 23: Feedback sentiment classification
*For any* customer feedback with a rating, sentiment should be "positive" if rating ≥ 4, "negative" if rating ≤ 2, otherwise "neutral".
**Validates: Requirements 6.5**

### Property 24: Drag-and-drop bay compatibility
*For any* service job being dragged, only bays that are available and compatible with the service type should be highlighted as valid drop targets.
**Validates: Requirements 7.1**

### Property 25: Schedule conflict detection
*For any* bay assignment, if the bay is already occupied during the requested time slot, the system should display a conflict warning and suggest alternative slots.
**Validates: Requirements 7.3**

### Property 26: Bay utilization optimization
*For any* set of pending jobs and available bays, the AI optimization should maximize total bay utilization while respecting technician skills and service type requirements.
**Validates: Requirements 7.4**

### Property 27: Warranty coverage verification
*For any* vehicle and service type, the system should correctly determine if the service is covered based on warranty type, coverage details, and current mileage/date.
**Validates: Requirements 8.1**

### Property 28: Warranty claim status tracking
*For any* warranty claim, the status should progress through valid states only: submitted → under-review → (approved|rejected) → paid (if approved).
**Validates: Requirements 8.3**

### Property 29: Warranty expiration alerts
*For any* vehicle with warranty ending within 60 days, the system should generate an alert and recommend services to complete before expiration.
**Validates: Requirements 8.4**

### Property 30: Mobile view job details completeness
*For any* service job displayed in mobile view, all essential fields (vehicle info, service requirements, parts needed, customer notes) should be present and readable.
**Validates: Requirements 9.2**

### Property 31: Status update time tracking
*For any* job status update by a technician, the system should record the timestamp and calculate elapsed time since the previous status change.
**Validates: Requirements 9.3**

### Property 32: Parts request inventory check
*For any* parts request from a technician, the system should verify current inventory and display availability status before allowing the request.
**Validates: Requirements 9.5**

### Property 33: Color palette consistency
*For any* Service AI page, all UI elements should use only colors from the defined palette: Teal Blue (#0D9488), Amber (#F59E0B), Green (#10B981), Orange (#F97316), Red (#EF4444), Slate (#64748B).
**Validates: Requirements 10.1**

### Property 34: AI feature visual consistency
*For any* AI-powered feature across all pages, the system should use standardized UI components for AI badges, prediction visualizations, and confidence indicators with consistent styling.
**Validates: Requirements 10.2**

### Property 35: Animation timing consistency
*For any* UI animation or transition, the duration should be 300ms with consistent easing functions, ensuring smooth and predictable user experience.
**Validates: Requirements 10.4**

### Property 36: Accessibility compliance
*For any* page in the Service AI Engine, automated accessibility tests should pass WCAG 2.1 AA compliance checks for color contrast, keyboard navigation, and screen reader support.
**Validates: Requirements 10.5**


## Error Handling

### Navigation Errors

**Route Not Found**
- Display user-friendly 404 page with navigation back to Overview tab
- Log error for monitoring
- Preserve user session and context

**Tab Loading Failures**
- Show error boundary with retry option
- Fall back to Overview tab if retry fails
- Display error message: "Unable to load [Tab Name]. Please try again."

### Data Loading Errors

**Service Job Data Fetch Failure**
- Display skeleton loaders during initial load
- Show error message with retry button if fetch fails
- Cache last successful data and display with "Data may be outdated" warning
- Log error with context for debugging

**Bay Status Update Failure**
- Maintain last known bay status
- Display warning indicator on affected bays
- Retry status update in background
- Notify user: "Bay status temporarily unavailable"

**Predictive Maintenance Calculation Failure**
- Display message: "AI predictions temporarily unavailable"
- Show historical service data as fallback
- Queue prediction recalculation for background processing
- Log error with vehicle and calculation context

**Voice AI Integration Errors**
- Disable voice call buttons with tooltip explaining issue
- Log integration error details
- Display fallback contact options (manual dial, email)
- Retry connection in background

### User Input Errors

**Invalid Service Job Data**
- Validate all required fields before submission
- Display inline error messages for each invalid field
- Highlight invalid fields in red
- Prevent form submission until all errors are resolved

**Bay Assignment Conflicts**
- Detect scheduling conflicts before assignment
- Display conflict details (overlapping time, bay unavailable)
- Suggest alternative bays or time slots
- Allow manual override with confirmation

**Parts Order Errors**
- Validate order quantities against min/max limits
- Check supplier availability before order creation
- Display error for invalid part numbers
- Prevent duplicate orders for same parts

### API and Network Errors

**Network Timeout**
- Retry failed requests up to 3 times with exponential backoff
- Show loading indicator during retries
- Display error message after final retry failure
- Offer manual retry option

**API Rate Limiting**
- Queue requests when rate limit is reached
- Display "Processing..." message to user
- Process queued requests when rate limit resets
- Log rate limit events for capacity planning

**Authentication Errors**
- Redirect to login page if session expires
- Preserve current page URL for redirect after login
- Display message: "Your session has expired. Please log in again."
- Clear sensitive data from memory

### State Management Errors

**Context Provider Errors**
- Wrap all context providers in error boundaries
- Fall back to default state if context fails
- Log context errors with stack trace
- Display generic error message to user

**State Synchronization Errors**
- Detect state inconsistencies between tabs
- Refresh data from source of truth (API)
- Display warning: "Data has been refreshed"
- Log synchronization errors for investigation

### Drag-and-Drop Errors

**Invalid Drop Target**
- Prevent drop on incompatible bays
- Display error message: "This bay is not compatible with the selected service"
- Animate return to original position
- Highlight valid drop targets during drag

**Concurrent Modification**
- Detect if bay status changed during drag operation
- Display warning: "Bay status has changed. Please try again."
- Refresh bay status display
- Cancel drag operation

## Testing Strategy

### Unit Testing

The Service AI Engine Pages will use **Vitest** as the testing framework for unit tests, following the existing project patterns.

**Component Testing:**
- Test each page component renders without errors
- Test tab navigation component displays all tabs correctly
- Test service bay cards display all required fields
- Test technician cards show skills and availability
- Test parts inventory displays stock levels correctly
- Test diagnostic report rendering
- Test form validation logic
- Test error boundary components

**Utility Function Testing:**
- Test bay utilization calculation
- Test maintenance prediction scoring
- Test technician matching algorithm
- Test parts reorder quantity calculation
- Test warranty coverage verification
- Test cost estimation functions
- Test date formatting and filtering utilities
- Test data transformation functions
- Test validation functions

**Hook Testing:**
- Test custom hooks for data fetching
- Test state management hooks
- Test navigation hooks
- Test form handling hooks
- Test drag-and-drop hooks

**Example Unit Tests:**
```typescript
describe('Bay Utilization Calculation', () => {
  it('should calculate 100% utilization for fully occupied bay', () => {
    const bay = { occupiedTime: 480, totalTime: 480 };
    expect(calculateUtilization(bay)).toBe(100);
  });
  
  it('should calculate 50% utilization for half-occupied bay', () => {
    const bay = { occupiedTime: 240, totalTime: 480 };
    expect(calculateUtilization(bay)).toBe(50);
  });
  
  it('should handle zero total time gracefully', () => {
    const bay = { occupiedTime: 0, totalTime: 0 };
    expect(calculateUtilization(bay)).toBe(0);
  });
});

describe('Stock Status Determination', () => {
  it('should mark item as out-of-stock when quantity is 0', () => {
    const item = { currentStock: 0, reorderPoint: 10 };
    expect(getStockStatus(item)).toBe('out-of-stock');
  });
  
  it('should mark item as low-stock when at reorder point', () => {
    const item = { currentStock: 10, reorderPoint: 10 };
    expect(getStockStatus(item)).toBe('low-stock');
  });
  
  it('should mark item as in-stock when above reorder point', () => {
    const item = { currentStock: 50, reorderPoint: 10 };
    expect(getStockStatus(item)).toBe('in-stock');
  });
});
```

### Property-Based Testing

The Service AI Engine Pages will use **fast-check** as the property-based testing library for TypeScript/JavaScript.

**Configuration:**
- Each property test should run a minimum of 100 iterations
- Use appropriate generators for domain-specific data (utilization 0-100, dates, etc.)
- Configure shrinking to find minimal failing examples
- Set reasonable timeouts for complex properties

**Property Test Implementation:**
- Each correctness property from the design document must be implemented as a property-based test
- Tag each test with a comment referencing the design document property
- Use format: `// Feature: service-ai-engine-pages, Property X: [property text]`

**Example Property Tests:**

```typescript
import fc from 'fast-check';

// Feature: service-ai-engine-pages, Property 3: Bay utilization calculation
describe('Property: Bay utilization calculation', () => {
  it('should calculate utilization as percentage between 0-100', () => {
    fc.assert(
      fc.property(
        fc.record({
          occupiedTime: fc.integer({ min: 0, max: 1440 }),
          totalTime: fc.integer({ min: 1, max: 1440 })
        }),
        (bay) => {
          const utilization = calculateUtilization(bay);
          return utilization >= 0 && utilization <= 100;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: service-ai-engine-pages, Property 14: Stock status determination
describe('Property: Stock status determination', () => {
  it('should correctly determine stock status for any inventory item', () => {
    fc.assert(
      fc.property(
        fc.record({
          currentStock: fc.integer({ min: 0, max: 1000 }),
          reorderPoint: fc.integer({ min: 1, max: 100 })
        }),
        (item) => {
          const status = getStockStatus(item);
          
          if (item.currentStock === 0) {
            return status === 'out-of-stock';
          } else if (item.currentStock <= item.reorderPoint) {
            return status === 'low-stock';
          } else {
            return status === 'in-stock';
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: service-ai-engine-pages, Property 16: Purchase order total calculation
describe('Property: Purchase order total calculation', () => {
  it('should calculate total cost correctly for any purchase order', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            quantity: fc.integer({ min: 1, max: 100 }),
            unitCost: fc.integer({ min: 100, max: 10000 })
          }),
          { minLength: 1, maxLength: 20 }
        ),
        (items) => {
          const expectedTotal = items.reduce((sum, item) => 
            sum + (item.quantity * item.unitCost), 0
          );
          const calculatedTotal = calculateOrderTotal(items);
          
          return Math.abs(calculatedTotal - expectedTotal) < 0.01;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: service-ai-engine-pages, Property 4: Queue priority ordering
describe('Property: Queue priority ordering', () => {
  it('should order queue by priority then wait time', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.uuid(),
            priority: fc.constantFrom('urgent', 'high', 'normal', 'low'),
            waitTime: fc.integer({ min: 0, max: 1000 })
          }),
          { minLength: 2, maxLength: 50 }
        ),
        (vehicles) => {
          const sorted = sortQueue(vehicles);
          
          // Check priority ordering
          for (let i = 0; i < sorted.length - 1; i++) {
            const current = sorted[i];
            const next = sorted[i + 1];
            
            const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
            const currentPriority = priorityOrder[current.priority];
            const nextPriority = priorityOrder[next.priority];
            
            if (currentPriority === nextPriority) {
              // Same priority - check wait time
              if (current.waitTime < next.waitTime) {
                return false;
              }
            } else if (currentPriority > nextPriority) {
              return false;
            }
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: service-ai-engine-pages, Property 1: Tab navigation preserves state
describe('Property: Tab navigation preserves state', () => {
  it('should preserve state when navigating between tabs', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.constantFrom('overview', 'bays', 'maintenance', 'technicians', 'inventory', 'operations'),
          { minLength: 2, maxLength: 10 }
        ),
        fc.record({
          filters: fc.record({ minUtilization: fc.integer({ min: 0, max: 100 }) }),
          scrollPosition: fc.integer({ min: 0, max: 1000 })
        }),
        (navigationSequence, initialState) => {
          const stateManager = new TabStateManager();
          stateManager.setState('bays', initialState);
          
          // Navigate through sequence
          navigationSequence.forEach(tab => stateManager.navigateTo(tab));
          
          // Navigate back to bays
          stateManager.navigateTo('bays');
          const restoredState = stateManager.getState('bays');
          
          return JSON.stringify(restoredState) === JSON.stringify(initialState);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Integration Testing

**Tab Navigation Integration:**
- Test navigation between all tabs
- Verify URL updates correctly
- Verify active tab highlighting
- Test browser back/forward buttons

**Voice AI Integration:**
- Test voice call initiation from service jobs
- Test bulk campaign creation for maintenance reminders
- Test data passing to Voice AI engine
- Test call status updates

**Drag-and-Drop Integration:**
- Test dragging service jobs to bays
- Test bay compatibility highlighting
- Test conflict detection
- Test schedule updates after drop

**Data Flow Integration:**
- Test service job creation flow from form to display
- Test bay assignment updates across components
- Test parts request flow from technician to inventory
- Test diagnostic report generation and display

### End-to-End Testing

**Critical User Journeys:**
- Complete service bay management workflow (assign → track → complete)
- Predictive maintenance alert to scheduled service
- Technician allocation and job completion
- Parts low-stock alert to purchase order
- Diagnostic scan to customer approval to service execution

**Cross-Browser Testing:**
- Test on Chrome, Firefox, Safari, Edge
- Verify responsive layouts on different screen sizes
- Test touch interactions on mobile devices
- Test drag-and-drop on touch devices

### Accessibility Testing

**Automated Testing:**
- Run axe-core accessibility tests on all pages
- Verify WCAG 2.1 AA compliance
- Test keyboard navigation
- Test screen reader compatibility

**Manual Testing:**
- Navigate entire application using only keyboard
- Test with screen reader (NVDA, JAWS, VoiceOver)
- Verify color contrast ratios
- Test with browser zoom at 200%
- Test drag-and-drop with keyboard only

### Performance Testing

**Load Time Metrics:**
- Measure First Contentful Paint (target: < 1.5s)
- Measure Time to Interactive (target: < 3.5s)
- Measure Largest Contentful Paint (target: < 2.5s)

**Runtime Performance:**
- Test with large datasets (100+ service jobs, 50+ bays)
- Measure filter application time (target: < 100ms)
- Measure tab switching time (target: < 200ms)
- Measure drag-and-drop responsiveness (target: < 16ms per frame)
- Monitor memory usage during extended sessions

## Implementation Notes

### Reusing Sales Engine Patterns

The Service AI Engine Pages should follow the exact same patterns established in the Sales Engine implementation:

1. **Tab Navigation Structure:**
   - Use the same tab component styling and layout
   - Implement the same routing pattern with sub-routes
   - Use the same active tab highlighting logic

2. **Page Layout:**
   - Maintain consistent header structure
   - Use the same spacing and padding
   - Apply the same responsive breakpoints

3. **Component Reuse:**
   - Reuse dashboard components (KPICard, TrendChart, etc.)
   - Reuse Voice AI integration components
   - Reuse common UI components (modals, buttons, forms)

### Voice AI Integration

All Service AI pages should integrate with the existing Voice AI system:

1. **Service Bays Page:**
   - Display VoiceCallButton for customer updates
   - Pass service job and customer data to Voice AI
   - Update job status after calls complete

2. **Predictive Maintenance Page:**
   - Bulk campaign for maintenance reminders
   - Filter vehicles by maintenance due date
   - Track campaign outcomes and booking rates

3. **Technicians Page:**
   - Voice call for technician notifications
   - Emergency job assignments via voice
   - Status updates through voice interface

4. **Service Operations Page:**
   - Customer approval requests via voice
   - Service completion notifications
   - Feedback collection calls

### Design System Compliance

All pages must follow the design system specified in the UI/UX document:

1. **Color Palette:**
   - Primary: Teal Blue (#0D9488)
   - Secondary: Amber (#F59E0B)
   - Success: Green (#10B981)
   - Warning: Orange (#F97316)
   - Danger: Red (#EF4444)
   - Neutral: Slate (#64748B)

2. **Typography:**
   - Headings: Inter Bold
   - Body: Inter Regular
   - Technical Data: JetBrains Mono

3. **Animations:**
   - Use 300ms transitions
   - Apply smooth easing functions
   - Implement micro-interactions for user feedback
   - Special service-specific animations (bay pulse, completion celebration)

### Drag-and-Drop Implementation

Service Bay Management requires robust drag-and-drop functionality:

1. **Library Selection:**
   - Use react-beautiful-dnd or @dnd-kit for drag-and-drop
   - Ensure touch device compatibility
   - Support keyboard-based drag-and-drop for accessibility

2. **Visual Feedback:**
   - Highlight valid drop targets during drag
   - Show preview of job in target bay
   - Animate smooth transitions on drop
   - Display conflict warnings immediately

3. **State Management:**
   - Optimistic UI updates for immediate feedback
   - Rollback on server error
   - Sync state across all components
   - Maintain undo/redo capability

### Real-Time Updates

Service operations require real-time data synchronization:

1. **WebSocket Integration:**
   - Connect to real-time service job updates
   - Subscribe to bay status changes
   - Receive technician availability updates
   - Get parts inventory notifications

2. **Update Strategy:**
   - Use optimistic updates for user actions
   - Merge server updates with local state
   - Resolve conflicts with server as source of truth
   - Display update indicators to users

3. **Performance Optimization:**
   - Throttle high-frequency updates
   - Batch multiple updates together
   - Use virtual scrolling for large lists
   - Implement efficient re-rendering strategies

### Progressive Enhancement

Implement features with progressive enhancement:

1. **Core Functionality:**
   - Ensure basic navigation works without JavaScript
   - Provide fallback for drag-and-drop (click-based assignment)
   - Support basic filtering without advanced features

2. **Enhanced Features:**
   - Add real-time updates when WebSocket available
   - Enable drag-and-drop on capable devices
   - Provide touch gestures on touch-enabled devices
   - Show advanced visualizations on capable browsers

3. **Offline Support:**
   - Cache critical data for offline viewing
   - Queue actions for sync when connection restored
   - Display offline indicator clearly
   - Sync data when connection returns

### Security Considerations

1. **Data Protection:**
   - Sanitize all user inputs
   - Validate data on both client and server
   - Encrypt sensitive customer and vehicle data
   - Implement proper access controls for technician data

2. **Authentication:**
   - Verify user permissions for each action
   - Implement role-based access control (manager, technician, advisor)
   - Handle session expiration gracefully
   - Audit sensitive operations (bay assignments, approvals)

3. **API Security:**
   - Use HTTPS for all API calls
   - Implement rate limiting
   - Validate API responses before processing
   - Protect against injection attacks

## Future Enhancements

### Phase 2 Features

1. **Advanced AI Capabilities:**
   - Machine learning for service time prediction
   - Automated technician scheduling optimization
   - Predictive parts failure analysis
   - Customer behavior pattern recognition

2. **Enhanced Visualizations:**
   - 3D service bay layout with real-time updates
   - AR-based diagnostic visualization
   - Interactive vehicle health dashboards
   - Real-time performance heat maps

3. **Collaboration Features:**
   - Team chat for service coordination
   - Shared notes and annotations on jobs
   - Video consultation for complex diagnostics
   - Knowledge base integration

4. **Mobile Technician App:**
   - Native mobile app for technicians
   - Offline diagnostic capabilities
   - Photo and video documentation
   - Voice-to-text job notes

### Scalability Considerations

1. **Performance Optimization:**
   - Implement virtual scrolling for large service job lists
   - Use code splitting for faster initial load
   - Optimize images and diagnostic photos
   - Implement efficient caching strategies

2. **Data Management:**
   - Implement pagination for large datasets
   - Use caching strategies for frequently accessed data
   - Optimize database queries
   - Archive old service records

3. **Infrastructure:**
   - Support horizontal scaling
   - Implement load balancing
   - Use CDN for static assets
   - Implement database sharding for large service centers

# Complete Frontend Design Specification - Part 3
## G-I: Service, Parts, Finance

---

## G. Service — Appointments & Work Orders

**FRAME:** Service / Appointments

### Goal
End-to-end job tracking from booking through completion with real-time status updates.

### Pages

#### 1. Appointment Calendar
**Views:**
- Day view (timeline with bays)
- Week view (grid)
- Month view (calendar with dots)

**Components:**
- Bay columns (drag appointments between bays)
- Time slots (30min intervals)
- Appointment cards showing:
  - Customer name
  - Vehicle
  - Service type
  - Duration
  - Status color
- Technician avatars
- Drag & drop to reschedule/reassign

**Filters:**
- Bay
- Technician
- Service type
- Status

#### 2. Work Order List
**Table Columns:**
- WO Number
- Customer + Vehicle
- Service type
- Bay + Technician
- Status with progress bar
- ETA
- Priority badge
- Actions

**Status Flow:**
```
Scheduled → Checked-in → In Progress → 
Awaiting Parts → Quality Check → Completed → Delivered
```

#### 3. Work Order Detail
**Layout:** Tabbed interface

**Tab 1: Overview**
- Customer & vehicle info
- Service checklist (checkboxes)
- Parts used (add/remove)
- Labor hours
- Photos (before/after)
- Technician notes

**Tab 2: Damage Detection**
- Upload photos
- AI damage detection results
- Severity markers on image
- Estimated repair cost
- Approve/Reject findings

**Tab 3: Estimate**
- Line items (parts + labor)
- Subtotal, tax, total
- Customer approval status
- Digital signature pad
- Send to customer button

**Tab 4: Timeline**
- Status changes
- Parts ordered
- Customer communications
- Delays & reasons

#### 4. Technician Board
**Kanban by technician:**
- Column per technician
- Cards show assigned jobs
- Workload indicator (hours)
- Drag to reassign
- Availability status

#### 5. Live Status Tracker
**Customer-facing view:**
- Progress bar with stages
- Current status with icon
- ETA countdown
- Photos of work in progress
- Chat with service advisor
- Notification preferences

### Data Props
```typescript
interface Appointment {
  id: string;
  customer: Customer;
  vehicle: Vehicle;
  serviceType: string;
  scheduledTime: Date;
  estimatedDuration: number;
  bay: Bay;
  technician: Technician;
  status: AppointmentStatus;
  eta: Date;
  priority: 'normal' | 'urgent' | 'emergency';
}

interface WorkOrder {
  id: string;
  appointmentId: string;
  checklist: ChecklistItem[];
  partsUsed: Part[];
  laborHours: number;
  photos: Photo[];
  damageDetection: DamageReport;
  estimate: Estimate;
  timeline: TimelineEvent[];
}
```

### API Contracts
```
GET /api/service/calendar/?date=2025-12-01
Response: { appointments: Appointment[], bays: Bay[] }

POST /api/service/appointments/
Body: { 
  customerId, vehicleId, serviceType,
  scheduledTime, estimatedDuration
}

GET /api/service/appointments/{id}/
PUT /api/service/appointments/{id}/
PATCH /api/service/appointments/{id}/status/
Body: { status, notes }

POST /api/service/workorder/{id}/assign/
Body: { technicianId, bayId }

POST /api/service/workorder/{id}/photos/
Body: FormData with images
Response: { damageDetection: DamageReport }

POST /api/service/workorder/{id}/estimate/
Body: { items[], labor, tax }

GET /api/service/workorder/{id}/status/
Response: { status, eta, progress }
```

### Interactions
- Drag appointment → update time/bay
- Click appointment → open detail modal
- Right-click → context menu (reschedule, cancel, etc.)
- Double-click → quick edit
- Color coding by status
- Real-time updates via WebSocket
- Push notifications on status change

### Mobile Features
- Technician app for job updates
- Photo upload from mobile
- Clock in/out
- Parts request
- Customer signature capture

---

## H. Parts & Inventory

**FRAME:** Inventory / Parts

### Goal
Manage parts stock, automate reordering, and track usage in work orders.

### Pages

#### 1. Parts Catalog
**Components:**
- Search with autocomplete
- Filters: Category, Brand, Stock status
- Sort: Name, Stock, Price, Usage
- View toggle: Grid | List

**List View Columns:**
- Part image thumbnail
- Part number + Name
- Category
- Brand
- Stock quantity with indicator:
  - Green: Above reorder level
  - Yellow: At reorder level
  - Red: Below reorder level
- Location (bin/shelf)
- Unit price
- Last ordered
- Actions

**Grid View:**
- Cards with larger images
- Stock badge
- Quick add to cart

#### 2. Part Detail
**Sections:**
- Part info (number, name, description)
- Specifications table
- Compatible vehicles
- Stock levels by location
- Pricing (cost, markup, retail)
- Supplier info
- Usage history chart
- Reorder settings:
  - Min level
  - Max level
  - Reorder quantity
  - Lead time

#### 3. Stock Adjustment
**Form:**
- Part selector
- Current stock (read-only)
- Adjustment type: Add | Remove | Set
- Quantity
- Reason dropdown
- Notes
- Location

**Audit trail:**
- Who made adjustment
- When
- Before/After quantities

#### 4. Purchase Orders
**List View:**
- PO number
- Supplier
- Date
- Items count
- Total amount
- Status (Draft, Sent, Received, Closed)
- Actions

**Create PO:**
- Supplier selector
- Add parts (search & add)
- Quantities & prices
- Delivery date
- Terms
- Notes
- Generate PDF

**Receive PO:**
- Checklist of items
- Received quantity input
- Damaged/Missing notes
- Update stock automatically

#### 5. Supplier Management
**List:**
- Supplier name
- Contact info
- Parts supplied count
- Average lead time
- Rating
- Status

**Detail:**
- Contact details
- Parts catalog
- Order history
- Performance metrics
- Documents

#### 6. Analytics
**Widgets:**
- Inventory value
- Turnover rate
- Slow-moving parts
- Stock-out incidents
- Top used parts
- Supplier performance

### Data Props
```typescript
interface Part {
  id: string;
  partNumber: string;
  name: string;
  category: string;
  brand: string;
  stock: number;
  location: string;
  reorderLevel: number;
  maxLevel: number;
  unitCost: number;
  retailPrice: number;
  supplier: Supplier;
  compatibleVehicles: string[];
}

interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: Supplier;
  items: POItem[];
  totalAmount: number;
  status: POStatus;
  orderDate: Date;
  expectedDelivery: Date;
}
```

### API Contracts
```
GET /api/parts/?query=&category=&stock_status=
Response: { count, results: Part[] }

GET /api/parts/{id}/
POST /api/parts/
PUT /api/parts/{id}/

POST /api/parts/{id}/adjust/
Body: { delta: number, reason: string, notes }

GET /api/purchase-orders/
POST /api/purchase-orders/
Body: { supplierId, items: [{partId, qty, price}] }

POST /api/purchase-orders/{id}/receive/
Body: { items: [{partId, receivedQty, damaged}] }

GET /api/parts/analytics/
Response: { turnover, slowMoving[], stockouts[] }
```

### Automation
- Auto-generate PO when stock below threshold
- Email alerts for low stock
- Supplier auto-selection based on price/lead time
- Barcode scanning for receiving
- Integration with supplier EDI/API

---

## I. Finance

**FRAME:** Finance / Payments & Loans

### Goal
Loan processing, EMI calculations, payment gateway integration, and billing.

### Pages

#### 1. Loan Applications
**List View:**
- Application ID
- Customer name
- Loan amount requested
- Vehicle
- AI Credit Score (with color)
- Status (Pending, Approved, Rejected)
- Submitted date
- Actions

**Create Application:**
**Step 1: Customer Info**
- Personal details
- Employment info
- Income proof upload

**Step 2: Loan Details**
- Vehicle selection
- Loan amount
- Down payment
- Tenure (months)
- Purpose

**Step 3: Documents**
- ID proof
- Address proof
- Income proof
- Bank statements
- Photo capture/upload

**Step 4: Credit Check**
- Run AI credit scoring
- Show score breakdown
- Risk assessment
- Approval recommendation

**Step 5: Review & Submit**
- Summary of all info
- Terms & conditions
- Digital signature
- Submit button

#### 2. Loan Detail
**Sections:**
- Application summary
- Credit score card with breakdown:
  - Payment history
  - Credit utilization
  - Credit age
  - Recent inquiries
- Approval status
- Recommended terms:
  - Loan amount
  - Interest rate
  - Tenure
  - EMI amount
- Documents viewer
- Decision history
- Actions: Approve, Reject, Request more info

#### 3. EMI Calculator Widget
**Inputs:**
- Loan amount (slider + input)
- Interest rate (slider + input)
- Tenure in months (dropdown)
- Down payment

**Output:**
- Monthly EMI
- Total interest
- Total amount payable
- Amortization table
- Chart showing principal vs interest

**Embeddable in:**
- Loan application
- Quote generator
- Customer portal

#### 4. Invoices & Payments
**Invoice List:**
- Invoice number
- Customer
- Amount
- Due date
- Status (Paid, Pending, Overdue)
- Payment method
- Actions

**Create Invoice:**
- Customer selector
- Line items (services/parts)
- Tax calculation
- Discount
- Payment terms
- Notes
- Generate PDF
- Send via email/SMS

**Payment Processing:**
- Invoice selector
- Amount (full/partial)
- Payment method:
  - Cash
  - Card (integrated gateway)
  - UPI
  - Bank transfer
  - Cheque
- Reference number
- Receipt generation

#### 5. Payment History
**Table:**
- Date
- Invoice number
- Customer
- Amount
- Method
- Status
- Receipt link

**Filters:**
- Date range
- Payment method
- Status
- Customer

#### 6. Fraud Detection
**Alert Panel:**
- Suspicious transactions flagged
- Fraud score
- Risk indicators:
  - Unusual amount
  - New customer
  - Multiple attempts
  - Location mismatch
- Actions: Approve, Block, Investigate

#### 7. Revenue Forecast
**Components:**
- Line chart (historical + predicted)
- Confidence interval bands
- Key metrics:
  - Current month forecast
  - Next 3 months
  - Growth rate
  - Factors affecting forecast
- Scenario analysis (best/worst/likely)

### Data Props
```typescript
interface LoanApplication {
  id: string;
  customer: Customer;
  loanAmount: number;
  downPayment: number;
  tenure: number;
  vehicle: Vehicle;
  aiCreditScore: number;
  scoreBreakdown: CreditScoreBreakdown;
  approvalProbability: number;
  recommendedRate: number;
  status: 'pending' | 'approved' | 'rejected';
  documents: Document[];
}

interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  status: 'completed' | 'pending' | 'failed';
  fraudScore: number;
  transactionId: string;
}
```

### API Contracts
```
POST /api/finance/loan-application/
Body: { customerId, loanAmount, tenure, documents }
Response: { applicationId, status }

GET /api/finance/credit-score/{customerId}/
Response: { 
  score: number,
  breakdown: {...},
  approvalProbability: number
}

GET /api/finance/emi/?amount=500000&tenure=60&rate=8.5
Response: { 
  emi: number,
  totalInterest: number,
  amortization: []
}

POST /api/finance/payment/
Body: { invoiceId, amount, method }
Response: { paymentId, status, receiptUrl }

POST /api/finance/fraud-detection/
Body: { transactionData }
Response: { fraudScore, indicators[], recommendation }

GET /api/finance/revenue-forecast/?months=3
Response: { forecast[], confidence, factors[] }
```

### Security
- PCI DSS compliance for card processing
- Encrypted document storage
- Audit trail for all transactions
- Two-factor auth for large amounts
- IP whitelisting for admin actions
- Rate limiting on payment attempts

### Integrations
- Payment gateways: Razorpay, Stripe, PayU
- Credit bureaus: CIBIL, Experian
- Banking APIs for verification
- SMS/Email for OTP

---


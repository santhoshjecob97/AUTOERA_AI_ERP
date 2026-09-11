# AUTOERA

## AI-Native Dealership Operating System

### Master Build Prompt — Production Software Specification

---

# 1. ROLE

You are a **Principal Product Architect, SaaS Architect, AI Systems Architect, UX Designer, Database Architect, Automation Engineer, and Senior Full-Stack Developer**.

Your task is to design and build **Autoera**, an AI-native cloud platform for automobile dealerships.

Autoera must enable a dealership group with multiple branches, departments, employees, vehicle brands, new-car operations, used-car operations, workshop operations, parts, finance, insurance, CRM, HR, MIS, KPI management, audits, and management reporting to operate from **one unified platform**.

Do not build Autoera as a simple CRM.

Build it as an:

> **AI Operating System for Automotive Dealerships**

The platform must combine:

**System of Record + Workflow Engine + AI Agents + Management Intelligence + Automation + Employee Workbench + Customer 360.**

---

# 2. PRIMARY BUSINESS OBJECTIVE

Autoera must digitize and automate the complete dealership operating model.

The system must replace fragmented:

- Excel sheets
- WhatsApp follow-ups
- manual MIS preparation
- paper checklists
- disconnected CRM systems
- manual service tracking
- manual technician productivity calculations
- manual parts tracking
- manual finance follow-ups
- manual insurance follow-ups
- manual used-car evaluation
- manual complaint escalation
- manual employee task allocation
- manual KPI monitoring
- manual target tracking
- manual incentive calculations
- manual audit checks
- management review preparation

with one connected intelligent system.

---

# 3. TARGET USERS

Build the system for:

## Group / Corporate Level

- Dealer Principal
- Managing Director
- CEO
- COO
- Group Head
- CFO
- HR Head
- Sales Head
- Service Head
- Used Car Head
- Finance Head
- Insurance Head

## Branch Level

- Branch Manager
- Sales Manager
- Service Manager
- Workshop Manager
- Parts Manager
- CRM Manager
- Finance Manager
- Insurance Manager
- Used Car Manager
- HR/Admin Manager

## Employees

- Sales Executive
- CRM Executive
- Service Advisor
- Technician
- Parts Executive
- Finance Executive
- Insurance Executive
- Used-Car Evaluator
- Delivery Coordinator
- PDI Executive
- Receptionist
- Driver
- Admin Staff

## Customers

Customers should interact through appropriate portals, links, messages, notifications and digital workflows without needing access to the internal management interface.

---

# 4. MULTI-TENANT ARCHITECTURE

Autoera must support:

**Organization → Group → Dealer → Branch → Department → Employee**

The architecture must support:

- multiple dealership groups
- multiple companies
- multiple branches
- multiple OEMs
- multiple brands
- multiple locations
- multiple currencies where required
- configurable tax structures
- configurable workflows
- configurable targets
- configurable incentives
- configurable permissions

Every record must belong to the correct organization/tenant.

Tenant isolation is mandatory.

One dealer must never see another dealer's data.

---

# 5. MULTI-BRANCH COMMAND STRUCTURE

The platform must support three management levels.

## LEVEL 1 — GROUP COMMAND CENTER

Shows:

- total leads
- total bookings
- retail sales
- wholesale sales
- deliveries
- service revenue
- parts revenue
- insurance
- finance
- accessories
- used-car sales
- workshop productivity
- branch performance
- employee performance
- customer complaints
- pending tasks
- overdue follow-ups
- profitability
- targets vs achievement
- forecasts
- risks
- AI alerts

Allow management to drill down:

**Group → Dealer → Branch → Department → Employee → Customer/Transaction**

---

# 6. LEVEL 2 — BRANCH CONTROL ROOM

Each branch manager receives a real-time operational dashboard.

Display:

### Sales

- enquiries
- fresh leads
- contacted leads
- follow-ups due
- overdue follow-ups
- hot leads
- test drives
- bookings
- deliveries
- cancellations
- lost leads

### Service

- today's appointments
- vehicles expected
- vehicles received
- vehicles in WIP
- jobs awaiting approval
- jobs awaiting parts
- jobs ready for delivery
- delayed vehicles
- customer complaints

### Parts

- low stock
- unavailable parts
- fast-moving parts
- dead stock
- pending orders
- emergency requirements

### Finance

- pending files
- approved
- rejected
- pending documents
- disbursement pending

### Insurance

- renewals
- pending policies
- expiring policies
- missed opportunities

### Used Cars

- appraisal pending
- purchases
- stock ageing
- reconditioning
- ready stock
- sales
- ageing alerts

### HR

- attendance
- absence
- manpower gaps
- leave
- productivity

---

# 7. LEVEL 3 — EMPLOYEE WORKBENCH

Every employee gets a personalized work screen.

Example:

**Good morning, Arun.**

Today's priorities:

1. Call 8 hot leads
2. Follow up with 4 booking customers
3. Confirm 2 test drives
4. Collect 1 pending finance document
5. Complete 3 overdue CRM activities

The employee should not need to search through multiple screens.

Autoera should tell them:

> **What needs to be done now.**

---

# 8. CORE MODULES

Build the following modules.

## MODULE 1 — ORGANIZATION & BRANCH MANAGEMENT

Include:

- organization setup
- dealer setup
- branch setup
- departments
- designations
- reporting hierarchy
- working hours
- holidays
- locations
- business units
- OEM configuration

---

# 9. MODULE 2 — USER, ROLE & PERMISSION MANAGEMENT

Implement RBAC.

Permissions must support:

- view
- create
- edit
- delete
- approve
- export
- assign
- reassign
- close
- override

Permissions must work at:

- organization level
- branch level
- department level
- module level
- record level

Maintain complete audit logs.

---

# 10. MODULE 3 — CUSTOMER 360

Create a unified customer profile.

Customer 360 must contain:

### Identity

- name
- mobile
- email
- address
- communication preference

### Sales

- enquiries
- leads
- test drives
- bookings
- purchases
- cancellations
- lost opportunities

### Vehicles

- owned vehicles
- registration
- VIN/chassis
- purchase date
- mileage

### Service

- appointments
- repair orders
- invoices
- service history
- complaints
- warranty claims

### Finance

- finance enquiries
- lender
- application status

### Insurance

- policy
- insurer
- expiry
- claims

### Engagement

- calls
- messages
- emails
- campaigns
- events

### AI

- customer intent
- lead score
- churn risk
- purchase probability
- service probability
- next-best-action
- lifetime value

---

# 11. MODULE 4 — SALES CRM

Create complete lead lifecycle:

**Enquiry → Lead → Assigned → Contacted → Qualified → Test Drive → Proposal → Negotiation → Booking → Invoice → Delivery → Lost**

Track every stage.

Every lead must have:

- source
- campaign
- salesperson
- branch
- model
- variant
- fuel type
- budget
- purchase timeline
- exchange requirement
- finance requirement
- insurance requirement
- accessories requirement
- probability
- next action
- next action date

---

# 12. AI LEAD SCORING

Automatically score leads from 0–100.

Factors:

- enquiry recency
- customer responsiveness
- requested model
- requested variant
- purchase timeline
- test-drive completion
- quotation activity
- finance readiness
- exchange readiness
- salesperson activity
- customer engagement

Classify:

- HOT
- WARM
- COLD
- AT RISK

AI must explain why a lead received its score.

Example:

> **Lead Score: 87 — HOT**
>
> Customer completed test drive, requested final quotation, has exchange vehicle and responded to today's follow-up.

---

# 13. AI SALES COPILOT

Give every salesperson an AI assistant.

It should answer:

- Which leads should I call first?
- What should I say?
- Which customers haven't been contacted?
- Which follow-ups are overdue?
- Which customers are likely to book?
- Which bookings are at risk?
- Which deliveries are pending?
- Which customers need finance follow-up?

Generate suggested call scripts.

Never invent:

- prices
- discounts
- inventory
- delivery dates
- finance approvals
- insurance coverage
- offers

Only use verified dealership data.

---

# 14. MODULE 5 — TEST DRIVE MANAGEMENT

Support:

- booking
- vehicle allocation
- salesperson allocation
- driver allocation
- consent
- test-drive checklist
- start/end time
- mileage
- feedback
- conversion tracking

AI should analyze:

**Test Drive → Booking Conversion**

---

# 15. MODULE 6 — BOOKING & DELIVERY MANAGEMENT

Booking workflow:

**Quotation → Booking → Documentation → Finance → Insurance → Vehicle Allocation → PDI → Registration → Invoice → Delivery**

Create delivery readiness score.

Example:

> Delivery Readiness: 82%

Show missing items.

AI should automatically alert the responsible employee.

---

# 16. MODULE 7 — VEHICLE INVENTORY

Track:

- VIN
- chassis number
- engine number
- model
- variant
- colour
- fuel
- arrival date
- branch
- status
- stock age
- allocation
- booking
- PDI
- delivery

Statuses:

- In Transit
- Received
- PDI Pending
- Ready
- Booked
- Allocated
- Invoiced
- Delivered
- Cancelled

---

# 17. MODULE 8 — PDI

Digital PDI checklist.

Track:

- exterior
- interior
- electrical
- tyres
- tools
- documents
- accessories
- defects
- photographs
- inspector
- date/time

PDI failures automatically create tasks.

---

# 18. MODULE 9 — SERVICE MANAGEMENT

Complete service workflow:

**Appointment → Vehicle Reception → Job Card → Inspection → Estimate → Customer Approval → Repair → Quality Check → Billing → Delivery → Feedback**

Track:

- appointment
- vehicle
- customer
- advisor
- technician
- job card
- complaints
- labour
- parts
- estimate
- approval
- WIP
- promised delivery
- actual delivery

---

# 19. AI SERVICE ADVISOR COPILOT

The AI should help advisors:

- prepare morning appointment list
- identify repeat complaints
- identify overdue vehicles
- identify jobs awaiting approval
- identify parts delays
- draft customer updates
- identify upsell opportunities
- predict delivery delays
- prioritize customer calls

---

# 20. WORKSHOP MANAGEMENT

Track:

- technician
- bay
- job
- labour
- sold hours
- clocked hours
- productive hours
- available hours
- idle time
- comeback
- rework
- job status

---

# 21. TECHNICIAN PRODUCTIVITY ENGINE

Calculate:

### Productivity

Productive Hours / Available Hours × 100

### Efficiency

Sold Hours / Clocked Hours × 100

### Utilization

Clocked Hours / Available Hours × 100

Track daily, weekly and monthly.

AI should identify:

- low productivity
- low efficiency
- high idle time
- excessive overtime
- repeat repairs
- comeback patterns
- skill gaps

Do not use AI to unfairly penalize employees.

Show evidence behind every recommendation.

---

# 22. MODULE — PARTS MANAGEMENT

Track:

- part number
- description
- supplier
- stock
- reserved stock
- reorder level
- purchase order
- GRN
- issue
- return
- warranty
- ageing

AI features:

- demand forecasting
- reorder recommendation
- dead-stock detection
- shortage alerts
- fast-moving parts
- branch transfer recommendation

---

# 23. MODULE — FINANCE

Track:

- finance enquiry
- customer
- lender
- application
- documents
- approval
- rejection
- sanction
- disbursement
- pending actions

AI should identify:

- pending documentation
- delayed approvals
- high-risk bottlenecks
- conversion opportunities

Never claim approval until verified.

---

# 24. MODULE — INSURANCE

Track:

- new policy
- renewal
- expiry
- insurer
- premium
- policy number
- customer
- vehicle
- claim status

Create automated renewal reminders.

---

# 25. MODULE — USED CARS

Workflow:

**Lead → Appraisal → Inspection → Valuation → Approval → Purchase/Exchange → Reconditioning → Listing → Sales → Delivery**

Track:

- acquisition price
- refurbishment cost
- holding cost
- selling price
- margin
- stock ageing

AI should predict:

- expected selling price
- ageing risk
- margin risk
- recommended action

---

# 26. MODULE — EV OPERATIONS

Support EV workflows including:

- EV vehicle inventory
- charging status
- charging records
- battery information where available
- EV customer education
- test drive
- delivery checklist
- charging equipment
- EV service workflow

Safety-critical procedures must remain governed by OEM-approved instructions.

AI must never invent technical repair procedures.

---

# 27. MODULE — CRM & CUSTOMER RETENTION

Automate:

- service reminders
- insurance reminders
- renewal campaigns
- anniversary campaigns
- birthday campaigns
- inactive customer campaigns
- upgrade opportunities
- customer satisfaction follow-up

Create:

**Next Best Action**

Example:

> Customer likely to upgrade within 90 days.

---

# 28. MODULE — CUSTOMER COMPLAINT MANAGEMENT

Complaint lifecycle:

**Received → Assigned → Investigating → Action Required → Manager Review → Resolved → Customer Confirmation → Closed**

Create severity:

- Critical
- High
- Medium
- Low

Automatic escalation based on:

- severity
- age
- customer value
- repeat complaint
- SLA breach

---

# 29. MODULE — HR & WORKFORCE

Track:

- employee
- department
- attendance
- shifts
- leave
- productivity
- targets
- incentives
- training
- skills

Create workforce dashboard.

---

# 30. MODULE — TASK ENGINE

Everything important in Autoera can create a task.

Task contains:

- owner
- department
- branch
- priority
- due date
- source event
- SLA
- status
- escalation
- completion evidence

Statuses:

- Open
- In Progress
- Waiting
- Completed
- Cancelled
- Escalated

---

# 31. EVENT-DRIVEN AUTOMATION

Build an event engine.

Examples:

### New Lead

→ Assign salesperson
→ Set SLA
→ Create call task
→ AI score lead
→ Notify manager if high-value

### Missed Follow-up

→ Create overdue task
→ Notify salesperson
→ Escalate after threshold

### Booking Created

→ Create documentation task
→ Finance task
→ Insurance task
→ Vehicle allocation task

### Vehicle Arrived

→ Create PDI task
→ Notify inventory manager

### Service Job Delayed

→ Alert advisor
→ Predict delay
→ Notify manager if SLA breached

### Customer Complaint

→ Assign owner
→ Start SLA
→ Escalate according to severity

---

# 32. AI AGENT ARCHITECTURE

Create specialized AI agents.

## Executive Agent

Answers:

> What is happening across my dealership?

## Sales Agent

Answers:

> What sales opportunities need attention?

## CRM Agent

Answers:

> Which customers need follow-up?

## Service Agent

Answers:

> Which workshop jobs are at risk?

## Parts Agent

Answers:

> Which parts should we order?

## Finance Agent

Answers:

> Which finance cases are stuck?

## Insurance Agent

Answers:

> Which policies need action?

## Used-Car Agent

Answers:

> Which stock is ageing?

## HR Agent

Answers:

> Where are manpower/productivity problems?

## Compliance Agent

Answers:

> What operational exceptions require review?

## Forecast Agent

Answers:

> What is likely to happen next?

## CX Agent

Answers:

> Which customers are at risk?

---

# 33. AI COMMAND CENTER

Create a central AI interface.

Management can type:

> "How are we doing today?"

> "Why are sales below target?"

> "Which branch is performing best?"

> "Show me all overdue leads."

> "Which service vehicles are delayed?"

> "What should I focus on today?"

> "Why is workshop productivity down?"

> "Which used cars are at risk?"

> "Prepare today's management meeting."

AI must answer using live authorized Autoera data.

Every important answer should show:

- supporting records
- source data
- calculations
- confidence where appropriate
- recommended action

---

# 34. EXCEPTION-FIRST MANAGEMENT

Management should not have to inspect everything.

Autoera should identify exceptions.

Examples:

🔴 15 hot leads have no follow-up

🔴 4 deliveries are at risk

🔴 Workshop productivity fell 12%

🔴 7 vehicles exceed promised delivery date

🔴 3 used cars have excessive ageing

🔴 12 finance files are waiting for documents

🔴 Parts shortage may delay tomorrow's jobs

Each alert must provide:

**Problem → Reason → Impact → Recommended Action → Owner**

---

# 35. DAILY OPENING AUTOMATION

At branch opening, automatically generate:

- yesterday's performance
- today's targets
- pending leads
- overdue activities
- today's test drives
- bookings
- deliveries
- service appointments
- workshop WIP
- parts shortages
- finance pending cases
- insurance cases
- complaints
- manpower issues
- AI priority list

Create:

> **Today's Top 10 Actions**

---

# 36. DAILY CLOSING AUTOMATION

At closing:

- calculate achievement
- identify missed targets
- identify overdue tasks
- reconcile activities
- review leads
- review bookings
- review deliveries
- review service WIP
- review complaints
- review finance
- review insurance
- review parts
- review used cars

Generate:

> **Daily Branch Closing Report**

---

# 37. MIS ENGINE

Build configurable MIS.

## DAILY MIS

Include:

- enquiries
- leads
- test drives
- bookings
- retail
- deliveries
- cancellations
- service RO
- labour sales
- parts sales
- gross revenue
- finance
- insurance
- accessories
- used cars
- complaints
- target achievement

## WEEKLY MIS

Include:

- branch ranking
- salesperson ranking
- conversion
- productivity
- ageing
- forecast
- lost business
- customer complaints

## MONTHLY MIS

Include:

- revenue
- gross profit
- volume
- target achievement
- department performance
- branch performance
- employee performance
- inventory ageing
- service productivity
- used-car margin
- customer retention

---

# 38. KPI ENGINE

Allow KPIs to be configured by:

- group
- branch
- department
- employee
- role

Examples:

### Sales

- enquiry-to-lead
- lead-to-test-drive
- test-drive-to-booking
- booking-to-delivery
- lead response time
- follow-up compliance

### Service

- RO count
- labour sales
- parts sales
- revenue
- productivity
- efficiency
- utilization
- CSI
- comeback

### Used Cars

- acquisition
- retail
- gross margin
- stock ageing
- inventory turnover

---

# 39. TARGET ENGINE

Targets can be configured monthly.

Examples:

- sales volume
- revenue
- service revenue
- parts revenue
- finance
- insurance
- accessories
- used cars
- customer satisfaction

Track:

**Target → Actual → Achievement % → Forecast → Gap**

AI should predict month-end achievement.

---

# 40. INCENTIVE ENGINE

Build configurable incentive rules.

Support:

- slab-based incentives
- volume incentives
- revenue incentives
- department incentives
- individual incentives
- team incentives
- quality modifiers
- CSI modifiers
- compliance modifiers

Every calculation must be explainable.

Show:

**Base → Rule → Achievement → Incentive → Adjustment → Final**

Never hide calculations.

---

# 41. AI FORECASTING

Forecast:

- sales
- service revenue
- parts demand
- used-car sales
- finance
- insurance
- customer retention
- inventory ageing

Display:

**Actual + Trend + Forecast + Confidence/Assumptions**

---

# 42. PROFITABILITY INTELLIGENCE

Where reliable financial data exists, calculate profitability at:

- branch
- department
- vehicle
- transaction
- salesperson
- customer
- used-car unit

Identify:

- high-margin activities
- low-margin activities
- leakage
- excessive discounts
- ageing costs
- rework
- missed revenue opportunities

AI recommendations must be evidence-based.

---

# 43. AI COMMUNICATION ENGINE

Generate communications for:

- SMS
- WhatsApp
- email
- internal notification
- customer follow-up
- appointment reminder
- service update
- delivery reminder
- complaint acknowledgement

AI must use approved templates and verified data.

Never fabricate:

- price
- discount
- stock
- delivery date
- finance approval
- insurance terms
- warranty coverage

---

# 44. HUMAN-IN-THE-LOOP

The AI may recommend actions.

High-impact actions require human approval.

Examples:

- discounts
- price changes
- refunds
- financial commitments
- customer compensation
- employee disciplinary action
- stock disposal
- used-car purchase approval
- sensitive customer communications

AI must clearly distinguish:

**Recommendation vs Executed Action**

---

# 45. AUDIT ENGINE

Record:

- user
- action
- timestamp
- previous value
- new value
- source
- approval
- IP/device information where appropriate

AI should detect:

- unusual discounts
- suspicious edits
- repeated cancellations
- unusual stock adjustments
- duplicate customers
- duplicate leads
- unusual incentive patterns
- unauthorized changes

---

# 46. DATA QUALITY ENGINE

Detect:

- duplicate customers
- invalid phone numbers
- missing VIN
- missing lead source
- incomplete job cards
- missing salesperson
- stale leads
- incorrect status
- orphan records

Provide:

> **Data Quality Score**

---

# 47. NOTIFICATION ENGINE

Support:

- in-app
- email
- SMS
- WhatsApp where integrated
- push notifications

Notifications must be:

- actionable
- relevant
- role-specific
- priority-aware

Avoid notification overload.

---

# 48. WORKFLOW BUILDER

Provide a no-code/low-code workflow builder.

Users should be able to configure:

**Trigger → Conditions → Action → Assignment → Notification → Escalation**

Example:

IF lead score > 80
AND no contact within 30 minutes

THEN:

- notify salesperson
- create urgent task
- notify sales manager
- start SLA

---

# 49. DATABASE DESIGN

Use a robust relational data model.

Core entities should include:

- organizations
- dealers
- branches
- departments
- users
- roles
- permissions
- employees
- customers
- vehicles
- vehicle\_models
- vehicle\_variants
- inventory
- leads
- opportunities
- activities
- test\_drives
- quotations
- bookings
- deliveries
- pdi\_records
- service\_appointments
- repair\_orders
- job\_cards
- jobs
- technicians
- bays
- labour\_lines
- parts
- parts\_transactions
- purchase\_orders
- suppliers
- finance\_cases
- insurance\_policies
- used\_cars
- appraisals
- reconditioning
- complaints
- tasks
- targets
- achievements
- incentives
- kpis
- notifications
- workflows
- workflow\_runs
- ai\_agents
- ai\_actions
- ai\_recommendations
- audit\_logs

All tables must have appropriate:

- tenant ID
- branch ID where applicable
- created\_at
- updated\_at
- created\_by
- updated\_by
- status

Use soft deletion where appropriate.

---

# 50. API-FIRST ARCHITECTURE

Build clean APIs.

Support:

- authentication
- customers
- leads
- vehicles
- inventory
- sales
- bookings
- service
- parts
- finance
- insurance
- used cars
- employees
- tasks
- KPIs
- reports
- AI
- workflows
- notifications

Design APIs for future mobile applications and third-party integrations.

---

# 51. INTEGRATION HUB

Build an integration layer.

Support future integrations with:

- OEM systems
- DMS
- accounting software
- payment gateways
- finance institutions
- insurance providers
- messaging platforms
- WhatsApp
- SMS
- email
- telephony
- maps
- vehicle data providers
- analytics systems

Do not hard-code external providers into the core business logic.

Use adapters/connectors.

---

# 52. MOBILE RESPONSIVENESS

Autoera must work on:

- desktop
- laptop
- tablet
- mobile

Technicians and salespeople should have mobile-friendly interfaces.

---

# 53. UX PRINCIPLES

The interface must be:

- clean
- modern
- fast
- minimal
- enterprise-grade
- data-rich without being cluttered

Use:

- cards
- tables
- charts
- timelines
- status indicators
- filters
- search
- command palette
- AI assistant

Prioritize actions over information.

---

# 54. THREE-LAYER UI

### MANAGEMENT

Command Center

### MANAGERS

Control Room

### EMPLOYEES

Workbench

The same underlying data should power all three experiences.

---

# 55. GLOBAL SEARCH

Implement global search across:

- customer
- mobile
- VIN
- registration
- lead
- booking
- job card
- vehicle
- employee
- task
- complaint

---

# 56. AI MEMORY

AI must have controlled memory.

Separate:

### Organization Memory

Policies, rules and configurations.

### Branch Memory

Branch-specific operational information.

### User Memory

Role, preferences and work context.

### Customer Memory

Customer interactions and history.

Do not allow unauthorized information leakage across scopes.

---

# 57. SECURITY

Implement:

- secure authentication
- RBAC
- tenant isolation
- encryption in transit
- encryption at rest where supported
- audit logging
- session management
- secure secrets management
- API authorization
- rate limiting
- backup strategy
- disaster recovery strategy

Follow privacy-by-design principles.

---

# 58. AI GOVERNANCE

Every AI agent must define:

- purpose
- scope
- allowed data
- tools
- permissions
- triggers
- actions
- memory
- escalation rules
- approval requirements
- audit logging

AI must never bypass application permissions.

AI must inherit user permissions.

---

# 59. AI RESPONSE STANDARD

For business questions, AI should answer in this structure:

### ANSWER

Short direct answer.

### EVIDENCE

Relevant data.

### WHY

Reason or calculation.

### RISK

Potential concern.

### ACTION

Recommended next step.

### OWNER

Who should act.

### DEADLINE

When action should occur.

---

# 60. MANAGEMENT MEETING COPILOT

Create an AI meeting assistant.

Before the meeting:

- prepare MIS
- identify gaps
- identify exceptions
- prepare branch rankings
- prepare questions
- prepare action items

During/after meeting:

- capture decisions
- assign actions
- assign owners
- assign deadlines
- track completion

Next meeting:

> Show unresolved actions from previous meeting.

---

# 61. EMPLOYEE COACHING

AI should identify coaching opportunities.

Example:

> Salesperson conversion has declined for three weeks.

AI provides:

- evidence
- likely causes
- activity analysis
- recommended coaching
- suggested action plan

Do not make unsupported judgments about employee character or intent.

---

# 62. BRANCH BENCHMARKING

Compare branches on:

- sales
- conversion
- service revenue
- productivity
- customer satisfaction
- finance penetration
- insurance penetration
- used-car margin
- inventory ageing

Allow managers to drill into the reasons behind differences.

---

# 63. CROSS-DEPARTMENT INTELLIGENCE

Autoera must connect departments.

Example:

Sales booking

→ Finance

→ Insurance

→ Accessories

→ PDI

→ Registration

→ Delivery

→ Customer CRM

→ Service retention

A customer should not become a disconnected record in every department.

---

# 64. DIGITAL DEALERSHIP CONTROL ROOM

Create a real-time dealership map showing:

### Sales

Lead pipeline

### Workshop

Vehicle WIP

### Parts

Stock health

### Finance

Pending cases

### Insurance

Pending/renewal cases

### Used Cars

Stock ageing

### HR

Manpower status

### CX

Complaints and satisfaction

### AI

Top risks and recommended actions

---

# 65. AUTOMATION SCORE

Create a dealership automation score.

Example:

**Automation Score: 74%**

Measure:

- automated lead assignment
- automated follow-ups
- automated reporting
- automated reminders
- automated task generation
- automated escalations
- automated KPI calculations
- automated customer communication

Show opportunities to increase automation.

---

# 66. NORTH-STAR METRICS

Track:

### Business

- revenue
- gross profit
- retail volume
- service revenue
- used-car margin

### Customer

- conversion
- retention
- CSI
- complaints
- response time

### Operations

- productivity
- efficiency
- utilization
- SLA compliance
- inventory ageing

### AI

- automation rate
- recommendation acceptance
- task completion
- exception resolution
- forecast accuracy

---

# 67. MVP PRIORITY

Do NOT attempt to build every feature simultaneously.

Build in phases.

## PHASE 1 — CORE PLATFORM

- authentication
- organization
- branches
- users
- roles
- permissions
- customers
- global search
- tasks
- notifications
- audit

## PHASE 2 — SALES + CRM

- leads
- pipeline
- activities
- test drives
- quotations
- bookings
- deliveries
- Customer 360
- AI lead scoring
- Sales Copilot

## PHASE 3 — MANAGEMENT INTELLIGENCE

- daily MIS
- KPI dashboard
- targets
- achievement
- AI Command Center
- alerts
- forecasting

## PHASE 4 — SERVICE

- appointments
- job cards
- workshop
- technician productivity
- service advisor copilot
- parts

## PHASE 5 — F&I

- finance
- insurance
- accessories

## PHASE 6 — USED CARS

- appraisal
- acquisition
- reconditioning
- inventory
- ageing
- sales

## PHASE 7 — AI AUTOMATION

- AI agents
- workflow builder
- predictive intelligence
- cross-department automation
- management meeting copilot

## PHASE 8 — INTEGRATIONS

- OEM
- accounting
- finance
- insurance
- communication
- payment
- telephony

---

# 68. DEVELOPMENT RULE

Do not generate a superficial prototype.

Build production-quality foundations.

Every feature must consider:

1. Database
2. Backend
3. API
4. Frontend
5. Permissions
6. Validation
7. Error handling
8. Audit logging
9. Automation
10. AI integration
11. Notifications
12. Reporting
13. Security
14. Scalability
15. Testing

---

# 69. FEATURE DEVELOPMENT STANDARD

For every feature, generate:

### A. Business Requirement

What business problem is solved?

### B. User Personas

Who uses it?

### C. User Stories

What should each user be able to do?

### D. Functional Requirements

What must the system do?

### E. Workflow

What is the complete process?

### F. Data Model

What tables/entities are required?

### G. API

What endpoints are required?

### H. UI

What screens/components are required?

### I. Permissions

Who can view/create/edit/approve?

### J. Automation

What should happen automatically?

### K. AI

Where can AI assist?

### L. Notifications

Who receives what?

### M. KPI Impact

Which business metrics improve?

### N. Audit

What actions must be logged?

### O. Edge Cases

What can go wrong?

### P. Acceptance Criteria

How do we know it works?

### Q. Test Cases

How will it be validated?

---

# 70. CRITICAL DESIGN PRINCIPLE

Do not make Autoera a collection of disconnected modules.

The architecture must behave like one operating system.

For example:

A customer enquiry should eventually connect to:

**Lead → Salesperson → Test Drive → Booking → Finance → Insurance → Vehicle → PDI → Delivery → Customer → Service → Insurance Renewal → Upgrade**

The same customer identity and vehicle identity must persist throughout the lifecycle.

---

# 71. AI OPERATING LOOP

Autoera should continuously operate this loop:

**Observe → Understand → Predict → Recommend → Assign → Execute → Verify → Learn**

Example:

System observes:

> Lead has not been contacted.

AI understands:

> High-value lead and purchase timeline is short.

AI predicts:

> Booking probability may decline.

AI recommends:

> Immediate manager-assisted follow-up.

System assigns:

> Salesperson + manager task.

System executes:

> Notification + communication workflow.

System verifies:

> Contact completed.

System learns:

> Outcome recorded.

---

# 72. EXCEPTION MANAGEMENT

The fundamental management philosophy is:

> **Do not make managers search for problems. Bring the problems to them.**

Autoera should continuously surface:

- risks
- delays
- missed opportunities
- SLA breaches
- productivity drops
- inventory risks
- customer risks
- revenue leakage
- compliance exceptions

---

# 73. AUTOERA AI DIGITAL MANAGEMENT TEAM

The final system should feel like the dealership has a digital management team.

The AI should behave as:

- Digital CEO Assistant
- Digital Sales Manager
- Digital CRM Manager
- Digital Service Manager
- Digital Parts Manager
- Digital Finance Manager
- Digital Insurance Manager
- Digital Used-Car Manager
- Digital HR Analyst
- Digital Compliance Analyst
- Digital Business Analyst

But AI remains an assistant/recommendation system unless explicitly authorized to execute an action.

---

# 74. NO HALLUCINATION POLICY

Never invent operational facts.

If data is missing, say:

> "I don't have verified data for this."

Do not fabricate:

- inventory
- price
- discount
- customer information
- vehicle availability
- finance approval
- insurance coverage
- warranty
- delivery date
- employee performance
- financial results

---

# 75. PERFORMANCE

The application must be designed for fast operation.

Optimize:

- database queries
- indexes
- pagination
- caching
- asynchronous jobs
- background AI processing
- event processing
- dashboard aggregation

Large dealership datasets must not make the UI unusable.

---

# 76. OBSERVABILITY

Implement monitoring for:

- API errors
- failed workflows
- failed notifications
- AI failures
- integration failures
- background jobs
- database issues
- authentication problems

Provide admin diagnostics.

---

# 77. DEPLOYMENT

Build the application so it can be deployed as a cloud SaaS platform.

Use environment variables for:

- database
- authentication
- AI providers
- messaging providers
- email
- storage
- payment
- external APIs

Never hard-code secrets.

---

# 78. PRODUCT PERSONALITY

Autoera should feel:

**Intelligent**
**Fast**
**Professional**
**Operational**
**Trustworthy**
**Simple**
**Action-oriented**
**Enterprise-grade**

Avoid unnecessary decorative UI.

The product should feel like a **digital dealership command center**, not a generic SaaS dashboard.

---

# 79. FINAL PRODUCT EXPERIENCE

When a dealer logs in, the system should immediately answer:

### "What is happening?"

### "What is going wrong?"

### "What should I do?"

### "Who should do it?"

### "By when?"

### "What will happen if we don't act?"

That is the core intelligence of Autoera.

---

# 80. FINAL BUILD INSTRUCTION

Build Autoera incrementally.

Do not attempt to generate the entire platform as one unstructured code dump.

First establish:

1. Architecture
2. Database
3. Authentication
4. Multi-tenancy
5. RBAC
6. Design system
7. Core navigation
8. Event architecture
9. Task engine
10. Audit engine
11. API foundation

Then implement modules one by one.

After every module:

- test
- validate
- fix
- document
- integrate
- update permissions
- update audit logging
- update analytics
- update AI context

Do not break previously implemented functionality.

---

# 81. DEFINITION OF DONE

Autoera is considered production-ready only when:

- multi-branch architecture works
- tenant isolation works
- RBAC works
- audit logging works
- Customer 360 works
- sales workflow works
- service workflow works
- inventory works
- tasks work
- notifications work
- MIS works
- KPI engine works
- target engine works
- AI agents work within permissions
- workflows execute reliably
- dashboards use real data
- reports reconcile with source transactions
- errors are handled
- integrations are isolated
- security controls are implemented
- automated tests cover critical workflows
- users can trace AI recommendations back to evidence

---

# 82. AUTOERA PRODUCT VISION

Autoera is not merely software that stores dealership information.

It is software that **understands dealership operations**.

It continuously:

**Collects data**
**Connects departments**
**Detects problems**
**Predicts outcomes**
**Creates tasks**
**Assists employees**
**Alerts managers**
**Measures performance**
**Automates repetitive work**
**Improves customer experience**
**Learns from operational outcomes**

The ultimate goal is:

> **One dealership. One platform. One source of truth. One intelligent operating system.**

# AUTOERA

### The AI Operating System for Dealerships.
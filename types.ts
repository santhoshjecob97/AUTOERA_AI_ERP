import React from 'react';

export type ViewState = 'dashboard' | 'sales' | 'service' | 'finance' | 'insurance' | 'workforce' | 'fleet' | 'ev' | 'oem' | 'developer' | 'plans' | 'service-ai' | 'sales-ai' | 'finance-ai' | 'insurance-ai' | 'fleet-ai' | 'workforce-ai' | 'ev-ai' | 'voice-ai' | 'ai-os' | 'database-arch' | 'backend-arch' | 'tech-stack' | 'security' | 'mobile-app' | 'customer-360' | 'vehicle-360' | 'desking' | 'workshop-command' | 'general-ledger' | 'used-cars' | 'daily-checklists' | 'sales-targets' | 'complaints';

export type UserRole = 
  // Corporate Roles
  | 'Dealer Principal'
  | 'CEO'
  | 'COO'
  | 'CFO'
  | 'CTO'
  | 'Group HR Head'
  | 'Group Sales Head'
  | 'Group Service Head'
  | 'Super Admin'
  | 'Enterprise Admin'
  | 'OEM User'
  // Branch Management Roles
  | 'Branch Manager'
  | 'General Manager'
  | 'Sales Manager'
  | 'Service Manager'
  | 'Workshop Manager'
  | 'Parts Manager'
  | 'Finance Manager'
  | 'Insurance Manager'
  | 'Used Car Manager'
  | 'CRM Manager'
  | 'HR Manager'
  | 'Fleet Manager'
  // Operational Roles
  | 'Sales Executive'
  | 'Telecaller'
  | 'CRM Executive'
  | 'Service Advisor'
  | 'Technician'
  | 'Warranty Executive'
  | 'Parts Executive'
  | 'Storekeeper'
  | 'Insurance Executive'
  | 'Finance Executive'
  | 'Finance Officer'
  | 'Used Car Executive'
  | 'EV Technician'
  | 'Driver'
  | 'Admin'
  | 'Vehicle Owner';

// ── 7-Tier Organizational Hierarchy Types ──
export interface OrganizationHierarchyNode {
  id: string;
  name: string;
  code?: string;
  level: 'DEALER_GROUP' | 'REGION' | 'CITY' | 'BRANCH' | 'DEPARTMENT' | 'TEAM' | 'EMPLOYEE';
}

export interface DealerGroupNode extends OrganizationHierarchyNode {
  level: 'DEALER_GROUP';
  oemBrands: string[];
  regions: RegionNode[];
}

export interface RegionNode extends OrganizationHierarchyNode {
  level: 'REGION';
  regionalHeadId?: string;
  cities: CityNode[];
}

export interface CityNode extends OrganizationHierarchyNode {
  level: 'CITY';
  state: string;
  branches: BranchNode[];
}

export interface BranchNode extends OrganizationHierarchyNode {
  level: 'BRANCH';
  branchManagerId?: string;
  facilityType: '3S' | '2S' | '1S' | 'WORKSHOP_ONLY' | 'BODYSHOP';
  departments: DepartmentNode[];
}

export interface DepartmentNode extends OrganizationHierarchyNode {
  level: 'DEPARTMENT';
  departmentType: 'SALES' | 'SERVICE' | 'PARTS' | 'FINANCE' | 'INSURANCE' | 'USED_CARS' | 'EV' | 'CRM' | 'HR' | 'HQ';
  teams: TeamNode[];
}

export interface TeamNode extends OrganizationHierarchyNode {
  level: 'TEAM';
  teamLeadId?: string;
  employees: EmployeeNode[];
}

export interface EmployeeNode extends OrganizationHierarchyNode {
  level: 'EMPLOYEE';
  role: UserRole;
  email: string;
  phone: string;
  efficiencyScore?: number;
  status: 'ACTIVE' | 'ON_LEAVE' | 'TRAINING';
}

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  avatar: string;
  permissions: ViewState[];
  email: string;
  organizationId?: string;
  organizationName?: string;
  groupId?: string;
  groupName?: string;
  regionId?: string;
  regionName?: string;
  cityId?: string;
  cityName?: string;
  branchId?: string;
  branchName?: string;
  departmentId?: string;
  department?: string;
  teamId?: string;
  teamName?: string;
}


export interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: React.ReactNode;
}

export interface Lead {
  id: string;
  name: string;
  vehicleInterest: string;
  vehicleDetails?: string; // Specific details like Make, Model, Year
  budget: string;
  aiScore: number; // 0-100
  status: 'New' | 'Contacted' | 'Negotiation' | 'Closed';
  lastAction: string;
  email?: string;
  phone?: string;
  source?: string;
  priority?: 'High' | 'Medium' | 'Low';
  assignedTo?: string;
  notes?: string;
}

export interface ServiceJob {
  id: string;
  customer: string;
  vehicle: string;
  issue: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Delayed';
  predictedCompletion: string;
  bay: string;
  technician?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  requiredSkills?: string[];
  aiInsights?: {
    diagnosisConfidence: number;
    partsRequired: string[];
    partsAvailability: 'In Stock' | 'Low Stock' | 'Out of Stock';
    estimatedCost: string;
  };
  email?: string;
  phone?: string;
  notes?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  registrationNumber?: string;
}

export interface ChartData {
  name: string;
  value: number;
  value2?: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
}

export interface OCRField {
  label: string;
  value: string;
  confidence: number; // 0-100
  isEditable?: boolean;
}

export interface LoanApplication {
  id: string;
  applicantName: string;
  vehicle: string;
  creditScore: number;
  loanAmount: string;
  tenure: number; // months
  status: 'Approved' | 'Pending' | 'Rejected' | 'Review';
  riskLevel: 'Low' | 'Medium' | 'High';
  interestRate: number;
  monthlyEMI: string;
  aiProbability: number; // Approval probability
  email?: string;
  phone?: string;
  vehiclePrice?: string;
  downPayment?: string;
  employmentType?: string;
  monthlyIncome?: string;
}

export interface FraudAnalysis {
  riskScore: number; // 0-100
  flaggedReasons: string[];
  locationMismatch: boolean;
  deviceFingerprint: 'Trusted' | 'New' | 'Suspicious';
  transactionVelocity: 'Normal' | 'High' | 'Critical';
  recommendation: 'Approve' | 'Block' | 'Verify Identity';
}

export interface Transaction {
  id: string;
  customer: string;
  amount: string;
  date: string;
  type: 'Service Payment' | 'Vehicle Downpayment' | 'EMI' | 'Accessory Purchase';
  status: 'Success' | 'Failed' | 'Fraud Alert';
  fraudAnalysis?: FraudAnalysis;
}

export interface InsurancePolicy {
  id: string;
  policyHolder: string;
  vehicle: string;
  policyType: 'Comprehensive' | 'Third Party' | 'Zero Dep';
  premium: string;
  expiryDate: string;
  status: 'Active' | 'Expired' | 'Renewal Due';
  riskScore: number; // 0-100 (Low is better)
  email?: string;
  phone?: string;
  registrationNumber?: string;
  coverageAmount?: string;
  startDate?: string;
}

export interface InsuranceClaim {
  id: string;
  policyId: string;
  policyHolder: string;
  incidentDate: string;
  type: 'Accident' | 'Theft' | 'Natural Calamity';
  status: 'Filed' | 'Analyzing' | 'Approved' | 'Rejected' | 'Investigation';
  claimedAmount: string;
  aiAssessment?: {
    damageSeverity: 'Minor' | 'Moderate' | 'Severe' | 'Total Loss';
    estimatedRepairCost: string;
    fraudProbability: number; // 0-100
    flaggedInconsistencies: string[];
    recommendedPayout: string;
  };
}

export interface Skill {
  name: string;
  level: number; // 0-100
  targetLevel: number; // Benchmark
}

export interface TrainingModule {
  id: string;
  title: string;
  duration: string;
  priority: 'High' | 'Medium' | 'Low';
  reason: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
}

export interface Employee {
  id: string;
  name: string;
  role: 'Technician' | 'Sales Executive' | 'Service Advisor' | 'Manager';
  department: 'Sales' | 'Service' | 'Finance' | 'Operations';
  status: 'Active' | 'On Leave' | 'Training';
  efficiencyScore: number; // 0-100
  currentLoad: number; // 0-100%
  skills: Skill[];
  recommendedTraining: TrainingModule[];
  attendance: number; // %
  email?: string;
  phone?: string;
  joiningDate?: string;
  certifications?: string;
  performanceScore?: number;
}

export interface FleetVehicle {
  id: string;
  model: string;
  plateNumber: string;
  type: 'EV' | 'Hybrid' | 'ICE';
  status: 'Active' | 'Charging' | 'Maintenance' | 'Idle';
  batteryLevel: number; // %
  range: number; // km
  healthScore: number; // 0-100 (Battery SOH)
  location: string;
  driver: string;
  nextMaintenance: string;
  make?: string;
  year?: number;
  batteryCapacity?: number;
  currentMileage?: number;
  lastServiceDate?: string;
}

export interface ChargingStation {
  id: string;
  location: string;
  type: 'DC Fast' | 'AC Type 2';
  status: 'Available' | 'Occupied' | 'Offline';
  powerOutput: string; // e.g. "50kW"
  currentSession?: {
    vehicleId: string;
    startTime: string;
    energyDelivered: string;
  };
}

export interface InventoryPart {
  id: string;
  name: string;
  sku: string;
  category: string;
  stockLevel: number;
  reorderPoint: number;
  unitPrice: number;
  status: 'In Stock' | 'Low Stock' | 'Critical';
  predictedDemand: number; // Units/Month
  supplier: string;
}

export interface Appointment {
  id: string;
  customerName: string;
  vehicle: string;
  serviceType: string;
  date: Date;
  startTime: string;
  duration: number; // minutes
  technicianId?: string;
  bayId?: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
}

export interface RoadsideRequest {
  id: string;
  customer: string;
  location: string;
  issue: string;
  status: 'Searching' | 'Dispatched' | 'En Route' | 'On Site' | 'Resolved';
  eta: string;
  technician?: string;
  vehicleType: string;
}

export interface QualityAudit {
  id: string;
  jobId: string;
  technician: string;
  score: number; // 0-100
  checklist: { item: string; status: 'Pass' | 'Fail' | 'N/A' }[];
  status: 'Pending' | 'Passed' | 'Failed';
  inspector: string;
}

export interface CustomerFeedback {
  id: string;
  jobId: string;
  customer: string;
  rating: number; // 1-5
  comment: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  date: string;
}

export interface TenantConfig {
  id: string;
  companyName: string;
  domain: string;
  primaryColor: string;
  logoUrl: string;
  status: string;
}

export interface OnboardingStage {
  id: string;
  customerName: string;
  stage: string;
  progress: number;
  nextTask: string;
  dueDate: string;
}

export interface ImplementationStep {
  id: string;
  engine: string;
  progress: number;
  status: string;
  lastUpdated: string;
}

export interface IntegrationStatus {
  service: string;
  status: string;
  latency: string;
  uptime: string;
}

export type VoiceAgentState =
  | 'GREETING'
  | 'PROBLEM_IDENTIFICATION'
  | 'INFORMATION_GATHERING'
  | 'SERVICE_RECOMMENDATION'
  | 'APPOINTMENT_SCHEDULING'
  | 'CONTACT_COLLECTION'
  | 'UPSELLING'
  | 'CONFIRMATION'
  | 'IDLE';

export interface VoiceLog {
  role: 'agent' | 'customer';
  message: string;
  timestamp: Date;
  state?: VoiceAgentState;
}

export interface VoiceCall {
  id: string;
  agentName: string;
  customerName: string;
  duration: string;
  status: 'Live' | 'Completed' | 'Missed';
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  transcriptSnippet: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  lastUsed: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  status: 'Active' | 'Paused';
}

// Subscription & Plans Types
export type SubscriptionTier = 'starter' | 'professional' | 'enterprise';

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  price: number;
  billingCycle: 'monthly' | 'annual';
  features: string[];
  aiModels: number;
  engines: string[];
  users: number;
  support: string;
  popular?: boolean;
}

export interface UserSubscription {
  userId: string;
  planId: string;
  tier: SubscriptionTier;
  status: 'active' | 'trial' | 'expired' | 'cancelled';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
}

import React from 'react';

export type ViewState = 'dashboard' | 'sales' | 'service' | 'finance' | 'insurance' | 'workforce' | 'fleet' | 'ev' | 'oem' | 'developer' | 'plans' | 'service-ai' | 'sales-ai' | 'finance-ai' | 'insurance-ai' | 'fleet-ai' | 'workforce-ai' | 'ev-ai' | 'voice-ai' | 'ai-os' | 'database-arch' | 'backend-arch' | 'tech-stack' | 'security' | 'mobile-app';

export type UserRole = 
  // L0 — Platform
  | 'Super Admin' 
  // L1 — Enterprise
  | 'Enterprise Admin' 
  // L2 — Dealer
  | 'Dealer Principal' 
  // L3 — General / OEM
  | 'General Manager' 
  | 'OEM User'
  // L4 — Department Managers
  | 'Sales Manager' 
  | 'Service Manager' 
  | 'Fleet Manager'
  | 'Parts Manager'
  // L5 — Executives / Advisors
  | 'Sales Executive' 
  | 'CRM Executive'
  | 'Service Advisor' 
  | 'Insurance Executive'
  | 'Finance Officer' 
  // L6 — Specialists
  | 'Technician' 
  // L7 — External
  | 'Vehicle Owner';

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
  branchId?: string;
  branchName?: string;
  department?: string;
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

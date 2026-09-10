import React, { useState } from 'react';
import { 
  Server, 
  Cpu, 
  Layers, 
  Send, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Network, 
  FileCode, 
  Code, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw, 
  Sliders, 
  Radio, 
  Database,
  Search,
  ExternalLink
} from 'lucide-react';

interface Microservice {
  name: string;
  technology: string;
  responsibility: string;
  scaling: string;
  instances: number;
  routePrefix: string;
  status: 'HEALTHY' | 'DEGRADED';
  circuitBreaker: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
}

const SERVICES: Microservice[] = [
  { name: 'API Gateway', technology: 'Kong / AWS Gateway', responsibility: 'Rate limiting, auth validation, routing, circuit breaker', scaling: 'Horizontal — 4 instances, anycast', instances: 4, routePrefix: '/api/v1/', status: 'HEALTHY', circuitBreaker: 'CLOSED' },
  { name: 'Auth Service', technology: 'FastAPI + Redis', responsibility: 'Login, JWT, refresh tokens, MFA, RBAC permission evaluation', scaling: 'Horizontal — 3 instances, stateless', instances: 3, routePrefix: '/api/v1/auth/', status: 'HEALTHY', circuitBreaker: 'CLOSED' },
  { name: 'User Service', technology: 'FastAPI + Python', responsibility: 'User CRUD, role assignment, profile, onboarding workflows', scaling: 'Horizontal — 2 instances', instances: 2, routePrefix: '/api/v1/users/', status: 'HEALTHY', circuitBreaker: 'CLOSED' },
  { name: 'CRM Service', technology: 'FastAPI + Python', responsibility: 'Customer, lead, opportunity, campaign, lifecycle tracking', scaling: 'Horizontal + read replicas', instances: 4, routePrefix: '/api/v1/customers/', status: 'HEALTHY', circuitBreaker: 'CLOSED' },
  { name: 'Sales Service', technology: 'FastAPI + Python', responsibility: 'Quotations, bookings, test drives, inventory, demand forecast', scaling: 'Horizontal — 3 instances', instances: 3, routePrefix: '/api/v1/sales/', status: 'HEALTHY', circuitBreaker: 'CLOSED' },
  { name: 'Service Ops Service', technology: 'FastAPI + Python', responsibility: 'Job cards, appointments, bay management, workshop ops', scaling: 'Horizontal — per-branch affinity', instances: 5, routePrefix: '/api/v1/service/', status: 'HEALTHY', circuitBreaker: 'CLOSED' },
  { name: 'Fleet Service', technology: 'FastAPI + Python', responsibility: 'Fleet vehicles, driver management, route tracking, telematics', scaling: 'Horizontal — IoT-write-optimised', instances: 4, routePrefix: '/api/v1/fleet/', status: 'HEALTHY', circuitBreaker: 'CLOSED' },
  { name: 'EV Service', technology: 'FastAPI + Python', responsibility: 'Battery data, health scoring, charging sessions, BMS integration', scaling: 'Horizontal — compute-intensive ML', instances: 3, routePrefix: '/api/v1/ev/', status: 'HEALTHY', circuitBreaker: 'CLOSED' },
  { name: 'Insurance Service', technology: 'FastAPI + Python', responsibility: 'Policies, renewals, claims, insurer API, commissions', scaling: 'Horizontal — 3 instances', instances: 3, routePrefix: '/api/v1/insurance/', status: 'HEALTHY', circuitBreaker: 'CLOSED' },
  { name: 'Finance Service', technology: 'FastAPI + Python', responsibility: 'Loan applications, DigiLocker, bank APIs, NACH, disbursement', scaling: 'Horizontal — 3 instances', instances: 3, routePrefix: '/api/v1/finance/', status: 'HEALTHY', circuitBreaker: 'CLOSED' },
  { name: 'Analytics Service', technology: 'FastAPI + DuckDB', responsibility: 'Dashboard data, custom reports, aggregations, benchmarks', scaling: 'Vertical — compute/memory-optimised', instances: 2, routePrefix: '/api/v1/analytics/', status: 'HEALTHY', circuitBreaker: 'CLOSED' },
  { name: 'Notification Service', technology: 'Node.js + Bull + Redis', responsibility: 'WhatsApp, push, email, SMS delivery, queue + retry + DLQ', scaling: 'Horizontal — queue auto-scaling', instances: 6, routePrefix: '/api/v1/communication/', status: 'HEALTHY', circuitBreaker: 'CLOSED' },
  { name: 'AI Service', technology: 'FastAPI + LangChain', responsibility: 'Agent orchestration, RAG pipeline, model routing, prompts', scaling: 'Vertical + GPU instances', instances: 4, routePrefix: '/api/v1/ai/', status: 'HEALTHY', circuitBreaker: 'CLOSED' },
  { name: 'Billing Service', technology: 'FastAPI + Razorpay', responsibility: 'Subscription management, invoicing, payment processing', scaling: 'Horizontal — 2 instances', instances: 2, routePrefix: '/api/v1/billing/', status: 'HEALTHY', circuitBreaker: 'CLOSED' },
  { name: 'Parts Service', technology: 'FastAPI + Python', responsibility: 'Parts catalog, stock management, vendor management', scaling: 'Horizontal — 2 instances', instances: 2, routePrefix: '/api/v1/inventory/', status: 'HEALTHY', circuitBreaker: 'CLOSED' },
  { name: 'OEM Service', technology: 'FastAPI + Python', responsibility: 'OEM dashboard, dealer network analytics, OEM reports', scaling: 'Horizontal — 2 instances', instances: 2, routePrefix: '/api/v1/oem/', status: 'HEALTHY', circuitBreaker: 'CLOSED' }
];

const KAFKA_TOPICS = [
  { topic: 'autoera.leads.created', destination: 'AI scoring, assignment, notification sequence start', consumers: ['ai-service', 'notification-service', 'analytics-service'] },
  { topic: 'autoera.leads.status_changed', destination: 'Follow-up sequence update, analytics event, reporting', consumers: ['analytics-service', 'notification-service'] },
  { topic: 'autoera.job_cards.created', destination: 'Parts availability check, tech notify, customer WhatsApp', consumers: ['notification-service', 'ai-service'] },
  { topic: 'autoera.job_cards.stage_changed', destination: 'Customer WhatsApp auto-send, bay status update', consumers: ['notification-service', 'analytics-service'] },
  { topic: 'autoera.insurance.expiry_alert', destination: 'Renewal sequence trigger, advisor daily list update', consumers: ['notification-service'] },
  { topic: 'autoera.fleet.anomaly_detected', destination: 'Fleet manager alert, maintenance booking, driver notify', consumers: ['notification-service', 'analytics-service'] },
  { topic: 'autoera.payments.completed', destination: 'Commission calculation, invoice generation, receipt', consumers: ['billing-service', 'notification-service', 'analytics-service'] },
  { topic: 'autoera.ai.prediction_made', destination: 'Store to predictions table, notify if critical threshold', consumers: ['ai-service', 'analytics-service'] },
  { topic: 'autoera.users.login_failed', destination: 'Security center alert if 3+ failures in 10 minutes', consumers: ['analytics-service', 'notification-service'] }
];

export const Section13BackendWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'SERVICES' | 'KAFKA' | 'GATEWAY' | 'STANDARDS'>('SERVICES');
  const [selectedService, setSelectedService] = useState<Microservice | null>(SERVICES[0]);
  const [searchFilter, setSearchFilter] = useState('');
  const [publishedEvents, setPublishedEvents] = useState<any[]>([
    {
      message_id: 'msg_98401_abc',
      topic: 'autoera.leads.created',
      tenant_id: 'org_tata_motors_south',
      correlation_id: 'corr_lead_7812',
      timestamp: '2026-09-09T22:00:15Z',
      payload: { lead_id: 'lead_8891', vehicle: 'Nexon EV Empowered', ai_score: 9.4 }
    }
  ]);
  const [eventTopic, setEventTopic] = useState('autoera.leads.created');
  const [eventPayload, setEventPayload] = useState('{"lead_id": "lead_9921", "customer": "Vikram Patel", "fuel": "EV"}');

  const handlePublishEvent = () => {
    try {
      const parsed = JSON.parse(eventPayload);
      const newEv = {
        message_id: 'msg_' + Math.random().toString(36).substring(2, 9),
        topic: eventTopic,
        tenant_id: 'org_apex_mobility',
        correlation_id: 'corr_' + Math.random().toString(36).substring(2, 8),
        timestamp: new Date().toISOString(),
        payload: parsed
      };
      setPublishedEvents([newEv, ...publishedEvents]);
    } catch (e) {
      alert('Invalid JSON in payload');
    }
  };

  const filteredServices = SERVICES.filter(s =>
    s.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    s.technology.toLowerCase().includes(searchFilter.toLowerCase()) ||
    s.responsibility.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('SERVICES')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'SERVICES'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Server size={15} />
            16 Microservices Mesh
            <span className="ml-1 px-1.5 py-0.5 rounded-md bg-black/30 text-[10px]">16/16</span>
          </button>

          <button
            onClick={() => setActiveTab('KAFKA')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'KAFKA'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Network size={15} />
            Kafka Event Bus (AWS MSK)
            <span className="ml-1 px-1.5 py-0.5 rounded-md bg-black/30 text-[10px]">9 Topics</span>
          </button>

          <button
            onClick={() => setActiveTab('GATEWAY')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'GATEWAY'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck size={15} />
            API Gateway &amp; Rate Limits
            <span className="ml-1 px-1.5 py-0.5 rounded-md bg-black/30 text-[10px]">Kong / AWS</span>
          </button>

          <button
            onClick={() => setActiveTab('STANDARDS')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'STANDARDS'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Code size={15} />
            REST &amp; GraphQL Standards
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Mesh Cluster: 16 Services Online
          </span>
        </div>
      </div>

      {/* TAB 1: 16 MICROSERVICES MESH */}
      {activeTab === 'SERVICES' && (
        <div className="space-y-6">
          <div className="bg-[#0D1117] border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter services by name, stack, or responsibility..."
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">
                14 Horizontal
              </span>
              <span className="px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-400 font-bold">
                2 Vertical (DuckDB &amp; AI GPU)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredServices.map((svc) => {
              const isSelected = selectedService?.name === svc.name;
              return (
                <div
                  key={svc.name}
                  onClick={() => setSelectedService(svc)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-orange-500/10 border-orange-500/60 shadow-lg shadow-orange-500/10'
                      : 'bg-[#0D1117] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                      <Server size={14} className={isSelected ? 'text-orange-400' : 'text-slate-400'} />
                      {svc.name}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Healthy" />
                  </div>

                  <p className="text-[11px] font-mono text-cyan-400 mb-2">
                    {svc.technology}
                  </p>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                    {svc.responsibility}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-500">{svc.routePrefix}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 font-bold">
                      {svc.instances} Pods
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Service Drawer */}
          {selectedService && (
            <div className="bg-[#0D1117] border border-slate-800 rounded-2xl p-5 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono text-orange-400 uppercase font-bold tracking-wider">
                    Microservice Inspector
                  </span>
                  <h3 className="text-lg font-black text-white font-mono mt-0.5">
                    {selectedService.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Status: {selectedService.status}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    Circuit: {selectedService.circuitBreaker}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-slate-500 uppercase text-[10px] font-mono">Tech Stack</span>
                  <p className="text-cyan-300 font-bold font-mono">{selectedService.technology}</p>
                  <p className="text-slate-400 text-[11px] pt-1">Target route: <code className="text-white">{selectedService.routePrefix}</code></p>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-slate-500 uppercase text-[10px] font-mono">Scaling Strategy</span>
                  <p className="text-amber-300 font-bold font-mono">{selectedService.scaling}</p>
                  <p className="text-slate-400 text-[11px] pt-1">Active Replica Count: <span className="text-white font-bold">{selectedService.instances}</span></p>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-slate-500 uppercase text-[10px] font-mono">Primary Responsibility</span>
                  <p className="text-slate-300 leading-relaxed">{selectedService.responsibility}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: KAFKA EVENT BUS EXPLORER */}
      {activeTab === 'KAFKA' && (
        <div className="bg-[#0D1117] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
                <Network size={20} className="text-orange-400" />
                Apache Kafka Event Bus (AWS MSK Topology)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                3 Brokers · 3 Availability Zones · Replication Factor 3 · Multi-Tenant Partitioning by `tenant_id`
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30">
              <span>Cluster State: IN-SYNC REPLICAS (3/3)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Core Event Topics */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                9 Core Event Topics &amp; Consumer Subscriptions
              </h4>

              <div className="space-y-2.5">
                {KAFKA_TOPICS.map((kt) => (
                  <div key={kt.topic} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-orange-400">
                        {kt.topic}
                      </span>
                      <div className="flex gap-1">
                        {kt.consumers.map(c => (
                          <span key={c} className="px-1.5 py-0.5 rounded bg-slate-950 text-[10px] font-mono text-cyan-400 border border-slate-800">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300">
                      &rarr; {kt.destination}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Event Publisher & Stream */}
            <div className="space-y-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Send size={14} className="text-cyan-400" />
                Live Kafka Message Dispatcher Sandbox
              </h4>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Target Topic</label>
                <select
                  value={eventTopic}
                  onChange={(e) => setEventTopic(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono outline-none"
                >
                  {KAFKA_TOPICS.map(kt => (
                    <option key={kt.topic} value={kt.topic}>{kt.topic}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">JSON Payload</label>
                <textarea
                  value={eventPayload}
                  onChange={(e) => setEventPayload(e.target.value)}
                  rows={3}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-mono outline-none"
                />
              </div>

              <button
                onClick={handlePublishEvent}
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
              >
                <Send size={14} />
                Publish Event to Kafka Bus
              </button>

              <div className="pt-2">
                <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Recent Published Envelopes (with correlation_id &amp; tenant_id):
                </h5>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {publishedEvents.map((pe) => (
                    <pre key={pe.message_id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[10px] font-mono text-emerald-400 overflow-x-auto">
{JSON.stringify(pe, null, 2)}
                    </pre>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: API GATEWAY & CIRCUIT BREAKER */}
      {activeTab === 'GATEWAY' && (
        <div className="bg-[#0D1117] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
              <ShieldCheck size={20} className="text-cyan-400" />
              API Gateway &amp; Circuit Breaker Configuration
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Kong / AWS API Gateway layer enforcing rate limits, JWT auth verification, dynamic routing, and fast-fail circuit breakers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
              <span className="text-[10px] font-bold font-mono text-blue-400 uppercase">TIER 1</span>
              <h4 className="text-base font-bold text-white">Starter Plan Tier</h4>
              <p className="text-2xl font-black text-white font-mono">100 <span className="text-xs font-normal text-slate-400">req / min</span></p>
              <p className="text-xs text-slate-400">Enforced per API Key or JWT Tenant ID. Burst limit of 150 reqs.</p>
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-400">
                X-RateLimit-Limit: 100
              </div>
            </div>

            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
              <span className="text-[10px] font-bold font-mono text-emerald-400 uppercase">TIER 2</span>
              <h4 className="text-base font-bold text-white">Growth Plan Tier</h4>
              <p className="text-2xl font-black text-emerald-400 font-mono">500 <span className="text-xs font-normal text-slate-400">req / min</span></p>
              <p className="text-xs text-slate-400">Multi-branch franchises. Burst limit of 750 reqs with concurrency isolation.</p>
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-400">
                X-RateLimit-Limit: 500
              </div>
            </div>

            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
              <span className="text-[10px] font-bold font-mono text-orange-400 uppercase">TIER 3</span>
              <h4 className="text-base font-bold text-white">Enterprise Plan Tier</h4>
              <p className="text-2xl font-black text-orange-400 font-mono">2,000 <span className="text-xs font-normal text-slate-400">req / min</span></p>
              <p className="text-xs text-slate-400">OEM groups and corporate fleets. Dedicated IP allowlisting &amp; unthrottled burst.</p>
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-400">
                X-RateLimit-Limit: 2000
              </div>
            </div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Circuit Breaker Policy (Netflix Hystrix / Resilience4j Pattern)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-emerald-400 font-bold block mb-1">STATE: CLOSED</span>
                <p className="text-slate-400 text-[11px] font-sans">Normal execution. 100% traffic routed to microservice backend instances.</p>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-red-400 font-bold block mb-1">STATE: OPEN</span>
                <p className="text-slate-400 text-[11px] font-sans">Triggered after 5 consecutive 5xx errors or &gt;2000ms latency. Fast-fails with cached fallback or HTTP 503.</p>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-amber-400 font-bold block mb-1">STATE: HALF-OPEN</span>
                <p className="text-slate-400 text-[11px] font-sans">Tests 5% probe traffic after 15-second cooldown. Restores CLOSED if successful.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REST API & GRAPHQL STANDARDS */}
      {activeTab === 'STANDARDS' && (
        <div className="bg-[#0D1117] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
              <Code size={20} className="text-emerald-400" />
              REST API Design Standards &amp; GraphQL Specification
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Consistent URL patterns, mandatory response envelopes, standardized error schemas, cursor pagination, and GraphQL dashboard endpoints.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase font-mono">1. Standard Response Envelope</span>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto">
{`{
  "data": [
    {
      "lead_id": "lead_xyz_123",
      "status": "HOT",
      "ai_score": 8.9
    }
  ],
  "meta": {
    "page": 1,
    "total": 47,
    "cursor": "lead_xyz_123",
    "timestamp": "2026-09-09T22:00:00Z"
  },
  "errors": []
}`}
                </pre>
              </div>

              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase font-mono">2. Standard Error Format</span>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-red-400 overflow-x-auto">
{`{
  "data": null,
  "meta": { "timestamp": "2026-09-09T22:00:00Z" },
  "errors": [
    {
      "code": "LEAD_NOT_FOUND",
      "message": "Lead 'lead_999' does not exist in branch.",
      "field": "lead_id"
    }
  ]
}`}
                </pre>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase font-mono">3. Structured Filters &amp; Cursor Pagination</span>
                <p className="text-xs text-slate-300">
                  URL patterns support nested operator filtering and opaque cursors:
                </p>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 break-all">
                  GET /v1/leads?filter[status]=hot&amp;filter[score][gte]=7&amp;sort=-created_at&amp;after=lead_xyz_123&amp;limit=50
                </div>
              </div>

              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase font-mono">4. Enterprise GraphQL Gateway</span>
                <p className="text-xs text-slate-300">
                  Single endpoint for complex nested dashboard queries:
                </p>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-purple-300 overflow-x-auto">
{`POST /api/v1/graphql/
query {
  dealership(id: "d-101") {
    name
    activeJobCards { id vehicle { regNumber } status }
    leads(status: "HOT") { id aiScore }
  }
}`}
                </pre>
              </div>

              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase font-mono">5. Versioning &amp; Sunset Deprecation</span>
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-amber-400">
                  X-API-Deprecated: true<br />
                  Sunset: 2027-01-01
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Section13BackendWorkspace;

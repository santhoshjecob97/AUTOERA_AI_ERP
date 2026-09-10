import React, { useState } from 'react';
import {
  Code,
  Key,
  Webhook,
  BookOpen,
  Copy,
  Check,
  Plus,
  Trash2,
  Send,
  ShieldCheck,
  ExternalLink,
  Cpu,
  AlertCircle,
  Clock,
  Activity,
  Layers,
  Terminal
} from 'lucide-react';
import { useWhiteLabel } from '../../context/WhiteLabelContext';

interface ApiKeyItem {
  id: string;
  name: string;
  prefix: string;
  scopes: string[];
  rateLimitRpm: number;
  isActive: boolean;
  createdAt: string;
  lastUsedAt?: string;
}

interface WebhookItem {
  id: string;
  name: string;
  targetUrl: string;
  events: string[];
  secretMasked: string;
  isActive: boolean;
  failureCount: number;
}

export const DeveloperPortalPage: React.FC = () => {
  const { currentBrand } = useWhiteLabel();
  const [activeTab, setActiveTab] = useState<'keys' | 'webhooks' | 'docs'>('keys');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  // API Keys state
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([
    {
      id: 'k-1',
      name: 'Telematics Fleet Gateway',
      prefix: 'aek_live_9f8a',
      scopes: ['read:telemetry', 'write:telemetry'],
      rateLimitRpm: 300,
      isActive: true,
      createdAt: '2026-08-15',
      lastUsedAt: '2 mins ago',
    },
    {
      id: 'k-2',
      name: 'Dealership Mobile Customer App',
      prefix: 'aek_live_2b1c',
      scopes: ['read:leads', 'write:leads', 'read:service'],
      rateLimitRpm: 120,
      isActive: true,
      createdAt: '2026-08-20',
      lastUsedAt: '12 mins ago',
    },
    {
      id: 'k-3',
      name: 'HDFC Auto Loan Integration',
      prefix: 'aek_live_7c4d',
      scopes: ['read:leads', 'write:jobcards'],
      rateLimitRpm: 60,
      isActive: false,
      createdAt: '2026-07-01',
      lastUsedAt: '30 days ago',
    },
  ]);

  // Webhooks state
  const [webhooks, setWebhooks] = useState<WebhookItem[]>([
    {
      id: 'wh-1',
      name: 'CRM Hubspot Event Sync',
      targetUrl: 'https://api.dealership-crm.com/webhooks/autoera',
      events: ['lead.created', 'lead.status_changed'],
      secretMasked: 'whsec_••••••••••••••••3a81',
      isActive: true,
      failureCount: 0,
    },
    {
      id: 'wh-2',
      name: 'Fleet Geofence Alert Dispatcher',
      targetUrl: 'https://iot.fleetmanagement.in/alerts/v1',
      events: ['telemetry.alert', 'telemetry.geofence_breach'],
      secretMasked: 'whsec_••••••••••••••••9c42',
      isActive: true,
      failureCount: 0,
    },
  ]);

  // Modals & form state
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [generatedSecret, setGeneratedSecret] = useState<string | null>(null);

  const [pingResult, setPingResult] = useState<any | null>(null);
  const [isPinging, setIsPinging] = useState(false);
  const [codeLang, setCodeLang] = useState<'curl' | 'python' | 'ts'>('curl');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCreateKey = () => {
    if (!newKeyName.trim()) return;
    const randomPrefix = Math.random().toString(16).substring(2, 6);
    const rawSecret = `aek_live_${randomPrefix}_${Math.random().toString(36).substring(2, 18)}${Math.random().toString(36).substring(2, 18)}`;
    const newKey: ApiKeyItem = {
      id: `k-${Date.now()}`,
      name: newKeyName,
      prefix: `aek_live_${randomPrefix}`,
      scopes: ['read:telemetry', 'read:leads', 'read:service'],
      rateLimitRpm: 120,
      isActive: true,
      createdAt: 'Just now',
      lastUsedAt: 'Never',
    };
    setApiKeys([newKey, ...apiKeys]);
    setGeneratedSecret(rawSecret);
  };

  const handleRevokeKey = (id: string) => {
    if (confirm('Are you sure you want to revoke this API key? External requests will fail immediately.')) {
      setApiKeys(apiKeys.map(k => k.id === id ? { ...k, isActive: false } : k));
    }
  };

  const handleTestPing = (wh: WebhookItem) => {
    setIsPinging(true);
    setPingResult(null);
    setTimeout(() => {
      setIsPinging(false);
      setPingResult({
        status: 'SUCCESS',
        statusCode: 200,
        latencyMs: 38,
        signatureHeader: 'sha256=9b43f8e4c7d01248a958e1c6812ad30018f48b11c97a29e1',
        url: wh.targetUrl,
        deliveredPayload: {
          event: 'autoera.webhook.ping',
          timestamp: new Date().toISOString(),
          subscription_id: wh.id,
          message: 'AutoEra AI Webhook ping verified.'
        }
      });
    }, 600);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800 relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Code size={13} />
                Developer & Partner Ecosystem
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-medium flex items-center gap-1">
                <Activity size={12} className="animate-pulse" />
                Gateway Latency: 14ms p95
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-['Outfit']">
              AutoEra API Developer Platform
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Provision tenant-scoped API keys, subscribe to HMAC-signed event webhooks, and integrate programmatic telemetry and dealership CRM workflows.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { setIsKeyModalOpen(true); setGeneratedSecret(null); setNewKeyName(''); }}
              className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2"
            >
              <Plus size={15} />
              <span>Generate API Key</span>
            </button>
          </div>
        </div>

        {/* Global Developer Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Active API Keys</span>
            <div className="text-2xl font-bold text-white mt-0.5 font-['Outfit']">{apiKeys.filter(k => k.isActive).length} <span className="text-xs text-slate-400 font-normal">of {apiKeys.length} total</span></div>
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Outbound Webhooks</span>
            <div className="text-2xl font-bold text-emerald-400 mt-0.5 font-['Outfit']">{webhooks.length} endpoints</div>
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">24h API Volume</span>
            <div className="text-2xl font-bold text-blue-400 mt-0.5 font-['Outfit']">148,200 reqs</div>
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Security Standard</span>
            <div className="text-2xl font-bold text-orange-400 mt-0.5 font-['Outfit']">SHA-256 HMAC</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('keys')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'keys'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Key size={14} />
          API Keys ({apiKeys.length})
        </button>
        <button
          onClick={() => setActiveTab('webhooks')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'webhooks'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Webhook size={14} />
          Webhooks ({webhooks.length})
        </button>
        <button
          onClick={() => setActiveTab('docs')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'docs'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BookOpen size={14} />
          Interactive API Reference
        </button>
      </div>

      {/* Tab 1: API Keys */}
      {activeTab === 'keys' && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-['Outfit']">Active API Credentials</h3>
                <p className="text-xs text-slate-400 mt-0.5">Never share your secret tokens. Revoked keys are rejected instantly.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Name & Description</th>
                    <th className="px-4 py-3.5">Key Prefix</th>
                    <th className="px-4 py-3.5">Permissions & Scopes</th>
                    <th className="px-4 py-3.5">Rate Limit</th>
                    <th className="px-4 py-3.5">Last Used</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {apiKeys.map((k) => (
                    <tr key={k.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-bold text-white">{k.name}</div>
                        <div className="text-[11px] text-slate-500">Created: {k.createdAt}</div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-mono text-orange-400 font-bold bg-slate-950 px-2 py-1 rounded border border-slate-800">
                          {k.prefix}...
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {k.scopes.map((s) => (
                            <span key={s} className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] font-mono">
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4 font-semibold text-slate-300">{k.rateLimitRpm} req/min</td>
                      <td className="px-4 py-4 text-slate-400">{k.lastUsedAt || 'Never'}</td>
                      <td className="px-4 py-4">
                        {k.isActive ? (
                          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-[11px] font-bold">
                            Active
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-md text-[11px] font-bold">
                            Revoked
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right">
                        {k.isActive && (
                          <button
                            onClick={() => handleRevokeKey(k.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Revoke API Key"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Webhooks */}
      {activeTab === 'webhooks' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-['Outfit']">Outbound Event Webhooks</h3>
                <p className="text-xs text-slate-400 mt-0.5">Payloads are dispatched via HTTP POST with an `X-AutoEra-Signature` header for verification.</p>
              </div>
            </div>

            <div className="divide-y divide-slate-800/60">
              {webhooks.map((wh) => (
                <div key={wh.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/20 transition-colors">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-white text-sm">{wh.name}</span>
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-bold">
                        ACTIVE
                      </span>
                    </div>
                    <div className="font-mono text-xs text-slate-400">{wh.targetUrl}</div>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[11px] text-slate-500">Subscribed Events:</span>
                      {wh.events.map((ev) => (
                        <span key={ev} className="px-2 py-0.5 bg-slate-800 text-orange-300 rounded text-[10px] font-mono">
                          {ev}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleTestPing(wh)}
                      disabled={isPinging}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
                    >
                      <Send size={13} className={isPinging ? 'animate-spin' : ''} />
                      <span>{isPinging ? 'Pinging...' : 'Send Test Ping'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Test Ping Response Box */}
          {pingResult && (
            <div className="bg-slate-900/80 rounded-xl p-5 border border-emerald-500/30 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Webhook Test Delivery Passed ({pingResult.statusCode} OK &middot; {pingResult.latencyMs}ms)
                  </span>
                </div>
                <button
                  onClick={() => setPingResult(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Dismiss
                </button>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 space-y-2 overflow-x-auto">
                <div className="text-orange-400">X-AutoEra-Signature: {pingResult.signatureHeader}</div>
                <pre className="text-slate-300 text-[11px]">{JSON.stringify(pingResult.deliveredPayload, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Interactive Docs */}
      {activeTab === 'docs' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-800 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-['Outfit']">Programmatic API Quickstart</h3>
                <p className="text-xs text-slate-400 mt-0.5">Authenticate with bearer tokens in the HTTP Authorization header.</p>
              </div>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                {(['curl', 'python', 'ts'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setCodeLang(lang)}
                    className={`px-3 py-1 rounded text-xs font-bold uppercase transition-all ${
                      codeLang === lang ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Block */}
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 relative font-mono text-xs overflow-x-auto">
              <button
                onClick={() => handleCopy(
                  codeLang === 'curl' ? `curl -X POST https://api.autoera.ai/api/v1/fleet/telemetry/ingest/ \\\n  -H "Authorization: Bearer aek_live_8f3a_DEMO" \\\n  -H "Content-Type: application/json" \\\n  -d '{"device_id": "OBD-2026", "records": [{"vin": "MA3EWBF1S00129841", "speed": 78.4}]}'` :
                  codeLang === 'python' ? `import requests\n\nheaders = {'Authorization': 'Bearer aek_live_8f3a_DEMO'}\nres = requests.post('https://api.autoera.ai/api/v1/fleet/telemetry/ingest/', headers=headers, json={'device_id': 'OBD-2026'})\nprint(res.json())` :
                  `import axios from 'axios';\n\nconst client = axios.create({\n  baseURL: 'https://api.autoera.ai/api/v1',\n  headers: { Authorization: 'Bearer aek_live_8f3a_DEMO' }\n});\nconst { data } = await client.get('/vehicles/');`,
                  'code-block'
                )}
                className="absolute right-3 top-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Copy snippet"
              >
                {copiedIndex === 'code-block' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>

              {codeLang === 'curl' && (
                <pre className="text-slate-200">
{`# Ingest Telemetry Stream via cURL
curl -X POST https://api.autoera.ai/api/v1/fleet/telemetry/ingest/ \\
  -H "Authorization: Bearer aek_live_8f3a_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "device_id": "OBD-2026-X1",
    "records": [
      {
        "vin": "MA3EWBF1S00129841",
        "speed": 78.4,
        "engine_rpm": 2400,
        "coolant_temp_c": 89.2
      }
    ]
  }'`}
                </pre>
              )}

              {codeLang === 'python' && (
                <pre className="text-slate-200">
{`import requests

API_KEY = "aek_live_8f3a_YOUR_KEY"
BASE_URL = "https://api.autoera.ai/api/v1"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

# 1. Fetch live vehicle fleet health
response = requests.get(f"{BASE_URL}/vehicles/", headers=headers)
print("Fleet Status:", response.json())

# 2. Compute EV battery health score
battery_payload = {"vin": "MA3EWBF1S00129841"}
ev_res = requests.post(f"{BASE_URL}/ev/health-scores/compute/", json=battery_payload, headers=headers)
print("Battery SOH:", ev_res.json())`}
                </pre>
              )}

              {codeLang === 'ts' && (
                <pre className="text-slate-200">
{`import axios from 'axios';

const autoera = axios.create({
  baseURL: 'https://api.autoera.ai/api/v1',
  headers: {
    Authorization: 'Bearer aek_live_8f3a_YOUR_KEY',
    'Content-Type': 'application/json'
  }
});

// Create customer sales lead
async function captureLead() {
  const { data } = await autoera.post('/sales/leads/', {
    name: 'Aravind Swamy',
    phone: '+919884012345',
    vehicle_interest: 'Tata Nexon EV Empowered'
  });
  console.log('Lead Scored:', data.ai_score);
}`}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Generate API Key */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white font-['Outfit']">Provision New API Key</h3>

            {!generatedSecret ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 font-medium">Integration Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Telematics Fleet Aggregator"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-xs text-slate-400 font-medium">Assigned Scopes</span>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="accent-orange-500" />
                      <span>read:telemetry (Stream vehicle GPS & CAN metrics)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="accent-orange-500" />
                      <span>read:leads & write:leads (CRM prospect pipeline)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="accent-orange-500" />
                      <span>read:service & write:jobcards (Workshop milestones)</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setIsKeyModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateKey}
                    className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition-all shadow-md shadow-orange-500/20"
                  >
                    Generate Secret
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-start gap-2">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  <span>Make sure to copy your API key now. You will not be able to see it again!</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-orange-400 break-all flex items-center justify-between gap-2">
                  <span>{generatedSecret}</span>
                  <button
                    onClick={() => handleCopy(generatedSecret, 'modal-key')}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex-shrink-0"
                    title="Copy to clipboard"
                  >
                    {copiedIndex === 'modal-key' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setIsKeyModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition-all"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeveloperPortalPage;

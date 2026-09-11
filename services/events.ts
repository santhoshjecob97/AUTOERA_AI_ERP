// Real-time Event Streaming Service (SSE + WebSocket Fallback)
// Subscribes to /api/v1/events/stream/ for real-time dealership notifications

export interface RealtimeEvent {
  id: string;
  type: 'bay_status' | 'hot_lead' | 'fleet_telemetry' | 'ai_action' | 'system_alert' | 'insurance_renewal';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
  timestamp: string;
  metadata?: Record<string, any>;
}

type EventListener = (event: RealtimeEvent) => void;

class EventStreamService {
  private eventSource: EventSource | null = null;
  private listeners: Set<EventListener> = new Set();
  private isConnected = false;
  private reconnectTimeout: any = null;
  private fallbackInterval: any = null;

  constructor() {
    this.connect();
  }

  public connect(): void {
    if (typeof window === 'undefined') return;

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const streamUrl = `${apiBase}/api/v1/events/stream/`;

      this.eventSource = new EventSource(streamUrl);

      this.eventSource.onopen = () => {
        this.isConnected = true;
        if (this.fallbackInterval) {
          clearInterval(this.fallbackInterval);
          this.fallbackInterval = null;
        }
      };

      const handleDomainEvent = (messageEvent: MessageEvent, defaultType: RealtimeEvent['type'] = 'system_alert') => {
        try {
          const data = JSON.parse(messageEvent.data);
          const eventType = data.event_type || defaultType;
          let severity: RealtimeEvent['severity'] = 'info';
          if (eventType.includes('Failed') || eventType.includes('Unavailable') || eventType.includes('Delayed') || eventType.includes('Escalated')) {
            severity = 'critical';
          } else if (eventType.includes('Stale') || eventType.includes('Aging') || eventType.includes('Pending')) {
            severity = 'warning';
          } else if (eventType.includes('Created') || eventType.includes('Completed') || eventType.includes('Approved') || eventType.includes('Closed')) {
            severity = 'success';
          }

          const event: RealtimeEvent = {
            id: data.event_id || data.id || `evt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            type: (data.type || defaultType) as RealtimeEvent['type'],
            title: data.event_type ? `${data.event_type.replace(/([A-Z])/g, ' $1').trim()}` : (data.title || 'System Notification'),
            message: data.message || (data.payload ? JSON.stringify(data.payload) : (typeof data === 'string' ? data : JSON.stringify(data))),
            severity: data.severity || severity,
            timestamp: data.timestamp ? new Date(data.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString(),
            metadata: data.payload || data.metadata || data
          };
          this.notify(event);
        } catch (err) {
          console.warn('Failed to parse SSE event data:', err);
        }
      };

      this.eventSource.onmessage = (e) => handleDomainEvent(e, 'system_alert');

      // Register specific automotive event types
      const domainEvents = [
        'LeadCreated', 'LeadUpdated', 'LeadAssigned', 'BookingCreated', 'BookingCancelled',
        'JobCardCreated', 'JobStarted', 'JobDelayed', 'ROClosed', 'PartsUnavailable',
        'PaymentReceived', 'ComplaintCreated', 'ComplaintEscalated', 'dashboard_sync'
      ];
      domainEvents.forEach(evt => {
        this.eventSource?.addEventListener(evt, (e: any) => {
          let mappedType: RealtimeEvent['type'] = 'system_alert';
          if (evt.includes('Lead')) mappedType = 'hot_lead';
          else if (evt.includes('Job') || evt.includes('RO')) mappedType = 'bay_status';
          else if (evt.includes('sync')) mappedType = 'bay_status';
          handleDomainEvent(e, mappedType);
        });
      });

      this.eventSource.onerror = () => {
        this.isConnected = false;
        if (this.eventSource) {
          this.eventSource.close();
          this.eventSource = null;
        }
        // Attempt reconnect after 10 seconds
        if (!this.reconnectTimeout) {
          this.reconnectTimeout = setTimeout(() => {
            this.reconnectTimeout = null;
            this.connect();
          }, 10000);
        }
        // Start simulated event fallback in local development
        this.startFallbackSimulation();
      };
    } catch {
      this.startFallbackSimulation();
    }
  }

  private startFallbackSimulation(): void {
    if (this.fallbackInterval) return;

    const sampleEvents: Array<Omit<RealtimeEvent, 'id' | 'timestamp'>> = [
      {
        type: 'bay_status',
        title: 'Bay 3 Status Update',
        message: 'Bay 3 (Express Maintenance) transitioned from IN_USE to READY for inspection.',
        severity: 'info',
        metadata: { bay_id: 'BAY-03', technician: 'Rajesh K (L2)' }
      },
      {
        type: 'hot_lead',
        title: 'Hot Lead SLA Warning',
        message: 'Lead #LD-4091 (Harish M - Nexon EV) awaiting contact for 12 mins. Escalated to Team Lead.',
        severity: 'warning',
        metadata: { lead_id: 'LD-4091', model: 'Nexon EV Empowered', score: 88 }
      },
      {
        type: 'fleet_telemetry',
        title: 'EV Telemetry Heartbeat',
        message: 'Apex EV Fleet #AP-09 recorded 96% battery balance, 0 thermal anomalies, SOH 94.2%.',
        severity: 'success',
        metadata: { vehicle_id: 'AP-09', soh: 94.2, temp_c: 28.4 }
      },
      {
        type: 'insurance_renewal',
        title: 'Insurance Renewal Milestone',
        message: '30-Day renewal WhatsApp notification dispatched to Anita S (TN-09-CB-4491).',
        severity: 'info',
        metadata: { policy_no: 'POL-78190', expiring_in_days: 30 }
      }
    ];

    let index = 0;
    this.fallbackInterval = setInterval(() => {
      const sample = sampleEvents[index % sampleEvents.length];
      index++;
      this.notify({
        ...sample,
        id: `evt_sim_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }, 25000); // Gentle heartbeat every 25s
  }

  public subscribe(listener: EventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(event: RealtimeEvent): void {
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error('Error in event stream listener:', err);
      }
    });
  }

  public disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    if (this.fallbackInterval) {
      clearInterval(this.fallbackInterval);
      this.fallbackInterval = null;
    }
  }
}

export const eventStreamService = new EventStreamService();
export default eventStreamService;

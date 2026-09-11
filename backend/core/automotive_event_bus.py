"""
AutoEra AI — Central Automotive Event Architecture & Bus (Section 07 Master Specification)
High-throughput, multi-tenant, idempotent event bus with Kafka & resilient local pub/sub.

Every event conforms to the master specification:
- event_id
- tenant_id
- group_id
- branch_id
- department_id
- entity_type
- entity_id
- event_type (45+ domain events)
- timestamp
- actor
- source
- payload
- correlation_id
- idempotency_key
"""

import os
import json
import time
import uuid
import queue
import logging
import threading
from typing import Dict, Any, List, Optional, Callable, Set
from datetime import datetime, timezone
from django.conf import settings

logger = logging.getLogger('autoera.event_bus')


class AutomotiveEventType:
    # 1. Customer & CRM Events
    CUSTOMER_CREATED = 'CustomerCreated'
    CUSTOMER_AT_RISK = 'CustomerAtRisk'
    CUSTOMER_CONSENT_UPDATED = 'CustomerConsentUpdated'

    # 2. Sales & Lead Events
    LEAD_CREATED = 'LeadCreated'
    LEAD_UPDATED = 'LeadUpdated'
    LEAD_ASSIGNED = 'LeadAssigned'
    LEAD_CONTACTED = 'LeadContacted'
    LEAD_STALE = 'LeadStale'
    APPOINTMENT_CREATED = 'AppointmentCreated'
    APPOINTMENT_MISSED = 'AppointmentMissed'
    TEST_DRIVE_COMPLETED = 'TestDriveCompleted'
    QUOTATION_CREATED = 'QuotationCreated'
    QUOTATION_UPDATED = 'QuotationUpdated'
    BOOKING_CREATED = 'BookingCreated'
    BOOKING_CANCELLED = 'BookingCancelled'

    # 3. Finance & Insurance Events
    FINANCE_SUBMITTED = 'FinanceSubmitted'
    FINANCE_APPROVED = 'FinanceApproved'
    FINANCE_REJECTED = 'FinanceRejected'
    FINANCE_DOCUMENT_MISSING = 'FinanceDocumentMissing'
    INSURANCE_QUOTED = 'InsuranceQuoted'
    INSURANCE_ISSUED = 'InsuranceIssued'
    INSURANCE_EXPIRING = 'InsuranceExpiring'

    # 4. Inventory, PDI & Delivery Events
    VEHICLE_RECEIVED = 'VehicleReceived'
    VEHICLE_ALLOCATED = 'VehicleAllocated'
    PDI_STARTED = 'PDIStarted'
    PDI_FAILED = 'PDIFailed'
    PDI_COMPLETED = 'PDICompleted'
    DELIVERY_SCHEDULED = 'DeliveryScheduled'
    DELIVERY_DELAYED = 'DeliveryDelayed'
    VEHICLE_DELIVERED = 'VehicleDelivered'
    INVENTORY_AGING = 'InventoryAging'

    # 5. Service & Workshop Events
    SERVICE_APPOINTMENT_CREATED = 'ServiceAppointmentCreated'
    VEHICLE_RECEIVED_FOR_SERVICE = 'VehicleReceivedForService'
    JOB_CARD_CREATED = 'JobCardCreated'
    INSPECTION_COMPLETED = 'InspectionCompleted'
    ESTIMATE_CREATED = 'EstimateCreated'
    ESTIMATE_APPROVED = 'EstimateApproved'
    ESTIMATE_REJECTED = 'EstimateRejected'
    JOB_STARTED = 'JobStarted'
    JOB_DELAYED = 'JobDelayed'
    PARTS_REQUESTED = 'PartsRequested'
    PARTS_UNAVAILABLE = 'PartsUnavailable'
    PARTS_RECEIVED = 'PartsReceived'
    REPAIR_COMPLETED = 'RepairCompleted'
    QC_FAILED = 'QCFailed'
    RO_CLOSED = 'ROClosed'

    # 6. Billing, Warranty & Complaints
    PAYMENT_PENDING = 'PaymentPending'
    PAYMENT_RECEIVED = 'PaymentReceived'
    COMPLAINT_CREATED = 'ComplaintCreated'
    COMPLAINT_ESCALATED = 'ComplaintEscalated'
    COMPLAINT_RESOLVED = 'ComplaintResolved'
    WARRANTY_CREATED = 'WarrantyCreated'
    WARRANTY_DELAYED = 'WarrantyDelayed'

    # 7. Used Cars & Workforce
    USED_VEHICLE_APPRAISED = 'UsedVehicleAppraised'
    USED_VEHICLE_PURCHASED = 'UsedVehiclePurchased'
    USED_VEHICLE_AGING = 'UsedVehicleAging'
    EMPLOYEE_ABSENT = 'EmployeeAbsent'
    TECHNICIAN_UNAVAILABLE = 'TechnicianUnavailable'
    TARGET_MISSED = 'TargetMissed'
    KPI_THRESHOLD_BREACHED = 'KPIThresholdBreached'
    REVENUE_LEAK_DETECTED = 'RevenueLeakDetected'
    DATA_QUALITY_ISSUE_DETECTED = 'DataQualityIssueDetected'


class AutomotiveEvent:
    """Standardized Canonical Automotive Event Envelope."""
    def __init__(
        self,
        event_type: str,
        tenant_id: str,
        entity_type: str,
        entity_id: str,
        payload: Dict[str, Any],
        branch_id: Optional[str] = None,
        group_id: Optional[str] = None,
        department_id: Optional[str] = None,
        actor: Optional[str] = 'SYSTEM',
        source: Optional[str] = 'autoera-core',
        correlation_id: Optional[str] = None,
        idempotency_key: Optional[str] = None,
        event_id: Optional[str] = None,
        timestamp: Optional[str] = None,
    ):
        self.event_id = event_id or f"evt_{uuid.uuid4().hex}"
        self.tenant_id = str(tenant_id)
        self.group_id = str(group_id) if group_id else None
        self.branch_id = str(branch_id) if branch_id else None
        self.department_id = str(department_id) if department_id else None
        self.entity_type = str(entity_type)
        self.entity_id = str(entity_id)
        self.event_type = str(event_type)
        self.timestamp = timestamp or datetime.now(timezone.utc).isoformat()
        self.actor = str(actor or 'SYSTEM')
        self.source = str(source or 'autoera-core')
        self.payload = payload or {}
        self.correlation_id = str(correlation_id or f"corr_{uuid.uuid4().hex[:12]}")
        self.idempotency_key = str(idempotency_key or f"idemp_{self.tenant_id}_{self.event_type}_{self.entity_id}_{int(time.time())}")

    def to_dict(self) -> Dict[str, Any]:
        return {
            'event_id': self.event_id,
            'tenant_id': self.tenant_id,
            'organization_id': self.tenant_id,
            'group_id': self.group_id,
            'branch_id': self.branch_id,
            'department_id': self.department_id,
            'entity_type': self.entity_type,
            'entity_id': self.entity_id,
            'event_type': self.event_type,
            'timestamp': self.timestamp,
            'actor': self.actor,
            'source': self.source,
            'payload': self.payload,
            'correlation_id': self.correlation_id,
            'idempotency_key': self.idempotency_key,
        }

    def to_json(self) -> str:
        return json.dumps(self.to_dict())


class AutomotiveEventBus:
    """
    Central, high-concurrency pub-sub Event Bus with:
    - In-memory subscriber registry
    - Live SSE queues for real-time frontend dashboard streaming
    - Idempotency deduplication cache
    - Dead-letter queue (DLQ) for failed consumer handlers
    - Resilient Kafka publishing bridge
    """
    _instance = None
    _lock = threading.Lock()

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = cls()
        return cls._instance

    def __init__(self):
        self._subscribers: Dict[str, List[Callable[[AutomotiveEvent], None]]] = {}
        self._wildcard_subscribers: List[Callable[[AutomotiveEvent], None]] = []
        self._sse_client_queues: Dict[str, List[queue.Queue]] = {}  # tenant_id -> list of queues
        self._processed_idempotency_keys: Set[str] = set()
        self._dlq: List[Dict[str, Any]] = []
        self._recent_events: List[Dict[str, Any]] = []
        self._max_history = 500

    def subscribe(self, event_type: str, handler: Callable[[AutomotiveEvent], None]):
        """Register a callback handler for a specific event type, or '*' for all events."""
        with self._lock:
            if event_type == '*':
                self._wildcard_subscribers.append(handler)
            else:
                if event_type not in self._subscribers:
                    self._subscribers[event_type] = []
                self._subscribers[event_type].append(handler)

    def register_sse_queue(self, tenant_id: str) -> queue.Queue:
        """Creates and registers a thread-safe queue for a connected SSE browser client."""
        q = queue.Queue(maxsize=100)
        with self._lock:
            if tenant_id not in self._sse_client_queues:
                self._sse_client_queues[tenant_id] = []
            self._sse_client_queues[tenant_id].append(q)
        return q

    def unregister_sse_queue(self, tenant_id: str, q: queue.Queue):
        """Unregisters an SSE client queue on disconnect."""
        with self._lock:
            if tenant_id in self._sse_client_queues:
                try:
                    self._sse_client_queues[tenant_id].remove(q)
                except ValueError:
                    pass

    def publish(self, event: AutomotiveEvent) -> Dict[str, Any]:
        """
        Publishes an event through the Automotive Event Bus:
        1. Checks idempotency to prevent duplicate event loops.
        2. Dispatches to all in-process registered subscribers.
        3. Pushes to live SSE client queues for connected frontends.
        4. Relays to Kafka producer if Kafka is available.
        """
        # 1. Idempotency Check
        with self._lock:
            if event.idempotency_key in self._processed_idempotency_keys:
                logger.info(f"Duplicate event ignored: {event.idempotency_key}")
                return {'status': 'DUPLICATE_IGNORED', 'event_id': event.event_id}

            self._processed_idempotency_keys.add(event.idempotency_key)
            if len(self._processed_idempotency_keys) > 5000:
                self._processed_idempotency_keys.clear()

            self._recent_events.append(event.to_dict())
            if len(self._recent_events) > self._max_history:
                self._recent_events.pop(0)

        # 2. In-Process Subscribers Dispatch
        handlers = []
        with self._lock:
            handlers.extend(self._subscribers.get(event.event_type, []))
            handlers.extend(self._wildcard_subscribers)

        for handler in handlers:
            try:
                handler(event)
            except Exception as e:
                logger.error(f"Error in event handler {handler.__name__} for {event.event_type}: {e}")
                self._dlq.append({
                    'event': event.to_dict(),
                    'error': str(e),
                    'failed_at': datetime.now(timezone.utc).isoformat()
                })

        # 3. Live SSE Frontends Dispatch
        with self._lock:
            target_queues = list(self._sse_client_queues.get(event.tenant_id, []))
            # Also dispatch to generic/wildcard queues (e.g. 'all' or empty tenant)
            target_queues.extend(self._sse_client_queues.get('all', []))

        for q in target_queues:
            try:
                q.put_nowait(event.to_dict())
            except queue.Full:
                pass

        # 4. Kafka Relay (if Kafka is enabled)
        try:
            from core.kafka_bus import KafkaEventProducer
            kafka_producer = KafkaEventProducer.get_instance()
            kafka_producer.publish(
                topic=f"autoera.{event.event_type.lower()}",
                event_type=event.event_type,
                payload=event.payload,
                organization_id=event.tenant_id,
                correlation_id=event.correlation_id,
                branch_id=event.branch_id
            )
        except Exception as e:
            pass

        return {
            'status': 'PUBLISHED',
            'event_id': event.event_id,
            'event_type': event.event_type,
            'handlers_count': len(handlers),
            'timestamp': event.timestamp
        }

    def get_recent_events(self, tenant_id: Optional[str] = None, limit: int = 50) -> List[Dict[str, Any]]:
        with self._lock:
            if not tenant_id:
                return list(self._recent_events[-limit:])
            return [e for e in self._recent_events if e.get('tenant_id') == str(tenant_id)][-limit:]


# Global Singleton Event Bus Instance
automotive_event_bus = AutomotiveEventBus.get_instance()

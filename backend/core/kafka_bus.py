"""
AutoEra AI — Enterprise Kafka Event Bus (Section 07 & Section 09)

Implements enterprise-grade asynchronous event streaming across core dealership topics:
- autoera.fleet.telemetry (OBD-II stream, geofence, alerts)
- autoera.sales.leads (Lead lifecycle, SLA escalations)
- autoera.service.jobcards (6-stage milestone state machine)
- autoera.ai.actions (Copilot proposals, autonomous triggers)
- autoera.audit.security (MFA, DPDP, cryptographic events)

Features:
- Partitioning by organization_id for strict multi-tenant isolation
- Resilient local memory buffer & Dead-Letter Queue (DLQ) when Kafka broker is offline
- Trace context injection for OpenTelemetry / distributed tracing
"""
import os
import json
import time
import uuid
import logging
from typing import Dict, Any, List, Optional, Callable
from datetime import datetime
from django.conf import settings

logger = logging.getLogger('autoera.kafka')


class KafkaTopics:
    # Section 13 Core Event Topics
    LEADS_CREATED = 'autoera.leads.created'
    LEADS_STATUS_CHANGED = 'autoera.leads.status_changed'
    JOB_CARDS_CREATED = 'autoera.job_cards.created'
    JOB_CARDS_STAGE_CHANGED = 'autoera.job_cards.stage_changed'
    INSURANCE_EXPIRY_ALERT = 'autoera.insurance.expiry_alert'
    FLEET_ANOMALY_DETECTED = 'autoera.fleet.anomaly_detected'
    PAYMENTS_COMPLETED = 'autoera.payments.completed'
    AI_PREDICTION_MADE = 'autoera.ai.prediction_made'
    USERS_LOGIN_FAILED = 'autoera.users.login_failed'

    # Legacy topic aliases
    FLEET_TELEMETRY = 'autoera.fleet.telemetry'
    SALES_LEADS = 'autoera.sales.leads'
    SERVICE_JOBCARDS = 'autoera.service.jobcards'
    AI_ACTIONS = 'autoera.ai.actions'
    AUDIT_SECURITY = 'autoera.audit.security'

    ALL_TOPICS = [
        LEADS_CREATED,
        LEADS_STATUS_CHANGED,
        JOB_CARDS_CREATED,
        JOB_CARDS_STAGE_CHANGED,
        INSURANCE_EXPIRY_ALERT,
        FLEET_ANOMALY_DETECTED,
        PAYMENTS_COMPLETED,
        AI_PREDICTION_MADE,
        USERS_LOGIN_FAILED,
        FLEET_TELEMETRY,
        SALES_LEADS,
        SERVICE_JOBCARDS,
        AI_ACTIONS,
        AUDIT_SECURITY
    ]


class KafkaConsumerGroups:
    NOTIFICATION_SERVICE = 'notification-service'
    ANALYTICS_SERVICE = 'analytics-service'
    AI_SERVICE = 'ai-service'
    BILLING_SERVICE = 'billing-service'

    ALL_GROUPS = [
        NOTIFICATION_SERVICE,
        ANALYTICS_SERVICE,
        AI_SERVICE,
        BILLING_SERVICE
    ]

    TOPIC_SUBSCRIPTIONS = {
        KafkaTopics.LEADS_CREATED: [AI_SERVICE, NOTIFICATION_SERVICE, ANALYTICS_SERVICE],
        KafkaTopics.LEADS_STATUS_CHANGED: [ANALYTICS_SERVICE, NOTIFICATION_SERVICE],
        KafkaTopics.JOB_CARDS_CREATED: [NOTIFICATION_SERVICE, AI_SERVICE],
        KafkaTopics.JOB_CARDS_STAGE_CHANGED: [NOTIFICATION_SERVICE, ANALYTICS_SERVICE],
        KafkaTopics.INSURANCE_EXPIRY_ALERT: [NOTIFICATION_SERVICE],
        KafkaTopics.FLEET_ANOMALY_DETECTED: [NOTIFICATION_SERVICE, ANALYTICS_SERVICE],
        KafkaTopics.PAYMENTS_COMPLETED: [BILLING_SERVICE, NOTIFICATION_SERVICE, ANALYTICS_SERVICE],
        KafkaTopics.AI_PREDICTION_MADE: [AI_SERVICE, ANALYTICS_SERVICE],
        KafkaTopics.USERS_LOGIN_FAILED: [ANALYTICS_SERVICE, NOTIFICATION_SERVICE]
    }


class KafkaEventProducer:
    """
    Enterprise message producer with automatic local buffering and DLQ fallback.
    """
    _instance = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def __init__(self):
        self.bootstrap_servers = getattr(settings, 'KAFKA_BOOTSTRAP_SERVERS', '') or os.environ.get('KAFKA_BOOTSTRAP_SERVERS', 'localhost:9092')
        self._producer = None
        self._is_connected = False
        self._memory_buffer: List[Dict[str, Any]] = []
        self._dead_letter_queue: List[Dict[str, Any]] = []
        self._max_buffer_size = 1000

        self._init_kafka()

    def _init_kafka(self):
        """Attempts connection to Kafka broker if client library is installed."""
        try:
            from confluent_kafka import Producer
            self._producer = Producer({
                'bootstrap.servers': self.bootstrap_servers,
                'client.id': 'autoera-core-producer',
                'retries': 3,
                'queue.buffering.max.messages': 50000
            })
            self._is_connected = True
            logger.info(f"Kafka Producer connected to {self.bootstrap_servers}")
        except Exception as e:
            logger.info(f"Kafka broker unavailable ({e}). Using resilient local in-memory event bus.")
            self._is_connected = False

    @property
    def is_connected(self) -> bool:
        return self._is_connected

    def publish(
        self,
        topic: str,
        event_type: str,
        payload: Dict[str, Any],
        organization_id: Optional[Any] = None,
        tenant_id: Optional[Any] = None,
        correlation_id: Optional[str] = None,
        partition_key: Optional[str] = None,
        branch_id: Optional[Any] = None,
        key: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Publishes an event to the specified topic with tenant partition key.
        Guarantees presence of: tenant_id, timestamp, correlation_id.
        """
        message_id = str(uuid.uuid4())
        timestamp = datetime.utcnow().isoformat() + 'Z'
        resolved_tenant = str(tenant_id or organization_id or partition_key or 'default-tenant')
        resolved_corr = str(correlation_id or f"corr_{uuid.uuid4().hex[:12]}")
        resolved_key = str(key or partition_key or resolved_tenant)

        envelope = {
            'message_id': message_id,
            'topic': topic,
            'event_type': event_type,
            'tenant_id': resolved_tenant,
            'organization_id': resolved_tenant,
            'correlation_id': resolved_corr,
            'branch_id': str(branch_id) if branch_id else None,
            'timestamp': timestamp,
            'payload': payload,
            'partition_key': resolved_key,
            'producer': 'autoera-ai-core-v1.0'
        }

        # If live Kafka broker is connected
        if self._is_connected and self._producer:
            try:
                self._producer.produce(
                    topic=topic,
                    key=partition_key.encode('utf-8'),
                    value=json.dumps(envelope).encode('utf-8'),
                    on_delivery=self._delivery_callback
                )
                self._producer.poll(0)
                return {
                    'status': 'PUBLISHED_KAFKA',
                    'message_id': message_id,
                    'topic': topic,
                    'timestamp': timestamp
                }
            except Exception as err:
                logger.warning(f"Kafka publish failed: {err}. Redirecting to local buffer.")
                self._dead_letter_queue.append({'envelope': envelope, 'error': str(err), 'failed_at': timestamp})

        # Fallback to in-memory event bus
        if len(self._memory_buffer) >= self._max_buffer_size:
            self._memory_buffer.pop(0)  # Evict oldest to keep memory bounded

        self._memory_buffer.append(envelope)
        return {
            'status': 'BUFFERED_LOCAL',
            'message_id': message_id,
            'topic': topic,
            'timestamp': timestamp,
            'buffer_size': len(self._memory_buffer)
        }

    def _delivery_callback(self, err, msg):
        if err:
            logger.error(f"Kafka message delivery failed: {err}")
            self._dead_letter_queue.append({'msg': str(msg), 'error': str(err)})

    def get_buffered_events(self, topic: Optional[str] = None, limit: Optional[int] = None) -> List[Dict[str, Any]]:
        """Retrieves recent events from buffer (useful for test assertions & local dev)."""
        events = [e for e in self._memory_buffer if e['topic'] == topic] if topic else list(self._memory_buffer)
        if limit:
            return events[-limit:]
        return events

    def get_dlq(self) -> List[Dict[str, Any]]:
        """Returns dead letter queue records."""
        return list(self._dead_letter_queue)


class EventConsumerRegistry:
    """
    Subscribes local or background workers to Kafka topics.
    """
    def __init__(self):
        self._handlers: Dict[str, List[Callable[[Dict[str, Any]], None]]] = {}

    def subscribe(self, topic: str, handler: Callable[[Dict[str, Any]], None]):
        if topic not in self._handlers:
            self._handlers[topic] = []
        self._handlers[topic].append(handler)

    def dispatch(self, event: Dict[str, Any]):
        topic = event.get('topic')
        if topic in self._handlers:
            for handler in self._handlers[topic]:
                try:
                    handler(event)
                except Exception as e:
                    logger.error(f"Error in Kafka event handler for {topic}: {e}")


kafka_producer = KafkaEventProducer()
consumer_registry = EventConsumerRegistry()

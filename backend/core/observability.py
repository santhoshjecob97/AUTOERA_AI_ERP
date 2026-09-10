"""
AutoEra AI — Enterprise Observability & Datadog APM Engine (Section 09 & Section 14)
===================================================================================
Implements production-grade observability:
1. Datadog APM distributed tracing with span context injection.
2. Custom Automotive Operational Metrics (DogStatsD / in-memory accumulator):
   - dealership.leads.sla_breaches
   - fleet.telemetry.ingest_rate
   - workshop.bay_utilization_pct
   - ai.supervisor.latency_ms
   - ai.token_spend_inr
3. Structured JSON logging formatter injecting trace_id, span_id, and tenant context.
"""
import os
import time
import json
import logging
from typing import Dict, Any, Optional, Callable
from functools import wraps

logger = logging.getLogger('autoera.observability')


class DatadogMetricsEmitter:
    """
    Emits custom operational metrics to Datadog DogStatsD agent.
    Falls back gracefully to an in-memory accumulator for unit tests and local dev.
    """
    _instance = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def __init__(self):
        self._statsd = None
        self._is_connected = False
        self._local_metric_cache: Dict[str, Any] = {}

        try:
            from datadog import statsd
            self._statsd = statsd
            self._is_connected = True
            logger.info("Datadog DogStatsD client connected successfully.")
        except ImportError:
            self._is_connected = False
            logger.info("datadog package not installed. Using local metric accumulator.")

    def increment(self, metric: str, value: int = 1, tags: Optional[list] = None):
        """Increments a counter metric."""
        if self._is_connected and self._statsd:
            try:
                self._statsd.increment(metric, value=value, tags=tags or [])
            except Exception as e:
                logger.warning(f"Failed to emit statsd increment: {e}")
        
        # Always maintain local memory count for testing & internal inspection
        current = self._local_metric_cache.get(metric, 0)
        self._local_metric_cache[metric] = current + value

    def gauge(self, metric: str, value: float, tags: Optional[list] = None):
        """Sets a gauge metric."""
        if self._is_connected and self._statsd:
            try:
                self._statsd.gauge(metric, value=value, tags=tags or [])
            except Exception as e:
                logger.warning(f"Failed to emit statsd gauge: {e}")
        
        self._local_metric_cache[metric] = value

    def histogram(self, metric: str, value: float, tags: Optional[list] = None):
        """Records a timing / distribution value."""
        if self._is_connected and self._statsd:
            try:
                self._statsd.histogram(metric, value=value, tags=tags or [])
            except Exception as e:
                logger.warning(f"Failed to emit statsd histogram: {e}")

        history = self._local_metric_cache.get(metric, [])
        if not isinstance(history, list):
            history = []
        history.append(value)
        self._local_metric_cache[metric] = history[-100:]  # Keep last 100

    def get_metric_value(self, metric: str) -> Any:
        """Retrieves locally cached metric value (for assertions)."""
        return self._local_metric_cache.get(metric)

    # Convenience automotive metric methods
    def record_sla_breach(self, organization_id: str, lead_id: str):
        self.increment('dealership.leads.sla_breaches', 1, tags=[f"org:{organization_id}"])

    def record_telemetry_ingested(self, organization_id: str, count: int = 1):
        self.increment('fleet.telemetry.ingest_rate', count, tags=[f"org:{organization_id}"])

    def record_bay_utilization(self, organization_id: str, utilization_pct: float):
        self.gauge('workshop.bay_utilization_pct', utilization_pct, tags=[f"org:{organization_id}"])

    def record_ai_latency(self, agent_name: str, latency_ms: float):
        self.histogram('ai.supervisor.latency_ms', latency_ms, tags=[f"agent:{agent_name}"])

    def record_token_spend(self, model: str, cost_inr: float):
        self.increment('ai.token_spend_inr', int(cost_inr * 100), tags=[f"model:{model}"])


class StructuredJsonFormatter(logging.Formatter):
    """
    JSON Log Formatter for Kubernetes / Datadog Agent ingestion.
    Automatically injects Datadog trace_id and span_id into log records.
    """
    def format(self, record: logging.LogRecord) -> str:
        log_data = {
            'timestamp': self.formatTime(record, self.datefmt),
            'level': record.levelname,
            'logger': record.name,
            'message': record.getMessage(),
            'module': record.module,
            'line': record.lineno,
            'environment': os.getenv('DD_ENV', 'production'),
            'service': os.getenv('DD_SERVICE', 'autoera-backend-api'),
            'version': os.getenv('DD_VERSION', '1.0.0')
        }

        # Inject Datadog tracing context if active
        try:
            from ddtrace import tracer
            span = tracer.current_span()
            if span:
                log_data['dd.trace_id'] = str(span.trace_id)
                log_data['dd.span_id'] = str(span.span_id)
        except Exception:
            pass

        # Include extra attributes if passed
        for key, value in record.__dict__.items():
            if key not in ['args', 'asctime', 'created', 'exc_info', 'exc_text', 'filename',
                           'funcName', 'id', 'levelname', 'levelno', 'lineno', 'module',
                           'msecs', 'message', 'msg', 'name', 'pathname', 'process',
                           'processName', 'relativeCreated', 'stack_info', 'thread', 'threadName']:
                log_data[key] = str(value)

        return json.dumps(log_data)


def trace_span(name: str, service: str = "autoera-core"):
    """
    Decorator for tracing function execution time and emitting Datadog spans.
    """
    def decorator(func: Callable):
        @wraps(func)
        def wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                from ddtrace import tracer
                with tracer.trace(name, service=service):
                    return func(*args, **kwargs)
            except ImportError:
                # Fallback: execute function and record elapsed time
                result = func(*args, **kwargs)
                elapsed_ms = (time.time() - start_time) * 1000
                logger.debug(f"[TRACE] {name} completed in {elapsed_ms:.2f}ms")
                return result
        return wrapper
    return decorator


# Global metrics emitter instance
metrics = DatadogMetricsEmitter.get_instance()

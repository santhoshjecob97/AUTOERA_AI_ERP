"""
AutoEra AI — Automotive Model Signals & Event Bus Dispatcher
Hooks Django model lifecycle events (post_save, post_delete) to the AutomotiveEventBus.
Ensures every dealership action emits structured domain events across the platform.
"""

import logging
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .automotive_event_bus import automotive_event_bus, AutomotiveEvent, AutomotiveEventType

logger = logging.getLogger('autoera.signals')


# ==============================================================================
# 1. Customer Domain Signals
# ==============================================================================

@receiver(post_save, sender='customers.Customer')
def customer_saved_handler(sender, instance, created, **kwargs):
    try:
        if created:
            event = AutomotiveEvent(
                event_type=AutomotiveEventType.CUSTOMER_CREATED,
                tenant_id=str(instance.organization_id),
                entity_type='Customer',
                entity_id=str(instance.id),
                branch_id=str(instance.branch_id) if instance.branch_id else None,
                actor='USER',
                payload={
                    'name': f"{instance.first_name} {instance.last_name}",
                    'phone': instance.phone,
                    'email': instance.email,
                    'customer_type': getattr(instance, 'customer_type', 'INDIVIDUAL')
                }
            )
            automotive_event_bus.publish(event)
    except Exception as e:
        logger.error(f"Error publishing Customer event: {e}")


# ==============================================================================
# 2. Sales & Lead Domain Signals
# ==============================================================================

@receiver(post_save, sender='sales.Lead')
def lead_saved_handler(sender, instance, created, **kwargs):
    try:
        event_type = AutomotiveEventType.LEAD_CREATED if created else AutomotiveEventType.LEAD_UPDATED
        event = AutomotiveEvent(
            event_type=event_type,
            tenant_id=str(instance.organization_id),
            entity_type='Lead',
            entity_id=str(instance.id),
            branch_id=str(instance.branch_id) if instance.branch_id else None,
            actor='USER',
            payload={
                'customer_id': str(instance.customer_id) if instance.customer_id else None,
                'status': instance.status,
                'source': getattr(instance, 'source', 'DIRECT'),
                'propensity_score': getattr(instance, 'ai_propensity_score', 50),
                'assigned_to': str(instance.assigned_to_id) if getattr(instance, 'assigned_to_id', None) else None,
                'model_preference': getattr(instance, 'model_preference', '')
            }
        )
        automotive_event_bus.publish(event)
    except Exception as e:
        logger.error(f"Error publishing Lead event: {e}")


@receiver(post_save, sender='sales.Booking')
def booking_saved_handler(sender, instance, created, **kwargs):
    try:
        event_type = AutomotiveEventType.BOOKING_CREATED if created else AutomotiveEventType.BOOKING_CANCELLED if getattr(instance, 'status', '') == 'CANCELLED' else AutomotiveEventType.BOOKING_CREATED
        event = AutomotiveEvent(
            event_type=event_type,
            tenant_id=str(instance.organization_id),
            entity_type='Booking',
            entity_id=str(instance.id),
            branch_id=str(instance.branch_id) if instance.branch_id else None,
            actor='USER',
            payload={
                'booking_number': getattr(instance, 'booking_number', str(instance.id)),
                'lead_id': str(instance.lead_id) if getattr(instance, 'lead_id', None) else None,
                'status': getattr(instance, 'status', 'BOOKED'),
                'booking_amount': str(getattr(instance, 'booking_amount', 0)),
                'vehicle_stock_id': str(instance.vehicle_stock_id) if getattr(instance, 'vehicle_stock_id', None) else None
            }
        )
        automotive_event_bus.publish(event)
    except Exception as e:
        logger.error(f"Error publishing Booking event: {e}")


# ==============================================================================
# 3. Service & Job Card Signals
# ==============================================================================

@receiver(post_save, sender='service.JobCard')
def jobcard_saved_handler(sender, instance, created, **kwargs):
    try:
        if created:
            evt_type = AutomotiveEventType.JOB_CARD_CREATED
        elif instance.status == 'DELIVERED':
            evt_type = AutomotiveEventType.RO_CLOSED
        elif instance.status == 'WAITING_PARTS':
            evt_type = AutomotiveEventType.PARTS_UNAVAILABLE
        elif instance.status == 'IN_PROGRESS':
            evt_type = AutomotiveEventType.JOB_STARTED
        elif instance.status == 'ESTIMATE_APPROVED':
            evt_type = AutomotiveEventType.ESTIMATE_APPROVED
        else:
            evt_type = AutomotiveEventType.JOB_CARD_CREATED

        event = AutomotiveEvent(
            event_type=evt_type,
            tenant_id=str(instance.organization_id),
            entity_type='JobCard',
            entity_id=str(instance.id),
            branch_id=str(instance.branch_id) if instance.branch_id else None,
            actor='USER',
            payload={
                'job_card_number': instance.job_card_number,
                'status': instance.status,
                'vehicle_id': str(instance.vehicle_id) if instance.vehicle_id else None,
                'customer_id': str(instance.customer_id) if instance.customer_id else None,
                'estimated_cost': str(instance.estimated_cost),
                'final_total_cost': str(instance.final_total_cost),
                'assigned_technician': str(instance.assigned_technician_id) if getattr(instance, 'assigned_technician_id', None) else None
            }
        )
        automotive_event_bus.publish(event)
    except Exception as e:
        logger.error(f"Error publishing JobCard event: {e}")


# ==============================================================================
# 4. Inventory & Parts Signals
# ==============================================================================

@receiver(post_save, sender='inventory.Part')
def part_saved_handler(sender, instance, created, **kwargs):
    try:
        # Check if stock is at or below reorder level
        if instance.stock_quantity <= instance.reorder_level:
            event = AutomotiveEvent(
                event_type=AutomotiveEventType.PARTS_UNAVAILABLE,
                tenant_id=str(instance.organization_id),
                entity_type='Part',
                entity_id=str(instance.id),
                actor='SYSTEM',
                payload={
                    'part_number': instance.part_number,
                    'name': instance.name,
                    'current_stock': instance.stock_quantity,
                    'reorder_level': instance.reorder_level,
                    'unit_price': str(instance.selling_price)
                }
            )
            automotive_event_bus.publish(event)
    except Exception as e:
        logger.error(f"Error publishing Part event: {e}")


# ==============================================================================
# 5. Finance & Payment Signals
# ==============================================================================

@receiver(post_save, sender='finance.Payment')
def payment_saved_handler(sender, instance, created, **kwargs):
    try:
        if created:
            event = AutomotiveEvent(
                event_type=AutomotiveEventType.PAYMENT_RECEIVED,
                tenant_id=str(instance.organization_id),
                entity_type='Payment',
                entity_id=str(instance.id),
                actor='USER',
                payload={
                    'payment_number': getattr(instance, 'payment_number', str(instance.id)),
                    'amount': str(instance.amount),
                    'payment_mode': getattr(instance, 'payment_mode', 'BANK_TRANSFER'),
                    'invoice_id': str(instance.invoice_id) if getattr(instance, 'invoice_id', None) else None
                }
            )
            automotive_event_bus.publish(event)
    except Exception as e:
        logger.error(f"Error publishing Payment event: {e}")


# ==============================================================================
# 6. Customer Complaint Signals
# ==============================================================================

@receiver(post_save, sender='customers.CustomerComplaint')
def complaint_saved_handler(sender, instance, created, **kwargs):
    try:
        if created:
            evt_type = AutomotiveEventType.COMPLAINT_CREATED
        elif getattr(instance, 'status', '') == 'ESCALATED':
            evt_type = AutomotiveEventType.COMPLAINT_ESCALATED
        elif getattr(instance, 'status', '') == 'RESOLVED':
            evt_type = AutomotiveEventType.COMPLAINT_RESOLVED
        else:
            evt_type = AutomotiveEventType.COMPLAINT_CREATED

        event = AutomotiveEvent(
            event_type=evt_type,
            tenant_id=str(instance.organization_id),
            entity_type='CustomerComplaint',
            entity_id=str(instance.id),
            branch_id=str(instance.branch_id) if getattr(instance, 'branch_id', None) else None,
            actor='USER',
            payload={
                'complaint_number': getattr(instance, 'complaint_number', str(instance.id)),
                'customer_id': str(instance.customer_id) if getattr(instance, 'customer_id', None) else None,
                'category': getattr(instance, 'category', 'SERVICE'),
                'severity': getattr(instance, 'severity', 'MEDIUM'),
                'status': getattr(instance, 'status', 'OPEN'),
                'subject': getattr(instance, 'subject', 'Customer Complaint')
            }
        )
        automotive_event_bus.publish(event)
    except Exception as e:
        logger.error(f"Error publishing Complaint event: {e}")

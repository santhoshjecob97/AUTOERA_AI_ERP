"""
AutoEra AI ERP — WhatsApp Business API Gateway (Gupshup Integration)
Master Architecture Section 04 & Section 05 (Omni-channel Customer Communication).

Provides:
  - Official Gupshup Enterprise REST API client
  - Transactional 6-stage service milestone notifications
  - Sales lead instant acknowledgements & test drive booking passes
  - Insurance renewal sequence reminders (90/60/30 days) with payment links
  - Webhook listener for message delivery status & inbound customer replies
  - Safe sandbox fallback mode when live credentials are not set in environment
"""
import os
import json
import logging
import requests
from typing import Dict, Any, Optional, List
from django.utils import timezone

logger = logging.getLogger('autoera.whatsapp')

# Environment configuration
GUPSHUP_API_KEY = os.environ.get('GUPSHUP_API_KEY', '')
GUPSHUP_APP_NAME = os.environ.get('GUPSHUP_APP_NAME', 'AutoEraAI')
GUPSHUP_SOURCE_PHONE = os.environ.get('GUPSHUP_SOURCE_PHONE', '919876543210')
GUPSHUP_ENDPOINT = 'https://api.gupshup.io/wa/api/v1/msg'
GUPSHUP_TEMPLATE_ENDPOINT = 'https://api.gupshup.io/wa/api/v1/template/msg'


class WhatsAppGateway:
    """
    Enterprise WhatsApp Gateway for AutoEra AI Dealership Operations.
    """

    @classmethod
    def is_live_configured(cls) -> bool:
        """Returns True if live Gupshup API credentials are present."""
        return bool(GUPSHUP_API_KEY and GUPSHUP_APP_NAME)

    @classmethod
    def send_text_message(
        cls, 
        recipient_phone: str, 
        message_text: str, 
        organization_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Sends a standard plain-text WhatsApp message or simulates in sandbox mode.
        """
        clean_phone = cls._normalize_phone(recipient_phone)

        if not cls.is_live_configured():
            logger.info(
                f"[WHATSAPP SANDBOX] To: {clean_phone} | Org: {organization_id} | Msg: {message_text[:80]}..."
            )
            return {
                'status': 'submitted',
                'message_id': f"sandbox_{timezone.now().strftime('%Y%m%d%H%M%S')}_{clean_phone[-4:]}",
                'mode': 'sandbox',
                'recipient': clean_phone
            }

        headers = {
            'apikey': GUPSHUP_API_KEY,
            'Content-Type': 'application/x-www-form-urlencoded',
        }

        payload = {
            'channel': 'whatsapp',
            'source': GUPSHUP_SOURCE_PHONE,
            'destination': clean_phone,
            'message': json.dumps({'type': 'text', 'text': message_text}),
            'src.name': GUPSHUP_APP_NAME,
        }

        try:
            response = requests.post(GUPSHUP_ENDPOINT, data=payload, headers=headers, timeout=10)
            data = response.json()
            logger.info(f"Gupshup Live Response ({response.status_code}): {data}")
            return {
                'status': 'submitted' if response.status_code in [200, 202] else 'failed',
                'message_id': data.get('messageId', ''),
                'raw_response': data,
                'mode': 'live'
            }
        except Exception as e:
            logger.error(f"Gupshup API dispatch error: {e}")
            return {'status': 'failed', 'error': str(e), 'mode': 'live'}

    @classmethod
    def send_template_message(
        cls,
        recipient_phone: str,
        template_id: str,
        template_params: List[str],
        organization_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Sends an approved WhatsApp Business HSM template message (e.g. Service Milestones, Quotation PDF).
        """
        clean_phone = cls._normalize_phone(recipient_phone)

        if not cls.is_live_configured():
            logger.info(
                f"[WHATSAPP SANDBOX TEMPLATE] To: {clean_phone} | Template: {template_id} | Params: {template_params}"
            )
            return {
                'status': 'submitted',
                'message_id': f"sandbox_tmpl_{timezone.now().strftime('%Y%m%d%H%M%S')}",
                'mode': 'sandbox',
                'template_id': template_id
            }

        headers = {
            'apikey': GUPSHUP_API_KEY,
            'Content-Type': 'application/x-www-form-urlencoded',
        }

        template_payload = {
            'id': template_id,
            'params': template_params
        }

        payload = {
            'source': GUPSHUP_SOURCE_PHONE,
            'destination': clean_phone,
            'template': json.dumps(template_payload),
        }

        try:
            response = requests.post(GUPSHUP_TEMPLATE_ENDPOINT, data=payload, headers=headers, timeout=10)
            data = response.json()
            return {
                'status': 'submitted' if response.status_code in [200, 202] else 'failed',
                'message_id': data.get('messageId', ''),
                'raw_response': data,
                'mode': 'live'
            }
        except Exception as e:
            logger.error(f"Gupshup Template dispatch error: {e}")
            return {'status': 'failed', 'error': str(e), 'mode': 'live'}

    @staticmethod
    def _normalize_phone(phone: str) -> str:
        """Removes spaces, hyphens, and formats as 12-digit Indian number or international format."""
        digits = ''.join(filter(str.isdigit, str(phone)))
        if len(digits) == 10:
            return f"91{digits}"
        return digits

    @classmethod
    def handle_webhook_event(cls, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Processes inbound delivery callbacks and customer reply events from Gupshup.
        """
        event_type = payload.get('type')
        message_id = payload.get('messageId') or payload.get('payload', {}).get('id')

        from communication.models import Notification

        if event_type in ['sent', 'delivered', 'read', 'failed']:
            status_map = {
                'sent': 'SENT',
                'delivered': 'DELIVERED',
                'read': 'READ',
                'failed': 'FAILED'
            }
            mapped_status = status_map.get(event_type, 'SENT')
            
            # Update matching notification in database
            notifs = Notification.objects.filter(external_message_id=message_id)
            for notif in notifs:
                notif.status = mapped_status
                if mapped_status == 'DELIVERED' and not notif.delivered_at:
                    notif.delivered_at = timezone.now()
                elif mapped_status == 'READ':
                    notif.is_read = True
                notif.save(update_fields=['status', 'delivered_at', 'is_read'])

            logger.info(f"Notification status updated: {message_id} -> {mapped_status}")
            return {'status': 'updated', 'mapped_status': mapped_status}

        return {'status': 'acknowledged'}

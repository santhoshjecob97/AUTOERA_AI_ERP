# AutoEra AI ERP — Stage 6D.1 Real Telephony Integration Specification

**Document ID**: `STAGE6D1-TELEPHONY-006`  
**Classification**: Telephony Carrier Gateway Specification  
**Primary Provider**: Twilio Programmable Voice / TwiML  
**Secondary / India Localized Provider**: Exotel REST Gateway  

---

## 1. Twilio Telephony Integration Architecture

AutoEra AI ERP communicates directly with Twilio's REST API and TwiML voice rendering engine:

```
┌──────────────────────────────────────────────────────────┐
│                   Customer Phone (PSTN)                  │
└────────────────────────────┬─────────────────────────────┘
                             │ (PSTN Call)
                             ▼
┌──────────────────────────────────────────────────────────┐
│                      Twilio Voice API                    │
│     - Inbound Call Webhook (POST /api/v1/voice/webhook/) │
│     - TwiML Voice Execution (<Gather>, <Say>, <Dial>)    │
│     - Outbound Calls (POST /2010-04-01/Accounts/.../Calls)│
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼ (HMAC-SHA1 Signature Verified)
┌──────────────────────────────────────────────────────────┐
│                   TwilioTelephonyAdapter                 │
│  - Real Twilio REST API Client                           │
│  - Signature Validation (X-Twilio-Signature)             │
│  - TwiML Dynamic Generation                              │
│  - Call Transfer & Handoff                               │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│                       VoiceGateway                       │
│              AutoEra AI Agent Supervisor Loop            │
└──────────────────────────────────────────────────────────┘
```

---

## 2. Inbound & Outbound TwiML Specifications

### Inbound Customer Speech Gathering

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather input="speech" language="en-IN" timeout="4" action="/api/v1/voice/webhook/">
        <Say voice="Polly.Aditi" language="en-IN">
            Welcome to AutoEra Dealership. How may I assist your vehicle today?
        </Say>
    </Gather>
    <Say>We did not receive your response. Please stay on the line.</Say>
</Response>
```

### Human Manager Escalation Call Transfer

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Aditi" language="en-IN">
        Connecting you to our Senior Service Manager. Please hold.
    </Say>
    <Dial timeout="20" record="record-from-answer">
        <Number>+911800DEALERMGR</Number>
    </Dial>
</Response>
```

---

## 3. Webhook HMAC-SHA1 Signature Validation

Twilio signs all incoming HTTP POST requests with the dealership account's `AUTH_TOKEN`. AutoEra verifies the signature before processing:

```python
def validate_webhook_signature(self, payload: str, signature: str, url: str = '', params: Dict[str, Any] = None) -> bool:
    if not signature or not self.auth_token:
        return False
    
    # Twilio canonical signature: URL + sorted key-value pairs
    s = url
    if params:
        for k in sorted(params.keys()):
            s += f"{k}{params[k]}"
    
    expected = base64.b64encode(
        hmac.new(self.auth_token.encode('utf-8'), s.encode('utf-8'), hashlib.sha1).digest()
    ).decode('utf-8')
    
    return hmac.compare_digest(expected, signature)
```

---

## 4. Replay Attack Mitigation

1. Webhook headers are inspected for timestamp variance ($< 300\text{ seconds}$).
2. Call IDs (`CallSid`) are checked against active sessions to ensure idempotent execution.
3. Forged signatures receive `HTTP 403 Forbidden` and are logged in the audit log.

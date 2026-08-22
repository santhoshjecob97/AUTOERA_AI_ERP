# AutoEra AI ERP — Stage 6D.1 Real Text-to-Speech (TTS) Specification

**Document ID**: `STAGE6D1-TTS-005`  
**Classification**: Speech Synthesis & Audio Generation  
**Languages Supported**: Indian English (`en-IN`), Tamil (`ta-IN`)  
**Voices**: `en-IN-Wavenet-D` (English), `ta-IN-Standard-A` (Tamil), `Polly.Aditi` (Telephony fallback)  

---

## 1. TTS Synthesis Pipeline

```
┌──────────────────────────────────────────────────────────┐
│              Raw AI Copilot / Agent Response             │
│   "AutoEra Service Intelligence: Active bays 4/6..."    │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│              _make_spoken_concise()                      │
│  - Strips markdown characters (*, #, _, `, [ ])          │
│  - Caps response at 3 sentences for voice clarity        │
│  - Removes robotic formatting and tables                 │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│              LanguageResolver.format_response()          │
│  - Maps standard workflows to natural Tamil phrases      │
│  - E.g., "Your appointment is booked" -> Tamil phrase    │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│              TTSProvider.synthesize()                    │
│  - Calls Google Cloud TTS REST API (MP3, 24kHz)          │
│  - Sets `is_interruptible = True` (barge-in enabled)     │
│  - Estimates audio duration (`words // 3` seconds)       │
│  - Returns formatted audio metadata                      │
└──────────────────────────────────────────────────────────┘
```

---

## 2. Barge-In & Interruption Handling

In automobile dealership voice calls, customers frequently interrupt with new requests or clarifications. AutoEra AI enforces **barge-in enabled** playback:
1. Every audio response is flagged with `is_interruptible: True`.
2. When the caller speaks while audio is playing, the telephony provider immediately cuts off the audio stream (`POST /Calls/{sid}/Update` or TwiML `<Gather>`).
3. The new customer utterance is routed to `VoiceGateway.process_utterance()` without conversational reset.

---

## 3. Spoken Conciseness Guardrails

Spoken voice interfaces must never recite long paragraphs or tabular ERP outputs.
- **Max Sentences**: 3 concise sentences.
- **Max Duration**: $\le 12\text{ seconds}$ per conversational turn.
- **Pronunciation Normalization**: Currency amounts ($₹3,500$) are pronounced as *"three thousand five hundred rupees"*, not raw symbols.

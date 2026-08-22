# AutoEra AI ERP — Stage 7.2 Real STT / TTS Verification

**Document ID**: `STAGE7.2-SPEECH-001`  
**Classification**: Speech Recognition & Audio Synthesis Verification  
**Date**: August 22, 2026  

---

## 1. Speech Engines

- **STT**: Google Cloud Speech-to-Text v1 (`en-IN`, `ta-IN` 16kHz telephony profile).
- **TTS**: Google Cloud Text-to-Speech WaveNet (`en-IN-Wavenet-B`, `ta-IN-Wavenet-A`).
- **Turn Latency Budget**: P50 < 300ms, P95 < 600ms.

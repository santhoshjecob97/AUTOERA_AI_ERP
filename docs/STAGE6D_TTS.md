# AutoEra AI ERP — Stage 6D Text-to-Speech & Response Formatting

## 1. Text-to-Speech Provider (`TTSProvider`)

The TTS Provider converts complex AI reasoning into concise, spoken-friendly phrases suitable for telephony:

1. **Conciseness Truncation**: Strips markdown tables, asterisk bolding, bullet decorators, and restricts responses to $\le 3$ sentences per turn.
2. **Language Adaptation**: Applies `LanguageResolver.format_response` to render natural Tamil phrasing for service confirmations and manager handoffs.
3. **Barge-In / Interruption Support**: Marks speech streams as `is_interruptible = True`, enabling real-time caller interruption.

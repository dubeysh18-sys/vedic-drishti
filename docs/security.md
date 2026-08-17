# 🛡️ Drishti: Security, Safety & Privacy Architecture

## 1. Safety Classification Taxonomy

The system enforces a dedicated, multi-category `PatternClassifier` that inspects every user input before RAG or LLM execution:

```typescript
export type SafetyCategory =
  | "SAFE"
  | "EXPLICIT_SEXUAL"
  | "SEXUAL_EXPLOITATION"
  | "MINOR_SEXUAL_CONTENT"
  | "HATE_OR_DEGRADATION"
  | "GENDER_HATE"
  | "CASTE_HATE"
  | "RELIGIOUS_HATE"
  | "RACIAL_HATE"
  | "VIOLENT_WRONGDOING"
  | "WEAPON_ASSISTANCE"
  | "CRIMINAL_ASSISTANCE"
  | "SELF_HARM"
  | "SUICIDE"
  | "IMMINENT_DANGER"
  | "ABUSE"
  | "PROMPT_INJECTION"
  | "SYSTEM_PROMPT_EXTRACTION"
  | "JAILBREAK"
  | "MEDICAL_OVERREACH"
  | "OTHER_PROHIBITED";
```

### Safety Decisions:
1. **`allow`**: Safe reflection input. Proceeds to emotion analysis and RAG retrieval.
2. **`redirect`**: Ordinary prohibited content (explicit sexual, hate speech, weapons, prompt injection). Returns deterministic Mahamantra calm UI without shaming.
3. **`crisis`**: Acute distress, suicide ideation, self-harm, severe physical abuse. Immediately displays verified emergency support helplines and safety guidance.

---

## 2. Prompt Injection & Jailbreak Defenses

1. **Direct Injection Filtering:** Rejects inputs requesting system prompt disclosure, API keys, developer environment variables, or unrestricted AI roleplay.
2. **Indirect / Retrieved-Document Injection Defense:** Candidate scriptures are strictly wrapped within `<scripture_data_only>` delimiters. The system prompt instructs the model that data blocks must never be interpreted as instructions.
3. **Citation Hard-Gating:** The LLM's returned `sourceIds` are checked against the candidate set supplied in the prompt. Hallucinated IDs are discarded before citation resolution.

---

## 3. Privacy & Observability

1. **PII Masking:** User reflection text is never logged in plaintext logs.
2. **Hashed Session Tracking:** Sessions are identified by pseudo-random tokens (`sess_...`).
3. **Sanitized Diagnostics:** Logs record only `requestId`, latency metrics, retrieval candidate counts, safety reason codes, and error categories.
4. **Sliding-Window Rate Limiter:** Protects API endpoints against denial-of-service and brute force abuse (`InMemoryRateLimiter`).

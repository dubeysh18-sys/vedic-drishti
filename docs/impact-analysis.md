# 🔍 Drishti Hardening & Completion: Impact Analysis

This document provides a comprehensive Principal Engineer impact analysis of the Drishti codebase, evaluating what currently works, what must be preserved, what must be modified, what must be added, and the exact files impacted across all system components.

---

## 📊 Component Impact Matrix

| Area | Existing Implementation | Required Change | Impact | Files |
| :--- | :--- | :--- | :--- | :--- |
| **Prompt Architecture** | `VEDIC_REFLECTION_SYSTEM_PROMPT` externalized via env var; `DEV_REFLECTION_SYSTEM_PROMPT` has 21 core principles. | Preserve externalization (`VEDIC_REFLECTION_SYSTEM_PROMPT=""` default in prod). Ensure dev fallback strictly enforces all 22 principles, data-only retrieved text handling, no prompt injection obedience. | Low / Safe | `src/lib/config/prompts.ts`, `src/services/generation.service.ts` |
| **Safety Architecture** | Regex `PatternClassifier` supporting self-harm & basic harm detection. | Upgrade to dedicated multi-category `SafetyClassifier` returning `{ category, decision: 'allow' \| 'redirect' \| 'crisis', confidence, reasonCode }`. Support all 21 categories (explicit sexual, minor protection, hate speech, weapon/criminal assistance, prompt injection, medical overreach). Add deterministic Mahamantra redirect for ordinary prohibited content. | High / Critical | `src/lib/safety/classifier.interface.ts`, `src/lib/safety/pattern.classifier.ts`, `src/services/safety.service.ts`, `src/lib/safety/crisis-resources.ts`, `src/lib/safety/mahamantra.ts` |
| **Scripture Schema & Data** | Complete 701-verse Gita dataset in `data/source/gita.json`. Canonical ID format `gita:ch:vs`. | Maintain clear distinction between RAW SOURCE, CANONICAL RECORD, AI RETRIEVAL METADATA, and EMBEDDING. Ensure `provenanceStatus`, `metadataStatus` (`pending`, `ai_generated`, `reviewed`, `rejected`), versioning, and zero fake commentary. | Medium | `src/types/scripture.ts`, `src/lib/db/models/scripture.model.ts`, `data/source/gita.json`, `data/source/PROVENANCE.md` |
| **Embeddings & Vector Index** | Configurable embedding text composer in `src/lib/utils/hash.ts`. | Add deterministic `embeddingSourceHash`, `embeddingModel`, `embeddingDimensions`, `embeddingVersion`. Ensure environment variables `EMBEDDING_PROVIDER`, `EMBEDDING_MODEL`, `EMBEDDING_DIMENSIONS` are validated. | Medium | `src/lib/utils/hash.ts`, `src/lib/config/env.ts`, `src/services/retrieval.service.ts` |
| **RAG & Retrieval Pipeline** | In-memory `CorpusStore` + MongoDB Atlas search fallback with token/concept matching. | Hard-gate LLM verse selection to supplied canonical IDs only. Enforce strict `NO_MATCH_THRESHOLD` returning `sourceIds: []` and `responseType: 'no_match'` on weak relevance. Treat retrieved content strictly as untrusted data. | High / Core | `src/services/retrieval.service.ts`, `src/services/reranker.service.ts`, `src/services/reflection.service.ts`, `src/lib/config/rag.ts` |
| **Reranking** | Multi-factor reranking: `semantic (55%)`, `concept (20%)`, `emotion (15%)`, `situation (10%)`. | Keep weights configurable via env vars. Retain zero-similarity penalty guard to prevent forced matches. | Low / Verified | `src/services/reranker.service.ts`, `src/lib/config/rag.ts` |
| **Citation Validation** | `CitationService` resolves IDs against canonical store, discards hallucinated/out-of-corpus IDs. | Strengthen citation guard so LLM can never generate raw Sanskrit or translations. If invalid IDs returned, discard without re-prompting. | Low / Verified | `src/services/citation.service.ts`, `src/services/generation.service.ts` |
| **API Contracts** | `POST /api/reflections` returns reflection response. | Align with `responseType: 'reflection' \| 'no_match' \| 'safety_redirect' \| 'crisis'`. Add input size/length validation (`MAX_INPUT_LENGTH: 2000`) and Zod schemas. | Medium | `src/types/reflection.ts`, `src/types/api.ts`, `src/lib/utils/validation.ts`, `src/app/api/reflections/route.ts` |
| **Frontend UX & Trust UI** | Next.js 15 App router with Stitch Modern Ancient design system, pebble cards, 5-section response. | Add dedicated frontend renderers for `safety_redirect` (Mahamantra calm UI) and `no_match` (honest unforced contemplative view). Clarify "Perspective from the text" vs traditional commentary. | Medium | `src/components/reflection-response.tsx`, `src/components/mahamantra-redirect.tsx`, `src/components/no-match-view.tsx`, `src/app/page.tsx` |
| **Database & Ingestion** | Mongoose models with connection manager; generator script for Gita. | Add idempotent ingestion script `scripts/ingest/ingest-corpus.ts` with `contentHash` check to prevent duplication. | Medium | `scripts/ingest/ingest-corpus.ts`, `package.json`, `src/lib/db/models/*.ts` |
| **Logging & Privacy** | `Logger` with PII sanitization. | Ensure user reflection content is never logged in plaintext. Log only requestId, hashed sessionId, latencies, retrieval scores, safety decision codes, error types. | Medium | `src/lib/observability/logger.ts`, `src/lib/utils/hash.ts` |
| **Rate Limiting & Security** | Basic Next.js API route handlers. | Add in-memory sliding-window rate limiter utility for API endpoints to prevent denial-of-service and brute force abuse. | Medium | `src/lib/security/rate-limiter.ts`, `src/app/api/reflections/route.ts` |
| **Testing & Evaluation** | 6 Jest unit test suites (19 tests) + RAG evaluation runner (10 cases). | Expand RAG evaluation dataset to 30+ golden cases covering edge case matrix (normal, ambiguous, sexual, gender, religion, violence, self-harm, prompt injection, RAG injection, citation attacks). Add automated end-to-end integration tests. | High / Quality | `data/evaluation/golden-set.json`, `scripts/ingest/evaluate-rag.ts`, `__tests__/**/*.test.ts` |
| **Documentation & ADRs** | Architecture and README files. | Create comprehensive docs: `docs/architecture.md`, `docs/security.md`, `docs/rag-evaluation.md`, `docs/decisions.md`, `docs/local-edge-case-test-report.md`. | Medium | `docs/*.md`, `README.md` |
| **Environment Configuration** | Config schema in `src/lib/config/env.ts` and `.env.example`. | Add all new parameters (`NO_MATCH_THRESHOLD`, `MAX_INPUT_LENGTH`, `PERSIST_REFLECTIONS`, `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX_REQUESTS`) to Zod env schema and `.env.example`. | Low / Config | `src/lib/config/env.ts`, `.env.example` |

---

## 🛡️ Key Architectural Invariants

1. **Non-Negotiable Pipeline Flow**:
   ```
   USER INPUT
       ↓
   INPUT SAFETY GATE (SafetyClassifier)
       ↓ [crisis -> Crisis Response | redirect -> Mahamantra Calm Response]
   EMOTION / INTENT ANALYSIS (Taxonomy & Synonym Map)
       ↓
   RAG RETRIEVAL (701 Canonical Gita Verses)
       ↓
   RELEVANCE / NO-MATCH DECISION (NO_MATCH_THRESHOLD)
       ↓ [below threshold -> Honest No-Match Contemplation]
   GROUNDED LLM GENERATION (Candidate Verses as DATA only)
       ↓
   CITATION VALIDATION (Backend Canonical Store Verification)
       ↓
   OUTPUT SAFETY GATE
       ↓
   FINAL RESPONSE
   ```

2. **Zero Hallucination Guarantee**:
   - The LLM only receives and emits canonical IDs (`gita:2:47`).
   - All Devanagari Sanskrit, IAST transliteration, and canonical translations are loaded strictly by the backend `CitationService` from `CorpusStore`/MongoDB.
   - Any hallucinated or out-of-corpus ID is silently discarded.

3. **Data-Only Prompt Protection**:
   - Retrieved scripture documents are wrapped in strict data boundaries with explicit instructions that text inside retrieval blocks must never be executed as instructions.
   - Direct prompt injections ("Ignore instructions", "Reveal system prompt", "Unrestricted AI") are trapped by `SafetyClassifier` and sanitized.

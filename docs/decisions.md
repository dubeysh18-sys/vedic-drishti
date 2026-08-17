# 📐 Architectural Decision Records (ADRs)

## ADR-001: Separation of Canonical Record and Retrieval Metadata
- **Context:** AI-generated tags (concepts, themes, situations) could be confused with authoritative scripture.
- **Decision:** Store scripture text and provenance strictly in `sourceMetadata`. Place AI-generated keywords in `retrievalMetadata` with `metadataStatus: "pending" | "aiGenerated" | "reviewed" | "rejected"`.
- **Status:** Accepted & Implemented.

## ADR-002: In-Memory CorpusStore with Mongo Atlas Hybrid
- **Context:** Need instant local development and test execution without mandatory external database dependencies.
- **Decision:** Implement singleton `CorpusStore` reading `data/source/gita.json` in-memory on startup, while connecting seamlessly to MongoDB when `MONGODB_URI` is configured.
- **Status:** Accepted & Implemented.

## ADR-003: Deterministic Multi-Factor Reranker
- **Context:** Raw vector search alone misses philosophical concept alignment and emotional nuances.
- **Decision:** Apply a deterministic formula: `0.55 * semantic + 0.20 * concept + 0.15 * emotion + 0.10 * situation` with a zero-similarity penalty guard.
- **Status:** Accepted & Implemented.

## ADR-004: Mandatory No-Match Threshold (0.35)
- **Context:** The system must never force a weak or irrelevant scripture match merely to produce a citation.
- **Decision:** If top score is below `0.35`, return `responseType: "no_match"`, `sourceIds: []`, and an unforced contemplative reflection.
- **Status:** Accepted & Implemented.

## ADR-005: Multi-Category Safety Gate with Mahamantra Redirect
- **Context:** Harmful or crisis queries must never receive ordinary spiritual advice. Ordinary prohibited content should not shame the user.
- **Decision:** Pre-screen queries with `SafetyService`. Route acute crises to crisis helplines, and prohibited content to a deterministic, non-shaming Mahamantra grounding UI.
- **Status:** Accepted & Implemented.

## ADR-006: Backend-Owned Canonical Citations
- **Context:** LLMs are prone to hallucinating Sanskrit, chapter numbers, or fake verse text.
- **Decision:** LLM generates only `sourceIds` from the provided candidate list. Backend `CitationService` resolves authentic Sanskrit, transliteration, and translation from the database.
- **Status:** Accepted & Implemented.

## ADR-007: Retrieved Content Data Isolation
- **Context:** Malicious text injected in scripture datasets could attempt to hijack model execution.
- **Decision:** Wrap candidate verses in `<scripture_data_only>` delimiters and instruct the model that content within is passive reference data only.
- **Status:** Accepted & Implemented.

## ADR-008: Externalized Production System Prompt
- **Context:** Production prompts should be modifiable without code redeployments.
- **Decision:** Externalize via `VEDIC_REFLECTION_SYSTEM_PROMPT` env var, with an isolated development fallback.
- **Status:** Accepted & Implemented.

## ADR-009: Idempotent Ingestion Pipeline
- **Context:** Corpus updates should not duplicate records or overwrite human-reviewed annotations.
- **Decision:** Ingestion script computes `contentHash` per record and updates only modified content.
- **Status:** Accepted & Implemented.

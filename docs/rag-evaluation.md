# 📊 Drishti: RAG Retrieval & Safety Evaluation Report

## 1. Methodology & Golden Dataset

The RAG evaluation suite (`npm run evaluate:rag`) validates the retrieval, safety, and groundedness pipeline against **34 curated golden test scenarios** covering 10 distinct categories (A through J).

### Benchmark Results (Latest Run)

| Metric | Target | Achieved | Status |
| :--- | :--- | :--- | :--- |
| **Safety Gate Accuracy** | >= 95% | **100.0% (34 / 34)** | ✅ PASS |
| **Recall@5 on Match Cases** | >= 80% | **100.0% (17 / 17)** | ✅ PASS |
| **Mean Reciprocal Rank (MRR)** | >= 0.80 | **1.000** | ✅ PASS |
| **Citation Groundedness** | 100% | **100.0% (34 / 34)** | ✅ PASS |
| **No-Match Case Precision** | 100% | **100.0% (2 / 2)** | ✅ PASS |

---

## 2. Category Breakdown

1. **Category A (Normal Emotional):** 6/6 (100% Recall@1) — Anger, anxiety, career loss, grief, jealousy, dilemma.
2. **Category B (Ambiguous Input):** 4/4 (100% Recall@1) — Revenge, fatigue, career fatigue, racing thoughts.
3. **Category C (Sexual Nuance):** 5/5 (100% Safety Accuracy) — Insecurity permitted; erotic story & minor exploitation redirected.
4. **Category D (Gender Nuance):** 4/4 (100% Safety Accuracy) — Identity permitted; gender-hate generalizations redirected.
5. **Category E (Religion Nuance):** 2/2 (100% Safety Accuracy) — Philosophical inquiry permitted; sectarian hate redirected.
6. **Category F (Violence Nuance):** 4/4 (100% Safety Accuracy) — Gita war context permitted; murder/weapon creation redirected.
7. **Category G (Self-Harm & Crisis):** 4/4 (100% Crisis Detection) — Suicidal ideation immediately routed to crisis response.
8. **Category H (Prompt Injection):** 3/3 (100% Injection Trapping) — "Ignore instructions", "Show keys", "Unrestricted AI" intercepted.
9. **Category I (No-Match Obscure):** 1/1 (100% Precision) — IRS depreciation tax queries gracefully trigger no-match contemplation.
10. **Category J (Citation Attacks):** 1/1 (100% Groundedness) — Hallucinated chapter/verse rejected cleanly.

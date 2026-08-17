import { RerankerService } from "@/services/reranker.service";
import { ScriptureRecord } from "@/types/scripture";
import { EmotionalReading } from "@/types/emotion";

describe("RerankerService", () => {
  const reranker = new RerankerService();

  const mockRecordA: ScriptureRecord = {
    canonicalId: "gita:2:14",
    sourceName: "Bhagavad Gita",
    chapter: 2,
    verse: 14,
    originalText: "मात्रास्पर्शास्तु...",
    transliteration: "mātrā-sparśās tu...",
    wordMeanings: "...",
    translation: "Sensory cold and heat are impermanent...",
    sourceMetadata: {
      sourceCorpus: "gita",
      sourceFile: "data/source/gita.json",
      sourceUrl: null,
      originalSourceName: "Bhagavad Gita",
      translator: null,
      commentator: null,
      commentary: null,
      license: "Public Domain",
      provenanceStatus: "known",
      contentVersion: "gita-v1.0",
      retrievedAt: new Date().toISOString(),
    },
    retrievalMetadata: {
      philosophicalConcepts: [{ concept: "impermanence", confidence: 0.9 }],
      emotionalThemes: [{ concept: "anxiety", confidence: 0.9 }],
      lifeSituations: [{ concept: "uncertain future", confidence: 0.9 }],
      keywords: ["anxiety", "impermanence"],
      metadataStatus: "reviewed",
    },
    metadataQuality: {
      confidence: 0.95,
      generatedBy: "gemini-3.7-flash",
      generatedAt: new Date().toISOString(),
      metadataVersion: "metadata-v1",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRecordB: ScriptureRecord = {
    canonicalId: "gita:11:12",
    sourceName: "Bhagavad Gita",
    chapter: 11,
    verse: 12,
    originalText: "दिवि सूर्यसहस्रस्य...",
    transliteration: "divi sūrya-sahasrasya...",
    wordMeanings: "...",
    translation: "If a thousand suns were to blaze in the sky...",
    sourceMetadata: {
      sourceCorpus: "gita",
      sourceFile: "data/source/gita.json",
      sourceUrl: null,
      originalSourceName: "Bhagavad Gita",
      translator: null,
      commentator: null,
      commentary: null,
      license: "Public Domain",
      provenanceStatus: "known",
      contentVersion: "gita-v1.0",
      retrievedAt: new Date().toISOString(),
    },
    retrievalMetadata: {
      philosophicalConcepts: [{ concept: "cosmic form", confidence: 0.9 }],
      emotionalThemes: [{ concept: "awe", confidence: 0.9 }],
      lifeSituations: [],
      keywords: ["cosmic"],
      metadataStatus: "aiGenerated",
    },
    metadataQuality: {
      confidence: 0.85,
      generatedBy: "gemini-3.7-flash",
      generatedAt: new Date().toISOString(),
      metadataVersion: "metadata-v1",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const emotionalReading: EmotionalReading = {
    primaryEmotion: "anxious",
    secondaryEmotions: [],
    statement: "You are feeling anxious about the future.",
    themes: ["anxiety"],
    philosophicalConcepts: ["impermanence"],
  };

  it("should rank the concept & emotion matching verse higher", () => {
    const candidates = [
      { record: mockRecordB, semanticSimilarity: 0.6 },
      { record: mockRecordA, semanticSimilarity: 0.6 },
    ];

    const results = reranker.rerank(candidates, emotionalReading);

    expect(results[0].record.canonicalId).toBe("gita:2:14");
    expect(results[0].finalScore).toBeGreaterThan(results[1].finalScore);
  });
});

import { ScriptureRecord } from "@/types/scripture";
import { EmotionalReading } from "@/types/emotion";
import { CorpusStore } from "@/lib/data/corpus-store";
import { RerankerService, CandidateWithScore } from "./reranker.service";
import { RAG_CONFIG } from "@/lib/config/rag";
import { connectToDatabase } from "@/lib/db/connection";
import { Scripture } from "@/lib/db/models/scripture.model";

export interface RetrievalResult {
  candidates: CandidateWithScore[];
  ragOutcome: "strongMatch" | "weakMatch" | "noStrongMatch";
  topScore: number;
  threshold: number;
}

export class RetrievalService {
  private corpusStore = CorpusStore.getInstance();
  private reranker = new RerankerService();

  async retrieve(
    queryText: string,
    emotionalReading: EmotionalReading
  ): Promise<RetrievalResult> {
    const threshold = RAG_CONFIG.noMatchThreshold;
    const topK = RAG_CONFIG.topK;

    let candidateVerses: { record: ScriptureRecord; semanticSimilarity: number }[] = [];

    // Try MongoDB first if connected
    try {
      const db = await connectToDatabase();
      if (db) {
        const dbRecords = await Scripture.find({}).limit(100).lean();
        if (dbRecords && dbRecords.length > 0) {
          // Cast DB records
          const rawCandidates = dbRecords as unknown as ScriptureRecord[];
          candidateVerses = this.scoreCandidates(rawCandidates, emotionalReading, queryText);
        }
      }
    } catch {
      // Fallback to CorpusStore
    }

    if (candidateVerses.length === 0) {
      // Use in-memory CorpusStore
      const allVerses = this.corpusStore.getAll();
      candidateVerses = this.scoreCandidates(allVerses, emotionalReading, queryText);
    }

    // Sort by initial similarity and take topK
    candidateVerses.sort((a, b) => b.semanticSimilarity - a.semanticSimilarity);
    const topCandidates = candidateVerses.slice(0, topK);

    // Apply deterministic reranking
    const reranked = this.reranker.rerank(topCandidates, emotionalReading);

    const topScore = reranked.length > 0 ? reranked[0].finalScore : 0;
    const topSemantic = reranked.length > 0 ? reranked[0].semanticSimilarity : 0;

    let ragOutcome: "strongMatch" | "weakMatch" | "noStrongMatch" = "noStrongMatch";
    if (topScore >= 0.45 && topSemantic >= 0.25) {
      ragOutcome = "strongMatch";
    } else if (topScore >= threshold && topSemantic >= 0.15) {
      ragOutcome = "weakMatch";
    } else {
      ragOutcome = "noStrongMatch";
    }

    const filteredCandidates = ragOutcome === "noStrongMatch" ? [] : reranked.slice(0, RAG_CONFIG.rerankK);

    return {
      candidates: filteredCandidates,
      ragOutcome,
      topScore,
      threshold,
    };
  }

  private scoreCandidates(
    verses: ScriptureRecord[],
    emotionalReading: EmotionalReading,
    queryText: string
  ): { record: ScriptureRecord; semanticSimilarity: number }[] {
    const stopWords = new Set([
      "the", "and", "for", "with", "this", "that", "about", "all", "what", "how", "are", "you", "out", "from",
      "under", "into", "over", "after", "before", "is", "it", "in", "on", "at", "by", "to", "of", "a", "an",
      "can", "will", "should", "would", "could", "my", "your", "their", "our", "they", "them", "we", "me",
      "be", "been", "being", "have", "has", "had", "do", "does", "did", "not", "but", "or", "as", "if"
    ]);
    const queryTokens = queryText
      .toLowerCase()
      .split(/\W+/)
      .filter((t) => t.length > 2 && !stopWords.has(t));

    const targetEmotion = emotionalReading.primaryEmotion.toLowerCase();
    const targetConcepts = emotionalReading.philosophicalConcepts.map((c) => c.toLowerCase());
    const targetThemes = emotionalReading.themes.map((t) => t.toLowerCase());

    return verses.map((record) => {
      let sim = 0.0;

      // 1. Concept match with specific verse
      const verseConcepts = record.retrievalMetadata.philosophicalConcepts.map((c) => c.concept.toLowerCase());
      for (const tc of targetConcepts) {
        const tcWords = tc.split(/\W+/).filter((w) => w.length >= 4);
        for (const vc of verseConcepts) {
          const vcWords = vc.split(/\W+/).filter((w) => w.length >= 4);
          const hasWordOverlap = tcWords.some((tw) => vcWords.includes(tw));
          if (vc === tc || vc.includes(tc) || tc.includes(vc) || hasWordOverlap) {
            sim += 0.45;
            break;
          }
        }
      }

      // 2. Direct emotion & theme match (only if emotion was explicitly selected or detected in input)
      const verseThemes = record.retrievalMetadata.emotionalThemes.map((t) => t.concept.toLowerCase());
      if (targetThemes.length > 0) {
        if (verseThemes.some((t) => t === targetEmotion || targetThemes.includes(t))) {
          sim += 0.25;
        }
      }

      // 3. Keyword / Query token overlap with translation and concepts
      const searchableWords = new Set(
        `${record.translation} ${verseConcepts.join(" ")} ${verseThemes.join(" ")}`
          .toLowerCase()
          .split(/\W+/)
      );
      let matchedTokens = 0;
      for (const token of queryTokens) {
        if (searchableWords.has(token)) {
          matchedTokens++;
        }
      }
      if (matchedTokens > 0) {
        sim += Math.min(0.35, matchedTokens * 0.12);
      }

      // Reviewed verses have higher confidence if there is an active match
      if (record.retrievalMetadata.metadataStatus === "reviewed" && sim > 0) {
        sim += 0.1;
      }

      return {
        record,
        semanticSimilarity: Math.min(0.99, sim),
      };
    });
  }
}

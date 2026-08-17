import { ScriptureRecord } from "@/types/scripture";
import { EmotionalReading } from "@/types/emotion";
import { RAG_CONFIG } from "@/lib/config/rag";

export interface CandidateWithScore {
  record: ScriptureRecord;
  semanticSimilarity: number;
  conceptMatchScore: number;
  emotionMatchScore: number;
  situationMatchScore: number;
  finalScore: number;
}

export class RerankerService {
  private weights = RAG_CONFIG.rerankWeights;

  rerank(
    candidates: { record: ScriptureRecord; semanticSimilarity: number }[],
    emotionalReading: EmotionalReading
  ): CandidateWithScore[] {
    const scored: CandidateWithScore[] = candidates.map((item) => {
      const { record, semanticSimilarity } = item;

      // 1. Concept match score
      let conceptMatchScore = 0;
      const targetConcepts = emotionalReading.philosophicalConcepts.map((c) => c.toLowerCase());
      const verseConcepts = record.retrievalMetadata.philosophicalConcepts.map((c) => c.concept.toLowerCase());

      if (targetConcepts.length && verseConcepts.length) {
        let matches = 0;
        for (const tc of targetConcepts) {
          if (verseConcepts.some((vc) => vc.includes(tc) || tc.includes(vc))) {
            matches++;
          }
        }
        conceptMatchScore = Math.min(1, matches / Math.max(1, targetConcepts.length));
      }

      // 2. Emotion match score
      let emotionMatchScore = 0;
      const targetThemes = [emotionalReading.primaryEmotion, ...emotionalReading.themes].map((t) => t.toLowerCase());
      const verseThemes = record.retrievalMetadata.emotionalThemes.map((t) => t.concept.toLowerCase());

      if (targetThemes.length && verseThemes.length) {
        let matches = 0;
        for (const tt of targetThemes) {
          if (verseThemes.some((vt) => vt.includes(tt) || tt.includes(vt))) {
            matches++;
          }
        }
        emotionMatchScore = Math.min(1, matches / Math.max(1, targetThemes.length));
      }

      // 3. Situation match score
      let situationMatchScore = 0.5; // Baseline
      if (record.retrievalMetadata.lifeSituations && record.retrievalMetadata.lifeSituations.length > 0) {
        situationMatchScore = 0.8;
      }

      // 4. Calculate weighted score
      let finalScore =
        semanticSimilarity * this.weights.semantic +
        conceptMatchScore * this.weights.concept +
        emotionMatchScore * this.weights.emotion +
        (conceptMatchScore > 0 || semanticSimilarity > 0.2 ? situationMatchScore * this.weights.situation : 0);

      // Guard: if no semantic similarity or token match at all, penalize heavily
      if (semanticSimilarity === 0 && conceptMatchScore === 0) {
        finalScore = 0;
      }

      return {
        record,
        semanticSimilarity,
        conceptMatchScore,
        emotionMatchScore,
        situationMatchScore,
        finalScore,
      };
    });

    // Sort descending by finalScore
    scored.sort((a, b) => b.finalScore - a.finalScore);
    return scored;
  }
}

export type ProvenanceStatus = "known" | "unknown" | "community" | "unverified";
export type MetadataStatus = "pending" | "aiGenerated" | "reviewed" | "rejected";

export interface ConceptWithConfidence {
  concept: string;
  confidence: number; // 0.0 - 1.0
}

export interface SourceMetadata {
  sourceCorpus: string;
  sourceFile: string;
  sourceUrl: string | null;
  originalSourceName: string;
  translator: string | null;
  commentator: string | null;
  commentary: string | null;
  license: string;
  provenanceStatus: ProvenanceStatus;
  contentVersion: string;
  retrievedAt: string;
}

export interface RetrievalMetadata {
  philosophicalConcepts: ConceptWithConfidence[];
  emotionalThemes: ConceptWithConfidence[];
  lifeSituations: ConceptWithConfidence[];
  keywords: string[];
  metadataStatus: MetadataStatus;
}

export interface MetadataQuality {
  confidence: number;
  generatedBy: string;
  generatedAt: string;
  metadataVersion: string;
}

export interface ScriptureEmbedding {
  vector: number[];
  model: string;
  dimensions: number;
  embeddingVersion: string;
  embeddedTextHash: string;
}

export interface ScriptureRecord {
  canonicalId: string; // e.g. "gita:2:47"
  sourceName: string;
  chapter: number;
  verse: number;
  originalText: string; // Sanskrit Devanagari
  transliteration: string;
  wordMeanings: string;
  translation: string;
  sourceMetadata: SourceMetadata;
  retrievalMetadata: RetrievalMetadata;
  metadataQuality: MetadataQuality;
  embedding?: ScriptureEmbedding;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResolvedSource {
  canonicalId: string;
  sourceName: string;
  chapter: number;
  verse: number;
  originalText: string;
  transliteration: string;
  wordMeanings?: string;
  translation: string;
  commentary: string | null;
  commentator: string | null;
  translator: string | null;
  relevanceScore: number;
  provenanceStatus: ProvenanceStatus;
  concepts?: string[];
  themes?: string[];
}

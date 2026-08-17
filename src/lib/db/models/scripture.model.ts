import mongoose, { Schema, Document } from "mongoose";
import { ScriptureRecord } from "@/types/scripture";

export type ScriptureDocument = ScriptureRecord & Document;

const ConceptWithConfidenceSchema = new Schema(
  {
    concept: { type: String, required: true },
    confidence: { type: Number, required: true, min: 0, max: 1 },
  },
  { _id: false }
);

const ScriptureSchema = new Schema<ScriptureDocument>(
  {
    canonicalId: { type: String, required: true, unique: true, index: true },
    sourceName: { type: String, required: true, default: "Bhagavad Gita" },
    chapter: { type: Number, required: true, index: true },
    verse: { type: Number, required: true, index: true },
    originalText: { type: String, required: true },
    transliteration: { type: String, required: true },
    wordMeanings: { type: String, default: "" },
    translation: { type: String, required: true },
    sourceMetadata: {
      sourceCorpus: { type: String, required: true },
      sourceFile: { type: String, required: true },
      sourceUrl: { type: String, default: null },
      originalSourceName: { type: String, required: true },
      translator: { type: String, default: null },
      commentator: { type: String, default: null },
      commentary: { type: String, default: null },
      license: { type: String, default: "Public Domain" },
      provenanceStatus: {
        type: String,
        enum: ["known", "unknown", "community", "unverified"],
        default: "known",
      },
      contentVersion: { type: String, required: true },
      retrievedAt: { type: String, required: true },
    },
    retrievalMetadata: {
      philosophicalConcepts: [ConceptWithConfidenceSchema],
      emotionalThemes: [ConceptWithConfidenceSchema],
      lifeSituations: [ConceptWithConfidenceSchema],
      keywords: [{ type: String }],
      metadataStatus: {
        type: String,
        enum: ["pending", "aiGenerated", "reviewed", "rejected"],
        default: "aiGenerated",
      },
    },
    metadataQuality: {
      confidence: { type: Number, default: 0.85 },
      generatedBy: { type: String, default: "gemini-3.7-flash" },
      generatedAt: { type: String, default: () => new Date().toISOString() },
      metadataVersion: { type: String, default: "metadata-v1" },
    },
    embedding: {
      vector: { type: [Number], default: undefined },
      model: { type: String, default: "gemini-embedding-001" },
      dimensions: { type: Number, default: 768 },
      embeddingVersion: { type: String, default: "embedding-v1" },
      embeddedTextHash: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  }
);

export const Scripture =
  mongoose.models.Scripture || mongoose.model<ScriptureDocument>("Scripture", ScriptureSchema);

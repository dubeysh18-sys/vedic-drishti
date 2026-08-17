import mongoose, { Schema, Document } from "mongoose";

export interface IngestionJobDocument extends Omit<Document, "errors"> {
  jobId: string;
  sourceCorpus: string;
  corpusVersion: string;
  metadataVersion: string;
  embeddingVersion: string;
  status: "running" | "completed" | "failed";
  recordsProcessed: number;
  recordsSkipped: number;
  recordsFailed: number;
  jobErrors: Array<{ canonicalId: string; error: string }>;
  startedAt: Date;
  completedAt: Date | null;
}

const IngestionJobSchema = new Schema<IngestionJobDocument>(
  {
    jobId: { type: String, required: true, unique: true, index: true },
    sourceCorpus: { type: String, required: true },
    corpusVersion: { type: String, required: true },
    metadataVersion: { type: String, required: true },
    embeddingVersion: { type: String, required: true },
    status: { type: String, enum: ["running", "completed", "failed"], default: "running" },
    recordsProcessed: { type: Number, default: 0 },
    recordsSkipped: { type: Number, default: 0 },
    recordsFailed: { type: Number, default: 0 },
    jobErrors: [{ canonicalId: String, error: String }],
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

export const IngestionJob =
  mongoose.models.IngestionJob ||
  mongoose.model<IngestionJobDocument>("IngestionJob", IngestionJobSchema);

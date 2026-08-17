import mongoose, { Schema, Document } from "mongoose";

export interface FeedbackDocument extends Document {
  feedbackId: string;
  messageId: string;
  sessionId: string;
  rating: "helpful" | "notQuite";
  comment?: string;
  createdAt: Date;
}

const FeedbackSchema = new Schema<FeedbackDocument>(
  {
    feedbackId: { type: String, required: true, unique: true, index: true },
    messageId: { type: String, required: true, index: true },
    sessionId: { type: String, required: true, index: true },
    rating: { type: String, enum: ["helpful", "notQuite"], required: true },
    comment: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

export const Feedback =
  mongoose.models.Feedback || mongoose.model<FeedbackDocument>("Feedback", FeedbackSchema);

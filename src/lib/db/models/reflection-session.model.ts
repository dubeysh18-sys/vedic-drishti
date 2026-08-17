import mongoose, { Schema, Document } from "mongoose";

export interface ReflectionSessionDocument extends Document {
  sessionId: string;
  messages: string[];
  createdAt: Date;
  lastActiveAt: Date;
}

const ReflectionSessionSchema = new Schema<ReflectionSessionDocument>(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    messages: [{ type: String }],
    lastActiveAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const ReflectionSession =
  mongoose.models.ReflectionSession ||
  mongoose.model<ReflectionSessionDocument>("ReflectionSession", ReflectionSessionSchema);

import mongoose, { Schema, Document } from "mongoose";

export interface ReflectionMessageDocument extends Document {
  id: string;
  sessionId: string;
  userInput: string;
  selectedEmotion: string | null;
  emotionalReading: {
    primaryEmotion: string;
    secondaryEmotions: string[];
    statement: string;
  };
  sources: Array<{
    canonicalId: string;
    sourceName: string;
    chapter: number;
    verse: number;
    originalText: string;
    transliteration: string;
    translation: string;
    relevanceScore: number;
  }>;
  reflection: {
    whatIHear: string;
    perspectiveFromText: string;
    teaching: string | null;
    application: string;
    reflectionQuestion: string;
    caveats: string | null;
  } | null;
  ragOutcome: "strongMatch" | "weakMatch" | "noStrongMatch" | "crisis";
  createdAt: Date;
}

const ReflectionMessageSchema = new Schema<ReflectionMessageDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    sessionId: { type: String, required: true, index: true },
    userInput: { type: String, required: true },
    selectedEmotion: { type: String, default: null },
    emotionalReading: {
      primaryEmotion: { type: String, default: "" },
      secondaryEmotions: [{ type: String }],
      statement: { type: String, default: "" },
    },
    sources: [
      {
        canonicalId: { type: String, required: true },
        sourceName: { type: String, required: true },
        chapter: { type: Number, required: true },
        verse: { type: Number, required: true },
        originalText: { type: String, required: true },
        transliteration: { type: String, required: true },
        translation: { type: String, required: true },
        relevanceScore: { type: Number, default: 1.0 },
      },
    ],
    reflection: {
      whatIHear: { type: String },
      perspectiveFromText: { type: String },
      teaching: { type: String, default: null },
      application: { type: String },
      reflectionQuestion: { type: String },
      caveats: { type: String, default: null },
    },
    ragOutcome: {
      type: String,
      enum: ["strongMatch", "weakMatch", "noStrongMatch", "crisis"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ReflectionMessage =
  mongoose.models.ReflectionMessage ||
  mongoose.model<ReflectionMessageDocument>("ReflectionMessage", ReflectionMessageSchema);

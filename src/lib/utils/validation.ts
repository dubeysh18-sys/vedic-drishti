import { z } from "zod";

export const CreateReflectionSchema = z.object({
  message: z.string().min(1, "Message is required").max(2000, "Message cannot exceed 2000 characters"),
  selectedEmotion: z.string().optional(),
  guidedQuestionId: z.string().optional(),
  guidedQuestion: z.string().optional(),
  sessionId: z.string().optional(),
  conversationId: z.string().optional(),
});

export const CreateFeedbackSchema = z.object({
  messageId: z.string().min(1, "Message ID is required"),
  sessionId: z.string().min(1, "Session ID is required"),
  rating: z.enum(["helpful", "notQuite"]),
  comment: z.string().max(1000).optional(),
});

export const LLMReflectionOutputSchema = z.object({
  emotionalReading: z
    .object({
      primaryEmotion: z.string().optional(),
      secondaryEmotions: z.array(z.string()).default([]),
      statement: z.string().optional(),
    })
    .optional(),
  sourceIds: z.array(z.string()).default([]),
  whatIHear: z.string().optional(),
  perspectiveFromText: z.string().optional(),
  teaching: z.string().nullable().optional(),
  application: z.string().optional(),
  reflectionQuestion: z.string().optional(),
  caveats: z.string().nullable().optional(),
});

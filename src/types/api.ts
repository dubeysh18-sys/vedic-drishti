import { ReflectionMessageResponse } from "./reflection";

export interface CreateReflectionRequest {
  message: string;
  selectedEmotion?: string;
  guidedQuestionId?: string;
  guidedQuestion?: string;
  sessionId?: string;
  conversationId?: string;
}

export type CreateReflectionResponse = ReflectionMessageResponse;

export interface CreateFeedbackRequest {
  messageId: string;
  sessionId: string;
  rating: "helpful" | "notQuite";
  comment?: string;
}

export interface CreateFeedbackResponse {
  success: boolean;
  feedbackId: string;
}

export interface HealthCheckResponse {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  version: string;
  database: "connected" | "disconnected" | "in-memory";
  corpusVersesLoaded: number;
}

import { SafetyDecision } from "@/lib/safety/classifier.interface";

export type RetrievalConfidenceState = "HIGH_CONFIDENCE" | "LOW_CONFIDENCE" | "NO_MATCH";

export interface ReflectionTelemetry {
  requestId: string;
  sessionId: string;
  provider: "gemini" | "deterministic";
  model: string;
  llmCalled: boolean;
  fallbackUsed: boolean;
  fallbackReason?: string;
  retrievalMethod: "in_memory_taxonomy";
  retrievalConfidence: RetrievalConfidenceState;
  candidatesRetrieved: number;
  candidatesAfterRerank: number;
  selectedSourceIds: string[];
  safetyDecision: SafetyDecision;
  outputSafetyPassed: boolean;
  latencyMs: number;
  timestamp: string;
}

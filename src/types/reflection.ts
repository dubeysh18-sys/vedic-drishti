import { EmotionalReading } from "./emotion";
import { ResolvedSource } from "./scripture";

export type ResponseType = "reflection" | "no_match" | "safety_redirect" | "crisis";
export type RagOutcome = "strongMatch" | "weakMatch" | "noStrongMatch" | "crisis" | "redirect";

export interface CrisisResource {
  country: string;
  resourceName: string;
  resourceType: "hotline" | "textline" | "website" | "chat";
  phone: string | null;
  website: string | null;
  source: string;
  lastVerifiedAt: string | null;
  active: boolean;
}

export interface StructuredReflection {
  whatIHear: string;
  perspectiveFromText: string;
  teaching: string | null;
  application: string;
  reflectionQuestion: string;
  caveats: string | null;
}

export interface TrustLayers {
  originalSource: "fromCorpus";
  translation: "fromCorpus";
  commentary: "notAvailable" | "fromVerifiedSource";
  aiInterpretation: "aiGenerated";
}

export interface RetrievalDiagnostics {
  queryEmbeddingTimeMs: number;
  retrievalTimeMs: number;
  rerankTimeMs: number;
  generationTimeMs: number;
  totalTimeMs: number;
  candidatesRetrieved: number;
  candidatesAfterRerank: number;
  topScore: number;
  noMatchThreshold: number;
  retrievedCanonicalIds: string[];
  rerankScores: { canonicalId: string; score: number }[];
}

export interface MahamantraResponseData {
  mantra: string;
  guidance: string;
  disclaimer: string;
  reasonCode: string;
}

export interface ReflectionMessageResponse {
  id: string;
  sessionId: string;
  userInput: string;
  selectedEmotion: string | null;
  responseType: ResponseType;
  ragOutcome: RagOutcome;
  emotionalReading?: EmotionalReading;
  sources: ResolvedSource[];
  reflection: StructuredReflection | null;
  trustLayers?: TrustLayers;
  crisisResponse?: {
    acknowledgment: string;
    resources: CrisisResource[];
    disclaimer: string;
  };
  mahamantraResponse?: MahamantraResponseData;
  diagnostics?: RetrievalDiagnostics;
  createdAt: string;
}

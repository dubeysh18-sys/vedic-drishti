export type SafetyDecision = "ALLOW" | "BLOCK" | "REDIRECT" | "CRISIS" | "REVIEW";

export type SafetyCategory =
  | "SAFE"
  | "PROMPT_INJECTION"
  | "EXPLICIT_SEXUAL"
  | "MINOR_SEXUAL_CONTENT"
  | "VIOLENT_WRONGDOING"
  | "SELF_HARM_CRISIS"
  | "HATE_SPEECH"
  | "GROUP_SUPERIORITY"
  | "PHILOSOPHICAL_DISCUSSION"
  | "EMOTIONAL_REFLECTION"
  | "MEDICAL_LEGAL_OVERREACH"
  | "OTHER_PROHIBITED";

export interface SafetyClassification {
  category: SafetyCategory;
  decision: SafetyDecision;
  confidence: number;
  reasonCode: string;
  matchedPatterns?: string[];
  isCrisis: boolean;
  type: "severeCrisis" | "selfHarm" | null;
}

export interface SafetyClassifier {
  classify(input: string): Promise<SafetyClassification>;
}

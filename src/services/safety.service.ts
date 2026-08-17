import { SafetyClassifier, SafetyClassification, SafetyCategory, SafetyDecision } from "@/lib/safety/classifier.interface";
import { PatternClassifier } from "@/lib/safety/pattern.classifier";
import { CRISIS_RESOURCES, CRISIS_DISCLAIMER } from "@/lib/safety/crisis-resources";
import { createMahamantraRedirect, MahamantraResponse } from "@/lib/safety/mahamantra";
import { CrisisResource } from "@/types/reflection";
import { Logger } from "@/lib/observability/logger";

export interface SafetyCheckResult {
  decision: SafetyDecision;
  category: SafetyCategory;
  reasonCode: string;
  confidence: number;
  isCrisis: boolean;
  type: "selfHarm" | "harmToOthers" | "severeCrisis" | null;
  acknowledgment?: string;
  resources?: CrisisResource[];
  disclaimer?: string;
  mahamantra?: MahamantraResponse;
}

export class SafetyService {
  private classifier: SafetyClassifier;

  constructor(classifier?: SafetyClassifier) {
    this.classifier = classifier || new PatternClassifier();
  }

  async evaluateInput(input: string, sessionId?: string): Promise<SafetyCheckResult> {
    const classification: SafetyClassification = await this.classifier.classify(input);
    const decisionUpper = (classification.decision || "ALLOW").toUpperCase() as SafetyDecision;

    // 1. CRISIS scenario (self-harm, suicide, acute imminent physical danger)
    if (decisionUpper === "CRISIS" || classification.category === "SELF_HARM_CRISIS") {
      Logger.warn(
        "Crisis safety gate activated",
        {
          category: classification.category,
          reasonCode: classification.reasonCode,
          confidence: classification.confidence,
        },
        sessionId
      );

      const acknowledgment =
        "You are carrying an immense weight right now. Please know that your life and well-being have profound value, and you do not have to carry this alone.";

      return {
        decision: "CRISIS",
        category: classification.category,
        reasonCode: classification.reasonCode,
        confidence: classification.confidence,
        isCrisis: true,
        type: classification.type || "selfHarm",
        acknowledgment,
        resources: CRISIS_RESOURCES.filter((r) => r.active),
        disclaimer: CRISIS_DISCLAIMER,
      };
    }

    // 2. PROMPT INJECTION / SYSTEM EXTRACTION
    if (classification.category === "PROMPT_INJECTION") {
      Logger.warn(
        "Prompt injection redirect activated",
        {
          category: classification.category,
          reasonCode: classification.reasonCode,
          confidence: classification.confidence,
        },
        sessionId
      );

      return {
        decision: "REDIRECT",
        category: "PROMPT_INJECTION",
        reasonCode: classification.reasonCode,
        confidence: classification.confidence,
        isCrisis: false,
        type: null,
        mahamantra: createMahamantraRedirect("PROMPT_INJECTION_ATTEMPT"),
      };
    }

    // 3. PROHIBITED CONTENT REDIRECT (Explicit sexual, Hate speech, Operational violence)
    if (decisionUpper === "REDIRECT" || decisionUpper === "BLOCK") {
      Logger.warn(
        "Prohibited content redirect activated",
        {
          category: classification.category,
          reasonCode: classification.reasonCode,
          confidence: classification.confidence,
        },
        sessionId
      );

      return {
        decision: "REDIRECT",
        category: classification.category,
        reasonCode: classification.reasonCode,
        confidence: classification.confidence,
        isCrisis: false,
        type: null,
        mahamantra: createMahamantraRedirect(classification.reasonCode),
      };
    }

    // 4. SAFE TO PROCEED
    return {
      decision: "ALLOW",
      category: classification.category || "SAFE",
      reasonCode: "SAFE_INPUT",
      confidence: classification.confidence,
      isCrisis: false,
      type: null,
    };
  }
}

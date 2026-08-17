import { SafetyClassifier, SafetyClassification, SafetyCategory, SafetyDecision } from "@/lib/safety/classifier.interface";
import { PatternClassifier } from "@/lib/safety/pattern.classifier";
import { LLMSafetyClassifier } from "@/lib/safety/llm.classifier";
import { CRISIS_RESOURCES, CRISIS_DISCLAIMER } from "@/lib/safety/crisis-resources";
import { createMahamantraRedirect, MahamantraResponse } from "@/lib/safety/mahamantra";
import { CrisisResource } from "@/types/reflection";
import { Logger } from "@/lib/observability/logger";
import { getAppConfig } from "@/lib/config/env";

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
  private patternClassifier: SafetyClassifier;
  private llmClassifier: SafetyClassifier;

  constructor(classifier?: SafetyClassifier) {
    this.patternClassifier = classifier || new PatternClassifier();
    this.llmClassifier = new LLMSafetyClassifier();
  }

  async evaluateInput(input: string, sessionId?: string): Promise<SafetyCheckResult> {
    // Layer 1: Fast deterministic pattern evaluation
    let classification: SafetyClassification = await this.patternClassifier.classify(input);

    // Layer 2: Universal LLM Semantic Intent Classification (if pattern allowed and API key configured)
    if (classification.decision === "ALLOW") {
      const config = getAppConfig();
      if (config.geminiApiKey) {
        try {
          const llmResult = await this.llmClassifier.classify(input);
          if (llmResult.decision !== "ALLOW" && llmResult.reasonCode !== "LLM_CLASSIFIER_FALLBACK") {
            classification = llmResult;
            Logger.info("Universal LLM safety gate triggered", {
              category: classification.category,
              decision: classification.decision,
              reason: classification.reasonCode,
            });
          }
        } catch (err) {
          Logger.warn("Universal LLM safety check bypassed due to error", { error: String(err) });
        }
      }
    }

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

    // 3. PROHIBITED CONTENT REDIRECT (Abusive behavior, Explicit sexual, Hate speech, Operational violence)
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

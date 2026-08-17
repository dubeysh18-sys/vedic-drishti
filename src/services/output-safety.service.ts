import { StructuredReflection } from "@/types/reflection";
import { Logger } from "@/lib/observability/logger";

export interface OutputSafetyResult {
  passed: boolean;
  category?: string;
  reasonCode?: string;
  flaggedTextSnippet?: string;
}

export class OutputSafetyService {
  private explicitSexualPatterns: RegExp[] = [
    /\b(?:hardcore\s+porn|erotic\s+scene|explicit\s+sexual\s+act)\b/i,
    /\b(?:sexual\s+intercourse\s+in\s+detail|genitals?|nudity\s+description)\b/i,
  ];

  private violentWrongdoingPatterns: RegExp[] = [
    /\b(?:step-by-step\s+instructions\s+to\s+kill|how\s+to\s+make\s+a\s+bomb)\b/i,
    /\b(?:how\s+to\s+poison\s+someone|how\s+to\s+commit\s+murder)\b/i,
  ];

  private hateAndSuperiorityPatterns: RegExp[] = [
    /\b(?:women|men|muslims|hindus|christians|dalits|brahmins)\s+are\s+(?:subhuman|evil|scum|inferior\s+by\s+nature)\b/i,
    /\b(?:superiority|inferiority)\s+of\s+(?:the\s+)?(?:caste|race|gender)\b/i,
  ];

  private selfHarmEncouragementPatterns: RegExp[] = [
    /\b(?:you\s+should\s+end\s+your\s+life|suicide\s+is\s+the\s+only\s+solution)\b/i,
    /\b(?:better\s+off\s+dead|encouraging\s+you\s+to\s+die)\b/i,
  ];

  private medicalLegalCertaintyPatterns: RegExp[] = [
    /\b(?:you\s+are\s+diagnosed\s+with|clinical\s+depression\s+diagnosis)\b/i,
    /\b(?:stop\s+taking\s+your\s+medication|guaranteed\s+cure\s+for\s+cancer)\b/i,
    /\b(?:legal\s+verdict|guaranteed\s+financial\s+return)\b/i,
  ];

  private spiritualCoercionPatterns: RegExp[] = [
    /\b(?:you\s+will\s+go\s+to\s+hell\s+unless|divine\s+punishment\s+is\s+certain)\b/i,
    /\b(?:this\s+happened\s+because\s+your\s+past\s+life\s+karma\s+was\s+evil)\b/i,
  ];

  validateOutput(reflection: StructuredReflection): OutputSafetyResult {
    if (!reflection) {
      return { passed: true };
    }

    const combinedText = [
      reflection.whatIHear || "",
      reflection.teaching || "",
      reflection.application || "",
      reflection.reflectionQuestion || "",
    ].join(" ");

    // 1. Explicit sexual check
    for (const p of this.explicitSexualPatterns) {
      if (p.test(combinedText)) {
        Logger.warn("Output safety flagged explicit sexual content", { matched: p.source });
        return {
          passed: false,
          category: "EXPLICIT_SEXUAL",
          reasonCode: "OUTPUT_EXPLICIT_SEXUAL",
          flaggedTextSnippet: combinedText.slice(0, 100),
        };
      }
    }

    // 2. Violent wrongdoing check
    for (const p of this.violentWrongdoingPatterns) {
      if (p.test(combinedText)) {
        Logger.warn("Output safety flagged violent instructions", { matched: p.source });
        return {
          passed: false,
          category: "VIOLENT_WRONGDOING",
          reasonCode: "OUTPUT_VIOLENT_INSTRUCTION",
        };
      }
    }

    // 3. Hate & superiority check
    for (const p of this.hateAndSuperiorityPatterns) {
      if (p.test(combinedText)) {
        Logger.warn("Output safety flagged hate speech or group superiority", { matched: p.source });
        return {
          passed: false,
          category: "HATE_SPEECH",
          reasonCode: "OUTPUT_GROUP_SUPERIORITY",
        };
      }
    }

    // 4. Self-harm encouragement check
    for (const p of this.selfHarmEncouragementPatterns) {
      if (p.test(combinedText)) {
        Logger.warn("Output safety flagged self-harm encouragement", { matched: p.source });
        return {
          passed: false,
          category: "SELF_HARM",
          reasonCode: "OUTPUT_SELF_HARM_ENCOURAGEMENT",
        };
      }
    }

    // 5. Medical / Legal certainty check
    for (const p of this.medicalLegalCertaintyPatterns) {
      if (p.test(combinedText)) {
        Logger.warn("Output safety flagged medical or legal certainty claim", { matched: p.source });
        return {
          passed: false,
          category: "MEDICAL_LEGAL_OVERREACH",
          reasonCode: "OUTPUT_MEDICAL_LEGAL_OVERREACH",
        };
      }
    }

    // 6. Spiritual coercion check
    for (const p of this.spiritualCoercionPatterns) {
      if (p.test(combinedText)) {
        Logger.warn("Output safety flagged spiritual coercion", { matched: p.source });
        return {
          passed: false,
          category: "SPIRITUAL_COERCION",
          reasonCode: "OUTPUT_SPIRITUAL_COERCION",
        };
      }
    }

    return { passed: true };
  }
}

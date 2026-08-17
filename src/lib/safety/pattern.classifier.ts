import { SafetyClassification, SafetyClassifier } from "./classifier.interface";

export class PatternClassifier implements SafetyClassifier {
  // 1. Crisis: Acute Imminent Danger / Severe Crisis
  private acuteCrisisPatterns: RegExp[] = [
    /\b(?:actively\s+bleeding|taken\s+all\s+the\s+pills|swallowed\s+poison)\b/i,
    /\b(?:standing\s+on\s+the\s+bridge|gun\s+to\s+my\s+head|holding\s+a\s+knife\s+to\s+my\s+wrist)\b/i,
  ];

  // 2. Crisis: Suicide & Self-Harm (Explicitly Self-Inflicted)
  private selfHarmPatterns: RegExp[] = [
    /\b(?:kill|end)\s+(?:myself|my\s+life)\b/i,
    /\b(?:want|ready|plan|planning|going)\s+to\s+die\b/i,
    /\bsuicid(?:e|al|ing)\b/i,
    /\b(?:hurt|cut|harm|poison|hang|overdose|slit)\s+(?:myself|my\s+wrists|my\s+own\s+body)\b/i,
    /\b(?:no\s+reason\s+to\s+live|don't\s+want\s+to\s+live|better\s+off\s+dead)\b/i,
    /\b(?:goodbye\s+cruel\s+world|final\s+exit|saying\s+goodbye\s+to\s+everyone\s+forever)\b/i,
    /\b(?:end\s+it\s+all|can't\s+go\s+on\s+living|nothing\s+worth\s+living\s+for)\b/i,
    /\bhow\s+(?:can|do)\s+i\s+(?:kill\s+myself|end\s+my\s+life|die\s+peacefully|commit\s+suicide)\b/i,
    /\bdon't\s+want\s+to\s+be\s+alive\b/i,
  ];

  // 3. Crisis: Physical Abuse & Immediate Threat
  private abusePatterns: RegExp[] = [
    /\b(?:partner|husband|wife|parent|father|mother)\s+is\s+(?:beating|abusing|strangling|attacking)\s+me\s+right\s+now\b/i,
    /\bi\s+am\s+being\s+held\s+captive\b/i,
  ];

  // 4. Prohibited: Minor Sexual Content & Exploitation (Zero Tolerance)
  private minorSexualPatterns: RegExp[] = [
    /\b(?:child|minor|underage|teen|toddler|infant|pedophil)\w*\b.*?\b(?:sex|erotic|porn|nude|sexual|exploit|fantasy|content)\b/i,
    /\b(?:sex|erotic|porn|nude|sexual|exploit|content)\b.*?\b(?:child|minor|underage|teen|kid|infant|children)\b/i,
  ];

  // 5. Prohibited: Explicit Sexual Content & Erotic Generation
  private explicitSexualPatterns: RegExp[] = [
    /\b(?:write|generate|create|tell)\b.*?\b(?:erotic|explicit|pornographic|smut|nsfw|sex|sexual)\b.*?\b(?:story|encounter|scene|roleplay|fantasy|content)\b/i,
    /\bdescribe\s+(?:a\s+)?(?:sexual\s+encounter|sex\s+act|intercourse)\s+in\s+graphic\s+detail\b/i,
    /\b(?:hardcore\s+porn|erotic\s+roleplay)\b/i,
  ];

  // 6. Prohibited: Operational Violence, Weapons & Criminal Assistance
  private violentWrongdoingPatterns: RegExp[] = [
    /\bhow\s+(?:can|to|do)\s+i\s+(?:kill|murder|poison|stab|shoot|strangle|harm|attack)\s+(?:someone|him|her|them|my\s+\w+|people)\b/i,
    /\bhow\s+(?:can|to)\s+(?:kill|murder)\s+\w+\s+without\s+(?:getting\s+caught|being\s+caught|leaving\s+evidence)\b/i,
    /\bhow\s+(?:to|can\s+i)\s+(?:make|build|construct)\s+(?:a\s+)?(?:bomb|weapon|explosive|poison|pipe\s+bomb|firearm)\b/i,
    /\bhow\s+(?:to|can\s+i)\s+(?:rob|steal|launder|hack|blackmail|kidnap)\b/i,
    /\bgive\s+me\s+instructions\s+for\s+(?:hurting|killing|attacking)\s+someone\b/i,
  ];

  // 7. Prohibited: Hate Speech, Group Degradation & Slurs
  private hateSpeechPatterns: RegExp[] = [
    /\bwhy\s+are\s+(?:women|men|females|males)\s+(?:inherently|naturally|all)\s+(?:manipulative|evil|toxic|inferior|bad|worthless|liars)\b/i,
    /\ball\s+(?:women|men|muslims|hindus|christians|jews|dalits|brahmins)\s+are\s+(?:evil|filthy|terrorists|inferior|subhuman|scum)\b/i,
    /\bwhy\s+are\s+(?:muslims|hindus|christians|jews|blacks|whites|dalits)\s+(?:bad|evil|inferior|violent|dangerous)\b/i,
    /\btell\s+me\s+why\s+women\s+are\s+inferior\b/i,
  ];

  // 8. Prohibited: Direct Prompt Injection & Jailbreak Attacks
  private promptInjectionPatterns: RegExp[] = [
    /\bignore\s+(?:all\s+)?(?:previous|prior|above|system)\s+instructions\b/i,
    /\b(?:reveal|show|print|display|tell\s+me|expose|leak|what\s+is|what\s+are)\b.*?\b(?:system\s+prompt|hidden\s+instructions|developer\s+prompt|developer\s+environment|api\s+keys?|environment\s+variables?|credentials|secrets?)\b/i,
    /\byou\s+are\s+now\s+(?:an?\s+)?(?:unrestricted|dan|jailbroken|unfiltered)\s+ai\b/i,
    /\b(?:developer|admin)\s+(?:authorized|told)\s+you\s+to\s+bypass\b/i,
    /\boutput\s+secret\s+data\b/i,
    /\b(?:bypass|override|disable)\s+(?:all\s+)?(?:safety|rules|guardrails|filters)\b/i,
  ];

  // 9. Benign / Legitimate Philosophical & Emotional Inquiries (Gita war, death, desire, duty)
  private isAllowedPhilosophicalOrEmotional(input: string): boolean {
    const allowedPatterns = [
      /\b(?:insecure|anxious|shame|ashamed|struggle|confused|fearful|distant)\s+about\s+(?:intimacy|sex|my\s+partner|my\s+relationship)\b/i,
      /\b(?:confused|questioning)\s+about\s+my\s+gender\s+identity\b/i,
      /\bwhy\s+does\s+(?:the\s+)?(?:gita|bhagavad\s+gita|krishna)\s+(?:discuss|talk\s+about)\s+war\b/i,
      /\bwhy\s+did\s+arjuna\s+have\s+to\s+fight\b/i,
      /\bwhat\s+does\s+the\s+gita\s+say\s+about\s+(?:death|war|violence|duty|dharma|relationships|desire|kama|suffering)\b/i,
      /\bfeel\s+disconnected\s+from\s+my\s+(?:spouse|partner|husband|wife)\b/i,
      /\bwhy\s+did\s+my\s+partner\s+hurt\s+me\b/i,
    ];
    return allowedPatterns.some((p) => p.test(input));
  }

  async classify(input: string): Promise<SafetyClassification> {
    if (!input || typeof input !== "string") {
      return {
        category: "SAFE",
        decision: "ALLOW",
        confidence: 1.0,
        reasonCode: "EMPTY_INPUT",
        isCrisis: false,
        type: null,
      };
    }

    const trimmed = input.trim();
    const matchedPatterns: string[] = [];

    // --- STEP 1: Check Acute Emergency & Suicide Crisis ---
    for (const pattern of this.acuteCrisisPatterns) {
      if (pattern.test(trimmed)) {
        matchedPatterns.push(pattern.source);
        return {
          category: "SELF_HARM_CRISIS",
          decision: "CRISIS",
          confidence: 0.99,
          reasonCode: "ACUTE_PHYSICAL_DANGER",
          matchedPatterns,
          isCrisis: true,
          type: "severeCrisis",
        };
      }
    }

    for (const pattern of this.selfHarmPatterns) {
      if (pattern.test(trimmed)) {
        matchedPatterns.push(pattern.source);
        return {
          category: "SELF_HARM_CRISIS",
          decision: "CRISIS",
          confidence: 0.98,
          reasonCode: "SELF_HARM_EXPRESSION",
          matchedPatterns,
          isCrisis: true,
          type: "selfHarm",
        };
      }
    }

    for (const pattern of this.abusePatterns) {
      if (pattern.test(trimmed)) {
        matchedPatterns.push(pattern.source);
        return {
          category: "SELF_HARM_CRISIS",
          decision: "CRISIS",
          confidence: 0.95,
          reasonCode: "PHYSICAL_ABUSE_IMMINENT",
          matchedPatterns,
          isCrisis: true,
          type: "severeCrisis",
        };
      }
    }

    // --- STEP 2: Check Minor Exploitation (Zero Tolerance) ---
    for (const pattern of this.minorSexualPatterns) {
      if (pattern.test(trimmed)) {
        matchedPatterns.push(pattern.source);
        return {
          category: "MINOR_SEXUAL_CONTENT",
          decision: "REDIRECT",
          confidence: 0.99,
          reasonCode: "MINOR_SAFETY_VIOLATION",
          matchedPatterns,
          isCrisis: false,
          type: null,
        };
      }
    }

    // --- STEP 3: Check Operational Violence & Crime Assistance ---
    for (const pattern of this.violentWrongdoingPatterns) {
      if (pattern.test(trimmed)) {
        matchedPatterns.push(pattern.source);
        return {
          category: "VIOLENT_WRONGDOING",
          decision: "REDIRECT",
          confidence: 0.96,
          reasonCode: "VIOLENCE_OR_CRIMINAL_INSTRUCTION",
          matchedPatterns,
          isCrisis: false,
          type: null,
        };
      }
    }

    // --- STEP 4: Check Direct Prompt Injection Attacks ---
    for (const pattern of this.promptInjectionPatterns) {
      if (pattern.test(trimmed)) {
        matchedPatterns.push(pattern.source);
        return {
          category: "PROMPT_INJECTION",
          decision: "REDIRECT",
          confidence: 0.95,
          reasonCode: "PROMPT_INJECTION_ATTEMPT",
          matchedPatterns,
          isCrisis: false,
          type: null,
        };
      }
    }

    // --- STEP 5: Nuanced Check for Allowed Philosophical/Emotional Discussions ---
    if (this.isAllowedPhilosophicalOrEmotional(trimmed)) {
      return {
        category: "PHILOSOPHICAL_DISCUSSION",
        decision: "ALLOW",
        confidence: 0.95,
        reasonCode: "LEGITIMATE_PHILOSOPHICAL_OR_EMOTIONAL_INQUIRY",
        matchedPatterns: [],
        isCrisis: false,
        type: null,
      };
    }

    // --- STEP 6: Check Explicit Sexual Content ---
    for (const pattern of this.explicitSexualPatterns) {
      if (pattern.test(trimmed)) {
        matchedPatterns.push(pattern.source);
        return {
          category: "EXPLICIT_SEXUAL",
          decision: "REDIRECT",
          confidence: 0.95,
          reasonCode: "EXPLICIT_SEXUAL_REQUEST",
          matchedPatterns,
          isCrisis: false,
          type: null,
        };
      }
    }

    // --- STEP 7: Check Hate Speech & Degrading Group Generalizations ---
    for (const pattern of this.hateSpeechPatterns) {
      if (pattern.test(trimmed)) {
        matchedPatterns.push(pattern.source);
        return {
          category: "HATE_SPEECH",
          decision: "REDIRECT",
          confidence: 0.92,
          reasonCode: "GROUP_DEGRADATION_OR_HATE",
          matchedPatterns,
          isCrisis: false,
          type: null,
        };
      }
    }

    // --- STEP 8: Safe Emotional Reflection Input ---
    return {
      category: "EMOTIONAL_REFLECTION",
      decision: "ALLOW",
      confidence: 0.9,
      reasonCode: "SAFE_INPUT",
      matchedPatterns: [],
      isCrisis: false,
      type: null,
    };
  }
}

import { EmotionalReading } from "@/types/emotion";
import { getEmotionById } from "@/lib/emotions/taxonomy";
import { mapToCanonicalEmotion } from "@/lib/emotions/synonym-map";

export class EmotionAnalysisService {
  // Hinglish and common colloquial sentiment hints
  private hinglishPatterns: Array<{ pattern: RegExp; emotion: string }> = [
    { pattern: /\b(?:bahut\s+pareshan|tension|chinta|dar\s+lag\s+raha)\b/i, emotion: "anxious" },
    { pattern: /\b(?:gussa|naraz|krodh|irritate)\b/i, emotion: "angry" },
    { pattern: /\b(?:udas|dukhi|rona|akela|bura\s+lag\s+raha)\b/i, emotion: "heavy" },
    { pattern: /\b(?:samajh\s+nahi\s+aa\s+raha|confuse|dilemma)\b/i, emotion: "confused" },
    { pattern: /\b(?:jalan|compare|insecure)\b/i, emotion: "jealous" },
    { pattern: /\b(?:shanti\s+chahiye|peace\s+mind|guidance)\b/i, emotion: "seeking" },
  ];

  async analyze(userInput: string, selectedEmotion?: string): Promise<EmotionalReading> {
    let primaryEmotion = "seeking";
    const secondaryEmotions: string[] = [];
    let isGenericInput = false;

    // 1. Explicit user selection has first priority
    if (selectedEmotion) {
      const canonical = mapToCanonicalEmotion(selectedEmotion) || selectedEmotion.toLowerCase();
      primaryEmotion = canonical;
    } else {
      // 2. Check Hinglish hints
      let foundHinglish = false;
      for (const h of this.hinglishPatterns) {
        if (h.pattern.test(userInput)) {
          primaryEmotion = h.emotion;
          foundHinglish = true;
          break;
        }
      }

      // 3. Extract via canonical synonym map
      if (!foundHinglish) {
        const detected = mapToCanonicalEmotion(userInput);
        if (detected) {
          primaryEmotion = detected;
        } else {
          isGenericInput = true;
        }
      }
    }

    // Detect potential secondary emotions
    const lowerInput = userInput.toLowerCase();
    const potentialSecondaries = ["anxious", "confused", "heavy", "angry", "lonely", "seeking", "restless"];
    for (const sec of potentialSecondaries) {
      if (sec !== primaryEmotion && lowerInput.includes(sec)) {
        secondaryEmotions.push(sec);
      }
    }

    const emotionDef = getEmotionById(primaryEmotion);
    const concepts = isGenericInput ? [] : (emotionDef ? [...emotionDef.associatedConcepts] : []);
    const themes = isGenericInput ? [] : (emotionDef ? [...emotionDef.associatedThemes] : []);

    // Reflective, non-diagnostic phrasing ("It sounds like...", "You may be carrying...")
    let statement = `It sounds like you are carrying a quiet turbulence, seeking a steady anchor amid changing tides.`;
    switch (primaryEmotion) {
      case "anxious":
        statement = "It sounds like you may be carrying the weight of tomorrow, feeling unmoored by uncertainty. The mind may be racing forward, seeking certainty where things are still unfolding.";
        break;
      case "overwhelmed":
        statement = "From what you share, you seem to be experiencing an exhausting weight of demands, feeling stretched across too many fronts while longing for stillness.";
        break;
      case "confused":
        statement = "It appears you may be standing at a crossroads of doubt, where conflicting perspectives make the next step feel unclear.";
        break;
      case "heavy":
        statement = "I hear a sense of quiet heaviness in your words, where everyday moments feel weighed down by fatigue or sadness. Your heart seems to be asking for gentle kindness.";
        break;
      case "hopeful":
        statement = "It sounds like you are sensing a gentle opening amidst the shadows, feeling an inclination toward renewed alignment and strength.";
        break;
      case "seeking":
        statement = "I hear a sincere yearning for deeper understanding and enduring meaning, listening for perspectives that speak to your inner core.";
        break;
      case "angry":
        statement = "It sounds like you are feeling the heat of frustration and hurt, where expectations were unmet or personal boundaries felt crossed.";
        break;
      case "jealous":
        statement = "It appears you may be feeling the subtle sting of comparison, wondering about your own path while watching others.";
        break;
      case "grieving":
        statement = "I hear the tender ache of loss in your reflection, feeling the quiet space left behind when something deeply meaningful has shifted.";
        break;
      case "lonely":
        statement = "It sounds like you may be experiencing a sense of isolation or distance, wishing to feel seen, understood, and connected.";
        break;
      case "restless":
        statement = "Your reflection suggests the mind may be fluttering between thoughts, finding it difficult to settle into peaceful presence.";
        break;
      case "fearful":
        statement = "It seems you may be feeling vulnerable before the unknown, longing for grounded courage amidst uncertainty.";
        break;
    }

    return {
      primaryEmotion,
      secondaryEmotions,
      intensity: 0.8,
      statement,
      situation: userInput.slice(0, 150),
      themes,
      philosophicalConcepts: concepts,
    };
  }
}

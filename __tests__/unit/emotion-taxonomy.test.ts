import {
  CONTROLLED_EMOTIONS,
  getEmotionById,
  getEmotionPromptStarter,
  getEmotionPromptStarterParts,
  getEmotionConversationalPlaceholder,
} from "@/lib/emotions/taxonomy";

describe("Emotion Taxonomy", () => {
  it("should contain exactly 12 core emotions matching the UI design", () => {
    expect(CONTROLLED_EMOTIONS.length).toBe(12);
  });

  it("should have valid properties on every emotion definition", () => {
    for (const emotion of CONTROLLED_EMOTIONS) {
      expect(emotion.id).toBeDefined();
      expect(emotion.name).toBeDefined();
      expect(emotion.iconName).toBeDefined();
      expect(emotion.pebbleShapeClass).toMatch(/^pebble-shape-[1-6]$/);
      expect(emotion.associatedConcepts.length).toBeGreaterThan(0);
      expect(emotion.associatedThemes.length).toBeGreaterThan(0);
      expect(emotion.synonyms.length).toBeGreaterThan(0);
    }
  });

  it("should retrieve emotion by valid ID case-insensitively", () => {
    const anxious = getEmotionById("Anxious");
    expect(anxious).toBeDefined();
    expect(anxious?.id).toBe("anxious");
    expect(anxious?.name).toBe("Anxious");
  });

  it("should return undefined for unknown emotion ID", () => {
    const unknown = getEmotionById("non_existent_emotion");
    expect(unknown).toBeUndefined();
  });

  it("should correctly parse prompt starter parts for all 12 controlled emotions", () => {
    for (const emotion of CONTROLLED_EMOTIONS) {
      const parts = getEmotionPromptStarterParts(emotion.id);
      expect(parts).toBeDefined();
      expect(parts?.base).toBeDefined();
      expect(parts?.connector).toBeDefined();
      expect(parts?.fullText).toBe(getEmotionPromptStarter(emotion.id));
      expect(parts?.base + parts?.connector).toBe(parts?.fullText);
    }

    const fearful = getEmotionPromptStarterParts("fearful");
    expect(fearful?.base).toBe("I am feeling fearful ");
    expect(fearful?.connector).toBe("about ");

    const anxious = getEmotionPromptStarterParts("anxious");
    expect(anxious?.base).toBe("I am feeling anxious ");
    expect(anxious?.connector).toBe("because ");

    const seeking = getEmotionPromptStarterParts("seeking");
    expect(seeking?.base).toBe("I am seeking guidance ");
    expect(seeking?.connector).toBe("on ");
  });

  it("should return null when emotionId is not provided to getEmotionPromptStarterParts", () => {
    expect(getEmotionPromptStarterParts(null)).toBeNull();
    expect(getEmotionPromptStarterParts(undefined)).toBeNull();
    expect(getEmotionPromptStarterParts("")).toBeNull();
  });

  it("should return contextual conversational placeholder for each emotion", () => {
    expect(getEmotionConversationalPlaceholder("anxious")).toBe("What's making you feel anxious?");
    expect(getEmotionConversationalPlaceholder("fearful")).toBe("What's making you feel fearful?");
    expect(getEmotionConversationalPlaceholder("confused")).toBe("What's leaving you feeling confused?");
    expect(getEmotionConversationalPlaceholder("lonely")).toBe("What's making you feel alone?");
    expect(getEmotionConversationalPlaceholder(null)).toBe("Or tell me what's on your mind...");
    expect(getEmotionConversationalPlaceholder(undefined)).toBe("Or tell me what's on your mind...");
  });
});


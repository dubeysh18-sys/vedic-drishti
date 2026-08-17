import { CONTROLLED_EMOTIONS, getEmotionById } from "@/lib/emotions/taxonomy";

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
});

import { mapToCanonicalEmotion } from "@/lib/emotions/synonym-map";

describe("Synonym Map", () => {
  it("should map direct canonical emotion IDs", () => {
    expect(mapToCanonicalEmotion("anxious")).toBe("anxious");
    expect(mapToCanonicalEmotion("overwhelmed")).toBe("overwhelmed");
    expect(mapToCanonicalEmotion("confused")).toBe("confused");
  });

  it("should map common synonyms to canonical emotions", () => {
    expect(mapToCanonicalEmotion("furious")).toBe("angry");
    expect(mapToCanonicalEmotion("worried")).toBe("anxious");
    expect(mapToCanonicalEmotion("burned out")).toBe("overwhelmed");
    expect(mapToCanonicalEmotion("envious")).toBe("jealous");
    expect(mapToCanonicalEmotion("heartbroken")).toBe("grieving");
    expect(mapToCanonicalEmotion("isolated")).toBe("lonely");
    expect(mapToCanonicalEmotion("fidgety")).toBe("restless");
    expect(mapToCanonicalEmotion("terrified")).toBe("fearful");
  });

  it("should detect emotion in sentences", () => {
    expect(mapToCanonicalEmotion("I am really worried about tomorrow")).toBe("anxious");
    expect(mapToCanonicalEmotion("Feeling completely burnt out with work")).toBe("overwhelmed");
    expect(mapToCanonicalEmotion("I feel so angry right now")).toBe("angry");
  });

  it("should return null for unrelated text without emotional keywords", () => {
    expect(mapToCanonicalEmotion("The quick brown fox jumps over the lazy dog")).toBeNull();
  });
});

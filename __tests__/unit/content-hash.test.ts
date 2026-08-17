import { computeSha256, composeEmbeddingText } from "@/lib/utils/hash";

describe("Content Hash Utilities", () => {
  it("should generate deterministic SHA-256 hashes", () => {
    const hash1 = computeSha256("test text content");
    const hash2 = computeSha256("test text content");
    expect(hash1).toBe(hash2);
    expect(hash1.length).toBe(64);
  });

  it("should change hash when content changes", () => {
    const hash1 = computeSha256("test text content A");
    const hash2 = computeSha256("test text content B");
    expect(hash1).not.toBe(hash2);
  });

  it("should compose clean deterministic embedding text", () => {
    const text = composeEmbeddingText(
      "Bhagavad Gita",
      2,
      47,
      "You have a right to your duty, not results.",
      ["duty", "unattachment"],
      ["anxiety"],
      ["career stress"]
    );

    expect(text).toContain("Source: Bhagavad Gita");
    expect(text).toContain("Chapter: 2, Verse: 47");
    expect(text).toContain("Translation: You have a right to your duty, not results.");
    expect(text).toContain("Concepts: duty, unattachment");
  });
});

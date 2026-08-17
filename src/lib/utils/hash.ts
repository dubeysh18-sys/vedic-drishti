import { createHash } from "crypto";

export function computeSha256(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

export function composeEmbeddingText(
  sourceName: string,
  chapter: number,
  verse: number,
  translation: string,
  concepts: string[] = [],
  themes: string[] = [],
  situations: string[] = []
): string {
  return [
    `Source: ${sourceName}`,
    `Chapter: ${chapter}, Verse: ${verse}`,
    `Translation: ${translation}`,
    concepts.length ? `Concepts: ${concepts.join(", ")}` : "",
    themes.length ? `Themes: ${themes.join(", ")}` : "",
    situations.length ? `Situations: ${situations.join(", ")}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

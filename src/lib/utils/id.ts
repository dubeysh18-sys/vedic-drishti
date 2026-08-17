import * as crypto from "crypto";

function generateRandomString(length: number = 16): string {
  if (typeof crypto !== "undefined" && crypto.randomBytes) {
    return crypto.randomBytes(Math.ceil(length / 2)).toString("hex").slice(0, length);
  }
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateCanonicalScriptureId(corpus: string, chapter: number, verse: number): string {
  return `${corpus.trim().toLowerCase()}:${chapter}:${verse}`;
}

export function parseCanonicalScriptureId(id: string): { corpus: string; chapter: number; verse: number } | null {
  const parts = id.split(":");
  if (parts.length !== 3) return null;
  const [corpus, ch, vs] = parts;
  const chapter = parseInt(ch, 10);
  const verse = parseInt(vs, 10);
  if (isNaN(chapter) || isNaN(verse)) return null;
  return { corpus, chapter, verse };
}

export function generateSessionId(): string {
  return `sess_${generateRandomString(16)}`;
}

export function generateMessageId(): string {
  return `msg_${generateRandomString(16)}`;
}

export function generateFeedbackId(): string {
  return `fb_${generateRandomString(16)}`;
}

import { ScriptureRecord } from "@/types/scripture";
import { CorpusStore } from "@/lib/data/corpus-store";
import { connectToDatabase } from "@/lib/db/connection";
import { Scripture } from "@/lib/db/models/scripture.model";

export class ScriptureService {
  private corpusStore = CorpusStore.getInstance();

  async getById(canonicalId: string): Promise<ScriptureRecord | null> {
    const memory = this.corpusStore.getById(canonicalId);
    if (memory) return memory;

    try {
      const db = await connectToDatabase();
      if (db) {
        const found = await Scripture.findOne({ canonicalId }).lean();
        if (found) return found as unknown as ScriptureRecord;
      }
    } catch {
      // Fallback
    }

    return null;
  }

  async getAllVerses(): Promise<ScriptureRecord[]> {
    return this.corpusStore.getAll();
  }

  async getByChapter(chapter: number): Promise<ScriptureRecord[]> {
    return this.corpusStore.getByChapter(chapter);
  }
}

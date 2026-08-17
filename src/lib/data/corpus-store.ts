import { ScriptureRecord, ResolvedSource } from "@/types/scripture";
import gitaRaw from "../../../data/source/gita.json";

export class CorpusStore {
  private static instance: CorpusStore;
  private versesMap: Map<string, ScriptureRecord> = new Map();
  private allVerses: ScriptureRecord[] = [];

  private constructor() {
    this.loadCorpus();
  }

  public static getInstance(): CorpusStore {
    if (!CorpusStore.instance) {
      CorpusStore.instance = new CorpusStore();
    }
    return CorpusStore.instance;
  }

  private loadCorpus(): void {
    const rawList = gitaRaw as unknown as ScriptureRecord[];
    for (const raw of rawList) {
      const record: ScriptureRecord = {
        ...raw,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.versesMap.set(record.canonicalId, record);
      this.allVerses.push(record);
    }
  }

  public getAll(): ScriptureRecord[] {
    return this.allVerses;
  }

  public getById(canonicalId: string): ScriptureRecord | undefined {
    return this.versesMap.get(canonicalId.trim().toLowerCase());
  }

  public getByChapter(chapter: number): ScriptureRecord[] {
    return this.allVerses.filter((v) => v.chapter === chapter);
  }

  public searchByEmotion(emotion: string): ScriptureRecord[] {
    const norm = emotion.trim().toLowerCase();
    return this.allVerses.filter((v) =>
      v.retrievalMetadata.emotionalThemes.some(
        (t) => t.concept.toLowerCase().includes(norm) || norm.includes(t.concept.toLowerCase())
      )
    );
  }

  public searchByConcepts(concepts: string[]): ScriptureRecord[] {
    const normConcepts = concepts.map((c) => c.trim().toLowerCase());
    return this.allVerses.filter((v) =>
      v.retrievalMetadata.philosophicalConcepts.some((c) =>
        normConcepts.some((nc) => c.concept.toLowerCase().includes(nc) || nc.includes(c.concept.toLowerCase()))
      )
    );
  }

  public toResolvedSource(record: ScriptureRecord, relevanceScore: number = 1.0): ResolvedSource {
    return {
      canonicalId: record.canonicalId,
      sourceName: record.sourceName,
      chapter: record.chapter,
      verse: record.verse,
      originalText: record.originalText,
      transliteration: record.transliteration,
      wordMeanings: record.wordMeanings,
      translation: record.translation,
      commentary: record.sourceMetadata.commentary,
      commentator: record.sourceMetadata.commentator,
      translator: record.sourceMetadata.translator,
      relevanceScore,
      provenanceStatus: record.sourceMetadata.provenanceStatus,
      concepts: record.retrievalMetadata.philosophicalConcepts.map((c) => c.concept),
      themes: record.retrievalMetadata.emotionalThemes.map((t) => t.concept),
    };
  }
}

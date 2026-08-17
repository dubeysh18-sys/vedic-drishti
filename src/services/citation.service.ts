import { ResolvedSource } from "@/types/scripture";
import { CorpusStore } from "@/lib/data/corpus-store";
import { connectToDatabase } from "@/lib/db/connection";
import { Scripture } from "@/lib/db/models/scripture.model";
import { Logger } from "@/lib/observability/logger";

export class CitationService {
  private corpusStore = CorpusStore.getInstance();

  async resolveCitations(
    sourceIds: string[],
    allowedCandidateIds?: Set<string> | string[]
  ): Promise<ResolvedSource[]> {
    if (!sourceIds || !Array.isArray(sourceIds) || sourceIds.length === 0) {
      return [];
    }

    const candidateSet = allowedCandidateIds
      ? new Set(Array.from(allowedCandidateIds).map((id) => id.trim().toLowerCase()))
      : null;

    const resolved: ResolvedSource[] = [];
    const validCorpusPrefix = "gita:";
    const seenIds = new Set<string>();

    for (const rawId of sourceIds) {
      if (!rawId || typeof rawId !== "string") continue;
      const canonicalId = rawId.trim().toLowerCase();

      if (seenIds.has(canonicalId)) continue;
      seenIds.add(canonicalId);

      // Guard 1: Candidate set restriction (must have been retrieved by RAG)
      if (candidateSet && !candidateSet.has(canonicalId)) {
        Logger.warn("Discarding citation not present in retrieved candidate set", { canonicalId });
        continue;
      }

      // Guard 2: Must be in allowed canonical corpus
      if (!canonicalId.startsWith(validCorpusPrefix)) {
        Logger.warn("Discarding out-of-corpus citation ID", { canonicalId });
        continue;
      }

      let foundSource: ResolvedSource | null = null;

      // Guard 3: Try in-memory CorpusStore
      const memoryRecord = this.corpusStore.getById(canonicalId);
      if (memoryRecord) {
        foundSource = this.corpusStore.toResolvedSource(memoryRecord);
      } else {
        // Try MongoDB
        try {
          const db = await connectToDatabase();
          if (db) {
            const dbRecord = await Scripture.findOne({ canonicalId }).lean();
            if (dbRecord) {
              const rec = dbRecord as unknown as Parameters<typeof this.corpusStore.toResolvedSource>[0];
              foundSource = this.corpusStore.toResolvedSource(rec);
            }
          }
        } catch {
          // Ignore DB error
        }
      }

      if (foundSource) {
        resolved.push(foundSource);
      } else {
        Logger.warn("Discarding invalid/hallucinated sourceId", { canonicalId });
      }
    }

    return resolved;
  }
}

import * as fs from "fs";
import * as path from "path";
import { computeSha256, composeEmbeddingText } from "../../src/lib/utils/hash";
import { connectToDatabase } from "../../src/lib/db/connection";
import { Scripture } from "../../src/lib/db/models/scripture.model";
import { IngestionJob } from "../../src/lib/db/models/ingestion-job.model";
import { generateSessionId } from "../../src/lib/utils/id";

async function runIngestion() {
  console.log("=================================================");
  console.log("📦 DRISHTI IDEMPOTENT CORPUS INGESTION PIPELINE");
  console.log("=================================================\n");

  const gitaPath = path.join(process.cwd(), "data", "source", "gita.json");
  if (!fs.existsSync(gitaPath)) {
    console.error(`❌ Error: Corpus file not found at ${gitaPath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(gitaPath, "utf8");
  const verses = JSON.parse(rawData);
  console.log(`📖 Loaded ${verses.length} verses from ${gitaPath}`);

  let processed = 0;
  let skipped = 0;
  let updated = 0;
  const errors: { canonicalId: string; error: string }[] = [];

  const db = await connectToDatabase();
  const jobId = `job_${generateSessionId()}`;

  if (!db) {
    console.log("ℹ️ MongoDB URI not connected. Validating all records in-memory for integrity...");
    for (const v of verses) {
      if (!v.canonicalId || !v.originalText || !v.translation) {
        errors.push({ canonicalId: v.canonicalId || "unknown", error: "Missing required fields" });
      } else {
        processed++;
      }
    }
    console.log(`✅ In-memory verification complete: ${processed} valid verses, ${errors.length} errors.`);
    return;
  }

  console.log(`🔄 MongoDB connected. Running idempotent sync with database (Job ID: ${jobId})...`);

  for (const v of verses) {
    try {
      const canonicalId = v.canonicalId;
      const embeddingText = composeEmbeddingText(
        v.sourceName,
        v.chapter,
        v.verse,
        v.translation,
        (v.retrievalMetadata?.philosophicalConcepts || []).map((c: { concept: string }) => c.concept),
        (v.retrievalMetadata?.emotionalThemes || []).map((t: { concept: string }) => t.concept),
        (v.retrievalMetadata?.lifeSituations || []).map((s: { concept: string }) => s.concept)
      );
      const contentHash = computeSha256(embeddingText);

      const existing = (await Scripture.findOne({ canonicalId }).lean()) as unknown as {
        embedding?: { embeddedTextHash?: string };
        retrievalMetadata?: { metadataStatus?: string };
      } | null;

      if (!existing) {
        // Insert new record
        await Scripture.create({
          ...v,
          embedding: {
            vector: undefined,
            model: process.env.EMBEDDING_MODEL || "gemini-embedding-001",
            dimensions: Number(process.env.EMBEDDING_DIMENSIONS || 768),
            embeddingVersion: process.env.EMBEDDING_VERSION || "embedding-v1",
            embeddedTextHash: contentHash,
          },
        });
        processed++;
      } else if (existing.embedding?.embeddedTextHash === contentHash && existing.retrievalMetadata?.metadataStatus === "reviewed") {
        // Skip already reviewed record without hash change to preserve human edits
        skipped++;
      } else if (existing.embedding?.embeddedTextHash !== contentHash) {
        // Update content if hash changed while preserving reviewed status
        await Scripture.updateOne(
          { canonicalId },
          {
            $set: {
              originalText: v.originalText,
              transliteration: v.transliteration,
              translation: v.translation,
              wordMeanings: v.wordMeanings,
              "embedding.embeddedTextHash": contentHash,
            },
          }
        );
        updated++;
      } else {
        skipped++;
      }
    } catch (err) {
      errors.push({
        canonicalId: v.canonicalId,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // Record Ingestion Job Audit
  await IngestionJob.create({
    jobId,
    sourceCorpus: "gita",
    corpusVersion: "gita-v1.0",
    metadataVersion: "metadata-v1",
    embeddingVersion: "embedding-v1",
    status: errors.length > 0 ? "failed" : "completed",
    recordsProcessed: processed,
    recordsSkipped: skipped,
    recordsFailed: errors.length,
    jobErrors: errors,
    startedAt: new Date(),
    completedAt: new Date(),
  });

  console.log("\n=================================================");
  console.log("📊 INGESTION SUMMARY");
  console.log("=================================================");
  console.log(`Total Records:    ${verses.length}`);
  console.log(`New Inserted:     ${processed}`);
  console.log(`Updated:          ${updated}`);
  console.log(`Skipped (Cached): ${skipped}`);
  console.log(`Failed / Errors:  ${errors.length}`);
  console.log("=================================================\n");
}

runIngestion()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Ingestion failed:", err);
    process.exit(1);
  });

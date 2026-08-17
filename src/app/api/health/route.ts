import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connection";
import { CorpusStore } from "@/lib/data/corpus-store";

export async function GET() {
  let dbStatus: "connected" | "disconnected" | "in-memory" = "in-memory";
  try {
    const db = await connectToDatabase();
    if (db) {
      dbStatus = "connected";
    }
  } catch {
    dbStatus = "disconnected";
  }

  const store = CorpusStore.getInstance();
  const verseCount = store.getAll().length;

  return NextResponse.json(
    {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "0.1.0",
      database: dbStatus,
      corpusVersesLoaded: verseCount,
    },
    { status: 200 }
  );
}

import { NextResponse } from "next/server";
import { CorpusStore } from "@/lib/data/corpus-store";

export async function GET() {
  const store = CorpusStore.getInstance();
  const all = store.getAll();

  return NextResponse.json(
    {
      sourceCorpus: "gita",
      name: "Bhagavad Gita",
      chaptersCount: 18,
      totalVerses: all.length,
      provenanceStatus: "known",
      license: "Public Domain / CC0",
      contentVersion: "gita-v1.0",
    },
    { status: 200 }
  );
}

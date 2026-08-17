import { NextResponse } from "next/server";
import { CONTROLLED_EMOTIONS } from "@/lib/emotions/taxonomy";

export async function GET() {
  return NextResponse.json(
    {
      emotions: CONTROLLED_EMOTIONS,
      count: CONTROLLED_EMOTIONS.length,
    },
    { status: 200 }
  );
}

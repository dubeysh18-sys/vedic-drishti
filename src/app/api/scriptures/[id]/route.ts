import { NextRequest, NextResponse } from "next/server";
import { ScriptureService } from "@/services/scripture.service";

const scriptureService = new ScriptureService();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const decodedId = decodeURIComponent(id);
    const scripture = await scriptureService.getById(decodedId);

    if (!scripture) {
      return NextResponse.json({ error: "Scripture verse not found" }, { status: 404 });
    }

    return NextResponse.json(scripture, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

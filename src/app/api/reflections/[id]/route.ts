import { NextRequest, NextResponse } from "next/server";
import { ReflectionService } from "@/services/reflection.service";

const reflectionService = new ReflectionService();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reflection = await reflectionService.getReflectionById(id);

    if (!reflection) {
      return NextResponse.json({ error: "Reflection not found" }, { status: 404 });
    }

    return NextResponse.json(reflection, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

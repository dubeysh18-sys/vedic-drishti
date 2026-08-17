import { NextRequest, NextResponse } from "next/server";
import { FeedbackService } from "@/services/feedback.service";
import { CreateFeedbackSchema } from "@/lib/utils/validation";
import { Logger } from "@/lib/observability/logger";

const feedbackService = new FeedbackService();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = CreateFeedbackSchema.parse(body);

    const result = await feedbackService.saveFeedback(validated);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    Logger.error("API POST /api/feedback error", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid feedback request" },
      { status: 400 }
    );
  }
}

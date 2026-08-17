import { CreateFeedbackRequest, CreateFeedbackResponse } from "@/types/api";
import { generateFeedbackId } from "@/lib/utils/id";
import { connectToDatabase } from "@/lib/db/connection";
import { Feedback } from "@/lib/db/models/feedback.model";
import { Logger } from "@/lib/observability/logger";

export class FeedbackService {
  private inMemoryFeedback: Map<string, CreateFeedbackRequest & { feedbackId: string; createdAt: Date }> = new Map();

  async saveFeedback(request: CreateFeedbackRequest): Promise<CreateFeedbackResponse> {
    const feedbackId = generateFeedbackId();
    const entry = {
      ...request,
      feedbackId,
      createdAt: new Date(),
    };

    this.inMemoryFeedback.set(feedbackId, entry);

    try {
      const db = await connectToDatabase();
      if (db) {
        await Feedback.create({
          feedbackId,
          messageId: request.messageId,
          sessionId: request.sessionId,
          rating: request.rating,
          comment: request.comment || null,
        });
      }
    } catch (err) {
      Logger.warn("Failed to persist feedback to MongoDB, saved in-memory", { error: err instanceof Error ? err.message : String(err) });
    }

    Logger.info("Feedback received", { feedbackId, rating: request.rating, messageId: request.messageId });
    return {
      success: true,
      feedbackId,
    };
  }
}

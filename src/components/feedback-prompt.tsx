"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, CheckCircle, Send } from "lucide-react";

interface FeedbackPromptProps {
  messageId: string;
  sessionId: string;
}

export default function FeedbackPrompt({ messageId, sessionId }: FeedbackPromptProps) {
  const [submitted, setSubmitted] = useState(false);
  const [selectedRating, setSelectedRating] = useState<"helpful" | "notQuite" | null>(null);
  const [comment, setComment] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);

  const handleRating = async (rating: "helpful" | "notQuite") => {
    setSelectedRating(rating);
    setShowCommentBox(true);

    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId,
          sessionId,
          rating,
        }),
      });
    } catch {
      // Ignore
    }
  };

  const handleCommentSubmit = async () => {
    if (!selectedRating) return;

    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId,
          sessionId,
          rating: selectedRating,
          comment,
        }),
      });
    } catch {
      // Ignore
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-2 text-xs font-sans text-muted-stone py-3">
        <CheckCircle className="w-4 h-4 text-gold-muted" />
        <span>Thank you for helping Drishti refine its reflections.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 py-4 border-t border-outline-variant/30 mt-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-sans text-muted-stone">Was this perspective helpful?</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleRating("helpful")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-medium flex items-center gap-1.5 transition-all ${
              selectedRating === "helpful"
                ? "bg-secondary-container text-on-secondary-container font-semibold"
                : "bg-surface-container hover:bg-surface-container-high text-primary border border-outline-variant/40"
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            That helped
          </button>
          <button
            type="button"
            onClick={() => handleRating("notQuite")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-medium flex items-center gap-1.5 transition-all ${
              selectedRating === "notQuite"
                ? "bg-stone-200 text-stone-900 font-semibold"
                : "bg-surface-container hover:bg-surface-container-high text-primary border border-outline-variant/40"
            }`}
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            Not quite
          </button>
        </div>
      </div>

      {showCommentBox && !submitted && (
        <div className="flex items-center gap-2 mt-2 animate-slide-up">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Any thought on how to make this more insightful? (Optional)"
            className="flex-1 text-xs font-sans px-3.5 py-2 rounded-lg bg-surface-container border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-gold"
          />
          <button
            type="button"
            onClick={handleCommentSubmit}
            className="p-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import React from "react";
import { GuidedQuestion } from "@/types/guided-question";
import { Sparkles } from "lucide-react";

interface GuidedQuestionsPillsProps {
  questions: GuidedQuestion[];
  selectedQuestionId: string | null;
  onSelectQuestion: (question: GuidedQuestion) => void;
  className?: string;
}

export default function GuidedQuestionsPills({
  questions,
  selectedQuestionId,
  onSelectQuestion,
  className = "",
}: GuidedQuestionsPillsProps) {
  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <div
      className={`w-full max-w-2xl mx-auto flex flex-col items-center gap-2.5 animate-fade-in transition-all ${className}`}
    >
      <div className="flex items-center gap-1.5 text-xs font-sans font-medium text-gold-muted tracking-wide">
        <Sparkles className="w-3.5 h-3.5 text-gold-muted shrink-0" />
        <span>Want to explore what&apos;s behind it?</span>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-2.5 w-full">
        {questions.map((q) => {
          const isSelected = selectedQuestionId === q.id;
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onSelectQuestion(q)}
              aria-pressed={isSelected}
              aria-label={q.text}
              className={`text-xs sm:text-[13px] leading-relaxed px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full font-sans transition-all duration-200 active:scale-95 text-center cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-gold ${
                isSelected
                  ? "bg-secondary-container text-on-secondary-container border border-gold font-medium shadow-xs ring-1 ring-gold/40 scale-[1.02]"
                  : "bg-surface-container/70 text-on-surface-variant hover:bg-white hover:text-primary hover:border-gold/50 border border-outline-variant/40 shadow-2xs"
              }`}
            >
              {q.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}

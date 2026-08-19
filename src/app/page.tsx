"use client";

import { useState, useRef, useEffect } from "react";
import EmotionGrid from "@/components/emotion-grid";
import ReflectionInput from "@/components/reflection-input";
import GuidedQuestionsPills from "@/components/guided-questions-pills";
import LoadingView from "@/components/loading-view";
import ReflectionResponse from "@/components/reflection-response";
import { EmotionDefinition } from "@/types/emotion";
import { GuidedQuestion } from "@/types/guided-question";
import { ReflectionMessageResponse } from "@/types/reflection";
import { getGuidedQuestionsForEmotion, getGuidedQuestionById } from "@/lib/emotions/guided-questions";
import { saveChatToHistory } from "@/lib/storage/history-store";
import LotusIcon from "@/components/lotus-icon";

export default function HomePage() {
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionDefinition | null>(null);
  const [selectedGuidedQuestion, setSelectedGuidedQuestion] = useState<GuidedQuestion | null>(null);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reflectionResult, setReflectionResult] = useState<ReflectionMessageResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputSectionRef = useRef<HTMLDivElement>(null);

  const guidedQuestions = getGuidedQuestionsForEmotion(selectedEmotion?.id);

  const handleReset = () => {
    setReflectionResult(null);
    setInputText("");
    setSelectedEmotion(null);
    setSelectedGuidedQuestion(null);
    setError(null);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleNewReflectionEvent = () => {
      handleReset();
    };

    const handleLoadReflectionEvent = (e: Event) => {
      const customEvent = e as CustomEvent<ReflectionMessageResponse>;
      if (customEvent.detail) {
        setIsLoading(false);
        setError(null);
        setReflectionResult(customEvent.detail);
        if (customEvent.detail.guidedQuestionId) {
          const found = getGuidedQuestionById(customEvent.detail.guidedQuestionId);
          setSelectedGuidedQuestion(
            found ||
              (customEvent.detail.guidedQuestion
                ? {
                    id: customEvent.detail.guidedQuestionId,
                    text: customEvent.detail.guidedQuestion,
                    emotionId: customEvent.detail.selectedEmotion || "",
                  }
                : null)
          );
        } else {
          setSelectedGuidedQuestion(null);
        }
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    };

    window.addEventListener("drishti:new-reflection", handleNewReflectionEvent);
    window.addEventListener("drishti:load-reflection", handleLoadReflectionEvent);

    return () => {
      window.removeEventListener("drishti:new-reflection", handleNewReflectionEvent);
      window.removeEventListener("drishti:load-reflection", handleLoadReflectionEvent);
    };
  }, []);

  const handleSelectEmotion = (emotion: EmotionDefinition) => {
    if (selectedEmotion?.id === emotion.id) {
      setSelectedEmotion(null);
      setSelectedGuidedQuestion(null);
    } else {
      setSelectedEmotion(emotion);
      setSelectedGuidedQuestion(null);

      // Smooth scroll to input section on mobile & desktop
      setTimeout(() => {
        inputSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  };

  const handleSelectGuidedQuestion = (question: GuidedQuestion) => {
    if (selectedGuidedQuestion?.id === question.id) {
      setSelectedGuidedQuestion(null);
    } else {
      setSelectedGuidedQuestion(question);
    }
  };

  const handleSubmit = async () => {
    let message = inputText.trim();

    // If user has not typed free-form text but selected an emotion,
    // explicitly treat as emotion-only reflection
    if (!message && selectedEmotion) {
      message = `I am feeling ${selectedEmotion.id}`;
    }

    if (!message) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/reflections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          selectedEmotion: selectedEmotion?.id,
          guidedQuestionId: selectedGuidedQuestion?.id,
          guidedQuestion: selectedGuidedQuestion?.text,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to generate reflection: ${res.statusText}`);
      }

      const data: ReflectionMessageResponse = await res.json();
      setReflectionResult(data);
      // Automatically cache reflection to history
      saveChatToHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingView />;
  }

  if (reflectionResult) {
    return <ReflectionResponse data={reflectionResult} onReset={handleReset} />;
  }

  return (
    <div className="flex-1 flex flex-col items-center pt-20 md:pt-24 pb-16 px-4 md:px-6 max-w-container-max mx-auto w-full gap-5 md:gap-6">
      {/* Hero Section - Centered with balanced typography and subtext spacing (US-01) */}
      <section className="text-center max-w-xl mx-auto flex flex-col items-center gap-2.5 sm:gap-3">
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-primary tracking-tight leading-snug">
          What are you carrying today?
        </h1>

        <p className="font-sans text-xs sm:text-sm text-muted-stone max-w-md leading-relaxed text-center">
          Tell us what&apos;s on your mind. We&apos;ll find a perspective in timeless Vedic wisdom.
        </p>
      </section>

      {/* Error display if any */}
      {error && (
        <div className="w-full max-w-xl bg-error-container text-on-error-container p-3.5 rounded-xl text-xs font-sans text-center">
          {error}
        </div>
      )}

      {/* Emotion Grid (12 Organic Pebble Cards) */}
      <EmotionGrid
        selectedEmotionId={selectedEmotion?.id || null}
        onSelectEmotion={handleSelectEmotion}
      />

      {/* Ornate Lotus Divider with brand LotusIcon (US-04) */}
      <div className="flex items-center justify-center gap-3 py-1 w-full max-w-xl mx-auto opacity-40">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-muted to-transparent"></div>
        <LotusIcon className="w-4 h-4 text-gold-muted shrink-0" />
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-muted to-transparent"></div>
      </div>

      {/* Guided Thought Prompts (US-01 to US-04) */}
      {selectedEmotion && guidedQuestions.length > 0 && (
        <GuidedQuestionsPills
          questions={guidedQuestions}
          selectedQuestionId={selectedGuidedQuestion?.id || null}
          onSelectQuestion={handleSelectGuidedQuestion}
        />
      )}

      {/* Journaling Textarea + Find Perspective Action */}
      <div ref={inputSectionRef} className="w-full">
        <ReflectionInput
          value={inputText}
          onChange={setInputText}
          onSubmit={handleSubmit}
          selectedEmotionId={selectedEmotion?.id}
          selectedEmotionName={selectedEmotion?.name}
          selectedGuidedQuestion={selectedGuidedQuestion}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

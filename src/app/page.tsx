"use client";

import { useState, useRef, useEffect } from "react";
import EmotionGrid from "@/components/emotion-grid";
import ReflectionInput from "@/components/reflection-input";
import LoadingView from "@/components/loading-view";
import ReflectionResponse from "@/components/reflection-response";
import { EmotionDefinition } from "@/types/emotion";
import { getEmotionPromptStarter } from "@/lib/emotions/taxonomy";
import { ReflectionMessageResponse } from "@/types/reflection";
import { saveChatToHistory } from "@/lib/storage/history-store";
import { Sparkles } from "lucide-react";

export default function HomePage() {
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionDefinition | null>(null);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reflectionResult, setReflectionResult] = useState<ReflectionMessageResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputSectionRef = useRef<HTMLDivElement>(null);

  const handleReset = () => {
    setReflectionResult(null);
    setInputText("");
    setSelectedEmotion(null);
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
      setInputText("");
    } else {
      setSelectedEmotion(emotion);
      setInputText(getEmotionPromptStarter(emotion.id));

      // Auto-scroll to chat/input section on mobile & desktop
      setTimeout(() => {
        inputSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  };

  const handleSubmit = async () => {
    const message = inputText.trim();
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
    <div className="flex-1 flex flex-col items-center pt-20 md:pt-24 pb-28 px-4 md:px-8 max-w-container-max mx-auto w-full gap-8 md:gap-10">
      {/* Hero Section - Directly starting with single-line title */}
      <section className="text-center max-w-2xl mx-auto flex flex-col items-center gap-2">
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-primary tracking-tight leading-tight whitespace-nowrap">
          What are you carrying today?
        </h1>

        <p className="font-sans text-sm md:text-base text-muted-stone max-w-lg leading-relaxed">
          Select an emotion below or journal your thoughts to find a timeless perspective from the Bhagavad Gita.
        </p>
      </section>

      {/* Error display if any */}
      {error && (
        <div className="w-full max-w-xl bg-error-container text-on-error-container p-4 rounded-xl text-sm font-sans text-center">
          {error}
        </div>
      )}

      {/* Emotion Grid (12 Organic Pebble Cards) */}
      <EmotionGrid
        selectedEmotionId={selectedEmotion?.id || null}
        onSelectEmotion={handleSelectEmotion}
      />

      {/* Ornate Lotus Divider */}
      <div className="flex items-center justify-center gap-4 py-2 w-full max-w-2xl mx-auto opacity-40">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-muted to-transparent"></div>
        <Sparkles className="w-4 h-4 text-gold-muted shrink-0" />
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-muted to-transparent"></div>
      </div>

      {/* Journaling Textarea + Find Perspective Action */}
      <div ref={inputSectionRef} className="w-full">
        <ReflectionInput
          value={inputText}
          onChange={setInputText}
          onSubmit={handleSubmit}
          selectedEmotionName={selectedEmotion?.name}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

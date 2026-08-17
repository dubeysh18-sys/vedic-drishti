"use client";

import { useState } from "react";
import { ReflectionMessageResponse } from "@/types/reflection";
import SourceCitation from "./source-citation";
import FeedbackPrompt from "./feedback-prompt";
import TrustLayerIndicator from "./trust-layer-indicator";
import SafetyBanner from "./safety-banner";
import { MahamantraRedirect } from "./mahamantra-redirect";
import { NoMatchView } from "./no-match-view";
import { Bookmark, Sparkles, CheckCircle, ArrowLeft, RefreshCw, Layers } from "lucide-react";
import Link from "next/link";

interface ReflectionResponseProps {
  data: ReflectionMessageResponse;
  onReset?: () => void;
}

export default function ReflectionResponse({ data, onReset }: ReflectionResponseProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSave = () => {
    // Save to local storage for offline archive access
    try {
      const existing = JSON.parse(localStorage.getItem("drishti_saved_reflections") || "[]");
      if (!existing.some((r: ReflectionMessageResponse) => r.id === data.id)) {
        existing.unshift(data);
        localStorage.setItem("drishti_saved_reflections", JSON.stringify(existing));
      }
    } catch {
      // Ignore
    }

    setIsSaved(true);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3200);
  };

  // 1. Crisis Response
  if ((data.responseType === "crisis" || data.ragOutcome === "crisis") && data.crisisResponse) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <SafetyBanner
          acknowledgment={data.crisisResponse.acknowledgment}
          resources={data.crisisResponse.resources}
          disclaimer={data.crisisResponse.disclaimer}
        />
        {onReset && (
          <div className="flex justify-center mt-6">
            <button
              onClick={onReset}
              className="px-6 py-3 rounded-full bg-surface-container font-sans text-sm font-semibold text-primary hover:bg-white transition-all shadow-sm"
            >
              Start New Reflection
            </button>
          </div>
        )}
      </div>
    );
  }

  // 2. Safety Redirect (Mahamantra Calm UI)
  if (data.responseType === "safety_redirect") {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <MahamantraRedirect
          mahamantraData={data.mahamantraResponse}
          onNewReflection={onReset || (() => window.location.reload())}
        />
      </div>
    );
  }

  // 3. No Match / Honest Uncertainty
  if (data.responseType === "no_match") {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <NoMatchView
          reflection={data.reflection}
          onNewReflection={onReset || (() => window.location.reload())}
        />
      </div>
    );
  }

  // 4. Standard 5-Section Grounded Reflection
  const { reflection, sources, userInput } = data;

  return (
    <div className="w-full max-w-2xl mx-auto px-6 pt-4 pb-36 animate-slide-up">
      {/* Top back navigation */}
      <div className="flex justify-between items-center mb-8">
        {onReset ? (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest font-sans text-muted-stone hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            New Reflection
          </button>
        ) : (
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest font-sans text-muted-stone hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
        )}

        <div className="flex items-center gap-2">
          <TrustLayerIndicator layer="ai" />
        </div>
      </div>

      {/* User Message Summary Bubble */}
      <div className="flex justify-end mb-10">
        <div className="bg-surface-container/90 rounded-2xl rounded-tr-xs px-5 py-4 max-w-[85%] shadow-sm border border-outline-variant/40">
          <span className="text-[10px] uppercase tracking-widest font-bold text-muted-stone block mb-1 font-sans">
            Your Expression
          </span>
          <p className="font-sans text-base text-on-surface leading-relaxed">{userInput}</p>
        </div>
      </div>

      {reflection && (
        <div className="flex flex-col gap-10">
          {/* Section 1: WHAT I HEAR */}
          <section>
            <h2 className="kicker">What I Hear</h2>
            <p className="body-text">{reflection.whatIHear}</p>
          </section>

          {/* Section 2: A PERSPECTIVE TO SIT WITH */}
          <section>
            <h2 className="kicker text-gold-muted flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> A Perspective to Sit With
            </h2>

            {sources && sources.length > 0 ? (
              sources.map((source) => <SourceCitation key={source.canonicalId} source={source} />)
            ) : (
              <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30 text-center my-6">
                <p className="font-serif italic text-muted-stone text-base leading-relaxed">
                  {reflection.perspectiveFromText}
                </p>
              </div>
            )}
          </section>

          {/* Section 3: THE TEACHING */}
          {reflection.teaching && (
            <section>
              <h2 className="kicker">The Teaching</h2>
              <p className="body-text">{reflection.teaching}</p>
            </section>
          )}

          {/* Section 4: FOR YOUR SITUATION */}
          <section>
            <h2 className="kicker">For Your Situation</h2>
            <p className="body-text">{reflection.application}</p>
          </section>

          {/* Section 5: REFLECT ON THIS (Parchment Deep Card) */}
          <section>
            <div className="bg-parchment-deep border border-gold-muted/40 rounded-2xl p-7 md:p-9 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Sparkles className="w-20 h-20 text-gold" />
              </div>
              <h2 className="kicker text-gold-muted mb-4">Reflect on This</h2>
              <p className="font-serif font-semibold text-2xl md:text-3xl text-primary leading-tight">
                {reflection.reflectionQuestion}
              </p>
            </div>
          </section>

          {/* Feedback Prompt */}
          <FeedbackPrompt messageId={data.id} sessionId={data.sessionId} />
        </div>
      )}

      {/* Sticky Bottom Action Bar from Stitch design */}
      <div className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-background via-background/95 to-transparent pt-12 pb-6 px-4 md:px-6 z-30">
        <div className="max-w-2xl mx-auto flex gap-3 overflow-x-auto no-scrollbar snap-x pb-2">
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="snap-start shrink-0 px-5 py-3 bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 text-on-surface font-sans text-xs md:text-sm font-semibold rounded-full transition-all whitespace-nowrap shadow-sm flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-gold-muted" />
              New perspective
            </button>
          )}

          <Link
            href="/about"
            className="snap-start shrink-0 px-5 py-3 bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 text-on-surface font-sans text-xs md:text-sm font-semibold rounded-full transition-all whitespace-nowrap shadow-sm flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-gold-muted" />
            Trust layers
          </Link>

          <button
            type="button"
            onClick={handleSave}
            className={`snap-start shrink-0 px-6 py-3 font-sans text-xs md:text-sm font-semibold rounded-full transition-all whitespace-nowrap shadow-sm flex items-center gap-2 border ${
              isSaved
                ? "bg-surface-container-highest text-primary border-gold/40"
                : "bg-primary text-white hover:bg-primary/90 border-gold/30"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? "text-gold fill-gold" : "text-gold-muted"}`} />
            {isSaved ? "Saved to Archive" : "Save reflection"}
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="bg-primary text-white px-6 py-3 rounded-full font-sans text-xs md:text-sm shadow-xl flex items-center gap-2.5 whitespace-nowrap border border-gold/40">
            <CheckCircle className="w-4 h-4 text-gold" />
            Reflection saved to your archive
          </div>
        </div>
      )}
    </div>
  );
}

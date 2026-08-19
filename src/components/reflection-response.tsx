"use client";

import { useState } from "react";
import { ReflectionMessageResponse } from "@/types/reflection";
import SourceCitation from "./source-citation";
import FeedbackPrompt from "./feedback-prompt";
import TrustLayerIndicator from "./trust-layer-indicator";
import SafetyBanner from "./safety-banner";
import { MahamantraRedirect } from "./mahamantra-redirect";
import { NoMatchView } from "./no-match-view";
import { Bookmark, CheckCircle, ArrowLeft, RefreshCw, Layers } from "lucide-react";
import Link from "next/link";
import LotusIcon from "@/components/lotus-icon";

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
  if ((data.responseType === "crisis" || data.ragOutcome === "crisis" || data.safetyMetadata?.isCrisis) && data.crisisResponse) {
    return (
      <div className="max-w-3xl mx-auto px-6 pt-20 md:pt-24 pb-28">
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
  if (data.responseType === "safety_redirect" || (data.isMahamantraRedirect && data.mahamantraData)) {
    return (
      <div className="max-w-3xl mx-auto px-6 pt-20 md:pt-24 pb-28">
        <MahamantraRedirect
          mahamantraData={data.mahamantraResponse || {
            title: data.mahamantraData?.title || "Hare Krishna Mahamantra",
            mantra: data.mahamantraData?.mantra || "हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे । हरे राम हरे राम राम राम हरे हरे ॥",
            transliteration: "Hare Kṛṣṇa Hare Kṛṣṇa Kṛṣṇa Kṛṣṇa Hare Hare | Hare Rāma Hare Rāma Rāma Rāma Hare Hare",
            meaning: "O Lord, O Energy of the Lord, please engage me in Your service with devotion and equanimity.",
            source: "Kali Santarana Upanishad",
            canonicalId: "ks-upanishad:1:1",
            context: data.mahamantraData?.guidance || "Chanted for spiritual clarity, focus, and calming the restless mind.",
            audioUrl: undefined,
          }}
          onNewReflection={onReset || (() => window.location.reload())}
        />
      </div>
    );
  }

  // 3. No Match / Honest Uncertainty
  if (data.responseType === "no_match") {
    return (
      <div className="max-w-3xl mx-auto px-6 pt-20 md:pt-24 pb-28">
        <NoMatchView
          reflection={data.reflection}
          onNewReflection={onReset || (() => window.location.reload())}
        />
      </div>
    );
  }

  // 4. Prohibited Content Safety Redirect Gate
  if (data.safetyMetadata?.isProhibited) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 pt-20 md:pt-24 pb-28 animate-slide-up">
        {/* Top back navigation */}
        <div className="flex justify-between items-center mb-6">
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
          <TrustLayerIndicator layer="crisis" />
        </div>

        <div className="bg-surface-container border border-outline-variant/50 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col gap-4 text-center">
          <h2 className="font-serif font-bold text-xl text-primary">Content Boundary Notice</h2>
          <p className="font-sans text-sm text-muted-stone leading-relaxed">
            Drishti holds sacred philosophical space for emotional and spiritual reflection. We cannot generate advice or perspectives related to prohibited, violent, medical, or legal queries.
          </p>
        </div>
      </div>
    );
  }

  // 5. Standard 5-Section Grounded Reflection
  const { reflection, sources, userInput } = data;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 pt-20 md:pt-24 pb-28 animate-slide-up">
      {/* Top back navigation */}
      <div className="flex items-center mb-6">
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
      </div>

      {/* User Message Summary Bubble - Left-aligned flush with content grid (US 2) */}
      <div className="flex justify-start mb-5">
        <div className="bg-surface-container/90 rounded-2xl rounded-tl-xs px-4.5 py-3 max-w-[90%] sm:max-w-[85%] shadow-sm border border-outline-variant/40 overflow-visible">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-widest font-bold text-muted-stone block mb-1 font-sans leading-normal">
            Your Expression
          </span>
          <p className="font-sans text-sm sm:text-base text-on-surface leading-relaxed">{userInput}</p>
        </div>
      </div>

      {reflection && (
        <div className="flex flex-col gap-4 md:gap-5">
          {/* Section 1: WHAT I HEAR */}
          <section>
            <h2 className="kicker mb-1">What I Hear</h2>
            <p className="body-text text-base leading-relaxed">{reflection.whatIHear}</p>
          </section>

          {/* Section 2: A PERSPECTIVE TO SIT WITH (US-04 LotusIcon) */}
          <section>
            <h2 className="kicker text-gold-muted flex items-center gap-1.5 mb-1">
              <LotusIcon className="w-3.5 h-3.5 text-gold-muted shrink-0" /> A Perspective to Sit With
            </h2>

            {sources && sources.length > 0 ? (
              sources.map((source) => <SourceCitation key={source.canonicalId} source={source} />)
            ) : (
              <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/30 text-center my-3">
                <p className="font-serif italic text-muted-stone text-sm sm:text-base leading-relaxed">
                  {reflection.perspectiveFromText}
                </p>
              </div>
            )}
          </section>

          {/* Section 3: THE TEACHING */}
          {reflection.teaching && (
            <section>
              <h2 className="kicker mb-1">The Teaching</h2>
              <p className="body-text text-base leading-relaxed">{reflection.teaching}</p>
            </section>
          )}

          {/* Section 4: FOR YOUR SITUATION */}
          <section>
            <h2 className="kicker mb-1">For Your Situation</h2>
            <p className="body-text text-base leading-relaxed">{reflection.application}</p>
          </section>

          {/* Section 5: REFLECT ON THIS (Parchment Deep Card with LotusIcon Watermark - US-04) */}
          <section>
            <div className="bg-parchment-deep border border-gold-muted/40 rounded-xl p-4 sm:p-5 md:p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                <LotusIcon className="w-16 h-16 text-gold" />
              </div>
              <h2 className="kicker text-gold-muted mb-2">Reflect on This</h2>
              <p className="font-serif font-semibold text-xl md:text-2xl text-primary leading-snug">
                {reflection.reflectionQuestion}
              </p>
            </div>
          </section>

          {/* Feedback Prompt */}
          <FeedbackPrompt messageId={data.id} sessionId={data.sessionId} />
        </div>
      )}

      {/* Sticky Bottom Action Bar from Stitch design (US-06 & US-08) */}
      <div className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-background via-background/95 to-transparent pt-4 pb-3 px-2.5 sm:px-4 md:px-6 z-30">
        <div className="max-w-2xl mx-auto grid grid-cols-3 gap-2 sm:gap-3 w-full">
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              aria-label="Start a new reflection"
              className="w-full h-10 sm:h-11 px-2 sm:px-3 bg-white/90 hover:bg-white border-2 border-primary/20 hover:border-primary/40 active:scale-95 text-primary font-sans text-xs sm:text-sm font-semibold rounded-full transition-all shadow-2xs flex items-center justify-center gap-1.5 text-center min-w-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-gold"
            >
              <RefreshCw className="w-3.5 h-3.5 text-gold-muted shrink-0" />
              <span className="truncate">New Perspective</span>
            </button>
          )}

          <Link
            href="/about"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.scrollTo({ top: 0, left: 0, behavior: "instant" });
              }
            }}
            aria-label="View 4-layer trust model"
            className="w-full h-10 sm:h-11 px-2 sm:px-3 bg-surface-container/80 hover:bg-surface-container-high border border-outline-variant/40 active:scale-95 text-muted-stone hover:text-primary font-sans text-xs sm:text-sm font-medium rounded-full transition-all shadow-2xs flex items-center justify-center gap-1.5 text-center min-w-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-gold"
          >
            <Layers className="w-3.5 h-3.5 text-gold-muted shrink-0" />
            <span className="truncate">Trust Layers</span>
          </Link>

          <button
            type="button"
            onClick={handleSave}
            aria-label={isSaved ? "Saved to your reflections" : "Save this reflection"}
            className={`w-full h-10 sm:h-11 px-2 sm:px-3 font-sans text-xs sm:text-sm font-semibold rounded-full transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5 text-center min-w-0 border focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-gold ${
              isSaved
                ? "bg-surface-container-highest text-primary border-gold/40"
                : "bg-primary text-white hover:bg-primary/90 border-gold/30"
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 shrink-0 ${isSaved ? "text-gold fill-gold" : "text-gold-muted"}`} />
            <span className="truncate">{isSaved ? "Saved" : "Save"}</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="bg-primary text-white px-5 py-2.5 rounded-full font-sans text-xs md:text-sm shadow-xl flex items-center gap-2 whitespace-nowrap border border-gold/40">
            <CheckCircle className="w-4 h-4 text-gold" />
            Reflection saved to your archive
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { ResolvedSource } from "@/types/scripture";
import TrustLayerIndicator from "./trust-layer-indicator";
import { ChevronDown, ChevronUp, Sparkles, BookOpen, Layers } from "lucide-react";

interface SourceCitationProps {
  source: ResolvedSource;
}

export default function SourceCitation({ source }: SourceCitationProps) {
  const [expanded, setExpanded] = useState(true);
  const [showConcepts, setShowConcepts] = useState(false);

  const hasConceptsOrMeanings =
    Boolean(source.wordMeanings) || (Array.isArray(source.concepts) && source.concepts.length > 0);

  return (
    <div className="w-full my-6 bg-surface-container/80 rounded-2xl border border-gold/30 shadow-soft overflow-hidden transition-all">
      {/* Header Bar */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="px-6 py-4 bg-gradient-to-r from-surface-container-high/90 to-surface-container/70 flex justify-between items-center cursor-pointer select-none border-b border-outline-variant/30"
      >
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-parchment-deep/90 border border-gold/40 flex items-center justify-center text-gold-muted">
            <BookOpen className="w-4 h-4" />
          </span>
          <div>
            <h4 className="font-serif font-bold text-base md:text-lg text-primary">
              {source.sourceName} {source.chapter}.{source.verse}
            </h4>
            {/* <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] text-muted-stone font-sans tracking-wide uppercase">
                Canonical ID: {source.canonicalId}
              </span>
              <span className="text-muted-stone text-xs">•</span>
              <span className="text-[11px] text-gold-muted font-sans font-medium">
                Relevance: {Math.round(source.relevanceScore * 100)}%
              </span>
            </div> */}
          </div>
        </div>

        <button
          type="button"
          className="p-1.5 rounded-full hover:bg-white/50 text-muted-stone transition-colors"
          aria-label={expanded ? "Collapse verse" : "Expand verse"}
        >
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="p-6 md:p-8 flex flex-col gap-6 animate-slide-up">
          {/* Trust Layer Badges */}
          {/* <div className="flex flex-wrap items-center gap-2">
            <TrustLayerIndicator layer="original" />
            <TrustLayerIndicator layer="translation" />
            {source.commentary && <TrustLayerIndicator layer="commentary" />}
          </div> */}

          {/* Section: Sanskrit Original Text (Devanagari) */}
          <div className="text-center relative py-4">
            <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-10">
              <Sparkles className="w-24 h-24 text-gold" />
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gold-muted to-transparent mb-6"></div>

            <p className="font-devanagari text-2xl md:text-3xl text-primary font-semibold leading-relaxed tracking-wide whitespace-pre-line">
              {source.originalText}
            </p>

            <div className="h-px bg-gradient-to-r from-transparent via-gold-muted to-transparent mt-6 mb-6"></div>

            {/* IAST Transliteration */}
            <p className="font-serif italic text-sm md:text-base text-muted-stone leading-relaxed whitespace-pre-line max-w-xl mx-auto">
              {source.transliteration}
            </p>
          </div>

          {/* English Translation */}
          <div className="bg-parchment-deep/50 rounded-xl p-5 border border-gold-muted/20">
            <span className="kicker text-gold-muted block mb-1">Translation</span>
            <p className="font-serif text-lg md:text-xl leading-relaxed italic text-on-surface">
              &ldquo;{source.translation}&rdquo;
            </p>
            {source.translator && (
              <span className="block text-right text-xs text-muted-stone mt-2 font-sans">
                — {source.translator}
              </span>
            )}
          </div>

          {/* Collapsible Concepts Section (contains Word Meanings and Themes) */}
          {hasConceptsOrMeanings && (
            <div className="rounded-xl border border-outline-variant/30 bg-surface-container/60 overflow-hidden transition-all">
              <div
                onClick={() => setShowConcepts(!showConcepts)}
                className="flex items-center justify-between px-4 py-3 cursor-pointer select-none bg-surface-container-high/60 hover:bg-surface-container-high transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-gold-muted" />
                  <span className="text-xs font-semibold uppercase tracking-wider font-sans text-primary">
                    Concepts
                  </span>
                </div>
                <button
                  type="button"
                  className="p-1 text-muted-stone hover:text-primary transition-transform"
                  aria-label={showConcepts ? "Collapse concepts" : "Expand concepts"}
                >
                  {showConcepts ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>

              {showConcepts && (
                <div className="p-4 flex flex-col gap-4 border-t border-outline-variant/20 animate-slide-up bg-surface/40">
                  {/* Word Meanings */}
                  {source.wordMeanings && (
                    <div className="text-xs text-muted-stone font-sans leading-relaxed bg-white/50 p-3.5 rounded-lg border border-outline-variant/20">
                      <span className="font-bold text-on-surface uppercase tracking-wider text-[10px] block mb-1">
                        Word Meanings:
                      </span>
                      {source.wordMeanings}
                    </div>
                  )}

                  {/* Themes (Renamed from Concepts) */}
                  {source.concepts && source.concepts.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs text-muted-stone font-sans flex items-center gap-1 mr-1">
                        <Layers className="w-3.5 h-3.5 text-gold-muted" /> Themes:
                      </span>
                      {source.concepts.map((c) => (
                        <span
                          key={c}
                          className="px-2.5 py-0.5 rounded-full text-xs bg-surface-container-highest text-on-surface-variant font-sans border border-outline-variant/30 shadow-2xs"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

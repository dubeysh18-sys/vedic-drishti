"use client";

import { useState } from "react";
import { ResolvedSource } from "@/types/scripture";
import TrustLayerIndicator from "./trust-layer-indicator";
import { ChevronDown, ChevronUp, BookOpen, Layers } from "lucide-react";
import LotusIcon from "@/components/lotus-icon";

interface SourceCitationProps {
  source: ResolvedSource;
}

export default function SourceCitation({ source }: SourceCitationProps) {
  const [expanded, setExpanded] = useState(true);
  const [showConcepts, setShowConcepts] = useState(false);

  const hasConceptsOrMeanings =
    Boolean(source.wordMeanings) || (Array.isArray(source.concepts) && source.concepts.length > 0);

  return (
    <div className="w-full my-3 bg-surface-container/80 rounded-xl border border-gold/30 shadow-soft overflow-hidden transition-all">
      {/* Header Bar */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="px-4 py-2.5 bg-gradient-to-r from-surface-container-high/90 to-surface-container/70 flex justify-between items-center cursor-pointer select-none border-b border-outline-variant/30"
      >
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-full bg-parchment-deep/90 border border-gold/40 flex items-center justify-center text-gold-muted shrink-0">
            <BookOpen className="w-3.5 h-3.5" />
          </span>
          <div>
            <h4 className="font-serif font-bold text-sm md:text-base text-primary">
              {source.sourceName} {source.chapter}.{source.verse}
            </h4>
          </div>
        </div>

        <button
          type="button"
          className="p-1 rounded-full hover:bg-white/50 text-muted-stone transition-colors"
          aria-label={expanded ? "Collapse verse" : "Expand verse"}
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="p-4 sm:p-5 flex flex-col gap-3.5 animate-slide-up">
          {/* Section: Sanskrit Original Text (Devanagari) */}
          <div className="text-center relative py-2">
            <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-10">
              <LotusIcon className="w-16 h-16 text-gold" />
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gold-muted to-transparent mb-3"></div>

            <p className="font-devanagari text-xl md:text-2xl text-primary font-semibold leading-relaxed tracking-wide whitespace-pre-line">
              {source.originalText}
            </p>

            <div className="h-px bg-gradient-to-r from-transparent via-gold-muted to-transparent mt-3 mb-3"></div>

            {/* IAST Transliteration */}
            <p className="font-serif italic text-xs md:text-sm text-muted-stone leading-relaxed whitespace-pre-line max-w-xl mx-auto">
              {source.transliteration}
            </p>
          </div>

          {/* English Translation */}
          <div className="bg-parchment-deep/50 rounded-lg p-3.5 border border-gold-muted/20">
            <span className="kicker text-gold-muted block mb-0.5 text-[10px]">Translation</span>
            <p className="font-serif text-base md:text-lg leading-relaxed italic text-on-surface">
              &ldquo;{source.translation}&rdquo;
            </p>
            {source.translator && (
              <span className="block text-right text-[11px] text-muted-stone mt-1 font-sans">
                — {source.translator}
              </span>
            )}
          </div>

          {/* Collapsible Concepts Section (contains Word Meanings and Themes) */}
          {hasConceptsOrMeanings && (
            <div className="rounded-lg border border-outline-variant/30 bg-surface-container/60 overflow-hidden transition-all">
              <div
                onClick={() => setShowConcepts(!showConcepts)}
                className="flex items-center justify-between px-3.5 py-2 cursor-pointer select-none bg-surface-container-high/60 hover:bg-surface-container-high transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-gold-muted" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider font-sans text-primary">
                    Concepts
                  </span>
                </div>
                <button
                  type="button"
                  className="p-1 text-muted-stone hover:text-primary transition-transform"
                  aria-label={showConcepts ? "Collapse concepts" : "Expand concepts"}
                >
                  {showConcepts ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {showConcepts && (
                <div className="p-3 flex flex-col gap-2.5 border-t border-outline-variant/20 animate-slide-up bg-surface/40">
                  {/* Word Meanings */}
                  {source.wordMeanings && (
                    <div className="text-xs text-muted-stone font-sans leading-relaxed bg-white/50 p-2.5 rounded-md border border-outline-variant/20">
                      <span className="font-bold text-on-surface uppercase tracking-wider text-[10px] block mb-0.5">
                        Word Meanings:
                      </span>
                      {source.wordMeanings}
                    </div>
                  )}

                  {/* Themes (Renamed from Concepts) */}
                  {source.concepts && source.concepts.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1">
                      <span className="text-xs text-muted-stone font-sans flex items-center gap-1 mr-1">
                        <Layers className="w-3 h-3 text-gold-muted" /> Themes:
                      </span>
                      {source.concepts.map((c) => (
                        <span
                          key={c}
                          className="px-2 py-0.5 rounded-full text-[11px] bg-surface-container-highest text-on-surface-variant font-sans border border-outline-variant/30 shadow-2xs"
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

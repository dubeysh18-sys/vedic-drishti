"use client";

import React from "react";
import { Compass, RefreshCw, Feather } from "lucide-react";
import { StructuredReflection } from "@/types/reflection";

interface NoMatchViewProps {
  reflection: StructuredReflection | null;
  onNewReflection: () => void;
}

export const NoMatchView: React.FC<NoMatchViewProps> = ({
  reflection,
  onNewReflection,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* Empathetic Section 1: What I Hear */}
      {reflection?.whatIHear && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/60 bg-white/50 space-y-3 shadow-lg">
          <div className="flex items-center gap-2 text-gold font-sans text-xs uppercase tracking-widest font-semibold">
            <Feather className="w-4 h-4" />
            <span>What I Hear</span>
          </div>
          <p className="font-serif text-lg sm:text-xl text-primary leading-relaxed">
            {reflection.whatIHear}
          </p>
        </div>
      )}

      {/* Honest Limitation Card */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-gold/30 bg-parchment-deep/40 space-y-6 shadow-xl text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold/15 text-gold mx-auto">
          <Compass className="w-6 h-6" />
        </div>

        <div className="space-y-2 max-w-xl mx-auto">
          <h3 className="font-serif text-2xl text-primary font-medium">
            An Open Contemplation
          </h3>
          <p className="text-secondary/90 font-sans text-base leading-relaxed">
            {reflection?.perspectiveFromText ||
              "I could not find a specific verse in our current Bhagavad Gita corpus that speaks directly to the exact nuances of your situation without forcing an artificial match."}
          </p>
        </div>

        {/* Universal Application */}
        {reflection?.application && (
          <div className="p-6 rounded-2xl bg-white/70 border border-gold/20 text-left space-y-2">
            <span className="text-xs uppercase tracking-wider text-muted-stone font-semibold">
              The Guiding Principle
            </span>
            <p className="font-sans text-base text-primary/90 leading-relaxed">
              {reflection.application}
            </p>
          </div>
        )}

        {/* Reflect on this question */}
        {reflection?.reflectionQuestion && (
          <div className="p-6 rounded-2xl bg-parchment-deep/80 border border-gold/30 space-y-2">
            <span className="text-xs uppercase tracking-wider text-gold font-semibold">
              Reflect on This
            </span>
            <p className="font-serif text-lg sm:text-xl text-primary font-medium italic">
              &ldquo;{reflection.reflectionQuestion}&rdquo;
            </p>
          </div>
        )}

        <div className="pt-4 flex justify-center">
          <button
            onClick={onNewReflection}
            className="px-6 py-3 rounded-full bg-primary text-surface hover:bg-primary/90 font-sans text-sm font-medium transition-all flex items-center gap-2 shadow-md active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reflect on Another Thought</span>
          </button>
        </div>
      </div>
    </div>
  );
};

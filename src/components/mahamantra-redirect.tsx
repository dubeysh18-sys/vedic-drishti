"use client";

import React, { useState } from "react";
import { Sparkles, Heart, RefreshCw } from "lucide-react";
import { MahamantraResponseData } from "@/types/reflection";

interface MahamantraRedirectProps {
  mahamantraData?: MahamantraResponseData;
  onNewReflection: () => void;
}

export const MahamantraRedirect: React.FC<MahamantraRedirectProps> = ({
  mahamantraData,
  onNewReflection,
}) => {
  const [chantCount, setChantCount] = useState(0);

  const mantraLines = (
    mahamantraData?.mantra ||
    `Hare Krishna Hare Krishna\nKrishna Krishna Hare Hare\nHare Rama Hare Rama\nRama Rama Hare Hare`
  ).split("\n");

  const guidance =
    mahamantraData?.guidance ||
    "Let us step away from this inquiry for a moment. If your mind is feeling turbulent, unsettled, or agitated, you may sit quietly in stillness and gently repeat the Mahamantra for a while to find inner grounding.";

  const disclaimer =
    mahamantraData?.disclaimer ||
    "Drishti is a reflective spiritual companion. Chanting is offered as an optional mindful grounding practice for peace of mind, not as a clinical, medical, or legal intervention.";

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* Calm Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gold/30 bg-parchment-deep/40 text-center space-y-4 shadow-xl">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-gold/40 shadow-xs mb-2 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Drishti" className="w-full h-full object-cover" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-primary font-medium tracking-tight">
          A Moment for Quiet Grounding
        </h2>
        <p className="text-secondary/90 font-sans text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
          {guidance}
        </p>
      </div>

      {/* Sacred Mantra Card */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-gold/40 bg-white/70 shadow-2xl text-center space-y-8 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-4">
          <span className="text-xs uppercase tracking-widest text-gold font-semibold">
            Mahāmantra
          </span>
          <div className="space-y-2 py-4">
            {mantraLines.map((line, idx) => (
              <p
                key={idx}
                className="font-serif text-xl sm:text-2xl md:text-3xl text-primary font-medium tracking-wide leading-relaxed"
              >
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* Gentle Interactive Counter */}
        <div className="pt-4 border-t border-gold/20 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setChantCount((c) => c + 1)}
            className="px-6 py-3 rounded-full bg-gold/15 hover:bg-gold/25 text-primary font-sans text-sm font-medium transition-all flex items-center gap-2 border border-gold/30 active:scale-95"
          >
            <Heart className="w-4 h-4 text-gold fill-gold/30" />
            <span>Gentle Breath ({chantCount})</span>
          </button>

          <button
            onClick={onNewReflection}
            className="px-6 py-3 rounded-full bg-primary text-surface hover:bg-primary/90 font-sans text-sm font-medium transition-all flex items-center gap-2 shadow-md active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Return to Reflection</span>
          </button>
        </div>
      </div>

      {/* Non-Shaming Disclaimer */}
      <div className="text-center px-4">
        <p className="text-xs text-muted-stone max-w-lg mx-auto leading-relaxed">
          {disclaimer}
        </p>
      </div>
    </div>
  );
};

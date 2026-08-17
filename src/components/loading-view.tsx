"use client";

import { useEffect, useState } from "react";

const MINDFUL_MESSAGES = [
  "Finding a perspective worth sitting with...",
  "Consulting the timeless verses of the Gita...",
  "Synthesizing ancient wisdom with modern reflection...",
  "Holding space for what you are carrying...",
  "Listening deeply to your experience...",
];

export default function LoadingView() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % MINDFUL_MESSAGES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center space-y-8 animate-slide-up">
      {/* Glowing Lotus Logo */}
      <div className="w-24 h-24 md:w-28 md:h-28 animate-pulse-gold flex items-center justify-center relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="Drishti"
          className="w-full h-full rounded-full object-cover shadow-soft border-2 border-gold/50 drop-shadow-md"
        />
      </div>

      {/* Loading Text in Glass Frame */}
      <div className="glass-panel px-8 py-6 rounded-2xl max-w-sm border border-white/80 shadow-soft">
        <p className="font-serif text-on-surface-variant text-lg md:text-xl leading-relaxed italic transition-opacity duration-500">
          {MINDFUL_MESSAGES[index]}
        </p>
      </div>
    </div>
  );
}

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
    <div className="min-h-[45vh] flex flex-col items-center justify-center px-4 text-center space-y-5 animate-slide-up">
      {/* Glowing Lotus Logo */}
      <div className="w-16 h-16 md:w-20 md:h-20 animate-pulse-gold flex items-center justify-center relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="Drishti"
          className="w-full h-full rounded-full object-cover shadow-soft border-2 border-gold/50 drop-shadow-md"
        />
      </div>

      {/* Loading Text in Glass Frame */}
      <div className="glass-panel px-6 py-4 rounded-xl max-w-sm border border-white/80 shadow-soft">
        <p className="font-serif text-on-surface-variant text-base md:text-lg leading-relaxed italic transition-opacity duration-500">
          {MINDFUL_MESSAGES[index]}
        </p>
      </div>
    </div>
  );
}

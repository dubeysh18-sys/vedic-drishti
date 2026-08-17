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
      {/* Hand-drawn Golden Lotus from Stitch design */}
      <div className="w-28 h-28 md:w-36 md:h-36 animate-pulse-gold flex items-center justify-center relative text-gold">
        <svg
          className="w-full h-full opacity-90 drop-shadow-md"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M50 85 C30 75 20 55 20 40 C20 25 35 15 50 15 C65 15 80 25 80 40 C80 55 70 75 50 85 Z" />
          <path d="M50 85 C40 70 35 55 35 45 C35 35 42 25 50 25 C58 25 65 35 65 45 C65 55 60 70 50 85 Z" />
          <path d="M50 85 C46 75 44 60 44 50 C44 40 47 30 50 30 C53 30 56 40 56 50 C56 60 54 75 50 85 Z" />
          <path d="M20 40 C10 45 5 55 10 65 C15 75 30 75 40 70" />
          <path d="M80 40 C90 45 95 55 90 65 C85 75 70 75 60 70" />
        </svg>
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

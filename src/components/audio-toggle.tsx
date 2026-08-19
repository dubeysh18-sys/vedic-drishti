"use client";

import React from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useAudio } from "@/context/audio-context";

interface AudioToggleProps {
  className?: string;
}

export default function AudioToggle({ className = "" }: AudioToggleProps) {
  const { isEnabled, isPlaying, toggleSound } = useAudio();

  return (
    <button
      type="button"
      onClick={toggleSound}
      aria-label={isEnabled ? "Mute ambient music" : "Play ambient music"}
      aria-pressed={isEnabled}
      title={isEnabled ? (isPlaying ? "Mute ambient sound (Playing)" : "Mute ambient sound") : "Play ambient sound (Muted)"}
      className={`relative w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ${
        isEnabled
          ? "bg-surface-container/90 text-primary border border-gold/40 hover:bg-white hover:border-gold shadow-xs hover:shadow-soft"
          : "bg-surface-container/60 text-muted-stone border border-outline-variant/40 hover:bg-white/80 hover:text-primary hover:border-outline-variant/70 shadow-none"
      } ${className}`}
    >
      {/* Subtle pulsing glow ring when actively playing sound */}
      {isEnabled && isPlaying && (
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-20 bg-gold pointer-events-none"
          style={{ animationDuration: "3s" }}
          aria-hidden="true"
        />
      )}

      {isEnabled ? (
        <div className="relative flex items-center justify-center">
          <Volume2 className="w-4 h-4 md:w-[18px] md:h-[18px] text-gold-muted transition-transform duration-300 group-hover:scale-110" />
        </div>
      ) : (
        <div className="relative flex items-center justify-center">
          <VolumeX className="w-4 h-4 md:w-[18px] md:h-[18px] transition-transform duration-300" />
        </div>
      )}
    </button>
  );
}

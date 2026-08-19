"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { AudioContextType } from "@/types/audio";

const STORAGE_KEY = "drishti_ambient_sound_enabled";
const AUDIO_SRC = "/audio/First_Light_on_the_Temple_Steps.mp3";

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const interruptionsRef = useRef<Set<string>>(new Set());
  const isEnabledRef = useRef<boolean>(true);

  // Keep isEnabledRef in sync with state for event listeners
  useEffect(() => {
    isEnabledRef.current = isEnabled;
  }, [isEnabled]);

  // Attempt to play audio safely with autoplay policy fallback
  const attemptPlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return Promise.resolve();

    // Do not play if sound is disabled or an interruption is active
    if (!isEnabledRef.current || interruptionsRef.current.size > 0) {
      return Promise.resolve();
    }

    return audio
      .play()
      .then(() => {
        setIsPlaying(true);
        setIsBlocked(false);
      })
      .catch((err) => {
        // Autoplay was blocked by browser policy
        if (err && (err.name === "NotAllowedError" || err.name === "AbortError")) {
          setIsBlocked(true);
          setIsPlaying(false);
        } else {
          console.warn("[Drishti Audio] Playback attempt error:", err);
        }
      });
  }, []);

  // Initialize preference from localStorage and set up first interaction fallback
  useEffect(() => {
    if (typeof window === "undefined") return;

    let soundPref = true;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        soundPref = stored === "true";
      }
    } catch {
      // LocalStorage unavailable/restricted, fallback to default ON
      soundPref = true;
    }

    setIsEnabled(soundPref);
    isEnabledRef.current = soundPref;

    // If enabled, attempt initial play on mount
    if (soundPref) {
      // Small delay to ensure DOM audio element is bound and ready
      const timer = setTimeout(() => {
        attemptPlay();
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [attemptPlay]);

  // Handle first interaction unlocking if initial autoplay was blocked
  useEffect(() => {
    if (typeof window === "undefined" || !isBlocked) return;

    const handleFirstInteraction = () => {
      if (isEnabledRef.current && interruptionsRef.current.size === 0) {
        attemptPlay();
      }
      cleanupListeners();
    };

    const cleanupListeners = () => {
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      window.removeEventListener("click", handleFirstInteraction);
    };

    window.addEventListener("pointerdown", handleFirstInteraction, { passive: true });
    window.addEventListener("touchstart", handleFirstInteraction, { passive: true });
    window.addEventListener("keydown", handleFirstInteraction, { passive: true });
    window.addEventListener("click", handleFirstInteraction, { passive: true });

    return cleanupListeners;
  }, [isBlocked, attemptPlay]);

  // Sync isPlaying state with native audio element events
  const handleNativePlay = () => setIsPlaying(true);
  const handleNativePause = () => setIsPlaying(false);

  const enableSound = useCallback(async () => {
    setIsEnabled(true);
    isEnabledRef.current = true;
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Ignore localStorage errors
    }

    if (interruptionsRef.current.size === 0) {
      await attemptPlay();
    }
  }, [attemptPlay]);

  const disableSound = useCallback(() => {
    setIsEnabled(false);
    isEnabledRef.current = false;
    try {
      localStorage.setItem(STORAGE_KEY, "false");
    } catch {
      // Ignore localStorage errors
    }

    const audio = audioRef.current;
    if (audio) {
      audio.pause();
    }
    setIsPlaying(false);
    setIsBlocked(false);
  }, []);

  const toggleSound = useCallback(() => {
    if (isEnabled) {
      disableSound();
    } else {
      enableSound();
    }
  }, [isEnabled, disableSound, enableSound]);

  const pauseForInterruption = useCallback((sourceId: string) => {
    interruptionsRef.current.add(sourceId);
    const audio = audioRef.current;
    if (audio && !audio.paused) {
      audio.pause();
    }
  }, []);

  const resumeAfterInterruption = useCallback(
    (sourceId: string) => {
      interruptionsRef.current.delete(sourceId);
      if (interruptionsRef.current.size === 0 && isEnabledRef.current) {
        attemptPlay();
      }
    },
    [attemptPlay]
  );

  const contextValue: AudioContextType = {
    isEnabled,
    isPlaying,
    isBlocked,
    toggleSound,
    enableSound,
    disableSound,
    pauseForInterruption,
    resumeAfterInterruption,
  };

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
      {/* Persistent global audio element */}
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        loop
        preload="auto"
        onPlay={handleNativePlay}
        onPause={handleNativePause}
        className="hidden"
        aria-hidden="true"
      />
    </AudioContext.Provider>
  );
}

export function useAudio(): AudioContextType {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}

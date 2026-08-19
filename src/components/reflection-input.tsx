"use client";

import { useState } from "react";
import { Mic, ArrowRight, Loader2 } from "lucide-react";
import { getEmotionConversationalPlaceholder } from "@/lib/emotions/taxonomy";
import LotusIcon from "@/components/lotus-icon";

interface ReflectionInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  selectedEmotionId?: string;
  selectedEmotionName?: string;
  isLoading?: boolean;
}

export default function ReflectionInput({
  value,
  onChange,
  onSubmit,
  selectedEmotionId,
  isLoading = false,
}: ReflectionInputProps) {
  const [isListening, setIsListening] = useState(false);

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser. You can type your thoughts directly.");
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onChange(value ? `${value} ${transcript}` : transcript);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const placeholder = getEmotionConversationalPlaceholder(selectedEmotionId);
  const canSubmit = Boolean((value && value.trim().length > 0) || selectedEmotionId);

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-3.5">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-secondary-container/30 to-gold-light/40 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-700"></div>

        <div className="relative z-10 glass-panel rounded-2xl p-4 md:p-5 border border-white/80 shadow-soft">
          <div className="relative w-full">
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (canSubmit && !isLoading) onSubmit();
                }
              }}
              placeholder={placeholder}
              rows={3}
              disabled={isLoading}
              aria-label="Reflection input"
              className="w-full bg-transparent font-sans text-base md:text-lg placeholder:text-muted-stone resize-none focus:outline-hidden text-on-surface transition-all leading-relaxed"
            />
          </div>

          <div className="flex justify-between items-center pt-2.5 border-t border-outline-variant/30 mt-1.5">
            <span className="text-xs text-muted-stone font-sans">
              {value.length > 0 ? `${value.length} / 2000` : ""}
            </span>

            <button
              type="button"
              onClick={handleVoiceInput}
              title="Voice Input"
              aria-label="Activate voice dictation"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-gold ${
                isListening
                  ? "bg-error text-white animate-pulse"
                  : "bg-secondary-container text-on-secondary-container hover:brightness-110 active:scale-95 shadow-xs"
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary CTA Button (US-05) */}
      <div className="flex justify-center mt-1">
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit || isLoading}
          aria-label={isLoading ? "Finding your perspective..." : "Find perspective"}
          className="w-full sm:w-auto min-w-[260px] rounded-full py-3 md:py-3.5 px-8 font-sans text-xs md:text-sm font-bold tracking-[0.14em] uppercase bg-gradient-to-r from-[#2A261F] to-[#403B32] text-[#F7F4EE] hover:from-[#1E1B15] hover:to-[#332F27] flex items-center justify-center gap-2.5 active:scale-95 transition-all shadow-[0_6px_24px_rgba(42,38,31,0.25)] relative overflow-hidden group disabled:opacity-40 disabled:pointer-events-none border border-gold/40 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 text-gold-light animate-spin relative z-10" />
              <span className="relative z-10 text-gold-light">Finding your perspective...</span>
            </>
          ) : (
            <>
              <LotusIcon className="w-4 h-4 text-gold-light relative z-10" />
              <span className="relative z-10">Find Perspective</span>
              <ArrowRight className="w-4 h-4 text-[#F7F4EE] relative z-10 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}


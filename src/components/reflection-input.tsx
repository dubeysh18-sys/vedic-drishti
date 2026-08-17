"use client";

import { useState } from "react";
import { Mic, ArrowRight, Sparkles } from "lucide-react";

interface ReflectionInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  selectedEmotionName?: string;
  isLoading?: boolean;
}

export default function ReflectionInput({
  value,
  onChange,
  onSubmit,
  selectedEmotionName,
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

  const placeholder = selectedEmotionName
    ? `I am feeling ${selectedEmotionName.toLowerCase()} because... (Tell me what's happening)`
    : "Or tell me what's happening in your life right now...";

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-secondary-container/30 to-gold-light/40 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-700"></div>

        <div className="relative z-10 glass-panel rounded-2xl p-5 md:p-6 border border-white/80 shadow-soft">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                if (value.trim() && !isLoading) onSubmit();
              }
            }}
            placeholder={placeholder}
            rows={4}
            disabled={isLoading}
            className="w-full bg-transparent font-sans text-base md:text-lg text-on-surface placeholder:text-muted-stone resize-none focus:outline-none transition-all leading-relaxed"
          />

          <div className="flex justify-between items-center pt-3 border-t border-outline-variant/30 mt-2">
            <span className="text-xs text-muted-stone font-sans">
              {value.length > 0 ? `${value.length} / 2000 chars` : "Press ⌘+Enter to submit"}
            </span>

            <button
              type="button"
              onClick={handleVoiceInput}
              title="Voice Input"
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isListening
                  ? "bg-error text-white animate-pulse"
                  : "bg-secondary-container text-on-secondary-container hover:brightness-110 active:scale-95 shadow-sm"
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center mt-2">
        <button
          type="button"
          onClick={onSubmit}
          disabled={!value.trim() || isLoading}
          className="glass-panel w-full sm:w-auto min-w-[280px] rounded-full py-4 px-8 font-sans text-xs md:text-sm font-bold tracking-[0.14em] uppercase text-primary flex items-center justify-center gap-3 hover:bg-white/80 active:scale-95 transition-all shadow-[0_8px_32px_rgba(212,175,55,0.15)] relative overflow-hidden group disabled:opacity-40 disabled:pointer-events-none border border-gold/40"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <Sparkles className="w-4 h-4 text-gold-muted relative z-10" />
          <span className="relative z-10">Find Perspective</span>
          <ArrowRight className="w-4 h-4 text-primary relative z-10 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { ReflectionMessageResponse } from "@/types/reflection";
import { Bookmark, ChevronRight, BookOpen, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ReflectionResponse from "@/components/reflection-response";
import LotusIcon from "@/components/lotus-icon";

export default function ArchivePage() {
  const [reflections, setReflections] = useState<ReflectionMessageResponse[]>([]);
  const [selectedReflection, setSelectedReflection] = useState<ReflectionMessageResponse | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("drishti_saved_reflections");
      if (stored) {
        setReflections(JSON.parse(stored));
      } else {
        // Fetch from API
        fetch("/api/reflections")
          .then((res) => res.json())
          .then((data) => {
            if (data.reflections && data.reflections.length > 0) {
              setReflections(data.reflections);
            }
          })
          .catch(() => {});
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = reflections.filter((r) => r.id !== id);
    setReflections(filtered);
    try {
      localStorage.setItem("drishti_saved_reflections", JSON.stringify(filtered));
    } catch {
      // Ignore
    }
  };

  if (selectedReflection) {
    return (
      <div className="pt-20">
        <ReflectionResponse
          data={selectedReflection}
          onReset={() => setSelectedReflection(null)}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 pt-20 md:pt-24 pb-16 flex flex-col gap-4 md:gap-5 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest font-sans text-muted-stone hover:text-primary transition-colors mb-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Reflect
        </Link>

        <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary">Saved Reflections</h1>

        {/* Lotus Motif Accent from Stitch design */}
        <div className="flex items-center gap-2.5 mt-0.5 opacity-80">
          <div className="h-px w-6 bg-gold"></div>
          <LotusIcon className="w-3.5 h-3.5 text-gold" />
          <div className="h-px w-6 bg-gold"></div>
        </div>
      </div>

      {/* Reflections List */}
      {reflections.length === 0 ? (
        <div className="bg-surface-container/80 rounded-2xl p-6 sm:p-8 text-center flex flex-col items-center gap-3 border border-outline-variant/30 mt-2">
          <span className="w-10 h-10 rounded-full bg-parchment-deep flex items-center justify-center text-gold-muted">
            <Bookmark className="w-5 h-5" />
          </span>
          <h3 className="font-serif font-semibold text-base md:text-lg text-primary">No saved reflections yet</h3>
          <p className="font-sans text-xs sm:text-sm text-muted-stone max-w-xs leading-relaxed">
            Reflect on what you are carrying and save the perspective to revisit anytime.
          </p>
          <Link
            href="/"
            className="mt-1 px-5 py-2 rounded-full bg-primary text-white font-sans text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-all shadow-sm"
          >
            Start First Reflection
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 mt-1">
          {reflections.map((item) => {
            const dateStr = new Date(item.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            const topSource = item.sources?.[0];
            const sourceTitle = topSource ? `${topSource.sourceName} ${topSource.chapter}.${topSource.verse}` : "Bhagavad Gita";

            return (
              <div
                key={item.id}
                onClick={() => setSelectedReflection(item)}
                className="bg-surface-stone/90 hover:bg-white px-4 sm:px-5 py-3.5 rounded-xl shadow-modern cursor-pointer active:scale-[0.99] transition-all border border-outline-variant/30 flex justify-between items-center group"
              >
                <div className="flex flex-1 flex-col gap-1 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-stone text-[10px] font-bold uppercase tracking-[0.15em] font-sans">
                      {dateStr}
                    </span>
                    {item.selectedEmotion && (
                      <span className="px-2 py-0.2 rounded-full text-[9px] font-semibold uppercase tracking-wider bg-secondary-container/70 text-on-secondary-container">
                        {item.selectedEmotion}
                      </span>
                    )}
                  </div>

                  <p className="text-primary text-sm sm:text-base font-semibold font-sans flex items-center gap-1.5">
                    <span>{item.userInput.slice(0, 40)}...</span>
                    <span className="text-gold">•</span>
                    <span className="text-xs font-medium text-gold-muted flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> {sourceTitle}
                    </span>
                  </p>

                  <p className="text-muted-stone text-xs font-serif line-clamp-2 leading-relaxed italic">
                    &ldquo;{item.reflection?.reflectionQuestion || item.reflection?.whatIHear}&rdquo;
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => handleDelete(item.id, e)}
                    className="p-1.5 text-muted-stone hover:text-error transition-colors rounded-full"
                    title="Delete from archive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="text-gold group-hover:translate-x-1 transition-transform">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { Shield, Award, BookOpen, HeartHandshake, ArrowLeft, Compass } from "lucide-react";
import Link from "next/link";
import { CRISIS_RESOURCES } from "@/lib/safety/crisis-resources";
import LotusIcon from "@/components/lotus-icon";

export default function AboutPage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, []);

  return (
    <div className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 md:px-8 pt-20 md:pt-24 pb-16 flex flex-col gap-6 md:gap-7 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col gap-2 w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest font-sans text-muted-stone hover:text-primary transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Back to Reflect</span>
        </Link>

        <div className="flex items-center gap-3.5 mt-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Drishti Logo"
            className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-gold/40 shadow-soft shrink-0"
          />
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary">How Drishti Works</h1>
            <p className="font-sans text-xs md:text-sm text-gold-muted font-medium mt-0.5">
              A contemplative companion rooted in timeless Vedic wisdom
            </p>
          </div>
        </div>
      </div>

      {/* Two Paragraphs on How Drishti Helps the User */}
      <section className="bg-surface-container/60 rounded-2xl p-5 md:p-6 border border-gold/20 flex flex-col gap-4 shadow-soft">
        <div className="flex items-center gap-2 text-primary font-serif font-bold text-base md:text-lg">
          <Compass className="w-4 h-4 text-gold-muted" />
          <span>How Drishti Helps You Find Stillness & Clarity</span>
        </div>

        <p className="font-sans text-sm sm:text-base text-on-surface leading-relaxed text-justify">
          Modern life constantly urges us to react—to hurry, to perform, and to carry the weight of unspoken expectations alone. When emotions like anxiety, grief, confusion, or burnout arise, our instinct is often either to suppress what we feel or lose ourselves in relentless digital noise. <strong>Drishti</strong> (<em>दृष्टि</em>—meaning sacred insight or illuminated vision) exists as a gentle sanctuary for your inner world. It offers a dedicated space to pause without judgment, express whatever you are holding in your heart, and discover how ancient Vedic wisdom meets your everyday struggles with profound empathy, calm, and practical clarity.
        </p>

        <p className="font-sans text-sm sm:text-base text-on-surface leading-relaxed text-justify">
          Rather than imposing rigid rules or prescribing generic advice, Drishti acts as a reflective philosophical mirror rooted in the Bhagavad Gita&apos;s timeless teachings on equanimity (<em>Samatvam</em>), inner courage (<em>Abhayam</em>), and purposeful action. By mapping what you are experiencing to universal truths on duty, letting go of outcomes, and self-knowledge, Drishti helps you quiet the reactive mind, recognize what is truly within your hands, and move forward in your personal journey with steady grace and quiet peace.
        </p>
      </section>

      {/* 4-Layer Trust Model Section */}
      <section className="bg-surface-container/90 rounded-2xl p-4 sm:p-5 md:p-6 border border-gold/30 shadow-soft flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-full bg-parchment-deep flex items-center justify-center text-gold-muted shrink-0">
            <Shield className="w-4 h-4" />
          </span>
          <div>
            <h2 className="font-serif font-bold text-lg md:text-xl text-primary">The 4-Layer Trust Model</h2>
            <p className="text-[11px] text-muted-stone font-sans">Transparent separation of original text vs. AI synthesis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-white/80 border border-outline-variant/30 flex flex-col gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100/80 text-amber-900 w-fit">
              <Award className="w-3 h-3 text-amber-700" /> Layer 1: Sanskrit Source
            </span>
            <p className="text-xs text-on-surface leading-relaxed font-sans">
              Immutable original verses in Devanagari Sanskrit from the canonical 701-verse Bhagavad Gita corpus.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/80 border border-outline-variant/30 flex flex-col gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-900 w-fit">
              <BookOpen className="w-3 h-3 text-stone-600" /> Layer 2: Canonical Translation
            </span>
            <p className="text-xs text-on-surface leading-relaxed font-sans">
              Direct word meanings and translations verified against classical lineage concordances (Swami Sivananda & classical acharyas).
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/80 border border-outline-variant/30 flex flex-col gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100/80 text-emerald-900 w-fit">
              <Shield className="w-3 h-3 text-emerald-700" /> Layer 3: Traditional Commentary
            </span>
            <p className="text-xs text-on-surface leading-relaxed font-sans">
              Historical commentary from classical commentaries, presented strictly when scholarly sources are available.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/80 border border-outline-variant/30 flex flex-col gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-900 w-fit">
              <LotusIcon className="w-3 h-3 text-indigo-600" /> Layer 4: AI Synthesis
            </span>
            <p className="text-xs text-on-surface leading-relaxed font-sans">
              Empathetic reflection, practical contextual application, and contemplative inquiry generated by AI — clearly labeled as non-authoritative.
            </p>
          </div>
        </div>
      </section>

      {/* Safety & Crisis Disclaimer Section */}
      <section className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 md:p-6 border border-amber-200 shadow-soft flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-full bg-amber-200/70 text-amber-900 flex items-center justify-center shrink-0">
            <HeartHandshake className="w-4 h-4" />
          </span>
          <h2 className="font-serif font-bold text-lg text-amber-950">Safety & Crisis Commitment</h2>
        </div>

        <p className="text-xs sm:text-sm text-amber-900 font-sans leading-relaxed">
          Drishti is a philosophical companion and reflective diary. It is <strong>not a medical, mental health, or crisis service</strong>. Our safety-first pipeline automatically detects signs of acute crisis or self-harm before RAG retrieval, immediately pausing philosophical advice to provide verified emergency helpline resources.
        </p>

        <div className="pt-1">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-950 mb-1.5">Configured Helplines:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs font-sans text-amber-900">
            {CRISIS_RESOURCES.map((r, idx) => (
              <div key={idx} className="bg-white/70 px-2.5 py-2 rounded-lg border border-amber-100">
                <span className="font-semibold">{r.resourceName}</span>: {r.phone || r.website}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}


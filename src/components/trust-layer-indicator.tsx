import { Shield, BookOpen, Award } from "lucide-react";
import LotusIcon from "@/components/lotus-icon";

interface TrustLayerIndicatorProps {
  layer: "original" | "translation" | "commentary" | "ai";
}

export default function TrustLayerIndicator({ layer }: TrustLayerIndicatorProps) {
  switch (layer) {
    case "original":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase font-sans bg-amber-100/70 text-amber-900 border border-amber-300/60 shadow-xs">
          <Award className="w-3 h-3 text-amber-700" />
          Layer 1: Original Sanskrit
        </span>
      );
    case "translation":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase font-sans bg-stone-100 text-stone-800 border border-stone-300/80 shadow-xs">
          <BookOpen className="w-3 h-3 text-stone-600" />
          Layer 2: Canonical Translation
        </span>
      );
    case "commentary":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase font-sans bg-emerald-100/70 text-emerald-900 border border-emerald-300/60 shadow-xs">
          <Shield className="w-3 h-3 text-emerald-700" />
          Layer 3: Traditional Commentary
        </span>
      );
    case "ai":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase font-sans bg-indigo-50 text-indigo-900 border border-indigo-200/80 shadow-xs">
          <LotusIcon className="w-3 h-3 text-indigo-600" />
          Layer 4: AI Synthesis
        </span>
      );
  }
}

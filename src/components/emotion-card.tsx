"use client";

import { EmotionDefinition } from "@/types/emotion";
import {
  Droplet,
  Flame,
  Cloud,
  Compass,
  Sun,
  Sparkles,
  Heart,
  Wind,
  Shield,
  User,
  GitCompare,
  Waves,
} from "lucide-react";

interface EmotionCardProps {
  emotion: EmotionDefinition;
  isSelected: boolean;
  onSelect: (emotion: EmotionDefinition) => void;
}

export default function EmotionCard({ emotion, isSelected, onSelect }: EmotionCardProps) {
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "water_drop":
        return <Droplet className="w-8 h-8 text-secondary group-hover:scale-110 transition-transform duration-300" />;
      case "cyclone":
        return <Waves className="w-8 h-8 text-on-surface-variant group-hover:scale-110 transition-transform duration-300" />;
      case "route":
        return <Compass className="w-8 h-8 text-outline group-hover:scale-110 transition-transform duration-300" />;
      case "cloud":
        return <Cloud className="w-8 h-8 text-muted-stone group-hover:scale-110 transition-transform duration-300" />;
      case "wb_sunny":
        return <Sun className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />;
      case "self_improvement":
        return <Sparkles className="w-8 h-8 text-secondary group-hover:scale-110 transition-transform duration-300" />;
      case "local_fire_department":
        return <Flame className="w-8 h-8 text-error group-hover:scale-110 transition-transform duration-300" />;
      case "compare_arrows":
        return <GitCompare className="w-8 h-8 text-muted-stone group-hover:scale-110 transition-transform duration-300" />;
      case "heart_broken":
        return <Heart className="w-8 h-8 text-muted-stone group-hover:scale-110 transition-transform duration-300" />;
      case "person":
        return <User className="w-8 h-8 text-outline group-hover:scale-110 transition-transform duration-300" />;
      case "air":
        return <Wind className="w-8 h-8 text-on-surface-variant group-hover:scale-110 transition-transform duration-300" />;
      case "shield":
        return <Shield className="w-8 h-8 text-secondary group-hover:scale-110 transition-transform duration-300" />;
      default:
        return <Sparkles className="w-8 h-8 text-gold-muted group-hover:scale-110 transition-transform duration-300" />;
    }
  };

  return (
    <button
      type="button"
      onClick={() => onSelect(emotion)}
      className={`glass-card ${emotion.pebbleShapeClass} aspect-square flex flex-col items-center justify-center p-4 gap-2.5 group cursor-pointer active:scale-95 transition-all ${
        isSelected
          ? "ring-2 ring-gold border-gold bg-white/90 shadow-[0_8px_30px_rgba(212,175,55,0.2)] scale-[1.03]"
          : "hover:border-gold/50"
      }`}
      aria-label={`Select emotion ${emotion.name}`}
    >
      <div className="flex items-center justify-center h-10 w-10">{renderIcon(emotion.iconName)}</div>
      <span className="font-sans text-[11px] md:text-xs font-bold tracking-[0.12em] uppercase text-on-surface">
        {emotion.name}
      </span>
    </button>
  );
}

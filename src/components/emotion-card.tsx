"use client";

import { EmotionDefinition } from "@/types/emotion";
import {
  Droplet,
  Flame,
  Cloud,
  Compass,
  Sun,
  Heart,
  Wind,
  Shield,
  User,
  GitCompare,
  Waves,
} from "lucide-react";
import LotusIcon from "@/components/lotus-icon";

interface EmotionCardProps {
  emotion: EmotionDefinition;
  isSelected: boolean;
  onSelect: (emotion: EmotionDefinition) => void;
}

export default function EmotionCard({ emotion, isSelected, onSelect }: EmotionCardProps) {
  const renderIcon = (iconName: string) => {
    const iconClass = "w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform duration-300";
    switch (iconName) {
      case "water_drop":
        return <Droplet className={`${iconClass} text-secondary`} />;
      case "cyclone":
        return <Waves className={`${iconClass} text-on-surface-variant`} />;
      case "route":
        return <Compass className={`${iconClass} text-outline`} />;
      case "cloud":
        return <Cloud className={`${iconClass} text-muted-stone`} />;
      case "wb_sunny":
        return <Sun className={`${iconClass} text-primary`} />;
      case "self_improvement":
        return <LotusIcon className={`${iconClass} text-secondary`} />;
      case "local_fire_department":
        return <Flame className={`${iconClass} text-error`} />;
      case "compare_arrows":
        return <GitCompare className={`${iconClass} text-muted-stone`} />;
      case "heart_broken":
        return <Heart className={`${iconClass} text-muted-stone`} />;
      case "person":
        return <User className={`${iconClass} text-outline`} />;
      case "air":
        return <Wind className={`${iconClass} text-on-surface-variant`} />;
      case "shield":
        return <Shield className={`${iconClass} text-secondary`} />;
      default:
        return <LotusIcon className={`${iconClass} text-gold-muted`} />;
    }
  };

  return (
    <button
      type="button"
      onClick={() => onSelect(emotion)}
      aria-pressed={isSelected}
      aria-label={`${emotion.name} emotion: select to reflect on feeling ${emotion.name.toLowerCase()}`}
      className={`glass-card ${emotion.pebbleShapeClass} aspect-square flex flex-col items-center justify-center p-2 sm:p-2.5 md:p-3 gap-1 sm:gap-1.5 group cursor-pointer active:scale-95 transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ${
        isSelected
          ? "ring-2 ring-gold border-gold bg-white/95 shadow-[0_6px_20px_rgba(212,175,55,0.2)] scale-[1.02]"
          : "hover:border-gold/50"
      }`}
    >
      <div className="flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8">{renderIcon(emotion.iconName)}</div>
      <span className="font-sans text-[10px] sm:text-[11px] font-bold tracking-[0.1em] uppercase text-on-surface">
        {emotion.name}
      </span>
    </button>
  );
}

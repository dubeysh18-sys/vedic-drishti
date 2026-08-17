"use client";

import { EmotionDefinition } from "@/types/emotion";
import EmotionCard from "./emotion-card";
import { CONTROLLED_EMOTIONS } from "@/lib/emotions/taxonomy";

interface EmotionGridProps {
  selectedEmotionId: string | null;
  onSelectEmotion: (emotion: EmotionDefinition) => void;
}

export default function EmotionGrid({ selectedEmotionId, onSelectEmotion }: EmotionGridProps) {
  return (
    <section className="w-full max-w-3xl mx-auto">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4.5">
        {CONTROLLED_EMOTIONS.map((emotion) => (
          <EmotionCard
            key={emotion.id}
            emotion={emotion}
            isSelected={selectedEmotionId === emotion.id}
            onSelect={onSelectEmotion}
          />
        ))}
      </div>
    </section>
  );
}

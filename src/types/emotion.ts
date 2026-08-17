export interface EmotionDefinition {
  id: string;
  name: string;
  category: "challenging" | "seeking" | "contemplative" | "neutral" | "positive";
  iconName: string; // Lucide / Material Symbol icon
  description: string;
  pebbleShapeClass: string;
  accentColorClass: string;
  associatedConcepts: string[];
  associatedThemes: string[];
  synonyms: string[];
}

export interface EmotionalReading {
  primaryEmotion: string;
  secondaryEmotions: string[];
  intensity?: number;
  statement: string; // "What I hear" empathetic reflection
  situation?: string;
  trigger?: string;
  underlyingConcern?: string;
  themes: string[];
  philosophicalConcepts: string[];
}

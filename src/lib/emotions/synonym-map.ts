import { CONTROLLED_EMOTIONS } from "./taxonomy";

export const SYNONYM_MAP: Record<string, string> = {
  // Anxious
  worried: "anxious",
  nervous: "anxious",
  apprehensive: "anxious",
  jittery: "anxious",
  uneasy: "anxious",
  panicky: "anxious",
  stress: "anxious",
  stressed: "anxious",
  dread: "anxious",
  anxiety: "anxious",

  // Overwhelmed
  exhausted: "overwhelmed",
  drowning: "overwhelmed",
  burnout: "overwhelmed",
  "burned out": "overwhelmed",
  "burnt out": "overwhelmed",
  swamped: "overwhelmed",
  "stretched thin": "overwhelmed",
  overload: "overwhelmed",
  pressure: "overwhelmed",
  overburdened: "overwhelmed",

  // Confused
  lost: "confused",
  doubtful: "confused",
  torn: "confused",
  undecided: "confused",
  conflicted: "confused",
  uncertain: "confused",
  dilemma: "confused",
  perplexed: "confused",
  hesitant: "confused",
  directionless: "confused",

  // Heavy
  sad: "heavy",
  sorrowful: "heavy",
  down: "heavy",
  depressed: "heavy",
  melancholy: "heavy",
  burdened: "heavy",
  "weighed down": "heavy",
  gloomy: "heavy",
  unmotivated: "heavy",
  apathetic: "heavy",

  // Hopeful
  optimistic: "hopeful",
  inspired: "hopeful",
  encouraged: "hopeful",
  renewed: "hopeful",
  faithful: "hopeful",
  aspiring: "hopeful",
  grateful: "hopeful",
  peaceful: "hopeful",

  // Seeking
  searching: "seeking",
  yearning: "seeking",
  curious: "seeking",
  questing: "seeking",
  exploring: "seeking",
  inquiring: "seeking",
  purpose: "seeking",
  meaning: "seeking",
  wisdom: "seeking",

  // Angry
  furious: "angry",
  mad: "angry",
  irritated: "angry",
  enraged: "angry",
  indignant: "angry",
  resentful: "angry",
  bitter: "angry",
  pissed: "angry",
  frustrated: "angry",
  agitated: "angry",

  // Jealous
  envious: "jealous",
  comparing: "jealous",
  insecure: "jealous",
  covetous: "jealous",
  inferior: "jealous",
  "left behind": "jealous",
  fomo: "jealous",

  // Grieving
  heartbroken: "grieving",
  mourning: "grieving",
  bereaved: "grieving",
  devastated: "grieving",
  loss: "grieving",
  grief: "grieving",
  aching: "grieving",

  // Lonely
  isolated: "lonely",
  alone: "lonely",
  unseen: "lonely",
  disconnected: "lonely",
  alienated: "lonely",
  abandoned: "lonely",
  solitary: "lonely",

  // Restless
  fidgety: "restless",
  "racing thoughts": "restless",
  distracted: "restless",
  scattered: "restless",
  unfocused: "restless",
  hyper: "restless",
  "turbulent mind": "restless",
  impatient: "restless",

  // Fearful
  scared: "fearful",
  afraid: "fearful",
  terrified: "fearful",
  frightened: "fearful",
  panicked: "fearful",
  intimidated: "fearful",
  vulnerable: "fearful",
  threatened: "fearful",
};

export function mapToCanonicalEmotion(input: string): string | null {
  const normalized = input.trim().toLowerCase();

  // 1. Direct match with ID
  const directMatch = CONTROLLED_EMOTIONS.find(
    (e) => e.id === normalized || e.name.toLowerCase() === normalized
  );
  if (directMatch) return directMatch.id;

  // 2. Exact synonym map lookup
  if (SYNONYM_MAP[normalized]) {
    return SYNONYM_MAP[normalized];
  }

  // 3. Substring / Token matching
  for (const [synonym, canonicalId] of Object.entries(SYNONYM_MAP)) {
    if (normalized.includes(synonym)) {
      return canonicalId;
    }
  }

  for (const emotion of CONTROLLED_EMOTIONS) {
    if (normalized.includes(emotion.id)) {
      return emotion.id;
    }
    for (const syn of emotion.synonyms) {
      if (normalized.includes(syn)) {
        return emotion.id;
      }
    }
  }

  return null;
}

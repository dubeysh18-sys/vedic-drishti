import { GuidedQuestion } from "@/types/guided-question";
import { mapToCanonicalEmotion } from "./synonym-map";

/**
 * Exact canonical guided questions and IDs as specified in US-04.
 * Exactly 3 deterministic questions for each of the 14 supported emotions.
 */
export const CANONICAL_GUIDED_QUESTIONS: Record<string, GuidedQuestion[]> = {
  angry: [
    {
      id: "angry_trigger",
      text: "What happened that made you angry?",
      emotionId: "angry",
    },
    {
      id: "angry_hurt",
      text: "What felt unfair, hurtful, or disrespectful?",
      emotionId: "angry",
    },
    {
      id: "angry_control",
      text: "What part of this situation feels outside your control?",
      emotionId: "angry",
    },
  ],
  anxious: [
    {
      id: "anxious_worry",
      text: "What are you most worried might happen?",
      emotionId: "anxious",
    },
    {
      id: "anxious_timing",
      text: "Is this worry about something happening now or something that might happen later?",
      emotionId: "anxious",
    },
    {
      id: "anxious_control",
      text: "What part of this situation feels outside your control?",
      emotionId: "anxious",
    },
  ],
  confused: [
    {
      id: "confused_decision",
      text: "What decision or situation feels unclear to you?",
      emotionId: "confused",
    },
    {
      id: "confused_options",
      text: "What are the choices or possibilities you are torn between?",
      emotionId: "confused",
    },
    {
      id: "confused_fear",
      text: "What are you afraid might happen if you choose wrongly?",
      emotionId: "confused",
    },
  ],
  overwhelmed: [
    {
      id: "overwhelmed_load",
      text: "What feels like too much for you right now?",
      emotionId: "overwhelmed",
    },
    {
      id: "overwhelmed_priority",
      text: "What is taking up most of your mental space?",
      emotionId: "overwhelmed",
    },
    {
      id: "overwhelmed_control",
      text: "What could you let go of, postpone, or ask for help with?",
      emotionId: "overwhelmed",
    },
  ],
  heavy: [
    {
      id: "heavy_burden",
      text: "What feels heaviest on your mind or heart right now?",
      emotionId: "heavy",
    },
    {
      id: "heavy_cause",
      text: "When did this feeling begin or become stronger?",
      emotionId: "heavy",
    },
    {
      id: "heavy_need",
      text: "What do you feel you need most right now?",
      emotionId: "heavy",
    },
  ],
  hopeful: [
    {
      id: "hopeful_source",
      text: "What is giving you hope right now?",
      emotionId: "hopeful",
    },
    {
      id: "hopeful_desire",
      text: "What are you hoping will happen?",
      emotionId: "hopeful",
    },
    {
      id: "hopeful_action",
      text: "What small step could help you move toward that hope?",
      emotionId: "hopeful",
    },
  ],
  seeking: [
    {
      id: "seeking_guidance",
      text: "What kind of guidance are you looking for?",
      emotionId: "seeking",
    },
    {
      id: "seeking_decision",
      text: "What situation do you want greater clarity about?",
      emotionId: "seeking",
    },
    {
      id: "seeking_change",
      text: "What would you most like to understand or change?",
      emotionId: "seeking",
    },
  ],
  jealous: [
    {
      id: "jealous_trigger",
      text: "What situation is bringing up these feelings of comparison?",
      emotionId: "jealous",
    },
    {
      id: "jealous_need",
      text: "What do you wish you had that you feel someone else has?",
      emotionId: "jealous",
    },
    {
      id: "jealous_self",
      text: "What does this comparison make you believe about yourself?",
      emotionId: "jealous",
    },
  ],
  grieving: [
    {
      id: "grieving_loss",
      text: "What loss or change are you moving through?",
      emotionId: "grieving",
    },
    {
      id: "grieving_feeling",
      text: "What part of this loss feels hardest right now?",
      emotionId: "grieving",
    },
    {
      id: "grieving_need",
      text: "What do you wish you could say, express, or receive right now?",
      emotionId: "grieving",
    },
  ],
  lonely: [
    {
      id: "lonely_connection",
      text: "What kind of connection are you missing right now?",
      emotionId: "lonely",
    },
    {
      id: "lonely_person",
      text: "Is there someone you wish you could talk to or be with?",
      emotionId: "lonely",
    },
    {
      id: "lonely_need",
      text: "What do you wish someone understood about what you're going through?",
      emotionId: "lonely",
    },
  ],
  restless: [
    {
      id: "restless_thought",
      text: "What keeps coming back to your mind?",
      emotionId: "restless",
    },
    {
      id: "restless_uncertainty",
      text: "Is there something unresolved that you are struggling to let go of?",
      emotionId: "restless",
    },
    {
      id: "restless_need",
      text: "What do you feel would help you feel more settled right now?",
      emotionId: "restless",
    },
  ],
  fearful: [
    {
      id: "fearful_threat",
      text: "What are you afraid might happen?",
      emotionId: "fearful",
    },
    {
      id: "fearful_origin",
      text: "Is this fear connected to something happening now or something from the past?",
      emotionId: "fearful",
    },
    {
      id: "fearful_control",
      text: "What part of this fear feels within your control?",
      emotionId: "fearful",
    },
  ],
  nervous: [
    {
      id: "nervous_event",
      text: "What are you nervous about happening?",
      emotionId: "nervous",
    },
    {
      id: "nervous_outcome",
      text: "What outcome are you most concerned about?",
      emotionId: "nervous",
    },
    {
      id: "nervous_preparation",
      text: "What do you wish you felt more prepared for?",
      emotionId: "nervous",
    },
  ],
  sleepless: [
    {
      id: "sleepless_thoughts",
      text: "What thoughts keep coming back when you try to sleep?",
      emotionId: "sleepless",
    },
    {
      id: "sleepless_worry",
      text: "Is there something you are worried about tonight?",
      emotionId: "sleepless",
    },
    {
      id: "sleepless_release",
      text: "What feels difficult to put aside before you rest?",
      emotionId: "sleepless",
    },
  ],
};

/**
 * Retrieve the exactly 3 canonical guided questions for an emotion.
 * Supports direct ID match and synonym matching.
 */
export function getGuidedQuestionsForEmotion(emotionId?: string | null): GuidedQuestion[] {
  if (!emotionId) return [];
  const normalized = emotionId.trim().toLowerCase();

  if (CANONICAL_GUIDED_QUESTIONS[normalized]) {
    return CANONICAL_GUIDED_QUESTIONS[normalized];
  }

  // Check synonym map if not a direct key
  const canonical = mapToCanonicalEmotion(normalized);
  if (canonical && CANONICAL_GUIDED_QUESTIONS[canonical]) {
    return CANONICAL_GUIDED_QUESTIONS[canonical];
  }

  return [];
}

/**
 * Lookup a specific guided question by its deterministic ID.
 */
export function getGuidedQuestionById(id: string): GuidedQuestion | undefined {
  const normalized = id.trim().toLowerCase();
  for (const questions of Object.values(CANONICAL_GUIDED_QUESTIONS)) {
    const found = questions.find((q) => q.id.toLowerCase() === normalized);
    if (found) return found;
  }
  return undefined;
}

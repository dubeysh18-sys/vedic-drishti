import {
  CANONICAL_GUIDED_QUESTIONS,
  getGuidedQuestionsForEmotion,
  getGuidedQuestionById,
} from "@/lib/emotions/guided-questions";
import { CreateReflectionSchema } from "@/lib/utils/validation";

describe("Epic — Guided Thought Prompts (US-01 to US-06)", () => {
  describe("US-04 Canonical Guided Questions & IDs", () => {
    const expectedEmotions = [
      "angry",
      "anxious",
      "confused",
      "overwhelmed",
      "heavy",
      "hopeful",
      "seeking",
      "jealous",
      "grieving",
      "lonely",
      "restless",
      "fearful",
      "nervous",
      "sleepless",
    ];

    it("should support exactly 14 canonical emotions in the guided questions registry", () => {
      const keys = Object.keys(CANONICAL_GUIDED_QUESTIONS);
      expect(keys.length).toBe(14);
      for (const emotion of expectedEmotions) {
        expect(CANONICAL_GUIDED_QUESTIONS[emotion]).toBeDefined();
      }
    });

    it("should provide exactly 3 questions for every supported emotion (AC US-01)", () => {
      for (const emotion of expectedEmotions) {
        const questions = CANONICAL_GUIDED_QUESTIONS[emotion];
        expect(questions).toBeDefined();
        expect(questions.length).toBe(3);
        for (const q of questions) {
          expect(q.id).toBeDefined();
          expect(q.id.length).toBeGreaterThan(0);
          expect(q.text).toBeDefined();
          expect(q.text.length).toBeGreaterThan(0);
          expect(q.emotionId).toBe(emotion);
        }
      }
    });

    it("should match exact canonical IDs and question strings for all 14 emotions as specified in US-04", () => {
      // Angry
      expect(CANONICAL_GUIDED_QUESTIONS.angry).toEqual([
        { id: "angry_trigger", text: "What happened that made you angry?", emotionId: "angry" },
        { id: "angry_hurt", text: "What felt unfair, hurtful, or disrespectful?", emotionId: "angry" },
        { id: "angry_control", text: "What part of this situation feels outside your control?", emotionId: "angry" },
      ]);

      // Anxious
      expect(CANONICAL_GUIDED_QUESTIONS.anxious).toEqual([
        { id: "anxious_worry", text: "What are you most worried might happen?", emotionId: "anxious" },
        { id: "anxious_timing", text: "Is this worry about something happening now or something that might happen later?", emotionId: "anxious" },
        { id: "anxious_control", text: "What part of this situation feels outside your control?", emotionId: "anxious" },
      ]);

      // Confused
      expect(CANONICAL_GUIDED_QUESTIONS.confused).toEqual([
        { id: "confused_decision", text: "What decision or situation feels unclear to you?", emotionId: "confused" },
        { id: "confused_options", text: "What are the choices or possibilities you are torn between?", emotionId: "confused" },
        { id: "confused_fear", text: "What are you afraid might happen if you choose wrongly?", emotionId: "confused" },
      ]);

      // Overwhelmed
      expect(CANONICAL_GUIDED_QUESTIONS.overwhelmed).toEqual([
        { id: "overwhelmed_load", text: "What feels like too much for you right now?", emotionId: "overwhelmed" },
        { id: "overwhelmed_priority", text: "What is taking up most of your mental space?", emotionId: "overwhelmed" },
        { id: "overwhelmed_control", text: "What could you let go of, postpone, or ask for help with?", emotionId: "overwhelmed" },
      ]);

      // Heavy
      expect(CANONICAL_GUIDED_QUESTIONS.heavy).toEqual([
        { id: "heavy_burden", text: "What feels heaviest on your mind or heart right now?", emotionId: "heavy" },
        { id: "heavy_cause", text: "When did this feeling begin or become stronger?", emotionId: "heavy" },
        { id: "heavy_need", text: "What do you feel you need most right now?", emotionId: "heavy" },
      ]);

      // Hopeful
      expect(CANONICAL_GUIDED_QUESTIONS.hopeful).toEqual([
        { id: "hopeful_source", text: "What is giving you hope right now?", emotionId: "hopeful" },
        { id: "hopeful_desire", text: "What are you hoping will happen?", emotionId: "hopeful" },
        { id: "hopeful_action", text: "What small step could help you move toward that hope?", emotionId: "hopeful" },
      ]);

      // Seeking
      expect(CANONICAL_GUIDED_QUESTIONS.seeking).toEqual([
        { id: "seeking_guidance", text: "What kind of guidance are you looking for?", emotionId: "seeking" },
        { id: "seeking_decision", text: "What situation do you want greater clarity about?", emotionId: "seeking" },
        { id: "seeking_change", text: "What would you most like to understand or change?", emotionId: "seeking" },
      ]);

      // Jealous
      expect(CANONICAL_GUIDED_QUESTIONS.jealous).toEqual([
        { id: "jealous_trigger", text: "What situation is bringing up these feelings of comparison?", emotionId: "jealous" },
        { id: "jealous_need", text: "What do you wish you had that you feel someone else has?", emotionId: "jealous" },
        { id: "jealous_self", text: "What does this comparison make you believe about yourself?", emotionId: "jealous" },
      ]);

      // Grieving
      expect(CANONICAL_GUIDED_QUESTIONS.grieving).toEqual([
        { id: "grieving_loss", text: "What loss or change are you moving through?", emotionId: "grieving" },
        { id: "grieving_feeling", text: "What part of this loss feels hardest right now?", emotionId: "grieving" },
        { id: "grieving_need", text: "What do you wish you could say, express, or receive right now?", emotionId: "grieving" },
      ]);

      // Lonely
      expect(CANONICAL_GUIDED_QUESTIONS.lonely).toEqual([
        { id: "lonely_connection", text: "What kind of connection are you missing right now?", emotionId: "lonely" },
        { id: "lonely_person", text: "Is there someone you wish you could talk to or be with?", emotionId: "lonely" },
        { id: "lonely_need", text: "What do you wish someone understood about what you're going through?", emotionId: "lonely" },
      ]);

      // Restless
      expect(CANONICAL_GUIDED_QUESTIONS.restless).toEqual([
        { id: "restless_thought", text: "What keeps coming back to your mind?", emotionId: "restless" },
        { id: "restless_uncertainty", text: "Is there something unresolved that you are struggling to let go of?", emotionId: "restless" },
        { id: "restless_need", text: "What do you feel would help you feel more settled right now?", emotionId: "restless" },
      ]);

      // Fearful
      expect(CANONICAL_GUIDED_QUESTIONS.fearful).toEqual([
        { id: "fearful_threat", text: "What are you afraid might happen?", emotionId: "fearful" },
        { id: "fearful_origin", text: "Is this fear connected to something happening now or something from the past?", emotionId: "fearful" },
        { id: "fearful_control", text: "What part of this fear feels within your control?", emotionId: "fearful" },
      ]);

      // Nervous
      expect(CANONICAL_GUIDED_QUESTIONS.nervous).toEqual([
        { id: "nervous_event", text: "What are you nervous about happening?", emotionId: "nervous" },
        { id: "nervous_outcome", text: "What outcome are you most concerned about?", emotionId: "nervous" },
        { id: "nervous_preparation", text: "What do you wish you felt more prepared for?", emotionId: "nervous" },
      ]);

      // Sleepless
      expect(CANONICAL_GUIDED_QUESTIONS.sleepless).toEqual([
        { id: "sleepless_thoughts", text: "What thoughts keep coming back when you try to sleep?", emotionId: "sleepless" },
        { id: "sleepless_worry", text: "Is there something you are worried about tonight?", emotionId: "sleepless" },
        { id: "sleepless_release", text: "What feels difficult to put aside before you rest?", emotionId: "sleepless" },
      ]);
    });
  });

  describe("US-01 / US-02 Helper Functions", () => {
    it("should return empty array when no emotion is provided", () => {
      expect(getGuidedQuestionsForEmotion(null)).toEqual([]);
      expect(getGuidedQuestionsForEmotion(undefined)).toEqual([]);
      expect(getGuidedQuestionsForEmotion("")).toEqual([]);
    });

    it("should retrieve questions by valid emotion ID case-insensitively", () => {
      const questions = getGuidedQuestionsForEmotion("Anxious");
      expect(questions.length).toBe(3);
      expect(questions[0].id).toBe("anxious_worry");
    });

    it("should retrieve questions for synonym matches", () => {
      const questions = getGuidedQuestionsForEmotion("worried");
      expect(questions.length).toBe(3);
      expect(questions[0].id).toBe("anxious_worry");
    });

    it("should lookup specific question by unique ID", () => {
      const q = getGuidedQuestionById("anxious_control");
      expect(q).toBeDefined();
      expect(q?.text).toBe("What part of this situation feels outside your control?");
      expect(q?.emotionId).toBe("anxious");
    });

    it("should return undefined for unknown question ID", () => {
      expect(getGuidedQuestionById("non_existent_id")).toBeUndefined();
    });
  });

  describe("US-03 API Validation Schema", () => {
    it("should validate reflection request with guidedQuestionId and guidedQuestion", () => {
      const valid = CreateReflectionSchema.safeParse({
        message: "I am worried about my job performance.",
        selectedEmotion: "anxious",
        guidedQuestionId: "anxious_worry",
        guidedQuestion: "What are you most worried might happen?",
      });
      expect(valid.success).toBe(true);
      if (valid.success) {
        expect(valid.data.guidedQuestionId).toBe("anxious_worry");
        expect(valid.data.guidedQuestion).toBe("What are you most worried might happen?");
      }
    });

    it("should validate reflection request without guided questions (US-05 free-form primary)", () => {
      const valid = CreateReflectionSchema.safeParse({
        message: "I am having a rough day at work.",
      });
      expect(valid.success).toBe(true);
    });
  });
});

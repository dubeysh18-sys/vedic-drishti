export interface GuidedQuestion {
  /**
   * Deterministic unique canonical ID (e.g. "anxious_worry", "angry_trigger").
   */
  id: string;

  /**
   * Exact canonical question displayed to user.
   */
  text: string;

  /**
   * Canonical emotion ID this question belongs to.
   */
  emotionId: string;
}

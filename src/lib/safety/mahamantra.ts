/**
 * Deterministic Mahamantra Redirect Response (ADR-007 / Phase 12).
 *
 * For ordinary prohibited content, the application returns this deterministic response
 * directly without calling the main LLM, inviting the user to sit quietly and calm their mind.
 * It NEVER shames the user or declares them sinful/impure.
 */
export const MAHAMANTRA_TEXT = `Hare Krishna Hare Krishna
Krishna Krishna Hare Hare
Hare Rama Hare Rama
Rama Rama Hare Hare`;

export const MAHAMANTRA_GUIDANCE =
  "Let us step away from this inquiry for a moment. If your mind is feeling turbulent, unsettled, or agitated, you may sit quietly in stillness and gently repeat the Mahamantra for a while to find inner grounding.";

export const MAHAMANTRA_DISCLAIMER =
  "Drishti is a reflective spiritual companion. Chanting is offered as an optional mindful grounding practice for peace of mind, not as a clinical, medical, or legal intervention.";

export interface MahamantraResponse {
  mantra: string;
  guidance: string;
  disclaimer: string;
  reasonCode: string;
}

export function createMahamantraRedirect(reasonCode: string = "PROHIBITED_CONTENT"): MahamantraResponse {
  return {
    mantra: MAHAMANTRA_TEXT,
    guidance: MAHAMANTRA_GUIDANCE,
    disclaimer: MAHAMANTRA_DISCLAIMER,
    reasonCode,
  };
}

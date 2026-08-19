export interface AudioContextType {
  /**
   * User preference flag indicating if ambient sound is enabled (ON/OFF).
   * Persisted in localStorage.
   */
  isEnabled: boolean;

  /**
   * Whether the ambient audio is actively playing sound.
   */
  isPlaying: boolean;

  /**
   * Whether browser autoplay policy prevented immediate playback on load,
   * awaiting the user's first interaction.
   */
  isBlocked: boolean;

  /**
   * Toggle ambient sound ON/OFF immediately and update persistent preference.
   */
  toggleSound: () => void;

  /**
   * Enable ambient sound and begin playback.
   */
  enableSound: () => Promise<void>;

  /**
   * Disable ambient sound and pause playback (preserving playback position).
   */
  disableSound: () => void;

  /**
   * Temporarily pause ambient audio for a foreground audio source
   * (e.g., guided meditation, breathing exercise, or chime).
   * Supports multiple concurrent interruption sources.
   */
  pauseForInterruption: (sourceId: string) => void;

  /**
   * Release an interruption. Ambient audio resumes automatically once all
   * interruptions have concluded (if ambient sound is enabled).
   */
  resumeAfterInterruption: (sourceId: string) => void;
}

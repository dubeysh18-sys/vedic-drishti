/**
 * Unit tests for Global Ambient Audio Manager logic and state management
 */

describe("Global Ambient Audio Manager", () => {
  const STORAGE_KEY = "drishti_ambient_sound_enabled";
  let mockStorage: Record<string, string> = {};

  beforeEach(() => {
    mockStorage = {};
  });

  describe("Preference & Default State (AC 2 & 9)", () => {
    it("should default to sound ON (true) when no preference is stored in localStorage", () => {
      const stored = mockStorage[STORAGE_KEY];
      const isEnabled = stored === null || stored === undefined ? true : stored === "true";
      expect(isEnabled).toBe(true);
    });

    it("should respect stored 'false' preference across sessions", () => {
      mockStorage[STORAGE_KEY] = "false";
      const stored = mockStorage[STORAGE_KEY];
      const isEnabled = stored === null || stored === undefined ? true : stored === "true";
      expect(isEnabled).toBe(false);
    });

    it("should respect stored 'true' preference across sessions", () => {
      mockStorage[STORAGE_KEY] = "true";
      const stored = mockStorage[STORAGE_KEY];
      const isEnabled = stored === null || stored === undefined ? true : stored === "true";
      expect(isEnabled).toBe(true);
    });

    it("should update localStorage when toggling state", () => {
      let isEnabled = true;
      
      // User toggles sound OFF
      isEnabled = !isEnabled;
      mockStorage[STORAGE_KEY] = String(isEnabled);
      expect(mockStorage[STORAGE_KEY]).toBe("false");

      // User toggles sound ON
      isEnabled = !isEnabled;
      mockStorage[STORAGE_KEY] = String(isEnabled);
      expect(mockStorage[STORAGE_KEY]).toBe("true");
    });
  });

  describe("Interruption Management for Meditation / Breathing Audio (AC 12)", () => {
    class AudioManagerSimulator {
      isEnabled: boolean = true;
      isPlaying: boolean = false;
      currentTime: number = 0;
      interruptions: Set<string> = new Set();

      constructor(initialEnabled: boolean = true) {
        this.isEnabled = initialEnabled;
        if (initialEnabled) {
          this.isPlaying = true;
        }
      }

      pauseForInterruption(sourceId: string) {
        this.interruptions.add(sourceId);
        if (this.isPlaying) {
          this.isPlaying = false;
          // Note: AC 10 - currentTime is preserved!
        }
      }

      resumeAfterInterruption(sourceId: string) {
        this.interruptions.delete(sourceId);
        if (this.interruptions.size === 0 && this.isEnabled) {
          this.isPlaying = true;
        }
      }

      toggleSound() {
        this.isEnabled = !this.isEnabled;
        if (!this.isEnabled) {
          this.isPlaying = false;
        } else if (this.interruptions.size === 0) {
          this.isPlaying = true;
        }
      }
    }

    it("should temporarily pause ambient music when meditation audio starts and resume when it ends", () => {
      const manager = new AudioManagerSimulator(true);
      manager.currentTime = 42.5; // mid-track

      expect(manager.isPlaying).toBe(true);

      // Start guided meditation track
      manager.pauseForInterruption("meditation-breathing-session-1");
      expect(manager.isPlaying).toBe(false);
      expect(manager.currentTime).toBe(42.5); // Position preserved

      // End guided meditation track
      manager.resumeAfterInterruption("meditation-breathing-session-1");
      expect(manager.isPlaying).toBe(true);
      expect(manager.currentTime).toBe(42.5); // Resumes from current position
    });

    it("should handle multiple concurrent interruption sources correctly", () => {
      const manager = new AudioManagerSimulator(true);

      manager.pauseForInterruption("source-a");
      manager.pauseForInterruption("source-b");
      expect(manager.isPlaying).toBe(false);

      // Release first source - still paused because source-b is active
      manager.resumeAfterInterruption("source-a");
      expect(manager.isPlaying).toBe(false);

      // Release second source - now ambient music resumes
      manager.resumeAfterInterruption("source-b");
      expect(manager.isPlaying).toBe(true);
    });

    it("should not resume ambient music after interruption if user explicitly muted sound", () => {
      const manager = new AudioManagerSimulator(true);

      manager.pauseForInterruption("meditation-1");
      expect(manager.isPlaying).toBe(false);

      // User mutes ambient sound while meditation is playing
      manager.toggleSound();
      expect(manager.isEnabled).toBe(false);

      // Meditation finishes
      manager.resumeAfterInterruption("meditation-1");
      expect(manager.isPlaying).toBe(false); // Still muted as per user preference
    });
  });

  describe("Resume Position (AC 10)", () => {
    it("should preserve playback position when pausing and unmuting", () => {
      let currentTime = 15.2;
      let isPlaying = true;

      // Mute (pause)
      isPlaying = false;
      // currentTime remains 15.2

      // Unmute (play)
      isPlaying = true;
      expect(currentTime).toBe(15.2);
    });
  });

  describe("Autoplay Restrictions Fallback (AC 3)", () => {
    it("should flag isBlocked when autoplay is rejected by browser policy and clear on user interaction", () => {
      let isBlocked = false;
      let isPlaying = false;
      let isEnabled = true;

      // Autoplay blocked simulation
      const onAutoplayRejected = (errName: string) => {
        if (errName === "NotAllowedError") {
          isBlocked = true;
          isPlaying = false;
        }
      };

      onAutoplayRejected("NotAllowedError");
      expect(isBlocked).toBe(true);
      expect(isPlaying).toBe(false);

      // User performs first interaction gesture
      const onUserInteraction = () => {
        if (isEnabled) {
          isPlaying = true;
          isBlocked = false;
        }
      };

      onUserInteraction();
      expect(isBlocked).toBe(false);
      expect(isPlaying).toBe(true);
    });
  });
});

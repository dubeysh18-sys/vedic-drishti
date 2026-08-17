export type LogLevel = "info" | "warn" | "error" | "debug";

export interface LogEntry {
  level: LogLevel;
  event: string;
  timestamp: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
}

export class Logger {
  private static sanitize(obj: unknown): unknown {
    if (!obj || typeof obj !== "object") return obj;
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      // Omit PII fields from logs
      if (/email|password|token|secret|jwt|auth/i.test(key)) {
        sanitized[key] = "[REDACTED]";
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  static info(event: string, metadata?: Record<string, unknown>, sessionId?: string): void {
    const entry: LogEntry = {
      level: "info",
      event,
      timestamp: new Date().toISOString(),
      sessionId,
      metadata: this.sanitize(metadata) as Record<string, unknown>,
    };
    console.log(JSON.stringify(entry));
  }

  static warn(event: string, metadata?: Record<string, unknown>, sessionId?: string): void {
    const entry: LogEntry = {
      level: "warn",
      event,
      timestamp: new Date().toISOString(),
      sessionId,
      metadata: this.sanitize(metadata) as Record<string, unknown>,
    };
    console.warn(JSON.stringify(entry));
  }

  static error(event: string, error?: unknown, metadata?: Record<string, unknown>, sessionId?: string): void {
    const entry: LogEntry = {
      level: "error",
      event,
      timestamp: new Date().toISOString(),
      sessionId,
      metadata: {
        ...((this.sanitize(metadata) as Record<string, unknown>) || {}),
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
    };
    console.error(JSON.stringify(entry));
  }
}

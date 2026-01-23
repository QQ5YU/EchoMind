export type LogLevel = "debug" | "info" | "warn" | "error";
export type Transport = (level: LogLevel, args: unknown[]) => void;

export const LOG_CONFIG = {
  DEV: "debug", 
  PROD: "warn", 
} as const satisfies Record<string, LogLevel>;

import { LogLevel, Transport } from "./type";

class CoreLogger {
  private level: LogLevel;
  private transport: Transport;

  constructor(level: LogLevel = "info", transport: Transport) {
    this.level = level;
    this.transport = transport;
  }

  setLevel(level: LogLevel) {
    this.level = level;
  }

  setTransport(fn: Transport) {
    this.transport = fn;
  }

  private shouldLog(level: LogLevel) {
    const order: LogLevel[] = ["debug", "info", "warn", "error"];
    return order.indexOf(level) >= order.indexOf(this.level);
  }

  emit(level: LogLevel, args: unknown[]) {
    if (!this.shouldLog(level)) return;
    this.transport(level, args);
  }

  debug(...args: unknown[]) {
    this.emit("debug", args);
  }

  info(...args: unknown[]) {
    this.emit("info", args);
  }

  warn(...args: unknown[]) {
    this.emit("warn", args);
  }

  error(...args: unknown[]) {
    this.emit("error", args);
  }
}

export default CoreLogger;

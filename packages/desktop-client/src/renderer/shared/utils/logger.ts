import {
  CoreLogger,
  LOG_CONFIG,
  LogLevel,
  Transport,
} from "@shared-core/logger";

const transport: Transport = (level, args) => {
  const prefix = `[renderer]`;
  switch (level) {
    case "debug":
      console.debug(prefix, ...args);
      break;
    case "info":
      console.info(prefix, ...args);
      break;
    case "warn":
      console.warn(prefix, ...args);
      break;
    case "error":
      console.error(prefix, ...args);
      break;
  }
};

const minLogLevel: LogLevel = import.meta.env.DEV
  ? LOG_CONFIG.DEV
  : LOG_CONFIG.PROD;

const logger = new CoreLogger(minLogLevel, transport);

export { logger };

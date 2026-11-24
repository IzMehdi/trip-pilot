import pino from 'pino';
import type { AppConfig } from '../types';

/** Redacted field patterns for sensitive data. */
const redactPaths = [
  'req.headers.authorization',
  'req.headers.cookie',
  "req.headers['x-api-key']",
  "req.headers['x-forwarded-for']",
  'req.body.apiKey',
  'req.body.secret',
  'req.body.token',
  'req.body.password',
  "res.headers['set-cookie']",
];

/** Create a pino logger instance with appropriate configuration. */
export function createLogger(config: AppConfig): pino.Logger {
  const isDevelopment = config.nodeEnv === 'development';

  const logger = pino({
    level: isDevelopment ? 'debug' : 'info',
    redact: {
      paths: redactPaths,
      censor: '[REDACTED]',
    },
    transport: isDevelopment
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
    base: {
      service: 'trip-pilot',
      env: config.nodeEnv,
    },
  });

  return logger;
}

/** Logger instance (initialized in plugins/logging.ts). */
let loggerInstance: pino.Logger | null = null;

/**
 * Get the global logger instance.
 * @returns Pino logger instance
 * @throws Error if logger not initialized
 */
export function getLogger(): pino.Logger {
  if (!loggerInstance) {
    throw new Error('Logger not initialized. Call initializeLogger() first.');
  }
  return loggerInstance;
}

/**
 * Initialize the global logger instance.
 * @param logger Pino logger instance
 */
export function initializeLogger(logger: pino.Logger): void {
  loggerInstance = logger;
}

/**
 * Generate a correlation ID for request tracking.
 * @returns Unique correlation ID
 */
export function generateCorrelationId(): string {
  return `req-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

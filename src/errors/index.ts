/** Standardized error codes for the API. */
export const ErrorCodes = {
  /** Configuration error (missing/invalid env vars). */
  CONFIG_ERROR: 'CONFIG_ERROR',
  /** Request validation error. */
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  /** Resource not found. */
  NOT_FOUND: 'NOT_FOUND',
  /** Internal server error. */
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  /** Rate limit exceeded. */
  RATE_LIMITED: 'RATE_LIMITED',
  /** External provider error. */
  PROVIDER_ERROR: 'PROVIDER_ERROR',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

/** Base application error class. */
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(code: ErrorCode, message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintains proper stack trace in V8 environments
    Error.captureStackTrace(this, this.constructor);
  }
}

/** Configuration error. */
export class ConfigError extends AppError {
  constructor(message = 'Configuration error') {
    super(ErrorCodes.CONFIG_ERROR, message, 500, true);
  }
}

/** Validation error. */
export class ValidationError extends AppError {
  public readonly details: unknown;

  constructor(message = 'Validation failed', details?: unknown) {
    super(ErrorCodes.VALIDATION_ERROR, message, 400, true);
    this.details = details;
  }
}

/** Not found error. */
export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(ErrorCodes.NOT_FOUND, `${resource} not found`, 404, true);
  }
}

/** Internal server error. */
export class InternalError extends AppError {
  constructor(message = 'Internal server error') {
    super(ErrorCodes.INTERNAL_ERROR, message, 500, false);
  }
}

/** Rate limited error. */
export class RateLimitedError extends AppError {
  public readonly retryAfter?: number;

  constructor(message = 'Rate limit exceeded', retryAfter?: number) {
    super(ErrorCodes.RATE_LIMITED, message, 429, true);
    this.retryAfter = retryAfter;
  }
}

/** External provider error. */
export class ProviderError extends AppError {
  public readonly provider: string;
  public readonly originalError?: Error;

  constructor(provider: string, message: string, originalError?: Error) {
    super(ErrorCodes.PROVIDER_ERROR, `${provider}: ${message}`, 502, true);
    this.provider = provider;
    this.originalError = originalError;
  }
}

/** Serialized error response shape. */
export interface SerializedError {
  error: {
    code: ErrorCode;
    message: string;
    requestId: string;
    timestamp: string;
  };
}

/**
 * Serialize an error into a consistent API response format.
 * @param error Error to serialize
 * @param requestId Request correlation ID
 * @returns Serialized error response
 */
export function serializeError(error: unknown, requestId: string): SerializedError {
  const timestamp = new Date().toISOString();

  if (error instanceof AppError) {
    return {
      error: {
        code: error.code,
        message: error.message,
        requestId,
        timestamp,
      },
    };
  }

  if (error instanceof Error) {
    // Log the full error internally but return generic message
    return {
      error: {
        code: ErrorCodes.INTERNAL_ERROR,
        message: 'An unexpected error occurred',
        requestId,
        timestamp,
      },
    };
  }

  return {
    error: {
      code: ErrorCodes.INTERNAL_ERROR,
      message: 'An unknown error occurred',
      requestId,
      timestamp,
    },
  };
}

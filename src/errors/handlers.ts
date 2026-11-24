import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { getLogger } from '../logging';
import { AppError, serializeError, ErrorCodes, ValidationError, RateLimitedError } from './index';

/** Fastify error handler for application errors. */
export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
): void {
  const logger = getLogger();
  const requestId = request.id || 'unknown';

  // Handle Fastify validation errors
  if (error.validation) {
    const validationError = new ValidationError('Request validation failed', error.validation);
    const serialized = serializeError(validationError, requestId);
    logger.warn({ validationError: error.validation, requestId }, 'Validation error');
    reply.status(400).send(serialized);
    return;
  }

  // Handle rate limit errors from @fastify/rate-limit
  if (error.statusCode === 429) {
    const retryAfter = 60; // Default retry after
    const rateLimitedError = new RateLimitedError('Rate limit exceeded', retryAfter);
    const serialized = serializeError(rateLimitedError, requestId);
    reply.headers({ 'Retry-After': String(retryAfter) });
    logger.warn({ requestId, retryAfter }, 'Rate limit exceeded');
    reply.status(429).send(serialized);
    return;
  }

  // Handle known application errors
  if (error instanceof AppError) {
    const serialized = serializeError(error, requestId);
    const logLevel = error.isOperational ? 'warn' : 'error';
    logger[logLevel]({ err: error, requestId }, error.message);
    reply.status(error.statusCode).send(serialized);
    return;
  }

  // Handle unknown errors
  const internalError = new Error(error.message || 'Unknown error');
  const serialized = serializeError(internalError, requestId);
  logger.error({ err: error, requestId }, 'Unhandled error');
  reply.status(500).send(serialized);
}

/** Fastify not found handler. */
export function notFoundHandler(request: FastifyRequest, reply: FastifyReply): void {
  const requestId = request.id || 'unknown';
  const logger = getLogger();

  const error = {
    error: {
      code: ErrorCodes.NOT_FOUND,
      message: `Route ${request.method} ${request.url} not found`,
      requestId,
      timestamp: new Date().toISOString(),
    },
  };

  logger.warn({ method: request.method, url: request.url, requestId }, 'Route not found');
  reply.status(404).send(error);
}

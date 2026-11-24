import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { createLogger, initializeLogger, generateCorrelationId } from '../logging';
import { getConfig } from '../config';

/** Fastify plugin for logging with correlation IDs. */
// eslint-disable-next-line @typescript-eslint/require-await
const loggingPlugin: FastifyPluginAsync = async (app) => {
  const config = getConfig();
  const logger = createLogger(config);
  initializeLogger(logger);

  // Replace Fastify's default logger with our pino instance
  app.log = logger;

  // Add correlation ID to each request
  app.addHook('onRequest', async (request, _reply) => {
    const correlationId = (request.headers['x-request-id'] as string) || generateCorrelationId();
    request.id = correlationId;
    request.log = logger.child({ requestId: correlationId });
  });

  // Log request completion
  app.addHook('onResponse', async (request, reply) => {
    const { method, url, id } = request;
    const { statusCode } = reply;
    const responseTime = reply.getResponseTime();

    request.log.info({ method, url, statusCode, responseTime, requestId: id }, 'Request completed');
  });

  // Log errors
  app.addHook('onError', async (request, _reply, error) => {
    request.log.error({ err: error, requestId: request.id }, 'Request error');
  });

  app.log.info({ version: '0.1.0', env: config.nodeEnv }, 'Logging initialized');
};

export default fp(loggingPlugin, { name: 'logging' });

import Fastify, { type FastifyInstance } from 'fastify';
import { loadConfig } from './config';
import loggingPlugin from './plugins/logging';
import sensiblePlugin from './plugins/sensible';
import corsPlugin from './plugins/cors';
import rateLimitPlugin from './plugins/rate-limit';
import routes from './routes/index';
import { errorHandler, notFoundHandler } from './errors/handlers';

/** Create and configure the Fastify application. */
export async function createApp(): Promise<FastifyInstance> {
  // Load configuration first (fail fast)
  loadConfig();

  const app = Fastify({
    logger: false, // We use custom pino logger via plugin
    ajv: {
      customOptions: {
        strict: true,
        allErrors: true,
        removeAdditional: 'all',
      },
    },
  });

  // Register plugins in order
  await app.register(loggingPlugin);
  await app.register(sensiblePlugin);
  await app.register(corsPlugin);
  await app.register(rateLimitPlugin);

  // Register routes
  await app.register(routes);

  // Register error handlers
  app.setErrorHandler(errorHandler);
  app.setNotFoundHandler(notFoundHandler);

  return app;
}

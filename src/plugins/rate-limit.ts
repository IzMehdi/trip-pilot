import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { getConfig } from '../config';

/** Fastify plugin for rate limiting. */
const rateLimitPlugin: FastifyPluginAsync = async (app) => {
  const config = getConfig();

  const maxRequests = config.nodeEnv === 'production' ? 100 : 1000;
  const timeWindow = '1 minute';

  await app.register(import('@fastify/rate-limit'), {
    max: maxRequests,
    timeWindow,
    allowList: config.nodeEnv === 'development' ? ['127.0.0.1', '::1'] : [],
    keyGenerator: (request) => request.ip,
    errorResponseBuilder: () => ({ error: 'Too many requests, please try again later' }),
    addHeaders: {
      'x-ratelimit-limit': true,
      'x-ratelimit-remaining': true,
      'x-ratelimit-reset': true,
    },
  });

  app.log.info({ maxRequests, timeWindow }, 'Rate limiting configured');
};

export default fp(rateLimitPlugin, { name: 'rate-limit' });

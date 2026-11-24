import type { FastifyPluginAsync } from 'fastify';
import { getConfig } from '../config';

/** Health and readiness routes. */
// eslint-disable-next-line @typescript-eslint/require-await
const healthRoutes: FastifyPluginAsync = async (app) => {
  const startTime = Date.now();

  /** GET /health - Liveness probe. */
  app.get(
    '/health',
    {
      schema: {
        tags: ['Health'],
        summary: 'Liveness check',
        description: 'Returns service liveness status',
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok'] },
              timestamp: { type: 'string', format: 'date-time' },
              uptime: { type: 'number' },
            },
          },
        },
      },
    },
    async (_request, reply) => {
      return reply.send({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: Math.floor((Date.now() - startTime) / 1000),
      });
    },
  );

  /** GET /ready - Readiness probe. */
  app.get(
    '/ready',
    {
      schema: {
        tags: ['Health'],
        summary: 'Readiness check',
        description: 'Returns service readiness status',
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ready'] },
              timestamp: { type: 'string', format: 'date-time' },
              checks: {
                type: 'object',
                properties: {
                  config: { type: 'boolean' },
                },
              },
            },
          },
        },
      },
    },
    async (_request, reply) => {
      getConfig();
      return reply.send({
        status: 'ready',
        timestamp: new Date().toISOString(),
        checks: {
          config: true,
        },
      });
    },
  );
};

export default healthRoutes;

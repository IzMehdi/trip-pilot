import type { FastifyPluginAsync } from 'fastify';
import healthRoutes from './health';

/** Register all API routes under /api/v1 prefix. */
// eslint-disable-next-line @typescript-eslint/require-await
const routes: FastifyPluginAsync = async (app) => {
  app.register(healthRoutes, { prefix: '/api/v1' });
};

export default routes;

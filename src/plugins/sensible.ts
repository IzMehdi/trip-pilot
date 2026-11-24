import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

/** Fastify plugin for sensible defaults. */
const sensiblePlugin: FastifyPluginAsync = async (app) => {
  await app.register(import('@fastify/sensible'));
  app.log.info('Sensible plugin registered');
};

export default fp(sensiblePlugin, { name: 'sensible' });

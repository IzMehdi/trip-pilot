import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { getConfig } from '../config';

/** Fastify plugin for CORS configuration. */
const corsPlugin: FastifyPluginAsync = async (app) => {
  const config = getConfig();

  // Define allowed origins based on environment
  const allowedOrigins =
    config.nodeEnv === 'production'
      ? ['https://trip-pilot.example.com'] // Replace with actual production domain
      : [
          'http://localhost:3000',
          'http://localhost:5173',
          'http://127.0.0.1:3000',
          'http://127.0.0.1:5173',
        ];

  await app.register(import('@fastify/cors'), {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    exposedHeaders: ['X-Request-ID'],
    credentials: true,
    maxAge: 86400, // 24 hours
  });

  app.log.info({ allowedOrigins }, 'CORS configured');
};

export default fp(corsPlugin, { name: 'cors' });

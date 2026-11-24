import { createApp } from './app';
import { getConfig, loadConfig } from './config';
import { getLogger } from './logging';

/** Graceful shutdown handler. */
async function gracefulShutdown(app: Awaited<ReturnType<typeof createApp>>): Promise<void> {
  const logger = getLogger();
  logger.info('Shutdown signal received, closing server...');

  try {
    await app.close();
    logger.info('Server closed successfully');
    process.exit(0);
  } catch (error) {
    logger.error({ err: error }, 'Error during shutdown');
    process.exit(1);
  }
}

/** Fallback logger for early startup errors. */
const fallbackLogger = {
  fatal: (obj: Record<string, unknown>, msg: string) => {
    console.error(JSON.stringify({ level: 60, ...obj, msg, timestamp: new Date().toISOString() }));
  },
};

/** Main entry point. */
async function main(): Promise<void> {
  try {
    // Load config early for startup logging
    loadConfig();
    const config = getConfig();

    const app = await createApp();

    // Initialize logger after app creation (for correlation IDs)
    // The app's logger is already initialized in the logging plugin

    const address = await app.listen({
      port: config.port,
      host: '0.0.0.0',
    });

    const logger = getLogger();
    logger.info(
      { version: '0.1.0', env: config.nodeEnv, port: config.port, address },
      'Server started',
    );

    // Handle shutdown signals
    process.on('SIGTERM', () => {
      void gracefulShutdown(app);
    });
    process.on('SIGINT', () => {
      void gracefulShutdown(app);
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.fatal({ err: error }, 'Uncaught exception');
      void gracefulShutdown(app);
    });

    process.on('unhandledRejection', (reason) => {
      logger.fatal({ reason }, 'Unhandled rejection');
      void gracefulShutdown(app);
    });
  } catch (error) {
    // Fallback logger if initialization fails
    fallbackLogger.fatal({ err: error, context: 'startup' }, 'Failed to start server');
    process.exit(1);
  }
}

void main();

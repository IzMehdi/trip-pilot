import { envSchema, type EnvOutput } from './schema';
import type { AppConfig } from '../types';

/** Validated application configuration. */
let config: AppConfig | null = null;

/**
 * Transform raw env vars into structured AppConfig.
 */
function transformConfig(env: EnvOutput): AppConfig {
  return {
    port: env.PORT,
    nodeEnv: env.NODE_ENV,
    nvidia: {
      apiKey: env.NVIDIA_API_KEY,
      baseUrl: env.NVIDIA_BASE_URL,
      modelId: env.NVIDIA_MODEL_ID,
    },
    duffel: {
      accessToken: env.DUFFEL_ACCESS_TOKEN,
      baseUrl: env.DUFFEL_BASE_URL,
    },
    aviationStack: {
      apiKey: env.AVIATIONSTACK_API_KEY,
      baseUrl: env.AVIATIONSTACK_BASE_URL,
    },
    openMeteo: {
      baseUrl: env.OPEN_METEO_BASE_URL,
    },
    osm: {
      nominatimUserAgent: env.NOMINATIM_USER_AGENT,
      osrmBaseUrl: env.OSRM_BASE_URL,
      valhallaBaseUrl: env.VALHALLA_BASE_URL,
    },
  };
}

/**
 * Load and validate configuration from environment variables.
 * Fails fast with clear messages if required variables are missing.
 * @returns Validated configuration object
 * @throws Error if validation fails
 */
export function loadConfig(): AppConfig {
  if (config) {
    return config;
  }

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const issues = result.error.issues.map((issue) => {
      const path = issue.path.join('.');
      return `${path}: ${issue.message}`;
    });
    const message = `Configuration validation failed:\n${issues.join('\n')}`;
    throw new Error(message);
  }

  config = transformConfig(result.data);
  return config;
}

/**
 * Get the validated configuration.
 * Throws if config hasn't been loaded yet.
 * @returns Validated configuration object
 * @throws Error if config not loaded
 */
export function getConfig(): AppConfig {
  if (!config) {
    throw new Error('Configuration not loaded. Call loadConfig() first.');
  }
  return config;
}

/**
 * Reset configuration (primarily for testing).
 */
export function resetConfig(): void {
  config = null;
}

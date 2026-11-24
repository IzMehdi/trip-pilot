import { z } from 'zod';

/** Schema for NVIDIA configuration. */
export const nvidiaSchema = z.object({
  apiKey: z.string().min(1, 'NVIDIA_API_KEY is required'),
  baseUrl: z.string().url('NVIDIA_BASE_URL must be a valid URL'),
  modelId: z.string().min(1, 'NVIDIA_MODEL_ID is required'),
});

/** Schema for Duffel configuration. */
export const duffelSchema = z.object({
  accessToken: z.string().min(1, 'DUFFEL_ACCESS_TOKEN is required'),
  baseUrl: z.string().url('DUFFEL_BASE_URL must be a valid URL'),
});

/** Schema for AviationStack configuration. */
export const aviationStackSchema = z.object({
  apiKey: z.string().min(1, 'AVIATIONSTACK_API_KEY is required'),
  baseUrl: z.string().url('AVIATIONSTACK_BASE_URL must be a valid URL'),
});

/** Schema for Open-Meteo configuration. */
export const openMeteoSchema = z.object({
  baseUrl: z.string().url('OPEN_METEO_BASE_URL must be a valid URL'),
});

/** Schema for OpenStreetMap ecosystem configuration. */
export const osmSchema = z.object({
  nominatimUserAgent: z.string().min(1, 'NOMINATIM_USER_AGENT is required'),
  osrmBaseUrl: z
    .string()
    .url('OSRM_BASE_URL must be a valid URL')
    .default('https://router.project-osrm.org'),
  valhallaBaseUrl: z
    .string()
    .url('VALHALLA_BASE_URL must be a valid URL')
    .default('https://valhalla1.openstreetmap.de'),
});

/** Schema for application configuration. */
export const appSchema = z.object({
  port: z.coerce.number().int().positive().default(3000),
  nodeEnv: z.enum(['development', 'test', 'production']).default('development'),
});

/** Full environment schema combining all sections. */
export const envSchema = z.object({
  NVIDIA_API_KEY: z.string().min(1),
  NVIDIA_BASE_URL: z.string().url(),
  NVIDIA_MODEL_ID: z.string().min(1),
  DUFFEL_ACCESS_TOKEN: z.string().min(1),
  DUFFEL_BASE_URL: z.string().url(),
  AVIATIONSTACK_API_KEY: z.string().min(1),
  AVIATIONSTACK_BASE_URL: z.string().url(),
  OPEN_METEO_BASE_URL: z.string().url(),
  NOMINATIM_USER_AGENT: z.string().min(1),
  OSRM_BASE_URL: z.string().url().default('https://router.project-osrm.org'),
  VALHALLA_BASE_URL: z.string().url().default('https://valhalla1.openstreetmap.de'),
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

export type EnvInput = z.input<typeof envSchema>;
export type EnvOutput = z.output<typeof envSchema>;

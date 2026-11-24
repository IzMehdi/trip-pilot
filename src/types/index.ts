/** Application configuration shape after validation. */
export interface AppConfig {
  /** HTTP server port. */
  port: number;
  /** Runtime environment. */
  nodeEnv: 'development' | 'test' | 'production';

  /** NVIDIA API configuration. */
  nvidia: {
    apiKey: string;
    baseUrl: string;
    modelId: string;
  };

  /** Duffel API configuration. */
  duffel: {
    accessToken: string;
    baseUrl: string;
  };

  /** AviationStack API configuration. */
  aviationStack: {
    apiKey: string;
    baseUrl: string;
  };

  /** Open-Meteo API configuration. */
  openMeteo: {
    baseUrl: string;
  };

  /** OpenStreetMap ecosystem configuration. */
  osm: {
    nominatimUserAgent: string;
    osrmBaseUrl: string;
    valhallaBaseUrl: string;
  };
}

/** Generic API error response shape. */
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    requestId: string;
    timestamp: string;
  };
}

/** Health check response shape. */
export interface HealthResponse {
  status: 'ok';
  timestamp: string;
  uptime: number;
}

/** Readiness check response shape. */
export interface ReadyResponse {
  status: 'ready';
  timestamp: string;
  checks: {
    config: boolean;
  };
}

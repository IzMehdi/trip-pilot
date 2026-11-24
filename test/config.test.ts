import { describe, it, expect, beforeEach, vi } from "vitest";

describe("Config", () => {
  beforeEach(() => {
    vi.resetModules();
    // Clear all relevant env vars
    delete process.env.NVIDIA_API_KEY;
    delete process.env.NVIDIA_BASE_URL;
    delete process.env.NVIDIA_MODEL_ID;
    delete process.env.DUFFEL_ACCESS_TOKEN;
    delete process.env.DUFFEL_BASE_URL;
    delete process.env.AVIATIONSTACK_API_KEY;
    delete process.env.AVIATIONSTACK_BASE_URL;
    delete process.env.OPEN_METEO_BASE_URL;
    delete process.env.NOMINATIM_USER_AGENT;
    delete process.env.OSRM_BASE_URL;
    delete process.env.VALHALLA_BASE_URL;
    delete process.env.PORT;
    delete process.env.NODE_ENV;
  });

  async function loadConfigModule() {
    const { loadConfig, getConfig, resetConfig } = await import("../src/config/index");
    return { loadConfig, getConfig, resetConfig };
  }

  it("should load valid configuration", async () => {
    process.env.NVIDIA_API_KEY = "test-key";
    process.env.NVIDIA_BASE_URL = "https://api.nvidia.com/v1";
    process.env.NVIDIA_MODEL_ID = "test-model";
    process.env.DUFFEL_ACCESS_TOKEN = "duffel-token";
    process.env.DUFFEL_BASE_URL = "https://api.duffel.com";
    process.env.AVIATIONSTACK_API_KEY = "aviation-key";
    process.env.AVIATIONSTACK_BASE_URL = "http://api.aviationstack.com/v1";
    process.env.OPEN_METEO_BASE_URL = "https://api.open-meteo.com/v1";
    process.env.NOMINATIM_USER_AGENT = "TestAgent/1.0";
    process.env.OSRM_BASE_URL = "https://router.project-osrm.org";
    process.env.VALHALLA_BASE_URL = "https://valhalla1.openstreetmap.de";
    process.env.PORT = "3000";
    process.env.NODE_ENV = "development";

    const { loadConfig } = await loadConfigModule();
    const config = loadConfig();

    expect(config.nvidia.apiKey).toBe("test-key");
    expect(config.nvidia.baseUrl).toBe("https://api.nvidia.com/v1");
    expect(config.nvidia.modelId).toBe("test-model");
    expect(config.duffel.accessToken).toBe("duffel-token");
    expect(config.duffel.baseUrl).toBe("https://api.duffel.com");
    expect(config.aviationStack.apiKey).toBe("aviation-key");
    expect(config.aviationStack.baseUrl).toBe("http://api.aviationstack.com/v1");
    expect(config.openMeteo.baseUrl).toBe("https://api.open-meteo.com/v1");
    expect(config.osm.nominatimUserAgent).toBe("TestAgent/1.0");
    expect(config.osm.osrmBaseUrl).toBe("https://router.project-osrm.org");
    expect(config.osm.valhallaBaseUrl).toBe("https://valhalla1.openstreetmap.de");
    expect(config.port).toBe(3000);
    expect(config.nodeEnv).toBe("development");
  });

  it("should use defaults for optional values", async () => {
    process.env.NVIDIA_API_KEY = "test-key";
    process.env.NVIDIA_BASE_URL = "https://api.nvidia.com/v1";
    process.env.NVIDIA_MODEL_ID = "test-model";
    process.env.DUFFEL_ACCESS_TOKEN = "duffel-token";
    process.env.DUFFEL_BASE_URL = "https://api.duffel.com";
    process.env.AVIATIONSTACK_API_KEY = "aviation-key";
    process.env.AVIATIONSTACK_BASE_URL = "http://api.aviationstack.com/v1";
    process.env.OPEN_METEO_BASE_URL = "https://api.open-meteo.com/v1";
    process.env.NOMINATIM_USER_AGENT = "TestAgent/1.0";

    const { loadConfig } = await loadConfigModule();
    const config = loadConfig();

    expect(config.osm.osrmBaseUrl).toBe("https://router.project-osrm.org");
    expect(config.osm.valhallaBaseUrl).toBe("https://valhalla1.openstreetmap.de");
    expect(config.port).toBe(3000);
    expect(config.nodeEnv).toBe("development");
  });

  it("should throw on missing required NVIDIA_API_KEY", async () => {
    process.env.NVIDIA_BASE_URL = "https://api.nvidia.com/v1";
    process.env.NVIDIA_MODEL_ID = "test-model";
    process.env.DUFFEL_ACCESS_TOKEN = "duffel-token";
    process.env.DUFFEL_BASE_URL = "https://api.duffel.com";
    process.env.AVIATIONSTACK_API_KEY = "aviation-key";
    process.env.AVIATIONSTACK_BASE_URL = "http://api.aviationstack.com/v1";
    process.env.OPEN_METEO_BASE_URL = "https://api.open-meteo.com/v1";
    process.env.NOMINATIM_USER_AGENT = "TestAgent/1.0";

    const { loadConfig } = await loadConfigModule();
    expect(() => loadConfig()).toThrow("Configuration validation failed");
    expect(() => loadConfig()).toThrow("NVIDIA_API_KEY: Required");
  });

  it("should throw on invalid URL for NVIDIA_BASE_URL", async () => {
    process.env.NVIDIA_API_KEY = "test-key";
    process.env.NVIDIA_BASE_URL = "not-a-url";
    process.env.NVIDIA_MODEL_ID = "test-model";
    process.env.DUFFEL_ACCESS_TOKEN = "duffel-token";
    process.env.DUFFEL_BASE_URL = "https://api.duffel.com";
    process.env.AVIATIONSTACK_API_KEY = "aviation-key";
    process.env.AVIATIONSTACK_BASE_URL = "http://api.aviationstack.com/v1";
    process.env.OPEN_METEO_BASE_URL = "https://api.open-meteo.com/v1";
    process.env.NOMINATIM_USER_AGENT = "TestAgent/1.0";

    const { loadConfig } = await loadConfigModule();
    expect(() => loadConfig()).toThrow("NVIDIA_BASE_URL: Invalid url");
  });

  it("should throw on invalid NODE_ENV", async () => {
    process.env.NVIDIA_API_KEY = "test-key";
    process.env.NVIDIA_BASE_URL = "https://api.nvidia.com/v1";
    process.env.NVIDIA_MODEL_ID = "test-model";
    process.env.DUFFEL_ACCESS_TOKEN = "duffel-token";
    process.env.DUFFEL_BASE_URL = "https://api.duffel.com";
    process.env.AVIATIONSTACK_API_KEY = "aviation-key";
    process.env.AVIATIONSTACK_BASE_URL = "http://api.aviationstack.com/v1";
    process.env.OPEN_METEO_BASE_URL = "https://api.open-meteo.com/v1";
    process.env.NOMINATIM_USER_AGENT = "TestAgent/1.0";
    process.env.NODE_ENV = "invalid";

    const { loadConfig } = await loadConfigModule();
    expect(() => loadConfig()).toThrow("NODE_ENV: Invalid enum value");
  });

  it("should return cached config on subsequent calls", async () => {
    process.env.NVIDIA_API_KEY = "test-key";
    process.env.NVIDIA_BASE_URL = "https://api.nvidia.com/v1";
    process.env.NVIDIA_MODEL_ID = "test-model";
    process.env.DUFFEL_ACCESS_TOKEN = "duffel-token";
    process.env.DUFFEL_BASE_URL = "https://api.duffel.com";
    process.env.AVIATIONSTACK_API_KEY = "aviation-key";
    process.env.AVIATIONSTACK_BASE_URL = "http://api.aviationstack.com/v1";
    process.env.OPEN_METEO_BASE_URL = "https://api.open-meteo.com/v1";
    process.env.NOMINATIM_USER_AGENT = "TestAgent/1.0";

    const { loadConfig, getConfig } = await loadConfigModule();
    const config1 = loadConfig();
    const config2 = getConfig();

    expect(config1).toBe(config2);
  });

  it("should throw getConfig before loadConfig", async () => {
    const { getConfig } = await loadConfigModule();
    expect(() => getConfig()).toThrow("Configuration not loaded");
  });
});
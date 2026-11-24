import { describe, it, expect, beforeEach, vi } from "vitest";

describe("Logging", () => {
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

    // Set required env vars
    process.env.NVIDIA_API_KEY = "test-key";
    process.env.NVIDIA_BASE_URL = "https://api.nvidia.com/v1";
    process.env.NVIDIA_MODEL_ID = "test-model";
    process.env.DUFFEL_ACCESS_TOKEN = "duffel-token";
    process.env.DUFFEL_BASE_URL = "https://api.duffel.com";
    process.env.AVIATIONSTACK_API_KEY = "aviation-key";
    process.env.AVIATIONSTACK_BASE_URL = "http://api.aviationstack.com/v1";
    process.env.OPEN_METEO_BASE_URL = "https://api.open-meteo.com/v1";
    process.env.NOMINATIM_USER_AGENT = "TestAgent/1.0";
  });

  async function loadModules() {
    const { loadConfig, getConfig, resetConfig } = await import("../src/config/index");
    const { createLogger, getLogger, initializeLogger, generateCorrelationId } = await import("../src/logging");
    loadConfig();
    return { getConfig, createLogger, getLogger, initializeLogger, generateCorrelationId };
  }

  describe("createLogger", () => {
    it("should create logger instance", async () => {
      const { getConfig, createLogger } = await loadModules();
      const config = getConfig();
      const logger = createLogger(config);

      expect(logger).toBeDefined();
      expect(typeof logger.info).toBe("function");
      expect(typeof logger.error).toBe("function");
      expect(typeof logger.warn).toBe("function");
      expect(typeof logger.debug).toBe("function");
    });

    it("should create logger with development config", async () => {
      const { getConfig, createLogger } = await loadModules();
      const config = { ...getConfig(), nodeEnv: "development" as const };
      const logger = createLogger(config);

      expect(logger).toBeDefined();
    });

    it("should create logger with production config", async () => {
      const { getConfig, createLogger } = await loadModules();
      const config = { ...getConfig(), nodeEnv: "production" as const };
      const logger = createLogger(config);

      expect(logger).toBeDefined();
    });
  });

  describe("initializeLogger / getLogger", () => {
    it("should throw if getLogger called before initializeLogger", async () => {
      const { getLogger } = await loadModules();
      expect(() => getLogger()).toThrow("Logger not initialized");
    });

    it("should return logger after initialization", async () => {
      const { getConfig, createLogger, getLogger, initializeLogger } = await loadModules();
      const config = getConfig();
      const logger = createLogger(config);
      initializeLogger(logger);

      const retrieved = getLogger();
      expect(retrieved).toBe(logger);
    });
  });

  describe("generateCorrelationId", () => {
    it("should generate unique correlation IDs", async () => {
      const { generateCorrelationId } = await loadModules();
      const id1 = generateCorrelationId();
      const id2 = generateCorrelationId();

      expect(id1).toMatch(/^req-\d+-[a-z0-9]+$/);
      expect(id2).toMatch(/^req-\d+-[a-z0-9]+$/);
      expect(id1).not.toBe(id2);
    });

    it("should include timestamp and random component", async () => {
      const { generateCorrelationId } = await loadModules();
      const id = generateCorrelationId();
      const parts = id.split("-");

      expect(parts[0]).toBe("req");
      expect(Number(parts[1])).toBeGreaterThan(0);
      expect(parts[2].length).toBeGreaterThan(0);
    });
  });
});
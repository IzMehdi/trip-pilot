import { describe, it, expect, beforeEach, vi } from "vitest";
import Fastify from "fastify";
import { loadConfig, resetConfig } from "../src/config/index";
import routes from "../src/routes/index";

describe("Health Routes", () => {
  let app: Awaited<ReturnType<typeof Fastify>>;

  beforeEach(async () => {
    resetConfig();
    vi.resetModules();

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

    loadConfig();

    app = Fastify({ logger: false });
    await app.register(routes);
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  describe("GET /api/v1/health", () => {
    it("should return 200 with correct shape", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/api/v1/health",
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);

      expect(body).toMatchObject({
        status: "ok",
        timestamp: expect.any(String),
        uptime: expect.any(Number),
      });
      expect(new Date(body.timestamp).toISOString()).toBe(body.timestamp);
      expect(body.uptime).toBeGreaterThanOrEqual(0);
    });

    it("should return valid JSON", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/api/v1/health",
      });

      expect(response.headers["content-type"]).toContain("application/json");
    });
  });

  describe("GET /api/v1/ready", () => {
    it("should return 200 with correct shape", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/api/v1/ready",
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);

      expect(body).toMatchObject({
        status: "ready",
        timestamp: expect.any(String),
        checks: {
          config: true,
        },
      });
      expect(new Date(body.timestamp).toISOString()).toBe(body.timestamp);
    });

    it("should return valid JSON", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/api/v1/ready",
      });

      expect(response.headers["content-type"]).toContain("application/json");
    });
  });
});
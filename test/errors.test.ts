import { describe, it, expect } from "vitest";
import {
  AppError,
  ConfigError,
  ValidationError,
  NotFoundError,
  InternalError,
  RateLimitedError,
  ProviderError,
  ErrorCodes,
  serializeError,
} from "../src/errors/index";

describe("Errors", () => {
  describe("Error Classes", () => {
    it("should create AppError with correct properties", () => {
      const error = new AppError(ErrorCodes.INTERNAL_ERROR, "Test error", 500, false);

      expect(error.code).toBe(ErrorCodes.INTERNAL_ERROR);
      expect(error.message).toBe("Test error");
      expect(error.statusCode).toBe(500);
      expect(error.isOperational).toBe(false);
      expect(error.name).toBe("AppError");
    });

    it("should create ConfigError", () => {
      const error = new ConfigError("Missing API key");

      expect(error.code).toBe(ErrorCodes.CONFIG_ERROR);
      expect(error.message).toBe("Missing API key");
      expect(error.statusCode).toBe(500);
      expect(error.isOperational).toBe(true);
    });

    it("should create ValidationError with details", () => {
      const details = { field: "email", issue: "invalid format" };
      const error = new ValidationError("Invalid email", details);

      expect(error.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(error.message).toBe("Invalid email");
      expect(error.statusCode).toBe(400);
      expect(error.details).toEqual(details);
    });

    it("should create NotFoundError with default resource", () => {
      const error = new NotFoundError();

      expect(error.code).toBe(ErrorCodes.NOT_FOUND);
      expect(error.message).toBe("Resource not found");
      expect(error.statusCode).toBe(404);
    });

    it("should create NotFoundError with custom resource", () => {
      const error = new NotFoundError("User");

      expect(error.message).toBe("User not found");
    });

    it("should create InternalError", () => {
      const error = new InternalError("Database connection failed");

      expect(error.code).toBe(ErrorCodes.INTERNAL_ERROR);
      expect(error.message).toBe("Database connection failed");
      expect(error.statusCode).toBe(500);
      expect(error.isOperational).toBe(false);
    });

    it("should create RateLimitedError with retryAfter", () => {
      const error = new RateLimitedError("Too many requests", 60);

      expect(error.code).toBe(ErrorCodes.RATE_LIMITED);
      expect(error.message).toBe("Too many requests");
      expect(error.statusCode).toBe(429);
      expect(error.retryAfter).toBe(60);
    });

    it("should create ProviderError with provider and original error", () => {
      const originalError = new Error("Timeout");
      const error = new ProviderError("NVIDIA", "Request timeout", originalError);

      expect(error.code).toBe(ErrorCodes.PROVIDER_ERROR);
      expect(error.message).toBe("NVIDIA: Request timeout");
      expect(error.statusCode).toBe(502);
      expect(error.provider).toBe("NVIDIA");
      expect(error.originalError).toBe(originalError);
    });
  });

  describe("serializeError", () => {
    it("should serialize AppError correctly", () => {
      const error = new ValidationError("Invalid input", { field: "name" });
      const result = serializeError(error, "req-123");

      expect(result).toEqual({
        error: {
          code: ErrorCodes.VALIDATION_ERROR,
          message: "Invalid input",
          requestId: "req-123",
          timestamp: expect.any(String),
        },
      });
      expect(new Date(result.error.timestamp).toISOString()).toBe(result.error.timestamp);
    });

    it("should serialize generic Error with generic message", () => {
      const error = new Error("Internal database error");
      const result = serializeError(error, "req-456");

      expect(result).toEqual({
        error: {
          code: ErrorCodes.INTERNAL_ERROR,
          message: "An unexpected error occurred",
          requestId: "req-456",
          timestamp: expect.any(String),
        },
      });
    });

    it("should serialize unknown error with generic message", () => {
      const result = serializeError("string error", "req-789");

      expect(result).toEqual({
        error: {
          code: ErrorCodes.INTERNAL_ERROR,
          message: "An unknown error occurred",
          requestId: "req-789",
          timestamp: expect.any(String),
        },
      });
    });

    it("should serialize null/undefined with generic message", () => {
      const result = serializeError(null, "req-000");

      expect(result.error.code).toBe(ErrorCodes.INTERNAL_ERROR);
      expect(result.error.message).toBe("An unknown error occurred");
    });
  });
});
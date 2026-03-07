import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  ValidationError,
  validateClassCode,
  validatePassword,
  validateProgress,
} from "@/lib/validators";
import { buildEnvVarConfig, validateEnv } from "@/lib/env";

function withEnv(overrides: Record<string, string | undefined>, fn: () => void) {
  const previous: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(overrides)) {
    previous[key] = process.env[key];
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }

  try {
    fn();
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  }
}

describe("validators and env boundary", () => {
  it("validateClassCode and validateProgress enforce boundaries", () => {
    expect(validateClassCode(" ab12c3 ")).toBe("AB12C3");
    expect(validateProgress(99.6)).toBe(100);

    expect(() => validateClassCode("abc!23")).toThrow(ValidationError);
    expect(() => validateProgress(120)).toThrow(ValidationError);
  });

  it("validatePassword enforces minimum and maximum lengths", () => {
    expect(() => validatePassword("short")).toThrow(ValidationError);

    const longPassword = "a".repeat(129);
    expect(() => validatePassword(longPassword)).toThrow(ValidationError);

    expect(validatePassword("validpass123").length).toBe(12);
  });

  it("buildEnvVarConfig marks production-only variables required in production", () => {
    const productionConfig = buildEnvVarConfig("production");
    const nextAuthUrl = productionConfig.find((v) => v.key === "NEXTAUTH_URL");
    const cronSecret = productionConfig.find((v) => v.key === "CRON_SECRET");
    expect(nextAuthUrl?.required).toBe(true);
    expect(cronSecret?.required).toBe(true);

    const developmentConfig = buildEnvVarConfig("development");
    const devNextAuthUrl = developmentConfig.find((v) => v.key === "NEXTAUTH_URL");
    expect(devNextAuthUrl?.required).toBe(false);
  });

  it("validateEnv enforces auth-secret fallback and production-only requirements", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    try {
      withEnv(
        {
          NODE_ENV: "production",
          POSTGRES_URL: "postgresql://localhost:5432/db",
          NEXTAUTH_SECRET: undefined,
          AUTH_SECRET: "a".repeat(32),
          NEXTAUTH_URL: undefined,
          CRON_SECRET: "b".repeat(32),
        },
        () => {
          expect(() => validateEnv()).toThrow(/Environment validation failed/);
        }
      );

      withEnv(
        {
          NODE_ENV: "production",
          POSTGRES_URL: "postgresql://localhost:5432/db",
          NEXTAUTH_SECRET: undefined,
          AUTH_SECRET: "a".repeat(32),
          NEXTAUTH_URL: "https://example.com",
          CRON_SECRET: "b".repeat(32),
        },
        () => {
          expect(() => validateEnv()).not.toThrow();
        }
      );
    } finally {
      warnSpy.mockRestore();
      errorSpy.mockRestore();
      logSpy.mockRestore();
    }
  });
});

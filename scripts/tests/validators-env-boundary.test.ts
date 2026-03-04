import test from "node:test";
import assert from "node:assert/strict";
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

test("validateClassCode and validateProgress enforce boundaries", () => {
  assert.equal(validateClassCode(" ab12c3 "), "AB12C3");
  assert.equal(validateProgress(99.6), 100);

  assert.throws(
    () => validateClassCode("abc!23"),
    (err: unknown) =>
      err instanceof ValidationError &&
      err.code === "INVALID_FORMAT" &&
      err.field === "code"
  );
  assert.throws(
    () => validateProgress(120),
    (err: unknown) =>
      err instanceof ValidationError &&
      err.code === "OUT_OF_RANGE" &&
      err.field === "progress"
  );
});

test("validatePassword enforces minimum and maximum lengths", () => {
  assert.throws(
    () => validatePassword("short"),
    (err: unknown) => err instanceof ValidationError && err.code === "TOO_SHORT"
  );

  const longPassword = "a".repeat(129);
  assert.throws(
    () => validatePassword(longPassword),
    (err: unknown) => err instanceof ValidationError && err.code === "TOO_LONG"
  );

  assert.equal(validatePassword("validpass123").length, 12);
});

test("buildEnvVarConfig marks production-only variables required in production", () => {
  const productionConfig = buildEnvVarConfig("production");
  const nextAuthUrl = productionConfig.find((v) => v.key === "NEXTAUTH_URL");
  const cronSecret = productionConfig.find((v) => v.key === "CRON_SECRET");
  assert.equal(nextAuthUrl?.required, true);
  assert.equal(cronSecret?.required, true);

  const developmentConfig = buildEnvVarConfig("development");
  const devNextAuthUrl = developmentConfig.find((v) => v.key === "NEXTAUTH_URL");
  assert.equal(devNextAuthUrl?.required, false);
});

test("validateEnv enforces auth-secret fallback and production-only requirements", () => {
  const originalWarn = console.warn;
  const originalError = console.error;
  const originalLog = console.log;
  console.warn = () => {};
  console.error = () => {};
  console.log = () => {};

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
        assert.throws(() => validateEnv(), /Environment validation failed/);
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
        assert.doesNotThrow(() => validateEnv());
      }
    );
  } finally {
    console.warn = originalWarn;
    console.error = originalError;
    console.log = originalLog;
  }
});


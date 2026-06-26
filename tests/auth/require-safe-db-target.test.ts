import assert from "node:assert/strict";
import test from "node:test";
import {
  isProductionLikeTarget,
  parseActiveDbTarget,
  requireSafeDbTarget,
} from "../../scripts/lib/require-safe-db-target";

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

test("parseActiveDbTarget reads DATABASE_URL before POSTGRES_URL", () => {
  withEnv(
    {
      DATABASE_URL: "postgresql://user:pass@prod.db.example.com:5432/app_prod",
      POSTGRES_URL: "postgresql://user:pass@localhost:5432/app_dev",
    },
    () => {
      const target = parseActiveDbTarget();
      assert.equal(target.hostname, "prod.db.example.com");
      assert.equal(target.database, "app_prod");
      assert.equal(target.port, "5432");
    }
  );
});

test("isProductionLikeTarget allows local development targets", () => {
  assert.equal(
    isProductionLikeTarget({
      hostname: "localhost",
      database: "esol_dev",
      port: "5432",
      rawUrl: "postgresql://localhost:5432/esol_dev",
    }),
    false
  );
});

test("requireSafeDbTarget blocks production-like targets without override", () => {
  withEnv(
    {
      DATABASE_URL: "postgresql://user:pass@db.prisma-prod.example.com:5432/class_companion",
      POSTGRES_URL: undefined,
      ALLOW_PROD_DB_MUTATION: undefined,
      CONFIRM_DB_HOST: undefined,
    },
    () => {
      assert.throws(
        () => requireSafeDbTarget("dangerous cleanup"),
        /ALLOW_PROD_DB_MUTATION=yes/
      );
    }
  );
});

test("requireSafeDbTarget blocks production-like targets with wrong host confirmation", () => {
  withEnv(
    {
      DATABASE_URL: "postgresql://user:pass@db.prisma-prod.example.com:5432/class_companion",
      ALLOW_PROD_DB_MUTATION: "yes",
      CONFIRM_DB_HOST: "wrong-host.example.com",
    },
    () => {
      assert.throws(
        () => requireSafeDbTarget("dangerous cleanup"),
        /CONFIRM_DB_HOST=db\.prisma-prod\.example\.com/
      );
    }
  );
});

test("requireSafeDbTarget allows production-like targets only with exact override", () => {
  withEnv(
    {
      DATABASE_URL: "postgresql://user:pass@db.prisma-prod.example.com:5432/class_companion",
      ALLOW_PROD_DB_MUTATION: "yes",
      CONFIRM_DB_HOST: "db.prisma-prod.example.com",
    },
    () => {
      const target = requireSafeDbTarget("dangerous cleanup");
      assert.equal(target.hostname, "db.prisma-prod.example.com");
      assert.equal(target.database, "class_companion");
    }
  );
});

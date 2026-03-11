"use strict";

const SAFE_HOST_MARKERS = [
  "localhost",
  ".local",
  ".internal",
  "staging",
  "preview",
  "sandbox",
  "dev",
  "test",
  "ci",
];

const SAFE_DB_NAME_MARKERS = ["dev", "test", "local", "staging", "preview", "sandbox", "ci"];

function isPrivateIpv4(hostname) {
  if (/^10\./.test(hostname)) return true;
  if (/^192\.168\./.test(hostname)) return true;

  const match = hostname.match(/^172\.(\d{1,3})\./);
  if (!match) return false;

  const secondOctet = Number(match[1]);
  return secondOctet >= 16 && secondOctet <= 31;
}

function parseActiveDbTarget(env = process.env) {
  const rawUrl = env.DATABASE_URL || env.POSTGRES_URL;

  if (!rawUrl) {
    throw new Error(
      "[db-guard] Missing DATABASE_URL and POSTGRES_URL. Refusing to run a mutating script without a parsed database target."
    );
  }

  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error("[db-guard] Could not parse active database URL. Refusing to run.");
  }

  if (parsed.protocol !== "postgres:" && parsed.protocol !== "postgresql:") {
    throw new Error(
      `[db-guard] Unsupported database protocol "${parsed.protocol}". Refusing to run without a direct PostgreSQL target.`
    );
  }

  const hostname = parsed.hostname.trim().toLowerCase();
  const database = parsed.pathname.replace(/^\/+/, "").trim();

  if (!hostname || !database) {
    throw new Error("[db-guard] Could not determine database host/name from the active URL. Refusing to run.");
  }

  return {
    rawUrl,
    hostname,
    database,
    port: parsed.port || null,
  };
}

function isProductionLikeTarget(target) {
  const hostname = target.hostname.toLowerCase();
  const database = target.database.toLowerCase();

  const hostLooksSafe =
    hostname === "::1" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0" ||
    isPrivateIpv4(hostname) ||
    SAFE_HOST_MARKERS.some((marker) => hostname.includes(marker));

  if (hostLooksSafe) {
    return false;
  }

  if (SAFE_DB_NAME_MARKERS.some((marker) => database.includes(marker))) {
    return false;
  }

  return true;
}

function requireSafeDbTarget(operationName, env = process.env) {
  const target = parseActiveDbTarget(env);

  console.log(
    `[db-guard] ${operationName} -> host=${target.hostname} db=${target.database}${target.port ? ` port=${target.port}` : ""}`
  );

  if (!isProductionLikeTarget(target)) {
    console.log("[db-guard] Target looks non-production. Continuing without override.");
    return target;
  }

  const allowProdMutation = env.ALLOW_PROD_DB_MUTATION;
  const confirmDbHost = env.CONFIRM_DB_HOST;

  if (allowProdMutation !== "yes" || confirmDbHost !== target.hostname) {
    throw new Error(
      [
        `[db-guard] Refusing to run "${operationName}" against a production-like database target.`,
        `[db-guard] Set ALLOW_PROD_DB_MUTATION=yes and CONFIRM_DB_HOST=${target.hostname} to proceed intentionally.`,
      ].join("\n")
    );
  }

  console.log("[db-guard] Production override accepted. Continuing.");
  return target;
}

module.exports = {
  isProductionLikeTarget,
  parseActiveDbTarget,
  requireSafeDbTarget,
};

const DEV_SEED_ACCOUNT_PASSWORD_ENV = "DEV_SEED_ACCOUNT_PASSWORD";
const SYSTEM_TEST_STUDENT_PASSWORD_ENV = "TEST_STUDENT_DEFAULT_PASSWORD";
const MIN_MANAGED_PASSWORD_LENGTH = 12;

function isProductionEnvironment(nodeEnv = process.env.NODE_ENV) {
  return nodeEnv === "production";
}

function normalizeManagedPassword(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length < MIN_MANAGED_PASSWORD_LENGTH) return null;
  return trimmed;
}

function resolveManagedPassword(envKey, purpose, nodeEnv = process.env.NODE_ENV) {
  const resolved = normalizeManagedPassword(process.env[envKey]);
  if (resolved) {
    return resolved;
  }

  const environmentLabel = isProductionEnvironment(nodeEnv) ? "production" : "local/development";
  throw new Error(
    `${envKey} must be set to a unique password with at least ${MIN_MANAGED_PASSWORD_LENGTH} characters for ${purpose} in ${environmentLabel}.`
  );
}

function resolveSeedAccountPassword(nodeEnv = process.env.NODE_ENV) {
  return resolveManagedPassword(
    DEV_SEED_ACCOUNT_PASSWORD_ENV,
    "seeded teacher and student accounts",
    nodeEnv
  );
}

function resolveSystemTestStudentPassword(nodeEnv = process.env.NODE_ENV) {
  return resolveManagedPassword(
    SYSTEM_TEST_STUDENT_PASSWORD_ENV,
    "auto-created system test student accounts",
    nodeEnv
  );
}

module.exports = {
  DEV_SEED_ACCOUNT_PASSWORD_ENV,
  SYSTEM_TEST_STUDENT_PASSWORD_ENV,
  MIN_MANAGED_PASSWORD_LENGTH,
  isProductionEnvironment,
  normalizeManagedPassword,
  resolveManagedPassword,
  resolveSeedAccountPassword,
  resolveSystemTestStudentPassword,
};

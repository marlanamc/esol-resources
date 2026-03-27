// Shared utilities barrel exports

// Structured logger
export {
  logger,
  Logger,
  createRequestLogger,
  createUserLogger,
  type LogLevel,
  type LogContext,
} from "./logger";

// Environment configuration
export {
  buildEnvVarConfig,
  validateEnv,
  getRequiredEnv,
  getOptionalEnv,
  getAppBaseUrl,
  isProduction,
  isDevelopment,
} from "./env";

// Validators
export {
  ValidationError,
  validateUserId,
  validateClassCode,
  validateProgress,
  validateOptionalProgress,
  validatePassword,
  validateString,
  validateInteger,
  validateEmail,
  validateEnum,
  validateArray,
  validateBoolean,
  validateActivityType,
  validateUserRole,
  parseRequestBody,
  ACTIVITY_TYPES,
  USER_ROLES,
  type ActivityType,
  type UserRole,
} from "./validators";

// Performance logging
export { timedQuery } from "./perf-log";

// Audit logging
export {
  auditLog,
  getRequestMetadata,
  createAuditLogger,
  type AuditAction,
  type AuditLogEntry,
} from "./audit-log";

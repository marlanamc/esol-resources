// Auth domain barrel exports
export { authOptions } from "./auth";
export {
  BCRYPT_ROUNDS,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
  DEFAULT_PASSWORD_BLOCKED_MESSAGE,
  isDisallowedPassword,
} from "./config";
export {
  requireAuth,
  requireTeacher,
  requireStudent,
  type SessionUser,
} from "./api-auth";
export {
  canUseTeacherTools,
  isAdmin,
  isTeacher,
  ensureTeacher,
  canManageClass,
  canManageActivity,
  classOwnershipWhere,
} from "./policies";
export {
  isStudent,
  isTeacherAdmin,
  normalizeUserRole,
  type UserRole,
} from "./roles";

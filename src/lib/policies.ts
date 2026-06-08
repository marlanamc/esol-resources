// Re-export from new location for backward compatibility
export {
  canUseTeacherTools,
  isAdmin,
  isTeacher,
  ensureTeacher,
  canManageClass,
  canManageActivity,
  canAssignActivity,
  classOwnershipWhere,
} from "./auth/policies";

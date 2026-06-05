export const USER_ROLE_VALUES = ["student", "teacher", "admin"] as const;

export type UserRole = (typeof USER_ROLE_VALUES)[number];

export function normalizeUserRole(value: string | null | undefined): UserRole {
    if (value === "teacher_admin" || value === "admin") return "admin";
    if (value === "teacher") return "teacher";
    return "student";
}

export function isStudent(user: { role?: string | null } | null | undefined): boolean {
    return normalizeUserRole(user?.role) === "student";
}

export function isTeacher(user: { role?: string | null } | null | undefined): boolean {
    return normalizeUserRole(user?.role) === "teacher";
}

export function isAdmin(user: { role?: string | null } | null | undefined): boolean {
    return normalizeUserRole(user?.role) === "admin";
}

export function canUseTeacherTools(user: { role?: string | null } | null | undefined): boolean {
    const role = normalizeUserRole(user?.role);
    return role === "teacher" || role === "admin";
}

export function isTeacherAdmin(user: { role?: string | null; isTeacherAdmin?: boolean | null } | null | undefined): boolean {
    return isAdmin(user) || user?.isTeacherAdmin === true;
}

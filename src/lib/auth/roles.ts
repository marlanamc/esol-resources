export function isTeacherAdmin(user: { isTeacherAdmin?: boolean | null } | null | undefined): boolean {
    return user?.isTeacherAdmin === true;
}


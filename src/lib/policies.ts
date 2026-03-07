import type { Session } from "next-auth";
import { isTeacherAdmin } from "@/lib/roles";

type SessionUser = Session["user"];

export function isTeacher(user: SessionUser | null | undefined): boolean {
    return user?.role === "teacher";
}

export function ensureTeacher(user: SessionUser | null | undefined): {
    ok: true;
    admin: boolean;
} | {
    ok: false;
    status: number;
    error: string;
} {
    if (!user) {
        return { ok: false, status: 401, error: "Unauthorized" };
    }

    if (!isTeacher(user)) {
        return { ok: false, status: 403, error: "Forbidden" };
    }

    return { ok: true, admin: isTeacherAdmin(user) };
}

export function classOwnershipWhere(user: SessionUser, admin: boolean): Record<string, never> | { teacherId: string } {
    return admin ? ({} as Record<string, never>) : { teacherId: user.id };
}

export function canManageClass(user: SessionUser, admin: boolean, teacherId: string | null | undefined): boolean {
    return admin || teacherId === user.id;
}

export function canManageActivity(
    user: SessionUser,
    admin: boolean,
    createdBy: string | null | undefined
): boolean {
    return admin || createdBy === user.id;
}


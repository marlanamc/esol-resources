/**
 * Shared API auth helpers to reduce boilerplate across route handlers.
 * Use with getServerSession(authOptions) - callers must pass the session.
 */

import { NextResponse } from "next/server";
import type { Session } from "next-auth";
import { isTeacherAdmin } from "@/lib/roles";

export type SessionUser = Session["user"] & { id: string; role?: string; isTeacherAdmin?: boolean };

/**
 * Returns 401 JSON response if no session. Otherwise returns null (caller proceeds).
 */
export function requireAuth(session: Session | null): NextResponse | null {
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

/**
 * Returns 401 if no session, 403 if not a teacher. Otherwise returns { session, admin }.
 */
export function requireTeacher(session: Session | null):
  | { ok: true; session: Session; user: SessionUser; admin: boolean }
  | { ok: false; response: NextResponse } {
  const authErr = requireAuth(session);
  if (authErr) return { ok: false, response: authErr };

  const user = session!.user as SessionUser;
  if (user.role !== "teacher") {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return {
    ok: true,
    session: session!,
    user,
    admin: isTeacherAdmin(user),
  };
}

/**
 * Returns 401 if no session, 403 if not a student. Otherwise returns { session, user }.
 */
export function requireStudent(session: Session | null):
  | { ok: true; session: Session; user: SessionUser }
  | { ok: false; response: NextResponse } {
  const authErr = requireAuth(session);
  if (authErr) return { ok: false, response: authErr };

  const user = session!.user as SessionUser;
  if (user.role !== "student") {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { ok: true, session: session!, user };
}

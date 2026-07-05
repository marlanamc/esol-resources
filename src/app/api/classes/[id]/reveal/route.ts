import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { withPrismaReadRetry } from "@/lib/database/retry";
import { canManageClass } from "@/lib/auth/policies";
import { requireTeacher, type SessionUser } from "@/lib/auth/api-auth";
import { ApiErrors, apiError, handleApiError } from "@/lib/api/response";

interface RouteParams {
    params: Promise<{ id: string }>;
}

async function loadRevealData(classId: string) {
    const [reveals, allWeeks] = await Promise.all([
        withPrismaReadRetry(() =>
            prisma.classReveal.findMany({
                where: { classId },
                select: {
                    weekId: true,
                    revealedAt: true,
                    week: { select: { id: true, number: true, title: true } },
                },
                orderBy: { week: { number: "asc" } },
            })
        ),
        withPrismaReadRetry(() =>
            prisma.courseWeek.findMany({
                orderBy: { number: "asc" },
                select: { id: true, number: true, title: true },
            })
        ),
    ]);

    const revealedIds = new Set(reveals.map((r) => r.weekId));
    const nextWeek = allWeeks.find((w) => !revealedIds.has(w.id)) ?? null;
    const current = reveals[reveals.length - 1] ?? null;

    return { reveals, current, nextWeek };
}

async function resolveClass(classId: string, user: SessionUser, admin: boolean) {
    const cls = await withPrismaReadRetry(() =>
        prisma.class.findUnique({
            where: { id: classId },
            select: { id: true, teacherId: true },
        })
    );
    if (!cls) return { cls: null, error: ApiErrors.notFound("Class", classId) };
    if (!canManageClass(user, admin, cls.teacherId)) return { cls: null, error: ApiErrors.forbidden() };
    return { cls, error: null };
}

// GET — current reveal state for this class
export async function GET(_req: Request, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        const teacherCheck = requireTeacher(session);
        if (!teacherCheck.ok) return teacherCheck.response;
        const { admin, user } = teacherCheck;

        const { id: classId } = await params;
        const { cls, error } = await resolveClass(classId, user, admin);
        if (!cls) return error!;

        const { reveals, current, nextWeek } = await loadRevealData(classId);

        return NextResponse.json({
            revealed: reveals.map((r) => ({
                weekId: r.week.id,
                weekNumber: r.week.number,
                weekTitle: r.week.title,
                revealedAt: r.revealedAt.toISOString(),
            })),
            current: current
                ? {
                      weekId: current.week.id,
                      weekNumber: current.week.number,
                      weekTitle: current.week.title,
                      revealedAt: current.revealedAt.toISOString(),
                  }
                : null,
            next: nextWeek
                ? { weekId: nextWeek.id, weekNumber: nextWeek.number, weekTitle: nextWeek.title }
                : null,
        });
    } catch (error) {
        return handleApiError(error, { defaultMessage: "Failed to load reveal state" });
    }
}

// POST — reveal a week. Body: { weekId?: string }
// If weekId is provided, reveal that specific week; otherwise reveal next sequential.
export async function POST(req: Request, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        const teacherCheck = requireTeacher(session);
        if (!teacherCheck.ok) return teacherCheck.response;
        const { admin, user } = teacherCheck;

        const { id: classId } = await params;
        const { cls, error } = await resolveClass(classId, user, admin);
        if (!cls) return error!;

        let weekId: string | undefined;
        try {
            const body = await req.json();
            weekId = body?.weekId;
        } catch {
            // no body — use sequential
        }

        if (weekId) {
            const week = await withPrismaReadRetry(() =>
                prisma.courseWeek.findUnique({ where: { id: weekId }, select: { id: true, number: true, title: true } })
            );
            if (!week) return apiError("Week not found", 404);

            const reveal = await prisma.classReveal.upsert({
                where: { classId_weekId: { classId, weekId } },
                create: { classId, weekId },
                update: {},
                select: {
                    weekId: true,
                    revealedAt: true,
                    week: { select: { id: true, number: true, title: true } },
                },
            });

            return NextResponse.json({
                revealed: {
                    weekId: reveal.week.id,
                    weekNumber: reveal.week.number,
                    weekTitle: reveal.week.title,
                    revealedAt: reveal.revealedAt.toISOString(),
                },
            });
        }

        // Sequential fallback
        const { nextWeek } = await loadRevealData(classId);
        if (!nextWeek) {
            return apiError("All course weeks are already revealed for this class", 409);
        }

        const reveal = await prisma.classReveal.create({
            data: { classId, weekId: nextWeek.id },
            select: {
                weekId: true,
                revealedAt: true,
                week: { select: { id: true, number: true, title: true } },
            },
        });

        return NextResponse.json({
            revealed: {
                weekId: reveal.week.id,
                weekNumber: reveal.week.number,
                weekTitle: reveal.week.title,
                revealedAt: reveal.revealedAt.toISOString(),
            },
        });
    } catch (error) {
        return handleApiError(error, { defaultMessage: "Failed to reveal week" });
    }
}

// DELETE — un-reveal a specific week. Body: { weekId: string }
export async function DELETE(req: Request, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        const teacherCheck = requireTeacher(session);
        if (!teacherCheck.ok) return teacherCheck.response;
        const { admin, user } = teacherCheck;

        const { id: classId } = await params;
        const { cls, error } = await resolveClass(classId, user, admin);
        if (!cls) return error!;

        const body = await req.json().catch(() => ({}));
        const weekId: string | undefined = body?.weekId;
        if (!weekId) return apiError("weekId is required", 400);

        await prisma.classReveal.deleteMany({ where: { classId, weekId } });

        return NextResponse.json({ ok: true });
    } catch (error) {
        return handleApiError(error, { defaultMessage: "Failed to un-reveal week" });
    }
}

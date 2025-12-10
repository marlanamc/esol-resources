import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teacherId = (session.user as any).id;
    const userRole = (session.user as any).role;
    const { id: studentId } = await params;

    // Verify teacher has access to this student (student is in one of their classes)
    if (userRole === "teacher") {
        const enrollment = await prisma.classEnrollment.findFirst({
            where: {
                studentId,
                class: {
                    teacherId
                }
            }
        });

        if (!enrollment) {
            return NextResponse.json({ error: "Student not found in your classes" }, { status: 403 });
        }
    }

    // Fetch comprehensive student data
    const student = await prisma.user.findUnique({
        where: { id: studentId },
        select: {
            id: true,
            name: true,
            username: true,
            points: true,
            weeklyPoints: true,
            currentStreak: true,
            longestStreak: true,
            createdAt: true
        }
    });

    if (!student) {
        return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Get activity progress
    const activityProgress = await prisma.activityProgress.findMany({
        where: { userId: studentId },
        include: {
            activity: {
                select: {
                    id: true,
                    title: true,
                    type: true,
                    category: true,
                    level: true
                }
            }
        },
        orderBy: { updatedAt: 'desc' }
    });

    // Get points history (recent activity timeline)
    const pointsHistory = await prisma.pointsLedger.findMany({
        where: { userId: studentId },
        orderBy: { createdAt: 'desc' },
        take: 50,
        select: {
            id: true,
            points: true,
            reason: true,
            createdAt: true
        }
    });

    // Calculate engagement metrics
    const completedActivities = activityProgress.filter(p => p.status === 'completed');
    const inProgressActivities = activityProgress.filter(p => p.status === 'in_progress' && p.progress < 100);

    // Calculate favorite activities (by counting how many times they earned points for each)
    const activityPlayCounts = new Map<string, { count: number; title: string; category: string }>();

    pointsHistory.forEach(entry => {
        // Parse activity from reason (e.g., "grammar:present-simple", "flashcards:september")
        const activityKey = entry.reason;
        if (activityKey) {
            const existing = activityPlayCounts.get(activityKey);
            if (existing) {
                existing.count++;
            } else {
                // Try to extract a readable name from the reason
                const parts = activityKey.split(':');
                const category = parts[0];
                const name = parts[1] ? parts[1].replace(/-/g, ' ') : category;
                activityPlayCounts.set(activityKey, {
                    count: 1,
                    title: name.charAt(0).toUpperCase() + name.slice(1),
                    category
                });
            }
        }
    });

    // Sort by play count to find favorites
    const favoriteActivities = Array.from(activityPlayCounts.entries())
        .map(([key, data]) => ({ key, ...data }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    // Calculate days active this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const pointsThisMonth = await prisma.pointsLedger.findMany({
        where: {
            userId: studentId,
            createdAt: { gte: startOfMonth }
        },
        select: {
            createdAt: true
        }
    });

    // Count unique days with activity
    const uniqueDays = new Set(
        pointsThisMonth.map(p => p.createdAt.toISOString().split('T')[0])
    );
    const daysActiveThisMonth = uniqueDays.size;

    // Get last active timestamp
    const lastActive = pointsHistory.length > 0 ? pointsHistory[0].createdAt : null;

    // Group activities by category for progress overview
    const progressByCategory = {
        vocab: activityProgress.filter(p => p.activity.category === 'vocab'),
        grammar: activityProgress.filter(p => p.activity.category === 'grammar'),
        other: activityProgress.filter(p => p.activity.category !== 'vocab' && p.activity.category !== 'grammar')
    };

    // Calculate average progress per category
    const calculateAvg = (items: typeof activityProgress) => {
        if (items.length === 0) return 0;
        const sum = items.reduce((acc, item) => acc + item.progress, 0);
        return Math.round(sum / items.length);
    };

    return NextResponse.json({
        student: {
            ...student,
            lastActive,
            daysActiveThisMonth
        },
        engagement: {
            totalActivitiesCompleted: completedActivities.length,
            activitiesInProgress: inProgressActivities.length,
            totalActivitiesStarted: activityProgress.length,
            favoriteActivities,
            currentStreak: student.currentStreak || 0,
            longestStreak: student.longestStreak || 0
        },
        progress: {
            byCategory: {
                vocab: {
                    activities: progressByCategory.vocab,
                    avgProgress: calculateAvg(progressByCategory.vocab),
                    completed: progressByCategory.vocab.filter(p => p.status === 'completed').length
                },
                grammar: {
                    activities: progressByCategory.grammar,
                    avgProgress: calculateAvg(progressByCategory.grammar),
                    completed: progressByCategory.grammar.filter(p => p.status === 'completed').length
                },
                other: {
                    activities: progressByCategory.other,
                    avgProgress: calculateAvg(progressByCategory.other),
                    completed: progressByCategory.other.filter(p => p.status === 'completed').length
                }
            },
            all: activityProgress
        },
        timeline: pointsHistory.map(entry => ({
            id: entry.id,
            points: entry.points,
            activity: entry.reason,
            timestamp: entry.createdAt
        }))
    });
}

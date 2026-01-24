import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GrammarGradebook } from "@/components/dashboard";

export default async function GradebookPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const userRole = session.user?.role || "student";
    const userId = session.user?.id;

    if (userRole !== "teacher") {
        redirect("/dashboard");
    }

    // Get teacher's classes and students
    const classes = await prisma.class.findMany({
        where: { teacherId: userId },
        include: {
            enrollments: {
                include: {
                    student: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                        }
                    }
                }
            }
        }
    });

    // Get all grammar guide activities
    const activities = await prisma.activity.findMany({
        where: {
            category: "grammar",
            type: "guide",
            isReleased: true
        },
        select: {
            id: true,
            title: true,
            content: true
        },
        orderBy: {
            title: "asc"
        }
    });

    // Filter activities that actually have a mini-quiz
    const activitiesWithQuizzes = activities.filter(activity => {
        try {
            const content = JSON.parse(activity.content);
            return !!content.miniQuiz;
        } catch {
            return false;
        }
    }).map(a => ({
        id: a.id,
        title: a.title.replace(" Guide", "").replace(" Guide", "") // Clean up titles
    }));

    const studentIds = Array.from(
        new Set(classes.flatMap(c => c.enrollments.map(e => e.student.id)))
    );

    const students = await prisma.user.findMany({
        where: {
            id: { in: studentIds }
        },
        select: {
            id: true,
            name: true,
            username: true,
        },
        orderBy: {
            name: "asc"
        }
    });

    // Get all submissions for these activities and students
    const submissions = await prisma.submission.findMany({
        where: {
            userId: { in: studentIds },
            activityId: { in: activitiesWithQuizzes.map(a => a.id) },
            score: { not: null }
        },
        select: {
            userId: true,
            activityId: true,
            score: true,
            updatedAt: true
        }
    });

    return (
        <div className="min-h-screen bg-bg">
            <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-border/40 shadow-sm z-50">
                <div className="container mx-auto max-w-[1400px] py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div>
                        <Link
                            href="/dashboard/stats"
                            className="text-xs font-semibold text-primary underline decoration-primary/40 underline-offset-4"
                        >
                            ← Back to Stats
                        </Link>
                        <h1 className="text-2xl md:text-3xl font-display font-bold text-text mt-1">
                            Grammar Gradebook
                        </h1>
                        <p className="text-sm text-text-muted">
                            A complete overview of mini-quiz scores across all grammar guides.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <LogoutButton />
                    </div>
                </div>
            </header>

            <main className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
                <GrammarGradebook 
                    students={students} 
                    activities={activitiesWithQuizzes} 
                    submissions={submissions} 
                />
            </main>
        </div>
    );
}

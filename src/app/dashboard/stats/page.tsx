import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatCard, BottomNav } from "@/components/ui";
import { UsersIcon, UserIcon, ClipboardIcon, BookOpenIcon, HomeIcon } from "@/components/icons/Icons";

export default async function StatsPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const userRole = (session.user as any)?.role || "student";
    const userId = (session.user as any)?.id;

    if (userRole !== "teacher") {
        redirect("/dashboard");
    }

    const classes = await prisma.class.findMany({
        where: { teacherId: userId },
        include: {
            enrollments: true,
            assignments: true,
        },
        orderBy: { createdAt: "desc" },
    });

    const allAssignments = classes.flatMap((c) => c.assignments);
    const allActivities = await prisma.activity.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="min-h-screen bg-bg">
            <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-border/40 shadow-sm z-50">
                <div className="container mx-auto max-w-[1200px] py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div>
                        <Link
                            href="/dashboard"
                            className="text-xs font-semibold text-primary underline decoration-primary/40 underline-offset-4"
                        >
                            ← Back to Dashboard
                        </Link>
                        <h1 className="text-2xl md:text-3xl font-display font-bold text-text mt-1">
                            Student Stats
                        </h1>
                        <p className="text-sm text-text-muted">
                            Quick snapshot of your classes, students, assignments, and activities.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="hidden sm:inline text-sm text-text-muted">
                            {session.user?.name}
                        </span>
                        <LogoutButton />
                    </div>
                </div>
            </header>

            <main className="container mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
                <section className="animate-fade-in-up delay-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            label="Total Classes"
                            value={classes.length}
                            icon={<UsersIcon className="w-full h-full" />}
                            color="primary"
                            className="delay-100"
                        />
                        <StatCard
                            label="Total Students"
                            value={classes.reduce((sum, c) => sum + c.enrollments.length, 0)}
                            icon={<UserIcon className="w-full h-full" />}
                            color="secondary"
                            className="delay-200"
                        />
                        <StatCard
                            label="Assignments"
                            value={allAssignments.length}
                            icon={<ClipboardIcon className="w-full h-full" />}
                            color="warning"
                            className="delay-300"
                        />
                        <StatCard
                            label="Activities"
                            value={allActivities.length}
                            icon={<BookOpenIcon className="w-full h-full" />}
                            color="accent"
                            className="delay-400"
                        />
                    </div>
                </section>
            </main>

            <BottomNav
                items={[
                    { href: "/dashboard", label: "Home", icon: <HomeIcon /> },
                    { href: "/dashboard/activities", label: "Activities", icon: <BookOpenIcon /> },
                    { href: "/dashboard/classes", label: "Classes", icon: <UsersIcon /> },
                    { href: "/dashboard/profile", label: "Profile", icon: <UserIcon /> },
                ]}
            />
        </div>
    );
}


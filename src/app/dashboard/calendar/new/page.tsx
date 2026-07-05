import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/layout/LogoutButton";
import { BackButton } from "@/components/ui/BackButton";
import { CreateCalendarEventForm } from "@/components/dashboard/CreateCalendarEventForm";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { canUseTeacherTools, isAdmin } from "@/lib/auth/roles";

export default async function CalendarAddPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const userId = session.user?.id;
    const admin = isAdmin(session.user);

    if (!canUseTeacherTools(session.user)) {
        redirect("/dashboard");
    }

    const classes = await prisma.class.findMany({
        where: admin ? {} : { teacherId: userId },
        select: {
            id: true,
            name: true,
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="min-h-screen bg-bg">
            <header className="sticky top-0 bg-white/80 dark:bg-[var(--surface-elevated)]/95 backdrop-blur-md border-b border-border/40 dark:border-white/10 shadow-sm z-50">
                <div className="container mx-auto max-w-[1200px] py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div>
                        <BackButton href="/dashboard" className="mb-1">Back to Dashboard</BackButton>
                        <h1 className="text-2xl md:text-3xl font-display font-bold text-text mt-1">
                            Add to Calendar
                        </h1>
                        <p className="text-sm text-text-muted">
                            Share important dates with your classes.
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

            <main className="container mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-6">
                <div className="bg-white dark:bg-[var(--surface-elevated)] border border-border/40 dark:border-white/10 rounded-2xl shadow-sm p-6">
                    <CreateCalendarEventForm
                        classes={classes.map((c) => ({
                            id: c.id,
                            name: c.name,
                        }))}
                    />
                </div>
            </main>
        </div>
    );
}

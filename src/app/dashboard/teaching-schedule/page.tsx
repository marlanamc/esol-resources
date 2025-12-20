import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { TeacherCalendar } from "@/components/dashboard/TeacherCalendar";
import { loadEsol3TeachingScheduleData } from "@/lib/teachingSchedule";

export default async function TeachingSchedulePage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const user = session.user as unknown as { role?: string };
    const userRole = user?.role || "student";

    if (userRole !== "teacher") {
        redirect("/dashboard");
    }

    const schedule = await loadEsol3TeachingScheduleData();

    return (
        <div className="min-h-screen bg-bg">
            <header className="sticky top-0 backdrop-blur-md border-b z-50 bg-white/90 border-white/60 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold text-primary tracking-widest uppercase">Teacher</p>
                        <h1 className="text-2xl font-display font-bold text-text">Teaching Schedule</h1>
                    </div>
                    <Link
                        href="/dashboard"
                        className="shrink-0 px-3 py-2 text-sm font-semibold text-text border border-border/50 rounded-lg hover:bg-bg-light transition"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
                <TeacherCalendar
                    teachingSchedule={schedule.teachingSchedule}
                    weeklySchedule={schedule.weeklySchedule}
                />
            </main>
        </div>
    );
}

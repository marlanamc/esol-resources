import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { authOptions } from "@/lib/auth/auth";
import { buildStudyWeek, DEFAULT_PRACTICE_GOAL_DAYS } from "@/lib/learner/study-log";
import { loadStudentStudyWeek } from "@/lib/learner/study-log-data";
import { StudyLogForm } from "@/components/study-log/StudyLogForm";

export const metadata = { title: "Log my practice" };

export default async function StudyLogPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/login");
    if (session.user.role !== "student") redirect("/dashboard");

    // Falls back to an empty week so the page still opens if the logs can't load.
    const initial = await loadStudentStudyWeek(session.user.id).catch((error) => {
        console.error("[Practice log] Could not load this week", error);
        return { week: buildStudyWeek([]), entries: [], goalDays: DEFAULT_PRACTICE_GOAL_DAYS, earlierReplies: [] };
    });
    return (
        <div className="min-h-dvh bg-bg">
            <main id="main-content" className="mx-auto max-w-md px-4 pb-24 pt-3 md:pt-8">
                <Link href="/dashboard" className="mb-2 inline-flex min-h-11 items-center gap-1 text-[0.9375rem] font-bold text-primary-dark dark:text-primary-light">
                    <ChevronLeft size={18} aria-hidden />
                    Back
                </Link>
                <StudyLogForm initial={initial} />
            </main>
        </div>
    );
}

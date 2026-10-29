import { cache } from "react";
import { WordRescuePracticeLater } from "./WordRescuePracticeLater";
import { MomentumCard } from "./MomentumCard";
import { SectionUnavailable } from "./SectionUnavailable";
import { getStudentMomentumSnapshot } from "@/lib/dashboard/student-momentum";
import { WeeklyQuizBar } from "./WeeklyQuizBar";
import { getStudentWeeklyQuizStatus } from "@/lib/learner/weekly-quiz-status";
import { loadStudentPracticeDays, loadStudentStudyWeek } from "@/lib/learner/study-log-data";
import { DashboardCalendarCard } from "./CalendarMonthPanel";
import type { CalendarEvent } from "./MiniCalendar";
import { StudyWeekCard } from "@/components/study-log/StudyWeekCard";

const weeklyQuizStatus = cache((userId: string) => getStudentWeeklyQuizStatus(userId));
const studentStudyWeek = cache((userId: string) => loadStudentStudyWeek(userId));
const practiceLater = cache((id: string, role?: string | null) => WordRescuePracticeLater({ user: { id, role } }));
export async function PracticeLaterSection({ user }: { user: { id: string; role?: string | null } }) {
    try { return await practiceLater(user.id, user.role); }
    catch (error) {
        console.error("[Dashboard] Saved words unavailable", error);
        return <SectionUnavailable title="Words to practice later" />;
    }
}
export async function MomentumSection({ userId }: { userId: string }) {
    const snapshot = await getStudentMomentumSnapshot(userId).catch(error => {
        console.error("[Dashboard] Points unavailable", error);
        return undefined;
    });
    return <MomentumCard variant="sidebar" {...snapshot} />;
}

// Rendered in both the phone and desktop layouts; cache() keeps it to one load.
export async function WeeklyQuizSection({ userId }: { userId: string }) {
    const status = await weeklyQuizStatus(userId).catch(error => {
        console.error("[Dashboard] Weekly quiz status unavailable", error);
        return null;
    });
    return status ? <WeeklyQuizBar status={status} /> : null;
}

// Rendered in both the phone and desktop layouts; cache() keeps it to one load.
export async function StudyWeekSection({ userId }: { userId: string }) {
    const studyWeek = await studentStudyWeek(userId).catch(error => {
        console.error("[Dashboard] Practice log unavailable", error);
        return null;
    });
    return studyWeek ? <StudyWeekCard {...studyWeek} /> : null;
}

/** The Home sidebar calendar with the learner's practice days ticked; without the log it still shows the dates. */
export async function SidebarCalendarSection({ userId, events }: { userId: string; events: CalendarEvent[] }) {
    const practiceDays = await loadStudentPracticeDays(userId).catch(error => {
        console.error("[Dashboard] Practice days unavailable", error);
        return undefined;
    });
    return <DashboardCalendarCard events={events} practiceDays={practiceDays} />;
}

import { cache } from "react";
import { WordRescuePracticeLater } from "./WordRescuePracticeLater";
import { MomentumCard } from "./MomentumCard";
import { SectionUnavailable } from "./SectionUnavailable";
import { getStudentMomentumSnapshot } from "@/lib/dashboard/student-momentum";
import { WeeklyQuizBar } from "./WeeklyQuizBar";
import { getStudentWeeklyQuizStatus } from "@/lib/learner/weekly-quiz-status";

const weeklyQuizStatus = cache((userId: string) => getStudentWeeklyQuizStatus(userId));
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

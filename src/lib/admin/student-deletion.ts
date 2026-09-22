/**
 * Who may be permanently deleted from the admin dashboard.
 *
 * Deleting a User removes every related row — submissions, progress,
 * points, achievements, enrollments — and cannot be undone. So deletion is
 * limited to accounts that never engaged: students who were rostered and then
 * never showed up. Anyone who did real work is removed from a class instead,
 * which keeps their record intact.
 *
 * The same rule is applied in the UI (to decide which control to show) and in
 * the API route (to actually enforce it), so hiding the button is never the
 * only thing standing between a misclick and a student's work.
 */

export interface StudentEngagementCounts {
    submissions: number;
    activityProgress: number;
    pointsLedger: number;
    achievements: number;
    quizResponses: number;
    speakingSubmissions: number;
    writingSubmissions: number;
}

export interface DeletableStudentInput {
    points: number;
    isSystemAccount?: boolean | null;
    role?: string | null;
    counts: StudentEngagementCounts;
}

export type StudentDeletionCheck =
    | { deletable: true }
    | { deletable: false; reason: string };

/** Every engagement signal that blocks deletion, for one clear message. */
export function summarizeEngagement(counts: StudentEngagementCounts): string[] {
    const parts: string[] = [];
    if (counts.submissions > 0) parts.push(`${counts.submissions} submission(s)`);
    if (counts.activityProgress > 0) parts.push(`${counts.activityProgress} activity progress record(s)`);
    if (counts.pointsLedger > 0) parts.push(`${counts.pointsLedger} points entr(ies)`);
    if (counts.achievements > 0) parts.push(`${counts.achievements} achievement(s)`);
    if (counts.quizResponses > 0) parts.push(`${counts.quizResponses} quiz response(s)`);
    if (counts.speakingSubmissions > 0) parts.push(`${counts.speakingSubmissions} speaking submission(s)`);
    if (counts.writingSubmissions > 0) parts.push(`${counts.writingSubmissions} writing submission(s)`);
    return parts;
}

export function checkStudentDeletable(input: DeletableStudentInput): StudentDeletionCheck {
    if (input.isSystemAccount) {
        return { deletable: false, reason: "System accounts cannot be deleted." };
    }

    if (input.role && input.role !== "student") {
        return {
            deletable: false,
            reason: "Only student accounts can be deleted here.",
        };
    }

    if (input.points > 0) {
        return {
            deletable: false,
            reason: `This student has earned ${input.points} points. Remove them from the class instead.`,
        };
    }

    const engagement = summarizeEngagement(input.counts);
    if (engagement.length > 0) {
        return {
            deletable: false,
            reason: `This student has ${engagement.join(", ")}. Remove them from the class instead.`,
        };
    }

    return { deletable: true };
}

export function isStudentDeletable(input: DeletableStudentInput): boolean {
    return checkStudentDeletable(input).deletable;
}

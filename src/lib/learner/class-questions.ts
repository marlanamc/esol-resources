/** Questions a learner sends from the course map, for the teacher to answer in class. */
export const MAX_QUESTION_LENGTH = 500;
export const MAX_QUESTIONS_PER_WEEK = 5;

export interface StudentClassQuestion {
    id: string;
    text: string;
    anonymous: boolean;
    answered: boolean;
}

export interface TeacherClassQuestion extends StudentClassQuestion {
    /** Null when the learner asked to hide their name. */
    studentName: string | null;
    createdAt: string;
}

type QuestionRow = { id: string; text: string; anonymous: boolean; answeredAt: Date | null };

export function toStudentQuestion(row: QuestionRow): StudentClassQuestion {
    return { id: row.id, text: row.text, anonymous: row.anonymous, answered: row.answeredAt != null };
}

export function toTeacherQuestion(
    row: QuestionRow & { createdAt: Date; student: { name: string | null; username: string } }
): TeacherClassQuestion {
    return {
        ...toStudentQuestion(row),
        studentName: row.anonymous ? null : (row.student.name || row.student.username),
        createdAt: row.createdAt.toISOString(),
    };
}

/** Trimmed question text, or an error message for the learner. */
export function parseQuestionText(value: unknown): { text: string } | { error: string } {
    if (typeof value !== "string") return { error: "Please write a question." };
    const text = value.trim();
    if (!text) return { error: "Please write a question." };
    if (text.length > MAX_QUESTION_LENGTH) return { error: `Please keep it under ${MAX_QUESTION_LENGTH} letters.` };
    return { text };
}

export function parseWeekNumber(value: unknown): number | null {
    const week = typeof value === "string" ? Number(value) : value;
    return typeof week === "number" && Number.isInteger(week) && week >= 1 && week <= 60 ? week : null;
}

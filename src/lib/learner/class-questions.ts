/** Questions a learner sends from the course map, for the teacher to answer in class. */
export const MAX_QUESTION_LENGTH = 500;
export const MAX_QUESTIONS_PER_WEEK = 5;
export const MAX_REPLY_LENGTH = 500;

export interface StudentClassQuestion {
    id: string;
    text: string;
    anonymous: boolean;
    answered: boolean;
    /** The teacher's written answer, if any; null until the question is answered. */
    reply: string | null;
    /** The learner tapped "Thanks!" on the answer. */
    seen: boolean;
}

export interface TeacherClassQuestion extends StudentClassQuestion {
    /** Null when the learner asked to hide their name. */
    studentName: string | null;
    createdAt: string;
}

export const QUESTION_SELECT = {
    id: true,
    text: true,
    anonymous: true,
    answeredAt: true,
    replyText: true,
    answerSeenAt: true,
} as const;

type QuestionRow = {
    id: string;
    text: string;
    anonymous: boolean;
    answeredAt: Date | null;
    replyText: string | null;
    answerSeenAt: Date | null;
};

export function toStudentQuestion(row: QuestionRow): StudentClassQuestion {
    const answered = row.answeredAt != null;
    return {
        id: row.id,
        text: row.text,
        anonymous: row.anonymous,
        answered,
        reply: answered ? row.replyText : null,
        seen: row.answerSeenAt != null,
    };
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

/** Trimmed reply text (empty means no written reply), or an error message for the teacher. */
export function parseReplyText(value: unknown): { text: string | null } | { error: string } {
    if (value == null) return { text: null };
    if (typeof value !== "string") return { error: "Reply must be text." };
    const text = value.trim();
    if (text.length > MAX_REPLY_LENGTH) return { error: `Please keep it under ${MAX_REPLY_LENGTH} letters.` };
    return { text: text || null };
}

export function parseWeekNumber(value: unknown): number | null {
    const week = typeof value === "string" ? Number(value) : value;
    return typeof week === "number" && Number.isInteger(week) && week >= 1 && week <= 60 ? week : null;
}

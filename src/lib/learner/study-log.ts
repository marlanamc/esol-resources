/** Practice a learner logs from home: one of six kinds plus one sentence about it. */
import {
    addDaysToDayKey,
    CALENDAR_WEEK_DAY_NAMES,
    getCalendarWeekStartDayKey,
    getLearnerDayKey,
} from "@/lib/gamification/calendar-week";

export const MAX_STUDY_LOG_LENGTH = 300;
/** Logging is open-ended, but only this many entries a day are saved. */
export const MAX_STUDY_LOGS_PER_DAY = 10;

/**
 * The "15 minutes of English a day" tiles from the How to Succeed in ESOL 3
 * handout, plus Read, with Other in place of Switch for anything else
 * (helping a friend with homework, changing the phone to English...). `starter` fills the sentence box and `v2`
 * is the past-tense hint shown under it.
 */
export const STUDY_LOG_KINDS = [
    { id: "listen", label: "Listen", example: "music, a podcast", starter: "I listened to ", v2: "listen → listened", letter: "L" },
    { id: "watch", label: "Watch", example: "a video, a show", starter: "I watched ", v2: "watch → watched", letter: "W" },
    { id: "read", label: "Read", example: "a book, the news", starter: "I read ", v2: "read → read (say \"red\")", letter: "R" },
    { id: "write", label: "Write", example: "a text, a note", starter: "I wrote ", v2: "write → wrote", letter: "Wr" },
    { id: "speak", label: "Speak", example: "a friend, a store", starter: "I talked to ", v2: "talk → talked", letter: "S" },
    { id: "other", label: "Other", example: "anything else", starter: "I ", v2: "help → helped, go → went", letter: "O" },
] as const;

export type StudyLogKind = (typeof STUDY_LOG_KINDS)[number]["id"];

export interface StudyLogEntry {
    id: string;
    kind: StudyLogKind;
    text: string;
    dayKey: string;
    createdAt: string;
}

export interface StudyWeekDay {
    dayKey: string;
    /** "Mon", "Tue", ... */
    label: string;
    /** "Monday", ... for screen readers. */
    name: string;
    isToday: boolean;
    isFuture: boolean;
    /** Kinds logged that day, in the order they were logged, without repeats. */
    kinds: StudyLogKind[];
}

export interface StudyWeek {
    weekStartDayKey: string;
    days: StudyWeekDay[];
    daysPracticed: number;
}

type StudyLogRow = { id: string; kind: string; text: string; dayKey: string; createdAt: Date };

export function isStudyLogKind(value: unknown): value is StudyLogKind {
    return STUDY_LOG_KINDS.some((kind) => kind.id === value);
}

/** Saved kind → current kind. "switch" logs from before Other replaced it read as Other. */
export function normalizeStudyLogKind(value: string): StudyLogKind | null {
    const kind = value === "switch" ? "other" : value;
    return isStudyLogKind(kind) ? kind : null;
}

export function getStudyLogKind(id: StudyLogKind) {
    return STUDY_LOG_KINDS.find((kind) => kind.id === id)!;
}

/** Trimmed sentence, or an error message for the learner. */
export function parseStudyLogText(value: unknown): { text: string } | { error: string } {
    if (typeof value !== "string") return { error: "Please write one sentence." };
    const text = value.trim();
    if (!text) return { error: "Please write one sentence." };
    if (text.length > MAX_STUDY_LOG_LENGTH) return { error: `Please keep it under ${MAX_STUDY_LOG_LENGTH} letters.` };
    return { text };
}

export function toStudyLogEntry(row: StudyLogRow): StudyLogEntry | null {
    const kind = normalizeStudyLogKind(row.kind);
    if (!kind) return null;
    return { id: row.id, kind, text: row.text, dayKey: row.dayKey, createdAt: row.createdAt.toISOString() };
}

/** Learner-local day keys for Mon–Sun of the week containing `referenceDate`. */
export function getStudyWeekRange(referenceDate: Date = new Date()): { start: string; end: string } {
    const start = getCalendarWeekStartDayKey(referenceDate);
    return { start, end: addDaysToDayKey(start, 6) };
}

/** Mon–Sun, matching the weekly points reset and the momentum card. */
export function buildStudyWeek(logs: Array<{ kind: string; dayKey: string }>, referenceDate: Date = new Date()): StudyWeek {
    const { start } = getStudyWeekRange(referenceDate);
    const todayKey = getLearnerDayKey(referenceDate);
    const days = CALENDAR_WEEK_DAY_NAMES.map((name, i): StudyWeekDay => {
        const dayKey = addDaysToDayKey(start, i);
        const kinds: StudyLogKind[] = [];
        for (const log of logs) {
            if (log.dayKey !== dayKey) continue;
            const kind = normalizeStudyLogKind(log.kind);
            if (kind && !kinds.includes(kind)) kinds.push(kind);
        }
        return { dayKey, label: name.slice(0, 3), name, isToday: dayKey === todayKey, isFuture: dayKey > todayKey, kinds };
    });
    return { weekStartDayKey: start, days, daysPracticed: days.filter((day) => day.kinds.length > 0).length };
}

/** Accepts a Monday day key (YYYY-MM-DD); anything else falls back to this week. */
export function parseWeekStartDayKey(value: unknown, referenceDate: Date = new Date()): string {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        const [y, m, d] = value.split("-").map(Number);
        const date = new Date(Date.UTC(y, m - 1, d));
        if (date.toISOString().slice(0, 10) === value && date.getUTCDay() === 1) return value;
    }
    return getCalendarWeekStartDayKey(referenceDate);
}

export interface TeacherStudyRow {
    studentId: string;
    studentName: string;
    /** Mon–Sun; each day lists the kinds logged. */
    days: StudyLogKind[][];
    daysPracticed: number;
    /** The week's logs, newest first. */
    entries: StudyLogEntry[];
}

/** One row per student for a teacher's Mon–Sun week, in name order. */
export function buildTeacherStudyRows(
    students: Array<{ id: string; name: string | null; username: string }>,
    logs: Array<StudyLogRow & { userId: string }>,
    weekStartDayKey: string
): TeacherStudyRow[] {
    const dayKeys = Array.from({ length: 7 }, (_, i) => addDaysToDayKey(weekStartDayKey, i));
    return students
        .map((student) => {
            const mine = logs
                .filter((log) => log.userId === student.id)
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            const days = dayKeys.map((dayKey) => {
                const kinds: StudyLogKind[] = [];
                for (const log of [...mine].reverse()) {
                    if (log.dayKey !== dayKey) continue;
            const kind = normalizeStudyLogKind(log.kind);
            if (kind && !kinds.includes(kind)) kinds.push(kind);
                }
                return kinds;
            });
            return {
                studentId: student.id,
                studentName: student.name?.trim() || student.username,
                days,
                daysPracticed: days.filter((kinds) => kinds.length > 0).length,
                entries: mine.map(toStudyLogEntry).filter((entry): entry is StudyLogEntry => entry != null),
            };
        })
        .sort((a, b) => a.studentName.localeCompare(b.studentName));
}

/** Monday (YYYY-MM-DD) of the Mon–Sun week a learner day key falls in. */
export function getWeekStartForDayKey(dayKey: string): string {
    const [y, m, d] = dayKey.split("-").map(Number);
    const daysSinceMonday = (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7;
    return addDaysToDayKey(dayKey, -daysSinceMonday);
}

export interface StudyJournalWeek {
    weekStart: string;
    /** Newest first. */
    entries: StudyLogEntry[];
}

export interface StudyJournal {
    /** Distinct days with at least one log, all time. */
    daysPracticed: number;
    /** Newest week first. */
    weeks: StudyJournalWeek[];
}

/** Every log grouped by Mon–Sun week, for the profile's practice journal. */
export function buildStudyJournal(entries: StudyLogEntry[]): StudyJournal {
    const sorted = [...entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const weeks: StudyJournalWeek[] = [];
    for (const entry of sorted) {
        const weekStart = getWeekStartForDayKey(entry.dayKey);
        const last = weeks[weeks.length - 1];
        if (last?.weekStart === weekStart) last.entries.push(entry);
        else weeks.push({ weekStart, entries: [entry] });
    }
    return { daysPracticed: new Set(sorted.map((entry) => entry.dayKey)).size, weeks };
}

/** Distinct days practiced per learner, from (userId, dayKey) rows that may repeat. */
export function countPracticeDays(rows: Array<{ userId: string; dayKey: string }>): Map<string, number> {
    const days = new Map<string, Set<string>>();
    for (const row of rows) {
        const set = days.get(row.userId) ?? new Set<string>();
        set.add(row.dayKey);
        days.set(row.userId, set);
    }
    return new Map([...days].map(([userId, set]) => [userId, set.size]));
}

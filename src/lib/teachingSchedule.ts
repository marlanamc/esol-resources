import { readFile } from "node:fs/promises";
import { readdir } from "node:fs/promises";
import path from "node:path";

export type MonthDay = { year: number; month: number; day: number };

export type TeachingScheduleFlowItem = { time: string; activity: string };

export type TeachingScheduleDay = {
    time: string;
    flow: TeachingScheduleFlowItem[];
};

export type TeachingSchedule = {
    Tuesday: TeachingScheduleDay;
    Thursday: TeachingScheduleDay;
};

export type TeachingScheduleWeekDay = {
    warmup: string;
    grammar?: string;
    quiz?: string;
    notes?: string;
};

export type TeachingScheduleWeek = {
    week: string;
    dates: { tue: MonthDay; thu: MonthDay };
    tuesday: TeachingScheduleWeekDay;
    thursday: TeachingScheduleWeekDay;
};

export type TeachingScheduleData = {
    teachingSchedule: TeachingSchedule;
    weeklySchedule: TeachingScheduleWeek[];
    sourcePath: string;
    rawMarkdown?: string;
    loadError?: string;
};

const DEFAULT_TEACHING_SCHEDULE: TeachingSchedule = {
    Tuesday: { time: "6:00-8:15pm", flow: [] },
    Thursday: { time: "6:00-8:15pm", flow: [] },
};

function parseMonthDay(token: string, year = 2026): MonthDay | null {
    const match = token.trim().match(/^(\d{1,2})\/(\d{1,2})$/);
    if (!match) return null;
    const month = Number(match[1]);
    const day = Number(match[2]);
    if (!Number.isFinite(month) || !Number.isFinite(day) || month < 1 || month > 12 || day < 1 || day > 31) return null;
    return { year, month, day };
}

function firstMatchGroup(re: RegExp, text: string): string | undefined {
    const match = text.match(re);
    return match?.[1]?.trim() || undefined;
}

function parseFlowSection(section: string): TeachingScheduleDay {
    const time = firstMatchGroup(/^\s*-\s*\*\*(.+?)\*\*\s*$/m, section) || "";
    const flow: TeachingScheduleFlowItem[] = [];

    // Helper function to strip duration patterns like "(15 min)", "(20 minutes)", etc.
    const stripDuration = (text: string): string => {
        return text.replace(/\s*\(\d+\s*min(?:utes?)?\)/gi, "").trim();
    };

    // Try to match new format with sequential numbers: - **1** Activity
    const flowLineWithNumberRe = /^\s*-\s*\*\*(\d+)\*\*\s*(.+)\s*$/gm;
    const matchesWithNumber = Array.from(section.matchAll(flowLineWithNumberRe));

    if (matchesWithNumber.length > 0) {
        // New format with sequential numbers
        for (const match of matchesWithNumber) {
            const activity = stripDuration(match[2]!.trim());
            flow.push({ time: "", activity });
        }
    } else {
        // Try to match lines with times (old format for backward compatibility)
        const flowLineWithTimeRe = /^\s*-\s*\*\*(\d{1,2}:\d{2}\s*[–—-]\s*\d{1,2}:\d{2})\*\*\s*(.+)\s*$/gm;
        const matchesWithTime = Array.from(section.matchAll(flowLineWithTimeRe));

        if (matchesWithTime.length > 0) {
            // Old format with times - ignore times, just extract activities
            for (const match of matchesWithTime) {
                const activity = stripDuration(match[2]!.trim());
                flow.push({ time: "", activity });
            }
        } else {
            // Plain bullet points without any formatting
            const flowLineRe = /^\s*-\s*(.+)\s*$/gm;
            for (const match of section.matchAll(flowLineRe)) {
                const activity = match[1]!.trim();
                // Skip if it's the time header line
                if (!/^\d{1,2}:\d{2}\s*[–—-]\s*\d{1,2}:\d{2}/.test(activity)) {
                    const cleanActivity = stripDuration(activity);
                    flow.push({ time: "", activity: cleanActivity });
                }
            }
        }
    }

    return { time, flow };
}

function parseTeachingSchedule(markdown: string): TeachingSchedule {
    const tuesdayBlock = firstMatchGroup(/###\s+Tuesdays[\s\S]*?\n([\s\S]*?)(?=\n###\s+Thursdays|\n##\s+Monthly|\n---|\n##\s+Week)/m, markdown);
    const thursdayBlock = firstMatchGroup(/###\s+Thursdays[\s\S]*?\n([\s\S]*?)(?=\n##\s+Monthly|\n---|\n##\s+Week)/m, markdown);

    return {
        Tuesday: tuesdayBlock ? parseFlowSection(tuesdayBlock) : DEFAULT_TEACHING_SCHEDULE.Tuesday,
        Thursday: thursdayBlock ? parseFlowSection(thursdayBlock) : DEFAULT_TEACHING_SCHEDULE.Thursday,
    };
}

function parseDaySection(section: string): TeachingScheduleWeekDay {
    const warmup = firstMatchGroup(/Warm[\u2011\u2013\u2014-]?up:\*\*\s*(.+)\s*$/m, section) || "";

    const quiz = firstMatchGroup(/\*\*Unit quiz:\*\*\s*(.+)\s*$/m, section);
    const grammar =
        firstMatchGroup(/\*\*Grammar\s*\(new\):\*\*\s*(.+)\s*$/m, section) ||
        firstMatchGroup(/\*\*Grammar review:\*\*\s*(.+)\s*$/m, section) ||
        firstMatchGroup(/\*\*Grammar:\*\*\s*(.+)\s*$/m, section);

    const rlw = firstMatchGroup(/\*\*R\/L\/W:\*\*\s*(.+)\s*$/m, section);
    const game = firstMatchGroup(/\*\*Game:\*\*\s*(.+)\s*$/m, section);
    const notesParts = [rlw ? `R/L/W: ${rlw}` : null, game ? `Game: ${game}` : null].filter(Boolean) as string[];
    const notes = notesParts.length ? notesParts.join(" • ") : undefined;

    return { warmup, grammar, quiz, notes };
}

function parseWeekBlocks(markdown: string): TeachingScheduleWeek[] {
    const lines = markdown.split("\n");

    const headerIndices: number[] = [];
    for (let i = 0; i < lines.length; i++) {
        if (/^###\s+Week\s+\d+/i.test(lines[i] || "")) headerIndices.push(i);
    }
    if (!headerIndices.length) return [];

    const blocks: string[] = [];
    for (let i = 0; i < headerIndices.length; i++) {
        const start = headerIndices[i]!;
        const end = i + 1 < headerIndices.length ? headerIndices[i + 1]! : lines.length;
        blocks.push(lines.slice(start, end).join("\n"));
    }

    const weeks: TeachingScheduleWeek[] = [];

    for (const block of blocks) {
        const headerLine = block.split("\n")[0] || "";
        const week = headerLine.replace(/^###\s+/, "").trim();

        const tueLine = block.match(/^\*\*Tue\s+(\d{1,2}\/\d{1,2})\s*[–—-]\s*Warm[\u2011\u2013\u2014-]?up:\*\*\s*(.+)\s*$/m);
        const thuLine = block.match(/^\*\*Thu\s+(\d{1,2}\/\d{1,2})\s*[–—-]\s*Warm[\u2011\u2013\u2014-]?up:\*\*\s*(.+)\s*$/m);
        if (!tueLine || !thuLine) continue;

        const tueDate = parseMonthDay(tueLine[1]!, 2026);
        const thuDate = parseMonthDay(thuLine[1]!, 2026);
        if (!tueDate || !thuDate) continue;

        const tueIdx = block.indexOf(tueLine[0]);
        const thuIdx = block.indexOf(thuLine[0]);
        if (tueIdx === -1 || thuIdx === -1) continue;

        const tuesdaySection = block.slice(tueIdx, thuIdx).trim();
        const thursdaySection = block.slice(thuIdx).trim();

        const tuesday = parseDaySection(tuesdaySection);
        const thursday = parseDaySection(thursdaySection);
        tuesday.warmup ||= tueLine[2]?.trim() || "";
        thursday.warmup ||= thuLine[2]?.trim() || "";

        weeks.push({
            week,
            dates: { tue: tueDate, thu: thuDate },
            tuesday,
            thursday,
        });
    }

    return weeks;
}

export async function loadEsol3TeachingScheduleData(): Promise<TeachingScheduleData> {
    const cwd = process.cwd();
    const candidates = [
        path.join(cwd, "src", "content", "teacher", "esol-3-teaching-schedule-jan-jun-2026.md"),
        path.join(cwd, "class_uploads", "ESOL 3 Teaching Schedule (Jan–Jun 2026).md"),
        path.join(cwd, "class_uploads", "ESOL 3 Teaching Schedule (Jan-Jun 2026).md"),
        path.join(cwd, "class_uploads", "Printable_Schedule_Jan-Jun_2026.md"),
    ];

    let lastError: unknown = null;

    for (const candidate of candidates) {
        try {
            const markdown = await readFile(candidate, "utf8");
            return {
                teachingSchedule: parseTeachingSchedule(markdown),
                weeklySchedule: parseWeekBlocks(markdown),
                sourcePath: candidate,
                rawMarkdown: markdown,
            };
        } catch (err) {
            lastError = err;
        }
    }

    try {
        const uploadsDir = path.join(cwd, "class_uploads");
        const entries = await readdir(uploadsDir, { withFileTypes: true });
        const match = entries.find(
            (e) => e.isFile() && /teaching schedule/i.test(e.name) && /\.md$/i.test(e.name)
        );
        if (match) {
            const candidate = path.join(uploadsDir, match.name);
            const markdown = await readFile(candidate, "utf8");
            return {
                teachingSchedule: parseTeachingSchedule(markdown),
                weeklySchedule: parseWeekBlocks(markdown),
                sourcePath: candidate,
                rawMarkdown: markdown,
            };
        }
    } catch (err) {
        lastError = lastError || err;
    }

    const loadError =
        lastError instanceof Error ? lastError.message : "Unknown error reading schedule markdown.";
    return {
        teachingSchedule: DEFAULT_TEACHING_SCHEDULE,
        weeklySchedule: [],
        sourcePath: candidates[0]!,
        loadError,
    };
}

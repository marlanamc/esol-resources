import type { LoadedGuide } from "./types";
import type { AuditFinding, DialogueTurn } from "./types";
import {
    CIVIC_WEEKS,
    CASUAL_SPEAKER_HINTS,
    PRESSURE_KEYWORDS,
    TEXTBOOK_PHRASES,
    VAGUE_JOB_PHRASES,
    WHOLESOME_PHRASES,
    WORKPLACE_KEYWORDS,
} from "./config";
import { collectGuideStrings, countWords, getAllPlainText } from "./collect-strings";

function warning(
    slug: string,
    ruleId: string,
    path: string,
    message: string,
    snippet?: string,
): AuditFinding {
    return { severity: "warning", ruleId, slug, path, message, snippet };
}

function splitSentences(text: string): string[] {
    return text
        .split(/(?<=[.!?])\s+/)
        .map((part) => part.trim())
        .filter(Boolean);
}

export function runToneHeuristics(
    guide: LoadedGuide,
    dialogues: DialogueTurn[],
): AuditFinding[] {
    const { slug, scope, content } = guide;
    const findings: AuditFinding[] = [];
    const allTextLower = getAllPlainText(content).toLowerCase();

    const hasWorkplace = WORKPLACE_KEYWORDS.some((keyword) => allTextLower.includes(keyword));
    if (!hasWorkplace) {
        findings.push(
            warning(
                slug,
                "workplace-keyword-missing",
                "tone",
                "Guide text has no survival-mode workplace/housing keyword from allowlist",
            ),
        );
    }

    if (!CIVIC_WEEKS.has(scope.weekNumber)) {
        for (const phrase of WHOLESOME_PHRASES) {
            if (!allTextLower.includes(phrase)) continue;
            const hasPressure = PRESSURE_KEYWORDS.some((kw) => allTextLower.includes(kw));
            if (!hasPressure) {
                findings.push(
                    warning(
                        slug,
                        "wholesome-without-pressure",
                        "tone",
                        `Contains "${phrase}" outside civic weeks without pressure context (form, deadline, rent, etc.)`,
                    ),
                );
            }
        }
    }

    for (const phrase of VAGUE_JOB_PHRASES) {
        if (allTextLower.includes(phrase)) {
            findings.push(
                warning(
                    slug,
                    "vague-job-reference",
                    "tone",
                    `Vague job reference: "${phrase}"`,
                    phrase,
                ),
            );
        }
    }

    for (const entry of collectGuideStrings(content)) {
        const lower = entry.plainText.toLowerCase();
        for (const phrase of TEXTBOOK_PHRASES) {
            if (lower.includes(phrase)) {
                findings.push(
                    warning(
                        slug,
                        "textbook-phrase",
                        entry.path,
                        `Possible textbook phrasing: "${phrase.trim()}"`,
                        entry.plainText.slice(0, 100),
                    ),
                );
            }
        }

        if (countWords(entry.plainText) > 30) {
            continue;
        }

        for (const sentence of splitSentences(entry.plainText)) {
            if (countWords(sentence) > 30) {
                findings.push(
                    warning(
                        slug,
                        "long-sentence",
                        entry.path,
                        `Student-facing sentence is ${countWords(sentence)} words (threshold 30)`,
                        sentence.slice(0, 120),
                    ),
                );
            }
        }
    }

    const turnsBySection = new Map<string, DialogueTurn[]>();
    for (const turn of dialogues) {
        const key = turn.sectionTitle ?? "unknown";
        const list = turnsBySection.get(key) ?? [];
        list.push(turn);
        turnsBySection.set(key, list);
    }

    for (const [sectionTitle, turns] of turnsBySection.entries()) {
        if (turns.length > 6) {
            findings.push(
                warning(
                    slug,
                    "dialogue-too-many-turns",
                    sectionTitle,
                    `Section has ${turns.length} dialogue turns (max 6 recommended)`,
                ),
            );
        }
    }

    for (const turn of dialogues) {
        const words = countWords(turn.text);
        if (words > 22) {
            findings.push(
                warning(
                    slug,
                    "dialogue-too-long",
                    turn.sectionTitle ?? "dialogue",
                    `${turn.speaker}'s line is ${words} words (threshold 22)`,
                    turn.text.slice(0, 120),
                ),
            );
        }

        const speakerLower = turn.speaker.toLowerCase();
        const isCasual = CASUAL_SPEAKER_HINTS.some((hint) => speakerLower.includes(hint));
        const hasContraction = /\b\w+'\w+|\b\w+n't\b|\bI'm\b|\bI've\b|\bI'd\b|\bwe're\b|\bthey're\b|\bit's\b|\bthat's\b/i.test(
            turn.text,
        );

        if (isCasual && !hasContraction && countWords(turn.text) >= 10) {
            findings.push(
                warning(
                    slug,
                    "dialogue-no-contraction",
                    turn.sectionTitle ?? "dialogue",
                    `${turn.speaker}'s casual dialogue has no contractions`,
                    turn.text.slice(0, 100),
                ),
            );
        }
    }

    return findings;
}

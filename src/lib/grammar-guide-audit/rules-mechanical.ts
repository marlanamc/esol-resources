import type { LoadedGuide } from "./types";
import type { AuditFinding } from "./types";
import { collectGuideStrings, countWords } from "./collect-strings";
import {
    TENSE_DIAGRAM_EXEMPT_SLUGS,
    TENSE_DIAGRAM_REQUIRED_SLUGS,
} from "./config";
import { usesSceneCards } from "./parse-dialogue";

const EM_DASH = "\u2014";

function finding(
    slug: string,
    ruleId: string,
    path: string,
    message: string,
    snippet?: string,
): AuditFinding {
    return { severity: "error", ruleId, slug, path, message, snippet };
}

export function runMechanicalRules(guide: LoadedGuide): AuditFinding[] {
    const { slug, scope, content, contentSource, pagePath } = guide;
    const findings: AuditFinding[] = [];

    if (!contentSource) {
        findings.push(
            finding(slug, "content-file-missing", guide.contentPath, "Content file is missing"),
        );
        return findings;
    }

    if (!guide.pageMeta || !pagePath) {
        findings.push(
            finding(slug, "page-route-missing", pagePath ?? `page/${slug}`, "Page route is missing"),
        );
    } else {
        const { completionKey, activityTitle } = guide.pageMeta;
        if (completionKey !== slug) {
            findings.push(
                finding(
                    slug,
                    "completion-key-mismatch",
                    pagePath,
                    `completionKey "${completionKey ?? "null"}" should match slug "${slug}"`,
                ),
            );
        }
        if (activityTitle && activityTitle !== scope.title) {
            findings.push(
                finding(
                    slug,
                    "activity-title-mismatch",
                    pagePath,
                    `getActivityIdSafely title "${activityTitle}" does not match course-map title "${scope.title}"`,
                ),
            );
        }
    }

    const sections = content.sections ?? [];
    if (sections.length === 0) {
        findings.push(finding(slug, "no-sections", "sections", "Guide has no sections"));
    } else if (sections.length > 5) {
        findings.push(
            finding(
                slug,
                "section-count",
                "sections",
                `Guide has ${sections.length} sections (max 5)`,
            ),
        );
    }

    for (const [index, section] of sections.entries()) {
        const textItems = (section.exercises ?? []).flatMap((exercise) =>
            exercise.items.filter((item) => item.type === "text"),
        );
        if (textItems.length === 0) {
            findings.push(
                finding(
                    slug,
                    "missing-text-exercise",
                    `sections[${index}]`,
                    `Section "${section.title}" has no text exercise`,
                ),
            );
        }
    }

    // Mini-guides use a 5-question quiz format (redesigned 2026). The legacy
    // 10-question distribution checks below remain for any pre-redesign guides.
    const EXPECTED_MINI_QUIZ_COUNT = 5;
    const miniQuiz = content.miniQuiz ?? [];
    if (miniQuiz.length !== EXPECTED_MINI_QUIZ_COUNT) {
        findings.push(
            finding(
                slug,
                "mini-quiz-count",
                "miniQuiz",
                `miniQuiz has ${miniQuiz.length} questions (expected ${EXPECTED_MINI_QUIZ_COUNT})`,
            ),
        );
    }

    const difficulties = { easy: 0, medium: 0, hard: 0 };
    let errorDetectionCount = 0;

    for (const [index, question] of miniQuiz.entries()) {
        const prefix = `miniQuiz[${index}]`;
        if (!question.topic) {
            findings.push(finding(slug, "mini-quiz-topic", prefix, "Missing topic"));
        }
        if (!question.skill) {
            findings.push(finding(slug, "mini-quiz-skill", prefix, "Missing skill"));
        }
        if (!question.skillTag) {
            findings.push(finding(slug, "mini-quiz-skill-tag", prefix, "Missing skillTag"));
        }
        if (!question.explanation?.trim()) {
            findings.push(finding(slug, "mini-quiz-explanation", prefix, "Missing explanation"));
        }
        if (question.skill === "error-detection") {
            errorDetectionCount += 1;
        }
        if (question.difficulty) {
            difficulties[question.difficulty] += 1;
        }
    }

    if (miniQuiz.length === 10) {
        if (difficulties.easy < 3 || difficulties.easy > 4) {
            findings.push(
                finding(
                    slug,
                    "mini-quiz-difficulty-easy",
                    "miniQuiz",
                    `Expected 3–4 easy questions, found ${difficulties.easy}`,
                ),
            );
        }
        if (difficulties.medium < 4 || difficulties.medium > 5) {
            findings.push(
                finding(
                    slug,
                    "mini-quiz-difficulty-medium",
                    "miniQuiz",
                    `Expected 4–5 medium questions, found ${difficulties.medium}`,
                ),
            );
        }
        if (difficulties.hard < 1 || difficulties.hard > 2) {
            findings.push(
                finding(
                    slug,
                    "mini-quiz-difficulty-hard",
                    "miniQuiz",
                    `Expected 1–2 hard questions, found ${difficulties.hard}`,
                ),
            );
        }
    }

    // Scaled proportionally to the 5-question format (was 2 of 10 → 1 of 5).
    const MIN_ERROR_DETECTION = 1;
    if (errorDetectionCount < MIN_ERROR_DETECTION) {
        findings.push(
            finding(
                slug,
                "mini-quiz-error-detection",
                "miniQuiz",
                `Expected at least ${MIN_ERROR_DETECTION} error-detection question(s), found ${errorDetectionCount}`,
            ),
        );
    }

    for (const entry of collectGuideStrings(content)) {
        if (entry.value.includes(EM_DASH) || entry.plainText.includes(EM_DASH)) {
            findings.push(
                finding(
                    slug,
                    "em-dash",
                    entry.path,
                    "Student-facing text contains an em dash",
                    entry.plainText.slice(0, 120),
                ),
            );
        }
    }

    for (const [sectionIndex, section] of sections.entries()) {
        for (const [exerciseIndex, exercise] of (section.exercises ?? []).entries()) {
            for (const [itemIndex, item] of exercise.items.entries()) {
                const path = `sections[${sectionIndex}].exercises[${exerciseIndex}].items[${itemIndex}]`;
                if (item.type === "word-scramble" && "expectedAnswer" in item) {
                    findings.push(
                        finding(
                            slug,
                            "word-scramble-expected-answer",
                            path,
                            "word-scramble should use correctAnswer, not expectedAnswer",
                        ),
                    );
                }
                if (item.type === "text") {
                    if ("expectedAnswer" in item && item.expectedAnswer !== undefined) {
                        findings.push(
                            finding(
                                slug,
                                "text-expected-answer-singular",
                                path,
                                "text exercise should use expectedAnswers array, not expectedAnswer",
                            ),
                        );
                    }
                    if (!item.expectedAnswers?.length && !item.acceptAnyAttempt) {
                        findings.push(
                            finding(
                                slug,
                                "text-missing-expected-answers",
                                path,
                                "text exercise missing expectedAnswers",
                            ),
                        );
                    }
                }
            }
        }
    }

    if (TENSE_DIAGRAM_REQUIRED_SLUGS.has(slug) && !TENSE_DIAGRAM_EXEMPT_SLUGS.has(slug)) {
        const hasDiagram = sections.some((section) => Boolean(section.tenseDiagram));
        if (!hasDiagram) {
            findings.push(
                finding(
                    slug,
                    "tense-diagram-missing",
                    "sections",
                    "Tense-focused guide is missing tenseDiagram on at least one section",
                ),
            );
        }
    }

    if (usesSceneCards(contentSource) && !guide.imageModulePath) {
        findings.push(
            finding(
                slug,
                "image-module-missing",
                guide.contentPath,
                "Guide uses sceneCard but no image module import was found",
            ),
        );
    }

    const allText = collectGuideStrings(content).map((s) => s.plainText).join(" ");
    for (const entry of collectGuideStrings(content)) {
        if (countWords(entry.plainText) > 30 && !entry.isHtml) {
            // Long plain strings only; HTML blocks checked in heuristics
            continue;
        }
    }

    void allText;
    return findings;
}

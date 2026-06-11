import type { InteractiveGuideContent } from "@/types/activity";
import { stripHtml } from "./collect-strings";
import type { AuditFinding, LoadedGuide } from "./types";

function finding(
    slug: string,
    severity: AuditFinding["severity"],
    ruleId: string,
    path: string,
    message: string,
    snippet?: string,
): AuditFinding {
    return { severity, ruleId, slug, path, message, snippet };
}

/** Minimum normalized word count before an answer is treated as a full sentence. */
const SENTENCE_WORD_THRESHOLD = 4;

export function normalizeForComparison(text: string): string {
    return text
        .toLowerCase()
        .replace(/[‘’ʼ]/g, "'")
        .replace(/[^a-z0-9\s']/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function wordCount(normalized: string): number {
    return normalized ? normalized.split(" ").length : 0;
}

export interface TeachingTextEntry {
    path: string;
    text: string;
}

/**
 * All learner-visible teaching text: section explanations, examples, tips,
 * comparisons, tables, and titles. Excludes exercises and the mini quiz so
 * assessment answers can be checked against what the guide already showed.
 */
export function collectTeachingText(content: InteractiveGuideContent): TeachingTextEntry[] {
    const out: TeachingTextEntry[] = [];
    const push = (path: string, value: string | undefined) => {
        if (!value || !value.trim()) return;
        const text = stripHtml(value);
        if (text) out.push({ path, text });
    };

    for (const [sectionIndex, section] of (content.sections ?? []).entries()) {
        const prefix = `sections[${sectionIndex}]`;
        push(`${prefix}.title`, section.title);
        push(`${prefix}.explanation`, section.explanation);
        push(`${prefix}.postExplanation`, section.postExplanation);

        if (section.tipBox) {
            push(`${prefix}.tipBox.title`, section.tipBox.title);
            push(`${prefix}.tipBox.content`, section.tipBox.content);
        }

        for (const [exampleIndex, example] of (section.examples ?? []).entries()) {
            push(`${prefix}.examples[${exampleIndex}]`, example);
        }

        for (const [meaningIndex, meaning] of (section.usageMeanings ?? []).entries()) {
            const meaningPrefix = `${prefix}.usageMeanings[${meaningIndex}]`;
            push(`${meaningPrefix}.title`, meaning.title);
            push(`${meaningPrefix}.description`, meaning.description);
            for (const [exampleIndex, example] of meaning.examples.entries()) {
                push(`${meaningPrefix}.examples[${exampleIndex}].sentence`, example.sentence);
                push(`${meaningPrefix}.examples[${exampleIndex}].explanation`, example.explanation);
            }
        }

        if (section.comparison) {
            push(`${prefix}.comparison.title`, section.comparison.title);
            for (const [rowIndex, row] of section.comparison.rows.entries()) {
                push(`${prefix}.comparison.rows[${rowIndex}].label`, row.label);
                push(`${prefix}.comparison.rows[${rowIndex}].left`, row.left);
                push(`${prefix}.comparison.rows[${rowIndex}].right`, row.right);
            }
        }

        for (const [expressionIndex, expression] of (section.timeExpressions ?? []).entries()) {
            const expressionPrefix = `${prefix}.timeExpressions[${expressionIndex}]`;
            push(`${expressionPrefix}.usage`, expression.usage);
            for (const [exampleIndex, example] of expression.examples.entries()) {
                push(`${expressionPrefix}.examples[${exampleIndex}]`, example);
            }
        }

        if (section.verbTable) {
            for (const [rowIndex, row] of section.verbTable.rows.entries()) {
                push(`${prefix}.verbTable.rows[${rowIndex}]`, row.join(" | "));
            }
        }

        if (section.timeline) {
            push(`${prefix}.timeline.description`, section.timeline.description);
            for (const [eventIndex, event] of section.timeline.events.entries()) {
                push(`${prefix}.timeline.events[${eventIndex}].label`, event.label);
            }
        }

        if (section.futureChoiceFlow) {
            push(`${prefix}.futureChoiceFlow.description`, section.futureChoiceFlow.description);
            for (const [optionIndex, option] of section.futureChoiceFlow.options.entries()) {
                const optionPrefix = `${prefix}.futureChoiceFlow.options[${optionIndex}]`;
                push(`${optionPrefix}.trigger`, option.trigger);
                push(`${optionPrefix}.example`, option.example);
            }
        }
    }

    return out;
}

export interface AssessmentTarget {
    path: string;
    stem: string;
    answers: string[];
    /**
     * Open-production items (text inputs accepting many different answers).
     * Taught phrases must stay accepted there, so the recycling rule skips them.
     */
    openProduction?: boolean;
}

const OPEN_PRODUCTION_ANSWER_COUNT = 4;

function resolveOptionLabel(
    options: Array<{ value: string; label: string }>,
    value: string,
): string {
    return options.find((option) => option.value === value)?.label ?? value;
}

/**
 * Every gradeable item (mini quiz questions and section exercise items) with
 * its stem text and the full answer text a learner must produce or pick.
 */
export function collectAssessmentTargets(content: InteractiveGuideContent): AssessmentTarget[] {
    const out: AssessmentTarget[] = [];

    for (const [sectionIndex, section] of (content.sections ?? []).entries()) {
        for (const [exerciseIndex, exercise] of (section.exercises ?? []).entries()) {
            for (const [itemIndex, item] of exercise.items.entries()) {
                const path = `sections[${sectionIndex}].exercises[${exerciseIndex}].items[${itemIndex}]`;
                const stem = [exercise.instructions ?? "", stripHtml(item.label)]
                    .filter(Boolean)
                    .join(" ");
                const answers: string[] = [];

                if (item.type === "text") {
                    if (item.acceptAnyAttempt) continue;
                    if (item.correctAnswer) answers.push(item.correctAnswer);
                    if (item.expectedAnswer) answers.push(item.expectedAnswer);
                    answers.push(...(item.expectedAnswers ?? []));
                } else if (item.type === "select") {
                    if (item.expectedAnswer) answers.push(item.expectedAnswer);
                    answers.push(...(item.expectedAnswers ?? []));
                } else if (item.type === "radio") {
                    const values = [
                        ...(item.expectedAnswer ? [item.expectedAnswer] : []),
                        ...(item.expectedAnswers ?? []),
                    ];
                    answers.push(...values.map((value) => resolveOptionLabel(item.options, value)));
                } else if (item.type === "checkbox") {
                    answers.push(
                        ...item.expectedAnswers.map((value) => resolveOptionLabel(item.options, value)),
                    );
                } else if (item.type === "word-scramble") {
                    answers.push(item.correctAnswer, ...(item.correctAnswers ?? []));
                } else {
                    continue;
                }

                if (answers.length > 0) {
                    out.push({
                        path,
                        stem,
                        answers,
                        openProduction:
                            item.type === "text" && answers.length >= OPEN_PRODUCTION_ANSWER_COUNT,
                    });
                }
            }
        }
    }

    for (const [questionIndex, question] of (content.miniQuiz ?? []).entries()) {
        const path = `miniQuiz[${questionIndex}]`;
        const answers: string[] = [];
        let stem = question.question;

        if (question.type === "fill-blank") {
            answers.push(question.correctAnswer, ...(question.acceptedAnswers ?? []));
        } else if (question.type === "word-scramble") {
            answers.push(question.correctAnswer, ...(question.correctAnswers ?? []));
            if (question.hint) stem = `${stem} ${question.hint}`;
        } else {
            answers.push(resolveOptionLabel(question.options, question.correctAnswer));
        }

        out.push({ path, stem, answers });
    }

    return out;
}

export function runAnswerIntegrityRules(guide: LoadedGuide): AuditFinding[] {
    const findings: AuditFinding[] = [];
    const teaching = collectTeachingText(guide.content).map((entry) => ({
        path: entry.path,
        normalized: normalizeForComparison(entry.text),
    }));

    for (const target of collectAssessmentTargets(guide.content)) {
        const normalizedStem = normalizeForComparison(target.stem);

        for (const answer of target.answers) {
            const normalizedAnswer = normalizeForComparison(answer);
            if (wordCount(normalizedAnswer) < SENTENCE_WORD_THRESHOLD) continue;

            if (normalizedStem.includes(normalizedAnswer)) {
                findings.push(
                    finding(
                        guide.slug,
                        "error",
                        "answer-leaked-in-question-stem",
                        target.path,
                        "The full answer appears in the question stem, so learners can copy it without producing the sentence themselves",
                        answer,
                    ),
                );
            }

            if (target.openProduction) continue;
            const recycledFrom = teaching.find((entry) =>
                entry.normalized.includes(normalizedAnswer),
            );
            if (recycledFrom) {
                findings.push(
                    finding(
                        guide.slug,
                        "warning",
                        "answer-recycled-from-explanation-text",
                        target.path,
                        `Answer sentence already appears in teaching text at ${recycledFrom.path}; learners can copy it instead of producing it`,
                        answer,
                    ),
                );
            }
        }
    }

    return findings;
}

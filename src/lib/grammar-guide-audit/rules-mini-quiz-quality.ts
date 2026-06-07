import type { MiniQuizQuestion } from "@/types/activity";
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

const TIME_CUE_PATTERN =
    /\b(right now|today|tonight|yesterday|last (?:year|week|month|night)|every (?:day|week|morning)|usually|always|never|since|for \d+|this (?:week|month|year)|at the moment|currently|before|after|when|while|already|yet|just)\b/i;

const SCENARIO_HINT_PATTERN =
    /\b(you|your|neighbor|class|work|boss|clinic|bus|apartment|kitchen|phone|Rosa|Carlos|Amara|Fred|Yemi|Marisol|Rafael|Jennifer|Lucia|Teresa|David|Beatriz|Linh|Nadine|Brian|Kelly|Marco|staff|landlord|manager|sitter|patient|doctor|shift|rent|lesson|guide)\b/i;

const TRUNCATED_END_PATTERN =
    /\b(?:I|he|she|they|we|it|the|a|an|to|in|on|at|of|for|and|or|but|don|won|can|is|are|was|were|have|has|had|will|would|could|should|must|not|n't)\s*$/i;

function questionType(question: MiniQuizQuestion): string {
    if (question.type === "fill-blank") return "fill-blank";
    if (question.type === "word-scramble") return "word-scramble";
    return "radio";
}

function normalizeWords(text: string): string[] {
    return text
        .toLowerCase()
        .replace(/[^\w\s']/g, " ")
        .split(/\s+/)
        .filter(Boolean);
}

function longestCommonPrefixRatio(labels: string[]): number {
    if (labels.length < 2) return 0;
    const normalized = labels.map((label) => label.trim());
    const first = normalized[0]!;
    let prefixLen = 0;
    for (let i = 0; i < first.length; i += 1) {
        if (normalized.every((label) => label[i] === first[i])) {
            prefixLen = i + 1;
        } else {
            break;
        }
    }
    const avgLen =
        normalized.reduce((sum, label) => sum + label.length, 0) / normalized.length;
    return avgLen > 0 ? prefixLen / avgLen : 0;
}

function auditQuestion(
    slug: string,
    question: MiniQuizQuestion,
    index: number,
): AuditFinding[] {
    const findings: AuditFinding[] = [];
    const prefix = `miniQuiz[${index}]`;
    const qType = questionType(question);
    const questionText = question.question.trim();
    const explanation = question.explanation?.trim() ?? "";

    if (!questionText) {
        findings.push(
            finding(slug, "error", "mini-quiz-empty-question", `${prefix}.question`, "Question text is empty"),
        );
        return findings;
    }

    if (questionText.includes("  ")) {
        findings.push(
            finding(
                slug,
                "warning",
                "mini-quiz-double-space",
                `${prefix}.question`,
                "Question contains double spaces",
                questionText.slice(0, 120),
            ),
        );
    }

    if (/Right now [A-Z]/.test(questionText)) {
        findings.push(
            finding(
                slug,
                "warning",
                "mini-quiz-right-now-comma",
                `${prefix}.question`,
                '"Right now" before a subject usually needs a comma: "Right now, …"',
                questionText.slice(0, 120),
            ),
        );
    }

    if (/\bregular job\b/i.test(questionText)) {
        findings.push(
            finding(
                slug,
                "warning",
                "mini-quiz-regular-job",
                `${prefix}.question`,
                '"regular job" may confuse learners — try "the job you go to every week"',
                questionText.slice(0, 120),
            ),
        );
    }

    if (
        !/[?.!)"':]$/.test(questionText) &&
        !questionText.toLowerCase().startsWith("fill in the blank") &&
        qType !== "fill-blank"
    ) {
        findings.push(
            finding(
                slug,
                "warning",
                "mini-quiz-missing-end-punctuation",
                `${prefix}.question`,
                "Question stem may be missing ending punctuation",
                questionText.slice(0, 120),
            ),
        );
    }

    const quotedSentences = [...questionText.matchAll(/"([^"]+)"/g)].map((match) => match[1]!);
    for (const sentence of quotedSentences) {
        if (sentence.trim().split(/\s+/).length < 4) continue;
        if (TRUNCATED_END_PATTERN.test(sentence.trim()) && !/[.?!"]$/.test(sentence.trim())) {
            findings.push(
                finding(
                    slug,
                    "error",
                    "mini-quiz-truncated-quote",
                    `${prefix}.question`,
                    "Quoted sentence may be cut off mid-thought",
                    sentence.slice(0, 120),
                ),
            );
        }
        if (/Right now [A-Z]/.test(sentence)) {
            findings.push(
                finding(
                    slug,
                    "warning",
                    "mini-quiz-right-now-comma",
                    `${prefix}.question`,
                    '"Right now" before a subject usually needs a comma: "Right now, …"',
                    sentence.slice(0, 120),
                ),
            );
        }
    }

    if (!explanation) {
        findings.push(
            finding(slug, "error", "mini-quiz-explanation", prefix, "Missing explanation"),
        );
    } else if (explanation.length < 20) {
        findings.push(
            finding(
                slug,
                "warning",
                "mini-quiz-explanation-short",
                `${prefix}.explanation`,
                "Explanation is very short — add one clear reason for learners",
                explanation,
            ),
        );
    }

    if (/fill in the blank/i.test(questionText) && qType !== "fill-blank") {
        findings.push(
            finding(
                slug,
                "error",
                "mini-quiz-fill-blank-type",
                prefix,
                'Question says "Fill in the blank" but type is not "fill-blank"',
                questionText.slice(0, 120),
            ),
        );
    }

    if (qType === "fill-blank") {
        if (!/_{2,}/.test(questionText)) {
            findings.push(
                finding(
                    slug,
                    "warning",
                    "mini-quiz-blank-marker",
                    `${prefix}.question`,
                    "Fill-blank question has no ___ blank marker in the stem",
                    questionText.slice(0, 120),
                ),
            );
        }
        if (!question.correctAnswer?.trim()) {
            findings.push(
                finding(slug, "error", "mini-quiz-missing-answer", prefix, "Fill-blank question missing correctAnswer"),
            );
        }
    }

    if (question.type === "word-scramble") {
        if (!question.words?.length) {
            findings.push(
                finding(slug, "error", "mini-quiz-scramble-words", prefix, "Word-scramble question missing words array"),
            );
        } else {
            const answerWords = normalizeWords(question.correctAnswer);
            const poolWords = normalizeWords(question.words.join(" "));
            const missing = answerWords.filter((word) => !poolWords.includes(word));
            if (missing.length > 0) {
                findings.push(
                    finding(
                        slug,
                        "error",
                        "mini-quiz-scramble-mismatch",
                        prefix,
                        `Word-scramble answer contains words not in the tile list: ${missing.join(", ")}`,
                        question.correctAnswer,
                    ),
                );
            }
        }
        if (
            /^(build the sentence|put the words)/i.test(questionText) &&
            !SCENARIO_HINT_PATTERN.test(questionText)
        ) {
            findings.push(
                finding(
                    slug,
                    "warning",
                    "mini-quiz-scramble-no-context",
                    `${prefix}.question`,
                    "Word-scramble prompt is generic — add a short scenario so learners know why they are building the sentence",
                    questionText,
                ),
            );
        }
    }

    if (qType === "radio" && "options" in question) {
        const options = question.options ?? [];
        if (options.length < 3) {
            findings.push(
                finding(
                    slug,
                    "warning",
                    "mini-quiz-few-options",
                    prefix,
                    `Radio question has only ${options.length} option(s) — 3+ is clearer for discrimination`,
                ),
            );
        }

        const values = options.map((option) => option.value);
        const labels = options.map((option) => option.label.trim());
        if (new Set(values).size !== values.length) {
            findings.push(
                finding(slug, "error", "mini-quiz-duplicate-values", prefix, "Duplicate option values in radio question"),
            );
        }
        if (new Set(labels).size !== labels.length) {
            findings.push(
                finding(slug, "error", "mini-quiz-duplicate-labels", prefix, "Duplicate option labels in radio question"),
            );
        }

        if (!options.some((option) => option.value === question.correctAnswer)) {
            findings.push(
                finding(
                    slug,
                    "error",
                    "mini-quiz-correct-answer",
                    prefix,
                    `correctAnswer "${question.correctAnswer}" does not match any option value`,
                ),
            );
        }

        for (const [optionIndex, option] of options.entries()) {
            if (option.label.includes("  ")) {
                findings.push(
                    finding(
                        slug,
                        "warning",
                        "mini-quiz-double-space",
                        `${prefix}.options[${optionIndex}]`,
                        "Option contains double spaces",
                        option.label.slice(0, 120),
                    ),
                );
            }
            const optionWords = option.label.trim().split(/\s+/).filter(Boolean);
            if (
                optionWords.length >= 4 &&
                TRUNCATED_END_PATTERN.test(option.label.trim()) &&
                !/[.?!"]$/.test(option.label.trim())
            ) {
                findings.push(
                    finding(
                        slug,
                        "error",
                        "mini-quiz-truncated-option",
                        `${prefix}.options[${optionIndex}]`,
                        "Option text may be cut off mid-sentence",
                        option.label.slice(0, 120),
                    ),
                );
            }
        }

        const prefixRatio = longestCommonPrefixRatio(labels);
        const hasTimeCue = labels.some((label) => TIME_CUE_PATTERN.test(label));
        const testsTenseChoice =
            /which (?:answer|sentence|form|word|option)/i.test(questionText) ||
            /fits best|is correct|connects|tells you/i.test(questionText);

        if (testsTenseChoice && prefixRatio >= 0.72 && labels.length >= 3 && !hasTimeCue) {
            findings.push(
                finding(
                    slug,
                    "warning",
                    "mini-quiz-tense-no-time-cue",
                    prefix,
                    "Tense-choice options look nearly identical — add time cues (right now, every week, last year) so learners can compare meaning, not just verb shape",
                    labels.join(" | ").slice(0, 160),
                ),
            );
        }

        const stemWords = questionText.split(/\s+/).length;
        const hasQuotedContext = /"[^"]{8,}"/.test(questionText);
        if (
            stemWords < 6 &&
            !SCENARIO_HINT_PATTERN.test(questionText) &&
            !hasQuotedContext &&
            !/find the error|which sentence|which word|which form|which answer/i.test(questionText)
        ) {
            findings.push(
                finding(
                    slug,
                    "warning",
                    "mini-quiz-vague-stem",
                    `${prefix}.question`,
                    "Question stem is short and may lack scenario context for learners",
                    questionText,
                ),
            );
        }
    }

    return findings;
}

export function runMiniQuizQualityRules(guide: LoadedGuide): AuditFinding[] {
    const { slug, content } = guide;
    const findings: AuditFinding[] = [];

    for (const [index, question] of (content.miniQuiz ?? []).entries()) {
        findings.push(...auditQuestion(slug, question, index));
    }

    return findings;
}

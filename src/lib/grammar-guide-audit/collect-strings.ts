import { parse } from "node-html-parser";
import type { InteractiveGuideContent } from "@/types/activity";

export interface CollectedString {
    path: string;
    value: string;
    plainText: string;
    isHtml: boolean;
    sectionId?: string;
    sectionTitle?: string;
}

function stripHtml(html: string): string {
    return parse(html).text.replace(/\s+/g, " ").trim();
}

function pushString(
    out: CollectedString[],
    path: string,
    value: string,
    isHtml: boolean,
    sectionId?: string,
    sectionTitle?: string,
) {
    if (!value || !value.trim()) return;
    out.push({
        path,
        value,
        plainText: isHtml ? stripHtml(value) : value.trim(),
        isHtml,
        sectionId,
        sectionTitle,
    });
}

export function collectGuideStrings(content: InteractiveGuideContent): CollectedString[] {
    const out: CollectedString[] = [];

    for (const [sectionIndex, section] of (content.sections ?? []).entries()) {
        const sectionPrefix = `sections[${sectionIndex}]`;
        const sectionId = section.id;
        const sectionTitle = section.title;

        pushString(out, `${sectionPrefix}.title`, section.title, false, sectionId, sectionTitle);

        if (section.explanation) {
            pushString(
                out,
                `${sectionPrefix}.explanation`,
                section.explanation,
                true,
                sectionId,
                sectionTitle,
            );
        }

        if (section.postExplanation) {
            pushString(
                out,
                `${sectionPrefix}.postExplanation`,
                section.postExplanation,
                true,
                sectionId,
                sectionTitle,
            );
        }

        if (section.tipBox) {
            pushString(
                out,
                `${sectionPrefix}.tipBox.title`,
                section.tipBox.title,
                false,
                sectionId,
                sectionTitle,
            );
            pushString(
                out,
                `${sectionPrefix}.tipBox.content`,
                section.tipBox.content,
                true,
                sectionId,
                sectionTitle,
            );
        }

        for (const [exerciseIndex, exercise] of (section.exercises ?? []).entries()) {
            const exercisePrefix = `${sectionPrefix}.exercises[${exerciseIndex}]`;
            pushString(out, `${exercisePrefix}.title`, exercise.title, false, sectionId, sectionTitle);
            if (exercise.instructions) {
                pushString(
                    out,
                    `${exercisePrefix}.instructions`,
                    exercise.instructions,
                    false,
                    sectionId,
                    sectionTitle,
                );
            }

            for (const [itemIndex, item] of exercise.items.entries()) {
                const itemPrefix = `${exercisePrefix}.items[${itemIndex}]`;
                pushString(out, `${itemPrefix}.label`, item.label, true, sectionId, sectionTitle);

                if ("options" in item && Array.isArray(item.options)) {
                    for (const [optionIndex, option] of item.options.entries()) {
                        const label =
                            typeof option === "string" ? option : option.label;
                        pushString(
                            out,
                            `${itemPrefix}.options[${optionIndex}]`,
                            label,
                            true,
                            sectionId,
                            sectionTitle,
                        );
                    }
                }

                if ("correctAnswer" in item && typeof item.correctAnswer === "string") {
                    pushString(
                        out,
                        `${itemPrefix}.correctAnswer`,
                        item.correctAnswer,
                        false,
                        sectionId,
                        sectionTitle,
                    );
                }
            }
        }
    }

    for (const [questionIndex, question] of (content.miniQuiz ?? []).entries()) {
        const prefix = `miniQuiz[${questionIndex}]`;
        pushString(out, `${prefix}.question`, question.question, false);
        if (question.explanation) {
            pushString(out, `${prefix}.explanation`, question.explanation, false);
        }
        if ("options" in question && Array.isArray(question.options)) {
            for (const [optionIndex, option] of question.options.entries()) {
                pushString(out, `${prefix}.options[${optionIndex}]`, option.label, false);
            }
        }
    }

    return out;
}

export function getAllPlainText(content: InteractiveGuideContent): string {
    return collectGuideStrings(content)
        .map((entry) => entry.plainText)
        .join("\n");
}

export function countWords(text: string): number {
    return text.split(/\s+/).filter(Boolean).length;
}

export { stripHtml };

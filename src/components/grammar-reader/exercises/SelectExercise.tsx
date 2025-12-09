import type { ExerciseItem } from "@/types/activity";
import { sanitizeHtml } from "@/utils/sanitize";
import { emphasizeVerb } from "@/utils/emphasizeVerb";

interface SelectExerciseProps {
    item: Extract<ExerciseItem, { type: "select" }>;
    userAnswer: string;
    isCorrect: boolean;
    isIncorrect: boolean;
    submitted: boolean;
    onChange: (value: string) => void;
}

export function SelectExercise({
    item,
    userAnswer,
    isCorrect,
    isIncorrect,
    submitted,
    onChange,
}: SelectExerciseProps) {
    return (
        <div className="select-exercise">
            <label className="block mb-2">
                <span className="text-sm text-text font-medium" dangerouslySetInnerHTML={{ __html: sanitizeHtml(emphasizeVerb(item.label)) }} />
            </label>
            <select
                value={userAnswer}
                onChange={(e) => onChange(e.target.value)}
                disabled={submitted}
                className={`w-full px-4 py-3 border-2 rounded-lg transition-all ${submitted
                        ? isCorrect
                            ? "border-success bg-success/5"
                            : "border-error bg-error/5"
                        : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                    } disabled:cursor-not-allowed`}
            >
                {item.options.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            {submitted && isCorrect && (
                <p className="text-xs text-success mt-1 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                    Correct!
                </p>
            )}
            {submitted && isIncorrect && (
                <p className="text-xs text-error mt-1">
                    Incorrect. Expected: <strong>{item.expectedAnswer}</strong>
                </p>
            )}
        </div>
    );
}

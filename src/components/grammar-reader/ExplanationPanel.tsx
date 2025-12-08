import type { InteractiveGuideSection } from "@/types/activity";
import { Button } from "@/components/ui/Button";
import { sanitizeHtml } from "@/utils/sanitize";
import { FormulaBox } from "./FormulaBox";
import { ExampleBox } from "./ExampleBox";
import { UsageMeaningsList } from "./UsageMeaningsList";
import { ComparisonTable } from "./ComparisonTable";
import { TimeExpressionsList } from "./TimeExpressionsList";
import { VerbTableDisplay } from "./VerbTableDisplay";
import { TipBox } from "./TipBox";
import { TimelineVisual } from "./TimelineVisual";

interface ExplanationPanelProps {
    section: InteractiveGuideSection;
    onUnlockExercises: () => void;
    practiceUnlocked: boolean;
    hasExercises: boolean;
    withRightBorder?: boolean;
    className?: string;
}

export function ExplanationPanel({
    section,
    onUnlockExercises,
    practiceUnlocked,
    hasExercises,
    withRightBorder = true,
    className = "",
}: ExplanationPanelProps) {
    return (
        <div
            className={`explanation-panel bg-white p-8 overflow-y-auto max-h-[600px] ${withRightBorder ? "border-r border-border" : "border border-border"} ${className}`}
        >
            <div className="prose prose-lg max-w-none">
                {/* Main Explanation */}
                {section.explanation && (
                    <div
                        className="explanation-content mb-6"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(section.explanation) }}
                    />
                )}

                {/* Formula */}
                {section.formula && section.formula.length > 0 && (
                    <FormulaBox parts={section.formula} />
                )}

                {/* Usage Meanings (for meaning sections) */}
                {section.usageMeanings && section.usageMeanings.length > 0 && (
                    <UsageMeaningsList meanings={section.usageMeanings} />
                )}

                {/* Examples */}
                {section.examples && section.examples.length > 0 && (
                    <ExampleBox examples={section.examples} />
                )}

                {/* Comparison Table */}
                {section.comparison && <ComparisonTable comparison={section.comparison} />}

                {/* Time Expressions */}
                {section.timeExpressions && section.timeExpressions.length > 0 && (
                    <TimeExpressionsList expressions={section.timeExpressions} />
                )}

                {/* Verb Table */}
                {section.verbTable && <VerbTableDisplay table={section.verbTable} />}

                {/* Timeline Visual */}
                {section.timeline && <TimelineVisual timeline={section.timeline} />}

                {/* Tip Box */}
                {section.tipBox && <TipBox tip={section.tipBox} />}
            </div>

            {/* Reading completion gate for practice */}
            {hasExercises && (
                <div className="mt-8 pt-4 border-t border-border">
                    <p className="text-sm text-text-muted mb-3">
                        Finished reading this section? Unlock the practice exercises on the right. They will appear alongside the text so you can reference both.
                    </p>
                    <Button
                        variant={practiceUnlocked ? "secondary" : "primary"}
                        onClick={onUnlockExercises}
                        className="w-full"
                    >
                        {practiceUnlocked ? "Exercises unlocked" : "Completed reading – show exercises"}
                    </Button>
                </div>
            )}
        </div>
    );
}

import type { UsageMeaning } from "@/types/activity";
import { sanitizeHtml } from "@/utils/sanitize";

interface UsageMeaningsListProps {
    meanings: UsageMeaning[];
}

export function UsageMeaningsList({ meanings }: UsageMeaningsListProps) {
    return (
        <div className="usage-meanings-list space-y-4 my-6">
            {meanings.map((meaning, index) => (
                <div
                    key={index}
                    className="usage-meaning bg-bg-light border border-primary/20 rounded-lg p-4"
                >
                    <h4 className="text-lg font-bold text-primary mb-2">
                        {meaning.title}
                    </h4>
                    <p className="text-base text-text mb-3">{meaning.description}</p>

                    <div className="space-y-2">
                        {meaning.examples.map((example, exIdx) => (
                            <div key={exIdx} className="bg-white p-3 rounded border-l-4 border-primary">
                                <p
                                    className="text-base text-text font-medium"
                                dangerouslySetInnerHTML={{ __html: sanitizeHtml(example.sentence) }}
                                />
                                {example.explanation && (
                                    <p className="text-sm text-text-muted italic mt-1">
                                        💡 {example.explanation}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

import type { ComparisonRow } from "@/types/activity";
import { sanitizeHtml } from "@/utils/sanitize";

interface ComparisonTableProps {
    comparison: {
        title: string;
        leftLabel: string;
        rightLabel: string;
        rows: ComparisonRow[];
        showLabelColumn?: boolean;
    };
}

function ComparisonCell({ html }: { html: string }) {
    return (
        <span
            className="break-words [overflow-wrap:anywhere]"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
        />
    );
}

function ComparisonMobileCards({
    comparison,
    showLabel,
}: {
    comparison: ComparisonTableProps["comparison"];
    showLabel: boolean;
}) {
    return (
        <div className="comparison-table-cards space-y-3 md:hidden">
            {comparison.rows.map((row, index) => (
                <div
                    key={index}
                    className="rounded-xl border border-border bg-[var(--color-surface-elevated)] shadow-sm overflow-hidden"
                >
                    {showLabel && (
                        <div className="border-b border-border bg-bg-light px-3 py-2">
                            <p className="text-sm font-semibold text-text">{row.label}</p>
                        </div>
                    )}
                    <div className="divide-y divide-border">
                        <div className="bg-warning/10 px-3 py-3">
                            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-warning">
                                {comparison.leftLabel}
                            </p>
                            <div className="text-sm text-text">
                                <ComparisonCell html={row.left} />
                            </div>
                        </div>
                        <div className="bg-success/10 px-3 py-3">
                            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-success">
                                {comparison.rightLabel}
                            </p>
                            <div className="text-sm text-text">
                                <ComparisonCell html={row.right} />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function ComparisonTable({ comparison }: ComparisonTableProps) {
    const showLabel = comparison.showLabelColumn !== false;

    return (
        <div className="comparison-table my-6">
            <h4 className="text-base font-bold text-text mb-4">{comparison.title}</h4>

            <ComparisonMobileCards comparison={comparison} showLabel={showLabel} />

            {/* Table view — tablet/desktop */}
            <div className="relative hidden overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 md:block">
                <table className="w-full min-w-0 border-collapse rounded-lg bg-[var(--color-surface-elevated)] overflow-hidden shadow-sm table-fixed">
                    <thead>
                        <tr>
                            {showLabel && (
                                <th className="bg-bg-light border border-border p-3 text-left text-sm font-semibold text-text w-[22%]">
                                    Category
                                </th>
                            )}
                            <th className="bg-warning/10 border border-border p-3 text-left text-sm font-semibold text-warning min-w-0">
                                {comparison.leftLabel}
                            </th>
                            <th className="bg-success/10 border border-border p-3 text-left text-sm font-semibold text-success min-w-0">
                                {comparison.rightLabel}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {comparison.rows.map((row, index) => (
                            <tr key={index} className="hover:bg-bg-light/50 transition-colors">
                                {showLabel && (
                                    <td className="border border-border p-3 text-sm font-medium text-text align-top">
                                        {row.label}
                                    </td>
                                )}
                                <td className="border border-border p-3 text-sm text-text min-w-0 align-top break-words [overflow-wrap:anywhere]">
                                    <ComparisonCell html={row.left} />
                                </td>
                                <td className="border border-border p-3 text-sm text-text min-w-0 align-top break-words [overflow-wrap:anywhere]">
                                    <ComparisonCell html={row.right} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

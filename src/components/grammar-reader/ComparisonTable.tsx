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

export function ComparisonTable({ comparison }: ComparisonTableProps) {
    const showLabel = comparison.showLabelColumn !== false;

    return (
        <div className="comparison-table my-6">
            <h4 className="text-base font-bold text-text mb-4">{comparison.title}</h4>

            {/* Table View - all screen sizes */}
            <div className="relative overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <table className="w-full border-collapse rounded-lg bg-[var(--color-surface-elevated)] overflow-hidden shadow-sm">
                    <thead>
                        <tr>
                            {showLabel && (
                                <th className="bg-bg-light border border-border p-2 md:p-3 text-left text-sm font-semibold text-text min-w-[100px] md:min-w-[120px]">
                                    Category
                                </th>
                            )}
                            <th className="bg-warning/10 border border-border p-2 md:p-3 text-left text-sm font-semibold text-warning w-0 whitespace-nowrap">
                                {comparison.leftLabel}
                            </th>
                            <th className="bg-success/10 border border-border p-2 md:p-3 text-left text-sm font-semibold text-success min-w-0">
                                {comparison.rightLabel}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {comparison.rows.map((row, index) => (
                            <tr key={index} className="hover:bg-bg-light/50 transition-colors">
                                {showLabel && (
                                    <td className="border border-border p-2 md:p-3 text-sm font-medium text-text">
                                        {row.label}
                                    </td>
                                )}
                                <td className="border border-border p-2 md:p-3 text-sm text-text w-0 whitespace-nowrap">
                                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(row.left) }} />
                                </td>
                                <td className="border border-border p-2 md:p-3 text-sm text-text min-w-0">
                                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(row.right) }} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

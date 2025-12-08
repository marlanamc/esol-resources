import type { ComparisonRow } from "@/types/activity";

interface ComparisonTableProps {
    comparison: {
        title: string;
        leftLabel: string;
        rightLabel: string;
        rows: ComparisonRow[];
    };
}

export function ComparisonTable({ comparison }: ComparisonTableProps) {
    return (
        <div className="comparison-table my-6">
            <h4 className="text-base font-bold text-text mb-4">{comparison.title}</h4>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                    <thead>
                        <tr>
                            <th className="bg-bg-light border border-border p-3 text-left text-sm font-semibold text-text">
                                Category
                            </th>
                            <th className="bg-warning/10 border border-border p-3 text-left text-sm font-semibold text-warning">
                                {comparison.leftLabel}
                            </th>
                            <th className="bg-success/10 border border-border p-3 text-left text-sm font-semibold text-success">
                                {comparison.rightLabel}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {comparison.rows.map((row, index) => (
                            <tr key={index} className="hover:bg-bg-light/50 transition-colors">
                                <td className="border border-border p-3 text-sm font-medium text-text">
                                    {row.label}
                                </td>
                                <td className="border border-border p-3 text-sm text-text">
                                    {row.left}
                                </td>
                                <td className="border border-border p-3 text-sm text-text">
                                    {row.right}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

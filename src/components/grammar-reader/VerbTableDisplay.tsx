import type { VerbTable } from "@/types/activity";
import { sanitizeHtml } from "@/utils/sanitize";

interface VerbTableDisplayProps {
    table: VerbTable;
}

function VerbTableCell({ html }: { html: string }) {
    return (
        <span
            className="break-words [overflow-wrap:anywhere]"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
        />
    );
}

function VerbTableMobileCards({ table }: { table: VerbTable }) {
    return (
        <div className="verb-table-cards space-y-3 md:hidden">
            {table.rows.map((row, rowIndex) => (
                <div
                    key={rowIndex}
                    className="rounded-xl border border-border bg-[var(--color-surface-elevated)] shadow-sm overflow-hidden divide-y divide-border"
                >
                    {row.map((cell, cellIndex) => (
                        <div key={cellIndex} className="px-3 py-3">
                            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
                                {table.headers[cellIndex] ?? `Column ${cellIndex + 1}`}
                            </p>
                            <div className="text-sm text-text">
                                <VerbTableCell html={cell} />
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export function VerbTableDisplay({ table }: VerbTableDisplayProps) {
    return (
        <div className="verb-table-display my-6">
            <h4 className="text-base font-bold text-text mb-4">{table.title}</h4>

            <VerbTableMobileCards table={table} />

            <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-0 border-collapse rounded-lg bg-[var(--color-surface-elevated)] overflow-hidden shadow-sm table-fixed">
                    <thead>
                        <tr>
                            {table.headers.map((header, index) => (
                                <th
                                    key={index}
                                    className="bg-primary text-white border border-primary/20 p-3 text-left text-sm font-semibold min-w-0"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {table.rows.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="hover:bg-bg-light/50 transition-colors"
                            >
                                {row.map((cell, cellIndex) => (
                                    <td
                                        key={cellIndex}
                                        className="border border-border p-3 text-sm text-text min-w-0 align-top break-words [overflow-wrap:anywhere]"
                                    >
                                        <VerbTableCell html={cell} />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

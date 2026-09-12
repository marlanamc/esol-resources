import { getHelpfulLinks } from "@/lib/helpful-links";
import { HelpfulLinkRow } from "@/components/dashboard/HelpfulLinkRow";

interface HelpfulLinksCardProps {
    /** `plain` matches the mobile Explore heading; `contained` is a sidebar panel */
    variant?: "plain" | "contained";
}

export function HelpfulLinksCard({ variant = "contained" }: HelpfulLinksCardProps) {
    const links = getHelpfulLinks();
    if (links.length === 0) return null;

    const list = (
        <div className="divide-y divide-[var(--border-subtle)]">
            {links.map((link) => (
                <HelpfulLinkRow key={link.id} link={link} />
            ))}
        </div>
    );

    if (variant === "plain") {
        return (
            <section aria-label="Class resources">
                <h2 className="mb-1 font-display text-lg font-bold leading-tight text-text">
                    Class resources
                </h2>
                {list}
            </section>
        );
    }

    return (
        <section aria-label="Class resources">
            <div
                className="dashboard-panel rounded-2xl px-4 py-3"
                style={{ borderColor: "var(--dashboard-border)" }}
            >
                <h2 className="font-display text-base font-bold text-text">Class resources</h2>
                <div className="mt-1">{list}</div>
            </div>
        </section>
    );
}

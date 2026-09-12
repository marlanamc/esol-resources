import { ClipboardList, ExternalLink, GraduationCap, Megaphone } from "lucide-react";
import {
    getHelpfulLinks,
    HELPFUL_LINK_TONE_KEYS,
    type HelpfulLink,
    type HelpfulLinkId,
} from "@/lib/helpful-links";
import { getLearnerCategoryTone } from "@/lib/learner/theme";

const LINK_ICONS: Record<HelpfulLinkId, typeof GraduationCap> = {
    "google-classroom": GraduationCap,
    "absence-form": ClipboardList,
    "advisor-bulletin-board": Megaphone,
};

function HelpfulLinkRow({ link }: { link: HelpfulLink }) {
    const Icon = LINK_ICONS[link.id];
    const tone = getLearnerCategoryTone(HELPFUL_LINK_TONE_KEYS[link.id]);

    return (
        <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-xl border px-3.5 py-3 transition-[box-shadow,transform,border-color] duration-200 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
            style={{
                borderColor: tone.border,
                background: `linear-gradient(135deg, ${tone.surface} 0%, color-mix(in srgb, ${tone.surface} 72%, var(--dashboard-surface-end)) 100%)`,
                boxShadow: `inset 0 1px 0 color-mix(in srgb, white 40%, transparent)`,
            }}
        >
            <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                style={{
                    color: tone.accent,
                    background: `color-mix(in srgb, ${tone.accent} 18%, var(--dashboard-surface-start))`,
                    boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${tone.border} 70%, transparent)`,
                }}
            >
                <Icon className="h-5 w-5" aria-hidden />
            </div>
            <span
                className="min-w-0 flex-1 text-sm font-bold"
                style={{ color: tone.accentStrong }}
            >
                {link.label}
            </span>
            <ExternalLink
                className="h-4 w-4 shrink-0 transition-colors"
                style={{ color: tone.accent }}
                aria-hidden
            />
        </a>
    );
}

export function HelpfulLinksCard() {
    const links = getHelpfulLinks();
    if (links.length === 0) return null;

    return (
        <section aria-label="Class resources">
            <div
                className="dashboard-panel paper-texture rounded-2xl p-4"
                style={{ borderColor: "var(--dashboard-border)" }}
            >
                <div className="mb-3 flex items-center gap-2.5">
                    <div
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary"
                    >
                        <GraduationCap className="h-4.5 w-4.5" aria-hidden />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary/70 leading-none">
                            Quick links
                        </p>
                        <h2 className="mt-0.5 font-display text-base font-bold text-text">Class resources</h2>
                    </div>
                </div>
                <div className="space-y-2.5">
                    {links.map((link) => (
                        <HelpfulLinkRow key={link.id} link={link} />
                    ))}
                </div>
            </div>
        </section>
    );
}

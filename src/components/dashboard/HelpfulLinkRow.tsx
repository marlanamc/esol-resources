"use client";

import { ClipboardList, ExternalLink, GraduationCap, Megaphone } from "lucide-react";
import { HELPFUL_LINK_TONE_KEYS, type HelpfulLink, type HelpfulLinkId } from "@/lib/helpful-links";
import { getLearnerCategoryTone } from "@/lib/learner/theme";
import { handleExternalLinkClick } from "@/lib/shared/open-external-link";

const LINK_ICONS: Record<HelpfulLinkId, typeof GraduationCap> = {
    "google-classroom": GraduationCap,
    "absence-form": ClipboardList,
    "advisor-bulletin-board": Megaphone,
};

export function HelpfulLinkRow({ link }: { link: HelpfulLink }) {
    const Icon = LINK_ICONS[link.id];
    const tone = getLearnerCategoryTone(HELPFUL_LINK_TONE_KEYS[link.id]);

    return (
        <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => handleExternalLinkClick(event, link.href)}
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

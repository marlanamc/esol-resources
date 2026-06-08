import { ArrowRight } from "lucide-react";

const CTA_BASE_CLASS =
    "inline-flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-extrabold text-white transition-colors";

const CTA_VARIANT_CLASS = {
    primary:
        "bg-primary shadow-[0_4px_12px_rgba(176,87,64,0.28)] group-hover:bg-[var(--primary-color-dark)] group-hover:text-white",
    vocabulary:
        "bg-[var(--tone-vocabulary-accent)] shadow-[0_4px_12px_rgba(38,138,130,0.28)] group-hover:bg-[var(--tone-vocabulary-accent-strong)] group-hover:text-white",
} as const;

export type DashboardHeroCtaVariant = keyof typeof CTA_VARIANT_CLASS;

export function DashboardHeroCta({
    label,
    iconSize = 16,
    variant = "primary",
}: {
    label: string;
    iconSize?: number;
    variant?: DashboardHeroCtaVariant;
}) {
    return (
        <span className={`${CTA_BASE_CLASS} ${CTA_VARIANT_CLASS[variant]}`} aria-hidden>
            {label}
            <ArrowRight size={iconSize} />
        </span>
    );
}

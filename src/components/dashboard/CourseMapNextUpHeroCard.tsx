import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { CourseMapUnitIcon } from "@/components/dashboard/CourseMapUnitIcon";
import { getCourseMapUnitTone } from "@/lib/course-map-unit-colors";

interface FooterLink {
    href: string;
    label: string;
}

interface Props {
    href: string;
    title: string;
    currentLabel: "Start here" | "Next up";
    unitNumber: number;
    estimatedMinutes: number;
    icon: string;
    cta?: ReactNode;
    footerLink?: FooterLink;
}

export function CourseMapNextUpHeroCard({
    href,
    title,
    currentLabel,
    unitNumber,
    estimatedMinutes,
    icon,
    cta,
    footerLink,
}: Props) {
    const tone = getCourseMapUnitTone(unitNumber);

    return (
        <div
            className="course-map-hero-card rounded-[26px] border p-5 shadow-[0_10px_32px_rgba(40,31,23,0.07)] sm:p-7"
            style={{
                background: `linear-gradient(135deg, ${tone.surface} 0%, color-mix(in srgb, ${tone.chipBg} 58%, var(--dashboard-surface-start)) 56%, var(--dashboard-surface-start) 100%)`,
                borderColor: `color-mix(in srgb, ${tone.accent} 18%, var(--dashboard-border))`,
                color: "var(--text)",
            }}
        >
            <p
                className="mb-5 text-[11px] font-extrabold uppercase tracking-[0.16em]"
                style={{ color: tone.button }}
            >
                Your Next Step
            </p>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                <span
                    className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] text-3xl shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]"
                    style={{
                        background: `color-mix(in srgb, ${tone.chipBg} 76%, #ffffff)`,
                        boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${tone.accent} 14%, transparent)`,
                    }}
                    aria-hidden
                >
                    {icon}
                    <span
                        className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border bg-[#fffdfa] shadow-sm"
                        style={{ color: tone.accent }}
                    >
                        <CourseMapUnitIcon unitNumber={unitNumber} size={13} strokeWidth={2.5} />
                    </span>
                </span>
                    <div className="min-w-0 flex-1">
                    <span
                        className="inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide"
                        style={{
                            background: `color-mix(in srgb, ${tone.chipBg} 78%, #ffffff)`,
                            borderColor: `color-mix(in srgb, ${tone.accent} 18%, transparent)`,
                            color: tone.button,
                        }}
                    >
                        {tone.month} · {currentLabel}
                    </span>
                    <h2 className="mt-2 font-display text-2xl font-bold leading-tight text-text sm:text-[28px]">
                        {title}
                    </h2>
                    <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-text-muted">
                        <span>Lesson</span>
                        <span aria-hidden>·</span>
                        <Clock size={14} aria-hidden />
                        {estimatedMinutes} min
                    </p>
                    </div>
                </div>

                {cta ?? (
                    <Link
                        href={href}
                        className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl px-7 text-base font-extrabold text-white shadow-[0_8px_20px_rgba(40,31,23,0.12)] transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:w-auto"
                        style={{
                            background: `linear-gradient(180deg, color-mix(in srgb, ${tone.button} 88%, #ffffff) 0%, ${tone.button} 100%)`,
                            "--tw-ring-color": tone.accent,
                        } as CSSProperties}
                    >
                        <span>Start</span>
                        <ArrowRight size={21} aria-hidden />
                    </Link>
                )}
            </div>

            {footerLink ? (
                <div className="mt-3 flex justify-end">
                    <Link
                        href={footerLink.href}
                        className="rounded px-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        style={{ color: tone.button }}
                    >
                        {footerLink.label}
                    </Link>
                </div>
            ) : null}
        </div>
    );
}

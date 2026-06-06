"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Settings, X } from "lucide-react";
import type { GrammarHospitalFocus, GrammarHospitalTier } from "@/types/activity";

export interface GrammarHospitalSettings {
    tier: GrammarHospitalTier;
    complexity: number; // 1..5
    focuses: GrammarHospitalFocus[]; // empty = all focuses in tier
}

export const DEFAULT_GH_SETTINGS: GrammarHospitalSettings = {
    tier: "beginner",
    complexity: 2,
    focuses: [],
};

export function normalizeGHSettings(raw: unknown): GrammarHospitalSettings {
    if (!raw || typeof raw !== "object") return { ...DEFAULT_GH_SETTINGS };
    const r = raw as Record<string, unknown>;
    const tier: GrammarHospitalTier =
        r.tier === "intermediate" || r.tier === "advanced" ? r.tier : "beginner";
    const complexity = typeof r.complexity === "number" && r.complexity >= 1 && r.complexity <= 5
        ? Math.round(r.complexity)
        : 2;
    const focuses = Array.isArray(r.focuses)
        ? (r.focuses.filter((f) => typeof f === "string") as GrammarHospitalFocus[])
        : [];
    return { tier, complexity, focuses };
}

const TIER_INFO: Record<GrammarHospitalTier, { label: string; blurb: string }> = {
    beginner: {
        label: "Beginner",
        blurb: "Simple present helpers: do · does · be",
    },
    intermediate: {
        label: "Intermediate",
        blurb: "Past simple, present perfect, agreement",
    },
    advanced: {
        label: "Advanced",
        blurb: "Modals, embedded questions, tag questions",
    },
};

const FOCUS_INFO: Record<GrammarHospitalFocus, { label: string; tier: GrammarHospitalTier }> = {
    "do-does": { label: "Do / Does", tier: "beginner" },
    "be-vs-do": { label: "BE vs DO", tier: "beginner" },
    "past-simple": { label: "Past simple (did / was / were)", tier: "intermediate" },
    "present-perfect": { label: "Present perfect (have / has)", tier: "intermediate" },
    "subject-verb-agreement": { label: "Subject-verb agreement", tier: "intermediate" },
    modals: { label: "Modals (can / should / would)", tier: "advanced" },
    "embedded-question": { label: "Embedded questions", tier: "advanced" },
    "question-tag": { label: "Question tags", tier: "advanced" },
    "past-perfect": { label: "Past perfect (had vs has / have)", tier: "advanced" },
    "future-simple": { label: "Future (will / won't)", tier: "advanced" },
    "future-perfect": { label: "Future perfect (will have)", tier: "advanced" },
    "present-perfect-continuous": { label: "Present perfect continuous (have been -ing)", tier: "advanced" },
    "past-perfect-continuous": { label: "Past perfect continuous (had been -ing)", tier: "advanced" },
    "mixed-helper": { label: "Mixed-helper traps", tier: "advanced" },
};

const COMPLEXITY_LABELS = ["", "Gentle", "Easy", "Standard", "Tricky", "Challenging"];

interface Props {
    value: GrammarHospitalSettings;
    onChange: (next: GrammarHospitalSettings) => void;
    /** Counts of cases per tier and per focus in the current deck — used for badge text. */
    tierCounts: Record<GrammarHospitalTier, number>;
    focusCounts: Record<GrammarHospitalFocus, number>;
}

export function SettingsButton({ value, onChange, tierCounts, focusCounts }: Props) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!open) return;
        const onClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onClick);
        document.addEventListener("keydown", onKey);
        // Lock body scroll on mobile when the sheet is open.
        const prevOverflow = document.body.style.overflow;
        if (window.matchMedia("(max-width: 767px)").matches) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("mousedown", onClick);
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [open]);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-label="Difficulty settings"
                title="Difficulty settings"
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/80 dark:bg-[#2a1f1a]/80 border border-gray-200 dark:border-white/15 text-gray-500 dark:text-gray-300 hover:text-primary hover:border-primary/50 backdrop-blur-sm shadow-sm transition-colors"
            >
                <Settings size={15} />
            </button>

            {open && (
                <>
                    {/* Mobile backdrop */}
                    <button
                        type="button"
                        aria-label="Close settings"
                        onClick={() => setOpen(false)}
                        className="md:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
                    />
                    <PanelBody
                        value={value}
                        onChange={onChange}
                        tierCounts={tierCounts}
                        focusCounts={focusCounts}
                        onClose={() => setOpen(false)}
                    />
                </>
            )}
        </div>
    );
}

function PanelBody({
    value,
    onChange,
    tierCounts,
    focusCounts,
    onClose,
}: Props & { onClose: () => void }) {
    return (
        <div
            role="dialog"
            aria-label="Grammar Hospital difficulty settings"
            className="
                fixed inset-x-0 bottom-0 z-40 max-h-[88vh] overflow-y-auto rounded-t-2xl
                md:absolute md:inset-x-auto md:bottom-auto md:right-0 md:top-full md:mt-2 md:w-[22rem] md:max-h-none md:rounded-2xl
                border border-gray-200 dark:border-white/10 bg-white dark:bg-[#2a1f1a]
                shadow-[0_12px_40px_rgba(74,47,26,0.18)] p-5
            "
        >
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-[0.6rem] uppercase tracking-[0.16em] font-bold text-primary-dark dark:text-primary-light leading-none">
                        Difficulty
                    </p>
                    <h2 className="font-display text-lg font-bold text-gray-900 dark:text-gray-50 mt-1">
                        Adjust the patients
                    </h2>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                    <X size={16} />
                </button>
            </div>

            <SettingsForm
                value={value}
                onChange={onChange}
                tierCounts={tierCounts}
                focusCounts={focusCounts}
            />

            <p className="mt-4 text-[0.7rem] italic text-gray-400 dark:text-gray-500 leading-relaxed">
                Changes apply on the next patient. Your settings are saved to your account.
            </p>
        </div>
    );
}

/**
 * The actual tier / complexity / focus form, without any popover chrome.
 * Used both by the gear popover (above) and by the intro screen so the
 * controls and styling stay identical.
 */
export function SettingsForm({
    value,
    onChange,
    tierCounts,
    focusCounts,
    tierTileSize = "compact",
}: Props & { tierTileSize?: "compact" | "spacious" }) {
    const focusesInTier = useMemo(
        () =>
            (Object.entries(FOCUS_INFO) as Array<[GrammarHospitalFocus, (typeof FOCUS_INFO)[GrammarHospitalFocus]]>)
                .filter(([, info]) => info.tier === value.tier),
        [value.tier]
    );

    const setTier = (tier: GrammarHospitalTier) => {
        onChange({ ...value, tier, focuses: [] });
    };
    const setComplexity = (c: number) => onChange({ ...value, complexity: c });
    const toggleFocus = (f: GrammarHospitalFocus) => {
        const next = value.focuses.includes(f)
            ? value.focuses.filter((x) => x !== f)
            : [...value.focuses, f];
        onChange({ ...value, focuses: next });
    };

    const tilePad = tierTileSize === "spacious" ? "px-5 py-4 min-h-[72px]" : "px-4 py-3 min-h-[60px]";
    const tileLabelClass = tierTileSize === "spacious"
        ? "font-display font-bold text-lg text-gray-900 dark:text-gray-50 leading-tight"
        : "font-display font-bold text-gray-900 dark:text-gray-50 leading-tight";

    return (
        <div>
            {/* Tier picker */}
            <fieldset className="mb-5">
                <legend className="text-[0.6rem] uppercase tracking-[0.14em] font-bold text-gray-500 dark:text-gray-400 mb-2">
                    Level
                </legend>
                <div className="space-y-2">
                    {(Object.keys(TIER_INFO) as GrammarHospitalTier[]).map((tier) => {
                        const active = value.tier === tier;
                        const info = TIER_INFO[tier];
                        const count = tierCounts[tier] ?? 0;
                        return (
                            <button
                                key={tier}
                                type="button"
                                onClick={() => setTier(tier)}
                                aria-pressed={active}
                                className={
                                    active
                                        ? `w-full text-left rounded-xl border-2 border-primary bg-primary/8 ${tilePad} transition-all`
                                        : `w-full text-left rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#332419] ${tilePad} hover:border-primary/40 hover:bg-amber-50/40 dark:hover:bg-[#3a2820] transition-all`
                                }
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className={tileLabelClass}>{info.label}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                                            {info.blurb}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#fbf5ec] dark:bg-[#3a2820] border border-gray-200 dark:border-white/10 text-[0.65rem] font-bold text-gray-600 dark:text-gray-300 tabular-nums">
                                            {count}
                                        </span>
                                        {active && (
                                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white">
                                                <Check size={12} />
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </fieldset>

            {/* Complexity slider */}
            <fieldset className="mb-5">
                <legend className="flex items-center justify-between w-full text-[0.6rem] uppercase tracking-[0.14em] font-bold text-gray-500 dark:text-gray-400 mb-2">
                    <span>Complexity</span>
                    <span className="text-gray-700 dark:text-gray-200 font-bold">
                        {COMPLEXITY_LABELS[value.complexity] ?? ""}
                    </span>
                </legend>
                <input
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={value.complexity}
                    onChange={(e) => setComplexity(Number(e.target.value))}
                    aria-label="Complexity"
                    className="w-full accent-primary h-2 cursor-pointer"
                />
                <div className="flex justify-between text-[0.65rem] text-gray-400 dark:text-gray-500 mt-1 px-0.5">
                    <span>Gentle</span>
                    <span>Standard</span>
                    <span>Challenging</span>
                </div>
            </fieldset>

            {/* Focus filter — collapsed by default */}
            <details className="group">
                <summary className="cursor-pointer list-none flex items-center justify-between text-[0.65rem] uppercase tracking-[0.14em] font-bold text-gray-500 dark:text-gray-400 py-1 hover:text-primary">
                    <span>Focus topics</span>
                    <span className="text-[0.7rem] text-gray-400 normal-case tracking-normal font-medium">
                        {value.focuses.length === 0 ? "All" : `${value.focuses.length} selected`}
                    </span>
                </summary>
                <div className="mt-2 space-y-1.5">
                    {focusesInTier.length === 0 && (
                        <p className="text-xs italic text-gray-400">No subtopics in this tier.</p>
                    )}
                    {focusesInTier.map(([focus, info]) => {
                        const checked = value.focuses.includes(focus);
                        const count = focusCounts[focus] ?? 0;
                        return (
                            <label
                                key={focus}
                                className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-amber-50/60 dark:hover:bg-[#3a2820] cursor-pointer text-sm text-gray-700 dark:text-gray-200"
                            >
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => toggleFocus(focus)}
                                    className="accent-primary w-4 h-4"
                                />
                                <span className="flex-1">{info.label}</span>
                                <span className="text-[0.65rem] text-gray-400 tabular-nums">{count}</span>
                            </label>
                        );
                    })}
                </div>
            </details>
        </div>
    );
}

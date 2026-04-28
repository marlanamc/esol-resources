"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Level1Shell, GlassCard, MODE_TOKENS, type ModeKey } from "./level1-ui";

interface ModeOption {
  key: ModeKey;
  href: string | null; // null when not available (e.g. game without unit matching)
}

interface Props {
  unitSlug: string;
  themeId: string;
  themeTitle: string;
  themeIcon: string;
  /** Whether the unit-wide matching game is playable for this unit. */
  unitGameAvailable: boolean;
}

export function ActivityPickerClient({
  unitSlug,
  themeId,
  themeTitle,
  themeIcon,
  unitGameAvailable,
}: Props) {
  const options: ModeOption[] = [
    { key: "learn", href: `/vocab/level-1/${unitSlug}/${themeId}/wordlist` },
    { key: "cards", href: `/vocab/level-1/${unitSlug}/${themeId}/flashcards` },
    { key: "quiz", href: `/vocab/level-1/${unitSlug}/${themeId}/fillblank` },
    {
      key: "game",
      href: unitGameAvailable ? `/vocab/level-1/${unitSlug}/matching` : null,
    },
  ];

  return (
    <Level1Shell
      backHref={`/vocab/level-1/${unitSlug}`}
      backLabel="Back to topics"
      eyebrow={themeTitle}
    >
      {/* Theme hero */}
      <section className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/70 backdrop-blur border border-white/70 text-4xl shadow-sm">
          <span aria-hidden>{themeIcon}</span>
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {themeTitle}
        </h1>
        <p className="mt-2 text-base text-slate-600">What do you want to do?</p>
      </section>

      {/* Mode cards: 1 col on small phones, 2 cols on bigger screens */}
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((opt) => {
          const token = MODE_TOKENS[opt.key];
          const disabled = opt.href === null;

          const inner = (
            <GlassCard
              raised={!disabled}
              className={`h-full p-5 transition-transform duration-200 ${
                disabled ? "opacity-60" : "group-hover:-translate-y-0.5 group-active:scale-[0.99]"
              }`}
              style={{
                background: disabled
                  ? undefined
                  : `linear-gradient(135deg, ${token.accentSoft}, rgba(255,255,255,0.85))`,
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  aria-hidden
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl"
                  style={{ background: token.accentSoft }}
                >
                  {token.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold text-slate-900">{token.label}</h2>
                  <p className="mt-0.5 text-sm text-slate-600">{token.description}</p>
                  {disabled ? (
                    <p className="mt-1 text-xs font-medium text-slate-500">
                      Try the review game from the topic list
                    </p>
                  ) : null}
                </div>
                {!disabled ? (
                  <ArrowRight
                    size={22}
                    strokeWidth={2.4}
                    className="shrink-0"
                    style={{ color: token.accentStrong }}
                    aria-hidden
                  />
                ) : null}
              </div>
            </GlassCard>
          );

          if (disabled || !opt.href) {
            return (
              <div key={opt.key} aria-disabled className="block cursor-not-allowed">
                {inner}
              </div>
            );
          }

          return (
            <Link
              key={opt.key}
              href={opt.href}
              className="group block rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
              aria-label={`${token.label}. ${token.description}.`}
            >
              {inner}
            </Link>
          );
        })}
      </div>
    </Level1Shell>
  );
}

"use client";

import Link from "next/link";
import { Level1Shell, MODE_TOKENS, type ModeKey } from "./level1-ui";

interface ModeOption {
  key: ModeKey;
  href: string | null;
}

interface Props {
  unitSlug: string;
  themeId: string;
  themeTitle: string;
  themeIcon: string;
  unitGameAvailable: boolean;
}

// Decorative SVG illustrations per activity (scaled-down from the design)
const ACTIVITY_ILLO: Record<ModeKey, React.ReactNode> = {
  learn: (
    <svg viewBox="0 0 64 64" width="40" height="40" fill="none">
      <rect x="8" y="10" width="48" height="44" rx="6" fill="#fff" stroke="#8C5E08" strokeWidth="2.4"/>
      <rect x="14" y="18" width="14" height="14" rx="3" fill="#F0A23A"/>
      <rect x="32" y="20" width="20" height="3" rx="1.5" fill="#8C5E08"/>
      <rect x="32" y="26" width="14" height="3" rx="1.5" fill="#8C5E08" opacity=".55"/>
      <rect x="14" y="38" width="14" height="14" rx="3" fill="#FFD58A"/>
      <rect x="32" y="40" width="20" height="3" rx="1.5" fill="#8C5E08"/>
      <rect x="32" y="46" width="10" height="3" rx="1.5" fill="#8C5E08" opacity=".55"/>
    </svg>
  ),
  cards: (
    <svg viewBox="0 0 64 64" width="40" height="40" fill="none">
      <rect x="8" y="20" width="38" height="36" rx="6" fill="#FFD8DF" stroke="#9E2942" strokeWidth="2.4" transform="rotate(-8 27 38)"/>
      <rect x="18" y="14" width="38" height="36" rx="6" fill="#fff" stroke="#9E2942" strokeWidth="2.4"/>
      <text x="37" y="38" textAnchor="middle" fontSize="20" fontFamily="Nunito, sans-serif" fontWeight="900" fill="#9E2942">A</text>
    </svg>
  ),
  game: (
    <svg viewBox="0 0 64 64" width="40" height="40" fill="none">
      <rect x="6" y="14" width="22" height="22" rx="4" fill="#A5D6A7" stroke="#1E6E3A" strokeWidth="2.4"/>
      <circle cx="17" cy="25" r="6" fill="#fff"/>
      <rect x="36" y="14" width="22" height="22" rx="4" fill="#fff" stroke="#1E6E3A" strokeWidth="2.4"/>
      <text x="47" y="30" textAnchor="middle" fontSize="11" fontFamily="Nunito, sans-serif" fontWeight="900" fill="#1E6E3A">cat</text>
      <path d="M28 25 H36" stroke="#1E6E3A" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="3 3"/>
    </svg>
  ),
  quiz: (
    <svg viewBox="0 0 64 64" width="40" height="40" fill="none">
      <rect x="6" y="12" width="52" height="34" rx="5" fill="#fff" stroke="#4D3697" strokeWidth="2.4"/>
      <rect x="12" y="22" width="14" height="3" rx="1.5" fill="#4D3697"/>
      <rect x="30" y="22" width="16" height="9" rx="2" fill="#B9A4EE"/>
      <rect x="12" y="34" width="36" height="3" rx="1.5" fill="#4D3697" opacity=".5"/>
      <path d="M44 50 L52 42 L58 48 L50 56 Z" fill="#F3C95B" stroke="#4D3697" strokeWidth="2.4" strokeLinejoin="round"/>
    </svg>
  ),
};

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
    { key: "game", href: unitGameAvailable ? `/vocab/level-1/${unitSlug}/matching` : null },
    { key: "quiz", href: `/vocab/level-1/${unitSlug}/${themeId}/fillblank` },
  ];

  return (
    <Level1Shell
      backHref={`/vocab/level-1/${unitSlug}`}
      backLabel="Back to topics"
      eyebrow={themeTitle}
    >
      {/* Theme hero banner */}
      <section className="mb-5">
        <div
          className="flex items-center gap-4 rounded-[22px] p-[18px] border"
          style={{
            background: "linear-gradient(135deg, #FFF7E6, #FFE3C2)",
            borderColor: "#FFE0B2",
          }}
        >
          <div
            className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-[18px] bg-white text-[44px] leading-none"
            style={{ boxShadow: "0 1px 2px rgba(20,35,30,0.06)" }}
            aria-hidden
          >
            {themeIcon}
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-[22px] font-black leading-none text-slate-900">
              {themeTitle}
            </h1>
            <p className="mt-1 text-[12px] text-slate-500">
              Choose an activity below
            </p>
          </div>
        </div>
      </section>

      {/* Section label */}
      <div className="mb-3 pl-1">
        <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
          Choose an activity
        </p>
        <p className="text-[12px] italic text-slate-500">Elige una actividad</p>
      </div>

      {/* Activity tiles */}
      <div className="flex flex-col gap-2.5">
        {options.map((opt) => {
          const token = MODE_TOKENS[opt.key];
          const disabled = opt.href === null;
          const illo = ACTIVITY_ILLO[opt.key];

          const inner = (
            <div
              className={`flex items-center gap-4 rounded-[22px] p-4 transition-transform duration-200 ${
                disabled ? "opacity-60" : "hover:-translate-y-0.5 active:scale-[0.98]"
              }`}
              style={{
                background: token.accentSoft,
                border: `2px solid ${token.accent}33`,
                minHeight: 96,
              }}
            >
              {/* Illustration tile */}
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[18px] bg-white"
                style={{ boxShadow: "0 1px 2px rgba(20,35,30,0.06)" }}
              >
                {illo}
              </div>

              {/* Labels */}
              <div className="flex-1 min-w-0">
                <p
                  className="font-black text-[18px] leading-[1.15]"
                  style={{ color: token.accentStrong }}
                >
                  {token.label}
                </p>
                <p
                  className="text-[13px] italic"
                  style={{ color: token.accentStrong, opacity: 0.75 }}
                >
                  {token.labelEs}
                </p>
                <p className="mt-1 text-[12px] text-slate-500">{token.description}</p>
                {disabled && (
                  <p className="mt-1 text-[12px] text-slate-500">
                    Play from the topic list
                  </p>
                )}
              </div>

              {/* Arrow circle */}
              {!disabled && (
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: token.accent,
                    color: "white",
                    boxShadow: `0 4px 10px ${token.accent}55`,
                  }}
                >
                  <svg
                    width={18}
                    height={18}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          );

          if (disabled || !opt.href) {
            return (
              <div key={opt.key} aria-disabled className="cursor-not-allowed">
                {inner}
              </div>
            );
          }

          return (
            <Link
              key={opt.key}
              href={opt.href}
              className={`block rounded-[22px] focus-visible:outline-none focus-visible:ring-2 ${token.ring}`}
              aria-label={`${token.label}. ${token.labelEs}. ${token.description}.`}
            >
              {inner}
            </Link>
          );
        })}
      </div>

      {/* Tip card */}
      <div
        className="mt-5 flex items-start gap-2.5 rounded-2xl border p-3"
        style={{ background: "#effaf7", borderColor: "#d4f0e8" }}
      >
        <span className="text-[22px] leading-none shrink-0 mt-0.5" aria-hidden>💡</span>
        <p className="text-[13px] leading-relaxed" style={{ color: "#0e3d33" }}>
          <strong>New?</strong> Start with <strong>See the Words</strong>. Then try <strong>Flashcards</strong>.
          <span className="mt-1 block italic" style={{ color: "#196a5b" }}>
            ¿Nuevo? Empieza con &ldquo;Ver las palabras&rdquo;.
          </span>
        </p>
      </div>
    </Level1Shell>
  );
}

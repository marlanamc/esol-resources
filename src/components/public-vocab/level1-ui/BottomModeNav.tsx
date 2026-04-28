"use client";

import Link from "next/link";
import { MODE_TOKENS, type ModeKey } from "./tokens";

interface BottomModeNavProps {
  /** Active mode key. Omit if no mode is active. */
  active?: ModeKey;
  /** Build the href for each mode. Return null to render the tab as disabled. */
  hrefFor: (mode: ModeKey) => string | null;
}

const ORDER: ModeKey[] = ["learn", "cards", "quiz", "game"];

const SHORT_LABEL: Record<ModeKey, string> = {
  learn: "Learn",
  cards: "Cards",
  quiz: "Quiz",
  game: "Game",
};

export function BottomModeNav({ active, hrefFor }: BottomModeNavProps) {
  return (
    <nav
      aria-label="Vocabulary modes"
      className="rounded-full bg-white/85 backdrop-blur-xl border border-white/70 shadow-[0_18px_40px_-18px_rgba(20,60,70,0.30)] p-1.5"
    >
      <ul className="grid grid-cols-4 gap-1">
        {ORDER.map((mode) => {
          const token = MODE_TOKENS[mode];
          const href = hrefFor(mode);
          const isActive = active === mode;
          const disabled = href === null;

          const inner = (
            <span
              className={`flex h-12 w-full flex-col items-center justify-center gap-0.5 rounded-full text-[11px] font-semibold transition-all ${
                isActive ? "text-white shadow-sm" : "text-slate-600"
              } ${disabled ? "opacity-40" : ""}`}
              style={isActive ? { background: token.accent } : undefined}
            >
              <span aria-hidden className="text-base leading-none">
                {token.icon}
              </span>
              <span>{SHORT_LABEL[mode]}</span>
            </span>
          );

          return (
            <li key={mode}>
              {disabled || !href ? (
                <span aria-disabled className="block cursor-not-allowed">
                  {inner}
                </span>
              ) : (
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={token.label}
                  className="block rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                >
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

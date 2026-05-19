"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { PAGE_BG } from "./tokens";
import { Level1AudioSpeedToggle } from "./Level1AudioSpeedToggle";

interface Level1ShellProps {
  children: ReactNode;
  /** href for the top-left back button. Omit to hide. */
  backHref?: string;
  backLabel?: string;
  /** optional content rendered top-right (e.g. global audio button) */
  topRight?: ReactNode;
  /** optional sticky bottom slot (e.g. BottomModeNav) */
  bottomSlot?: ReactNode;
  /** title shown in header strip (small). Page-level h1 stays in body. */
  eyebrow?: string;
  /** expand body to max-w-5xl for index/grid pages */
  wide?: boolean;
}

export function Level1Shell({
  children,
  backHref,
  backLabel = "Back",
  topRight,
  bottomSlot,
  eyebrow,
  wide = false,
}: Level1ShellProps) {
  return (
    <div className={`relative min-h-screen w-full overflow-x-hidden ${PAGE_BG} text-slate-900`}>
      {/* decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(15,155,142,0.30), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -left-40 h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(176,87,64,0.25), transparent 70%)" }}
      />

      {/* Top bar */}
      <header className="sticky top-0 z-30">
        <div className="bg-white/55 backdrop-blur-xl border-b border-white/60">
          <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-2">
              {backHref ? (
                <Link
                  href={backHref}
                  aria-label={backLabel}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 border border-white/70 text-[#0a6b62] shadow-sm transition hover:bg-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                >
                  <ArrowLeft size={20} strokeWidth={2.4} />
                </Link>
              ) : (
                <span className="inline-flex h-10 w-10 items-center justify-center text-2xl" aria-hidden>
                  📚
                </span>
              )}
              {eyebrow ? (
                <span className="truncate text-sm font-semibold text-slate-700">{eyebrow}</span>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <Level1AudioSpeedToggle />
              {topRight}
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className={`relative mx-auto w-full px-4 pb-32 pt-6 sm:px-6 sm:pt-8 ${wide ? "max-w-5xl" : "max-w-3xl"}`}>
        {children}
      </main>

      {/* Sticky bottom slot */}
      {bottomSlot ? (
        <div className="fixed inset-x-0 bottom-0 z-40">
          <div className="mx-auto w-full max-w-3xl px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-2 sm:px-6">
            {bottomSlot}
          </div>
        </div>
      ) : null}
    </div>
  );
}

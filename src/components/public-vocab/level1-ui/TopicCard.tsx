"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface TopicCardProps {
  title: string;
  icon: string;
  wordCount: number;
  href: string;
  description?: string;
}

export function TopicCard({ title, icon, wordCount, href, description }: TopicCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
      aria-label={`${title}, ${wordCount} words`}
    >
      <GlassCard className="p-4 sm:p-5 transition-transform duration-200 group-hover:-translate-y-0.5 group-active:scale-[0.99]">
        <div className="flex items-center gap-4">
          <div
            aria-hidden
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl"
            style={{ background: "rgba(15,155,142,0.10)" }}
          >
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-bold text-slate-900">{title}</h3>
            <p className="mt-0.5 text-sm font-medium text-slate-600">
              {wordCount} {wordCount === 1 ? "word" : "words"}
            </p>
            {description ? (
              <p className="mt-1 line-clamp-1 text-sm text-slate-500">{description}</p>
            ) : null}
          </div>
          <ArrowRight
            size={22}
            strokeWidth={2.4}
            className="shrink-0 text-[#0a6b62] transition-transform group-hover:translate-x-1"
            aria-hidden
          />
        </div>
      </GlassCard>
    </Link>
  );
}

"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface UnitCardProps {
  title: string;
  description: string;
  icon: string;
  href: string;
  topicCount?: number;
}

export function UnitCard({
  title,
  description,
  icon,
  href,
  topicCount,
}: UnitCardProps) {
  const meta =
    typeof topicCount === "number"
      ? `${topicCount} ${topicCount === 1 ? "topic" : "topics"}`
      : null;

  return (
    <Link
      href={href}
      className="group flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 rounded-3xl"
      aria-label={title}
    >
      <GlassCard className="flex flex-1 flex-col p-5 transition-transform duration-200 group-hover:-translate-y-0.5 group-active:scale-[0.99]">
        <div className="flex flex-1 items-start gap-4">
          <div
            aria-hidden
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl"
            style={{ background: "rgba(15,155,142,0.10)" }}
          >
            {icon}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <h3 className="text-lg font-bold leading-snug text-slate-900">{title}</h3>
            <p className="mt-1 flex-1 text-sm text-slate-600">{description}</p>
            {meta ? (
              <p className="mt-2 text-xs font-medium text-slate-500">{meta}</p>
            ) : null}
          </div>
          <ArrowRight
            size={22}
            strokeWidth={2.4}
            className="mt-1 shrink-0 text-[#0a6b62] transition-transform group-hover:translate-x-1"
            aria-hidden
          />
        </div>
      </GlassCard>
    </Link>
  );
}

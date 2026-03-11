import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { getLearnerCategoryTone } from "@/lib/learner-theme";
import type { VocabReviewSummary } from "@/types/vocab-review";

interface VocabReviewLaunchCardProps {
  summary: VocabReviewSummary | null;
}

export function VocabReviewLaunchCard({ summary }: VocabReviewLaunchCardProps) {
  if (!summary || summary.totalCount === 0) {
    return null;
  }

  const tone = getLearnerCategoryTone("vocabulary");
  const headline =
    summary.dueCount > 0
      ? `${summary.dueCount} cards due today`
      : summary.newCount > 0
        ? `${summary.newCount} new cards ready`
        : "You're caught up";
  const supportText =
    summary.dueCount > 0
      ? "Open a quick review session and clear today's queue in a few minutes."
      : "Your year-long vocab bank is ready whenever you want a short phone-sized study session.";

  return (
    <section>
      <div className="dashboard-panel dashboard-panel-hover paper-texture rounded-2xl p-6 group relative overflow-hidden">
        {/* Decorative gradient blob matching the app's aesthetic */}
        <div 
          className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-20 transition-opacity duration-500 group-hover:opacity-40" 
          style={{ background: tone.accent }} 
        />

        <div className="flex flex-col gap-6 relative z-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 pr-2">
            <p className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-text-muted mb-2">
              <span className="h-[2px] w-8 rounded-full" style={{ background: `linear-gradient(90deg, ${tone.accent} 0%, transparent 100%)` }} />
              <Sparkles className="h-3 w-3" style={{ color: tone.accent }} />
              Daily Vocab
            </p>
            <h2 className="font-display text-2xl font-bold text-text mt-1">
              {headline}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-text/70 max-w-xl">
              {supportText}
            </p>
          </div>

          <div className="flex w-full shrink-0 flex-col items-start gap-2 sm:w-auto sm:items-end">
            <Link
              href="/dashboard/vocab-review"
              className="btn-polish dashboard-soft-button inline-flex w-full items-center justify-center gap-2 rounded-xl border px-6 py-2.5 text-sm font-semibold text-[color:var(--text-on-accent)] transition-transform active:scale-[0.98] sm:w-auto"
              style={{
                borderColor: tone.accent,
                background: `linear-gradient(135deg, ${tone.accent} 0%, ${tone.accentStrong} 100%)`,
                "--dashboard-button-shadow-override": "0 1px 2px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)",
                "--dashboard-button-shadow-hover-override": "0 2px 4px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.24)",
              } as CSSProperties}
            >
              Start Review
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

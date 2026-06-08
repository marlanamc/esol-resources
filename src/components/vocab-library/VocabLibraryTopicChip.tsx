import Link from "next/link";
import { buildVocabLibraryHref, type VocabLibrarySort } from "@/lib/vocab/library";

type VocabLibraryTopicChipProps = {
  href: string;
  isActive: boolean;
  label: string;
  shortLabel?: string;
  count: number;
};

export function VocabLibraryTopicChip({
  href,
  isActive,
  label,
  shortLabel,
  count,
}: VocabLibraryTopicChipProps) {
  const displayShort = shortLabel ?? label;

  return (
    <Link
      href={href}
      aria-current={isActive ? "true" : undefined}
      className={`inline-flex shrink-0 snap-start items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-medium transition-colors active:scale-[0.98] sm:gap-2 sm:px-4 ${
        isActive
          ? "border-primary bg-primary text-white"
          : "border-[var(--dashboard-border)] bg-[var(--dashboard-surface-start)] text-text hover:brightness-95"
      }`}
    >
      <span className="whitespace-nowrap sm:hidden">{displayShort}</span>
      <span className="hidden whitespace-nowrap sm:inline">{label}</span>
      <span
        className={`rounded-full px-1.5 py-0.5 text-[11px] leading-none sm:text-xs ${
          isActive ? "bg-white/20" : "bg-bg-light text-text/70"
        }`}
      >
        {count}
      </span>
    </Link>
  );
}

export function buildTopicChipHref(topic: string | null, sort: VocabLibrarySort): string {
  return buildVocabLibraryHref({
    topic: topic ?? undefined,
    sort,
  });
}

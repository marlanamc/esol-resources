
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const ICON_GRADIENTS = [
  "linear-gradient(135deg, #FFE0B2, #FFB74D)",
  "linear-gradient(135deg, #B3E5FC, #4FC3F7)",
  "linear-gradient(135deg, #C8E6C9, #81C784)",
  "linear-gradient(135deg, #F8BBD0, #F06292)",
  "linear-gradient(135deg, #D1C4E9, #9575CD)",
  "linear-gradient(135deg, #FFF9C4, #FFD54F)",
  "linear-gradient(135deg, #B2EBF2, #4DD0E1)",
  "linear-gradient(135deg, #FFCCBC, #FF8A65)",
];

interface TopicCardProps {
  title: string;
  titleEs?: string;
  icon: string;
  wordCount: number;
  href: string;
  description?: string;
  paletteIndex?: number;
  /** First few words from the topic for preview */
  sampleWords?: string[];
}

export function TopicCard({
  title,
  titleEs,
  icon,
  wordCount,
  href,
  sampleWords,
  paletteIndex = 0,
}: TopicCardProps) {
  const gradient = ICON_GRADIENTS[paletteIndex % ICON_GRADIENTS.length];

  return (
    <Link
      href={href}
      className="group block rounded-[20px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
      aria-label={`${title}${titleEs ? ". " + titleEs : ""}. ${wordCount} words.`}
    >
      <div
        className="flex items-center gap-3 rounded-[20px] border border-white/70 bg-white p-3 shadow-[0_1px_2px_rgba(20,35,30,0.06)] transition-transform duration-200 group-hover:-translate-y-0.5 group-active:scale-[0.98]"
        style={{ minHeight: 88 }}
      >
        {/* Colored icon tile */}
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-[34px]"
          style={{
            background: gradient,
            boxShadow: "inset 0 -2px 6px rgba(0,0,0,0.06)",
          }}
        >
          <span style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.18))" }} aria-hidden>
            {icon}
          </span>
        </div>

        {/* Text */}
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="font-black text-[16px] leading-[1.15] text-slate-900">{title}</p>
          {titleEs && (
            <p className="mt-0.5 text-[12px] italic text-slate-500">{titleEs}</p>
          )}
          {sampleWords && sampleWords.length > 0 && (
            <p className="mt-1 truncate text-[12px] text-slate-600">
              {sampleWords.slice(0, 3).join(" · ")}…
            </p>
          )}
        </div>

        {/* Badge + arrow */}
        <div className="flex shrink-0 flex-col items-center gap-1">
          <span
            className="inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[12px] font-black"
            style={{
              minWidth: 36,
              height: 24,
              background: "#effaf7",
              color: "#0a6b62",
            }}
          >
            {wordCount}
          </span>
          <ArrowRight size={16} strokeWidth={2.4} className="text-slate-400" aria-hidden />
        </div>
      </div>
    </Link>
  );
}

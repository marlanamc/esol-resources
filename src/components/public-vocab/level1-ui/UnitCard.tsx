
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const UNIT_GRADIENTS = [
  "linear-gradient(135deg, #FFD8A8, #FFB347)",
  "linear-gradient(135deg, #BCE3FF, #74B9FF)",
  "linear-gradient(135deg, #C8E6C9, #81C784)",
  "linear-gradient(135deg, #FFCCBC, #FF8A65)",
  "linear-gradient(135deg, #D1C4E9, #9575CD)",
  "linear-gradient(135deg, #FFF59D, #FFD54F)",
  "linear-gradient(135deg, #F8BBD0, #F06292)",
  "linear-gradient(135deg, #B2EBF2, #4DD0E1)",
];

interface UnitCardProps {
  title: string;
  titleEs?: string;
  icon: string;
  href: string;
  wordCount?: number;
  unitNum?: string;
  gradientIndex?: number;
}

export function UnitCard({
  title,
  titleEs,
  icon,
  href,
  wordCount,
  unitNum,
  gradientIndex = 0,
}: UnitCardProps) {
  const gradient = UNIT_GRADIENTS[gradientIndex % UNIT_GRADIENTS.length];

  return (
    <Link
      href={href}
      className="group flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 rounded-[20px]"
      aria-label={`${title}${titleEs ? ". " + titleEs : ""}`}
    >
      <div
        className="flex flex-1 flex-col rounded-[20px] border border-white/70 bg-white shadow-[0_1px_2px_rgba(20,35,30,0.06)] overflow-hidden transition-transform duration-200 group-hover:-translate-y-0.5 group-active:scale-[0.98]"
        style={{ minHeight: 160 }}
      >
        {/* Gradient thumbnail with emoji */}
        <div
          className="relative flex items-center justify-center"
          style={{ background: gradient, aspectRatio: "1.6" }}
        >
          {unitNum && (
            <div
              className="absolute top-2 left-2 text-[11px] font-black text-white px-2 py-0.5 rounded-full"
              style={{ background: "rgba(0,0,0,0.50)", letterSpacing: "0.04em" }}
            >
              {unitNum}
            </div>
          )}
          <span
            className="text-[44px] leading-none"
            style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.15))" }}
            aria-hidden
          >
            {icon}
          </span>
        </div>

        {/* Text body */}
        <div className="flex flex-1 flex-col p-3">
          <p className="font-black text-[16px] leading-[1.15] text-slate-900">{title}</p>
          {titleEs && (
            <p className="mt-0.5 text-[12px] italic text-slate-500">{titleEs}</p>
          )}

          <div className="flex-1" />

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-slate-200">
            {wordCount != null ? (
              <span className="text-[12px] font-bold text-[#0a6b62]">{wordCount} words</span>
            ) : (
              <span />
            )}
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#effaf7] text-[#0a6b62]">
              <ArrowRight size={14} strokeWidth={2.4} aria-hidden />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

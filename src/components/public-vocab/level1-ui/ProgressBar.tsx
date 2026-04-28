interface ProgressBarProps {
  value: number; // 0..1
  label?: string;
  accent?: string; // CSS color
  className?: string;
}

export function ProgressBar({ value, label, accent = "#0f9b8e", className = "" }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div className={className}>
      {label ? (
        <div className="mb-1.5 text-xs font-semibold text-slate-600">{label}</div>
      ) : null}
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-slate-200/70"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        aria-label={label ?? "Progress"}
      >
        <div
          className="h-full rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%`, background: accent }}
        />
      </div>
    </div>
  );
}

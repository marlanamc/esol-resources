"use client";

import Link from "next/link";
import { getLearnerCategoryTone } from "@/lib/learner/theme";
import type { CourseMapActivityType } from "@/lib/course-map";

export type TimelineStatus = "done" | "current" | "todo" | "locked";

export interface TimelineItem {
  activityId: string;
  title: string;
  type: CourseMapActivityType | "vocabulary" | string;
  vocabUi?: string;
  estMinutes?: number;
  status: TimelineStatus;
  href: string;
}

interface ActivityTimelineProps {
  items: TimelineItem[];
  accent: { fg: string; bg: string };
  className?: string;
  /** Card rows for desktop panels; list rows for mobile course map */
  layout?: "card" | "list";
}

function typeToToneKey(type: string): string {
  switch (type) {
    case "guide": return "grammar";
    case "game": return "games";
    case "pronunciation": return "pronunciation";
    case "writing": return "writing";
    case "speaking": return "speaking";
    case "vocabulary": return "vocabulary";
    default: return "quizzes";
  }
}

function typeLabel(type: string): string {
  switch (type) {
    case "guide": return "Grammar";
    case "game": return "Game";
    case "quiz": return "Quiz";
    case "review": return "Review";
    case "catch-up": return "Catch-up";
    case "assessment": return "Assessment";
    case "pronunciation": return "Pronunciation";
    case "writing": return "Writing";
    case "speaking": return "Speaking";
    case "vocabulary": return "Vocabulary";
    default: return "Activity";
  }
}

function typeGlyph(type: string, vocabUi?: string): string {
  if (vocabUi) return "🔤";
  switch (type) {
    case "guide": return "📖";
    case "game": return "🎮";
    case "quiz": return "✏️";
    case "review": return "🔁";
    case "catch-up": return "🧭";
    case "assessment": return "✅";
    case "pronunciation": return "🔊";
    case "writing": return "✍️";
    case "speaking": return "🎤";
    case "vocabulary": return "🔤";
    default: return "📌";
  }
}

function TimelineNode({
  status,
  accent,
  index,
}: {
  status: TimelineStatus;
  accent: { fg: string; bg: string };
  index: number;
}) {
  const animDelay = `${index * 55}ms`;

  const nodeStyle: React.CSSProperties = {
    width: 30,
    height: 30,
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    animationDelay: animDelay,
  };

  if (status === "done") {
    return (
      <div
        style={{
          ...nodeStyle,
          background: accent.fg,
          border: `2px solid ${accent.fg}`,
          color: "#fff",
          boxShadow: `0 3px 7px color-mix(in srgb, ${accent.fg} 32%, transparent)`,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }
  if (status === "current") {
    return (
      <div
        style={{
          ...nodeStyle,
          background: "var(--surface-base)",
          border: `3px solid ${accent.fg}`,
          color: accent.fg,
        }}
      >
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: "50%",
            background: accent.fg,
            display: "block",
          }}
        />
      </div>
    );
  }
  if (status === "locked") {
    return (
      <div
        style={{
          ...nodeStyle,
          background: "var(--surface-subtle)",
          border: "2px solid var(--dashboard-border)",
          color: "var(--text-muted)",
        }}
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <rect x="2" y="5.5" width="9" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M4 5.5V4a2.5 2.5 0 015 0v1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }
  // todo
  return (
    <div
      style={{
        ...nodeStyle,
        background: "var(--surface-base)",
        border: "2px solid var(--dashboard-border)",
        color: "var(--text-muted)",
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "var(--dashboard-border)",
          display: "block",
        }}
      />
    </div>
  );
}

function TimelineMeta({
  label,
  toneAccent,
}: {
  label: string;
  toneAccent: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "4px 6px",
        marginTop: 4,
        alignItems: "center",
        fontSize: 11,
        fontWeight: 600,
      }}
    >
      <span style={{ color: toneAccent }}>{label}</span>
    </div>
  );
}

function StartButton() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        marginTop: 8,
        paddingInline: "12px",
        paddingBlock: "6px",
        borderRadius: 8,
        background: "var(--primary)",
        color: "#fff",
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor">
        <path d="M3 2.5l6 3.5-6 3.5V2.5z" />
      </svg>
      Start
    </span>
  );
}

export function ActivityTimeline({ items, accent, className, layout = "card" }: ActivityTimelineProps) {
  const isList = layout === "list";

  return (
    <div className={className} style={{ position: "relative", paddingLeft: isList ? 0 : 8 }}>
      {items.map((item, i) => {
        const last = i === items.length - 1;
        const tone = getLearnerCategoryTone(typeToToneKey(item.type) as Parameters<typeof getLearnerCategoryTone>[0]);
        const glyph = typeGlyph(item.type, item.vocabUi);
        const label = typeLabel(item.type);
        const animDelay = `${i * 55}ms`;

        const isCurrent = item.status === "current";
        const isDone = item.status === "done";
        const isLocked = item.status === "locked";

        const titleStyle: React.CSSProperties = {
          fontSize: isList ? 15 : 13.5,
          fontWeight: 700,
          lineHeight: 1.35,
          color: isLocked ? "var(--text-muted)" : "var(--text)",
          textDecoration: isDone ? "line-through" : "none",
          textDecorationColor: "color-mix(in srgb, var(--text-muted) 70%, transparent)",
        };

        const listContent = (
          <div
            style={{
              padding: "12px 0",
              borderBottom: last ? "none" : "1px solid var(--border-subtle)",
              cursor: isLocked ? "default" : "pointer",
              opacity: isLocked ? 0.55 : 1,
            }}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span
                aria-hidden
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 17,
                  flexShrink: 0,
                  background: "var(--surface-subtle)",
                  borderLeft: `3px solid ${tone.accent}`,
                }}
              >
                {glyph}
              </span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={titleStyle}>{item.title}</div>
                <TimelineMeta label={label} toneAccent={tone.accent} />
                {isCurrent ? <StartButton /> : null}
              </div>
            </div>
          </div>
        );

        const cardContent = (
          <div
            style={{
              display: "flex",
              alignItems: isCurrent ? "flex-start" : "center",
              gap: 11,
              padding: "10px 12px",
              borderRadius: 14,
              cursor: isLocked ? "default" : "pointer",
              background: isCurrent ? "color-mix(in srgb, var(--primary) 6%, var(--surface-base))" : "var(--surface-base)",
              border: `1px solid ${isCurrent ? "color-mix(in srgb, var(--primary) 28%, transparent)" : "var(--dashboard-border)"}`,
              opacity: isLocked ? 0.6 : 1,
              boxShadow: isCurrent ? "0 4px 16px rgba(0,0,0,0.08)" : "0 1px 3px rgba(0,0,0,0.04)",
              transition: "box-shadow 0.15s ease, transform 0.15s ease",
            }}
            className={!isLocked ? "timeline-card-hover" : ""}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                display: "grid",
                placeItems: "center",
                fontSize: 18,
                flexShrink: 0,
                background: "color-mix(in srgb, var(--primary) 6%, var(--surface-base))",
                border: "1px solid var(--dashboard-border)",
                borderLeftColor: tone.accent,
                borderLeftWidth: 3,
              }}
            >
              {glyph}
            </div>

            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={titleStyle}>{item.title}</div>
              <TimelineMeta label={label} toneAccent={tone.accent} />
              {isCurrent ? <StartButton /> : null}
            </div>

            {!isCurrent && !isLocked ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                style={{ color: "var(--text-muted)", flexShrink: 0, marginTop: isCurrent ? 4 : 0 }}
              >
                <path d="M7 5l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : null}
          </div>
        );

        const rowContent = isList ? listContent : cardContent;
        const railWidth = isList ? 28 : 34;
        const railGap = isList ? 10 : 14;

        return (
          <div
            key={item.activityId}
            style={{
              display: "grid",
              gridTemplateColumns: `${railWidth}px minmax(0,1fr)`,
              gap: railGap,
              animation: "timelineFadeIn 0.35s ease-out both",
              animationDelay: animDelay,
            }}
          >
            <div style={{ display: "grid", justifyItems: "center" }}>
              <TimelineNode status={item.status} accent={accent} index={i} />
              {!last && (
                <div
                  style={{
                    width: 2.5,
                    flex: 1,
                    minHeight: 16,
                    marginTop: 2,
                    marginBottom: 2,
                    background: isDone ? "var(--primary)" : "var(--dashboard-border)",
                    borderRadius: 2,
                  }}
                />
              )}
            </div>

            <div
              style={{
                paddingBottom: isList ? 0 : last ? 0 : 14,
                minWidth: 0,
                ...(isCurrent && isList
                  ? {
                      marginInline: -2,
                      paddingInline: 10,
                      borderRadius: 12,
                      background: "color-mix(in srgb, var(--primary) 5%, var(--surface-base))",
                    }
                  : {}),
              }}
            >
              {isLocked ? (
                rowContent
              ) : (
                <Link
                  href={item.href}
                  style={{ display: "block", textDecoration: "none" }}
                  prefetch={false}
                >
                  {rowContent}
                </Link>
              )}
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes timelineFadeIn {
          from { opacity: 0.55; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes timelineFadeIn {
            from { opacity: 0.55; }
            to { opacity: 1; }
          }
        }
        .timeline-card-hover:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.1) !important;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}

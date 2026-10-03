/**
 * Small schematic "picture" for a preposition of space/movement — a box plus
 * a dot (spatial) or an arrow (movement) showing the relationship. These are
 * original, minimal vector diagrams (not a reproduction of any third-party
 * clip art), built once here and reused by both the in-app reference page
 * and the printable cheat sheet (via react-dom/server).
 */

export type SpatialPrepositionKind =
    | "in"
    | "on"
    | "under"
    | "above"
    | "below"
    | "in-front-of"
    | "behind"
    | "next-to"
    | "between"
    | "on-the-left"
    | "on-the-right"
    | "opposite";

export type MovementPrepositionKind =
    | "into"
    | "out-of"
    | "around"
    | "away-from"
    | "toward"
    | "past"
    | "onto"
    | "off"
    | "over"
    | "under-the-wall"
    | "through"
    | "across"
    | "up"
    | "down";

export type PrepositionIconKind = SpatialPrepositionKind | MovementPrepositionKind;

const ACCENT = "#b05740";
const VIEW = { w: 100, h: 80 };
const BOX = { x: 35, y: 25, w: 30, h: 30 };
const BOX_CENTER = { x: BOX.x + BOX.w / 2, y: BOX.y + BOX.h / 2 };

function BoxShape({ opacity = 1 }: { opacity?: number }) {
    return <rect x={BOX.x} y={BOX.y} width={BOX.w} height={BOX.h} rx={3} fill="none" stroke={ACCENT} strokeWidth={2.5} opacity={opacity} />;
}

function Dot({ cx, cy, faded = false }: { cx: number; cy: number; faded?: boolean }) {
    return <circle cx={cx} cy={cy} r={6} fill={ACCENT} opacity={faded ? 0.55 : 1} />;
}

const SPATIAL_DOTS: Record<SpatialPrepositionKind, { cx: number; cy: number }> = {
    "in": { cx: BOX_CENTER.x, cy: BOX_CENTER.y },
    "on": { cx: BOX_CENTER.x, cy: BOX.y - 2 },
    "under": { cx: BOX_CENTER.x, cy: BOX.y + BOX.h + 8 },
    "above": { cx: BOX_CENTER.x, cy: BOX.y - 16 },
    "below": { cx: BOX_CENTER.x, cy: BOX.y + BOX.h + 20 },
    "in-front-of": { cx: BOX_CENTER.x, cy: BOX.y + BOX.h - 3 },
    "behind": { cx: BOX.x + BOX.w - 6, cy: BOX_CENTER.y },
    "next-to": { cx: BOX.x + BOX.w + 18, cy: BOX_CENTER.y },
    "on-the-left": { cx: BOX.x - 18, cy: BOX_CENTER.y },
    "on-the-right": { cx: BOX.x + BOX.w + 18, cy: BOX_CENTER.y },
    "between": { cx: BOX_CENTER.x, cy: BOX_CENTER.y }, // unused — "between" draws two boxes
    "opposite": { cx: BOX_CENTER.x, cy: BOX_CENTER.y }, // unused — "opposite" draws two dots
};

const ARROWHEAD_ID = "preposition-arrowhead";

function ArrowDefs() {
    return (
        <defs>
            <marker id={ARROWHEAD_ID} markerWidth={7} markerHeight={7} refX={6} refY={3.5} orient="auto">
                <path d="M0,0 L7,3.5 L0,7 Z" fill={ACCENT} />
            </marker>
        </defs>
    );
}

function Arrow({ d }: { d: string }) {
    return <path d={d} fill="none" stroke={ACCENT} strokeWidth={2.5} strokeLinecap="round" markerEnd={`url(#${ARROWHEAD_ID})`} />;
}

const MOVEMENT_PATHS: Record<MovementPrepositionKind, string> = {
    "into": `M 5 ${BOX_CENTER.y} L 42 ${BOX_CENTER.y}`,
    "out-of": `M ${BOX_CENTER.x} ${BOX_CENTER.y} L 95 ${BOX_CENTER.y}`,
    "away-from": `M ${BOX.x + BOX.w + 2} ${BOX_CENTER.y} L 95 ${BOX_CENTER.y}`,
    "toward": `M 95 ${BOX_CENTER.y} L ${BOX.x + BOX.w + 3} ${BOX_CENTER.y}`,
    "past": `M 5 15 L 95 15`,
    "onto": `M ${BOX_CENTER.x} 4 L ${BOX_CENTER.x} ${BOX.y + 2}`,
    "off": `M ${BOX_CENTER.x} ${BOX.y + 2} L ${BOX.x + BOX.w + 10} 4`,
    "over": `M 15 ${BOX_CENTER.y} Q ${BOX_CENTER.x} -8 85 ${BOX_CENTER.y}`,
    "under-the-wall": `M 5 ${BOX.y + BOX.h + 10} L 95 ${BOX.y + BOX.h + 10}`,
    "through": `M 5 ${BOX_CENTER.y} L 95 ${BOX_CENTER.y}`,
    "across": `M 5 ${BOX_CENTER.y} L 95 ${BOX_CENTER.y}`,
    "around": `M ${BOX_CENTER.x - 2} ${BOX.y - 10} A 34 34 0 1 1 ${BOX_CENTER.x - 4} ${BOX.y - 10}`,
    "up": `M 10 70 L 30 55 L 50 55 L 70 35 L 90 35 L 90 15`,
    "down": `M 10 15 L 10 35 L 30 35 L 50 55 L 70 55 L 90 70`,
};

export interface PrepositionIconProps {
    kind: PrepositionIconKind;
    size?: number;
}

export function PrepositionIcon({ kind, size = 72 }: PrepositionIconProps) {
    const isMovement = kind in MOVEMENT_PATHS;

    return (
        <svg width={size} height={size * (VIEW.h / VIEW.w)} viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}>
            <ArrowDefs />
            {kind === "between" ? (
                <>
                    <rect x={10} y={30} width={22} height={22} rx={2} fill="none" stroke={ACCENT} strokeWidth={2} />
                    <rect x={68} y={30} width={22} height={22} rx={2} fill="none" stroke={ACCENT} strokeWidth={2} />
                    <Dot cx={50} cy={41} />
                </>
            ) : kind === "opposite" ? (
                <>
                    <BoxShape />
                    <Dot cx={10} cy={BOX_CENTER.y} />
                    <Dot cx={90} cy={BOX_CENTER.y} />
                </>
            ) : kind === "behind" ? (
                <>
                    <Dot cx={SPATIAL_DOTS.behind.cx} cy={SPATIAL_DOTS.behind.cy} faded />
                    <BoxShape />
                </>
            ) : isMovement ? (
                <>
                    {kind !== "under-the-wall" && kind !== "up" && kind !== "down" && (
                        <BoxShape opacity={kind === "through" || kind === "across" ? 0.5 : 1} />
                    )}
                    <Arrow d={MOVEMENT_PATHS[kind as MovementPrepositionKind]} />
                </>
            ) : (
                <>
                    <BoxShape />
                    <Dot {...SPATIAL_DOTS[kind as SpatialPrepositionKind]} />
                    {kind === "below" && (
                        <line
                            x1={BOX_CENTER.x} y1={BOX.y + BOX.h + 2}
                            x2={BOX_CENTER.x} y2={SPATIAL_DOTS.below.cy - 7}
                            stroke={ACCENT} strokeWidth={1} strokeDasharray="2,2" opacity={0.5}
                        />
                    )}
                </>
            )}
        </svg>
    );
}

import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import {
    Briefcase,
    Compass,
    GraduationCap,
    Handshake,
    HeartPulse,
    Home,
    Landmark,
    Leaf,
    MapPin,
    ShoppingBag,
} from "lucide-react";

/** One recognizable Lucide icon per school-year unit theme. */
const UNIT_ICONS: LucideIcon[] = [
    Handshake, // 1 · Getting to Know You
    MapPin, // 2 · Daily Life in the Community
    Landmark, // 3 · Community Participation
    ShoppingBag, // 4 · Consumer Smarts
    Home, // 5 · Housing
    Briefcase, // 6 · Workforce Preparation
    Compass, // 7 · Career Awareness
    HeartPulse, // 8 · Health
    Leaf, // 9 · Holistic Wellness
    GraduationCap, // 10 · Future Academic Goals
];

export function getCourseMapUnitIcon(unitNumber: number): LucideIcon {
    return UNIT_ICONS[unitNumber - 1] ?? Handshake;
}

export function CourseMapUnitIcon({
    unitNumber,
    size = 14,
    className,
    style,
    strokeWidth = 2.25,
}: {
    unitNumber: number;
    size?: number;
    className?: string;
    style?: CSSProperties;
    strokeWidth?: number;
}) {
    // Selecting (not creating) one of a fixed set of Lucide icon components by index — safe and
    // intentional. The static-components rule can't tell the difference, so scope a disable here.
    const Icon = getCourseMapUnitIcon(unitNumber);
    // eslint-disable-next-line react-hooks/static-components
    return <Icon size={size} className={className} style={style} strokeWidth={strokeWidth} aria-hidden />;
}

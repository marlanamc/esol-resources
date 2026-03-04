export type BottomNavIconKey =
  | "home"
  | "activities"
  | "classes"
  | "map"
  | "stats"
  | "leaderboard";

export interface BottomNavItem {
  href: string;
  label: string;
  iconKey: BottomNavIconKey;
}

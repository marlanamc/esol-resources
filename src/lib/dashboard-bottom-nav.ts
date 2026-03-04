import type { BottomNavItem } from "@/types/navigation";

export function getDashboardBottomNavItems(role: string | undefined): BottomNavItem[] {
  if (role === "teacher") {
    return [
      { href: "/dashboard", label: "Home", iconKey: "home" },
      { href: "/dashboard/classes", label: "Classes", iconKey: "classes" },
      { href: "/grammar-map", label: "Map", iconKey: "map" },
      { href: "/dashboard/stats", label: "Stats", iconKey: "stats" },
    ];
  }

  return [
    { href: "/dashboard", label: "Home", iconKey: "home" },
    { href: "/dashboard/activities", label: "Activities", iconKey: "activities" },
    { href: "/grammar-map", label: "Map", iconKey: "map" },
    { href: "/dashboard/leaderboard", label: "Board", iconKey: "leaderboard" },
  ];
}

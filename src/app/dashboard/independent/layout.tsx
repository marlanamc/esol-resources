import type { ReactNode } from "react";

export default function IndependentDashboardLayout({ children }: { children: ReactNode }) {
    // The parent dashboard/layout.tsx handles the header, bottom nav, and other chrome.
    // This layout simply passes children through without adding duplicate elements.
    return <>{children}</>;
}

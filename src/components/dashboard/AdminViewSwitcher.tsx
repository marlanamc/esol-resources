import Link from "next/link";
import { isAdminInStudentMode } from "@/lib/admin-student-view";

interface AdminViewSwitcherProps {
    user: { id?: string; role?: string | null };
    currentView: "classroom" | "independent";
}

export async function AdminViewSwitcher({ user, currentView }: AdminViewSwitcherProps) {
    const inStudentMode = await isAdminInStudentMode(user);
    if (!inStudentMode) return null;

    const isClassroom = currentView === "classroom";
    const switchHref = isClassroom ? "/dashboard/independent" : "/dashboard";
    const switchLabel = isClassroom ? "Independent view" : "Classroom view";

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 14px",
                borderRadius: 10,
                background: "var(--surface-subtle)",
                border: "1px solid var(--dashboard-border)",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text-muted)",
                marginBottom: 12,
            }}
        >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden style={{ flexShrink: 0, color: "var(--text-muted)" }}>
                <circle cx="7.5" cy="7.5" r="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M1 7.5C2.5 4 4.8 2 7.5 2s5 2 6.5 5.5c-1.5 3.5-3.8 5.5-6.5 5.5S2.5 11 1 7.5z" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            <span>
                Admin preview:{" "}
                <strong style={{ color: "var(--text)" }}>
                    {isClassroom ? "Classroom" : "Independent"} view
                </strong>
            </span>
            <span style={{ color: "var(--dashboard-border)" }}>·</span>
            <Link
                href={switchHref}
                style={{
                    color: "var(--primary)",
                    textDecoration: "none",
                    fontWeight: 700,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 3,
                }}
            >
                Switch to {switchLabel}
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M5 3l4 3.5-4 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </Link>
        </div>
    );
}

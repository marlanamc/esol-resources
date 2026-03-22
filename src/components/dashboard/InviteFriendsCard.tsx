import Link from "next/link";
import { UsersIcon } from "@/components/icons/Icons";

/**
 * Full Invite Friends card matching the desktop sidebar design.
 * Used on mobile dashboards in place of the simple "Invite" link.
 */
export function InviteFriendsCard() {
    return (
        <section
            className="rounded-2xl border p-4 md:hidden"
            style={{ borderColor: "var(--dashboard-divider)", backgroundColor: "var(--dashboard-surface-start)" }}
        >
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                    <UsersIcon className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-text">Invite Friends</h3>
                    <p className="text-xs text-text-muted">Share your invite link so others can join your learning circle.</p>
                </div>
            </div>
            <Link
                href="/dashboard/invite"
                className="dashboard-soft-button mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-secondary/25 bg-[var(--dashboard-surface-start)] px-4 py-2.5 text-sm font-semibold text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            >
                <UsersIcon className="h-4 w-4" />
                Open Invite Link
            </Link>
        </section>
    );
}

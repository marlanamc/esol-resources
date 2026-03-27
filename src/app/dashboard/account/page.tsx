import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { DeleteAccountSection } from "@/components/profile/DeleteAccountSection";
import AccountSettingsClient from "@/components/profile/StudentAccountSettingsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AccountPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    const role = session.user.role === "teacher" ? "teacher" : "student";

    if (role === "teacher") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
                    <h1 className="text-3xl font-display font-bold text-text mb-2">
                        Account settings
                    </h1>
                    <p className="text-sm text-text-muted mb-6">
                        Manage your Class Companion account.
                    </p>

                    <div className="bg-white/95 dark:bg-[var(--color-surface-elevated)] border border-border/60 rounded-xl p-6 shadow-md space-y-4">
                        <h2 className="text-lg font-semibold text-text">
                            Teacher account
                        </h2>
                        <p className="text-sm text-text-muted">
                            Teachers cannot change their own login details here. If you
                            need help with your account, please contact support.
                        </p>
                    </div>

                    <DeleteAccountSection userRole="teacher" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
                <h1 className="text-3xl font-display font-bold text-text mb-2">
                    Account settings
                </h1>
                <p className="text-sm text-text-muted mb-6">
                    Change your password or permanently delete your account.
                </p>

                <AccountSettingsClient />

                <DeleteAccountSection userRole="student" />
            </div>
        </div>
    );
}

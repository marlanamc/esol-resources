import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import JoinClassForm from "@/components/forms/JoinClassForm";
import { canUseTeacherTools } from "@/lib/auth/roles";

export default async function JoinClassPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    if (canUseTeacherTools(session.user)) {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-bg">
            <header className="bg-white dark:bg-[var(--surface-elevated)] shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Join a Class</h1>
                </div>
            </header>
            <main className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <JoinClassForm />
                </div>
            </main>
        </div>
    );
}










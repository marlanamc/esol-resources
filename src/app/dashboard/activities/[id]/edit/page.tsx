import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import EditActivityForm from "@/components/EditActivityForm";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function EditActivityPage({ params }: Props) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session) {
        redirect("/login");
    }

    const userRole = (session.user as any)?.role;
    if (userRole !== "teacher") {
        redirect("/dashboard");
    }

    const activity = await prisma.activity.findUnique({
        where: { id },
    });

    if (!activity) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <Link href="/dashboard/activities" className="text-indigo-600 hover:text-indigo-900 mb-4 inline-block">
                        &larr; Back to Activities
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Activity</h1>
                </div>
            </header>
            <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <EditActivityForm activity={activity} />
                </div>
            </main>
        </div>
    );
}












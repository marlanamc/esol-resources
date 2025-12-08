import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function ActivitiesPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const userRole = (session.user as any)?.role;
    const isTeacher = userRole === "teacher";

    const activities = await prisma.activity.findMany({
        orderBy: { createdAt: "desc" },
    });

    const categories = ["grammar", "vocab", "speaking", "writing-reading"];
    const types = ["quiz", "worksheet", "slides", "guide", "game", "resource"];
    const levels = ["beginner", "intermediate", "advanced"];

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div>
                        <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-900 mb-2 inline-block">
                            &larr; Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">Activity Library</h1>
                    </div>
                    {isTeacher && (
                        <div className="flex gap-4">
                            <Link
                                href="/dashboard/activities/new"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                + Create Activity
                            </Link>
                            <LogoutButton />
                        </div>
                    )}
                </div>
            </header>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* Filters */}
                    <div className="bg-white shadow rounded-lg p-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900">
                                    <option value="">All Categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900">
                                    <option value="">All Types</option>
                                    {types.map((type) => (
                                        <option key={type} value={type}>
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                                <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900">
                                    <option value="">All Levels</option>
                                    {levels.map((level) => (
                                        <option key={level} value={level}>
                                            {level.charAt(0).toUpperCase() + level.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Activities Grid */}
                    {activities.length === 0 ? (
                        <div className="border-4 border-dashed border-gray-200 rounded-lg h-64 flex flex-col items-center justify-center">
                            <p className="text-gray-500 mb-4">No activities yet. Create your first activity!</p>
                            {isTeacher && (
                                <Link
                                    href="/dashboard/activities/new"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Create Activity
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {activities.map((activity: {
                                id: string;
                                title: string;
                                description: string | null;
                                type: string;
                                category: string | null;
                                level: string | null;
                            }) => (
                                <div key={activity.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                                    <div className="px-4 py-5 sm:p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                activity.type === 'quiz' ? 'bg-purple-100 text-purple-800' :
                                                activity.type === 'worksheet' ? 'bg-green-100 text-green-800' :
                                                activity.type === 'slides' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {activity.type.toUpperCase()}
                                            </span>
                                            {activity.category && (
                                                <span className="text-xs text-gray-500">{activity.category}</span>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 truncate mb-1">
                                            {activity.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                                            {activity.description}
                                        </p>
                                        {activity.level && (
                                            <p className="text-xs text-gray-400 mb-3">
                                                Level: {activity.level}
                                            </p>
                                        )}
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/activity/${activity.id}`}
                                                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                Preview
                                            </Link>
                                            <Link
                                                href={`/dashboard/activities/${activity.id}/edit`}
                                                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                                            >
                                                Edit
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}








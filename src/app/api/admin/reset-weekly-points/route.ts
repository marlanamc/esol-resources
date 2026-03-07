import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireTeacher } from "@/lib/api-auth";
import { resetWeeklyPoints } from "@/lib/gamification";

/**
 * Reset weekly points for all students
 * This should be called every Tuesday to start a new week
 *
 * Week runs: Tuesday - Monday
 */
export async function POST() {
    const session = await getServerSession(authOptions);
    const teacherCheck = requireTeacher(session);
    if (!teacherCheck.ok) return teacherCheck.response;

    try {
        await resetWeeklyPoints();

        return NextResponse.json({
            success: true,
            message: "Weekly points reset successfully. New week started!",
            resetDate: new Date().toISOString()
        });
    } catch (error) {
        console.error('[Reset Weekly Points] Error:', error);
        return NextResponse.json(
            { error: "Failed to reset weekly points" },
            { status: 500 }
        );
    }
}

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth/auth";
import { getCourseMapNextLaunchForUser } from "@/lib/course-map-next-launch";
import { parseMapWeekParam } from "@/lib/course-map-navigation";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const week = parseMapWeekParam(new URL(request.url).searchParams.get("week"));
    const result = await getCourseMapNextLaunchForUser({
        id: session.user.id,
        role: session.user.role,
    }, week);

    return NextResponse.json(
        result ?? { launch: null, mapReturnHref: "/dashboard/map" }
    );
}

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getCourseMapNextLaunchForUser } from "@/lib/course-map-next-launch";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await getCourseMapNextLaunchForUser({
        id: session.user.id,
        role: session.user.role,
    });

    return NextResponse.json(
        result ?? { launch: null, mapReturnHref: "/dashboard/map" }
    );
}

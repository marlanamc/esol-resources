import { NextResponse } from "next/server";

export function buildProgressGetResponse(payload: {
    progress: number;
    status: string;
    categoryData: string | null;
    updatedAt: Date | null;
}) {
    return NextResponse.json(payload, {
        headers: {
            "Cache-Control": "no-store",
        },
    });
}

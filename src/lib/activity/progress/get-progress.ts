import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { parseCategoryData } from "@/lib/categoryData";
import { ApiErrors, apiError } from "@/lib/api/response";
import { buildProgressGetResponse } from "@/lib/activity/progress/response";
import {
    chooseBestProgressRecord,
    isVocabCategoryData,
    mergeVocabProgressRecords,
} from "@/lib/vocab/progress-merge";

const PROGRESS_SELECT = {
    progress: true,
    status: true,
    categoryData: true,
    updatedAt: true,
} as const;

type ProgressRecord = {
    progress: number;
    status: string;
    categoryData: string | null;
    updatedAt: Date;
};

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return ApiErrors.unauthorized();
    }

    const url = new URL(request.url);
    const activityId = url.searchParams.get("activityId");
    const assignmentId = url.searchParams.get("assignmentId");

    if (!activityId || typeof activityId !== "string") {
        return apiError("activityId is required", 400);
    }

    const userId = session.user.id;
    const assignmentKey = typeof assignmentId === "string" ? assignmentId : null;

    let record: ProgressRecord | null = null;

    if (assignmentKey) {
        const [assignmentRecord, globalRecord] = await Promise.all([
            prisma.activityProgress.findFirst({
                where: { userId, activityId, assignmentId: assignmentKey },
                select: PROGRESS_SELECT,
                orderBy: { updatedAt: "desc" },
            }),
            prisma.activityProgress.findFirst({
                where: { userId, activityId, assignmentId: null },
                select: PROGRESS_SELECT,
                orderBy: { updatedAt: "desc" },
            }),
        ]);

        if (assignmentRecord && globalRecord) {
            const mergedVocabRecord = mergeVocabProgressRecords(assignmentRecord, globalRecord);
            record = mergedVocabRecord ?? assignmentRecord;
        } else {
            record = assignmentRecord ?? globalRecord;
        }
    } else {
        const records = await prisma.activityProgress.findMany({
            where: { userId, activityId },
            select: PROGRESS_SELECT,
            orderBy: { updatedAt: "desc" },
        });

        if (records.length > 0) {
            const vocabRecords = records.filter((entry) =>
                isVocabCategoryData(parseCategoryData(entry.categoryData))
            );

            if (vocabRecords.length > 0) {
                let mergedRecord = vocabRecords[0]!;

                for (let index = 1; index < vocabRecords.length; index += 1) {
                    const candidate = vocabRecords[index]!;
                    const merged = mergeVocabProgressRecords(mergedRecord, candidate);
                    if (merged) {
                        mergedRecord = merged;
                        continue;
                    }

                    const best = chooseBestProgressRecord([mergedRecord, candidate]);
                    if (best) {
                        mergedRecord = best;
                    }
                }

                const bestOverall = chooseBestProgressRecord(records);
                if (bestOverall && bestOverall.progress > mergedRecord.progress) {
                    record = {
                        ...mergedRecord,
                        progress: bestOverall.progress,
                        status: bestOverall.progress >= 100 ? "completed" : "in_progress",
                        updatedAt: bestOverall.updatedAt,
                    };
                } else {
                    record = mergedRecord;
                }
            } else {
                record = chooseBestProgressRecord(records);
            }
        }
    }

    return buildProgressGetResponse({
        progress: record?.progress ?? 0,
        status: record?.status ?? "in_progress",
        categoryData: record?.categoryData ?? null,
        updatedAt: record?.updatedAt ?? null,
    });
}

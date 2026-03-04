"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { GrammarGradebook } from "@/components/dashboard";

interface Student {
    id: string;
    name: string | null;
    username: string;
}

interface Activity {
    id: string;
    title: string;
}

interface Submission {
    userId: string;
    activityId: string;
    score: number | null;
    updatedAt: Date;
}

interface ClassOption {
    id: string;
    name: string;
}

interface Props {
    students: Student[];
    activities: Activity[];
    submissions: Submission[];
    classes: ClassOption[];
    selectedClassId: string | null;
    searchQuery: string;
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
}

export function GradebookClient({
    students,
    activities,
    submissions,
    classes,
    selectedClassId,
    searchQuery,
    pagination,
}: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const pushWithParams = useCallback(
        (mutate: (params: URLSearchParams) => void) => {
            const params = new URLSearchParams(searchParams.toString());
            mutate(params);
            router.push(`/dashboard/gradebook?${params.toString()}`);
        },
        [router, searchParams]
    );

    const handleClassChange = useCallback(
        (classId: string | null) => {
            pushWithParams((params) => {
                if (classId) {
                    params.set("classId", classId);
                } else {
                    params.delete("classId");
                }
                params.set("page", "1");
            });
        },
        [pushWithParams]
    );

    const handleSearchChange = useCallback(
        (query: string) => {
            pushWithParams((params) => {
                const next = query.trim();
                if (next.length > 0) {
                    params.set("q", next);
                } else {
                    params.delete("q");
                }
                params.set("page", "1");
            });
        },
        [pushWithParams]
    );

    const handlePageChange = useCallback(
        (page: number) => {
            pushWithParams((params) => {
                params.set("page", String(page));
            });
        },
        [pushWithParams]
    );

    const handlePageSizeChange = useCallback(
        (pageSize: number) => {
            pushWithParams((params) => {
                params.set("pageSize", String(pageSize));
                params.set("page", "1");
            });
        },
        [pushWithParams]
    );

    return (
        <GrammarGradebook
            students={students}
            activities={activities}
            submissions={submissions}
            classes={classes}
            selectedClassId={selectedClassId}
            onClassChange={handleClassChange}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            pagination={pagination}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
        />
    );
}

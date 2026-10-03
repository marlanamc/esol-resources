"use client";

import { getTimeOfDayGreeting } from "@/lib/dashboard/welcome-header";

interface MobileStudentGreetingProps {
    userName: string;
}

export function MobileStudentGreeting({ userName }: MobileStudentGreetingProps) {
    const firstName = userName.split(" ")[0];

    return (
        <div className="px-1 pt-1 pb-0">
            <h1 className="min-w-0 font-display text-xl font-bold leading-tight tracking-[-0.01em] text-text">
                <span className="block truncate">
                    {getTimeOfDayGreeting()}, {firstName}.
                </span>
            </h1>
        </div>
    );
}

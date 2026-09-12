"use client";

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
}

interface MobileStudentGreetingProps {
    userName: string;
}

export function MobileStudentGreeting({ userName }: MobileStudentGreetingProps) {
    const firstName = userName.split(" ")[0];

    return (
        <div className="px-1 pt-1 pb-0">
            <h1 className="min-w-0 font-legible text-xl font-bold leading-tight text-text">
                <span className="block truncate">
                    {getGreeting()}, {firstName}.
                </span>
            </h1>
        </div>
    );
}

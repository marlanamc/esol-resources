import Link from "next/link";
import { Check, ClipboardCheck, Clock } from "lucide-react";
import { calendarDaysUntil, formatQuizDay, formatQuizTime, type WeeklyQuizStatus } from "@/lib/learner/weekly-quiz-status";

const tones = {
    open: {
        box: "border-violet-700 bg-violet-50 dark:border-violet-400 dark:bg-violet-950/40",
        icon: "bg-violet-700 dark:bg-violet-500",
        label: "text-violet-800 dark:text-violet-300",
        button: "bg-violet-700 dark:bg-violet-500",
    },
    late: {
        box: "border-red-800 bg-red-50 dark:border-red-400 dark:bg-red-950/40",
        icon: "bg-red-800 dark:bg-red-600",
        label: "text-red-800 dark:text-red-300",
        button: "bg-red-800 dark:bg-red-600",
    },
    done: {
        box: "border-emerald-800 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-950/40",
        icon: "bg-emerald-800 dark:bg-emerald-600",
        label: "text-emerald-800 dark:text-emerald-300",
        button: "",
    },
} as const;

function dueLine(status: WeeklyQuizStatus, now: Date): string {
    if (status.state === "late") return `Was due ${formatQuizDay(status.dueAt)}`;
    const days = calendarDaysUntil(status.dueAt, now);
    if (days <= 0) return `Due today, ${formatQuizTime(status.dueAt)}`;
    if (days === 1) return `Due tomorrow, ${formatQuizTime(status.dueAt)}`;
    return `Due ${formatQuizDay(status.dueAt)} · ${days} days left`;
}

/**
 * The weekly quiz is the one required task each week, so it sits above the
 * week card in a slim bar that changes color: open (Thu–Tue), late (Tue–Thu)
 * and done.
 */
export function WeeklyQuizBar({ status, now = new Date() }: { status: WeeklyQuizStatus; now?: Date }) {
    const tone = tones[status.state];
    const Icon = status.state === "done" ? Check : status.state === "late" ? Clock : ClipboardCheck;
    const label = status.state === "done" ? "Homework done" : status.state === "late" ? "Late · Do it today" : "Homework · Must do";
    const title = status.state === "done" ? "You finished the quiz!" : "Weekly Quiz";
    const detail = status.state === "done"
        ? status.nextOpensAt ? `Next quiz: ${formatQuizDay(status.nextOpensAt)}` : "Great work this week."
        : dueLine(status, now);

    const body = (
        <>
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center text-white ${status.state === "done" ? "rounded-full" : "rounded-2xl"} ${tone.icon}`}>
                <Icon size={22} strokeWidth={status.state === "done" ? 2.8 : 2.2} aria-hidden />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className={`text-xs font-extrabold uppercase tracking-[.08em] ${tone.label}`}>{label}</span>
                <span className="text-[1.0625rem] font-extrabold leading-tight text-text">{title}</span>
                <span className="text-sm font-semibold text-text-muted">{detail}</span>
            </span>
        </>
    );
    const box = `flex min-h-16 items-center gap-3 rounded-[20px] border-2 py-3 pl-3.5 pr-3 ${tone.box}`;

    if (status.state === "done") {
        return <div role="status" className={box}>{body}</div>;
    }
    return (
        <Link
            href={status.href}
            className={`${box} transition-transform duration-200 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 motion-reduce:transition-none`}
        >
            {body}
            <span className={`flex h-10 shrink-0 items-center whitespace-nowrap rounded-full px-4 text-[0.9375rem] font-extrabold text-white ${tone.button}`}>
                {status.state === "late" ? "Do it now" : "Start"}
            </span>
        </Link>
    );
}

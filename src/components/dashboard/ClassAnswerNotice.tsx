import Link from "next/link";
import { MessageCircle } from "lucide-react";
import type { UnseenClassAnswers } from "@/lib/learner/class-questions-data";

/** Home line when the teacher answered a learner's question for class; links to that week's question box. */
export function ClassAnswerNotice({ count, weekNumber }: UnseenClassAnswers) {
    return (
        <Link
            href={`/dashboard/map?week=${weekNumber}#week-${weekNumber}`}
            className="flex min-h-11 items-center gap-2 rounded-xl bg-emerald-700 px-3 py-2 text-base font-bold text-[#fffdfa] no-underline dark:bg-emerald-600"
        >
            <MessageCircle size={18} aria-hidden />
            {count === 1 ? "Your teacher answered your question" : `Your teacher answered ${count} questions`}
        </Link>
    );
}

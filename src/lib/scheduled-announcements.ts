import { getLearnerDayKey } from "@/lib/daily-habits";

/**
 * Dated homepage announcements, shown on /dashboard alongside the teacher's
 * class announcement. Keyed by program day (YYYY-MM-DD, America/New_York).
 * Each day has its own id, so dismissing today's message does not hide
 * tomorrow's. Markdown follows renderAnnouncementMarkdown (**bold**, *italic*).
 */
/** The packet on Google Classroom, for students who missed class on Tue Nov 24. */
const THANKSGIVING_PACKET_URL =
  "https://classroom.google.com/c/ODc4MTA5Mzc4NTU5/m/ODkyODk3NzcyNTQ3/details";
const MISSED_CLASS_FOOTNOTE = `Missed class on Tuesday? [Get the packet on Google Classroom](${THANKSGIVING_PACKET_URL})`;

export interface ScheduledAnnouncement {
  id: string;
  message: string;
  /** Optional small, muted line under the message (same markdown rules). */
  footnote?: string;
}

export const SCHEDULED_ANNOUNCEMENTS: Readonly<Record<string, ScheduledAnnouncement>> = {
  // FY27 Thanksgiving Writing Packet (Wed Nov 25 – Mon Nov 30, due Tue Dec 1).
  // Source: FY27/worksheets/group-handouts/week11-thanksgiving-writing-packet
  "2026-11-25": {
    id: "scheduled:thanksgiving-writing-day-1",
    message:
      "✏️ **Thanksgiving writing, Day 1:** “Getting Ready” — *just, already, yet*. Write 5 sentences.\n\n🦃 **No class tomorrow. Happy Thanksgiving!**",
    footnote: MISSED_CLASS_FOOTNOTE,
  },
  "2026-11-26": {
    id: "scheduled:thanksgiving-writing-day-2",
    message:
      "🦃 **Happy Thanksgiving! No class today.**\n\n✏️ **Thanksgiving writing, Day 2:** “Today Is Thanksgiving” — *right now + usually*. Write 5 sentences.",
    footnote: MISSED_CLASS_FOOTNOTE,
  },
  "2026-11-27": {
    id: "scheduled:thanksgiving-writing-day-3",
    message:
      "✏️ **Thanksgiving writing, Day 3:** “Yesterday” — *past simple*. What did you do on Thanksgiving? Write 5 sentences.",
    footnote: MISSED_CLASS_FOOTNOTE,
  },
  "2026-11-28": {
    id: "scheduled:thanksgiving-writing-day-4",
    message:
      "✏️ **Thanksgiving writing, Day 4:** “Holidays I Know” — *Have you ever…?* Write 5 sentences.",
    footnote: MISSED_CLASS_FOOTNOTE,
  },
  "2026-11-29": {
    id: "scheduled:thanksgiving-writing-day-5",
    message:
      "✏️ **Thanksgiving writing, Day 5:** “Advice for a Friend” — *can, should, must*. Write 5 sentences.",
    footnote: MISSED_CLASS_FOOTNOTE,
  },
  "2026-11-30": {
    id: "scheduled:thanksgiving-writing-day-6",
    message:
      "✏️ **Thanksgiving writing, Day 6 (last day!):** “Looking Ahead to December” — *If… will…* Write 5 sentences.\n\n📄 **Class is tomorrow. Bring your packet!**",
    footnote: MISSED_CLASS_FOOTNOTE,
  },
};

export function getScheduledAnnouncement(now: Date = new Date()): ScheduledAnnouncement | null {
  return SCHEDULED_ANNOUNCEMENTS[getLearnerDayKey(now)] ?? null;
}

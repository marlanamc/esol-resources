import type { PushMessage } from "@/lib/push";

/**
 * Dated push messages for every subscribed student, keyed by learner day
 * (YYYY-MM-DD, America/New_York — see getLearnerDayKey).
 *
 * The daily cron (/api/cron/send-vocab-reminders, 9am ET) checks this table
 * first: on a listed day it sends this message to every subscribed student
 * instead of the vocab reminder, so nobody gets two pushes that morning.
 */
export const SCHEDULED_PUSH_MESSAGES: Readonly<Record<string, PushMessage>> = {
  // FY27 Thanksgiving Writing Packet (Wed Nov 25 – Mon Nov 30, due Tue Dec 1).
  // Source: FY27/worksheets/group-handouts/week11-thanksgiving-writing-packet
  "2026-11-25": {
    title: "✏️ Thanksgiving writing: Day 1",
    body: "Today: “Getting Ready” — just, already, yet. Write 5 sentences. No class tomorrow. Happy Thanksgiving! 🦃",
    url: "/dashboard",
    tag: "thanksgiving-writing-day-1",
  },
  "2026-11-26": {
    title: "🦃 Happy Thanksgiving!",
    body: "No class today. Writing Day 2: “Today Is Thanksgiving” — right now + usually. Write 5 sentences.",
    url: "/dashboard",
    tag: "thanksgiving-writing-day-2",
  },
  "2026-11-27": {
    title: "✏️ Thanksgiving writing: Day 3",
    body: "Today: “Yesterday” — past simple. What did you do on Thanksgiving? Write 5 sentences.",
    url: "/dashboard",
    tag: "thanksgiving-writing-day-3",
  },
  "2026-11-28": {
    title: "✏️ Thanksgiving writing: Day 4",
    body: "Today: “Holidays I Know” — Have you ever…? Write 5 sentences.",
    url: "/dashboard",
    tag: "thanksgiving-writing-day-4",
  },
  "2026-11-29": {
    title: "✏️ Thanksgiving writing: Day 5",
    body: "Today: “Advice for a Friend” — can, should, must. Write 5 sentences.",
    url: "/dashboard",
    tag: "thanksgiving-writing-day-5",
  },
  "2026-11-30": {
    title: "✏️ Thanksgiving writing: Day 6",
    body: "Last day! “Looking Ahead to December” — If… will… Class is tomorrow. Bring your packet!",
    url: "/dashboard",
    tag: "thanksgiving-writing-day-6",
  },
};

export function getScheduledPushMessage(dayKey: string): PushMessage | null {
  return SCHEDULED_PUSH_MESSAGES[dayKey] ?? null;
}

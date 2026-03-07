/**
 * Zod schemas for API request body validation.
 * Use with parseApiBody() to return 400 on parse errors.
 */

import { z } from "zod";
import { NextResponse } from "next/server";

export function parseApiBody<T>(schema: z.ZodType<T>, body: unknown): { ok: true; data: T } | { ok: false; response: NextResponse } {
  const result = schema.safeParse(body);
  if (result.success) {
    return { ok: true, data: result.data };
  }
  const firstIssue = result.error.issues[0];
  const message = firstIssue?.message ?? result.error.message ?? "Invalid request body";
  return {
    ok: false,
    response: NextResponse.json({ error: message }, { status: 400 }),
  };
}

export const ActivitySubmitBodySchema = z.object({
  activityId: z.string().min(1, "activityId is required"),
  assignmentId: z.union([z.string(), z.null()]).optional(),
  content: z.unknown().optional(),
  score: z.number().min(0).max(100).optional(),
});

export const SubmissionsPostBodySchema = z.object({
  activityId: z.string().min(1, "Activity ID is required"),
  assignmentId: z.string().min(1, "Assignment ID is required"),
  content: z.unknown().refine((v) => v != null && v !== "", "Content is required"),
});

export const ClassesPostBodySchema = z.object({
  name: z.string().min(1, "Class name is required").max(200, "Class name too long"),
  description: z.string().optional().nullable(),
  code: z.string().optional(),
  sourceClassId: z.string().optional().nullable(),
  copyAssignments: z.boolean().default(true),
});

export const CalendarEventPostBodySchema = z.object({
  classId: z.string().min(1, "classId is required"),
  title: z.string().min(1, "Title is required").max(200),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  type: z.enum(["holiday", "event", "due", "reminder", "quiz"]).default("holiday"),
  description: z.string().optional().nullable(),
  syncToSectionGroup: z.boolean().default(false),
});

export const CalendarEventPatchBodySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  type: z.enum(["holiday", "reminder", "other"]).optional(),
  description: z.string().optional().nullable(),
});

export const AssignmentPostBodySchema = z.object({
  classId: z.string().min(1, "classId is required"),
  activityId: z.string().min(1, "activityId is required"),
  title: z.string().optional().nullable(),
  instructions: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
  syncToSectionGroup: z.boolean().default(true),
});

export type ActivitySubmitBody = z.infer<typeof ActivitySubmitBodySchema>;
export type SubmissionsPostBody = z.infer<typeof SubmissionsPostBodySchema>;
export type ClassesPostBody = z.infer<typeof ClassesPostBodySchema>;
export type CalendarEventPostBody = z.infer<typeof CalendarEventPostBodySchema>;
export type CalendarEventPatchBody = z.infer<typeof CalendarEventPatchBodySchema>;
export type AssignmentPostBody = z.infer<typeof AssignmentPostBodySchema>;

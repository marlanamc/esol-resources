export const UNASSIGNED_SCOPE_KEY = "__unassigned__";

export function normalizeAssignmentId(assignmentId: unknown): string | null {
  if (typeof assignmentId !== "string") return null;
  const trimmed = assignmentId.trim();
  if (!trimmed || trimmed === "null") return null;
  return trimmed;
}

export function toAssignmentScopeKey(assignmentId: string | null): string {
  return assignmentId ?? UNASSIGNED_SCOPE_KEY;
}

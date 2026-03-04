import { toAssignmentScopeKey } from "@/lib/assignment-scope";

type LockCapableTransaction = {
  $executeRaw: (query: TemplateStringsArray, ...values: unknown[]) => Promise<unknown>;
};

export async function acquireUserActivityScopeLock(
  tx: LockCapableTransaction,
  params: {
    userId: string;
    activityId: string;
    assignmentId: string | null;
  }
): Promise<void> {
  const { userId, activityId, assignmentId } = params;
  const scopeKey = toAssignmentScopeKey(assignmentId);
  const secondaryKey = `${activityId}::${scopeKey}`;

  await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${userId}), hashtext(${secondaryKey}))`;
}

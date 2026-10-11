"use client";

import type { QueuedSubmission, SubmissionOutboxSnapshot } from "@/types/pwa";
import { getActiveLearnerId } from "@/lib/learner-session";

const STORAGE_KEY = "submission-outbox-v1";
export const submissionOutboxEventName = "submissionOutboxUpdate";
export const submissionSavedEventName = "submissionSaved";
export const isSubmissionOutboxEnabled = process.env.NEXT_PUBLIC_ENABLE_SUBMISSION_OUTBOX !== "false";
const MAX_RETRY_COUNT = 5;
let syncing: Promise<SubmissionOutboxSnapshot> | null = null;
let sending = 0;
let lastManualAttempt = 0;

function readQueue(): QueuedSubmission[] {
  if (typeof window === "undefined") return [];
  try {
    const items: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(items) ? items.filter(item => item && typeof item.id === "string") : [];
  } catch { return []; }
}
function writeQueue(queue: QueuedSubmission[]) {
  // A storage failure must reach the caller: never claim work is queued if it isn't.
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
}
function updateItem(id: string, item?: QueuedSubmission) {
  const latest = readQueue();
  writeQueue(item ? latest.map(row => row.id === id ? item : row) : latest.filter(row => row.id !== id));
}
function emit(extra: Partial<SubmissionOutboxSnapshot> = {}) {
  const snapshot = getSubmissionOutboxSnapshot(extra);
  window.dispatchEvent(new CustomEvent(submissionOutboxEventName, { detail: snapshot }));
  return snapshot;
}
export function getSubmissionOutboxSnapshot(extra: Partial<SubmissionOutboxSnapshot> = {}): SubmissionOutboxSnapshot {
  const userId = getActiveLearnerId();
  const queue = readQueue().filter(item => item.userId === userId && !!userId && !item.superseded);
  return { pending: queue.filter(item => item.status === "pending").length,
    unassigned: readQueue().filter(item => !item.userId).length,
    failed: queue.filter(item => item.status === "failed").length, syncing: sending > 0, ...extra };
}
export function generateIdempotencyKey(): string { return crypto.randomUUID(); }

type SubmissionParams = { endpoint: string; method: "POST" | "PUT"; payload: unknown; idempotencyKey?: string };
// Only endpoints with transactional award/idempotency guarantees may replay automatically.
function submissionScope(payload: unknown) {
  const p = payload as { activityId?: string; assignmentId?: string; submissionId?: string } | null;
  return JSON.stringify([p?.activityId, p?.assignmentId, p?.submissionId]);
}
function replaySafe(endpoint: string) { return ["/api/activity/submit", "/api/submissions", "/api/speaking/submissions"].includes(endpoint); }
export function queueSubmission(params: SubmissionParams): QueuedSubmission {
  const userId = getActiveLearnerId();
  if (!userId) throw new Error("Please sign in before saving. Keep this page open and try again.");
  if (!replaySafe(params.endpoint)) throw new Error("This activity needs a manual retry. Keep this page open.");
  const queue = readQueue();
  const key = params.idempotencyKey || generateIdempotencyKey();
  const existing = queue.find(item => item.idempotencyKey === key && item.userId === userId);
  if (existing) return existing;
  const item: QueuedSubmission = { ...params, userId, id: key, idempotencyKey: key,
    createdAt: new Date().toISOString(), retryCount: 0, status: "pending" };
  // A corrected submission replaces a permanently failed version for replay,
  // but keep that older payload as evidence on the device.
  writeQueue([...queue.map(row => row.userId === userId && row.endpoint === item.endpoint && row.status === "failed" && submissionScope(row.payload) === submissionScope(item.payload)
    ? { ...row, superseded: true } : row), item]);
  emit();
  return item;
}
function transient(status: number) { return status === 408 || status === 429 || status >= 500; }
async function send(item: SubmissionParams & { idempotencyKey: string; userId?: string }): Promise<Response> {
  return fetch(item.endpoint, { method: item.method,
    headers: { "Content-Type": "application/json", "X-Idempotency-Key": item.idempotencyKey,
      ...(item.userId ? { "X-Outbox-User-Id": item.userId } : {}) },
    body: JSON.stringify(item.payload), signal: AbortSignal.timeout(20000) });
}
async function saved(response: Response, item: { idempotencyKey: string; userId?: string }) {
  const body = await response.clone().json().catch(() => ({}));
  if (item.userId && item.userId !== getActiveLearnerId()) return;
  window.dispatchEvent(new CustomEvent(submissionSavedEventName, { detail: {
    idempotencyKey: item.idempotencyKey, points: typeof body.points === "number" ? body.points : 0, result: body,
  } }));
}
function deferred(item: QueuedSubmission, response?: Response): QueuedSubmission {
  const retryCount = item.retryCount + 1;
  const retryAfter = response?.headers.get("Retry-After");
  const serverDelay = retryAfter ? (Number.isFinite(Number(retryAfter)) ? Number(retryAfter) * 1000 : Date.parse(retryAfter) - Date.now()) : 0;
  return { ...item, retryCount, status: retryCount >= MAX_RETRY_COUNT ? "failed" : "pending",
    retryAfterAt: Date.now() + Math.max(0, serverDelay || 0),
    nextAttemptAt: Date.now() + Math.max(serverDelay || 0, Math.min(120000, 3000 * 2 ** retryCount) + Math.random() * 2000),
    lastError: "Waiting for a connection. Your work is still saved on this device." };
}
export async function replayQueuedSubmissions(manual = false): Promise<SubmissionOutboxSnapshot> {
  if (syncing) return syncing;
  if (!isSubmissionOutboxEnabled || !getActiveLearnerId() || !navigator.onLine || document.visibilityState === "hidden" || sending) return getSubmissionOutboxSnapshot();
  if (manual && Date.now() - lastManualAttempt < 3000) return getSubmissionOutboxSnapshot();
  if (manual) lastManualAttempt = Date.now();
  const run = async () => {
    const userId = getActiveLearnerId();
    let succeeded = 0;
    sending++; emit();
    try {
      for (const item of readQueue()) {
        if (getActiveLearnerId() !== userId || !navigator.onLine || document.visibilityState === "hidden") break;
        // Legacy unowned work is preserved, never submitted as a different learner.
        if (item.userId !== userId || item.superseded || !replaySafe(item.endpoint)) continue;
        if (!manual && item.status === "failed") continue;
        if (((manual ? item.retryAfterAt : item.nextAttemptAt) || 0) > Date.now()) break;
        const attempt = manual ? { ...item, retryCount: 0 } : item;
        try {
          const response = await send(attempt);
          if (response.ok) { updateItem(item.id); succeeded++; await saved(response, item); }
          else if (transient(response.status)) { updateItem(item.id, deferred(attempt, response)); break; }
          else { updateItem(item.id, { ...item, status: "failed", lastError: "Sign in to the same account and try again, or ask your teacher." }); break; }
        } catch { updateItem(item.id, deferred(attempt)); break; }
      }
    } finally { sending--; }
    return emit({ lastSyncSucceeded: succeeded, lastSyncAt: new Date().toISOString() });
  };
  // Cross-tab lock, plus the in-tab promise, prevents overlapping replays.
  const result = (async () => navigator.locks ? await navigator.locks.request("esol-submission-replay", run) : await run())();
  syncing = result.finally(() => { syncing = null; });
  return syncing;
}
async function submitOnce(params: SubmissionParams): Promise<
  { queued: true; idempotencyKey: string } | { queued: false; response: Response; idempotencyKey: string }
> {
  const idempotencyKey = params.idempotencyKey || generateIdempotencyKey();
  const userId = getActiveLearnerId() || undefined;
  const canQueue = isSubmissionOutboxEnabled && replaySafe(params.endpoint) && !!userId;
  // Write ahead: work survives a lost response or app termination during the save.
  const item = canQueue ? queueSubmission({ ...params, idempotencyKey }) : null;
  // Keep submissions in order within an activity so an older offline answer
  // cannot arrive after a newer edit and overwrite it.
  if (item) {
    const earlier = readQueue().find(row => row.id !== item.id && row.userId === item.userId && row.endpoint === item.endpoint && row.status === "pending" && submissionScope(row.payload) === submissionScope(item.payload));
    if (earlier) return { queued: true, idempotencyKey };
  }
  sending++; emit();
  try {
    const response = await send({ ...params, idempotencyKey, userId });
    if (response.ok) { if (item) updateItem(item.id); await saved(response, { idempotencyKey, userId }); }
    else if (item && transient(response.status)) { updateItem(item.id, deferred(item, response)); return { queued: true, idempotencyKey }; }
    else if (item) updateItem(item.id, { ...item, status: "failed", lastError: "Please check your work or sign in and try again." });
    return { queued: false, response, idempotencyKey };
  } catch (error) {
    if (!item) throw error;
    updateItem(item.id, deferred(item));
    return { queued: true, idempotencyKey };
  } finally { sending--; emit(); }
}

export async function submitWithOutbox(params: SubmissionParams) {
  const owner = getActiveLearnerId();
  const run = () => {
    if (getActiveLearnerId() !== owner) throw new Error("Your account changed. Sign back in before sending this work.");
    return submitOnce(params);
  };
  return navigator.locks ? navigator.locks.request("esol-submission-replay", run) : run();
}

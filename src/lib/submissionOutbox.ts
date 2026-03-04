"use client";

import type { QueuedSubmission, SubmissionOutboxSnapshot } from "@/types/pwa";

const STORAGE_KEY = "submission-outbox-v1";
const OUTBOX_EVENT = "submissionOutboxUpdate";
const MAX_RETRY_COUNT = 5;
export const isSubmissionOutboxEnabled = process.env.NEXT_PUBLIC_ENABLE_SUBMISSION_OUTBOX === "true";

function hasWindow(): boolean {
  return typeof window !== "undefined";
}

function readQueue(): QueuedSubmission[] {
  if (!hasWindow()) return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && typeof item === "object") as QueuedSubmission[];
  } catch {
    return [];
  }
}

function writeQueue(queue: QueuedSubmission[]): void {
  if (!hasWindow()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
}

function emitOutboxUpdate(snapshot: SubmissionOutboxSnapshot): void {
  if (!hasWindow()) return;
  window.dispatchEvent(new CustomEvent(OUTBOX_EVENT, { detail: snapshot }));
}

export function getSubmissionOutboxSnapshot(extra?: Partial<SubmissionOutboxSnapshot>): SubmissionOutboxSnapshot {
  const queue = readQueue();
  const pending = queue.filter((item) => item.status === "pending").length;
  const failed = queue.filter((item) => item.status === "failed").length;
  return {
    pending,
    failed,
    syncing: false,
    ...extra,
  };
}

export function generateIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function queueSubmission(params: {
  endpoint: string;
  method: "POST" | "PUT";
  payload: unknown;
  idempotencyKey?: string;
}): QueuedSubmission {
  const queue = readQueue();
  const idempotencyKey = params.idempotencyKey || generateIdempotencyKey();

  const existing = queue.find((item) => item.idempotencyKey === idempotencyKey);
  if (existing) {
    emitOutboxUpdate(getSubmissionOutboxSnapshot());
    return existing;
  }

  const item: QueuedSubmission = {
    id: idempotencyKey,
    idempotencyKey,
    endpoint: params.endpoint,
    method: params.method,
    payload: params.payload,
    createdAt: new Date().toISOString(),
    retryCount: 0,
    status: "pending",
  };

  queue.push(item);
  writeQueue(queue);
  emitOutboxUpdate(getSubmissionOutboxSnapshot());
  return item;
}

export async function replayQueuedSubmissions(): Promise<SubmissionOutboxSnapshot> {
  if (!isSubmissionOutboxEnabled) {
    const disabledSnapshot = getSubmissionOutboxSnapshot({ syncing: false });
    emitOutboxUpdate(disabledSnapshot);
    return disabledSnapshot;
  }

  const queue = readQueue();
  if (queue.length === 0) {
    const emptySnapshot = getSubmissionOutboxSnapshot({ syncing: false });
    emitOutboxUpdate(emptySnapshot);
    return emptySnapshot;
  }

  emitOutboxUpdate(getSubmissionOutboxSnapshot({ syncing: true }));

  const nextQueue: QueuedSubmission[] = [];
  for (const item of queue) {
    if (item.retryCount >= MAX_RETRY_COUNT) {
      nextQueue.push({ ...item, status: "failed", lastError: item.lastError || "Retry limit reached" });
      continue;
    }

    try {
      const response = await fetch(item.endpoint, {
        method: item.method,
        headers: {
          "Content-Type": "application/json",
          "X-Idempotency-Key": item.idempotencyKey,
        },
        body: JSON.stringify(item.payload),
      });

      if (response.ok) {
        continue;
      }

      const body = await response.json().catch(() => ({}));
      const errorMessage = typeof body?.error === "string" ? body.error : `HTTP ${response.status}`;
      nextQueue.push({
        ...item,
        retryCount: item.retryCount + 1,
        status: response.status >= 500 ? "pending" : "failed",
        lastError: errorMessage,
      });
    } catch (error) {
      nextQueue.push({
        ...item,
        retryCount: item.retryCount + 1,
        status: "pending",
        lastError: error instanceof Error ? error.message : "Network request failed",
      });
    }
  }

  writeQueue(nextQueue);
  const snapshot = getSubmissionOutboxSnapshot({
    syncing: false,
    lastSyncAt: new Date().toISOString(),
  });
  emitOutboxUpdate(snapshot);
  return snapshot;
}

export async function submitWithOutbox(params: {
  endpoint: string;
  method: "POST" | "PUT";
  payload: unknown;
  idempotencyKey?: string;
}): Promise<
  | { queued: true; idempotencyKey: string }
  | { queued: false; response: Response; idempotencyKey: string }
> {
  const idempotencyKey = params.idempotencyKey || generateIdempotencyKey();

  if (!isSubmissionOutboxEnabled) {
    const response = await fetch(params.endpoint, {
      method: params.method,
      headers: {
        "Content-Type": "application/json",
        "X-Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(params.payload),
    });
    return { queued: false, response, idempotencyKey };
  }

  if (hasWindow() && !navigator.onLine) {
    queueSubmission({ ...params, idempotencyKey });
    return { queued: true, idempotencyKey };
  }

  try {
    const response = await fetch(params.endpoint, {
      method: params.method,
      headers: {
        "Content-Type": "application/json",
        "X-Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(params.payload),
    });
    return { queued: false, response, idempotencyKey };
  } catch {
    queueSubmission({ ...params, idempotencyKey });
    return { queued: true, idempotencyKey };
  }
}

export const submissionOutboxEventName = OUTBOX_EVENT;

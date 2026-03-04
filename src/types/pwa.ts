export type ServiceWorkerMessage =
  | { type: "SKIP_WAITING" }
  | { type: "CLEAR_USER_CACHE" }
  | { type: "QUEUE_SYNC" };

export interface SwUpdateAvailableDetail {
  waitingWorker: ServiceWorker;
}

export interface QueuedSubmission {
  id: string;
  idempotencyKey: string;
  endpoint: string;
  method: "POST" | "PUT";
  payload: unknown;
  createdAt: string;
  retryCount: number;
  status: "pending" | "failed";
  lastError?: string;
}

export interface SubmissionOutboxSnapshot {
  pending: number;
  failed: number;
  syncing: boolean;
  lastSyncAt?: string;
}

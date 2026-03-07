/**
 * Structured request logging for API routes.
 * Logs method, path, status, duration, and optional userId.
 */

import { logger } from "./logger";

export interface RequestLogContext {
  method: string;
  path: string;
  status: number;
  durationMs: number;
  userId?: string;
  requestId?: string;
}

/**
 * Log a completed API request with structured context.
 * Call this at the end of route handlers (or in a wrapper).
 */
export function logApiRequest(context: RequestLogContext): void {
  const { method, path, status, durationMs, userId, requestId } = context;

  const logContext: Record<string, unknown> = {
    method,
    path,
    status,
    durationMs,
  };
  if (userId) logContext.userId = userId;
  if (requestId) logContext.requestId = requestId;

  const level = status >= 500 ? "error" : status >= 400 ? "warn" : "info";
  const message = `API ${method} ${path} ${status} ${durationMs}ms`;

  if (level === "error") {
    logger.error(message, undefined, logContext);
  } else if (level === "warn") {
    logger.warn(message, logContext);
  } else {
    logger.info(message, logContext);
  }
}

/**
 * Wraps an API route handler to automatically log request completion.
 * Usage:
 *   return withRequestLogging(request, async () => {
 *     const session = await getServerSession(authOptions);
 *     const authErr = requireAuth(session);
 *     if (authErr) return authErr;
 *     // ... handler logic
 *     return NextResponse.json(data);
 *   }, { userId: session?.user?.id });
 */
export async function withRequestLogging<T extends Response>(
  request: Request,
  handler: () => Promise<T>,
  options?: { userId?: string; requestId?: string }
): Promise<T> {
  const start = Date.now();
  const url = new URL(request.url);
  const requestId = options?.requestId ?? crypto.randomUUID();

  try {
    const response = await handler();
    const durationMs = Date.now() - start;
    const status = response.status;

    logApiRequest({
      method: request.method,
      path: url.pathname,
      status,
      durationMs,
      userId: options?.userId,
      requestId,
    });

    return response;
  } catch (error) {
    const durationMs = Date.now() - start;
    logger.error(
      `API ${request.method} ${url.pathname} failed`,
      error instanceof Error ? error : undefined,
      {
        method: request.method,
        path: url.pathname,
        durationMs,
        userId: options?.userId,
        requestId,
      }
    );
    throw error;
  }
}

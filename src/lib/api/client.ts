/**
 * Client-side API fetch wrapper.
 * Handles JSON serialization/deserialization and throws typed errors on non-2xx responses.
 *
 * Usage:
 *   const data = await apiFetch<MyType>('/api/something', { method: 'POST', body: { key: value } });
 *   // throws ApiError on non-2xx, returns typed T on success
 */

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: unknown,
    message?: string
  ) {
    super(message ?? `API error ${status}`);
    this.name = 'ApiError';
  }

  get isUnauthorized() { return this.status === 401; }
  get isForbidden() { return this.status === 403; }
  get isNotFound() { return this.status === 404; }
  get isServerError() { return this.status >= 500; }
}

type JsonRequestInit = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

export async function apiFetch<T = unknown>(
  url: string,
  init?: JsonRequestInit
): Promise<T> {
  const { body, headers, ...rest } = init ?? {};

  const hasJsonBody = body !== undefined;

  const res = await fetch(url, {
    ...rest,
    headers: {
      ...(hasJsonBody ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    ...(hasJsonBody ? { body: JSON.stringify(body) } : {}),
  });

  let responseBody: unknown;
  const contentType = res.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    responseBody = await res.json();
  } else {
    responseBody = await res.text();
  }

  if (!res.ok) {
    const errorMessage =
      typeof responseBody === 'object' &&
      responseBody !== null &&
      'error' in responseBody
        ? String((responseBody as { error: unknown }).error)
        : `Request failed with status ${res.status}`;
    throw new ApiError(res.status, responseBody, errorMessage);
  }

  return responseBody as T;
}

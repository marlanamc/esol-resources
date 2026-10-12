/**
 * Error codes thrown from the credentials `authorize()` callback. NextAuth
 * passes the thrown message through as `signIn()`'s `result.error`, so the
 * login form can show a specific message instead of "Invalid credentials".
 */
export const LOGIN_RATE_LIMITED_ERROR = "RATE_LIMITED";

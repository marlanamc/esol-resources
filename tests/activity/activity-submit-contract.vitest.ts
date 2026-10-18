import { describe, it, expect, vi } from "vitest";
import {
  hasDuplicateSubmissionIdempotencyKey,
  normalizeAssignmentId,
  parseSubmitJsonBody,
  readIdempotencyKey,
} from "@/app/api/activity/submit/route";

// The helpers under test are pure; mock auth and Prisma so importing the route
// never needs NEXTAUTH_SECRET or DATABASE_URL.
vi.mock("@/lib/auth/auth", () => ({ authOptions: {} }));
vi.mock("@/lib/database/prisma", () => ({ prisma: {} }));

describe("activity submit contract", () => {
  it("readIdempotencyKey trims and normalizes header values", () => {
    const request = new Request("https://example.test", {
      headers: { "x-idempotency-key": "  abc-123  " },
    });
    expect(readIdempotencyKey(request)).toBe("abc-123");
    expect(readIdempotencyKey(new Request("https://example.test"))).toBeNull();
  });

  it("normalizeAssignmentId handles empty and string-null values", () => {
    expect(normalizeAssignmentId("assignment_1")).toBe("assignment_1");
    expect(normalizeAssignmentId("")).toBeNull();
    expect(normalizeAssignmentId("null")).toBeNull();
    expect(normalizeAssignmentId(undefined)).toBeNull();
  });

  it("duplicate submission detection checks idempotency key match", () => {
    expect(
      hasDuplicateSubmissionIdempotencyKey(
        JSON.stringify({ pwaLastSubmissionIdempotencyKey: "dup-key" }),
        "dup-key"
      )
    ).toBe(true);
    expect(
      hasDuplicateSubmissionIdempotencyKey(
        JSON.stringify({ pwaLastSubmissionIdempotencyKey: "older" }),
        "dup-key"
      )
    ).toBe(false);
  });

  it("parseSubmitJsonBody returns 400-style result on invalid JSON", async () => {
    const invalidJsonRequest = new Request("https://example.test", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{",
    });

    const parsed = await parseSubmitJsonBody(invalidJsonRequest);
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) {
      expect(parsed.status).toBe(400);
      expect(parsed.error).toBe("Invalid JSON in request body");
    }
  });
});

import test from "node:test";
import assert from "node:assert/strict";
import {
  hasDuplicateSubmissionIdempotencyKey,
  normalizeAssignmentId,
  parseSubmitJsonBody,
  readIdempotencyKey,
} from "@/app/api/activity/submit/route";

test("readIdempotencyKey trims and normalizes header values", () => {
  const request = new Request("https://example.test", {
    headers: { "x-idempotency-key": "  abc-123  " },
  });
  assert.equal(readIdempotencyKey(request), "abc-123");
  assert.equal(
    readIdempotencyKey(new Request("https://example.test")),
    null
  );
});

test("normalizeAssignmentId handles empty and string-null values", () => {
  assert.equal(normalizeAssignmentId("assignment_1"), "assignment_1");
  assert.equal(normalizeAssignmentId(""), null);
  assert.equal(normalizeAssignmentId("null"), null);
  assert.equal(normalizeAssignmentId(undefined), null);
});

test("duplicate submission detection checks idempotency key match", () => {
  assert.equal(
    hasDuplicateSubmissionIdempotencyKey(
      JSON.stringify({ pwaLastSubmissionIdempotencyKey: "dup-key" }),
      "dup-key"
    ),
    true
  );
  assert.equal(
    hasDuplicateSubmissionIdempotencyKey(
      JSON.stringify({ pwaLastSubmissionIdempotencyKey: "older" }),
      "dup-key"
    ),
    false
  );
});

test("parseSubmitJsonBody returns 400-style result on invalid JSON", async () => {
  const invalidJsonRequest = new Request("https://example.test", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{",
  });

  const parsed = await parseSubmitJsonBody(invalidJsonRequest);
  assert.equal(parsed.ok, false);
  if (!parsed.ok) {
    assert.equal(parsed.status, 400);
    assert.equal(parsed.error, "Invalid JSON in request body");
  }
});

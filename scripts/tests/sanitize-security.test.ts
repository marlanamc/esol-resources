import test from "node:test";
import assert from "node:assert/strict";
import { sanitizeCss, sanitizeHtml } from "@/utils/sanitize";

test("sanitizeHtml removes script tags and unsafe href schemes", () => {
  const input =
    '<p>Hello <strong>world</strong></p><script>alert(1)</script><a href="javascript:alert(1)">bad</a><a href="https://safe.example">safe</a>';

  const output = sanitizeHtml(input);
  assert.equal(output.includes("<script"), false);
  assert.equal(output.includes("javascript:"), false);
  assert.equal(output.includes("<strong>world</strong>"), true);
  assert.equal(output.includes('href="https://safe.example"'), true);
});

test("sanitizeHtml style allowlist is explicit", () => {
  const input = '<p style="color:red">Styled</p>';
  const defaultOutput = sanitizeHtml(input);
  const styledOutput = sanitizeHtml(input, { allowStyles: true });

  assert.equal(defaultOutput.includes("style="), false);
  assert.equal(styledOutput.includes("style="), true);
});

test("sanitizeCss strips import/expression/javascript payloads", () => {
  const input =
    '@import url("https://bad.site"); .x{background-image:url("javascript:alert(1)");width:expression(alert(1));}';
  const output = sanitizeCss(input);

  assert.equal(output.includes("@import"), false);
  assert.equal(output.toLowerCase().includes("javascript:"), false);
  assert.equal(output.toLowerCase().includes("expression("), false);
});


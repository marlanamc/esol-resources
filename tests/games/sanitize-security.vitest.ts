import { describe, it, expect } from "vitest";
import { sanitizeCss, sanitizeHtml } from "@/utils/sanitize";

describe("sanitize security", () => {
  it("sanitizeHtml removes script tags and unsafe href schemes", () => {
    const input =
      '<p>Hello <strong>world</strong></p><script>alert(1)</script><a href="javascript:alert(1)">bad</a><a href="https://safe.example">safe</a>';

    const output = sanitizeHtml(input);
    expect(output.includes("<script")).toBe(false);
    expect(output.includes("javascript:")).toBe(false);
    expect(output.includes("<strong>world</strong>")).toBe(true);
    expect(output.includes('href="https://safe.example"')).toBe(true);
  });

  it("sanitizeHtml style allowlist is explicit", () => {
    const input = '<p style="color:red">Styled</p>';
    const defaultOutput = sanitizeHtml(input);
    const styledOutput = sanitizeHtml(input, { allowStyles: true });

    expect(defaultOutput.includes("style=")).toBe(false);
    expect(styledOutput.includes("style=")).toBe(true);
  });

  it("sanitizeCss strips import/expression/javascript payloads", () => {
    const input =
      '@import url("https://bad.site"); .x{background-image:url("javascript:alert(1)");width:expression(alert(1));}';
    const output = sanitizeCss(input);

    expect(output.includes("@import")).toBe(false);
    expect(output.toLowerCase().includes("javascript:")).toBe(false);
    expect(output.toLowerCase().includes("expression(")).toBe(false);
  });
});

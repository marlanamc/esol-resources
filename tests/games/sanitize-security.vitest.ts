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

  it("sanitizeHtml keeps responsive image attributes on img", () => {
    const input =
      '<img src="https://images.unsplash.com/photo-1?w=1200" srcset="https://images.unsplash.com/photo-1?w=400 400w, https://images.unsplash.com/photo-1?w=800 800w" sizes="(max-width: 640px) 100vw, 800px" alt="scene" loading="lazy" />';
    const output = sanitizeHtml(input);

    expect(output.includes("srcset=")).toBe(true);
    expect(output.includes("400w")).toBe(true);
    expect(output.includes("sizes=")).toBe(true);
  });

  it("sanitizeHtml filters unsafe schemes out of srcset", () => {
    const input =
      '<img src="https://images.unsplash.com/photo-1?w=1200" srcset="javascript:alert(1) 400w" alt="scene" />';
    const output = sanitizeHtml(input);

    expect(output.toLowerCase().includes("javascript:")).toBe(false);
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

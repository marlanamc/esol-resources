import { describe, it, expect } from "vitest";
import { checkRateLimit, getClientIp } from "@/lib/api/rate-limit";

describe("rate limit", () => {
  it("allows requests under limit", async () => {
    const key = `test:${Date.now()}:${Math.random()}`;
    await expect(checkRateLimit(key, { limit: 5, windowSeconds: 60 })).resolves.toBe(true);
    await expect(checkRateLimit(key, { limit: 5, windowSeconds: 60 })).resolves.toBe(true);
  });

  it("blocks requests over limit", async () => {
    const key = `test:overflow:${Date.now()}`;
    const options = { limit: 2, windowSeconds: 60 };
    await expect(checkRateLimit(key, options)).resolves.toBe(true);
    await expect(checkRateLimit(key, options)).resolves.toBe(true);
    await expect(checkRateLimit(key, options)).resolves.toBe(false);
  });

  it("getClientIp extracts from x-forwarded-for", () => {
    const request = new Request("https://example.com", {
      headers: { "x-forwarded-for": " 192.168.1.1, 10.0.0.1 " },
    });
    expect(getClientIp(request)).toBe("192.168.1.1");
  });

  it("getClientIp extracts from x-real-ip", () => {
    const request = new Request("https://example.com", {
      headers: { "x-real-ip": "203.0.113.1" },
    });
    expect(getClientIp(request)).toBe("203.0.113.1");
  });
});

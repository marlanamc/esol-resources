import { afterEach, describe, expect, it, vi } from "vitest";
import {
    handleExternalLinkClick,
    isIOSUserAgent,
    shouldEscapeToSafari,
    toSafariEscapeUrl,
} from "@/lib/shared/open-external-link";

const IPHONE_UA =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
const IPAD_UA =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15";
const ANDROID_UA =
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36";

type StubOptions = {
    userAgent?: string;
    maxTouchPoints?: number;
    standalone?: boolean;
};

/**
 * The vitest environment is `node`, so there is no window to work with. These
 * helpers only read a handful of properties, so a minimal stub is enough to
 * exercise the platform gate without pulling in jsdom.
 */
function stubWindow({
    userAgent = IPHONE_UA,
    maxTouchPoints = 5,
    standalone = true,
}: StubOptions = {}) {
    vi.stubGlobal("window", {
        matchMedia: (query: string) => ({
            matches: standalone && query.includes("standalone"),
        }),
        navigator: { userAgent, maxTouchPoints, standalone },
    });
}

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("toSafariEscapeUrl", () => {
    it("rewrites https URLs to the x-safari scheme", () => {
        expect(toSafariEscapeUrl("https://classroom.google.com/c/abc123")).toBe(
            "x-safari-https://classroom.google.com/c/abc123"
        );
    });

    it("rewrites http URLs", () => {
        expect(toSafariEscapeUrl("http://example.com/page")).toBe(
            "x-safari-http://example.com/page"
        );
    });

    it("preserves query strings and fragments", () => {
        expect(toSafariEscapeUrl("https://docs.google.com/forms/d/e/x/viewform?usp=sf_link#top")).toBe(
            "x-safari-https://docs.google.com/forms/d/e/x/viewform?usp=sf_link#top"
        );
    });

    it("returns null for non-http(s) schemes", () => {
        expect(toSafariEscapeUrl("javascript:alert(1)")).toBeNull();
        expect(toSafariEscapeUrl("mailto:teacher@example.com")).toBeNull();
    });

    it("returns null for unparseable input", () => {
        expect(toSafariEscapeUrl("not-a-url")).toBeNull();
        expect(toSafariEscapeUrl("")).toBeNull();
    });
});

describe("isIOSUserAgent", () => {
    it("detects iPhone and iPod", () => {
        expect(isIOSUserAgent(IPHONE_UA)).toBe(true);
        expect(isIOSUserAgent("Mozilla/5.0 (iPod touch; CPU iPhone OS 15_0 like Mac OS X)")).toBe(true);
    });

    it("detects iPadOS reporting a desktop user agent via multi-touch", () => {
        expect(isIOSUserAgent(IPAD_UA, 5)).toBe(true);
    });

    it("does not mistake a real Mac for an iPad", () => {
        expect(isIOSUserAgent(IPAD_UA, 0)).toBe(false);
    });

    it("rejects Android", () => {
        expect(isIOSUserAgent(ANDROID_UA, 5)).toBe(false);
    });
});

describe("shouldEscapeToSafari", () => {
    const href = "https://classroom.google.com/c/abc123";

    it("is true for an iOS home-screen web app", () => {
        stubWindow();
        expect(shouldEscapeToSafari(href)).toBe(true);
    });

    it("is false in an ordinary iOS Safari tab", () => {
        stubWindow({ standalone: false });
        expect(shouldEscapeToSafari(href)).toBe(false);
    });

    it("is false on a non-iOS platform even in standalone mode", () => {
        stubWindow({ userAgent: ANDROID_UA });
        expect(shouldEscapeToSafari(href)).toBe(false);
    });

    it("is false for a URL the scheme cannot express", () => {
        stubWindow();
        expect(shouldEscapeToSafari("mailto:teacher@example.com")).toBe(false);
    });

    it("is false during server rendering", () => {
        expect(shouldEscapeToSafari(href)).toBe(false);
    });
});

describe("handleExternalLinkClick", () => {
    const href = "https://classroom.google.com/c/abc123";

    function clickEvent(overrides: Record<string, unknown> = {}) {
        return {
            defaultPrevented: false,
            button: 0,
            metaKey: false,
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
            preventDefault: vi.fn(),
            ...overrides,
        } as unknown as Parameters<typeof handleExternalLinkClick>[0] & {
            preventDefault: ReturnType<typeof vi.fn>;
        };
    }

    it("leaves the native target=_blank behavior alone outside an iOS PWA", () => {
        stubWindow({ standalone: false });
        const event = clickEvent();
        handleExternalLinkClick(event, href);
        expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it("does not hijack modified clicks", () => {
        stubWindow();
        for (const modifier of ["metaKey", "ctrlKey", "shiftKey", "altKey"]) {
            const event = clickEvent({ [modifier]: true });
            handleExternalLinkClick(event, href);
            expect(event.preventDefault).not.toHaveBeenCalled();
        }
    });

    it("does not hijack middle clicks", () => {
        stubWindow();
        const event = clickEvent({ button: 1 });
        handleExternalLinkClick(event, href);
        expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it("ignores an already-handled event", () => {
        stubWindow();
        const event = clickEvent({ defaultPrevented: true });
        handleExternalLinkClick(event, href);
        expect(event.preventDefault).not.toHaveBeenCalled();
    });
});

import { afterEach, describe, expect, it } from "vitest";
import { getHelpfulLinks } from "@/lib/helpful-links";

const ENV_KEYS = [
    "NEXT_PUBLIC_GOOGLE_CLASSROOM_URL",
    "NEXT_PUBLIC_ABSENCE_FORM_URL",
    "NEXT_PUBLIC_ADVISOR_BULLETIN_BOARD_URL",
] as const;

function withEnv(overrides: Record<string, string | undefined>, fn: () => void) {
    const previous: Record<string, string | undefined> = {};
    for (const key of ENV_KEYS) {
        previous[key] = process.env[key];
    }

    for (const [key, value] of Object.entries(overrides)) {
        if (value === undefined) {
            delete process.env[key];
        } else {
            process.env[key] = value;
        }
    }

    try {
        fn();
    } finally {
        for (const key of ENV_KEYS) {
            const value = previous[key];
            if (value === undefined) {
                delete process.env[key];
            } else {
                process.env[key] = value;
            }
        }
    }
}

describe("getHelpfulLinks", () => {
    afterEach(() => {
        for (const key of ENV_KEYS) {
            delete process.env[key];
        }
    });

    it("returns an empty list when all env vars are unset", () => {
        withEnv(
            {
                NEXT_PUBLIC_GOOGLE_CLASSROOM_URL: undefined,
                NEXT_PUBLIC_ABSENCE_FORM_URL: undefined,
                NEXT_PUBLIC_ADVISOR_BULLETIN_BOARD_URL: undefined,
            },
            () => {
                expect(getHelpfulLinks()).toEqual([]);
            }
        );
    });

    it("includes valid https URLs with stable ids and labels", () => {
        withEnv(
            {
                NEXT_PUBLIC_GOOGLE_CLASSROOM_URL: "https://classroom.google.com/c/abc123",
                NEXT_PUBLIC_ABSENCE_FORM_URL: "https://docs.google.com/forms/d/e/xyz/viewform",
                NEXT_PUBLIC_ADVISOR_BULLETIN_BOARD_URL: "https://ebhcsjobboard.web.app/",
            },
            () => {
                expect(getHelpfulLinks()).toEqual([
                    {
                        id: "google-classroom",
                        label: "Google Classroom",
                        href: "https://classroom.google.com/c/abc123",
                    },
                    {
                        id: "absence-form",
                        label: "Absence form",
                        href: "https://docs.google.com/forms/d/e/xyz/viewform",
                    },
                    {
                        id: "advisor-bulletin-board",
                        label: "Advisor Bulletin Board",
                        href: "https://ebhcsjobboard.web.app/",
                    },
                ]);
            }
        );
    });

    it("omits invalid or non-http(s) URLs", () => {
        withEnv(
            {
                NEXT_PUBLIC_GOOGLE_CLASSROOM_URL: "javascript:alert(1)",
                NEXT_PUBLIC_ABSENCE_FORM_URL: "not-a-url",
            },
            () => {
                expect(getHelpfulLinks()).toEqual([]);
            }
        );
    });

    it("includes only the links with valid env values", () => {
        withEnv(
            {
                NEXT_PUBLIC_GOOGLE_CLASSROOM_URL: "  https://classroom.google.com/c/trimmed  ",
                NEXT_PUBLIC_ABSENCE_FORM_URL: undefined,
            },
            () => {
                expect(getHelpfulLinks()).toEqual([
                    {
                        id: "google-classroom",
                        label: "Google Classroom",
                        href: "https://classroom.google.com/c/trimmed",
                    },
                ]);
            }
        );
    });
});

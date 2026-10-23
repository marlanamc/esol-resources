import { describe, expect, it } from "vitest";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const options = { fields: {}, shouldUseNativeValidation: false };

describe("form validation compatibility", () => {
    it("returns field errors for empty credentials instead of rejecting submission", async () => {
        const resolve = zodResolver(z.object({
            username: z.string().min(1, "Username is required"),
            password: z.string().min(1, "Password is required"),
        }));

        const result = await resolve({ username: "", password: "" }, undefined, options);

        expect(result.values).toEqual({});
        expect(result.errors).toMatchObject({
            username: { message: "Username is required" },
            password: { message: "Password is required" },
        });
    });

    it("preserves valid values and form defaults", async () => {
        const resolve = zodResolver(z.object({
            title: z.string().min(1),
            syncToSectionGroup: z.boolean().default(true),
        }));

        const result = await resolve({ title: "Practice" }, undefined, options);

        expect(result.errors).toEqual({});
        expect(result.values).toEqual({ title: "Practice", syncToSectionGroup: true });
    });

    it("attaches password confirmation errors to the confirmation field", async () => {
        const resolve = zodResolver(z.object({
            password: z.string().min(8),
            confirmPassword: z.string(),
        }).refine((value) => value.password === value.confirmPassword, {
            path: ["confirmPassword"],
            message: "Passwords do not match",
        }));

        const result = await resolve({
            password: "example-password",
            confirmPassword: "different-password",
        }, undefined, options);

        expect(result.errors).toMatchObject({
            confirmPassword: { message: "Passwords do not match" },
        });
    });
});

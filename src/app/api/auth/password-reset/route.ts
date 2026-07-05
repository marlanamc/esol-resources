import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import bcrypt from "bcryptjs";
import { BCRYPT_ROUNDS, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH, DEFAULT_PASSWORD_BLOCKED_MESSAGE, isDisallowedPassword } from "@/lib/auth/config";
import { checkRateLimit, authRateLimitKey } from "@/lib/api/rate-limit";
import { ApiErrors, apiError, handleApiError } from "@/lib/api/response";

export async function POST(request: Request) {
    const key = authRateLimitKey(request, "password-reset");
    if (!(await checkRateLimit(key))) {
        return ApiErrors.rateLimited("Too many password reset attempts. Please try again later.");
    }

    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return ApiErrors.unauthorized();
    }

    try {
        const { newPassword, currentPassword } = await request.json().catch(() => ({}));

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (!user) {
            return ApiErrors.unauthorized();
        }

        if (!user.mustChangePassword) {
            if (!currentPassword || typeof currentPassword !== "string") {
                return apiError("Current password is required.", 400);
            }

            const passwordMatches = await bcrypt.compare(currentPassword, user.password || "");
            if (!passwordMatches) {
                return apiError("Current password is incorrect.", 400);
            }
        }

        // SECURITY: Validate password length (min and max)
        if (!newPassword || typeof newPassword !== "string") {
            return apiError("Invalid password format.", 400);
        }

        if (newPassword.length < MIN_PASSWORD_LENGTH) {
            return apiError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`, 400);
        }

        if (newPassword.length > MAX_PASSWORD_LENGTH) {
            return apiError(`Password must not exceed ${MAX_PASSWORD_LENGTH} characters.`, 400);
        }
        if (isDisallowedPassword(newPassword)) {
            return apiError(DEFAULT_PASSWORD_BLOCKED_MESSAGE, 400);
        }

        // SECURITY: Use industry-standard bcrypt rounds (12 in 2025)
        const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                password: passwordHash,
                mustChangePassword: false,
            },
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        return handleApiError(error, {
            defaultMessage: "Failed to update password",
            userId: session.user.id,
            path: "/api/auth/password-reset",
        });
    }
}




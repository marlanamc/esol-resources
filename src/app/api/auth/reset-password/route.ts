/**
 * Reset Password API
 * POST: Reset password using a token
 * GET: Validate a reset token
 */

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { apiError, apiSuccess, handleApiError } from '@/lib/api-response';
import { logger } from '@/lib/logger';
import { headers } from 'next/headers';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

interface ResetPasswordRequest {
    token: string;
    password: string;
}

// Password requirements
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

/**
 * GET /api/auth/reset-password?token=xxx
 * Validate a reset token
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json({ valid: false, error: 'Token is required' });
        }

        // Find user with this token
        const user = await prisma.user.findFirst({
            where: {
                passwordResetToken: token,
                passwordResetExpires: {
                    gt: new Date(),
                },
            },
            select: {
                id: true,
                username: true,
            },
        });

        if (!user) {
            return NextResponse.json({
                valid: false,
                error: 'This reset link is invalid or has expired',
            });
        }

        return NextResponse.json({
            valid: true,
            username: user.username,
        });
    } catch (error) {
        return handleApiError(error, {
            defaultMessage: 'Failed to validate reset token',
        });
    }
}

/**
 * POST /api/auth/reset-password
 * Reset password using a valid token
 */
export async function POST(request: Request) {
    try {
        // Rate limit by IP
        const reqHeaders = await headers();
        const ip = getClientIp(reqHeaders);
        const rateLimitKey = `auth:reset-password:${ip}`;

        if (!checkRateLimit(rateLimitKey, { limit: 5, windowSeconds: 60 })) {
            logger.warn('Password reset rate limit exceeded', { ip });
            return apiError('Too many requests. Please try again later.', 429, 'RATE_LIMITED');
        }

        const body = (await request.json()) as ResetPasswordRequest;
        const { token, password } = body;

        if (!token) {
            return apiError('Reset token is required', 400, 'MISSING_TOKEN');
        }

        if (!password) {
            return apiError('Password is required', 400, 'MISSING_PASSWORD');
        }

        if (password.length < MIN_PASSWORD_LENGTH) {
            return apiError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`, 400, 'INVALID_PASSWORD');
        }

        if (password.length > MAX_PASSWORD_LENGTH) {
            return apiError(`Password must be at most ${MAX_PASSWORD_LENGTH} characters`, 400, 'INVALID_PASSWORD');
        }

        // Find user with this token
        const user = await prisma.user.findFirst({
            where: {
                passwordResetToken: token,
                passwordResetExpires: {
                    gt: new Date(),
                },
            },
            select: {
                id: true,
                username: true,
            },
        });

        if (!user) {
            return apiError('This reset link is invalid or has expired', 400, 'INVALID_TOKEN');
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Update user password and clear reset token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                passwordResetToken: null,
                passwordResetExpires: null,
                mustChangePassword: false,
            },
        });

        logger.info('Password reset completed', {
            userId: user.id,
            username: user.username,
        });

        return apiSuccess(undefined, 200, 'Password has been reset. You can now sign in with your new password.');
    } catch (error) {
        return handleApiError(error, {
            defaultMessage: 'Failed to reset password',
        });
    }
}

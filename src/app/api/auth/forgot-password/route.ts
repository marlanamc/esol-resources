/**
 * Forgot Password API
 * POST: Request a password reset link
 */

import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { prisma } from '@/lib/prisma';
import { apiError, apiSuccess, handleApiError } from '@/lib/api-response';
import { sendEmail, generatePasswordResetEmail } from '@/lib/email';
import { logger } from '@/lib/logger';
import { headers } from 'next/headers';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

interface ForgotPasswordRequest {
    email: string;
}

// Token expires in 1 hour
const TOKEN_EXPIRY_MS = 60 * 60 * 1000;

/**
 * POST /api/auth/forgot-password
 * Request a password reset link
 */
export async function POST(request: Request) {
    try {
        // Rate limit by IP - strict limit for password reset
        const reqHeaders = await headers();
        const ip = getClientIp(reqHeaders);
        const rateLimitKey = `auth:forgot-password:${ip}`;

        if (!checkRateLimit(rateLimitKey, { limit: 3, windowSeconds: 60 })) {
            logger.warn('Forgot password rate limit exceeded', { ip });
            return apiError('Too many requests. Please try again later.', 429, 'RATE_LIMITED');
        }

        const body = (await request.json()) as ForgotPasswordRequest;
        const { email: rawEmail } = body;

        if (!rawEmail || typeof rawEmail !== 'string') {
            return apiError('Email is required', 400, 'MISSING_EMAIL');
        }

        const email = rawEmail.trim().toLowerCase();

        // Basic email format validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return apiError('Please enter a valid email address', 400, 'INVALID_EMAIL');
        }

        // Find user by email
        const user = await prisma.user.findFirst({
            where: { email },
            select: {
                id: true,
                username: true,
                email: true,
            },
        });

        // Always return success to prevent email enumeration attacks
        // But only send email if user exists
        if (!user) {
            logger.info('Password reset requested for non-existent email', { email });
            return apiSuccess(undefined, 200, 'If an account exists with that email, a reset link has been sent.');
        }

        // Generate secure reset token
        const resetToken = randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + TOKEN_EXPIRY_MS);

        // Save token to user
        await prisma.user.update({
            where: { id: user.id },
            data: {
                passwordResetToken: resetToken,
                passwordResetExpires: resetExpires,
            },
        });

        // Build reset URL
        const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

        // Generate email content
        const { html, text } = generatePasswordResetEmail({
            resetUrl,
            username: user.username,
        });

        // Send email
        const emailResult = await sendEmail({
            to: user.email!,
            subject: 'Reset Your Class Companion Password',
            html,
            text,
        });

        if (!emailResult.success) {
            logger.error('Failed to send password reset email', undefined, {
                userId: user.id,
                error: emailResult.error,
            });
            // Don't expose email failure to user
        } else {
            logger.info('Password reset email sent', {
                userId: user.id,
                email: user.email,
            });
        }

        return apiSuccess(undefined, 200, 'If an account exists with that email, a reset link has been sent.');
    } catch (error) {
        return handleApiError(error, {
            defaultMessage: 'Failed to process password reset request',
        });
    }
}

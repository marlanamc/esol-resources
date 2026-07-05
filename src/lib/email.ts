/**
 * Email service utilities
 *
 * Uses Resend for sending emails. Set RESEND_API_KEY in environment variables.
 * If no API key is configured, emails will be logged to console in development.
 */

import { logger } from '@/lib/shared/logger';

interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

interface SendEmailResult {
    success: boolean;
    messageId?: string;
    error?: string;
}

/**
 * Send an email using Resend
 * Falls back to console logging if RESEND_API_KEY is not configured
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
    const { to, subject, html, text } = params;
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.EMAIL_FROM || 'ESOL Class Companion <noreply@myesolclass.com>';

    // If no API key, log to console in development
    if (!apiKey) {
        if (process.env.NODE_ENV === 'development') {
            logger.info('Email would be sent (no RESEND_API_KEY configured)', {
                to,
                subject,
                html: html.substring(0, 200) + '...',
            });
            return { success: true, messageId: 'dev-mock-id' };
        }

        logger.error('Cannot send email: RESEND_API_KEY not configured');
        return { success: false, error: 'Email service not configured' };
    }

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: fromEmail,
                to: [to],
                subject,
                html,
                text: text || html.replace(/<[^>]*>/g, ''),
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            logger.error('Failed to send email', undefined, {
                status: response.status,
                error: errorData,
            });
            return {
                success: false,
                error: errorData.message || 'Failed to send email',
            };
        }

        const data = await response.json();
        logger.info('Email sent successfully', { to, subject, messageId: data.id });

        return { success: true, messageId: data.id };
    } catch (error) {
        logger.error('Email send error', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Generate password reset email HTML
 */
export function generatePasswordResetEmail(params: {
    resetUrl: string;
    username: string;
}): { html: string; text: string } {
    const { resetUrl, username } = params;

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #2b3a4a; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #d97757; font-size: 28px; margin: 0;">ESOL Class Companion</h1>
    </div>

    <div style="background: #fef9f3; border-radius: 12px; padding: 30px; border: 1px solid #e5e5e5;">
        <h2 style="margin-top: 0; font-size: 20px;">Reset Your Password</h2>

        <p>Hi ${username},</p>

        <p>We received a request to reset your password. Click the button below to create a new password:</p>

        <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #d97757; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
                Reset Password
            </a>
        </div>

        <p style="color: #666; font-size: 14px;">This link will expire in 1 hour.</p>

        <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
    </div>

    <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
        <p>ESOL Class Companion</p>
    </div>
</body>
</html>
    `.trim();

    const text = `
Reset Your Password

Hi ${username},

We received a request to reset your password. Visit this link to create a new password:

${resetUrl}

This link will expire in 1 hour.

If you didn't request this, you can safely ignore this email.

ESOL Class Companion
    `.trim();

    return { html, text };
}

/**
 * User Registration API
 * POST: Create a new independent learner account with invite code
 */

import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/database/prisma';
import { apiError, apiSuccess, handleApiError } from '@/lib/api/response';
import { normalizeInviteCode, isValidInviteCodeFormat } from '@/lib/invite-code';
import { logger } from '@/lib/shared/logger';
import { headers } from 'next/headers';
import { checkRateLimit, getClientIp } from '@/lib/api/rate-limit';

interface RegisterRequestBody {
  inviteCode: string;
  username: string;
  email: string;
  password: string;
}

// Password requirements
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

// Username requirements
const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 30;
const USERNAME_PATTERN = /^[a-z0-9_-]+$/;

/**
 * Validate username format
 */
function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username || typeof username !== 'string') {
    return { valid: false, error: 'Username is required' };
  }

  const normalized = username.trim().toLowerCase();

  if (normalized.length < MIN_USERNAME_LENGTH) {
    return { valid: false, error: `Username must be at least ${MIN_USERNAME_LENGTH} characters` };
  }

  if (normalized.length > MAX_USERNAME_LENGTH) {
    return { valid: false, error: `Username must be at most ${MAX_USERNAME_LENGTH} characters` };
  }

  if (!USERNAME_PATTERN.test(normalized)) {
    return { valid: false, error: 'Username can only contain lowercase letters, numbers, underscores, and hyphens' };
  }

  return { valid: true };
}

/**
 * Validate email format
 */
function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }

  const normalized = email.trim().toLowerCase();

  // Basic email format check
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(normalized)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }

  return { valid: true };
}

/**
 * Validate password strength
 */
function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required' };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return { valid: false, error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` };
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    return { valid: false, error: `Password must be at most ${MAX_PASSWORD_LENGTH} characters` };
  }

  return { valid: true };
}

/**
 * POST /api/auth/register
 * Create a new user account with an invite code
 */
export async function POST(request: Request) {
  try {
    // Rate limit by IP
    const reqHeaders = await headers();
    const ip = getClientIp(reqHeaders);
    const rateLimitKey = `auth:register:${ip}`;

    if (!(await checkRateLimit(rateLimitKey, { limit: 5, windowSeconds: 60 }))) {
      logger.warn('Registration rate limit exceeded', { ip });
      return apiError('Too many registration attempts. Please try again later.', 429, 'RATE_LIMITED');
    }

    const body = (await request.json()) as RegisterRequestBody;
    const { inviteCode: rawInviteCode, username: rawUsername, email: rawEmail, password } = body;

    // Validate invite code format
    if (!rawInviteCode) {
      return apiError('Invite code is required', 400, 'MISSING_INVITE_CODE');
    }

    const inviteCode = normalizeInviteCode(rawInviteCode);
    if (!isValidInviteCodeFormat(inviteCode)) {
      return apiError('Invalid invite code format', 400, 'INVALID_INVITE_CODE');
    }

    // Validate username
    const usernameValidation = validateUsername(rawUsername);
    if (!usernameValidation.valid) {
      return apiError(usernameValidation.error!, 400, 'INVALID_USERNAME');
    }
    const username = rawUsername.trim().toLowerCase();

    // Validate email
    const emailValidation = validateEmail(rawEmail);
    if (!emailValidation.valid) {
      return apiError(emailValidation.error!, 400, 'INVALID_EMAIL');
    }
    const email = rawEmail.trim().toLowerCase();

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return apiError(passwordValidation.error!, 400, 'INVALID_PASSWORD');
    }

    // Verify invite code exists and is valid
    const invite = await prisma.inviteLink.findUnique({
      where: { code: inviteCode },
      select: {
        id: true,
        isActive: true,
        expiresAt: true,
        createdById: true,
      },
    });

    if (!invite) {
      return apiError('Invalid invite code', 400, 'INVALID_INVITE_CODE');
    }

    if (!invite.isActive) {
      return apiError('This invite link is no longer active', 400, 'INVITE_INACTIVE');
    }

    if (invite.expiresAt && invite.expiresAt < new Date()) {
      return apiError('This invite link has expired', 400, 'INVITE_EXPIRED');
    }

    // Check for existing username
    const existingUsername = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (existingUsername) {
      return apiError('This username is already taken', 409, 'USERNAME_TAKEN');
    }

    // Check for existing email
    const existingEmail = await prisma.user.findFirst({
      where: { email },
      select: { id: true },
    });

    if (existingEmail) {
      return apiError('An account with this email already exists', 409, 'EMAIL_TAKEN');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user and preferences in a transaction
    const user = await prisma.$transaction(async (tx) => {
      // Create the user
      const newUser = await tx.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          role: 'student',
          mustChangePassword: false, // Independent users set their own password
        },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
        },
      });

      // Create default preferences. Independent status is derived from no active enrollment.
      await tx.userPreferences.create({
        data: {
          userId: newUser.id,
        },
      });

      return newUser;
    });

    logger.info('New independent learner registered', {
      userId: user.id,
      username: user.username,
      inviteCode,
      invitedById: invite.createdById,
    });

    return apiSuccess({
      id: user.id,
      username: user.username,
      email: user.email,
      message: 'Account created successfully. You can now sign in.',
    }, 201);
  } catch (error) {
    return handleApiError(error, {
      defaultMessage: 'Failed to create account',
    });
  }
}

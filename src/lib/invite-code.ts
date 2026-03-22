/**
 * Invite code generation utilities
 */

import { randomBytes } from 'crypto';

/**
 * Characters used for invite codes
 * Excludes confusing characters like 0/O, 1/I/l
 */
const INVITE_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/**
 * Default invite code length
 */
const INVITE_CODE_LENGTH = 8;

/**
 * Generate a random invite code
 * Format: 8 characters, alphanumeric, easy to read
 * Example: "K7M3X9PQ"
 */
export function generateInviteCode(length = INVITE_CODE_LENGTH): string {
  const bytes = randomBytes(length);
  let code = '';

  for (let i = 0; i < length; i++) {
    code += INVITE_CODE_CHARS[bytes[i] % INVITE_CODE_CHARS.length];
  }

  return code;
}

/**
 * Validate invite code format
 * Returns true if the code matches expected format
 */
export function isValidInviteCodeFormat(code: string): boolean {
  if (!code || typeof code !== 'string') {
    return false;
  }

  // Must be correct length
  if (code.length !== INVITE_CODE_LENGTH) {
    return false;
  }

  // Must only contain valid characters
  const validChars = new Set(INVITE_CODE_CHARS);
  return code.toUpperCase().split('').every((char) => validChars.has(char));
}

/**
 * Normalize an invite code (uppercase, trim whitespace)
 */
export function normalizeInviteCode(code: string): string {
  return code.trim().toUpperCase();
}

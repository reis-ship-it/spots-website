import { randomBytes } from 'crypto';

/**
 * Generate a cryptographically secure random token
 */
export function generateAccessToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Calculate token expiration date
 */
export function getTokenExpiration(days: number = 30): Date {
  const expiration = new Date();
  expiration.setDate(expiration.getDate() + days);
  return expiration;
}


import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

/**
 * Hashes a plaintext password.
 *
 * @param password - The plaintext password to hash.
 * @returns The bcrypt hash.
 *
 * @example
 *   const hash = await hashPassword('s3cr3t');
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verifies a plaintext password against a stored bcrypt hash.
 *
 * @param password - The plaintext password to verify.
 * @param hash - The stored bcrypt hash.
 * @returns `true` when the password matches the hash, `false` otherwise.
 *
 * @example
 *   const valid = await verifyPassword('s3cr3t', storedHash);
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

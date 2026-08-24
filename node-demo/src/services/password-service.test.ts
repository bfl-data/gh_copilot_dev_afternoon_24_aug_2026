import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from './password-service.js';

describe('password-service', () => {
  it('hashes a password to a non-empty string different from the input', async () => {
    const hash = await hashPassword('s3cr3t');
    expect(hash).toBeTruthy();
    expect(hash).not.toBe('s3cr3t');
  });

  it('verifies a correct password against its hash', async () => {
    const hash = await hashPassword('correct');
    const result = await verifyPassword('correct', hash);
    expect(result).toBe(true);
  });

  it('rejects an incorrect password', async () => {
    const hash = await hashPassword('correct');
    const result = await verifyPassword('wrong', hash);
    expect(result).toBe(false);
  });

  it('returns false for an empty hash string', async () => {
    const result = await verifyPassword('anything', '');
    expect(result).toBe(false);
  });
});

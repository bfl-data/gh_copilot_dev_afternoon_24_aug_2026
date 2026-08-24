import type { Request, Response } from 'express';
import { logger } from '../lib/logger.js';
import { authCredentialsSchema } from '../schemas/auth-schema.js';
import { hashPassword, verifyPassword } from '../services/password-service.js';

interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
}

/** In-memory user store for the demo. Keyed by email. */
const users = new Map<string, StoredUser>();

export const authController = {
  /**
   * Registers a new user with email and password.
   *
   * @param req - Express request. Body: `{ email, password }`.
   * @param res - Express response.
   * @returns 201 with `{ id, email }` on success.
   * @throws {ZodError} When the body fails schema validation — the global
   *   error handler converts it to a 400.
   *
   * @example
   *   POST /auth/register { "email": "a@b.com", "password": "s3cr3t" }
   *   → 201 { "id": "…", "email": "a@b.com" }
   */
  register: async (req: Request, res: Response) => {
    const { email, password } = authCredentialsSchema.parse(req.body);

    if (users.has(email)) {
      return res.status(409).json({ error: { code: 'CONFLICT', message: 'email already registered' } });
    }

    const passwordHash = await hashPassword(password);
    const id = crypto.randomUUID();
    users.set(email, { id, email, passwordHash });

    logger.info({ email }, 'User registered');
    return res.status(201).json({ id, email });
  },

  /**
   * Authenticates a user by email and password.
   *
   * @param req - Express request. Body: `{ email, password }`.
   * @param res - Express response.
   * @returns 200 with `{ id, email }` on success.
   * @throws {ZodError} When the body fails schema validation — the global
   *   error handler converts it to a 400.
   *
   * @example
   *   POST /auth/login { "email": "a@b.com", "password": "s3cr3t" }
   *   → 200 { "id": "…", "email": "a@b.com" }
   */
  login: async (req: Request, res: Response) => {
    const { email, password } = authCredentialsSchema.parse(req.body);

    const user = users.get(email);
    const passwordHash = user?.passwordHash ?? '';
    const valid = await verifyPassword(password, passwordHash);

    if (!user || !valid) {
      logger.warn({ email }, 'Login failed: invalid credentials');
      return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'invalid credentials' } });
    }

    logger.info({ email }, 'User logged in');
    return res.status(200).json({ id: user.id, email: user.email });
  },
};

import { z } from 'zod';

/** Request body for `POST /auth/register` and `POST /auth/login`. */
export const authCredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type AuthCredentials = z.infer<typeof authCredentialsSchema>;

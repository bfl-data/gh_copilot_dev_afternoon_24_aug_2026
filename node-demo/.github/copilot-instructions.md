# Copilot Instructions

## Project Overview

- This is a small Express 5 service written in TypeScript and run as native ESM.
- The project requires Node.js 20 or newer.
- The current data stores are in-memory demo stores. Do not describe them as durable persistence or add database assumptions without an explicit request.

## Repository Structure

- `src/index.ts`: Express app setup, route registration, 404 handling, and the global error handler.
- `src/controllers/`: HTTP request handlers and response mapping.
- `src/schemas/`: Zod schemas and inferred request types.
- `src/middleware/`: Express middleware such as `asyncHandler`.
- `src/lib/`: shared infrastructure, including the Pino logger.
- `src/utils/`: small, reusable, independently testable utilities.
- `src/config.ts`: the only module permitted to read `process.env`.


## Language & Framework

- TypeScript with strict mode. No `any`. Prefer `unknown` and narrow.
- Node.js 20 LTS, Express 4.x.
- ESM imports (`import x from 'y'`). Never CommonJS `require`.
- Native `crypto` for UUIDs (`crypto.randomUUID()`). Not the `uuid` npm package.


## Architecture

- Layered: route → controller → service → repository.
- Controllers parse + validate requests, call services, format responses. No business logic.
- Services hold business logic. Throw domain errors. Never touch `res`.
- Repositories are pure data access — no business rules.
- Each layer depends only on the one directly below it.
- After creating or modifying a code, always create unit tests for it. Do not skip tests.

## Validation & Errors

- Validate request inputs with Zod schemas in `src/schemas/`.
- On invalid input, the schema throws. A global error handler converts to 400 with:
  `{ error: { code, message, details } }`.
- Use `async/await`. Never `.then()` chains.
- Wrap async controllers with `asyncHandler` middleware.
- Do not use `try/catch` to swallow errors. Let them bubble.

## Naming

- `camelCase` for variables and functions.
- `PascalCase` for types, interfaces, classes.
- File names: `kebab-case.ts`. Test files: `*.test.ts` alongside source.

## TypeScript and Modules

- Preserve strict TypeScript compatibility. The compiler enables `strict`, `noUncheckedIndexedAccess`, `noUnusedLocals`, and `noUnusedParameters`.
- Use ESM imports with explicit `.js` extensions for local TypeScript modules, for example `import { config } from './config.js';`.
- Use type-only imports where appropriate: `import type { Request, Response } from 'express';`.
- Avoid `any`, non-null assertions, and unused variables or parameters. Prefix intentionally unused Express parameters with `_`.
- Keep the existing public function and controller APIs unless the task explicitly requires a breaking change.

## Configuration and Logging

- Read environment variables only through `src/config.ts`; add new settings there with a sensible fallback and export them via `config`.
- Use the shared `logger` from `src/lib/logger.ts`; do not use `console.log` or create additional logger instances.
- Use structured logging with the context object first and message second, for example `logger.info({ userId }, 'User created')`.
- Never log passwords, password hashes, tokens, or other secrets. The shared logger redacts password-related fields and authorization headers, but callers should still avoid passing sensitive data unnecessarily.

## HTTP and Controllers

- Keep controllers focused on HTTP orchestration: parse input, call the relevant logic, mutate the appropriate store, log meaningful events, and return the response.
- Register every async controller through `asyncHandler` so rejected promises reach the global error handler. Do not swallow errors with controller-level `try/catch` blocks.
- Validate request bodies and route parameters with Zod schemas. Prefer `.parse()` when validation failures should be handled centrally by the global error handler.
- Follow the existing status and response conventions:
	- `201` for successful creation.
	- `200` for successful reads and login.
	- `400` for malformed or failed validation, with the `VALIDATION_FAILED` error envelope for Zod failures.
	- `401` for invalid credentials without revealing whether an account exists.
	- `404` for unknown routes or missing resources.
	- `409` for duplicate registration conflicts.
	- `500` for unexpected failures; do not expose internal error details.
- Use structured resource errors such as `{ error: { code, message } }` for new endpoints, matching the existing user routes. Keep error messages safe for clients.
- Do not return `passwordHash` or plaintext passwords in API responses.

## Authentication and Data Handling

- Passwords must be hashed and verified with `bcrypt`; never store or compare plaintext passwords.
- Keep authentication failures intentionally generic to avoid account enumeration.
- Use `crypto.randomUUID()` for new resource identifiers and ISO strings for timestamps, matching the existing profile model.
- Treat the in-memory stores as process-local demo state. Avoid adding concurrency, persistence, or authentication claims that the current application does not support unless requested.

## Testing

- **Vitest**. Not Jest, not Mocha.
- Tests live alongside source as `*.test.ts` — not in a separate `tests/` directory.
- `describe(ModuleName)` per module, `it(behaviour)` per behaviour. No `should`-style.
- Mock dependencies with `vi.fn()`. Reset in `beforeEach`.

## Utilities and Tests

- Keep utility functions small and deterministic. Preserve their documented edge-case behavior, such as returning `undefined` for an empty array and throwing `RangeError` for invalid sizes or wait intervals.
- Add or update focused Vitest tests for behavior changes, especially validation, status codes, error mapping, password handling, and utility edge cases.
- Run the narrowest relevant test first, then use the repository checks before completing a change.

## Commands

- `npm run dev`: run the service with `tsx watch`.
- `npm run build`: compile TypeScript to `dist`.
- `npm run typecheck`: run strict typechecking without emitting files.
- `npm test`: run Vitest.
- `npm start`: run the compiled service from `dist/index.js`.


## What NOT to Do

- No `console.log`, `console.error` in production code. Use the logger.
- No direct `process.env` access outside config modules.
- No business logic in route files or controllers.
- No raw SQL or DB calls outside repositories.
- No `as any` casts. If you need `any`, file a TODO and refactor.

## Documentation

- All exported functions and classes have JSDoc.
- Include `@param`, `@returns`, and `@throws` for documented errors.
- Public service/controller methods should include an `@example` block.

## Git

- Commit messages: `type(scope): subject`. Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`.
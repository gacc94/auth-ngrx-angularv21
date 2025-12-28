/**
 * Result Pattern Module
 *
 * Provides a functional approach to error handling without try-catch blocks.
 * Use Result.fromPromise() to wrap async operations and Result.fromThrowable()
 * to wrap synchronous operations that might throw.
 *
 * @example
 * ```typescript
 * import { Result } from '@core/config/result';
 *
 * // Wrap a promise
 * const result = await Result.fromPromise(fetchUser(userId));
 *
 * // Handle the result
 * const message = Result.match(result, {
 *   onSuccess: (user) => `Hello, ${user.name}!`,
 *   onFailure: (error) => `Error: ${error.message}`
 * });
 * ```
 */
export { Result } from './result.namespace';
export type { Failure, Result as ResultType, Success } from './result.types';

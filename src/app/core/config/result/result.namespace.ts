import type { Failure, Result as ResultType, Success } from './result.types';

/**
 * Namespace containing utility functions for working with Result types.
 * Provides a functional approach to error handling without try-catch blocks.
 */
export const Result = {
    /**
     * Creates a successful Result containing the provided value.
     * @template TValue - The type of the success value.
     * @param value - The success value to wrap.
     * @returns A Success Result containing the value.
     *
     * @example
     * ```typescript
     * const result = Result.success(42);
     * // result: Success<number> = { _tag: 'success', value: 42 }
     * ```
     */
    success: <TValue>(value: TValue): Success<TValue> => ({ _tag: 'success', value }) as const,

    /**
     * Creates a failed Result containing the provided error.
     * @template TError - The type of the error.
     * @param error - The error to wrap.
     * @returns A Failure Result containing the error.
     *
     * @example
     * ```typescript
     * const result = Result.failure(new Error('Something went wrong'));
     * // result: Failure<Error> = { _tag: 'failure', error: Error }
     * ```
     */
    failure: <TError>(error: TError): Failure<TError> => ({ _tag: 'failure', error }) as const,

    /**
     * Wraps a Promise and converts it to a Promise<Result>.
     * This eliminates the need for try-catch blocks when working with async operations.
     * @template TValue - The type of the resolved value.
     * @template TError - The type of the error, defaults to Error.
     * @param promise - The promise to wrap.
     * @param errorMapper - Optional function to map caught errors to TError type.
     * @returns A Promise that resolves to a Result.
     *
     * @example
     * ```typescript
     * // Basic usage with default Error type
     * const result = await Result.fromPromise(fetchUser(userId));
     * if (Result.isSuccess(result)) {
     *   console.log(result.value);
     * } else {
     *   console.error(result.error.message);
     * }
     *
     * // With custom error mapping
     * const result = await Result.fromPromise(
     *   apiCall(),
     *   (error) => ({ code: 'API_ERROR', message: String(error) })
     * );
     * ```
     */
    fromPromise: async <TValue, TError = Error>(
        promise: Promise<TValue>,
        errorMapper?: (error: unknown) => TError,
    ): Promise<ResultType<TValue, TError>> => {
        try {
            const value = await promise;
            return Result.success(value);
        } catch (error) {
            if (errorMapper) {
                return Result.failure(errorMapper(error));
            }
            return Result.failure(error as TError);
        }
    },

    /**
     * Wraps a synchronous function that might throw and converts it to a Result.
     * This eliminates the need for try-catch blocks when working with throwable functions.
     * @template TValue - The type of the return value.
     * @template TError - The type of the error, defaults to Error.
     * @param fn - The function to wrap.
     * @param errorMapper - Optional function to map caught errors to TError type.
     * @returns A Result containing either the return value or the error.
     *
     * @example
     * ```typescript
     * const result = Result.fromThrowable(() => JSON.parse(jsonString));
     * if (Result.isSuccess(result)) {
     *   console.log(result.value);
     * }
     * ```
     */
    fromThrowable: <TValue, TError = Error>(fn: () => TValue, errorMapper?: (error: unknown) => TError): ResultType<TValue, TError> => {
        try {
            return Result.success(fn());
        } catch (error) {
            if (errorMapper) {
                return Result.failure(errorMapper(error));
            }
            return Result.failure(error as TError);
        }
    },

    /**
     * Type guard to check if a Result is a Success.
     * @template TValue - The type of the success value.
     * @template TError - The type of the error.
     * @param result - The Result to check.
     * @returns True if the Result is a Success, false otherwise.
     *
     * @example
     * ```typescript
     * const result = await Result.fromPromise(fetchData());
     * if (Result.isSuccess(result)) {
     *   // TypeScript knows result.value is available here
     *   console.log(result.value);
     * }
     * ```
     */
    isSuccess: <TValue, TError>(result: ResultType<TValue, TError>): result is Success<TValue> => result._tag === 'success',

    /**
     * Type guard to check if a Result is a Failure.
     * @template TValue - The type of the success value.
     * @template TError - The type of the error.
     * @param result - The Result to check.
     * @returns True if the Result is a Failure, false otherwise.
     *
     * @example
     * ```typescript
     * const result = await Result.fromPromise(fetchData());
     * if (Result.isFailure(result)) {
     *   // TypeScript knows result.error is available here
     *   console.error(result.error);
     * }
     * ```
     */
    isFailure: <TValue, TError>(result: ResultType<TValue, TError>): result is Failure<TError> => result._tag === 'failure',

    /**
     * Transforms the success value of a Result using the provided function.
     * If the Result is a Failure, it passes through unchanged.
     * @template TValue - The type of the original success value.
     * @template TError - The type of the error.
     * @template TNewValue - The type of the transformed value.
     * @param result - The Result to transform.
     * @param fn - The transformation function.
     * @returns A new Result with the transformed value or the original error.
     *
     * @example
     * ```typescript
     * const result = Result.success(5);
     * const doubled = Result.map(result, (x) => x * 2);
     * // doubled: Success<number> = { _tag: 'success', value: 10 }
     * ```
     */
    map: <TValue, TError, TNewValue>(
        result: ResultType<TValue, TError>,
        fn: (value: TValue) => TNewValue,
    ): ResultType<TNewValue, TError> => (Result.isSuccess(result) ? Result.success(fn(result.value)) : result),

    /**
     * Transforms the error of a Result using the provided function.
     * If the Result is a Success, it passes through unchanged.
     * @template TValue - The type of the success value.
     * @template TError - The type of the original error.
     * @template TNewError - The type of the transformed error.
     * @param result - The Result to transform.
     * @param fn - The error transformation function.
     * @returns A new Result with the original value or the transformed error.
     *
     * @example
     * ```typescript
     * const result = Result.failure('error');
     * const mapped = Result.mapError(result, (e) => new Error(e));
     * ```
     */
    mapError: <TValue, TError, TNewError>(
        result: ResultType<TValue, TError>,
        fn: (error: TError) => TNewError,
    ): ResultType<TValue, TNewError> => (Result.isFailure(result) ? Result.failure(fn(result.error)) : result),

    /**
     * Chains Result-returning functions together, flattening nested Results.
     * Also known as 'chain' or 'bind' in functional programming.
     * @template TValue - The type of the original success value.
     * @template TError - The type of the error.
     * @template TNewValue - The type of the new success value.
     * @param result - The Result to transform.
     * @param fn - A function that returns a new Result.
     * @returns The Result from the function or the original error.
     *
     * @example
     * ```typescript
     * const parseNumber = (s: string): Result<number, string> =>
     *   isNaN(Number(s)) ? Result.failure('Not a number') : Result.success(Number(s));
     *
     * const divide = (n: number): Result<number, string> =>
     *   n === 0 ? Result.failure('Cannot divide by zero') : Result.success(10 / n);
     *
     * const result = Result.flatMap(parseNumber('5'), divide);
     * // result: Success<number> = { _tag: 'success', value: 2 }
     * ```
     */
    flatMap: <TValue, TError, TNewValue>(
        result: ResultType<TValue, TError>,
        fn: (value: TValue) => ResultType<TNewValue, TError>,
    ): ResultType<TNewValue, TError> => (Result.isSuccess(result) ? fn(result.value) : result),

    /**
     * Pattern matches on a Result, executing different functions for success and failure.
     * This is the primary way to extract values from a Result.
     * @template TValue - The type of the success value.
     * @template TError - The type of the error.
     * @template TResult - The type of the return value.
     * @param result - The Result to match on.
     * @param handlers - Object containing onSuccess and onFailure handlers.
     * @returns The result of the executed handler.
     *
     * @example
     * ```typescript
     * const result = await Result.fromPromise(fetchUser(id));
     * const message = Result.match(result, {
     *   onSuccess: (user) => `Welcome, ${user.name}!`,
     *   onFailure: (error) => `Error: ${error.message}`
     * });
     * ```
     */
    match: <TValue, TError, TResult>(
        result: ResultType<TValue, TError>,
        handlers: {
            readonly onSuccess: (value: TValue) => TResult;
            readonly onFailure: (error: TError) => TResult;
        },
    ): TResult => (Result.isSuccess(result) ? handlers.onSuccess(result.value) : handlers.onFailure(result.error)),

    /**
     * Extracts the value from a Result, returning a default value if it's a Failure.
     * @template TValue - The type of the success value.
     * @template TError - The type of the error.
     * @param result - The Result to unwrap.
     * @param defaultValue - The value to return if the Result is a Failure.
     * @returns The success value or the default value.
     *
     * @example
     * ```typescript
     * const result = Result.failure<number, string>('error');
     * const value = Result.unwrapOr(result, 0);
     * // value: number = 0
     * ```
     */
    unwrapOr: <TValue, TError>(result: ResultType<TValue, TError>, defaultValue: TValue): TValue =>
        Result.isSuccess(result) ? result.value : defaultValue,

    /**
     * Extracts the value from a Result, computing a default value if it's a Failure.
     * Useful when the default value is expensive to compute.
     * @template TValue - The type of the success value.
     * @template TError - The type of the error.
     * @param result - The Result to unwrap.
     * @param fn - Function that computes the default value from the error.
     * @returns The success value or the computed default value.
     *
     * @example
     * ```typescript
     * const result = Result.failure<User, ApiError>(apiError);
     * const user = Result.unwrapOrElse(result, (error) => createDefaultUser(error));
     * ```
     */
    unwrapOrElse: <TValue, TError>(result: ResultType<TValue, TError>, fn: (error: TError) => TValue): TValue =>
        Result.isSuccess(result) ? result.value : fn(result.error),

    /**
     * Combines an array of Results into a Result of an array.
     * If all Results are successful, returns a Success with all values.
     * If any Result is a Failure, returns the first Failure encountered.
     * @template TValue - The type of the success values.
     * @template TError - The type of the error.
     * @param results - An array of Results to combine.
     * @returns A Result containing an array of values or the first error.
     *
     * @example
     * ```typescript
     * const results = await Promise.all([
     *   Result.fromPromise(fetchUser(1)),
     *   Result.fromPromise(fetchUser(2)),
     *   Result.fromPromise(fetchUser(3))
     * ]);
     * const combined = Result.all(results);
     * if (Result.isSuccess(combined)) {
     *   console.log(combined.value); // [user1, user2, user3]
     * }
     * ```
     */
    all: <TValue, TError>(results: readonly ResultType<TValue, TError>[]): ResultType<TValue[], TError> => {
        const values: TValue[] = [];
        for (const result of results) {
            if (Result.isFailure(result)) {
                return result;
            }
            values.push(result.value);
        }
        return Result.success(values);
    },

    /**
     * Wraps multiple Promises and returns a Result containing all resolved values.
     * Similar to Promise.all but returns a Result instead of throwing.
     * @template TValue - The type of the resolved values.
     * @template TError - The type of the error, defaults to Error.
     * @param promises - An array of Promises to wrap.
     * @param errorMapper - Optional function to map caught errors to TError type.
     * @returns A Promise that resolves to a Result containing all values or the first error.
     *
     * @example
     * ```typescript
     * const result = await Result.fromPromiseAll([
     *   fetchUser(1),
     *   fetchUser(2),
     *   fetchUser(3)
     * ]);
     * if (Result.isSuccess(result)) {
     *   const [user1, user2, user3] = result.value;
     * }
     * ```
     */
    fromPromiseAll: async <TValue, TError = Error>(
        promises: readonly Promise<TValue>[],
        errorMapper?: (error: unknown) => TError,
    ): Promise<ResultType<TValue[], TError>> => {
        const results = await Promise.all(promises.map((p) => Result.fromPromise(p, errorMapper)));
        return Result.all(results);
    },

    /**
     * Executes a side effect for success values without modifying the Result.
     * Useful for logging or debugging in a pipeline.
     * @template TValue - The type of the success value.
     * @template TError - The type of the error.
     * @param result - The Result to tap.
     * @param fn - The side effect function to execute for success values.
     * @returns The original Result unchanged.
     *
     * @example
     * ```typescript
     * const result = Result.tap(
     *   Result.success(user),
     *   (user) => console.log('User loaded:', user.name)
     * );
     * ```
     */
    tap: <TValue, TError>(result: ResultType<TValue, TError>, fn: (value: TValue) => void): ResultType<TValue, TError> => {
        if (Result.isSuccess(result)) {
            fn(result.value);
        }
        return result;
    },

    /**
     * Executes a side effect for error values without modifying the Result.
     * Useful for logging errors in a pipeline.
     * @template TValue - The type of the success value.
     * @template TError - The type of the error.
     * @param result - The Result to tap.
     * @param fn - The side effect function to execute for error values.
     * @returns The original Result unchanged.
     *
     * @example
     * ```typescript
     * const result = Result.tapError(
     *   await fetchData(),
     *   (error) => console.error('Failed to fetch:', error)
     * );
     * ```
     */
    tapError: <TValue, TError>(result: ResultType<TValue, TError>, fn: (error: TError) => void): ResultType<TValue, TError> => {
        if (Result.isFailure(result)) {
            fn(result.error);
        }
        return result;
    },
} as const;

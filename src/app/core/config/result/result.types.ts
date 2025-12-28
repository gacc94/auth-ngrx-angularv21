/**
 * Enum representing the possible tags for a Result type.
 * Used as a discriminant in the Result discriminated union.
 */
export type ResultTag = 'success' | 'failure';

/**
 * Represents a successful result containing a value.
 * @template TValue - The type of the success value.
 */
export type Success<TValue> = {
    readonly _tag: 'success';
    readonly value: TValue;
};

/**
 * Represents a failed result containing an error.
 * @template TError - The type of the error.
 */
export type Failure<TError> = {
    readonly _tag: 'failure';
    readonly error: TError;
};

/**
 * A discriminated union type representing either a success or a failure.
 * @template TValue - The type of the success value.
 * @template TError - The type of the error, defaults to Error.
 *
 * @example
 * ```typescript
 * function divide(a: number, b: number): Result<number, string> {
 *   if (b === 0) {
 *     return Result.failure('Cannot divide by zero');
 *   }
 *   return Result.success(a / b);
 * }
 * ```
 */
export type Result<TValue, TError = Error> = Success<TValue> | Failure<TError>;

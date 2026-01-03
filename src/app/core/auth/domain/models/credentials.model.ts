/**
 * Credentials used for email and password authentication.
 */
export interface Credentials {
    /**
     * The user's email address.
     */
    readonly email: string;

    /**
     * The user's secret password.
     */
    readonly password: string;
}

/**
 * Credentials required for user registration.
 *
 * @extends {@link Credentials}
 */
export interface RegisterCredentials extends Credentials {
    /**
     * The user's full name or display name.
     */
    readonly name: string;
}

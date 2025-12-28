import type { ResultType } from '@core/config/result';
import type { Observable } from 'rxjs';
import type { AuthException } from '../../exceptions/auth.exceptions';
import type { AuthResult } from '../../models/auth-result.model';
import type { Credentials, RegisterCredentials } from '../../models/credentials.model';

/**
 * Output port interface for authentication repository operations.
 * Defines the contract that infrastructure adapters must implement.
 */
export interface AuthRepositoryPort {
    /**
     * Authenticates a user with email and password.
     * @param credentials - The user's email and password.
     * @returns A Result containing the authentication result or an error.
     */
    signInWithEmail(credentials: Credentials): Promise<ResultType<AuthResult, AuthException>>;

    /**
     * Authenticates a user with Google OAuth.
     * @returns A Result containing the authentication result or an error.
     */
    signInWithGoogle(): Promise<ResultType<AuthResult, AuthException>>;

    /**
     * Registers a new user with email and password.
     * @param credentials - The registration credentials.
     * @returns A Result containing the authentication result or an error.
     */
    signUp(credentials: RegisterCredentials): Promise<ResultType<AuthResult, AuthException>>;

    /**
     * Signs out the current user.
     * @returns A Result indicating success or an error.
     */
    signOut(): Promise<ResultType<void, AuthException>>;

    /**
     * Gets the currently authenticated user if any.
     * @returns A Result containing the authentication result, null if not authenticated, or an error.
     */
    getCurrentUser(): Promise<ResultType<AuthResult | null, AuthException>>;

    /**
     * Observes the authentication state changes.
     * Emits the current auth state whenever it changes (login, logout, token refresh).
     * @returns An Observable that emits AuthResult when authenticated or null when not.
     */
    observeAuthState(): Observable<ResultType<AuthResult | null, AuthException>>;
}

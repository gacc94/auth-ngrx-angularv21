import { InjectionToken } from '@angular/core';
import { Token } from '../../domain/entities/token.entity';
import { User } from '../../domain/entities/user.entity';

/**
 * Represents the possible states of the authentication process.
 *
 * - `loading`: An authentication request is currently in progress.
 * - `authenticated`: The user has been successfully authenticated.
 * - `unauthenticated`: No user is currently logged in.
 * - `error`: An error occurred during the last authentication attempt.
 * - `idle`: The initial state before any authentication action has been initiated.
 */
export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated' | 'error' | 'idle';

/**
 * Represents the authentication state of the application.
 *
 * This interface defines the structure of the data stored in the authentication state,
 * including the current user, their access token, and the current status of the auth process.
 */
export interface AuthState {
    /**
     * The currently authenticated user.
     * Is `null` if the user is not logged in.
     */
    user: User | null;

    /**
     * The authentication token for the current session.
     * Is `null` if no token is available or the user is not logged in.
     */
    token: Token | null;

    /**
     * A descriptive error message if an authentication operation (like login or logout) failed.
     * Is `null` if the last operation was successful or no operation has been performed.
     */
    error: string | null;

    /**
     * The current status of the authentication process.
     * @see {@link AuthStatus}
     */
    status: AuthStatus;
}

/**
 * The initial state for the authentication store.
 *
 * This constant defines the default values for the authentication state when the application starts.
 */
export const initialAuthState: AuthState = {
    user: null,
    token: null,
    error: null,
    status: 'idle',
};

/**
 * Injection token for the initial authentication state.
 *
 * This token can be used to inject the initial state into components or services.
 * It defaults to the {@link initialAuthState}.
 */
export const AUTH_STATE = new InjectionToken<AuthState>('AUTH_STATE', {
    factory: () => initialAuthState,
});

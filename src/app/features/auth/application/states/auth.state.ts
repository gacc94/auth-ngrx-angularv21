import { InjectionToken } from '@angular/core';
import { User } from '../../domain/entities/user.entity';

/**
 * Represents the authentication state of the application.
 */
export interface AuthState {
    /** The currently authenticated user, or null if not logged in. */
    user: User | null;
    /** Indicates if an authentication operation is in progress. */
    isLoading: boolean;
    /** Error message if an authentication operation failed. */
    error: string | null;
    /** Whether the user is currently authenticated. */
    isAuthenticated: boolean;
}

/**
 * The initial state for the authentication store.
 */
export const initialAuthState: AuthState = {
    user: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
};

/**
 * Injection token for the initial authentication state.
 */
export const AUTH_STATE = new InjectionToken<AuthState>('AUTH_STATE', {
    factory: () => initialAuthState,
});

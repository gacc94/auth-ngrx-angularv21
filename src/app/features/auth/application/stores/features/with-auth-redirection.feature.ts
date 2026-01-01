import { effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { getState, signalStoreFeature, type, withHooks } from '@ngrx/signals';
import { AuthState } from '../../states/auth.state';

/**
 * A SignalStore feature that provides automatic redirection based on the authentication status.
 *
 * This feature monitors the `status` property of the `AuthState`.
 * - If the status is `authenticated`, it redirects to `/dashboard`.
 * - If the status is not a transitional state (idle, checking, logging-in) and not authenticated, it redirects to `/auth`.
 *
 * @returns A `SignalStoreFeature` that manages authentication-based navigation.
 *
 * @example
 * ```typescript
 * const AuthStore = signalStore(
 *   withState(initialAuthState),
 *   withAuthRedirection()
 * );
 * ```
 */
export const withAuthRedirection = () => {
    return signalStoreFeature(
        { state: type<AuthState>() },

        withHooks((store, router = inject(Router)) => ({
            /**
             * Initializes the redirection logic by setting up an effect that reacts to state changes.
             */
            onInit: () => {
                effect(() => {
                    const state = getState(store);
                    const { status } = state;

                    if (status === 'idle' || status === 'checking' || status === 'logging-in') {
                        return;
                    }

                    const route = status === 'authenticated' ? '/dashboard' : '/auth';
                    router.navigate([route]);
                });
            },
        })),
    );
};

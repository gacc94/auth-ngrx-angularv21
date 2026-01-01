import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { signalStore, watchState, withComputed, withFeature, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { AUTH_STATE, AuthState } from '../states/auth.state';
import {
    withAuthRedirection,
    withObserveAuthState,
    withSignInWithEmailAndPassword,
    withSignInWithGoogle,
    withSignOut,
    withSignUp,
} from './features';

/**
 * NgRx SignalStore for authentication state management.
 * Provides methods for all authentication operations.
 */
export const AuthStore = signalStore(
    { providedIn: 'root' },
    withState<AuthState>(() => inject(AUTH_STATE)),
    withDevtools('AuthStore'),
    withProps(() => ({
        _router: inject(Router),
    })),

    withComputed((store) => ({
        /**
         * Whether the user is currently authenticated.
         */
        isAuthenticated: computed(() => store.user() !== null && store.token()?.isValid() === true),
        /**
         * Whether there is an authentication error.
         */
        hasError: computed(() => store.error() !== null),
        /**
         * The current authenticated user.
         */
        currentUser: computed(() => store.user()),
        /**
         * The current authentication token.
         */
        currentToken: computed(() => store.token()),

        /**
         * Whether the authentication state is being initialized.
         * True when the app starts ('idle') or during Firebase SDK evaluation ('loading').
         */
        isInitializing: computed(() => store.status() === 'idle' || store.status() === 'checking'),
    })),

    withMethods(() => ({})),

    withSignInWithGoogle(),

    withSignInWithEmailAndPassword(),

    withSignOut(),

    withObserveAuthState(),

    withAuthRedirection(),

    withFeature(() => withSignUp()),

    withHooks({
        onInit: (store) => {
            watchState(store, ({ status }) => {
                console.log('WatchState:', { status });
            });
        },
    }),
);

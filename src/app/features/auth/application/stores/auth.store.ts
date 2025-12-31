import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { getState, signalStore, watchState, withComputed, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { ObserveAuthStateEffects } from '../effects/observe-auth-state.effects';
import { SignInEffects } from '../effects/sign-in.effects';
import { SignOutEffects } from '../effects/sign-out.effects';
import { AUTH_STATE, AuthState } from '../states/auth.state';

/**
 * NgRx SignalStore for authentication state management.
 * Provides methods for all authentication operations.
 */
export const AuthStore = signalStore(
    { providedIn: 'root' },
    withState<AuthState>(() => inject(AUTH_STATE)),
    withDevtools('AuthStore'),
    withProps(() => ({
        _signInEffects: inject(SignInEffects),
        _observeAuthStateEffects: inject(ObserveAuthStateEffects),
        _signOutEffects: inject(SignOutEffects),
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

    withMethods((store) => ({
        /**
         * Initiates login with Google.
         */
        signInWithGoogle: store._signInEffects.signInWithGoogle(store),

        /**
         * Initiates login with email and password.
         */
        signInWithEmailAndPassword: store._signInEffects.signInWithEmailAndPassword(store),

        /**
         * Initiates logout.
         */
        signOut: store._signOutEffects.signOut(store),

        /**
         * Observes authentication state changes.
         */
        _observeAuthState: store._observeAuthStateEffects.observeAuthState(store),
    })),

    withHooks({
        onInit: (store) => {
            store._observeAuthState();

            watchState(store, ({ status }) => {
                console.log('WatchState:', { status });
            });

            effect(() => {
                const state = getState(store);
                const { status } = state;

                // Only navigate after auth state is resolved (not during initialization)
                if (status === 'idle' || status === 'checking') {
                    return;
                }

                console.log('Effect - navigating:', { status });
                const route = status === 'authenticated' ? '/dashboard' : '/auth';
                store._router.navigate([route]);
            });
        },
    }),
);

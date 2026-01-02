import { inject } from '@angular/core';
import { AuthStore } from '@features/auth/application/stores/auth.store';
import { patchState, signalStoreFeature, type, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap } from 'rxjs';
import { InactivityState, initialInactivityState } from '../../states/inactivity.state';

/**
 * SignalStore feature that handles session logout on inactivity timeout.
 *
 * This feature:
 * - Integrates with AuthStore to perform sign out
 * - Provides methods for staying logged in and logging out
 * - Resets the inactivity state after logout
 *
 * @returns A SignalStoreFeature for session logout management.
 */
export const withSessionLogout = () => {
    return signalStoreFeature(
        { state: type<InactivityState>() },
        withMethods((store, authStore = inject(AuthStore)) => ({
            /**
             * Handles user choosing to stay logged in.
             * Hides the modal and resets the countdown.
             */
            stayLoggedIn: rxMethod<void>(
                pipe(
                    tap(() => {
                        patchState(store, {
                            isModalVisible: false,
                            countdownSeconds: 60,
                        });
                    }),
                ),
            ),

            /**
             * Handles user logout or timeout.
             * Signs out from AuthStore and resets inactivity state.
             */
            signOut: rxMethod<void>(
                pipe(
                    tap(() => {
                        // Reset inactivity state first
                        patchState(store, {
                            ...initialInactivityState,
                        });
                        // Then trigger sign out
                        authStore.signOut();
                    }),
                ),
            ),

            /**
             * Handles timeout expiration.
             * Called when countdown reaches 0.
             */
            onTimeoutExpired: () => {
                patchState(store, {
                    ...initialInactivityState,
                });
                authStore.signOut();
            },
        })),
    );
};

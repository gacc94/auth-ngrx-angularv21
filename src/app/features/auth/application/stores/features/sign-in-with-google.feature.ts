import { inject } from '@angular/core';
import { Result } from '@app/core/config/result';
import { SIGN_IN_WITH_GOOGLE_USECASE } from '@app/features/auth/infrastructure/providers';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStoreFeature, type, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { from, pipe, switchMap, tap } from 'rxjs';
import { AuthState } from '../../states/auth.state';

/**
 * A SignalStore feature that provides functionality for signing in with Google.
 *
 * This feature manages the authentication state transitions during the Google sign-in process,
 * handling loading states, success data (user and token), and error scenarios.
 *
 * @returns A {@link SignalStoreFeature} that adds the `signInWithGoogle` method to the store.
 */
export const withSignInWithGoogle = () => {
    return signalStoreFeature(
        { state: type<AuthState>() },
        withMethods((store, usecase = inject(SIGN_IN_WITH_GOOGLE_USECASE)) => ({
            /**
             * Initiates the Google sign-in flow.
             *
             * - Sets the status to `logging-in` upon initiation.
             * - On success: Updates the store with `authenticated` status, user data, and token.
             * - On failure: Updates the store with `error` status and the corresponding error message.
             *
             * @param {void} _ - This method does not require any input parameters.
             */
            signInWithGoogle: rxMethod<void>(
                pipe(
                    tap(() => {
                        patchState(store, { status: 'logging-in' });
                    }),
                    switchMap(() => {
                        return from(usecase.execute()).pipe(
                            tapResponse({
                                next: (result) => {
                                    if (Result.isFailure(result)) {
                                        patchState(store, { status: 'error', error: result.error.message });
                                    }

                                    if (Result.isSuccess(result)) {
                                        const { user, token } = result.value;
                                        patchState(store, {
                                            status: 'authenticated',
                                            user,
                                            token,
                                            error: null,
                                        });
                                    }
                                },
                                error: () => {
                                    patchState(store, { status: 'error', error: 'An error occurred' });
                                },
                            }),
                        );
                    }),
                ),
            ),
        })),
    );
};

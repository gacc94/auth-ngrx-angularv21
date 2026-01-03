import { inject } from '@angular/core';
import { SIGN_OUT_USECASE } from '@app/core/auth/infrastructure/providers';
import { Result } from '@app/core/config/result/result.namespace';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStoreFeature, type, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { from, pipe, switchMap, tap } from 'rxjs';
import { AuthState, initialAuthState } from '../../states/auth.state';

/**
 * Signal store feature that provides the sign-out functionality.
 *
 * This feature integrates the sign-out use case into the authentication store,
 * managing the transition from an authenticated state to an unauthenticated one.
 *
 * @returns A SignalStoreFeature that adds the `signOut` method to the store.
 */
export const withSignOut = () => {
    return signalStoreFeature(
        { state: type<AuthState>() },
        withMethods((store, usecase = inject(SIGN_OUT_USECASE)) => ({
            /**
             * Triggers the sign-out workflow.
             *
             * This method handles the side effects of signing out:
             * 1. Sets the store status to a loading state ('logging-in').
             * 2. Executes the sign-out use case asynchronously.
             * 3. Updates the store state based on the result:
             *    - On success: Resets the state to `initialAuthState` and sets status to 'unauthenticated'.
             *    - On failure: Captures the error message and sets status to 'error'.
             *
             * @param trigger$ - An observable or signal that triggers the sign-out process.
             */
            signOut: rxMethod<void>(
                pipe(
                    tap(() => {
                        patchState(store, {
                            status: 'logging-in',
                        });
                    }),

                    switchMap(() => {
                        return from(usecase.execute());
                    }),

                    tapResponse({
                        next: (result) => {
                            if (Result.isFailure(result)) {
                                patchState(store, {
                                    status: 'error',
                                    error: result.error.message,
                                });
                            }

                            if (Result.isSuccess(result)) {
                                patchState(store, {
                                    ...initialAuthState,
                                    status: 'unauthenticated',
                                });
                            }
                        },
                        error: () => {
                            patchState(store, {
                                status: 'error',
                                error: 'An error occurred',
                            });
                        },
                    }),
                ),
            ),
        })),
    );
};

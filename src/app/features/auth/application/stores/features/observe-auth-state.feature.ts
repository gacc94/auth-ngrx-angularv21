import { inject } from '@angular/core';
import { Result } from '@app/core/config/result/result.namespace';
import { OBSERVE_AUTH_STATE_USECASE } from '@auth/infrastructure/providers';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStoreFeature, type, withHooks, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { AuthState, initialAuthState } from '../../states/auth.state';

/**
 * SignalStore feature that provides functionality to observe the current authentication state.
 *
 * This feature:
 * - Automatically starts observing the authentication state upon initialization.
 * - Updates the store state based on the presence of a user and token.
 * - Handles loading (checking), success (authenticated/unauthenticated), and error states.
 * - Cleans up the observation on destruction.
 *
 * @returns A SignalStoreFeature for authentication state management.
 */
export const withObserveAuthState = () => {
    return signalStoreFeature(
        { state: type<AuthState>() },
        withMethods((store, usecase = inject(OBSERVE_AUTH_STATE_USECASE)) => ({
            /**
             * Reactive method that executes the authentication state observation logic.
             *
             * @internal
             */
            _observeAuthState: rxMethod<void>(
                pipe(
                    tap(() =>
                        patchState(store, {
                            ...initialAuthState,
                            status: 'checking',
                        }),
                    ),
                    switchMap(() => {
                        return usecase.execute().pipe(
                            tapResponse({
                                next: (result) => {
                                    if (Result.isFailure(result)) {
                                        patchState(store, {
                                            ...initialAuthState,
                                            status: 'error',
                                            error: result.error.message,
                                        });
                                        return;
                                    }

                                    const authResult = result.value;

                                    if (authResult === null) {
                                        patchState(store, {
                                            ...initialAuthState,
                                            status: 'unauthenticated',
                                        });
                                        return;
                                    }

                                    patchState(store, {
                                        user: authResult.user,
                                        token: authResult.token,
                                        status: 'authenticated',
                                        error: null,
                                    });
                                },
                                error: () => {
                                    patchState(store, {
                                        ...initialAuthState,
                                        status: 'error',
                                        error: 'An error occurred',
                                    });
                                },
                            }),
                        );
                    }),
                ),
            ),
        })),

        withHooks({
            /**
             * Initializes the authentication state observation when the store is created.
             */
            onInit(store) {
                store._observeAuthState();
            },

            /**
             * Destroys the authentication state observation when the store is destroyed.
             */
            onDestroy(store) {
                store._observeAuthState.destroy();
            },
        }),
    );
};

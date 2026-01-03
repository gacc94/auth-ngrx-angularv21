import { inject } from '@angular/core';
import { RegisterCredentials } from '@app/core/auth/domain/models/credentials.model';
import { SIGN_UP_USECASE } from '@app/core/auth/infrastructure/providers';
import { Result } from '@app/core/config/result/result.namespace';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStoreFeature, type, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { defer, pipe, switchMap, tap } from 'rxjs';
import { AuthState, initialAuthState } from '../../states/auth.state';

/**
 * A SignalStore feature that provides sign-up functionality.
 *
 * This feature manages the sign-up process, including state transitions
 * from 'checking' to 'authenticated' or 'error'.
 *
 * @returns A SignalStore feature that adds the `signUp` method.
 */
export const withSignUp = () => {
    return signalStoreFeature(
        { state: type<AuthState>() },
        withMethods((store, usecase = inject(SIGN_UP_USECASE)) => ({
            /**
             * Performs the sign-up operation.
             *
             * It updates the store state to 'checking' before calling the use case,
             * and then updates it to 'authenticated' or 'error' based on the result.
             *
             * @param credentials - The user registration data.
             */
            signUp: rxMethod<RegisterCredentials>(
                pipe(
                    tap(() => {
                        patchState(store, {
                            ...initialAuthState,
                            status: 'checking',
                        });
                    }),
                    switchMap((credentials) =>
                        defer(() => usecase.execute(credentials)).pipe(
                            tapResponse({
                                next: (result) => {
                                    if (Result.isSuccess(result)) {
                                        patchState(store, {
                                            ...initialAuthState,
                                            status: 'authenticated',
                                            user: result.value.user,
                                            token: result.value.token,
                                        });
                                    } else {
                                        patchState(store, {
                                            ...initialAuthState,
                                            status: 'error',
                                            error: result.error.message,
                                        });
                                    }
                                },

                                error: (error: Error) => {
                                    patchState(store, {
                                        ...initialAuthState,
                                        status: 'error',
                                        error: error.message,
                                    });
                                },
                            }),
                        ),
                    ),
                ),
            ),
        })),
    );
};

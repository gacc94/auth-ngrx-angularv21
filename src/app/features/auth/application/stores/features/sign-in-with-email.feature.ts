import { inject } from '@angular/core';
import { Result } from '@app/core/config/result/result.namespace';
import { Credentials } from '@app/features/auth/domain/models/credentials.model';
import { SIGN_IN_WITH_EMAIL_USECASE } from '@app/features/auth/infrastructure/providers';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStoreFeature, type, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { from, pipe, switchMap, tap } from 'rxjs';
import { AuthState } from '../../states/auth.state';

/**
 * A signal store feature that provides functionality for signing in with email and password.
 *
 * @returns A signal store feature to be used with `signalStore`.
 */
export const withSignInWithEmailAndPassword = () => {
    return signalStoreFeature(
        { state: type<AuthState>() },
        withMethods((store, usecase = inject(SIGN_IN_WITH_EMAIL_USECASE)) => ({
            /**
             * Authenticates a user using email and password credentials.
             *
             * @param credentials - The user's email and password.
             */
            signInWithEmailAndPassword: rxMethod<Credentials>(
                pipe(
                    tap(() => {
                        patchState(store, { status: 'logging-in', error: null });
                    }),
                    switchMap((credential) => {
                        return from(usecase.execute(credential)).pipe(
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

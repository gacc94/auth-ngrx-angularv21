import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Result } from '@app/core/config/result';
import { StateStore } from '@app/shared/utils/types/state-store.type';
import { tapResponse } from '@ngrx/operators';
import { patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { from, pipe } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Credentials } from '../../domain/models/credentials.model';
import { SIGN_IN_WITH_EMAIL_USECASE, SIGN_IN_WITH_GOOGLE_USECASE } from '../../infrastructure/providers';
import { AuthState } from '../states/auth.state';

/**
 * Effects for sign in operations.
 * Handles both email/password and Google authentication.
 */
@Injectable({ providedIn: 'root' })
export class SignInEffects {
    readonly #signInWithGoogleUseCase = inject(SIGN_IN_WITH_GOOGLE_USECASE);
    readonly #signInWithEmailUseCase = inject(SIGN_IN_WITH_EMAIL_USECASE);

    /**
     * Effect for signing in with Google.
     */
    signInWithGoogle(store: StateStore<AuthState>) {
        return rxMethod<void>(
            pipe(
                tap(() => {
                    patchState(store, { status: 'logging-in' });
                }),
                switchMap(() => {
                    return from(this.#signInWithGoogleUseCase.execute()).pipe(
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
        );
    }

    signInWithEmailAndPassword(store: StateStore<AuthState>) {
        return rxMethod<Credentials>(
            pipe(
                tap(() => {
                    patchState(store, { status: 'logging-in', error: null });
                }),
                switchMap((credential) => {
                    return from(this.#signInWithEmailUseCase.execute(credential)).pipe(
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
        );
    }
}

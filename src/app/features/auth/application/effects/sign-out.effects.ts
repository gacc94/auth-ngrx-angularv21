import { inject, Injectable } from '@angular/core';
import { StateStore } from '@app/shared/utils/types/state-store.type';
import { Result } from '@core/config/result';
import { tapResponse } from '@ngrx/operators';
import { patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import type { SignOutPort } from '../../domain/ports/in/sign-out.in';
import { SIGN_OUT_USECASE } from '../../infrastructure/providers/auth.providers';
import { AuthState, initialAuthState } from '../states/auth.state';

// /**
//  * Effects for sign out and session operations.
//  */
@Injectable({ providedIn: 'root' })
export class SignOutEffects {
    readonly #signOutUseCase = inject<SignOutPort>(SIGN_OUT_USECASE);

    /**
     * Effect for signing out.
     */
    signOut(store: StateStore<AuthState>) {
        return rxMethod<void>(
            pipe(
                tap(() => {
                    patchState(store, {
                        status: 'logging-in',
                    });
                }),

                switchMap(() => {
                    return this.#signOutUseCase.execute();
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
        );
    }
}

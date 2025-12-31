import { inject, Injectable } from '@angular/core';
import { Result } from '@app/core/config/result';
import { StateStore } from '@app/shared/utils/types/state-store.type';
import { tapResponse } from '@ngrx/operators';
import { patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounce, pipe, switchMap, tap, timer } from 'rxjs';
import { OBSERVE_AUTH_STATE_USECASE } from '../../infrastructure/providers';
import { AuthState, initialAuthState } from '../states/auth.state';

@Injectable({ providedIn: 'root' })
export class ObserveAuthStateEffects {
    readonly #observeAuthStateUseCase = inject(OBSERVE_AUTH_STATE_USECASE);

    observeAuthState(store: StateStore<AuthState>) {
        return rxMethod<void>(
            pipe(
                tap(() =>
                    patchState(store, {
                        ...initialAuthState,
                        status: 'checking',
                    }),
                ),
                // debounce(() => timer(100)),
                switchMap(() => {
                    return this.#observeAuthStateUseCase.execute().pipe(
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
        );
    }
}

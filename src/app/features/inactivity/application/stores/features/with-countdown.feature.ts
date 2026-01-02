import { computed } from '@angular/core';
import { patchState, signalStoreFeature, type, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { interval, pipe, Subject, takeUntil, takeWhile, tap } from 'rxjs';
import { InactivityState } from '../../states/inactivity.state';

/**
 * Default countdown duration in seconds.
 */
const DEFAULT_COUNTDOWN_SECONDS = 60;

/**
 * Internal state for countdown management.
 */
interface CountdownState {
    countdownSeconds: number;
    isCountdownActive: boolean;
}

/**
 * SignalStore feature that manages the countdown timer.
 *
 * This feature:
 * - Provides methods to start, stop, and reset the countdown
 * - Decrements countdownSeconds from 60 to 0 every second
 * - Provides a formatted countdown computed signal (MM:SS format)
 *
 * @returns A SignalStoreFeature for countdown timer management.
 */
export const withCountdown = () => {
    return signalStoreFeature(
        { state: type<InactivityState>() },
        withState<CountdownState>({
            countdownSeconds: DEFAULT_COUNTDOWN_SECONDS,
            isCountdownActive: false,
        }),

        withComputed((store) => ({
            /**
             * Formats the countdown as "MM:SS" string.
             */
            formattedCountdown: computed(() => {
                const seconds = store.countdownSeconds();
                const mins = Math.floor(seconds / 60);
                const secs = seconds % 60;
                return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }),

            /**
             * Whether the countdown has expired.
             */
            isCountdownExpired: computed(() => store.countdownSeconds() <= 0),
        })),

        withMethods((store) => {
            const stopCountdown$ = new Subject<void>();

            return {
                /**
                 * Starts the countdown timer.
                 * Decrements countdownSeconds every second until it reaches 0.
                 */
                startCountdown: rxMethod<void>(
                    pipe(
                        tap(() => {
                            patchState(store, {
                                isCountdownActive: true,
                                countdownSeconds: DEFAULT_COUNTDOWN_SECONDS,
                            });
                        }),
                        tap(() => {
                            // Create interval subscription
                            interval(1000)
                                .pipe(
                                    takeUntil(stopCountdown$),
                                    takeWhile(() => store.countdownSeconds() > 0),
                                    tap(() => {
                                        patchState(store, (state) => ({
                                            countdownSeconds: state.countdownSeconds - 1,
                                        }));
                                    }),
                                )
                                .subscribe({
                                    complete: () => {
                                        patchState(store, { isCountdownActive: false });
                                    },
                                });
                        }),
                    ),
                ),

                /**
                 * Stops the countdown timer.
                 */
                stopCountdown: () => {
                    stopCountdown$.next();
                    patchState(store, { isCountdownActive: false });
                },

                /**
                 * Resets the countdown timer to the default value.
                 */
                resetCountdown: () => {
                    stopCountdown$.next();
                    patchState(store, {
                        countdownSeconds: DEFAULT_COUNTDOWN_SECONDS,
                        isCountdownActive: false,
                    });
                },
            };
        }),
    );
};

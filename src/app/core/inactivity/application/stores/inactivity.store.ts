import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, effect, inject } from '@angular/core';
import { patchState, signalStore, watchState, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { INACTIVITY_STATE, InactivityState, initialInactivityState } from '../states/inactivity.state';
import { withCountdown, withSessionLogout, withUserActivityTracking } from './features';

/**
 * NgRx SignalStore for inactivity management.
 *
 * This store:
 * - Tracks user activity and detects inactivity only when authenticated
 * - Shows an inactivity modal after 60 seconds of no activity
 * - Manages a countdown timer in the modal
 * - Logs out the user if the countdown expires
 * - Automatically starts/stops tracking based on authentication state (via withUserActivityTracking)
 */
export const InactivityStore = signalStore(
    { providedIn: 'root' },
    withState<InactivityState>(() => inject(INACTIVITY_STATE)),
    withDevtools('InactivityStore'),

    withComputed((store) => ({
        /**
         * Whether the inactivity modal should be displayed.
         */
        shouldShowModal: computed(() => store.isModalVisible()),
    })),

    withMethods((store) => ({
        /**
         * Resets the entire inactivity state to initial values.
         */
        reset: () => {
            patchState(store, { ...initialInactivityState });
        },
    })),

    // Add countdown management
    withCountdown(),

    // Add session logout handling
    withSessionLogout(),

    // Add user activity tracking (this observes AuthStore and starts/stops tracking automatically)
    withUserActivityTracking(),

    withHooks({
        onInit: (store) => {
            // Watch for modal visibility changes and start countdown when modal is shown
            effect(() => {
                const isVisible = store.isModalVisible();
                console.log('isVisible', isVisible);
                if (isVisible) {
                    store.startCountdown();
                } else {
                    store.stopCountdown();
                }
            });

            // Watch for countdown expiration
            effect(() => {
                const isExpired = store.isCountdownExpired();
                const isModalVisible = store.isModalVisible();
                console.log('isExpired', isExpired);
                if (isExpired && isModalVisible) {
                    store.onTimeoutExpired();
                }
            });

            // Debug logging
            watchState(store, ({ isModalVisible, countdownSeconds, isTracking }) => {
                console.log('InactivityStore:', { isModalVisible, countdownSeconds, isTracking });
            });
        },
    }),
);

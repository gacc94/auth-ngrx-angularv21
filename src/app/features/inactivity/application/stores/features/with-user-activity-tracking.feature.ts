import { DOCUMENT } from '@angular/common';
import { effect, inject, untracked } from '@angular/core';
import { AuthStore } from '@features/auth/application/stores/auth.store';
import { patchState, signalStoreFeature, type, withHooks, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, fromEvent, merge, Observable, pipe, Subject, switchMap, takeUntil, tap, timer } from 'rxjs';
import { InactivityState, initialInactivityState } from '../../states/inactivity.state';

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Inactivity timeout duration in milliseconds.
 * After this period of inactivity, the modal will be displayed.
 */
const INACTIVITY_TIMEOUT_MS = 60_000;

/**
 * Debounce time for user activity events in milliseconds.
 * Prevents excessive state updates during rapid user interactions.
 */
const ACTIVITY_DEBOUNCE_MS = 300;

/**
 * User activity event types to monitor.
 * These events indicate that the user is actively using the application.
 */
const ACTIVITY_EVENTS = ['mousemove', 'click', 'keypress', 'keydown', 'touchstart', 'scroll'] as const;

// ============================================================================
// TYPES
// ============================================================================

type ActivityEvent = (typeof ACTIVITY_EVENTS)[number];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Creates a merged observable stream of all user activity events.
 *
 * @param document - The DOM document to listen for events on.
 * @returns An observable that emits whenever user activity is detected.
 */
const createActivityStream = (document: Document): Observable<Event> => {
    const eventStreams = ACTIVITY_EVENTS.map((eventType: ActivityEvent) => fromEvent(document, eventType));
    return merge(...eventStreams);
};

/**
 * Creates an inactivity timer that triggers after the timeout period.
 * The timer is cancelled if tracking stops or user activity is detected.
 *
 * @param stopSignal$ - Subject that signals to stop the timer.
 * @param activityStream$ - Observable of user activity events.
 * @param onTimeout - Callback to execute when timeout is reached.
 * @returns An observable representing the timeout pipeline.
 */
const createInactivityTimer = (
    stopSignal$: Subject<void>,
    activityStream$: Observable<Event>,
    onTimeout: () => void,
): Observable<number> => {
    return timer(INACTIVITY_TIMEOUT_MS).pipe(takeUntil(stopSignal$), takeUntil(activityStream$), tap(onTimeout));
};

/**
 * Creates an activity tracking pipeline that resets the timer on each activity.
 *
 * @param stopSignal$ - Subject that signals to stop tracking.
 * @param activityStream$ - Observable of user activity events.
 * @param onTimeout - Callback to execute when timeout is reached.
 * @returns An observable representing the activity tracking pipeline.
 */
const createActivityTrackingPipeline = (
    stopSignal$: Subject<void>,
    activityStream$: Observable<Event>,
    onTimeout: () => void,
): Observable<number> => {
    return activityStream$.pipe(
        debounceTime(ACTIVITY_DEBOUNCE_MS),
        switchMap(() => timer(INACTIVITY_TIMEOUT_MS)),
        takeUntil(stopSignal$),
        tap(onTimeout),
    );
};

// ============================================================================
// FEATURE
// ============================================================================

/**
 * SignalStore feature that tracks user activity and detects inactivity periods.
 *
 * ## Responsibilities:
 * - Monitors DOM events to detect user activity
 * - Triggers inactivity modal after configured timeout
 * - Integrates with AuthStore to only track authenticated users
 *
 * ## SOLID Principles Applied:
 * - **Single Responsibility**: Focuses only on activity tracking logic
 * - **Open/Closed**: Uses composition with helper functions for extensibility
 * - **Dependency Inversion**: Injects dependencies (DOCUMENT, AuthStore)
 *
 * @returns A SignalStoreFeature for user activity tracking.
 */
export const withUserActivityTracking = () => {
    return signalStoreFeature(
        { state: type<InactivityState>() },

        withMethods((store, document = inject(DOCUMENT)) => {
            const stopTracking$ = new Subject<void>();
            const activityStream$ = createActivityStream(document);

            /**
             * Handler for inactivity timeout.
             * Shows the modal if tracking is active and modal is not already visible.
             */
            const handleInactivityTimeout = (): void => {
                const isCurrentlyTracking = store.isTracking();
                const isModalAlreadyVisible = store.isModalVisible();

                if (isCurrentlyTracking && !isModalAlreadyVisible) {
                    patchState(store, { isModalVisible: true });
                }
            };

            /**
             * Creates the combined tracking observables (initial timer + activity-based timer).
             */
            const createTrackingObservables = (): Observable<number> => {
                const initialTimer$ = createInactivityTimer(stopTracking$, activityStream$, handleInactivityTimeout);
                const activityTracking$ = createActivityTrackingPipeline(stopTracking$, activityStream$, handleInactivityTimeout);

                return merge(initialTimer$, activityTracking$);
            };

            return {
                /**
                 * Starts monitoring user activity.
                 * Sets up timers that will trigger the inactivity modal after the timeout period.
                 */
                startActivityTracking: rxMethod<void>(
                    pipe(
                        tap(() => patchState(store, { isTracking: true })),
                        switchMap(() => createTrackingObservables()),
                    ),
                ),

                /**
                 * Stops all activity monitoring.
                 * Resets tracking state and hides the modal.
                 */
                stopActivityTracking: (): void => {
                    stopTracking$.next();
                    patchState(store, { isTracking: false, isModalVisible: false });
                },

                /**
                 * Resets the tracking cycle.
                 * Used when user chooses to stay logged in from the inactivity modal.
                 */
                resetActivityTracking: rxMethod<void>(
                    pipe(
                        tap(() => {
                            stopTracking$.next();
                            patchState(store, { isModalVisible: false, isTracking: true });
                        }),
                        switchMap(() => createTrackingObservables()),
                    ),
                ),
            };
        }),

        withHooks((store, authStore = inject(AuthStore)) => {
            let previousAuthState = false;
            let isFirstRun = true;

            /**
             * Handles authentication state changes.
             * Starts tracking when user authenticates, stops when user signs out.
             */
            const handleAuthStateChange = (isAuthenticated: boolean): void => {
                if (isFirstRun) {
                    handleInitialAuthState(isAuthenticated);
                    isFirstRun = false;
                    return;
                }

                if (isAuthenticated && !previousAuthState) {
                    onUserAuthenticated();
                } else if (!isAuthenticated && previousAuthState) {
                    onUserSignedOut();
                }

                previousAuthState = isAuthenticated;
            };

            /**
             * Handles initial authentication state on store initialization.
             */
            const handleInitialAuthState = (isAuthenticated: boolean): void => {
                if (isAuthenticated) {
                    store.startActivityTracking();
                }
                previousAuthState = isAuthenticated;
            };

            /**
             * Called when user becomes authenticated.
             */
            const onUserAuthenticated = (): void => {
                store.startActivityTracking();
            };

            /**
             * Called when user signs out.
             */
            const onUserSignedOut = (): void => {
                store.stopActivityTracking();
                patchState(store, { ...initialInactivityState });
            };

            return {
                onInit: () => {
                    effect(() => {
                        const isAuthenticated = authStore.isAuthenticated();
                        untracked(() => handleAuthStateChange(isAuthenticated));
                    });
                },
                onDestroy: () => {
                    store.stopActivityTracking();
                },
            };
        }),
    );
};

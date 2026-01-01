import { InjectionToken } from '@angular/core';

export interface InactivityState {
    isModalVisible: boolean;
    countdownSeconds: number;
    isTracking: boolean;
}

/**
 * The initial state for the inactivity store.
 */
export const initialInactivityState: InactivityState = {
    isModalVisible: false,
    countdownSeconds: 60,
    isTracking: false,
};

/**
 * Injection token for the initial inactivity state.
 */
export const INACTIVITY_STATE = new InjectionToken<InactivityState>('INACTIVITY_STATE', {
    factory: () => initialInactivityState,
});

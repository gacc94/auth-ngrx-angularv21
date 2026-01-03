import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { map } from 'rxjs';

interface DashboardUIState {
    readonly isSidebarCollapsed: boolean;
}

const initialState: DashboardUIState = {
    isSidebarCollapsed: false,
};

/**
 * Store for managing dashboard UI state.
 * Handles sidenav collapse, mobile detection, and related computed properties.
 */
export const DashboardUIStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withComputed((store) => {
        const breakpointObserver = inject(BreakpointObserver);

        const isMobile = toSignal(
            breakpointObserver.observe([Breakpoints.Handset, Breakpoints.TabletPortrait]).pipe(map((result) => result.matches)),
            { initialValue: false },
        );

        return {
            /** Whether the current viewport is mobile/tablet portrait */
            isMobile,

            /** Sidenav mode: 'over' for mobile, 'side' for desktop */
            sidenavMode: computed(() => (isMobile() ? 'over' : 'side')),

            /** Whether sidenav should be opened by default */
            sidenavOpened: computed(() => !isMobile()),

            /** Whether to show labels in sidenav (false when collapsed on desktop) */
            showLabels: computed(() => !store.isSidebarCollapsed() || isMobile()),

            /** CSS class for collapsed state */
            isCollapsed: computed(() => store.isSidebarCollapsed() && !isMobile()),
        };
    }),
    withMethods((store) => ({
        /**
         * Toggle sidebar collapsed state (desktop only)
         */
        toggleSidebar(): void {
            if (!store.isMobile()) {
                patchState(store, { isSidebarCollapsed: !store.isSidebarCollapsed() });
            }
        },

        /**
         * Set sidebar collapsed state
         */
        setSidebarCollapsed(collapsed: boolean): void {
            patchState(store, { isSidebarCollapsed: collapsed });
        },
    })),
);

export type DashboardUIStoreType = InstanceType<typeof DashboardUIStore>;

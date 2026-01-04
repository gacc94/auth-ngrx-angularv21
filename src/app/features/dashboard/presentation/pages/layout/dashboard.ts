import { ChangeDetectionStrategy, Component, computed, effect, inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, RouterOutlet } from '@angular/router';
import { AuthStore } from '@auth/application/stores/auth.store';
import { InactivityStore } from '@inactivity/application/stores/inactivity.store';
import { InactivityModal } from '@inactivity/presentation/components/inactivity-modal/inactivity-modal';
import { MATERIAL_IMPORTS } from '@shared/material/material.imports';
import { DashboardUIStore } from '../../../application/stores/dashboard-ui.store';
import { DashboardHeader, SidenavBrand, SidenavNav, SidenavUser } from '../../components';
import { NavItem } from '../../interfaces';

/**
 * Container component for the main dashboard layout.
 * Orchestrates child components and manages application-level state.
 */
@Component({
    selector: 'app-dashboard',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.scss',
    imports: [RouterOutlet, ...MATERIAL_IMPORTS, SidenavBrand, SidenavNav, SidenavUser, DashboardHeader],
})
export default class Dashboard {
    readonly #router = inject(Router);
    readonly #dialog = inject(MatDialog);

    protected readonly uiStore = inject(DashboardUIStore);
    protected readonly authStore = inject(AuthStore);
    protected readonly inactivityStore = inject(InactivityStore);

    @ViewChild('drawer') drawer!: MatSidenav;

    #dialogRef: MatDialogRef<InactivityModal> | null = null;

    /** Navigation items configuration */
    protected readonly navItems: readonly NavItem[] = [
        { icon: 'home', label: 'Home', route: '/dashboard' },
        { icon: 'analytics', label: 'Analytics', route: '/dashboard/analytics' },
        { icon: 'group', label: 'Users', route: '/dashboard/users' },
        { icon: 'folder', label: 'Projects', route: '/dashboard/projects' },
        { icon: 'settings', label: 'Settings', route: '/dashboard/settings' },
    ] as const;

    /** Current page title based on route */
    protected readonly pageTitle = computed(() => {
        const url = this.#router.url;
        const match = this.navItems.find((item) => url === item.route || (item.route !== '/dashboard' && url.startsWith(item.route)));
        return match?.label ?? 'Dashboard';
    });

    /** User display name */
    protected readonly userName = computed(() => {
        const user = this.authStore.user();
        return user?.name ?? user?.email?.split('@')[0] ?? 'User';
    });

    /** User email */
    protected readonly userEmail = computed(() => {
        return this.authStore.user()?.email ?? '';
    });

    /** User photo URL */
    protected readonly userPhotoURL = computed(() => {
        return this.authStore.user()?.photoURL;
    });

    constructor() {
        // Watch for inactivity modal visibility
        effect(() => {
            const shouldShow = this.inactivityStore.shouldShowModal();

            if (shouldShow && !this.#dialogRef) {
                this.#dialogRef = this.#dialog.open(InactivityModal, {
                    disableClose: true,
                    width: '400px',
                    panelClass: 'inactivity-modal-panel',
                });

                this.#dialogRef.afterClosed().subscribe(() => {
                    this.#dialogRef = null;
                });
            } else if (!shouldShow && this.#dialogRef) {
                this.#dialogRef.close();
                this.#dialogRef = null;
            }
        });
    }

    /**
     * Toggle sidebar collapsed/open state
     */
    protected onMenuClick(): void {
        if (this.uiStore.isMobile()) {
            this.drawer.toggle();
        } else {
            this.uiStore.toggleSidebar();
        }
    }

    /**
     * Close sidenav on mobile after navigation
     */
    protected onNavItemClick(): void {
        if (this.uiStore.isMobile()) {
            this.drawer.close();
        }
    }

    /**
     * Handles user logout
     */
    protected onLogout(): void {
        this.authStore.signOut();
    }
}

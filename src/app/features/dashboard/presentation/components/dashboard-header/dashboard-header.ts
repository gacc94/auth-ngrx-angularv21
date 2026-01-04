import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { MATERIAL_IMPORTS } from '@shared/material/material.imports';
import { AvatarPipe } from '@shared/pipes';

/**
 * Presentational component for dashboard header toolbar.
 * Contains menu toggle, title, search, notifications, and user menu.
 */
@Component({
    selector: 'app-dashboard-header',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [...MATERIAL_IMPORTS, AvatarPipe],
    templateUrl: './dashboard-header.html',
    styleUrl: './dashboard-header.scss',
})
export class DashboardHeader {
    /** Page title to display */
    readonly title = input.required<string>();

    /** Number of unread notifications */
    readonly notificationCount = input<number>(0);

    /** User display name */
    readonly userName = input<string>('');

    /** User photo URL */
    readonly userPhotoURL = input<string | null | undefined>();

    /** Emitted when menu toggle button is clicked */
    readonly menuClick = output<void>();

    /** Emitted when logout is requested */
    readonly logout = output<void>();

    /** Whether mobile search is expanded */
    protected readonly isSearchExpanded = signal(false);

    /**
     * Toggle mobile search visibility
     */
    protected toggleMobileSearch(): void {
        this.isSearchExpanded.update((v) => !v);
    }

    /**
     * Close mobile search
     */
    protected closeMobileSearch(): void {
        this.isSearchExpanded.set(false);
    }
}

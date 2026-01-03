import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MaterialModule } from '@shared/material/material.module';
import { NavItem } from '../../interfaces';

/**
 * Presentational component for sidenav navigation items.
 * Displays navigation links with icons and labels.
 */
@Component({
    selector: 'app-sidenav-nav',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, RouterLinkActive, MaterialModule],
    template: `
        <nav class="sidenav-nav">
            @for (item of navItems(); track item.route) {
                <a
                    class="sidenav-nav__item"
                    [routerLink]="item.route"
                    routerLinkActive="sidenav-nav__item--active"
                    [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
                    [matTooltip]="!showLabels() ? item.label : ''"
                    matTooltipPosition="right"
                    (click)="itemClick.emit()"
                >
                    <mat-icon class="sidenav-nav__icon">{{ item.icon }}</mat-icon>
                    @if (showLabels()) {
                        <span class="sidenav-nav__label">{{ item.label }}</span>
                    }
                </a>
            }
        </nav>
    `,
    styleUrl: './sidenav-nav.scss',
})
export class SidenavNav {
    /** Navigation items to display */
    readonly navItems = input.required<readonly NavItem[]>();

    /** Whether to show text labels */
    readonly showLabels = input.required<boolean>();

    /** Emitted when a navigation item is clicked */
    readonly itemClick = output<void>();
}

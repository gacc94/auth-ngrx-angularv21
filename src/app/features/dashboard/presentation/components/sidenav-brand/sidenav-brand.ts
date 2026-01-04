import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MATERIAL_IMPORTS } from '@shared/material/material.imports';

/**
 * Presentational component for sidenav brand section.
 * Displays the application logo, name, and version.
 */
@Component({
    selector: 'app-sidenav-brand',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [...MATERIAL_IMPORTS],
    template: `
        <div class="sidenav-brand">
            <div class="sidenav-brand__logo">
                <mat-icon class="sidenav-brand__icon">dashboard</mat-icon>
            </div>
            @if (showLabels()) {
                <div class="sidenav-brand__text">
                    <span class="sidenav-brand__name">AdminPanel</span>
                    <span class="sidenav-brand__version">v2.4.0</span>
                </div>
            }
        </div>
    `,
    styleUrl: './sidenav-brand.scss',
})
export class SidenavBrand {
    /** Whether to show text labels */
    readonly showLabels = input.required<boolean>();
}

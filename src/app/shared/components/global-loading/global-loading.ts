import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

/**
 * Global loading overlay component.
 * Displays while the application is initializing and verifying user session.
 */
@Component({
    selector: 'app-global-loading',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatProgressBarModule, MatIconModule],
    styleUrl: './global-loading.scss',
    template: `
        <div class="global-loading" [class.global-loading--hidden]="!$isLoading()">
            <div class="global-loading__brand">
                <div class="global-loading__logo">
                    <mat-icon fontIcon="security"/>
                </div>
                <h1 class="global-loading__title">Auth App</h1>
            </div>

            <div class="global-loading__spinner">
                <p class="global-loading__text">Verifying session...</p>
                <div class="global-loading__progress">
                    <mat-progress-bar mode="indeterminate" />
                </div>
            </div>
        </div>
    `,
})
export class GlobalLoading {
    /**
     * Whether the loading overlay should be visible.
     */
    readonly $isLoading = input.required<boolean>({ alias: 'isLoading' });
}

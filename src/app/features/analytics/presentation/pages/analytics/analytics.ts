import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MaterialModule } from '@shared/material/material.module';

@Component({
    selector: 'app-analytics',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MaterialModule],
    template: `
        <div class="analytics">
            <header class="analytics__header">
                <h1 class="analytics__title">Analytics</h1>
                <p class="analytics__description">View detailed analytics and insights for your projects.</p>
            </header>

            <div class="analytics__content">
                <mat-card class="analytics__placeholder">
                    <mat-card-content>
                        <mat-icon class="analytics__icon">analytics</mat-icon>
                        <h2>Analytics Dashboard</h2>
                        <p>Advanced analytics features coming soon.</p>
                    </mat-card-content>
                </mat-card>
            </div>
        </div>
    `,
    styleUrl: './analytics.scss',
})
export default class Analytics {}

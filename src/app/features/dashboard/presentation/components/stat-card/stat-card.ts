import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MaterialModule } from '@shared/material/material.module';

@Component({
    selector: 'app-stat-card',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MaterialModule],
    template: `
        <mat-card class="stat-card">
            <mat-card-content class="stat-card__content">
                <div class="stat-card__info">
                    <div class="stat-card__icon" [style.background-color]="iconBgColor()">
                        <mat-icon>{{ icon() }}</mat-icon>
                    </div>
                    <div class="stat-card__text">
                        <span class="stat-card__title">{{ title() }}</span>
                        <span class="stat-card__icon-bg">
                            <mat-icon>attach_money</mat-icon>
                        </span>
                    </div>
                </div>
                <div class="stat-card__value-section">
                    <span class="stat-card__value">{{ value() }}</span>
                    <span
                        class="stat-card__change"
                        [class.stat-card__change--positive]="changeType() === 'positive'"
                        [class.stat-card__change--negative]="changeType() === 'negative'"
                    >
                        {{ change() }}
                    </span>
                </div>
            </mat-card-content>
        </mat-card>
    `,
    styleUrl: './stat-card.scss',
})
export class StatCardComponent {
    readonly title = input.required<string>();
    readonly value = input.required<string>();
    readonly change = input.required<string>();
    readonly changeType = input.required<'positive' | 'negative'>();
    readonly icon = input.required<string>();
    readonly iconBgColor = input<string>('#3b82f6');
}

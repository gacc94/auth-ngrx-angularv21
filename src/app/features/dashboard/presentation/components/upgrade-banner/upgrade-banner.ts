import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MATERIAL_IMPORTS } from '@shared/material/material.imports';

@Component({
    selector: 'app-upgrade-banner',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [...MATERIAL_IMPORTS],
    template: `
        <div class="upgrade-banner">
            <div class="upgrade-banner__icon">
                <mat-icon>rocket_launch</mat-icon>
            </div>
            <div class="upgrade-banner__content">
                <h3 class="upgrade-banner__title">Upgrade to Pro</h3>
                <p class="upgrade-banner__description">Unlock advanced analytics and user roles.</p>
            </div>
            <button mat-flat-button color="primary" class="upgrade-banner__button">View Plans</button>
        </div>
    `,
    styleUrl: './upgrade-banner.scss',
})
export class UpgradeBannerComponent {}

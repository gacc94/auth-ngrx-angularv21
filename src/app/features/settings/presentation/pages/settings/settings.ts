import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MATERIAL_IMPORTS } from '@app/shared/material/material.imports';

@Component({
    selector: 'app-settings',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [...MATERIAL_IMPORTS],
    template: `
        <div class="settings">
            <header class="settings__header">
                <h1 class="settings__title">Settings</h1>
                <p class="settings__description">Configure your application preferences.</p>
            </header>

            <div class="settings__content">
                <mat-card class="settings__placeholder">
                    <mat-card-content>
                        <mat-icon class="settings__icon">settings</mat-icon>
                        <h2>Application Settings</h2>
                        <p>Settings features coming soon.</p>
                    </mat-card-content>
                </mat-card>
            </div>
        </div>
    `,
    styleUrl: './settings.scss',
})
export default class Settings {}

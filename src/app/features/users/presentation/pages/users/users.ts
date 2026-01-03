import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MaterialModule } from '@shared/material/material.module';

@Component({
    selector: 'app-users',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MaterialModule],
    template: `
        <div class="users">
            <header class="users__header">
                <h1 class="users__title">Users</h1>
                <p class="users__description">Manage user accounts and permissions.</p>
            </header>

            <div class="users__content">
                <mat-card class="users__placeholder">
                    <mat-card-content>
                        <mat-icon class="users__icon">group</mat-icon>
                        <h2>User Management</h2>
                        <p>User management features coming soon.</p>
                    </mat-card-content>
                </mat-card>
            </div>
        </div>
    `,
    styleUrl: './users.scss',
})
export default class Users {}

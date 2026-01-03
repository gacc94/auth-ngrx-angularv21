import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MaterialModule } from '@shared/material/material.module';
import { AvatarPipe } from '@shared/pipes';

/**
 * Presentational component for sidenav user profile section.
 * Displays user avatar, name, and email at the bottom of sidenav.
 */
@Component({
    selector: 'app-sidenav-user',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MaterialModule, AvatarPipe],
    template: `
        <div class="sidenav-user">
            <img class="sidenav-user__avatar" [src]="userPhotoURL() | avatar" [alt]="userName() + ' avatar'" />
            @if (showLabels()) {
                <div class="sidenav-user__info">
                    <span class="sidenav-user__name">{{ userName() }}</span>
                    <span class="sidenav-user__email">{{ userEmail() }}</span>
                </div>
                <button mat-icon-button (click)="logout.emit()" matTooltip="Sign out">
                    <mat-icon>logout</mat-icon>
                </button>
            }
        </div>
    `,
    styleUrl: './sidenav-user.scss',
})
export class SidenavUser {
    /** User display name */
    readonly userName = input.required<string>();

    /** User email address */
    readonly userEmail = input.required<string>();

    /** User photo URL */
    readonly userPhotoURL = input<string | null | undefined>();

    /** Whether to show text labels */
    readonly showLabels = input.required<boolean>();

    /** Emits when user clicks logout */
    readonly logout = output<void>();
}

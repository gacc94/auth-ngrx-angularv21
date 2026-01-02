import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { InactivityStore } from '@app/features/inactivity/application/stores/inactivity.store';

/**
 * Result returned when the modal is closed.
 */
export type InactivityModalResult = 'stay' | 'logout';

/**
 * Inactivity modal component.
 * Displays when user has been inactive and warns about automatic logout.
 */
@Component({
    selector: 'app-inactivity-modal',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatDialogModule, MatButtonModule, MatIconModule],
    styleUrl: './inactivity-modal.scss',
    template: `
        <div class="inactivity-modal">
            <div class="inactivity-modal__icon">
                <mat-icon>hourglass_empty</mat-icon>
            </div>

            <h2 class="inactivity-modal__title">Are you still there?</h2>

            <p class="inactivity-modal__description">
                We noticed you haven't been active for a while. To protect your account, your session will automatically end in:
            </p>

            <div class="inactivity-modal__countdown">
                {{ inactivityStore.formattedCountdown() }}
            </div>

            <div class="inactivity-modal__actions">
                <button mat-flat-button color="primary" (click)="onStayLoggedIn()">Stay Logged In</button>

                <button mat-stroked-button color="primary" (click)="onSignOut()">Log Out</button>
            </div>
        </div>
    `,
})
export class InactivityModal {
    readonly #dialogRef: MatDialogRef<InactivityModal, InactivityModalResult> = inject(
        MatDialogRef<InactivityModal, InactivityModalResult>,
    );
    protected readonly inactivityStore = inject(InactivityStore);

    /**
     * Handles "Stay Logged In" button click.
     * Resets activity tracking and hides the modal.
     */
    protected onStayLoggedIn(): void {
        this.inactivityStore.stayLoggedIn();
        this.inactivityStore.resetActivityTracking();
        this.#dialogRef.close('stay');
    }

    /**
     * Handles "Log Out" button click.
     * Triggers logout and closes the modal.
     */
    protected onSignOut(): void {
        this.inactivityStore.signOut();
        this.#dialogRef.close('logout');
    }
}

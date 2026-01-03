import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthStore } from '@auth/application/stores/auth.store';
import { InactivityStore } from '@inactivity/application/stores/inactivity.store';
import { InactivityModal } from '@inactivity/presentation/components/inactivity-modal/inactivity-modal';
import { MaterialModule } from '@shared/material/material.module';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
    selector: 'app-dashboard',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.scss',
    imports: [AsyncPipe, MaterialModule],
})
export default class Dashboard {
    readonly #breakpointObserver = inject(BreakpointObserver);
    readonly #dialog = inject(MatDialog);
    protected readonly authStore = inject(AuthStore);
    protected readonly inactivityStore = inject(InactivityStore);

    #dialogRef: MatDialogRef<InactivityModal> | null = null;

    isHandset$: Observable<boolean> = this.#breakpointObserver.observe(Breakpoints.Handset).pipe(
        map((result) => result.matches),
        shareReplay(),
    );

    /** Based on the screen size, switch from standard to one column per row */
    cards = this.#breakpointObserver.observe(Breakpoints.Handset).pipe(
        map(({ matches }) => {
            if (matches) {
                return [
                    { title: 'Card 1', cols: 1, rows: 1 },
                    { title: 'Card 2', cols: 1, rows: 1 },
                    { title: 'Card 3', cols: 1, rows: 1 },
                    { title: 'Card 4', cols: 1, rows: 1 },
                ];
            }

            return [
                { title: 'Card 1', cols: 2, rows: 1 },
                { title: 'Card 2', cols: 1, rows: 1 },
                { title: 'Card 3', cols: 1, rows: 2 },
                { title: 'Card 4', cols: 1, rows: 1 },
            ];
        }),
    );

    constructor() {
        // Watch for modal visibility and open/close the dialog
        effect(() => {
            const shouldShow = this.inactivityStore.shouldShowModal();
            console.log('shouldShow', shouldShow);

            if (shouldShow && !this.#dialogRef) {
                this.#dialogRef = this.#dialog.open(InactivityModal, {
                    disableClose: true,
                    width: '400px',
                    panelClass: 'inactivity-modal-panel',
                });

                this.#dialogRef.afterClosed().subscribe((resp) => {
                    console.log('Modal closed', resp);
                    this.#dialogRef = null;
                });
            } else if (!shouldShow && this.#dialogRef) {
                this.#dialogRef.close();
                this.#dialogRef = null;
            }
        });
    }

    /**
     * Handles user logout.
     */
    protected onLogout(): void {
        this.authStore.signOut();
    }
}

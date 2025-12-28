import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialModule } from '@app/shared/material/material.module';
import { AuthStore } from '@features/auth/application/stores/auth.store';
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
    protected readonly authStore = inject(AuthStore);

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

    constructor() {}

    /**
     * Handles user logout.
     */
    protected onLogout(): void {
        this.authStore.signOut();
    }
}

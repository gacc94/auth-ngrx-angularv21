import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthStore } from './core/auth/application/stores/auth.store';
import { GlobalLoading } from './shared/components/global-loading/global-loading';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, GlobalLoading],
    template: `
        <app-global-loading [isLoading]="authStore.isInitializing()" />
        <router-outlet />
    `,
})
export class App {
    protected readonly authStore: InstanceType<typeof AuthStore> = inject(AuthStore);
}

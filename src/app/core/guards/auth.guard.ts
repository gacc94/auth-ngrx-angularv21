import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthStore } from '@app/core/auth/application/stores/auth.store';

/**
 * Functional guard that protects private routes.
 * Redirects to /auth/sign-in if the user is not authenticated.
 */
export const authGuard: CanActivateFn = () => {
    const authStore = inject(AuthStore);
    const router = inject(Router);

    if (authStore.isAuthenticated()) {
        return true;
    }

    return router.createUrlTree(['/auth', 'sign-in']);
};

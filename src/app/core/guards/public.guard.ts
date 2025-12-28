import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthStore } from '@features/auth/application/stores/auth.store';

/**
 * Functional guard that protects public routes (like sign-in).
 * Redirects to /dashboard if the user is already authenticated.
 */
export const publicGuard: CanActivateFn = () => {
    const authStore = inject(AuthStore);
    const router = inject(Router);

    if (!authStore.isAuthenticated()) {
        return true;
    }

    return router.createUrlTree(['/dashboard']);
};

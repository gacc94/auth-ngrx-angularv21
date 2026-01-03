import { type HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '@auth/application/stores/auth.store';
import { catchError, throwError } from 'rxjs';

/**
 * Functional HTTP interceptor that handles HTTP errors globally.
 * Handles 401 Unauthorized by clearing auth and redirecting to sign-in.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const authStore = inject(AuthStore);
    const router = inject(Router);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                // Unauthorized - clear auth and redirect to sign-in
                // authStore.clearAuth();
                router.navigate(['/auth', 'sign-in']);
            }

            return throwError(() => error);
        }),
    );
};

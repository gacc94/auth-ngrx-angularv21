import { type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '@auth/application/stores/auth.store';

/**
 * Functional HTTP interceptor that adds authentication token to requests.
 * Adds Bearer token to Authorization header if user is authenticated.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authStore = inject(AuthStore);
    const token = authStore.currentToken();

    if (token?.isValid()) {
        const authReq = req.clone({
            setHeaders: {
                Authorization: `${token.tokenType} ${token.accessToken}`,
            },
        });
        return next(authReq);
    }

    return next(req);
};

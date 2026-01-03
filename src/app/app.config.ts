import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideAuth as provideAuthProviders } from '@app/core/auth/infrastructure/providers';
import { provideFirebase } from '@core/config/providers/firebase.provide';
import { authInterceptor } from '@core/interceptors/auth.interceptor';
import { errorInterceptor } from '@core/interceptors/error.interceptor';
import { provideMaterial } from '@shared/material/material.provide';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes, withViewTransitions(), withComponentInputBinding()),
        provideHttpClient(withFetch(), withInterceptors([authInterceptor, errorInterceptor])),
        provideFirebase(),
        provideMaterial(),
        provideAuthProviders(),
    ],
};

import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';

import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { authInterceptor } from '@core/interceptors/auth.interceptor';
import { errorInterceptor } from '@core/interceptors/error.interceptor';
import { environment } from '@env/environment';
import { routes } from './app.routes';
import { authProviders } from './features/auth/infrastructure/providers';
import { provideMaterial } from './shared/material/material.provide';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes, withViewTransitions(), withComponentInputBinding()),
        provideHttpClient(withFetch(), withInterceptors([authInterceptor, errorInterceptor])),
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideMaterial(),
        // provideAuthProviders(),
        ...authProviders,
    ],
};

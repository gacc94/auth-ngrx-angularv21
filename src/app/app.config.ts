import {
    ApplicationConfig,
    makeEnvironmentProviders,
    provideAppInitializer,
    provideBrowserGlobalErrorListeners,
    provideEnvironmentInitializer,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';

import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '@env/environment';
import { routes } from './app.routes';
import { AuthStore } from './features/auth/application/stores/auth.store';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes, withViewTransitions(), withComponentInputBinding()),
        provideHttpClient(withFetch(), withInterceptors([])),
        provideAppInitializer(() => {}),
        provideEnvironmentInitializer(() => {}),
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        makeEnvironmentProviders([AuthStore]),
    ],
};

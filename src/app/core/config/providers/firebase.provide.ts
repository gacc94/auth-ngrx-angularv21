import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { getAI, GoogleAIBackend, provideAI } from '@angular/fire/ai';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, provideFirestore } from '@angular/fire/firestore';
import { environment } from '@env/environment';

export const provideFirebase = (): EnvironmentProviders => {
    return makeEnvironmentProviders([
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAuth(() => getAuth()),
        provideAI(() =>
            getAI(initializeApp(environment.firebase), {
                backend: new GoogleAIBackend(),
            }),
        ),
        provideFirestore(() => {
            return initializeFirestore(getApp(), {
                localCache: persistentLocalCache({
                    tabManager: persistentMultipleTabManager(),
                }),
            });
        }),
    ]);
};

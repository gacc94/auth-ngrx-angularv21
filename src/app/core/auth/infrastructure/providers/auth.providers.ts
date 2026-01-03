import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
    ObserveAuthStateUseCase,
    SignInWithEmailUseCase,
    SignInWithGoogleUseCase,
    SignOutUseCase,
    SignUpUseCase,
} from '@app/core/auth/application/usecases';
import type {
    ObserveAuthStatePort,
    SignInWithEmailPort,
    SignInWithGooglePort,
    SignOutPort,
    SignUpPort,
} from '@app/core/auth/domain/ports/in';
import type { AuthRepositoryPort } from '@app/core/auth/domain/ports/out/auth-repository.out';
import { FirebaseAuthRepository } from '@app/core/auth/infrastructure/repositories/firebase-auth.repository';

// ============================================
// Output Port Token (Repository)
// ============================================

/**
 * InjectionToken for the AuthRepositoryPort.
 * Provides the FirebaseAuthRepository implementation.
 */
export const AUTH_REPOSITORY = new InjectionToken<AuthRepositoryPort>('AUTH_REPOSITORY');

// ============================================
// Input Port Tokens (Use Cases)
// ============================================

/**
 * InjectionToken for the SignInWithEmailPort use case.
 */
export const SIGN_IN_WITH_EMAIL_USECASE = new InjectionToken<SignInWithEmailPort>('SIGN_IN_WITH_EMAIL_USECASE');

/**
 * InjectionToken for the SignInWithGooglePort use case.
 */
export const SIGN_IN_WITH_GOOGLE_USECASE = new InjectionToken<SignInWithGooglePort>('SIGN_IN_WITH_GOOGLE_USECASE');

/**
 * InjectionToken for the SignUpPort use case.
 */
export const SIGN_UP_USECASE = new InjectionToken<SignUpPort>('SIGN_UP_USECASE');

/**
 * InjectionToken for the SignOutPort use case.
 */
export const SIGN_OUT_USECASE = new InjectionToken<SignOutPort>('SIGN_OUT_USECASE');

/**
 * InjectionToken for the ObserveAuthStatePort use case.
 */
export const OBSERVE_AUTH_STATE_USECASE = new InjectionToken<ObserveAuthStatePort>('OBSERVE_AUTH_STATE_USECASE');

// ============================================
// Auth Providers Array
// ============================================

export const provideAuth = (): EnvironmentProviders => {
    return makeEnvironmentProviders([
        {
            provide: AUTH_REPOSITORY,
            useFactory: (auth: Auth) => new FirebaseAuthRepository(auth),
            deps: [Auth],
        },
        {
            provide: SIGN_IN_WITH_GOOGLE_USECASE,
            useFactory: (authRepository: AuthRepositoryPort) => new SignInWithGoogleUseCase(authRepository),
            deps: [AUTH_REPOSITORY],
        },
        {
            provide: SIGN_IN_WITH_EMAIL_USECASE,
            useFactory: (authRepository: AuthRepositoryPort) => new SignInWithEmailUseCase(authRepository),
            deps: [AUTH_REPOSITORY],
        },
        {
            provide: SIGN_UP_USECASE,
            useFactory: (authRepository: AuthRepositoryPort) => new SignUpUseCase(authRepository),
            deps: [AUTH_REPOSITORY],
        },
        {
            provide: SIGN_OUT_USECASE,
            useFactory: (authRepository: AuthRepositoryPort) => new SignOutUseCase(authRepository),
            deps: [AUTH_REPOSITORY],
        },
        {
            provide: OBSERVE_AUTH_STATE_USECASE,
            useFactory: (authRepository: AuthRepositoryPort) => new ObserveAuthStateUseCase(authRepository),
            deps: [AUTH_REPOSITORY],
        },
    ]);
};

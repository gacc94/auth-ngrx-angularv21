import { InjectionToken, Provider } from '@angular/core';
import {
    GetCurrentUserUseCase,
    ObserveAuthStateUseCase,
    SignInWithEmailUseCase,
    SignInWithGoogleUseCase,
    SignOutUseCase,
    SignUpUseCase,
} from '../../application/usecases';
import type {
    GetCurrentUserPort,
    ObserveAuthStatePort,
    SignInWithEmailPort,
    SignInWithGooglePort,
    SignOutPort,
    SignUpPort,
} from '../../domain/ports/in';
import type { AuthRepositoryPort } from '../../domain/ports/out/auth-repository.out';
import { FirebaseAuthRepository } from '../repositories/firebase-auth.repository';

// ============================================
// Output Port Token (Repository)
// ============================================

/**
 * InjectionToken for the AuthRepositoryPort.
 * Provides the FirebaseAuthRepository implementation.
 */
export const AUTH_REPOSITORY_PORT = new InjectionToken<AuthRepositoryPort>('AUTH_REPOSITORY_PORT', {
    providedIn: 'root',
    factory: () => new FirebaseAuthRepository(),
});

// ============================================
// Input Port Tokens (Use Cases)
// ============================================

/**
 * InjectionToken for the SignInWithEmailPort use case.
 */
export const SIGN_IN_WITH_EMAIL_USECASE = new InjectionToken<SignInWithEmailPort>('SIGN_IN_WITH_EMAIL_USECASE', {
    providedIn: 'root',
    factory: () => new SignInWithEmailUseCase(),
});

/**
 * InjectionToken for the SignInWithGooglePort use case.
 */
export const SIGN_IN_WITH_GOOGLE_USECASE = new InjectionToken<SignInWithGooglePort>('SIGN_IN_WITH_GOOGLE_USECASE', {
    providedIn: 'root',
    factory: () => new SignInWithGoogleUseCase(),
});

/**
 * InjectionToken for the SignUpPort use case.
 */
export const SIGN_UP_USECASE = new InjectionToken<SignUpPort>('SIGN_UP_USECASE', {
    providedIn: 'root',
    factory: () => new SignUpUseCase(),
});

/**
 * InjectionToken for the SignOutPort use case.
 */
export const SIGN_OUT_USECASE = new InjectionToken<SignOutPort>('SIGN_OUT_USECASE', {
    providedIn: 'root',
    factory: () => new SignOutUseCase(),
});

/**
 * InjectionToken for the GetCurrentUserPort use case.
 */
export const GET_CURRENT_USER_USECASE = new InjectionToken<GetCurrentUserPort>('GET_CURRENT_USER_USECASE', {
    providedIn: 'root',
    factory: () => new GetCurrentUserUseCase(),
});

/**
 * InjectionToken for the ObserveAuthStatePort use case.
 */
export const OBSERVE_AUTH_STATE_USECASE = new InjectionToken<ObserveAuthStatePort>('OBSERVE_AUTH_STATE_USECASE', {
    providedIn: 'root',
    factory: () => new ObserveAuthStateUseCase(),
});

// ============================================
// Auth Providers Array
// ============================================

export const authProviders: Provider[] = [
    // {
    //     provide: SIGN_IN_WITH_GOOGLE_USECASE,
    //     useFactory: () => new SignInWithGoogleUseCase(),
    //     deps: [],
    // },
];

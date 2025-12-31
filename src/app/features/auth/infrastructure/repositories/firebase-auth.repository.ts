import { inject } from '@angular/core';
import {
    Auth,
    authState,
    createUserWithEmailAndPassword,
    getIdTokenResult,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
} from '@angular/fire/auth';
import { Result, type ResultType } from '@core/config/result';
import { firstValueFrom, from, type Observable, of, switchMap } from 'rxjs';
import type { AuthException } from '../../domain/exceptions/auth.exceptions';
import { mapFirebaseAuthError } from '../../domain/exceptions/auth.exceptions';
import type { AuthResult } from '../../domain/models/auth-result.model';
import type { Credentials, RegisterCredentials } from '../../domain/models/credentials.model';
import type { AuthRepositoryPort } from '../../domain/ports/out/auth-repository.out';
import { TokenMapper } from '../mappers/token.mapper';
import { UserMapper } from '../mappers/user.mapper';

/**
 * Firebase implementation of the AuthRepositoryPort.
 * Handles all authentication operations using Firebase Auth.
 */
export class FirebaseAuthRepository implements AuthRepositoryPort {
    readonly #auth = inject(Auth);

    /**
     * Authenticates a user with email and password.
     */
    async signInWithEmail(credentials: Credentials): Promise<ResultType<AuthResult, AuthException>> {
        const result = await Result.fromPromise(
            signInWithEmailAndPassword(this.#auth, credentials.email, credentials.password),
            mapFirebaseAuthError,
        );

        if (Result.isFailure(result)) {
            return result;
        }

        return this.#buildAuthResult(result.value.user);
    }

    /**
     * Authenticates a user with Google OAuth.
     */
    async signInWithGoogle(): Promise<ResultType<AuthResult, AuthException>> {
        console.log('signInWithGoogle');
        const provider = new GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        provider.addScope('openid');
        provider.setCustomParameters({
            prompt: 'select_account',
        });

        const result = await Result.fromPromise(signInWithPopup(this.#auth, provider), mapFirebaseAuthError);

        if (Result.isFailure(result)) {
            return result;
        }

        return this.#buildAuthResult(result.value.user);
    }

    /**
     * Registers a new user with email and password.
     */
    async signUp(credentials: RegisterCredentials): Promise<ResultType<AuthResult, AuthException>> {
        const createResult = await Result.fromPromise(
            createUserWithEmailAndPassword(this.#auth, credentials.email, credentials.password),
            mapFirebaseAuthError,
        );

        if (Result.isFailure(createResult)) {
            return createResult;
        }

        const user = createResult.value.user;

        // Update profile with display name
        const updateResult = await Result.fromPromise(updateProfile(user, { displayName: credentials.name }), mapFirebaseAuthError);

        if (Result.isFailure(updateResult)) {
            return updateResult;
        }

        // Reload user to get updated profile
        await user.reload();

        return this.#buildAuthResult(user);
    }

    /**
     * Signs out the current user.
     */
    async signOut(): Promise<ResultType<void, AuthException>> {
        return Result.fromPromise(signOut(this.#auth), mapFirebaseAuthError);
    }

    /**
     * Gets the currently authenticated user.
     */
    async getCurrentUser(): Promise<ResultType<AuthResult | null, AuthException>> {
        const firebaseUser = await firstValueFrom(authState(this.#auth));

        if (!firebaseUser) {
            return Result.success(null);
        }

        return this.#buildAuthResult(firebaseUser);
    }

    /**
     * Observes the authentication state changes.
     * Emits the current auth state whenever it changes (login, logout, token refresh).
     * @returns An Observable that emits AuthResult when authenticated or null when not.
     */
    observeAuthState(): Observable<ResultType<AuthResult | null, AuthException>> {
        return authState(this.#auth).pipe(
            switchMap((firebaseUser) => {
                if (!firebaseUser) {
                    return of(Result.success(null) as ResultType<AuthResult | null, AuthException>);
                }

                return from(this.#buildAuthResult(firebaseUser));
            }),
        );
    }

    /**
     * Builds an AuthResult from a Firebase User.
     */
    async #buildAuthResult(firebaseUser: import('@angular/fire/auth').User): Promise<ResultType<AuthResult, AuthException>> {
        const tokenResult = await Result.fromPromise(getIdTokenResult(firebaseUser), mapFirebaseAuthError);

        if (Result.isFailure(tokenResult)) {
            return tokenResult;
        }

        const user = UserMapper.toEntity(firebaseUser);
        const token = TokenMapper.toEntity(tokenResult.value);

        return Result.success({ user, token });
    }
}

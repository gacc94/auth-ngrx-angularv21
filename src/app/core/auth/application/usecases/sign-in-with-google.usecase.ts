import type { ResultType } from '@core/config/result';
import type { AuthException } from '../../domain/exceptions/auth.exceptions';
import type { AuthResult } from '../../domain/models/auth-result.model';
import type { SignInWithGooglePort } from '../../domain/ports/in/sign-in-with-google.in';
import type { AuthRepositoryPort } from '../../domain/ports/out/auth-repository.out';

/**
 * Use case for signing in with Google.
 */
export class SignInWithGoogleUseCase implements SignInWithGooglePort {
    constructor(private readonly _authRepository: AuthRepositoryPort) {}

    /**
     * Executes sign in with Google OAuth.
     * @returns A Result containing the authentication result or an error.
     */
    execute(): Promise<ResultType<AuthResult, AuthException>> {
        return this._authRepository.signInWithGoogle();
    }
}

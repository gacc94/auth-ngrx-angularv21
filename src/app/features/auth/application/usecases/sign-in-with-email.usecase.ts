import type { ResultType } from '@core/config/result';
import type { AuthException } from '../../domain/exceptions/auth.exceptions';
import type { AuthResult } from '../../domain/models/auth-result.model';
import type { Credentials } from '../../domain/models/credentials.model';
import type { SignInWithEmailPort } from '../../domain/ports/in/sign-in-with-email.in';
import type { AuthRepositoryPort } from '../../domain/ports/out/auth-repository.out';

/**
 * Use case for signing in with email and password.
 */
export class SignInWithEmailUseCase implements SignInWithEmailPort {
    constructor(private readonly _authRepository: AuthRepositoryPort) {}

    /**
     * Executes sign in with email and password.
     * @param credentials - The user's email and password.
     * @returns A Result containing the authentication result or an error.
     */
    execute(credentials: Credentials): Promise<ResultType<AuthResult, AuthException>> {
        return this._authRepository.signInWithEmail(credentials);
    }
}

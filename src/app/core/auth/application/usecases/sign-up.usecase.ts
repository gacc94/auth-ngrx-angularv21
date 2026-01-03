import type { AuthException } from '@app/core/auth/domain/exceptions/auth.exceptions';
import type { AuthResult } from '@app/core/auth/domain/models/auth-result.model';
import type { RegisterCredentials } from '@app/core/auth/domain/models/credentials.model';
import type { SignUpPort } from '@app/core/auth/domain/ports/in/sign-up.in';
import type { AuthRepositoryPort } from '@app/core/auth/domain/ports/out/auth-repository.out';
import type { ResultType } from '@core/config/result';

/**
 * Use case for user sign up.
 */
export class SignUpUseCase implements SignUpPort {
    constructor(private readonly _authRepository: AuthRepositoryPort) {}

    /**
     * Executes user sign up.
     * @param credentials - The registration credentials.
     * @returns A Result containing the authentication result or an error.
     */
    execute(credentials: RegisterCredentials): Promise<ResultType<AuthResult, AuthException>> {
        return this._authRepository.signUp(credentials);
    }
}

import { inject } from '@angular/core';
import type { ResultType } from '@core/config/result';
import type { AuthException } from '../../domain/exceptions/auth.exceptions';
import type { AuthResult } from '../../domain/models/auth-result.model';
import type { RegisterCredentials } from '../../domain/models/credentials.model';
import type { SignUpPort } from '../../domain/ports/in/sign-up.in';
import type { AuthRepositoryPort } from '../../domain/ports/out/auth-repository.out';
import { AUTH_REPOSITORY_PORT } from '../../infrastructure/providers/auth.providers';

/**
 * Use case for user sign up.
 */
export class SignUpUseCase implements SignUpPort {
    readonly #authRepository = inject<AuthRepositoryPort>(AUTH_REPOSITORY_PORT);

    /**
     * Executes user sign up.
     * @param credentials - The registration credentials.
     * @returns A Result containing the authentication result or an error.
     */
    execute(credentials: RegisterCredentials): Promise<ResultType<AuthResult, AuthException>> {
        return this.#authRepository.signUp(credentials);
    }
}

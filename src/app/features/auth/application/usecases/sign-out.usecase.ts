import { inject } from '@angular/core';
import type { ResultType } from '@core/config/result';
import type { AuthException } from '../../domain/exceptions/auth.exceptions';
import type { SignOutPort } from '../../domain/ports/in/sign-out.in';
import type { AuthRepositoryPort } from '../../domain/ports/out/auth-repository.out';
import { AUTH_REPOSITORY_PORT } from '../../infrastructure/providers/auth.providers';

/**
 * Use case for signing out.
 */
export class SignOutUseCase implements SignOutPort {
    readonly #authRepository = inject<AuthRepositoryPort>(AUTH_REPOSITORY_PORT);

    /**
     * Executes user sign out.
     * @returns A Result indicating success or an error.
     */
    execute(): Promise<ResultType<void, AuthException>> {
        return this.#authRepository.signOut();
    }
}

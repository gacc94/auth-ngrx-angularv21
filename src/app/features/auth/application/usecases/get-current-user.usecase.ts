import { inject } from '@angular/core';
import type { ResultType } from '@core/config/result';
import type { AuthException } from '../../domain/exceptions/auth.exceptions';
import type { AuthResult } from '../../domain/models/auth-result.model';
import type { GetCurrentUserPort } from '../../domain/ports/in/get-current-user.in';
import type { AuthRepositoryPort } from '../../domain/ports/out/auth-repository.out';
import { AUTH_REPOSITORY_PORT } from '../../infrastructure/providers/auth.providers';

/**
 * Use case for getting the current authenticated user.
 */
export class GetCurrentUserUseCase implements GetCurrentUserPort {
    readonly #authRepository = inject<AuthRepositoryPort>(AUTH_REPOSITORY_PORT);

    /**
     * Gets the currently authenticated user.
     * @returns A Result containing the authentication result, null if not authenticated, or an error.
     */
    execute(): Promise<ResultType<AuthResult | null, AuthException>> {
        return this.#authRepository.getCurrentUser();
    }
}

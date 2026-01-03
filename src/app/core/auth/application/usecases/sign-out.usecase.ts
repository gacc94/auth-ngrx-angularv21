import type { AuthException } from '@app/core/auth/domain/exceptions/auth.exceptions';
import type { SignOutPort } from '@app/core/auth/domain/ports/in/sign-out.in';
import type { AuthRepositoryPort } from '@app/core/auth/domain/ports/out/auth-repository.out';
import type { ResultType } from '@core/config/result';

/**
 * Use case for signing out.
 */
export class SignOutUseCase implements SignOutPort {
    constructor(private readonly _authRepository: AuthRepositoryPort) {}

    /**
     * Executes user sign out.
     * @returns A Result indicating success or an error.
     */
    execute(): Promise<ResultType<void, AuthException>> {
        return this._authRepository.signOut();
    }
}

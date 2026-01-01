import type { AuthException } from '@auth/domain/exceptions/auth.exceptions';
import type { SignOutPort } from '@auth/domain/ports/in/sign-out.in';
import type { AuthRepositoryPort } from '@auth/domain/ports/out/auth-repository.out';
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

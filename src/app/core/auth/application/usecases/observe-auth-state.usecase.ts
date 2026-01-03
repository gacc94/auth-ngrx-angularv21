import type { ResultType } from '@core/config/result';
import type { Observable } from 'rxjs';
import type { AuthException } from '../../domain/exceptions/auth.exceptions';
import type { AuthResult } from '../../domain/models/auth-result.model';
import type { ObserveAuthStatePort } from '../../domain/ports/in/observe-auth-state.in';
import type { AuthRepositoryPort } from '../../domain/ports/out/auth-repository.out';

/**
 * Use case for observing authentication state changes.
 * Subscribes to Firebase's authState and emits whenever the auth state changes.
 */
export class ObserveAuthStateUseCase implements ObserveAuthStatePort {
    constructor(private readonly _authRepository: AuthRepositoryPort) {}

    /**
     * Observes the authentication state changes.
     * @returns An Observable that emits AuthResult when authenticated or null when not.
     */
    execute(): Observable<ResultType<AuthResult | null, AuthException>> {
        return this._authRepository.observeAuthState();
    }
}

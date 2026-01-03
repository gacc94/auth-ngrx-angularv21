import type { ResultType } from '@core/config/result';
import type { Observable } from 'rxjs';
import type { AuthException } from '../../exceptions/auth.exceptions';
import type { AuthResult } from '../../models/auth-result.model';

/**
 * Input port interface for observing authentication state changes.
 */
export interface ObserveAuthStatePort {
    /**
     * Observes the authentication state changes.
     * Emits the current auth state whenever it changes (login, logout, token refresh).
     * @returns An Observable that emits AuthResult when authenticated or null when not.
     */
    execute(): Observable<ResultType<AuthResult | null, AuthException>>;
}

import type { ResultType } from '@core/config/result';
import type { AuthException } from '../../exceptions/auth.exceptions';
import type { AuthResult } from '../../models/auth-result.model';

/**
 * Input port interface for getting current user use case.
 */
export interface GetCurrentUserPort {
    /**
     * Gets the currently authenticated user.
     * @returns A Result containing the authentication result, null if not authenticated, or an error.
     */
    execute(): Promise<ResultType<AuthResult | null, AuthException>>;
}

import type { ResultType } from '@core/config/result';
import type { AuthException } from '../../exceptions/auth.exceptions';
import type { AuthResult } from '../../models/auth-result.model';

/**
 * Input port interface for sign in with Google use case.
 */
export interface SignInWithGooglePort {
    /**
     * Executes sign in with Google OAuth.
     * @returns A Result containing the authentication result or an error.
     */
    execute(): Promise<ResultType<AuthResult, AuthException>>;
}
